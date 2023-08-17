'use client'

/**
 * @author Khalil Anis Zabat
 */

import {
    useContract,
    useContractEvents,
    useValidDirectListings,
  } from "@thirdweb-dev/react";
  import React, { useMemo } from "react";
  import { ContractEvent } from "@thirdweb-dev/sdk";
  import {
    ETHERSCAN_URL,
    ESCROW_ADDRESS,
    REAL_ESTATE_ADDRESS
  } from "@/app/libs/constant";
  import Link from "next/link";
  import Heading from "../Heading";
  import styles from '../../styles/Token.module.css'
  

  
  type Props = {
    realTokenId: string | undefined;
  };
  
const ListingHistory: React.FC<Props> = ({ realTokenId }) => {
     
    // Connect to escrow smart contract
    const { contract: escrow, isLoading: loadingContract } = useContract(
        ESCROW_ADDRESS,
        "marketplace-v3"
      );
    
      // Connect to NFT Collection smart contract
      const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
    
      const { data: directListing, isLoading: loadingDirect } =
        useValidDirectListings(escrow, {
          tokenContract: REAL_ESTATE_ADDRESS,
          tokenId: realTokenId,
        });

         // Load historical transfer events: TODO - more event types like sale
        const { data: transferEventsHook, isLoading: loadingTransferEvents } =
        useContractEvents(realEstate, "Transfer", {
            queryFilter: {
            filters: {
                tokenId: realTokenId,
            },
            order: "desc",
            },
        });

        const transferEvents = useMemo(() => transferEventsHook, [transferEventsHook]) as ContractEvent<Record<string, any>>[] | undefined

        return (
            <div>
            <Heading
                title="Transaction History"
                subtitle="View the transaction history for this property."
            />
              {loadingTransferEvents ? (
                   <div>Loading history...</div>
               ) : (
              transferEvents?.map((event, index) => (
                <div
                  key={`${event.transaction.transactionHash}-${index}`}
                  className={styles.eventsContainer}
                >
                  <div className={styles.eventContainer}>
                    <p className={styles.traitName}>Event</p>
                    <p className={styles.traitValue}>
                      {
                        // if last event in array, then it's a mint
                        index === transferEvents.length - 1
                          ? "Mint"
                          : "Transfer"
                      }
                    </p>
                  </div>

                  <div className={styles.eventContainer}>
                    <p className={styles.traitName}>From</p>
                    <p className={styles.traitValue}>
                      {event.data.from?.slice(0, 4)}...
                      {event.data.from?.slice(-2)}
                    </p>
                  </div>

                  <div className={styles.eventContainer}>
                    <p className={styles.traitName}>To</p>
                    <p className={styles.traitValue}>
                      {event.data.to?.slice(0, 4)}...
                      {event.data.to?.slice(-2)}
                    </p>
                  </div>

                  <div className={styles.eventContainer}>
                    <Link
                      className={styles.txHashArrow}
                      href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                      target="_blank"
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              ))
               )}
            </div>
        );

    
}

export default ListingHistory;