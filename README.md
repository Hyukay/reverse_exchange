# REverse

REverse is a platform that connects property buyers with real estate owners. We help you find the perfect home or commercial property in your desired city.

This project uses Next.js 13 App Router (as of today 05-16-2023) which is still experimenta

Stack

* Next.js v13.4.4
* React 18
* Prisma
* MongoDB
* NextAuth
* Truffle
* Metamask
* Thirdweb
* Ethereum EVM
* Node.js v18.16.0

## Features

* Tailwind design
* Tailwind animations and effects
* Full responsiveness
* Credential authentication
* Google authentication
* Github authentication
* Image upload using IPFS
* Attributes upload on IPFS
* Client form validation and handling using react-hook-form
* Server error handling using react-toast
* Page loading state
* Page empty state
* Listing / Buying system
* Cancellation of purchases
* Creation and deletion of property listings
* Pricing calculation
* Advanced search algorithm by category, map location, rooms and bathrooms
* Favorites system
* Shareable URL filters
* How to write POST and DELETE routes in route handlers (app/api)
* How to fetch data in server react components by directly accessing database (WITHOUT API! like Magic!)
* How to handle files like error.tsx and loading.tsx which are new Next 13 templating files to unify loading and error handling
* How to handle relations between Server and Child components!
* Search properties in various cities
* Detailed property pages with photos, amenities, and descriptions
* User profiles with options to list and manage your properties
* Contact options to directly connect with property owners

### Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js and npm/yarn
* You have installed MongoDB
* You have installed Thirdweb
* Node version 14.x

### Cloning the repository

```shell
git clone https://github.com/your_username/MGL850_Reverse_Exchange.git
```

### Install packages

```shell
yarn install
```

### Setup .env file

```js

DATABASE_URL=

NEXTAUTH_URL= //example link to your localhost 
NEXTAUTH_SECRET_KEY=
NODE_ENV = 

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GENERATE_SOURCEMAP=false

INFURA_API_KEY=

SEPOLIA_PRIVATE_KEY=
THIRDWEB_API_KEY=
THIRDWEB_API_SECRET=
```

### Setup Prisma

```shell
npx prisma db push
```

### Start the app

```shell
yarn dev
```

## Available commands

Running commands with yarn `yarn [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev` | Starts a development instance of the app |
