import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite } from 'wagmi'
import { getWalletClient, publicClient, readContract, getContract, watchContractEvent, writeContract } from '@wagmi/core'
import ConnectButton from "../../create/Components/connectwallet";
import { ABI5 } from '../../constants/abi5';
import CountdownTimer from './countdown';

export default function Create({ params }) {
    const { address, isConnected } = useAccount();
    const [ isMember, setIsMember ] = useState();
    const [ members, setMembers ] = useState([]);
    const [ maxPlayers, setMaxPlayers ] = useState();
    const [ creator, setCreator ] = useState();
    const [ targetTime, setTargetTime ] = useState();
    const [ winner, setWinner ] = useState();
    const [ winner1, setWinner1 ] = useState();
    const [ winner2, setWinner2 ] = useState();
    const [ winner3, setWinner3 ] = useState();
    const [ winner4, setWinner4 ] = useState();
    const [ winners_, setWinners_ ] = useState([]);
    const abi = ABI5;
    const searchParams = useSearchParams();
    let contractAddress = searchParams.get("contractAddress")
    let chain = searchParams.get("chain")

    // const contract = getContract({
    //   address: contractAddress,
    //   abi: abi,
    // });
  
    
    function searchStringInArray(string, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === string) {
            return true;
          }
        }
        return false;
      }

    let endGame = async() => {
      let hash = await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: 'startWinnerSelection'
      })
      hash = hash.hash
      console.log("Initiate Game ", hash)
    }

    


    useEffect(() => {
      
      console.log("Contract address ", searchParams.get("contractAddress"))
      console.log("Chains ", searchParams.get("chain"))

        const checkGame = async () =>  {
            console.log("Contract address ", contractAddress, "Chain ", chain);
            let addresses = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'getPlayers',
                chain: chain,
                })
                
                console.log("List of addresses ", addresses)

                setMembers(addresses)
            
                let check = searchStringInArray(address, addresses);
                
                console.log("Check ", check);
        
                setIsMember(check);
        
            }

            const getCreator = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let owner = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'owner',
                  chain: chain,
                  })
                  setCreator(owner)
                }

            const getMaxPlayers = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let owner = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'maxPlayers',
                  chain: chain,
                  })
                  setMaxPlayers(owner)
                }
            
            const getStartTime = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let startTime = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'startTime',
                  chain: chain,
                  })
                  return startTime;
                }

            const getInterval = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let interval = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'interval',
                  chain: chain,
                  })
                  return interval;
                }
            
                (async () => {
                  let start = await getStartTime()
                  let interval = await getInterval()
                  let timestamp = start + interval
                  setTargetTime(parseInt(timestamp))
    
                })();
                
            
            
            const getEvents = async () => {
              const unwatch = watchContractEvent(
                {
                  address: contractAddress,
                  abi: abi,
                  eventName: 'joinGame',
                },
                (log) => console.log("Logs ",log),
              )
              console.log("Events ", unwatch)
            }

            const getWinner = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let winner = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'winner',
                  chain: chain,
                  })
                  setWinner(winner)
                }
            const getWinner1 = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let winner = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'winner1',
                  chain: chain,
                  })
                  setWinner1(winner)
                }
            const getWinner2 = async () =>  {
              console.log("Contract address ", contractAddress, "Chain ", chain);
              let winner = await readContract({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'winner2',
                  chain: chain,
                  })
                  setWinner2(winner)
                }
            
                const getWinner3 = async () =>  {
                  console.log("Contract address ", contractAddress, "Chain ", chain);
                  let winner = await readContract({
                      address: contractAddress,
                      abi: abi,
                      functionName: 'winner3',
                      chain: chain,
                      })
                      setWinner3(winner)
                    }

                    const getWinner4 = async () =>  {
                      console.log("Contract address ", contractAddress, "Chain ", chain);
                      let winner = await readContract({
                          address: contractAddress,
                          abi: abi,
                          functionName: 'winner4',
                          chain: chain,
                          })
                          setWinner4(winner)
                        }
            
        checkGame();
        getCreator();
        getMaxPlayers();
        getEvents();
        getWinner();
        getWinner1();
        getWinner2();
        getWinner3();
        getWinner4();
        console.log("winners ", winners_[1])
    }, [address])

    let winnerBlock = (address, position) => {
      return (
        <div className='border-2 border-warning rounded px-2 py-1 logs'>
                <button
                  className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
                >
                  {position}
                </button>
                <span className="gap-x-3 ms-5">{address.slice(0, 4)}...{address.slice(-4)} won game</span>
         
              </div>
      )
    }

    //conditional return 2 different pages, use useEffect to check if the address is part of the players, update a useState, if use
    //if useState is true show game events else display address is not a member of game with join game button
    if (!address){
      return( 
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <a href="./join"><div className="font-semibold text-red-600 back"><span aria-hidden="true">&larr;</span> Exit </div></a>
      
          <ConnectButton />
          You need to connect a wallet
        </div>
      )
    }
    if (isMember){
    return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <a href="./join"><div className="font-semibold text-red-600 back"><span aria-hidden="true">&larr;</span> Exit </div></a>
        <ConnectButton />
        <div class="text-center">
          
        <CountdownTimer targetTime={targetTime} />
        
      
       {
       ((address === creator) && (targetTime <  ((new Date().getTime())/1000))) ? 
        <button
                  className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
                  onClick = {() => endGame()}>
                  End Game
        </button> : <div></div>
    }
    
    
    
          <p>{members.length} / {maxPlayers} players joined </p>
          <p>{(members.length < maxPlayers) ? "Game in play" : "Game Over"}</p>
          

          {(members.length === maxPlayers) ? 
            <> 
              {winnerBlock(winner, "1st winner")} 
                {
                (winner2) ? 
                  <> 
                    {winnerBlock(winner1, "2nd winner")} 
                    {winnerBlock(winner2, "3rd winner")} 
                  </>: 
              <div>
              </div>
                }
              {(winner4) ? 
                  <> 
                    {winnerBlock(winner3, "4th winner")} 
                    {winnerBlock(winner4, "5th winner")}
                  </>
                
              : 
              <div>
              </div>
              }
              </>
            
          
          : <div></div>   
        }


          {
            members.map((member, index) => (
              <div className='border-2 border-warning rounded px-2 py-1 logs' key={index}>
                <button
                  className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
                >
                  Joined game
                </button>
                <span className="gap-x-3 ms-5">{member.slice(0, 4)}...{member.slice(-4)} joined game</span>
         
              </div>
            ))
          }

          <div className="border-2 border-warning rounded px-2 py-1 logs">
                <button
                  className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-1"
                >
                  Created game
                </button>
                <span className="gap-x-3 ms-5">{creator.slice(0, 4)}...{creator.slice(-4)} created game</span>
         
          </div>
        </div>
            
          
        </div>
      )
    }
    else{
      return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <a href="./join"><div className="font-semibold text-red-600 back"><span aria-hidden="true">&larr;</span> Exit </div></a>
      
            <ConnectButton />
          You are not a member
        </div>
      )
    }
}
