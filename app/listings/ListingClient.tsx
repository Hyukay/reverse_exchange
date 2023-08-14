'use client'
import axios from "axios";
import { useEffect, useCallback, useState, useMemo} from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeUser, } from "@/app/types";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listing/ListingHead";
import ListingSellerProp from "@/app/components/listing/ListingSellerProp";
import ListingInfo from "@/app/components/listing/ListingInfo";
import { MediaRenderer } from "@thirdweb-dev/react";
import NotaryView from "../components/listing/ListingNotaryProp";
import ListingBuy from "../components/listing/ListingBuyProp";
import ListingInspector from "../components/listing/ListingInspectorProp";

import Button from "../components/Button";
import { useContract,useContractRead, useNFT, useContractWrite, useAddress, useConnectionStatus, useValidEnglishAuctions } from '@thirdweb-dev/react';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "../libs/constant";
import { is } from "date-fns/locale";



interface ListingClientProps {
  listing: SafeListing & {
    seller: SafeUser;
    isApproved: boolean;
    isAvailable: boolean;
    isInspected: boolean;
  };
  currentUser?: SafeUser | null ;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
}) => {

  const category = useMemo(() => {
    return categories.find((items) => 
     items.label === listing.category);
 }, [listing.category]);
  
  const connectionStatus = useConnectionStatus();
  console.log('connectionStatus', connectionStatus)
  const account = useAddress();
  
  const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
  const { contract: escrow } = useContract(ESCROW_ADDRESS, "marketplace-v3");

  

  const { data: nft, error: nftError } = useNFT(realEstate,listing.tokenId);
  const realTokenId = useMemo(() => nft?.metadata.id, [nft]);
  const { data: owner } = useContractRead(realEstate, 'ownerOf', [listing.tokenId]);


  const { data: auctionListing, isLoading: loadingValidAuction, isError: errorValidAuction } =
    useValidEnglishAuctions(escrow, {
      tokenContract: REAL_ESTATE_ADDRESS,
      tokenId: realTokenId,
    });

  const renderComponentBasedOnRole = () => {
    if(!nft && listing.tokenId) {
      return <div>Loading...</div>
    }
    switch(currentUser?.role) {
      case 'inspector':
        return <ListingInspector tokenId={listing.tokenId} />;
      case 'notary':
        return <NotaryView tokenId={listing.tokenId} />;
      default:
        return currentUser?.id === listing.seller.id || owner == account || auctionListing?.[0]?.creatorAddress == account
          ? <ListingSellerProp 
              account={account}
              id = {listing.id}
              tokenId={listing.tokenId}
              ipfsUri={listing.ipfsUri}
              price={listing.price}
              nft = {nft}
              realTokenId={realTokenId}
            />
          : <ListingBuy 
          account={account}
          id = {listing.id}
          tokenId={listing.tokenId}
          nft={nft}
          />;
    }
  }

  return ( 
    <Container>
      <div 
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            image={listing.image}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.seller} 
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              isAvailable={listing.isAvailable}
              isApproved={listing.isApproved}
              isInspected={listing.isInspected}
              realTokenId={realTokenId}
            />
            <div 
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >

              {renderComponentBasedOnRole()}

            </div>
          </div>
        </div>
      </div>
    </Container>
   );
}


export default ListingClient;