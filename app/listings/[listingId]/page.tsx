
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";

import hre from "hardhat";


import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";



import ListingClient from "../ListingClient";



import  RootProvider  from '../../providers'




interface IParams {
  listingId?: string;

}


const ListingPage = async ({ params }: { params: IParams }) => {

  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  

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

