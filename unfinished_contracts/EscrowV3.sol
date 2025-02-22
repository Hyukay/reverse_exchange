// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@thirdweb-dev/contracts/marketplace/entrypoint/MarketplaceV3.sol';
abstract contract Escrow_v3 is MarketplaceV3 {

    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");

    address public realEstateAddress;

    enum SaleStatus { Open, WaitingForApproval, Completed }
    
    mapping(uint256 => bool) public inspections;


    // Adding permissionned roles

    modifier onlyNotaryRole() {
        require(PermissionsLogic(address(this)).hasRoleWithSwitch(NOTARY_ROLE, _msgSender()), "!NOTARY_ROLE");
        _;
    }
    modifier onlyInspectorRole() {
        require(PermissionsLogic(address(this)).hasRoleWithSwitch(INSPECTOR_ROLE, _msgSender()), "!INSPECTOR_ROLE");
        _;
    }

    constructor(address _realEstateAddress) {
        realEstateAddress = _realEstateAddress;
        grantRole(ASSET_ROLE, _realEstateAddress);
    }

    function updateInspectionStatus(uint256 _propertyID, bool _status) onlyInspectorRole public {
        inspections[_propertyID] = _status;
    }

    function acceptOffer(
    uint256 _listingId,
    address _offeror,
    address _currency,
    uint256 _pricePerToken
    ) external override nonReentrant onlyAuctionCreator(_auctionId) onlyExistingAuction(_auctionId) {

        Offer memory targetOffer = offers[_listingId][_offeror];
        Listing memory targetListing = listings[_listingId];

        require(_currency == targetOffer.currency && _pricePerToken == targetOffer.pricePerToken, "!PRICE");
        require(targetOffer.expirationTimestamp > block.timestamp, "EXPIRED");

        delete offers[_listingId][_offeror];

        // Store the accepted offer
        acceptedOffers[_listingId] = targetOffer;

        emit OfferAccepted(_listingId, _offeror);
    }


    /// @dev Approves a sale, changing its status to 'WaitingForApproval'.
    function approveSale(uint256 _listingId) external onlyNotaryRole {
        Offer memory acceptedOffer = acceptedOffers[_listingId];
        require(acceptedOffer.offeror != address(0), "No accepted offer");
        require(inspections[_listingId] == true, "Inspection not done");

        Listing memory targetListing = listings[_listingId];

        // Delete the accepted offer
        delete acceptedOffers[_listingId];

        // Update listing's status to 'WaitingForApproval'.
        targetListing.saleStatus = SaleStatus.WaitingForApproval;
        listings[_listingId] = targetListing;
    }


  /// @dev Processes an incoming bid in an auction.
    function _handleBid(Listing memory _targetListing, Offer memory _incomingBid) override internal {
        
        Offer memory currentWinningBid = winningBid[_targetListing.listingId];
        uint256 currentOfferAmount = currentWinningBid.pricePerToken * currentWinningBid.quantityWanted;
        uint256 incomingOfferAmount = _incomingBid.pricePerToken * _incomingBid.quantityWanted;
        address _nativeTokenWrapper = nativeTokenWrapper;

        // Mark auction as waiting for approval if there's a buyout price and incoming offer amount is buyout price.
        if (
            _targetListing.buyoutPricePerToken > 0 &&
            incomingOfferAmount >= _targetListing.buyoutPricePerToken * _targetListing.quantity
        ) {
            _targetListing.saleStatus = SaleStatus.WaitingForApproval;
            listings[_targetListing.listingId] = _targetListing;
        } else {
            /**
             *      If there's an exisitng winning bid, incoming bid amount must be bid buffer % greater.
             *      Else, bid amount must be at least as great as reserve price
             */
            require(
                isNewWinningBid(
                    _targetListing.reservePricePerToken * _targetListing.quantity,
                    currentOfferAmount,
                    incomingOfferAmount
                ),
                "not winning bid."
            );

            // Update the winning bid and listing's end time before external contract calls.
            winningBid[_targetListing.listingId] = _incomingBid;

            if (_targetListing.endTime - block.timestamp <= timeBuffer) {
                _targetListing.endTime += timeBuffer;
                listings[_targetListing.listingId] = _targetListing;
            }
        }

        // Payout previous highest bid.
        if (currentWinningBid.offeror != address(0) && currentOfferAmount > 0) {
            CurrencyTransferLib.transferCurrencyWithWrapper(
                _targetListing.currency,
                address(this),
                currentWinningBid.offeror,
                currentOfferAmount,
                _nativeTokenWrapper
            );
        }

        // Collect incoming bid
        CurrencyTransferLib.transferCurrencyWithWrapper(
            _targetListing.currency,
            _incomingBid.offeror,
            address(this),
            incomingOfferAmount,
            _nativeTokenWrapper
        );

        emit NewOffer(
            _targetListing.listingId,
            _incomingBid.offeror,
            _targetListing.listingType,
            _incomingBid.quantityWanted,
            _incomingBid.pricePerToken * _incomingBid.quantityWanted,
            _incomingBid.currency
        );
    }


    /// @dev Closes an auction for the winning bidder; changes status to 'waiting for approval'.
    function _closeAuctionForBidder(Listing memory _targetListing, Offer memory _winningBid) internal {
        uint256 quantityToSend = _winningBid.quantityWanted;

        _targetListing.endTime = block.timestamp;
        _winningBid.quantityWanted = 0;

        winningBid[_targetListing.listingId] = _winningBid;
        listings[_targetListing.listingId] = _targetListing;


        _targetListing.saleStatus = SaleStatus.WaitingForApproval;

        emit AuctionClosed(
            _targetListing.listingId,
            _msgSender(),
            false,
            _targetListing.tokenOwner,
            _winningBid.offeror
        );
    }

    function collectAuctionPayout(uint256 _auctionId) override external nonReentrant onlyNotary{

            EnglishAuctionsStorage.Data storage data = EnglishAuctionsStorage.englishAuctionsStorage();

            require(!data.payoutStatus[_auctionId].paidOutBidAmount, "Marketplace: payout already completed.");
            data.payoutStatus[_auctionId].paidOutBidAmount = true;

            Auction memory _targetAuction = data.auctions[_auctionId];
            Bid memory _winningBid = data.winningBid[_auctionId];

            require(_targetAuction.status != IEnglishAuctions.Status.CANCELLED, "Marketplace: invalid auction.");
            require(_targetAuction.endTimestamp <= block.timestamp, "Marketplace: auction still active.");
            require(_winningBid.bidder != address(0), "Marketplace: no bids were made.");
            require(inspections[targetListing.tokenId] == true, "Inspector has not approved this property.");

            _closeAuctionForAuctionCreator(_targetAuction, _winningBid);

            if (_targetAuction.status != IEnglishAuctions.Status.COMPLETED) {
                data.auctions[_auctionId].status = IEnglishAuctions.Status.COMPLETED;
            }
        }
    
}
