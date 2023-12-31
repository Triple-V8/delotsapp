import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Onchain processing',
    description:
      'Experience transparent and secure lottery draws with our onchain processing, ensuring provably fair results through blockchain technology',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Fast payout',
    description:
      'Get your winnings instantly with our lightning-fast payout system, powered by blockchain for immediate and hassle-free prize delivery',
    icon: LockClosedIcon,
  },
  {
    name: 'Activity logs',
    description:
      'Stay informed with detailed activity logs, providing complete transparency into all lottery activities for your peace of mind',
    icon: ArrowPathIcon,
  },
  {
    name: 'User friendly',
    description:
      'Our user-friendly platform makes playing and winning blockchain lotteries a breeze, with a seamless and intuitive experience for all',
    icon: FingerPrintIcon,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-red-600">Decentralized lottery</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Experience transparency and security in every lottery draw
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          At Delots, our mission is to bring trust and integrity to the lottery industry through blockchain innovation
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
