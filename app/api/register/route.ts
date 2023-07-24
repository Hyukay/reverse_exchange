import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request, 
) {
  const body = await request.json();
  const { 
    email,
    name,
    password,
    role,
   } = body;

   const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      
      return NextResponse.json({ error: "A user with this email already exists." });
    }
   const hashedPassword = await bcrypt.hash(password, 12);
   
   const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      role,
    }
  });

  return NextResponse.json(user);
}