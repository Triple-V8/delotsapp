import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid'

const Categorycard = (props) => {
    return (
    <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
    <div className="p-8 sm:p-10 lg:flex-auto">
    <h3 className="text-2xl font-bold tracking-tight text-gray-900">{props.info.title}</h3>
    <div className="mt-10 flex items-center gap-x-4">
        <h4 className="flex-none text-sm font-semibold leading-6 text-red-600">What’s included</h4>
        <div className="h-px flex-auto bg-gray-100" />
    </div>
    <ul
        role="list"
        className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
    >
        {props.info.features.map((feature) => (
        <li key={feature} className="flex gap-x-3">
            <CheckIcon className="h-6 w-5 flex-none text-red-600" aria-hidden="true" />
            {feature}
        </li>
        ))}
    </ul>
    </div>
    <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
        <div className="mx-auto max-w-xs px-8">
       <p className="mt-6 flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-gray-900">{props.info.biggi}</span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">winner</span>
        </p>
        <a
            href={props.info.link}
            className="mt-10 block w-full rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
            Create game
        </a>
        <p className="mt-6 text-xs leading-5 text-gray-600">
            All activities are processed and published on the blockchain
        </p>
        </div>
    </div>
    </div>
    </div>)
}

export default Categorycard;