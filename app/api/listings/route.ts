import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ThirdwebStorage } from "@thirdweb-dev/storage";



export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();
    
  // First, instantiate the thirdweb IPFS storage
  const storage = new ThirdwebStorage();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
   } = body;

 

  // Check if all fields are filled
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

    //Image URI
    // Here we get the IPFS URI of where our metadata has been uploaded
    
   const metadata = {

    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location: location.value,
    price: parseInt(price, 10),
    userId: currentUser.id

  };

    const imageUri = await storage.upload(metadata.imageSrc);
    console.log(imageUri)
    //replace the imageSrc with the IPFS URI
    metadata.imageSrc = imageUri;
    console.log(metadata)

    //Upload metadata to IPFS
    const ipfsUri = await storage.upload(metadata);
    console.log(ipfsUri)
   

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        ipfsUri: ipfsUri,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.id
      }
    });

  return NextResponse.json(listing);
}