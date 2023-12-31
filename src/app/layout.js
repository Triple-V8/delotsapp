import './globals.css'
import { Inter } from 'next/font/google'

<link rel="icon" href="./favicon.ico" sizes="any" />

const inter = Inter({ subsets: ['latin'] })




export default function RootLayout({ children }) {
  return (
    
      <html lang="en">
         <meta
      property="description"
      content="Blockchain-powered lottery, unleashing the future of gaming!"
    />
    <title>Delots</title>
    <meta property="og:title" content="Delots" />
     <meta
      property="og:image"
      content="./Components/vlogo.png"
    />
    <meta name="twitter:card" content="./Components/vlogo.png" />
  <meta name="twitter:title" content="Delots" />
  <meta name="twitter:description" content="Blockchain-powered lottery, unleashing the future of gaming!" />
  <meta name="twitter:image" content="./Components/vlogo.png" />
        <body className={inter.className}>{children}</body>
      </html>
    
  )
}
