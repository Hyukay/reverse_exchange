import { defineConfig } from '@wagmi/cli'
import { hardhat,react } from '@wagmi/cli/plugins'
import { escrowABI } from './app/abis/Escrow'
import { realestateABI } from './app/abis/RealEstate'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'RealEstate',
      abi: escrowABI as any,
    },
    {
      name: 'Escrow',
      abi: realestateABI as any,
    }
  ],
  plugins: [  
    hardhat({
    project: 'contracts/',
  }),
    react({
    useContractRead: true,
    useContractFunctionRead: true,
  }),],
  
})
