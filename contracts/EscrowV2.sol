// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Escrow_v2 is ReentrancyGuard {

    address public realEstateAddress;
    address public admin;

    struct Property {
        address payable seller;
        address payable buyer;
        uint256 price;
    }

    modifier onlyInspector() {
        require(inspectors[msg.sender], "Only inspectors can call this function");
        _;
    }

    modifier onlyAdmin(){
       
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
   

    mapping(address => bool) public inspectors;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => bool) public inspections;
    

    constructor(address _realEstateAddress) {
        realEstateAddress = _realEstateAddress;
    }
    
     // function to approve inspector address
    function approveInspector(address _inspectorAddress) onlyAdmin public {
        inspectors[_inspectorAddress] = true;
    }

    function list(uint256 _propertyID, uint256 _price) public {
        require(IERC721(realEstateAddress).ownerOf(_propertyID) == msg.sender, "Only the owner of the token can list it for sale");
        IERC721(realEstateAddress).transferFrom(msg.sender, address(this), _propertyID);
        properties[_propertyID] = Property(payable(msg.sender), payable(address(0)), _price);
    }

    function makeOffer(uint256 _propertyID) public payable nonReentrant {
        require(properties[_propertyID].seller != address(0), "Property is not listed for sale");
        require(msg.value == properties[_propertyID].price, "Incorrect amount");
        properties[_propertyID].buyer = payable(msg.sender);
    }

    function updateInspectionStatus(uint256 _propertyID, bool _status) public onlyInspector {
        
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
