import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ThirdwebStorage } from "@thirdweb-dev/storage";



export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();
    
  // First, instantiate the thirdweb IPFS storage
  const storage = new ThirdwebStorage({clientId: process.env.NEXT_PUBLIC_THIRDWEB_API_KEY});

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    title,
    description,
    image,
    category,
    roomCount,
    bathroomCount,
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
      name: title,
      description,
      image: image,
      attributes: [
        {
          trait_type: "Category",
          value: category,
        },
        {
          trait_type: "Room Count",
          value: roomCount,
        },
        {
          trait_type: "Bathroom Count",
          value: bathroomCount,
        },
        {
          trait_type: "Location Value",
          value: location.value,
        },
        {
          trait_type: "Price",
          value: parseInt(price, 10),
        }
      ]
    };

    //replace the image with the IPFS URI
    //upload image to IPFS

    //Upload metadata to IPFS
    const ipfsUri = await storage.upload(metadata);
    console.log(ipfsUri)

    
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        image,
        category,
        roomCount,
        bathroomCount,
        ipfsUri: ipfsUri,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.id
      }
    });
    //grant 
    
  return NextResponse.json(listing);
}