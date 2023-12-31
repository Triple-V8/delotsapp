import { useAccount } from 'wagmi';

export default function ConnectButton() {

const { address, isConnecting, isDisconnected, isConnected } = useAccount();

 
  return (
    <>
      <button className="rounded-md bg-red-600 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 connectbtn"><w3m-button balance='hide' size='sm' /></button>
    </>
  )
}