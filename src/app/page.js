import Image from 'next/image';
import LoginLinks from '@/app/LoginLinks';

export const metadata = {
    title: 'PayMarSU',
};

const Home = () => {
    return (
        <>
            <div className="relative flex items-top justify-center min-h-screen bg-yellow-100 sm:items-center sm:pt-0">
                <LoginLinks />

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <Image src={require("../../public/paymarsu.png")} alt="PayMarSU Logo" />
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-6">
                        <h5 className="text-xl">Your one stop payment portal for Student Organization Fees.</h5>
                    </div>

                    <div className="mt-8 bg-white dark:bg-yellow-200 overflow-hidden shadow sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4">Blockchain Payment</h2>
                            <p className="text-gray-700 mb-4">
                                A secure method for transferring digital money directly between users without involving banks. Transactions are verified by a network of computers and recorded on a tamper-proof digital ledger.
                            </p>

                            <h2 className="text-lg font-bold mb-4">Metamask Wallet</h2>
                            <p className="text-gray-700 mb-4">
                                A secure digital wallet that lets users store, manage, and interact with digital money. Accessible via browser extension or mobile app, it enables seamless transactions, empowering users to send, receive, and track their digital assets efficiently.
                            </p>

                            <h2 className="text-lg font-bold mb-4">POL Token</h2>
                            <p className="text-gray-700 mb-4">
                                POL is a type of digital money used on the Polygon blockchain. It helps pay for transactions, like sending data or tokens.
                            </p>

                            <h2 className="text-lg font-bold mb-4">Gas Fees</h2>
                            <p className="text-gray-700 mb-4">
                                Small amounts of POL tokens used to process transactions on the Polygon blockchain. They maintain the network's security and efficiency, with fees depending on transaction size and network activity.
                            </p>

                            <h2 className="text-lg font-bold mb-4">Metamask Public Address</h2>
                            <p className="text-gray-700">
                                A unique string of characters used to identify your wallet on the blockchain. It allows others to send cryptocurrency to your wallet. The public address is safe to share, as it only enables receiving transactions, but it does not grant access to your funds or wallet.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 sm:items-center sm:justify-between">
                        <div className="text-center text-sm text-gray-500 sm:text-left">
                            {/* Additional content can go here */}
                        </div>

                        <div className="ml-4 text-center text-sm text-gray-500 sm:text-right sm:ml-0">
                            2024 &copy; PayMarSU
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
