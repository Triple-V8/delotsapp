import React from 'react';
import { useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Modal from "react-modal";
import { Bars3Icon } from '@heroicons/react/24/outline'
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite } from 'wagmi'
import { getWalletClient, publicClient, writeContract, waitForTransaction } from '@wagmi/core'
import ConnectButton from "./connectwallet";
import { getContractAddress, createPublicClient, http, parseEther } from 'viem';
import useCopyToClipboard from './copyToclipBoard';
import { polygonMumbai } from '@wagmi/core/chains'
import { ABI } from '../../constants/abi';
import bytecode from '../../constants/bytecode';
import { safeAddress, LINK_TOKEN, VRF_COORDINATOR, KEY_HASH, FEE, safeFee} from '../../constants/mumbaiarg'



export default function Create() {
  const abi = ABI;
  const { address, isConnecting, isDisconnected } = useAccount()
  const { chain } = useNetwork()
  const { copied, handleCopy } = useCopyToClipboard();


  //For the modal
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("")
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [errors, setErrors] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [modal, setModal] = useState();
  const [isDeploying, setIsDeploying] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  //Duration
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  let inSeconds;

  const handleInputChange = (e, x, max) => {

    let inputValue = parseInt(e.target.value);
  
    // Check if the entered value is greater than 60
    if (!isNaN(inputValue) && inputValue > max) {
      // If greater than 60, set the value to 60
      inputValue = max;
    }

    if (!inputValue) {
      // if undefined
      inputValue = 0;
    }
  
    // Update the state with the adjusted value
    x(inputValue);
    
   
  };
  const convertToSeconds = () => {
    const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
    inSeconds = totalSeconds;
    
  };


  const { chains, error, isLoading, pendingChainId, switchNetwork } =
  useSwitchNetwork()

  const idToChain = {
    80001 : "MUMBAI"
  }

  
  //For the modal
  const handleRequestClose = () => {
    setIsOpen(false);
    setIsCodeOpen(false);
    setIsErrorOpen(false);
};

//copy code
const handleCopyCode = () => {
  handleCopy(code);
};




  //Handle chain change
  const [chained, setChain] = useState(80001);
  const handleChain = (event) => {
    setChain(parseInt(event.target.value));
  };

  //Handle No of winners
  const [winners, setWinners] = useState(1);
  const handleWinners = (event) => {
    setWinners(event.target.value);
    setNoOfPlayers(event.target.value * 2)

  };

  //Handle No of players
  const [noOfPlayers, setNoOfPlayers] = useState(winners * 2);
  const handleNoOfPlayers = (event) => {
    setNoOfPlayers(event.target.value);
  };

   //Handle No of entry fee
   const [entryFee, setEntryFee] = useState("");
   const handleEntryFee = (event) => {
    setEntryFee(event.target.value);
   };

   //change network
   const switcher = () => {
    setErrors("Switch chain first");
    setIsErrorOpen(true)
    switchNetwork(chained);
   }

   //generate code
   function genCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let item = "";
  
    for (let i = 0; i < 5; i++) {
      item += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return item;
  }
  
  //deploy to backend
  async function sendToBackend(dataObject) {
    let url = "https://delots.cyclic.app/Codes"
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

   //Create game
   const createGame = async () => {
    console.log("chained", chained)
    console.log("chain", chain)
    if (!address){
      setErrors("Connect your wallet");
      setIsErrorOpen(true);
    }
    else{
    if(chain.id !== chained){
      switcher (chained)
    }else{

      convertToSeconds()

      if((chained === "") || (winners === "") || (noOfPlayers === "") || (entryFee === "")){
        setErrors("Missing Item, Ensure you complete the form");
        setIsErrorOpen(true)
        return;

      }

      if(inSeconds < 300){
        setErrors("The minimum duration for a game is 5 minutes");
        setIsErrorOpen(true)
        return;
      }

      
      console.log("Chain ", idToChain[chained])
    
    const walletClient = await getWalletClient({
      chainId: parseInt(chained),
    })

    


    let gameInfo = [chained, winners, noOfPlayers, entryFee];
    console.log(gameInfo);

    //deployContract
    console.log("ABI", abi);
    console.log("Address", address);
    console.log("Bytecode", bytecode);

    setIsOpen(true);
    setIsDeploying(true);
    
    console.log("safe address ", safeAddress, "coordinator ", VRF_COORDINATOR, "Link token ", LINK_TOKEN, "KEY_HASH ", KEY_HASH, "Fee ", FEE, "Seconds ", inSeconds.toString())
    let hash;
    try {
    hash = await walletClient.deployContract({
      abi,
      address,
      args: [safeAddress, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE, inSeconds.toString()],
      bytecode
    })
  } catch(error) {
      setErrors("Unable to deploy contract");
      setIsErrorOpen(true);
  }

    console.log("Deploy Hash ", hash);

    let data = await waitForTransaction({
      hash,
    })
    console.log("Deploy Data ", data);

    
    
    //getpublicclient
    const client = createPublicClient({ 
      chain: chain,
      transport: http(),
    })

    //getTransactionCount
    const transactionCount = await client.getTransactionCount({  
      address: address,
    })
    console.log("Transaction Count ", transactionCount)

    //getContractAddress
    const contractAddress = getContractAddress({ 
      from: address,
      nonce: transactionCount-1
    })
    console.log("Contract address ", contractAddress)

    //initiate game
    setIsDeploying(false);
    setIsInitiating(true);
    try{
     hash = await writeContract({
      address: contractAddress,
      abi: ABI,
      functionName: 'initiateGame',
      value: safeFee,
    })
    hash = hash.hash
    console.log("Initiate Game ", hash)
  } catch(error) {
    setErrors("Unable to initiate game");
      setIsErrorOpen(true);
  }

    data = await waitForTransaction({
      hash,
    })
    console.log("Initiate Game Data ", data);

    //start game
    setIsInitiating(false)
    setIsStarting(true);
    try{
    hash = await writeContract({
      address: contractAddress,
      abi: ABI,
      functionName: 'startGame',
      args: [noOfPlayers, parseEther(entryFee)]
    })
    console.log("Start Game ", hash)
  } catch(error) {
      setErrors("Unable to start game");
      setIsErrorOpen(true);
  }

    //generate code
    let code = genCode()
    console.log("Code ", code);

    //send to backend
    console.log
    let parame = {"code" : code, "address" : contractAddress, "chain" : idToChain[chained]}
    console.log("Parameter ", parame)
    let backendResponse = await sendToBackend(parame) 
    console.log("backendResponse ", backendResponse)
    setErrors("");
    handleRequestClose()
    setCode(code);
    setIsCodeOpen(true);
    

  }
}


   };

   


  return (
    
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">

                  <Modal
                    closeTimeoutMS={100}
                    isOpen={isOpen}
                    onRequestClose={handleRequestClose}
                    contentLabel="My Modal"
                    className="Modal"
                >
                    <div className="custom-block custom-block-overlay">
   <div className="custom-block-overlay-text d-flex">
     <div className="d-flex flex-column h-100 px-3.5 py-2.5">
       <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl text-center mb-2">Ensure you complete the 3 transactions below</p>
       <div className={`border-2 border-warning rounded px-3.5 py-2.5 ${!isDeploying ? 'opaque-div' : ''}`}>
         <div className="flex gap-x-3">Deploy contract to blockchain</div>
         <button
             className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
           >
             Deploying game ...
           </button>
       </div>
       <div className={`border-2 border-warning rounded px-3.5 py-2.5 ${!isInitiating ? 'opaque-div' : ''}`}>
         <div className="flex gap-x-3">Initiate contract and pay fees</div>
         <button
             className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
           >
             Initiating game ...
           </button>
       </div>
       <div className={`border-2 border-warning rounded px-3.5 py-2.5 ${!isStarting ? 'opaque-div' : ''}`}>
         <div className="flex gap-x-3">Add number of players and entry fee</div>
         <button
             className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
           >
             Starting game ...
           </button>
       </div>
       <p className="mt-6 text-xs leading-5 text-gray-600 text-center">Ensure their is enough funds to cover gas and fees in your wallet </p>
     </div>
     </div>
       
                    </div>
                </Modal>

                <Modal
                    closeTimeoutMS={100}
                    isOpen={isCodeOpen}
                    onRequestClose={handleRequestClose}
                    contentLabel="My Modal"
                    className="Modal"
                >
                    <div className={`border-2 border-warning rounded px-3.5 py-2.5 text-center`}>
                    <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">Game Code</p>
                    <div className="gap-x-3 mb-2">{errors}</div>
                    <div className="custom-block custom-block-overlay">
                    {code}     <button onClick={() => handleCopyCode()}> {!copied ? <BsClipboard /> : <BsClipboard2Check />}</button>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-600 text-center">This code can be used by anyone to participate in the lottery</p>
                    <a href="./join">
                     <button
                        className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
                      >
                        Join game
                      </button>
                      </a> 
                    </div>
                </Modal>

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
      <ConnectButton />

      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >

        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />


      </div>
      <a href="./"><div className="font-semibold text-red-600 back"><span aria-hidden="true">&larr;</span> Home </div></a>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Create game</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          What would you like your game to look like?
        </p>
      </div>


      <form className="mx-auto mt-16 max-w-xl sm:mt-20" onSubmit={(event) => event.preventDefault()}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="Select chain" className="block text-sm font-semibold leading-6 text-gray-900">
              Select Chain
            </label>
            <div className="mt-2.5">
            <select value={chained} onChange={handleChain}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">

            <option value="80001">Polygon Mumbai (Testnet)</option>

            <option value="">Others coming soon</option>
            
            </select>
            </div>
          </div>
          <div>
            <label htmlFor="Select no of winner" className="block text-sm font-semibold leading-6 text-gray-900">
              Select Number Of winner(s) {winners}
            </label>
            <div className="mt-2.5">
            <select value={winners} onChange={handleWinners}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">

            <option value="1">1</option>

            <option value="3">3</option>

            <option value="5">5</option>
            
            </select>
            </div>
          </div>
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
              No Of Players
            </label>
            <div className="mt-2.5">
              <input
                type="number"
                name="no-of-player"
                id="no-of-player" 
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                value={noOfPlayers} onChange={handleNoOfPlayers} min={(parseInt(winners) * 2).toString()}
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
              Entry Fee (Ether)
            </label>
            <div className="mt-2.5">
              <input
                type="number"
                name="entry-fee"
                id="entry-fee"
                autoComplete=""
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                value={entryFee} onChange={handleEntryFee} 
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
              Duration
            </label>
            
          <div className="flex-container"> 
      <div className="flex-item">
        Days:
        <input
          type="number"
          value={days}
          onChange={(e) => handleInputChange(e, setDays, 100)}
          className="w-10 mx-auto"
          min={0}
          defaultValue={0}
        />
      </div>

      <div className="flex-item">
        Hours:
        <input
          type="number"
          value={hours}
          onChange={(e) => handleInputChange(e, setHours, 24)}
          className="w-10 mx-auto"
          min={0}
          max={24}
          defaultValue={0}
        />
      </div>

      <div className="flex-item">
        Minutes:
        <input
          type="number"
          value={minutes}
          onChange={(e) => handleInputChange(e, setMinutes, 59)}
          className="w-10 mx-auto"
          min={0}
          max={60}
          defaultValue={0}
        />
      </div>

      <div className="flex-item">
        Seconds:
        <input
          type="number"
          value={seconds}
          onChange={(e) => handleInputChange(e, setSeconds, 59)}
          className="w-10 mx-auto"
          min={0}
          max={60}
          defaultValue={0} 
        />
      </div>
    </div>
      {/* <div>
      {seconds !== null && (
        <p>
          {days} days, {hours} hours, {minutes} minutes, and {seconds} seconds
          is equivalent to {seconds} seconds.
        </p>
      )}
      </div> */}
    </div>
          {/* <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                  agreed ? 'bg-red-600' : 'bg-gray-200',
                  'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                )}
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    agreed ? 'translate-x-3.5' : 'translate-x-0',
                    'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                  )}
                />
              </Switch>
            </div>
            <Switch.Label className="text-sm leading-6 text-gray-600">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold text-red-600">
                privacy&nbsp;policy
              </a>
              .
            </Switch.Label>
          </Switch.Group> */}
        </div>
        <div className="mt-10">
          <button
            onClick = {() => createGame()}
            className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Create game
          </button>
        </div>
      </form>
    </div>
  )
}