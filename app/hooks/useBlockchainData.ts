'use client'


import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3Modal } from '@web3modal/react'
import Escrow from '../../artifacts/contracts/Escrow.sol/Escrow.json'
import RealEstate from '../../artifacts/contracts/RealEstate.sol/RealEstate.json'
import config from '../../config.json'
import fetcher from '../libs/fetcher'
import { Address, useAccount, useContractReads} from 'wagmi'
import { ethereumClient } from '../components/modals/WalletConnectModal'
import { useContractWrite, useContractRead } from 'wagmi'
import { EthereumClient } from '@web3modal/ethereum'
import { Chain } from 'wagmi'
import { sepolia } from 'wagmi'

export default function useBlockchainData() {

    const [escrow, setEscrow] = useState<any>()
    const { address, isConnecting, isDisconnected } = useAccount()

    const { data: totalSupply } = useContractRead({
        abi: RealEstate.abi,
        address: config.contracts.RealEstate.address as Address,
        functionName: 'totalSupply',
        chainId: sepolia.id
    })

    const { data: escrows } = useContractRead({

        abi: Escrow.abi,
        address: config.contracts.Escrow.address as Address,
    })  
    setEscrow(escrows)




    const loadBlockchainData = async () => {
        
        const network = await ethereumClient.getNetwork()
        
   
       

        console.log('totalSupply: ', totalSupply)


        const homes = []

        for (let i = 1; i <= totalSupply(); i++) {
            const {uri} = await RealEstate.tokenURI(i)
            const metadata = fetcher(uri)
            homes.push(metadata)
         } 
       
        const account = await provider.listAccounts()
        setAccount(account[0])
    }

    
    useEffect(() => {
        loadBlockchainData()
    }, [])


         return{ provider, escrow, account, setAccount }
}