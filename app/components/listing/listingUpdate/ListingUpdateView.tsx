'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress,  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,
  useValidEnglishAuctions,

} from '@thirdweb-dev/react';
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Loader from '../../Loader';
import Heading from '../../Heading';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import formatNumber from '@/app/libs/formatNumber';
import { NFT as NFTType, MarketplaceV3 } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import Input from "../../inputs/Input";
import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';
import ListingUpdateDirect from './listingTypes/ListingUpdateDirect';
import ListingUpdateAuction from './listingTypes/ListingUpdateAuction';
import EmptyState from '../../EmptyState';


interface ListingUpdateViewProp {
    listingId: string | undefined;
    auctionId: string | undefined;
    realTokenId: string | undefined;
    nft?: NFTType;
    escrow: MarketplaceV3 | undefined;
}

type UpdateFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
    };



 
        
const ListingUpdateView: React.FC<ListingUpdateViewProp> = ({realTokenId, nft, escrow, listingId, auctionId}) => {


        if(listingId && !auctionId) {
            return (
                <ListingUpdateDirect
                    realTokenId={realTokenId}
                    nft={nft}
                    escrow={escrow}
                    listingId={listingId}
                />
            )
        } else if(auctionId && !listingId){
            return (
                <ListingUpdateAuction
                    realTokenId={realTokenId}
                    nft={nft}
                    escrow={escrow}
                    auctionId={auctionId}
                />
            )
        } else {
            return (
            <EmptyState
                title="This property is not listed for sale"
            />
            )

        }
    }
    
export default ListingUpdateView;


