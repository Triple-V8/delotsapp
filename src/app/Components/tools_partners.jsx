
import Image from 'next/image';
import logo1 from "./3plevblue.jpeg";
import logo2 from "./Chainlink_Logo.svg.png";
import logo3 from "./pngegg.png";
import logo4 from "./nextjs-icon.png";
import logo5 from "./nestjs_icon.png";

export default function Toolspartners() {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
            Our popular tools and partners
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src={logo2}
              alt="Chainlink"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src={logo1}
              alt="TripleV"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src={logo3}
              alt="Ethereum"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src={logo4}
              alt="Next Js"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src={logo5}
              alt="Nest Js"
              width={300}
              height={100}
            />
          </div>
        </div>
      </div>
    )
  }
  