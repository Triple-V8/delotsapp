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
     <meta
      property="og:image"
      content="./Components/vlogo.png"
    />
        <body className={inter.className}>{children}</body>
      </html>
    
  )
}
