import { Libre_Franklin } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'
import Link from 'next/link'

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
})

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={libre_franklin.variable}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
          <header className="bg-gray-950 text-white py-6 px-6 md:px-10">
            <div className="container mx-auto flex items-center">
              <Link href="/" className="flex items-center w-1/4" prefetch={false}>
                <span className="text-xl font-bold">Xodo Auto Import</span>
              </Link>
              <nav className="flex-grow flex justify-center items-center space-x-6 w-1/2">
                <Link href="/" className="hover:underline" prefetch={false}>
                  Home
                </Link>
                <Link href="/inventory" className="hover:underline" prefetch={false}>
                  Inventario
                </Link>
                <Link href="/about" className="hover:underline" prefetch={false}>
                  Acerca de
                </Link>                
              </nav>
              <div className="w-1/4"></div>
            </div>
          </header>
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}