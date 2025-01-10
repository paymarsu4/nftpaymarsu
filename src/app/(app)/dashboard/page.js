"use client";

import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContext } from "@/app/context/wallet";
import MarketplaceJson from "../../marketplace.json";
import Header from '@/app/(app)/Header'
import styles from "./dashboard.module.css";
import NFTCard from "../nftCard/NFTCard";
import { useAuth } from "@/hooks/auth";
import { usePaidNfts } from "@/hooks/paidnft";
// export const metadata = {
//     title: 'PayMarSU - Dashboard',
// }

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const [items, setItems] = useState();
    const { isConnected, signer } = useContext(WalletContext);
    const { paidnfts, error } = usePaidNfts({
        middleware: 'auth:sanctum',
    })
    // console.log(signer)

    async function checkPaidNFT(paid_nfts, usertype, tokenId) {
        let paid = 0;
        if (paid_nfts?.length > 0) {
            paid_nfts.map((value, index) => {
                if (usertype===3 && tokenId===value.token_id) {
                    paid = 1;
                }
            })
        }
        return paid;
    }

    async function getNFTitems() {
        const itemsArray = [];
        if (!signer) return;
        let contract = new ethers.Contract(
            MarketplaceJson.address,
            MarketplaceJson.abi,
            signer
        );

        if (user?.user_type!=1) {
            toast("Loading NTFs...");
            await wait(2000);
        }
        
        let transaction = await contract.getAllListedNFTs();
        
        for (const i of transaction) {

            const tokenId = parseInt(i.tokenId);
            const tokenURI = await contract.tokenURI(tokenId);
            const meta = (await axios.get(tokenURI)).data;
            const price = ethers.formatEther(i.price);

            const chkPaid = await checkPaidNFT(paidnfts, user?.user_type, tokenId);

            if (meta && meta.college_id == user.college_id && chkPaid===0) {
                const item = {
                    price,
                    tokenId,
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                };
    
                itemsArray.push(item);
            }
        }
        return itemsArray;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsArray = await getNFTitems();
                setItems(itemsArray);
                // console.log(itemsArray);
            } catch (error) {
                toast.error("Error Loading NTFs...");
                console.error("Error fetching NFT items:", error);
            }
        };

        fetchData();
    }, [isConnected]);

    async function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }    

    return (
        <>
            <Header title="Dashboard" />
            <ToastContainer position="top-center" autoClose="2000" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {user?.user_type!==1 ? (
                            <>
                            <div className="p-6 bg-white border-b border-gray-200">
                                {user?.user_type==3 ? "Unpaid Financial Obligations" : "Created NFT" }
                            </div>
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className={styles.innerContainer}>
                                    <div className={styles.content}>
                                        {isConnected ? (
                                        <>
                                        <div className={styles.nftSection}>
                                            {items?.length > 0 ? (
                                            <div className={styles.nftGrid}>
                                                {items?.map((value, index) => (
                                                <NFTCard item={value} key={index} />
                                                ))}
                                            </div>
                                            ) : (
                                            <div className={styles.noNFT}>{user?.user_type==3 ? "No Unpaid Financial Obligations yet" : "No Created NFT yet" }</div>
                                            )}
                                        </div>
                                        </>
                                    ) : (
                                        <div className={styles.notConnected}>You are not connected...</div>
                                    )}
                                    </div>
                                </div>
                            </div>
                            </>
                        ) : (
                            <>
                            <div className="p-6 bg-white border-b border-gray-200">
                                You're logged in!
                            </div>
                            </>
                        ) }
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard