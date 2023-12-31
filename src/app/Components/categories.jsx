import { CheckIcon } from '@heroicons/react/20/solid'
import Categorycard from './categorycard'

const onewinner = {
    title : "Single winner",
    features : [
  'One winner',
  'Winner gets 100% of all stakes',
  'Minimum of two players'
],
    biggi : "1x",
    link : ""
}

const threewinner = {
    title : "Triple winner",
    features : [
  'Three winners',
  'First winner gets 50% of all stakes',
  'Second winner gets 30% of all stakes',
  'Third winner gets 20% of all stakes',
  'Minimum of five players'
],
    biggi : "3x",
    link : ""
}

const fivewinner = {
    title : "Quintuple winner",
    features : [
  'Five winners',
  'First winner gets 30% of all stakes',
  'Second winner gets 25% of all stakes',
  'Third winner gets 15% of all stakes',
  'Forth winner gets 10% of all stakes',
  'Fifth winner gets 5% of all stakes',
  'Minimum of ten players'
],
    biggi : "5x",
    link : ""
}


export default function Categories() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
        </div>
        <Categorycard info={onewinner}/>
        <Categorycard info={threewinner}/>
        <Categorycard info={fivewinner}/>
      </div>
    </div>
  )
}
