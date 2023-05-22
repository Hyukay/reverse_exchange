
pragma solidity ^0.8.4;

contract REverse {
   struct Property {
       uint256 id;
       address payable owner;
       uint256 price;
       string description;
       bool isAvailable;
   }

   struct Offer {
       uint256 propertyId;
       address payable buyer;
       uint256 offerAmount;
   }

   uint256 public propertyCount;
   mapping(uint256 => Property) public properties;
   mapping(uint256 => Offer[]) public propertyOffers;

   function createProperty(uint256 _price, string memory _description) public {
       propertyCount++;
       properties[propertyCount] = Property(
           propertyCount,
           payable(msg.sender),
           _price,
           _description,
           true
       );
   }

   function placeOffer(uint256 _propertyId) public payable {
       require(properties[_propertyId].isAvailable, "Property is not available");
       require(msg.value > 0, "Offer amount must be greater than zero");
       require(msg.value > properties[_propertyId].price, "Offer must be greater than the current price");


       Offer memory newOffer = Offer(_propertyId, payable(msg.sender), msg.value);
       propertyOffers[_propertyId].push(newOffer);
   }


   function acceptOffer(uint256 _propertyId, uint256 _offerIndex) public {
       require(properties[_propertyId].owner == msg.sender, "Only the property owner can accept offers");
       require(_offerIndex < propertyOffers[_propertyId].length, "Invalid offer index");


       Offer memory acceptedOffer = propertyOffers[_propertyId][_offerIndex];
       properties[_propertyId].owner.transfer(acceptedOffer.offerAmount);
       properties[_propertyId].isAvailable = false;
       properties[_propertyId].owner = acceptedOffer.buyer;
   }
}




