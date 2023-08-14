'use client'

// External Libraries
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// Third-party hooks and utilities
import {
  useContractWrite, 
  useContractRead, 
  useContract, 
  Web3Button, 
  useAddress,  
  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,
  useValidEnglishAuctions,
  useEnglishAuction,
  useBidBuffer,
  useWinningBid
} from '@thirdweb-dev/react';
import { NFT as NFTType, MarketplaceV3 } from '@thirdweb-dev/sdk';

// Local Components and Hooks
import Loader from '../../../Loader';
import Heading from '../../../Heading';
import Input from "../../../inputs/Input";
import ListingUpdateDirect from './ListingUpdateDirect';
import EmptyState from '../../../EmptyState';
import Button from '../../../Button';
import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';

// Utilities and Constants
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import  addressSlicer  from '@/app/libs/addressSlicer';
import formatDate from "@/app/libs/secondsToDate";
import formatNumber from '@/app/libs/formatNumber';
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";

interface ListingUpdateAuctionProp {
  auctionId: string | undefined;
  realTokenId: string | undefined;
  nft?: NFTType;
  escrow: MarketplaceV3 | undefined;
}


  
const ListingUpdateAuction: React.FC<ListingUpdateAuctionProp> = ({ auctionId, realTokenId, nft, escrow }) => {
    
    
    const { data: englishAuction, isLoading, error } = useEnglishAuction(escrow, auctionId);

    const {contract : noHooksEscrow} = useContract(ESCROW_ADDRESS);

    const { data: highestBid, isLoading: isHighestBidLoading, error: isHighestBidError } = useContractRead(noHooksEscrow, "getWinningBid", [auctionId]) ;

    console.log('highestBid', highestBid)
    const {
        data: bidBuffer,
        isLoading: isBidBufferLoading,
        error: isBidBufferError,
      } = useBidBuffer(escrow, auctionId);
    
    // if the first element of the array highestBid starts with 0x00000 then there are no bids yet
    
    const highestBidAmount = highestBid ? highestBid[0].toString() : 'No bid yet';
    const highestBidder = highestBid ? highestBid[1].toString() : 'No bidder yet';

    const { mutateAsync: cancelAuction, isLoading: cancelLoading } =
      useCancelEnglishAuction(escrow);
    // use contract read to get the current winning bid 
    
    
    //if auctionId is a string and not undefined convert it to a number
    const auctionIdBigNumber = auctionId ? parseInt(auctionId) : undefined;
    
    const handleCancelAuction = async () => {
      try {
        await cancelAuction(auctionIdBigNumber as number);
        alert("Auction cancelled successfully!");
      } catch (error) {
        console.error("Failed to cancel auction", error);
      }
    };

  
    // Render the component
    return (
      <div className="p-8">
        <div className="mb-8">
          <Heading
            title="Your Auction"
            subtitle="Update your auction details"
            center={true}
          />
        </div>
        <div className="p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Current Auction Details</h2>
          <p className="mb-2">Auction ID: {auctionId}</p>
          <p className="mb-2">Auction Creator: {addressSlicer(englishAuction?.creatorAddress)}</p>
          <p className="mb-2">Minimum Bid Amount: {englishAuction?.minimumBidAmount} WEIIIIII</p>
          <p className="mb-2">Start Date: {formatDate(englishAuction?.startTimeInSeconds)}</p>
          <p className="mb-2">End Date: {formatDate(englishAuction?.endTimeInSeconds)}</p>
          <p className="mb-2">Bid buffer: {bidBuffer ? bidBuffer.toString() : 'The Rizzler'}</p>
          <p className="mb-2">Current Highest Bid: {parseInt(highestBidAmount)} </p>
          <p className="mb-2">Current Highest Bidder: {parseInt(highestBidder)} </p>
          <p className="mb-2">Status:  {"Active"} </p>
        </div>
        <div className={`mt-6 py-2 px-4`}>
        <Button 
        onClick={handleCancelAuction} 
        label='Cancel Auction'
        className="my-4 bg-red-500"
        disabled={cancelLoading}/>
        </div>
      </div>
    );
    
  };

  
  export default ListingUpdateAuction;
  