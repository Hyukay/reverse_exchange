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


interface ListingClientProps {
  listing: SafeListing & {
    seller: SafeUser;
    isApproved: boolean;
    isAvailable: boolean;
    isInspected: boolean;
  };
  currentUser?: SafeUser | null;
  //escrow: ethers.Contract;
 // provider: ethers.providers.Web3Provider;
  
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

  const [isLoading, setIsLoading] = useState(false);
  /*const [hasBought, setHasBought] = useState(false)
  const [hasLended, setHasLended] = useState(false)
  const [hasInspected, setHasInspected] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const [buyer, setBuyer] = useState(null )
  const [lender, setLender] = useState(null)
  const [inspector, setInspector] = useState(null)
  const [seller, setSeller] = useState(null)

  const [owner, setOwner] = useState(null)


  const fetchDetails = useCallback(async () => {
    // -- Buyer

    const buyer = await escrow.buyer(listing.id)
    setBuyer(buyer)
    
    const hasBought = await escrow.approval(listing.id, buyer)
    setHasBought(hasBought)

    // -- Seller

    const seller = await escrow.seller()
    setSeller(seller)

    const hasSold = await escrow.approval(listing.id, seller)
    setHasSold(hasSold)

    // -- Lender

    const lender = await escrow.lender()
    setLender(lender)

    const hasLended = await escrow.approval(listing.id, lender)
    setHasLended(hasLended)

    // -- Inspector

    const inspector = await escrow.inspector()
    setInspector(inspector)

    const hasInspected = await escrow.inspectionPassed(listing.id)
    setHasInspected(hasInspected)

}, [escrow, listing.id])

  const fetchOwner = useCallback (async () => {
    if (await escrow.isListed(listing.id)) return

    const owner = await escrow.buyer(listing.id)
    setOwner(owner)
}, [escrow, listing.id])

  const buyHandler = async () => {
    const escrowAmount = await escrow.escrowAmount(listing.id)
    const signer = await provider.getSigner()

    // Buyer deposit earnest
    let transaction = await escrow.connect(signer).depositEarnest(listing.id, { value: escrowAmount })
    await transaction.wait()

    // Buyer approves...
    transaction = await escrow.connect(signer).approveSale(listing.id)
    await transaction.wait()

    setHasBought(true)
}

const inspectHandler = async () => {

    const signer = await provider.getSigner()

    // Inspector updates status
    const transaction = await escrow.connect(signer).updateInspectionStatus(listing.id, true)
    await transaction.wait()

    setHasInspected(true)
}

const lendHandler = async () => {
    const signer = await provider.getSigner()

    // Lender approves...
    const transaction = await escrow.connect(signer).approveSale(listing.id)
    await transaction.wait()

    // Lender sends funds to contract...
    const lendAmount = (await escrow.purchasePrice(listing.id) - await escrow.escrowAmount(listing.id))
    await signer.sendTransaction({ to: escrow.address, value: lendAmount.toString(), gasLimit: 60000 })

    setHasLended(true)
}

const sellHandler = async () => {
    const signer = await provider.getSigner()

    // Seller approves...
    let transaction = await escrow.connect(signer).approveSale(listing.id)
    await transaction.wait()

    // Seller finalize...
    transaction = await escrow.connect(signer).finalizeSale(listing.id)
    await transaction.wait()

    setHasSold(true)
}

useEffect(() => {
    fetchDetails()
    fetchOwner()
}, [fetchDetails, fetchOwner,hasSold])*/

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
                
                ></ListingBuy>
            </div>
          </div>
        </div>
      </div>
    </Container>
   );
}
 
export default ListingClient;
