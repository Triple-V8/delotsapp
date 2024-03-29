import './globals.css'
import { Inter } from 'next/font/google'

<link rel="icon" href="./favicon.ico" sizes="any" />

const inter = Inter({ subsets: ['latin'] })




export default function RootLayout({ children }) {
  return (
    
      <html lang="en">
         <meta
          property="description"
          content="Blockchain-powered lottery, unleashing the future of lotteries!"
        />
        <title>Delots</title>
        <meta property="og:title" content="Delots" />
        <meta name="image" content="./vlogo.png" />        
        <meta
          property="og:image"
          content="./vlogo.png"
        />
        <meta name="twitter:card" content="./vlogo.png" />
        <meta name="twitter:title" content="Delots" />
        <meta name="twitter:description" content="Blockchain-powered lottery, unleashing the future of lotteries!" />
        <meta name="twitter:image" content="./vlogo.png" />

        <body className={inter.className}>{children}</body>
      </html>
    
  )
}
