
import { useState } from 'react'

import Link from 'next/link';
import Image from 'next/image';
import logo from "../../Components/vlogo.png";
import Footers from '../../Components/footer';

export default function Howto() {
    return (
    <div>
          <div className="flex lg:flex-1 p-6 lg:px-8">
                  <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Delot</span>
                  <Image
                      className="h-8 w-auto"
                      src={logo}
                      alt=""
                      width={5000}
                      height={5000}
                  />
                  </a>
          </div>
          <div className="mx-auto max-w-2xl ">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">How to play</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">To get started with your first lottery, you need an ethereum wallet. Follow the steps in this <Link href="https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask" className="font-semibold text-red-600">link</Link> do download one if you don't have any yet</p>
          
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-6 text-center">To create game</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                  <ul className="listStyle">
                      <li>Navigate to the home page and click on any of the <Link href="./create" className="font-semibold text-red-600">create game</Link> button</li>
                      <li>Select your prefered chain. Ensure enough native tokens are available on the selected chain for transaction fees</li>
                      <li>Select the number of winners you would like to have at the end of the game</li>
                      <li>Select the maximum number of players you would like to have. The winner(s) are chosen, and funds are deposited into their wallets immediately when the last player joins the game</li>
                      <li>Choose a time frame for the game. Note that only the creator of the game can end it, after the specified time frame has elapsed and the maximum number of players is yet to be reached.</li>
                      <li>After clicking on create game, you are required to sign 3 transactions to deploy the contract to the blockchain</li>
                      <li>A code is generated at the end of the deployment process for joining the game. The creator of the game also needs to join the game to participate in the lottery</li>
                  </ul>
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-6 text-center">To join game</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                  <ul className="listStyle">
                      <li>Click on any of the <Link href="./join" className="font-semibold text-red-600">join game</Link> button on the home page</li>
                      <li>Connect your wallet. Ensure you have enough tokens to cover for the entry fee</li>
                      <li>Enter your game code and click the join game button</li>
                      <li>Sign the transaction in your wallet</li>
                      <li>You will be redirected to the game log where you can view updates on the game</li>
                      <li>At the end of the game you will automatically receive your reward if you are one of the winners</li>
                  </ul>
              </p>
              </div>
              <Footers/>
      </div>
  
    )
  }