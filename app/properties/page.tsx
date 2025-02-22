
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";

import PropertiesClient from "./PropertiesClient";
import RootProvider from "../providers";

const PropertiesPage = async () => {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState
      title="Unauthorized"
      subtitle="Please login"
    />
  }

  const listings = await getListings({ userId: currentUser.id });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <RootProvider>
        <EmptyState
          title="No properties found"
          subtitle="Looks like you have no properties."
        />
        </RootProvider>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <RootProvider>
      <PropertiesClient
        listings={listings}
        currentUser={currentUser}
      />
      </RootProvider>
    </ClientOnly>
  );
}
 
export default PropertiesPage;