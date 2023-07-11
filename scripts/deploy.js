const hre = require("hardhat");

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  

  // Setup accounts
  const [seller] = await hre.ethers.getSigners()
  // Deploy Real Estate
  const RealEstate = await hre.ethers.getContractFactory('RealEstate')
  const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

  // Show signers 
  
  console.log(`Seller: ${seller.address}`)

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`)
  console.log(`Minting 3 properties...\n`)

  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`)
    await transaction.wait()
  }

  // Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory('Escrow_v2')
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
  )

  await escrow.deployed()

  console.log(`Deployed Escrow Contract at: ${escrow.address}`)

  console.log(`Finished.`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});