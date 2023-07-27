// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Escrow_v3 is ReentrancyGuard {

    address public realEstateAddress;

    struct Property {
        address payable seller;
        address payable buyer;
        uint256 price;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => bool) public inspections;
    
    constructor(address _realEstateAddress) {
        realEstateAddress = _realEstateAddress;
    }

    function list(uint256 _propertyID, uint256 _price) public {

        require(IERC721(realEstateAddress).ownerOf(_propertyID) == msg.sender, "Only the owner of the token can list it for sale");
        IERC721(realEstateAddress).transferFrom(msg.sender, address(this), _propertyID);
        properties[_propertyID] = Property(payable(msg.sender), payable(address(0)), _price);
    }

        // create function to make an offer on a property
    function makeOffer(uint256 _propertyID, uint256 _priceOffer) public payable nonReentrant {
        require(properties[_propertyID].seller != address(0), "Property is not listed for sale"); // require that the property is listed for sale
        require(_priceOffer >= properties[_propertyID].price * 20 / 100, "The offer price has to be at least 20% of the asked price"); // require that the offer price is at least 20% of the asked price
        
        properties[_propertyID].buyer = payable(msg.sender); // set the buyer of the property to the sender
    }

    function completePayment(uint256 _propertyID) public payable nonReentrant {
        require(properties[_propertyID].seller != address(0), "Property is not listed for sale");
        require(properties[_propertyID].buyer == msg.sender, "Only the buyer can call this method");
        //verify that the sum of the msg.value added to the balance of the contract is equal to the price of the property
        require(address(this).balance >= properties[_propertyID].price, "The price is not correct");
        }

    function updateInspectionStatus(uint256 _propertyID, bool _status) public {
        // TODO: Add condition to allow only inspector to call this function
        inspections[_propertyID] = _status;
    }

    function updatePrice(uint256 _propertyID, uint256 _newPrice) public {
        require(properties[_propertyID].seller == msg.sender, "Only the seller can update the price");
        properties[_propertyID].price = _newPrice;
    }

    function finalizeSale(uint256 _propertyID) public nonReentrant {
        require(properties[_propertyID].seller != address(0), "Property is not listed for sale");
        require(inspections[_propertyID], "Property has not passed inspection");
        require(address(this).balance >= properties[_propertyID].price, "Price is not correct");
        
        Property memory property = properties[_propertyID];
        property.seller.transfer(property.price);
        IERC721(realEstateAddress).transferFrom(address(this), property.buyer, _propertyID);

        delete properties[_propertyID];
        delete inspections[_propertyID];
    }
}
