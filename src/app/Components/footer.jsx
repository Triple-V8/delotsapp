
'use client';

import { Footer } from 'flowbite-react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function Footers() {
  return (
    <Footer container className="text-danger">
      <div className="w-full text-center text-danger">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between text-danger">
          <Footer.Brand
            href="#"
            src= "./vlogo.png"
            alt="Flowbite Logo"
            className="text-danger"
            name=" Delot"
          />
          <Footer.LinkGroup className='text-danger'>
            <Footer.Link href="#" className='ms-2 me-2'><span className="omoor">How to</span></Footer.Link>
            <Footer.Link href="#" className='ms-2 me-2'><span className="omoor">Features</span></Footer.Link>
            <Footer.Link href="#" className='ms-2 me-2'><span className="omoor">Categories</span></Footer.Link>
            <Footer.Link href="#" className='ms-2 me-2'><span className="omoor">About</span></Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="  3plev.eth" year={2024} className="text-danger" />
        <div className="mt-4 flex space-x-6 sm:mt-0 justify-content-center">
            <Footer.Icon href="#" icon={BsTwitter} className="text-danger"/>
            <Footer.Icon href="#" icon={BsGithub} className="text-danger" />
          </div>
      </div>
    </Footer>
  );
}
