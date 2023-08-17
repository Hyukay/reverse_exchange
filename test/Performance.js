const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("Deployment Cost Comparison", function () {

  let reverseAdmin, reverseForwarder, saleRecipient;

  before(async function() {
    [reverseAdmin, reverseForwarder, saleRecipient] = await ethers.getSigners();
  });

  it("Compare deployment costs for RealEstate721", async function () {


    const name = "RealEstate721";
    const symbol = "REV721";
    const contractURI = "ipfs://QmW2tTbiTjZLwUzQ6VPKyd2tKi5dJwvRRVZvvng8tQt1oQ/0";
    const trustedForwarders = [reverseForwarder.address];
    const royaltyRecipient = reverseAdmin.address;
    const royaltyBps = 500; 
    const platformFeeBps = 250;
    const platformFeeRecipient = reverseAdmin.address;

    const RealEstate721 = await ethers.getContractFactory("RealEstate721");
    console.log("Deploying RealEstate721...");
  
    const realEstate721 = await upgrades.deployProxy(RealEstate721, [  
        reverseAdmin.address,
        name,
        symbol,
        contractURI,
        trustedForwarders,
        saleRecipient.address,
        royaltyRecipient,
        royaltyBps,
        platformFeeBps,
        platformFeeRecipient
    ], { gasLimit: 5000000 });

    const realEstate721DeployTxHash = realEstate721.deployTransaction.hash;
    const receipt = await ethers.provider.getTransactionReceipt(realEstate721DeployTxHash);


    
    const Escrow_v2 = await ethers.getContractFactory("Escrow_v2");
    const escrowDeployTx = await Escrow_v2.getDeployTransaction(); 
    const escrowGasEstimate = await ethers.provider.estimateGas(escrowDeployTx);

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplaceInstance = await upgrades.deployProxy(Marketplace, [
        reverseAdmin.address,
        contractURI,
        trustedForwarders,
        platformFeeRecipient,
        platformFeeBps
    ]);
    
    const marketplaceDeployTxHash = marketplaceInstance.deployTransaction.hash;
    const marketplaceReceipt = await ethers.provider.getTransactionReceipt(marketplaceDeployTxHash);
    
    console.log(`Gas used to deploy RealEstate721: ${receipt.gasUsed.toString()}`);
    console.log(`Estimated gas for Escrow_v2 deployment: ${escrowGasEstimate.toString()}`);
    console.log(`Gas used to deploy Marketplace: ${marketplaceReceipt.gasUsed.toString()}`);
  });
});
