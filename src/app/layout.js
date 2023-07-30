import './globals.css'
import { Inter } from 'next/font/google'
import dotenv from 'dotenv'
import ReactReducerProvider from './ReactReducer'
import QueryProvider from './QueryProvider'
import AuthProvider from './components/AuthProvider'


dotenv.config()
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  manifest:"/manifest.json"
 
}


export default function RootLayout({ children }) {
  return (
  
    <html lang="en">
      <body className={inter.className}>
      <AuthProvider>
    <QueryProvider>
      <ReactReducerProvider>
            {children}
            </ReactReducerProvider>
        </QueryProvider>
    </AuthProvider>
      </body>
    </html>
    
  )
}
