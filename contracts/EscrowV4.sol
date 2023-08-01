// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import '@thirdweb-dev/contracts/marketplace/entrypoint/MarketplaceV3.sol';
import './EnglishAuction/EnglishAuctionLogic.sol';
import '@thirdweb-dev/contracts/extension/plugin/PermissionsEnumerableLogic.sol';

 
abstract contract Escrow_v4 is MarketplaceV3, EnglishAuctionLogic {
    


    constructor(address _realEstateAddress) MarketplaceV3(address(0), address(0)) EnglishAuctionLogic() {

        IPermissions(this).grantRole(ASSET_ROLE, _realEstateAddress);
    }

}
