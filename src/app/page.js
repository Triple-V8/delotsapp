"use client"; 
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Header from './Components/Header';
import Categories from './Components/categories';
import Features from './Components/features';
import Toolspartners from './Components/tools_partners';
import Footers from './Components/footer';

export default function page() {
  return (
    <div className='page'>
      <Header/>
      <Features/>
      <Categories/>
      <Toolspartners/>
      <Footers/>
    </div>
  )
}

