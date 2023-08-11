# REverse: Real Estate Exchange Platform

REverse connects property buyers with real estate owners, simplifying the process of finding the perfect home or commercial property in the city of your choice.

## Table of Contents

- [REverse: Real Estate Exchange Platform](#reverse-real-estate-exchange-platform)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Cloning the repository](#cloning-the-repository)
    - [Install packages](#install-packages)
    - [Setup .env file](#setup-env-file)
    - [Setup Prisma](#setup-prisma)
    - [Start the app](#start-the-app)
  - [Available commands](#available-commands)
  - [Acknowledgements](#acknowledgements)
  
## Tech Stack

- **Frontend**: Next.js v13.4.4, React 18, TailwindCSS
- **Authentication**: NextAuth with Google and GitHub authentication
- **Backend**: Node.js v18.16.0, Prisma, MongoDB
- **Blockchain**: Hardhat, Metamask, Thirdweb SDK, Ethereum EVM
- **Storage**: IPFS for image and attributes storage

## Features

- Modern UI with Tailwind design and animations.
- Fully responsive across devices.
- Multiple authentication methods: Credentials, Google, and Github.
- Image and attributes storage on IPFS.
- Robust form validation with react-hook-form.
- Client and server-side error handling.
- Page loading and empty states.
- Comprehensive property listing and buying system.
- Advanced search by category, location, rooms, and more.
- Favorites system and shareable URL filters.
- Detailed property pages.
- User profiles for listing and managing properties.
- Direct contact options with property owners.

## Prerequisites

Make sure to be connected on a network that allows P2P protocols (IPFS)
You may be unable to list/view a property if you are on a public network such as
school/university, libraries etc. These are known to block P2P protocols.
If nothing works you might want to try on cellular data.

- Node.js (Recommended version: 14.x) and npm/yarn.
- MongoDB installation.
- Thirdweb setup.

## Getting Started

### Cloning the repository

```shell
git clone https://github.com/your_username/MGL850_Reverse_Exchange.git

```

### Install packages

```shell
yarn
```

### Setup .env file

```js

DATABASE_URL=

NEXTAUTH_URL= //example link to your localhost 
NEXTAUTH_SECRET_KEY=
NODE_ENV = //production, dev, feature etc. 

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

## Acknowledgements

This project is based on the work of Antonio Erdeljac. Significant modifications and additional features have been added by Khalil Anis Zabat.
