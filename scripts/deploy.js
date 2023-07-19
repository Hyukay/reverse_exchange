const hre = require("hardhat");

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  

  // Setup accounts
  const REverseAdmin = await hre.ethers.getSigner()
  // Deploy Real Estate
  console.log(`REverse Admin connected!: ${REverseAdmin.address}`)

  console.log('REverse Admin attempting to deploy Real Estate ERC721 Contract...')
  const RealEstate = await hre.ethers.getContractFactory('RealEstate')
  const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

  console.log(`Deployed successfully Real Estate Contract at: ${realEstate.address}`)

  console.log('REverse Admin attempting to fetch Escrow contract...')
  // Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory('Escrow_v2')
  console.log('REverse Admin attempting to deploy Escrow Contract...')
  console.log('REverse Admin attempting to link Escrow Contract and Real Estate Contract...')
  const escrow = await Escrow.deploy(
    realEstate.address,
    REverseAdmin.address,
  )

  await escrow.deployed()

  console.log(`Deployed successfully Escrow Contract at: ${escrow.address}`)

  console.log(`Finished.`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});