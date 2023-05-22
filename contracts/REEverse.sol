pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract REverse is ERC1155 {

    struct Property {

        uint256 id;
        address payable owner;
        uint256 price;
        string description;
        bool isAvailable;
    }

    uint256 public propertyCount;
    mapping(uint256 => Property) public properties;

    constructor() ERC1155("https://your-metadata-uri/") {}

    function createProperty(uint256 _price, string memory _description) public {
        propertyCount++;
        _mint(msg.sender, propertyCount, 1, "");
        properties[propertyCount] = Property(
            propertyCount,
            payable(msg.sender),
            _price,
            _description,
            true
        );
    }

    function transferProperty(uint256 _propertyId, address _to) public {
        require(msg.sender == properties[_propertyId].owner, "Only the property owner can transfer the property");
        _safeTransferFrom(msg.sender, _to, _propertyId, 1, "");
        properties[_propertyId].owner = payable(_to);
    }
}
