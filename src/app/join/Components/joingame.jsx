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
  const { chain } = useNetwork()
  const [ buttonText, setButtonText ] = useState("Join game")
  const [isLoading, setIsLoading] = useState(false);
  const [ code, setCode ] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState();
  const [history, setHistory] = useState([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const { open } = useWeb3Modal();
  const router = useRouter();
  const { chains, error, pendingChainId, switchNetwork } =
  useSwitchNetwork()


  //convert chain name to chainId
  const chainnameToId = {
    MUMBAI : "80001"
  }

  //For the modal
    const handleRequestClose = () => {
      setIsErrorOpen(false);
  };

  //Send data to database
  async function sendToBackend(dataObject) {
    let url = "https://delots.cyclic.app/History"
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataObject)
    }; 
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error sending PUT request:', error);
      return null;
    }
  }
  

  useEffect(()=>{
    isConnected ? setButtonText("Join game") : setButtonText("Connect wallet");

    async function fetchAddressHistory(address) {
      let url = `https://delots.cyclic.app/History/${address}`
      const response = await fetch(url);
      const data = await response.json();
      setHistory(data);
    }
    fetchAddressHistory(address)
    console.log('History ', history)

  }, [isConnected, address])
    
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

      if(code === ""){
        setErrors("Enter a valid code");
        setIsErrorOpen(true);
        return;
       }
     if(!isConnected){
      open()
      return;
     }
     setIsLoading(true);
     let codeInfo = await fetchAddressChain(code);
     console.log("codeInfo ", codeInfo);
     console.log("Chain Id ", chainnameToId[codeInfo.chain])
     console.log('Chain ', chain.id)

     if (chain.id.toString() !== chainnameToId[codeInfo.chain]){
      setErrors("Ensure you are connected to the right chain");
      setIsErrorOpen(true);
      switchNetwork(chainnameToId[codeInfo.chain])
      setIsLoading(false);
      return;
    }

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

      

      let parame = {"address" : address, "code" : code, "chain" : codeInfo.chain}
      console.log("Parameter ", parame)
      let backendResponse = await sendToBackend(parame) 
      console.log("backendResponse ", backendResponse)

      //redirect to gamelogs
      router.push(`/game?contractAddress=${codeInfo.address}&chain=${codeInfo.chain}`)
      
    }
    if (chain.id.toString() !== chainnameToId[codeInfo.chain]){
      setErrors("Ensure you are connected to the right chain");
      setIsErrorOpen(true);
      switchNetwork(chainnameToId[codeInfo.chain])
      setIsLoading(false);
      return;
    }

    //redirect to gamelogs
    router.push(`/game?contractAddress=${codeInfo.address}&chain=${codeInfo.chain}`)
    
    setIsLoading(false);
  }

  let historyBlock = (code, chain) => {
    return (
      <div className='border-2 border-warning rounded px-2 py-1 logs'>
              <span className='text-red-600' aria-hidden="true">&rarr;</span>
              <span className="gap-x-1 ms-5"><span className='text-red-600'>{code}</span> on {chain} chain   </span> 
              <button
                className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
              onClick={()=> getGame(code)}>
                View game
              </button>
            </div>
    )
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
                  <label htmlFor="game-code" className="block text-sm font-semibold leading-6 text-gray-900">
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
        {
          (history.length > 0) ? 
           history.map((member, index) => (
            <div key={index}>
              {historyBlock(member.code, member.chain)}
            </div>
           )
          ) :
          <div></div>
           
        }
        </div>
        </div>
}
    </div>
  )
}