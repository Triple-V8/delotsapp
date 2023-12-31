"use client"; 
import { useState } from 'react'


import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { polygonMumbai, mainnet } from 'wagmi/chains'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'



import Create from './Components/creategame';

// 1. Get projectId
const projectId = 'ba8b34aadb170fdfe142fc50780eac49'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [polygonMumbai, mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, themeVariables: {
  '--w3m-color-mix': '#DC2626',
  '--w3m-color-mix-strength': 30,
  '--w3m-accent' : '#DC2626'
} })

export default function Created() {
  return (
  <WagmiConfig config={wagmiConfig}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Create />
    </LocalizationProvider>
  </WagmiConfig>
  )
}
