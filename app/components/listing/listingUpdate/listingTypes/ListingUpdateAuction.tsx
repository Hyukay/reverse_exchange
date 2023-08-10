'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress,  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,
  useValidEnglishAuctions,
  useEnglishAuction,
  useBidBuffer,
  useWinningBid
} from '@thirdweb-dev/react';
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Loader from '../../../Loader';
import Heading from '../../../Heading';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import formatNumber from '@/app/libs/formatNumber';
import { NFT as NFTType, MarketplaceV3 } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import Input from "../../../inputs/Input";
import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';
import ListingUpdateDirect from './ListingUpdateDirect';
import EmptyState from '../../../EmptyState';
import Button from '../../../Button';

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
      <div>
        <h1>Manage Auction</h1>
  
        <h2>Current Auction Details</h2>
        <p>Auction ID: {auctionId}</p>
        <p>Auction Creator: {englishAuction?.creatorAddress}</p>
        <p>Minimum Bid Amount: {englishAuction?.minimumBidAmount} WEIIIIII</p>
        <p>Start Date: {englishAuction?.startTimeInSeconds}</p>
        <p>End Date: {englishAuction?.endTimeInSeconds}</p>
        <p>Bid buffer: {bidBuffer ?  bidBuffer.toString(): 'The rizzler'}</p>
        <p>Current Highest Bid: {highestBidAmount.toString()} </p>
        <p>Current Highest Bidder: {highestBidder.toString()} </p>
        <Button 
        onClick={handleCancelAuction} 
        label='Cancel Auction'
        disabled={cancelLoading}/>
      </div>
    );
  };

  
  export default ListingUpdateAuction;
  