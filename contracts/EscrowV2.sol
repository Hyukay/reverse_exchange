//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.1;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow_v2 {

    address public realEstateAddress;
    address payable public seller;
    address public inspector;
    address public notary;


    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    modifier onlyNotary() {
        require(msg.sender == notary, "Only notary can call this method");
        _;
    }


    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public price;
    mapping(uint256 => uint256) public downPaymentAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;


    constructor(
        address _realEstateAddress,
        address payable _seller
    ) {
        realEstateAddress = _realEstateAddress;
        seller = _seller;
    }


    function setInspector(address _inspector) public onlySeller {
        inspector = _inspector;
    }

    function setNotary(address _notary) public onlySeller {
        notary = _notary;
    }

    // Function to list a real estate for sale
    function list(
        uint256 _realEstateID,
        uint256 _price,
        uint256 _downPaymentAmount
    ) public payable onlySeller {
        // Transfer NFT from seller to this contract
        IERC721(realEstateAddress).transferFrom(msg.sender, address(this), _realEstateID);

        isListed[_realEstateID] = true;
        price[_realEstateID] = _price;
        downPaymentAmount[_realEstateID] = _downPaymentAmount;
    }

    // function to make an offer on a real estate
    function makeOffer(uint256 _realEstateID) public payable {
        require(isListed[_realEstateID], "Real estate is not listed for sale");
        require(msg.value == downPaymentAmount[_realEstateID], "Down payment amount is not correct");

        buyer[_realEstateID] = msg.sender;
    }

    // function to update inspection status
    function updateInspectionStatus(uint256 _realEstateID, bool _inspectionPassed) public onlyInspector {
        inspectionPassed[_realEstateID] = _inspectionPassed;
    }

    // function to approve the sale of a real estate
    function approveSale(uint256 _realEstateID) public onlyNotary {
        approval[_realEstateID][notary] = true;
    }

    // function to complete payment
    function completePayment(uint256 _realEstateID) public payable {
        require(isListed[_realEstateID], "Real estate is not listed for sale");
        require(inspectionPassed[_realEstateID], "Real estate has not passed inspection");
        require(approval[_realEstateID][notary], "Real estate has not been approved by notary");
        require(msg.value >= price[_realEstateID] - downPaymentAmount[_realEstateID], "Price is not correct");

        // transfer the funds to the contract
        payable(address(this)).transfer(msg.value);
    }

    //function to cancel sale
     function cancelSale(uint256 _propertyID) public {
        if (inspectionPassed[_propertyID] == false) {
            payable(buyer[_propertyID]).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //function finalize sale
    function finalizeSale(uint256 _propertyID) public onlyNotary {
        require(isListed[_propertyID], "Real estate is not listed for sale");
        require(inspectionPassed[_propertyID], "Real estate has not passed inspection");
        require(approval[_propertyID][seller]);
        require(approval[_propertyID][notary], "Real estate has not been approved by notary");
        require(address(this).balance >= price[_propertyID], "Price is not correct");

        isListed[_propertyID] = false;

        (bool success, ) = seller.call{value: address(this).balance}(
            ""
            );
           
        require(success);
         
        IERC721(realEstateAddress).transferFrom(address(this), buyer[_propertyID], _propertyID);

    }







}