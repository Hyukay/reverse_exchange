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
    - [Obtaining the environment variables](#obtaining-the-environment-variables)
    - [Setup Prisma](#setup-prisma)
    - [Start the app](#start-the-app)
    - [Running with Docker](#running-with-docker)
    - [Compiling and Deploying Smart Contracts with Thirdweb](#compiling-and-deploying-smart-contracts-with-thirdweb)
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
- Docker (optional)

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

```shell
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
NEXT_PUBLIC_THIRDWEB_API_KEY=
NEXT_PUBLIC_THIRDWEB_API_SECRET=
```

### Obtaining the environment variables
 - **DATABASE_URL** This represents your MongoDB Connection String.
 - **NEXTAUTH_URL** & **NEXTAUTH_SECRET_KEY** Acquire these by setting up an account with NextAuth.js. More details can be found at: https://next-auth.js.org/getting-started/client.
 - **NODE_ENV** Denotes the type of environment (e.g., production, development).
 - **GITHUB_ID** & **GITHUB_SECRET** These can be obtained after creating an account with NextAuth.js. More details at: https://next-auth.js.org/providers/github
 - **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET** After setting up an account with NextAuth.js, you can get these values from: https://next-auth.js.org/providers/google
 - **INFURA_API_KEY** Register with Infura to receive this key. Further instructions can be found at: https://docs.infura.io/networks/ethereum/how-to/secure-a-project/project-id
 - **SEPOLIA_PRIVATE_KEY** This corresponds to your wallet's private key and can be obtained from your wallet provider.
 - **NEXT_PUBLIC_THIRDWEB_API_KEY** & **NEXT_PUBLIC_THIRDWEB_API_SECRET** After setting up an account with Thirdweb, generate your API Key and Secret from the Thirdweb Dashboard: https://thirdweb.com/dashboard/settings. This

### Setup Prisma

```shell
npx prisma db push
```

### Start the app

```shell
yarn dev
```

### Running with Docker
1. Ensure Docker and Docker Compose are installed on your machine. If not, you can download and install them from the official Docker website.

2. Setup .env file for Docker and make sure your .env file is correctly setup as mentioned in the Setup .env file section.

3. To build and run the project using Docker, use the following command:

````shell
docker-compose up --build
````
This will fetch the necessary Docker images, build your project and then run it. Once the project is running, you can access it via your browser at http://localhost:3000 (or the port you've specified in the Dockerfile and docker-compose.yml).

Note: Running for the first time might take longer due to the image building process (around 6 minutes). Subsequent runs will be faster.

### Compiling and Deploying Smart Contracts with Thirdweb
Thirdweb offers a streamlined process for compiling and deploying smart contracts. Follow the steps below to leverage the Thirdweb library in deploying your smart contract.

1. Ensure you have Thirdweb SDK set up and integrated into your project by using the command:
````shell
yarn add @thirdweb-dev/sdk@latest
````
2. Ensure that .env file is properly setup.
3. Navigate to the directory containing your smart contract .sol file. From the root of the project:
````shell
cd contracts
````

4. Use the following command to deploy the contract:

````shell
npx thirdweb deploy
````

1. Your contracts should be available in your Thirdweb Dashboard -> Contracts.

## Available commands

Running commands with yarn `yarn [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev` | Starts a development instance of the app |

## Acknowledgements

This project has been templated from the work of Antonio Erdeljac. Significant modifications and additional features have been added by Khalil Anis Zabat.
