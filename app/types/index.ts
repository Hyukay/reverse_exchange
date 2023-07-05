import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt" |"isAvailable" | "isApproved" | "isInspected"> & {
  createdAt: string;
  isAvailable: boolean
  isApproved: boolean;
  isInspected: boolean;

};

export type EscrowData = {

  escrowAmount: string;
  purchasePrice: string;
  
}
export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};
export type Address = string | undefined;

export type Role = 'buyer' | 'seller' | 'inspector' | 'notary' | 'lender';

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

declare global {
  interface Window {
    ethereum: any;
  }
}

