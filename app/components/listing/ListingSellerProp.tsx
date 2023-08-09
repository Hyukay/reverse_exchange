'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress,  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,
  useValidEnglishAuctions,

} from '@thirdweb-dev/react';
import React, { useState, useCallback, useEffect, useMemo } from "react";
import axios from 'axios';
import Loader from '../Loader';
import Heading from '../Heading';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import formatNumber from '@/app/libs/formatNumber';
import { NFT as NFTType } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import Input from "../inputs/Input";
import ListingUpdateView from './listingUpdate/ListingUpdateView';
import ListingAuctionView from './ListingAuctionView';
import ListingMintView from './ListingMintView';
import ListingDirectView from './ListingDirectView';
import Tabs from '../Tabs';



interface sellerProps {
  account: string | undefined
  id: string;
  tokenId: number | null;
  price: number;
  ipfsUri: string | null;
  nft?: NFTType | undefined;
  realTokenId: string | undefined;

}


const ListingSellerProp: React.FC<sellerProps> = ({id, tokenId, price, ipfsUri, nft, realTokenId}) => {

    // Connect to marketplace contract
    const { contract: escrow } = useContract(
      ESCROW_ADDRESS,
      "marketplace-v3"
    ); 

    

    const { contract: noHooksEscrow} = useContract(ESCROW_ADDRESS)
      
    // useContract is a React hook that returns an object with the contract key.
    // The value of the contract key is an instance of an REAL_ESTATE_ADDRESS on the blockchain.
    // This instance is created from the contract address (REAL_ESTATE_ADDRESS)
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);

   

    
    const { data: directListing, isLoading: loadingValidDirect, isError: errorValidDirect } =
      useValidDirectListings(escrow, {
        tokenContract: REAL_ESTATE_ADDRESS,
        tokenId: realTokenId,
      });

      const { data: auctionListing, isLoading: loadingValidAuction, isError: errorValidAuction } =
      useValidEnglishAuctions(escrow, {
        tokenContract: REAL_ESTATE_ADDRESS,
        tokenId: realTokenId,
      });

  const listingId = useMemo(() => directListing?.[0]?.id, [directListing]);
  const auctionId = useMemo(() => auctionListing?.[0]?.id, [auctionListing]);
    
  
  const [hasLoaded, setHasLoaded] = useState(false);
   

  // Then, in your useEffect
  useEffect(() => {
    if (realTokenId) {
      setHasLoaded(true);
    }
    if (errorValidDirect || errorValidAuction) {
      // handle the error (e.g., show a message to the user)
      console.log(errorValidDirect);
      console.log(errorValidAuction);
    }
  }, [nft, realTokenId, errorValidDirect, errorValidAuction]);


let bodyContent;
if (!hasLoaded || realTokenId == undefined) {
  bodyContent = <div>Loading...<Loader /></div>;
}
else if (!tokenId) {
  bodyContent = (
    <ListingMintView
    id={id}
    tokenId={tokenId}
    ipfsUri={ipfsUri}
    nft={nft}
    realEstate={realEstate}
    ></ListingMintView>
  );
} 
else if (realTokenId && (auctionId || listingId)) {
  bodyContent = (
    <ListingUpdateView
      realTokenId={realTokenId}
      nft={nft}
      escrow={escrow}
      listingId={listingId}
      auctionId={auctionId}
    ></ListingUpdateView>
  )
}
else if (tokenId && (!listingId || !auctionId)) {
  bodyContent = (
  <>
   <Tabs labels={["Direct", "Auction"]} >
      <ListingDirectView
        tokenId={tokenId}
        nft={nft}
        escrow = {escrow}
      ></ListingDirectView>

          <ListingAuctionView
            tokenId={tokenId}
            nft={nft}
            escrow = {escrow}
          ></ListingAuctionView>
        </Tabs>
    </>
    );
}

  return (
    <div>
        {bodyContent}
    </div>
)
  }

export default ListingSellerProp
