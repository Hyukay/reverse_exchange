'use client'
import axios from "axios";
import { useEffect, useCallback, useState, useMemo} from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeUser, Role, EscrowData } from "@/app/types";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listing/ListingHead";
import ListingInfo from "@/app/components/listing/ListingInfo";
import ListingBuy from "@/app/components/listing/ListingBuyProp";
import WagmiProvider from "@/providers/wagmi";
import { useAccount } from 'wagmi'
import { ethers } from "ethers";
import config from '../../config.json';
import { escrowABI } from "@/app/abis/Escrow";



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
  
}



const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  
}) => {

  const loginModal = useLoginModal();
  const router = useRouter();

  const category = useMemo(() => {
    return categories.find((items) => 
     items.label === listing.category);
 }, [listing.category]);


 const {address, isConnected} = useAccount();
 console.log('Current connected address', address)
 console.log('Is Connected?', isConnected)

 const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
 const [escrow, setEscrow] = useState<ethers.Contract | null>(null);
 const [account, setAccount] = useState<string | null>(null);
 const [homes, setHomes] = useState<Array<any>>([]);
 const [home, setHome] = useState<any | null>(null);
 const [toggle, setToggle] = useState<boolean>(false);

 const loadBlockchainData = async () => {
   const provider = new ethers.providers.Web3Provider(window.ethereum)
   setProvider(provider);
   const network = await provider.getNetwork()
   const realEstate = new ethers.Contract(config.contracts.RealEstate.address, escrowABI, provider)
   const totalSupply = await realEstate.totalSupply()
   const homes = []
   console.log('Total Supply', totalSupply.toString())

   for (var i = 1; i <= totalSupply; i++) {
     const uri = await realEstate.tokenURI(i)
     const response = await fetch(uri)
     const metadata = await response.json()
     homes.push(metadata)
   }

   setHomes(homes);

   const escrow = new ethers.Contract(config.contracts.Escrow.address, escrowABI, provider)
   setEscrow(escrow);

   window.ethereum.on('accountsChanged', async () => {
     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
     const account = ethers.utils.getAddress(accounts[0])
     setAccount(account);
   })
 }
 const togglePop = (home: any) => {
   setHome(home)
   toggle ? setToggle(false) : setToggle(true);
 }

 console.log('HOMES', homes.length)
 console.log('Provider', provider)
 console.log('Escrow', escrow)
 console.log('Account', account)



  

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
                home = {homes.at(2)}
                account = {account}
                escrow = {escrow}
                price={listing.price}
                role = {currentUser ? currentUser.role as Role: 'buyer'} 
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