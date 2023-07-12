import prisma from "@/app/libs/prismadb";

export default async function getAllListings() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        user: true,
      }
    });

    if (!listings || listings.length === 0) {
      return null;
    }

    return listings.map(listing => ({
      ...listing,
      createdAt: listing.createdAt.toString(),
      seller: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: listing.user.emailVerified?.toString() || null,
      },
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}
