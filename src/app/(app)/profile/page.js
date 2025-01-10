"use client";

import { WalletContext } from "@/app/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../../marketplace.json";
import styles from "./profile.module.css";
import Header from "../Header";
import axios from "axios";
import NFTCard from "../nftCard/NFTCard";
import { useAuth } from "@/hooks/auth";

export default function Profile() {
  const { user } = useAuth({ middleware: 'auth' })
  const [items, setItems] = useState();
  const [totalPrice, setTotalPrice] = useState("0");
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  async function getNFTitems() {
    let sumPrice = 0;
    const itemsArray = [];
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    let transaction = await contract.getMyNFTs();

    for (const i of transaction) {
      const tokenId = parseInt(i.tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = (await axios.get(tokenURI)).data;
      const price = ethers.formatEther(i.price);

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
      sumPrice += Number(price);
    }
    return { itemsArray, sumPrice };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { itemsArray, sumPrice } = await getNFTitems();
        setItems(itemsArray);
        setTotalPrice(sumPrice);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
      <>
          <Header title="Profile" />
          <div className="py-6">
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                  <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                      <div className="p-6 bg-white border-b border-gray-200">
                        <div className={styles.innerContainer}>
                          <div className={styles.content}>
                            {isConnected ? (
                              <>
                                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                                  <div className="col-span-1">
                                    <span className="text-md">Name: <span className="text-lg">{user?.first_name+ ' '+ user?.last_name}</span></span>
                                  </div>
                                  <div className="col-span-1">
                                    {user?.user_type==1 ? (
                                      <>
                                      <span className="text-md">Student ID Number: <span className="text-lg">{user?.student_id_no}</span></span>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-md">Wallet Address: <span className="text-lg">{userAddress}</span></span>
                                  </div>
                                  <div className="col-span-1">
                                    <span className="text-md">{user?.user_type==3 ? "Number of Paid Financial Obligations:" : "Number of Created NFTs:" }</span>
                                    <span className="text-lg">{items?.length}</span>
                                  </div>
                                  <div className="col-span-1 text-end">
                                    <span className="text-md">Total Value: </span>
                                    <span className="text-lg">{totalPrice} POL</span>
                                  </div>
                                </div>

                                <div className={styles.nftSection}>
                                  <h2 className="text-lg mb-2">{user?.user_type==3 ? "Paid Financial Obligations" : "List of created Financial Obligations" }</h2>
                                  {items?.length > 0 ? (
                                    <div className={styles.nftGrid}>
                                      {items?.map((value, index) => (
                                        <NFTCard item={value} key={index} />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className={styles.noNFT}>{user?.user_type==3 ? "No Paid Financial Obligations yet" : "No Created NFT yet" }</div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className={styles.notConnected}>You are not connected...</div>
                            )}
                          </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
}
