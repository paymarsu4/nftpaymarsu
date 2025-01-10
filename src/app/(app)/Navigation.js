import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { WalletContext } from '../context/wallet'
import { BrowserProvider } from 'ethers'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { useContext, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navigation = ({ user }) => {
    const { logout } = useAuth()

    const [open, setOpen] = useState(false)

    const {
        isConnected,
        setIsConnected,
        userAddress,
        setUserAddress,
        signer,
        setSigner,
      } = useContext(WalletContext);

    const connectWallet = async () => {
        if (!window.ethereum) {
            // throw new Error("Metamask is not installed");
            // throw new Error("No Wallet is installed.");
            toast.error("No Wallet is installed.");
        }
    
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
            const accounts = await provider.send("eth_requestAccounts", []);
            setIsConnected(true);
            setUserAddress(accounts[0]);
            const network = await provider.getNetwork();
            const chainID = network.chainId;
            const amoyNetworkId = "80002";
    
            if (chainID.toString() !== amoyNetworkId) {
                // alert("Please switch your MetaMask to Amoy network");
                toast.error("Please switch your Wallet to Amoy network.");
                return;
            }
        } catch (error) {
            toast.error("Wallet Connection Error. Please Try again.");
            console.error("connection error: ", error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-100">
            <ToastContainer position="top-center" autoClose="2000" />
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={usePathname() === '/dashboard' || usePathname() === '/nft'}>
                                Dashboard
                            </NavLink>

                            {user?.user_type === 2 ? (
                                <>
                                <NavLink
                                    href="/createNFT"
                                    active={usePathname() === '/createNFT'}>
                                    Create Payment
                                </NavLink>
                                <NavLink
                                    href="/students"
                                    active={usePathname() === '/students'}>
                                    Students
                                </NavLink>
                                </>
                            ) : (
                                <></>
                            )
                            }
                            
                            {user?.user_type === 1 ? (
                                <>
                                <NavLink
                                    href="/users"
                                    active={usePathname() === '/users' || usePathname() === '/addUser' }>
                                    Users
                                </NavLink>
                                <NavLink
                                    href="/paymentcategories"
                                    active={usePathname() === '/paymentcategories'  || usePathname() === '/paymentcategoriesAdd'}>
                                    Payment Categories
                                </NavLink>
                                </>
                            ) : (
                                <></>
                            ) }
                            {user?.user_type === 2 || user?.user_type === 3 ? (
                                <>
                                <NavLink
                                    href="/profile"
                                    active={usePathname() === '/profile'}>
                                    Profile
                                </NavLink>
                                </>
                            ) : (
                                <></>
                            ) }
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        {user.user_type !== 1 ? (
                            <>
                                <button className="inline-flex items-center px-2 py-1 mr-4 bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
                                onClick={connectWallet}
                            >
                                {isConnected ? (
                                <>{userAddress?.slice(0, 8)}...{userAddress?.slice(34)}</>
                                ) : (
                                "Connect Wallet"
                                )}
                            </button>
                            </>
                        ) : (<></>) }
                        
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div>{user?.email}</div>

                                    <div className="ml-1">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            {/* Authentication */}
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={usePathname() === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                        {user?.user_type === 1 ? (
                            <>
                            <ResponsiveNavLink
                                href="/users"
                                active={usePathname() === '/users'}>
                                Users
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href="/paymentcategories"
                                active={usePathname() === '/paymentcategories'}>
                                Payment Categories
                            </ResponsiveNavLink>
                            </>
                        ) : (
                            <></>
                        )}

                        {user?.user_type === 2 ? (
                                <>
                                <ResponsiveNavLink
                                    href="/createNFT"
                                    active={usePathname() === '/createNFT'}>
                                    Create NFT
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href="/students"
                                    active={usePathname() === '/students'}>
                                    Students
                                </ResponsiveNavLink>
                                </>
                            ) : (
                                <></>
                            )
                            }

                        {user?.user_type === 2 || user?.user_type === 3 ? (
                            <>
                            <ResponsiveNavLink
                                href="/profile"
                                active={usePathname() === '/profile'}>
                                Profile
                            </ResponsiveNavLink>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 fill-current text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {user.user_type !== 1 ? (
                                <>
                                <ResponsiveNavButton onClick={connectWallet}>
                                    {isConnected ? (
                                    <>{userAddress?.slice(0, 8)}...{userAddress?.slice(34)}</>
                                    ) : (
                                    "Connect Wallet"
                                    )}
                                </ResponsiveNavButton>
                                </>
                            ) : (<></>) }
                            
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation