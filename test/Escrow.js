const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow_v3', () => {

    let buyer, seller, inspector;
    let realEstate, escrow;

    beforeEach(async () => {
        // Setup accounts
        [seller, buyer, inspector] = await ethers.getSigners()
        
        // Deploy Real Estate
        const RealEstate = await ethers.getContractFactory('RealEstate')
        realEstate = await RealEstate.deploy()

        // Mint 
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
        await transaction.wait()

        // Deploy Escrow
        const Escrow_v2 = await ethers.getContractFactory('Escrow_v3')
        escrow = await Escrow_v2.deploy(realEstate.address)

        // Approve Property
        transaction = await realEstate.connect(seller).approve(escrow.address, 1)
        await transaction.wait()

        // List Property
        transaction = await escrow.connect(seller).list(1, tokens(10))
        await transaction.wait()
    })

    describe('Deployment', () => {
        it('Returns NFT address', async () => {
            const result = await escrow.realEstateAddress()
            expect(result).to.be.equal(realEstate.address)
        })
    })

    describe('Listing', () => {
        it('Updates as listed', async () => {
            const result = await escrow.properties(1)
            expect(result.seller).to.be.equal(seller.address)
            expect(result.buyer).to.be.equal(ethers.constants.AddressZero)
            expect(result.price).to.be.equal(tokens(10))
        })

        it('Updates ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })
    })

    describe('Making an Offer', () => {
        beforeEach(async () => {
            const transaction = await escrow.connect(buyer).makeOffer(1, { value: tokens(10) })
            await transaction.wait()
        })

        it('Updates buyer', async () => {
            const property = await escrow.properties(1)
            expect(property.buyer).to.be.equal(buyer.address)
        })

        it('Updates contract balance', async () => {
            expect(await ethers.provider.getBalance(escrow.address)).to.be.equal(tokens(10))
        })
    })

    describe('Inspection', () => {
        beforeEach(async () => {
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()
        })

        it('Updates inspection status', async () => {
            const result = await escrow.inspections(1)
            expect(result).to.be.equal(true)
        })
    })

    describe('Sale', () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).makeOffer(1, { value: tokens(10) })
            await transaction.wait()

            transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()

            transaction = await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })

        it('Updates ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
        })

        it('Updates balance', async () => {
            expect(await ethers.provider.getBalance(escrow.address)).to.be.equal(0)
        })

        it('Updates property listing', async () => {
            const property = await escrow.properties(1)
            expect(property.seller).to.be.equal(ethers.constants.AddressZero)
            expect(property.buyer).to.be.equal(ethers.constants.AddressZero)
            expect(property.price).to.be.equal(0)
        })

        it('Updates inspection status', async () => {
            const result = await escrow.inspections(1)
            expect(result).to.be.false
        })
    })
})
