'use client'
import axios from "axios";
import { useEffect, useCallback, useState, useMemo} from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ethers from "ethers";

import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeUser } from "@/app/types";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listing/ListingHead";
import ListingInfo from "@/app/components/listing/ListingInfo";
import ListingBuy from "@/app/components/listing/ListingBuyProp";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { connected } from "process";
import Button from "../components/Button";




interface ListingClientProps {
  listing: SafeListing & {
    seller: SafeUser;
    isApproved: boolean;
    isAvailable: boolean;
    isInspected: boolean;
  };
  currentUser?: SafeUser | null ;
  //escrow: ethers.Contract;
 // provider: ethers.providers.Web3Provider;
  
}


const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  
}) => {




  const { address, isConnected,  } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect()

  const loginModal = useLoginModal();
  const router = useRouter();

  const category = useMemo(() => {
    return categories.find((items) => 
     items.label === listing.category);
 }, [listing.category]);

 const [isLoading, setIsLoading] = useState(false);

  if(!isConnected){

    return (
        <Button
      label="connect"
      onClick={() => connect()
      
      }/>)
  }


 /* const onMakeOffer = useCallback((offer: number) => {
      if (!currentUser) {
        return loginModal.onOpen();
      }
      setIsLoading(true);

      axios.post('/api/offers', {
        offer,
        listingId: listing?.id
      })
      .then(() => {
        toast.success('Offer made!');
        router.push('/offers');
      })
      .catch(() => {
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
  },
  [
    listing?.id,
    router,
    currentUser,
    loginModal
  ]);*/

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
            imageSrc={listing.imageSrc}
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
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              isAvailable={listing.isAvailable}
              isApproved={listing.isApproved}
              isInspected={listing.isInspected}
            />
            <div 
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              
             <ListingBuy
                price={listing.price}
                role = {currentUser.role}
                id={listing.id}
                ></ListingBuy>
            </div>
          </div>
        </div>
      </div>
    </Container>
   );
}
 
export default ListingClient;
