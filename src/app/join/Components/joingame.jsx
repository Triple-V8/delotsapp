import React, { useEffect } from 'react';
import { useState } from 'react'
import ConnectButton from "../../create/Components/connectwallet";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { getWalletClient, publicClient, readContract, writeContract, waitForTransaction } from '@wagmi/core'
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite } from 'wagmi'
import LoadingSpinner from './spinner'
import { ABI } from '../../constants/abi';
import { useRouter } from 'next/navigation';
import Modal from "react-modal";

export default function Joins () {
  const abi = ABI;
  const { address, isConnected } = useAccount();
  const [ buttonText, setButtonText ] = useState("Join game")
  const [isLoading, setIsLoading] = useState(false);
  const [ code, setCode ] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const { open } = useWeb3Modal();
  const router = useRouter();

  //For the modal
    const handleRequestClose = () => {
      setIsErrorOpen(false);
  };

  useEffect(()=>{
    isConnected ? setButtonText("Join game") : setButtonText("Connect wallet")
  }, [isConnected])
    
    async function fetchAddressChain(code) {
      let url = `https://delots.cyclic.app/Codes/${code}`
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    function searchStringInArray(string, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === string) {
          return true;
        }
      }
      return false;
    }

    const handleChange = (event) => {
      setCode(event.target.value);
  };

    async function getGame(code) {


     if(!isConnected){
      open()
      return;
     }
     setIsLoading(true);
     let codeInfo = await fetchAddressChain(code);
     console.log("codeInfo ", codeInfo);



     let addresses = await readContract({
      address: codeInfo.address,
      abi: abi,
      functionName: 'getPlayers',
      chain: codeInfo.chain,
    })
    
    console.log("List of addresses ", addresses)

    let check = searchStringInArray(address, addresses);
    
    console.log("Check ", check);

    if(!check) {
      let maxPlayers;
      try{
      maxPlayers = await readContract({
        address: codeInfo.address,
        abi: abi,
        functionName: 'maxPlayers',
        chain: codeInfo.chain,
      })
    }catch(error) {
      setErrors("Unable to get game info");
      setIsErrorOpen(true);
      setIsLoading(false);
  }
  console.log("Max players ", maxPlayers)
      if(addresses.length === maxPlayers){
        setErrors("Game is over")
        setIsErrorOpen(true)
        setIsLoading(false);
        return;
      }

      let entryFee
      try {
      entryFee = await readContract({
        address: codeInfo.address,
        abi: abi,
        functionName: 'entryFee',
        chain: codeInfo.chain,
      }) }catch(error) {
        setErrors("Unable to get game info");
        setIsErrorOpen(true);
        setIsLoading(false);
    }

      console.log("Entry fee ", entryFee)
      let hash
      try {
      hash = await writeContract({
        address: codeInfo.address,
        abi: ABI,
        functionName: 'joinGame',
        value: entryFee,
      })}catch(error) {
        setErrors("Unable to join game. Pls retry");
        setIsErrorOpen(true);
        setIsLoading(false);
    }
      hash = hash.hash
      console.log("Join game ", hash)

      let data = await waitForTransaction({
        hash,
      })
      //redirect to gamelogs
      router.push(`/game?contractAddress=${codeInfo.address}&chain=${codeInfo.chain}`)
      
    }

    //redirect to gamelogs
    router.push(`/game?contractAddress=${codeInfo.address}&chain=${codeInfo.chain}`)
    
    setIsLoading(false);
  }

   

  return (
    
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <Modal
                    closeTimeoutMS={100}
                    isOpen={isErrorOpen}
                    onRequestClose={handleRequestClose}
                    contentLabel="My Modal"
                    className="Modal"
                >
                    <div className="custom-block custom-block-overlay">
                    <div className={`border-2 border-warning rounded px-3.5 py-2.5 text-center`}>
                    <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">Error</p>
                    <div className="gap-x-3 mb-2">{errors}</div>
                    <button
                        className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1" onClick={() => handleRequestClose()}
                      >
                        Close
                      </button>
       </div>
       
                    </div>
                </Modal>
      {isLoading ? <LoadingSpinner /> : 
      <div>
            <ConnectButton />
            <a href="./"><div className="font-semibold text-red-600 back"><span aria-hidden="true">&larr;</span> Home </div></a>
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Join game</h2>
            <form className="mx-auto mt-16 max-w-xl sm:mt-20" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                    Enter game code
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="code"
                      id="code"
                      autoComplete=""
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                      // value={} onChange={} 
                    />
                  </div>
                </div>
                <div className="mt-10">
                  <button
                       onClick = {() => getGame(code)}
                      className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                      {buttonText}
                  </button>
                </div>
            </form>
            
        </div>

        <div className="mx-auto max-w-2xl text-center mt-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Game History</h2>

        </div>
        </div>
}
    </div>
  )
}