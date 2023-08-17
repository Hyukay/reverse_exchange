const hre = require("hardhat");

async function main() {
  
  
  const [reverseAdmin,reverseForwarder,saleRecipient] = await hre.ethers.getSigners();

  const name = "RealEstate721";
  const symbol = "REV721";
  const contractURI = "ipfs://QmW2tTbiTjZLwUzQ6VPKyd2tKi5dJwvRRVZvvng8tQt1oQ/0";
  const trustedForwarders = [reverseForwarder]; // Transaction is forwarded to REverse admin so the user doesn't have to pay gas
  const royaltyRecipient = reverseAdmin
  const royaltyBps = 500;  // 5% royalty
  const platformFeeBps = 250;  // 2.5% platform fee
  const platformFeeRecipient = reverseAdmin
 

  console.log("Deploying contracts with the account:", deployer.address);

  const RealEstate721 = await hre.ethers.getContractFactory("RealEstate721");
  const realEstate = await RealEstate721.deploy(
    reverseAdmin,
    name,
    symbol,
    contractURI,
    trustedForwarders,
    saleRecipient,
    royaltyRecipient,
    royaltyBps,
    platformFeeBps,
    platformFeeRecipient
  )
  await realEstate.deployed();

  const Escrow_v2 = await hre.ethers.getContractFactory("Escrow_v2");
  const escrow = await Escrow_v2.deploy(realEstate.address);
  await escrow.deployed();

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    reverseAdmin,
    contractURI,
    trustedForwarders,
    platformFeeRecipient,
    platformFeeBps
  );
  await marketplace.deployed();

  console.log("RealEstate721 deployed to:", token.address);
  console.log("Escrow_v2 deployed to:", escrow.address);
  console.log("Marketplace deployed to:", marketplace.address);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
