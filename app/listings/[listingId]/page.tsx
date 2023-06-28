
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ethers from "ethers";
import hre from "hardhat";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { useNetwork } from "wagmi";
// getsigners from wagmi
import { Web3Modal, Web3Button } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig, sepolia } from 'wagmi';
import RealEstate from 'artifacts/contracts/RealEstate.sol/RealEstate.json'
import WalletConnect from "@/app/components/navbar/WalletConnect";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "../ListingClient";
import { Address, useContractRead } from "wagmi";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import WagmiProvider from "@/providers/wagmi";
import  RootProvider  from '../../providers'


interface IParams {
  listingId?: string;

}



const ListingPage = async ({ params }: { params: IParams }) => {

  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  

  


  /*const {data: escrow} = useContractRead({
    abi: escrowContract.abi,
    address:config.contracts.Escrow.address as Address,
  })

  const { data: totalSupply } = useContractRead({
    abi: RealEstate.abi,
    address: config.contracts.RealEstate.address as Address,
    functionName: 'totalSupply',
    chainId: sepolia.id
  })*/
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState/>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <RootProvider>
      <ListingClient
        listing={listing}
        currentUser={currentUser}
      />
      </RootProvider>
    </ClientOnly>
  );
  

/*
  // if the user is the inspector show the inspector page
  else if (currentUser?.role === 'inspector') {
    return (
      <ClientOnly>
        {/*<ListingInspector
          listing={listing}
          currentUser={currentUser}
        />}
      </ClientOnly>
    );
  }

  // if the user is the seller show the seller page
  else if (currentUser?.id === listing?.sellerId) {
      return (
        <ClientOnly>{/*}
          <ListingSeller
            listing={listing}
            currentUser={currentUser}
          />
        }
        </ClientOnly>
      );
      }

  // if the user is the buyer show the buyer page
  else if (currentUser?.id === listing?.buyerId) {
    
      return (
        <ClientOnly>
          <ListingClient
            listing={listing}
            currentUser={currentUser}
          />
        </ClientOnly>
      );
  }

  else {
    return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        currentUser={currentUser}
      />
    </ClientOnly>
  );*/
  }


export default ListingPage;

