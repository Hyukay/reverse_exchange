import prisma from "@/app/libs/prismadb";
import {ThirdwebStorage} from "@thirdweb-dev/storage";

interface IParams {
  listingId?: string;
}

export default async function getListingById(
  params: IParams
) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true
      }
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    if (!listing.ipfsUri) {
      const storage = new ThirdwebStorage();
      let imageUri;
      try {
        imageUri = await storage.upload(listing.imageSrc);
      } catch (error) {
        console.error("Failed to upload image to IPFS:", error);
        throw error;
      }
    
      const updatedListing = await prisma.listing.update({
        where: {
          id: listingId,
        },
        data: {
          ipfsUri: imageUri
        }
      });
    
      console.log("Updated listing:", updatedListing);
    }
    

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      seller: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: 
          listing.user.emailVerified?.toString() || null,
      }
    };
  } catch (error: any) {
    throw new Error(error);
  }
}