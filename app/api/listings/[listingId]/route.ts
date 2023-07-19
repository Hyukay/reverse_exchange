import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id
    }
  });

  return NextResponse.json(listing);
}


export async function PATCH(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const { tokenId } = await request.json(); // Extract tokenId from request body
  try {
    const updatedListing = await prisma.listing.update({
      where: {
        id: listingId,
        //I put this in commentary because you couldn't update the listing on the database if you are not the owner 
        // but the minting would work
       // userId: currentUser.id
      },
      data: {
        tokenId: tokenId,
      }
    });
  
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
