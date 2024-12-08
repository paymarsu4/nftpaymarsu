import { Nunito } from 'next/font/google'
import '@/app/global.css'
import { WalletContextProvider } from './context/wallet'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <WalletContextProvider>
                <body className="antialiased">{children}</body>
            </WalletContextProvider>
        </html>
    )
}

export const metadata = {
    title: 'PayMarSU',
}

export default RootLayout
