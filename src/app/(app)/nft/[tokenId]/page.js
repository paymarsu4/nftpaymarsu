"use client";
import { WalletContext } from "@/app/context/wallet";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import MarketplaceJson from "../../../marketplace.json";
import { ethers } from "ethers";
import axios from "axios";
import GetIpfsUrlFromPinata from "@/lib/utils";
import Image from "next/image";
import styles from "./nft.module.css";
import Header from '@/app/(app)/Header'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/auth";
import { usePaidNfts } from "@/hooks/paidnft";
import Button from "@/components/Button";
import customAxios from "@/lib/axios";

export default function NFTPage() {
  const params = useParams();
  const tokenId = params.tokenId;
  const { user } = useAuth({ middleware: 'auth' })
  const { savePaidNFT } = usePaidNfts({
    middleware: 'auth:sanctum',
  })
  const [item, setItem] = useState();
  const [msg, setmsg] = useState();
  const [btnContent, setBtnContent] = useState("Pay Now");
  const [errors, setErrors] = useState([]);
  const { isConnected, userAddress, signer } = useContext(WalletContext);
  const router = useRouter();

  async function getNFTData() {
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );
    let tokenURI = await contract.tokenURI(tokenId);
    // console.log(tokenURI);
    const listedToken = await contract.getNFTListing(tokenId);
    // tokenURI = GetIpfsUrlFromPinata(tokenURI);
    // console.log(tokenURI);
    const meta = (await axios.get(tokenURI)).data;
    const item = {
      price: meta.price,
      tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    return item;
  }

  useEffect(() => {
    async function fetchData() {
      if (!signer) return;
      try {
        const itemTemp = await getNFTData();
        setItem(itemTemp);
      } catch (error) {
        toast.error("Error fetching NFT items. Please reload.");
        console.error("Error fetching NFT items:", error);
        setItem(null);
      }
    }

    fetchData();
  }, [isConnected]);

  async function buyNFT() {
    try {
      if (!signer) return;
      let contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );

      const salePrice = ethers.parseUnits(item.price, "ether").toString();
      setBtnContent("Processing...");
      setmsg("Connecting to wallet... Please Wait.");
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      // Send payment details to backend for email receipt
      const paymentDetails = {
        user_id: user?.id,
        item_category: item.name,
        item_description: item.description,
        paid_price: item.price,
        token_id: tokenId,
        transaction_id: transaction.hash,
        wallet_address_from: signer.address,
        wallet_address_to: item.seller,
      };

      await customAxios.post('/api/send-payment-receipt', paymentDetails);

      savePaidNFT({
        user_id: user?.id,
        paid_price: item.price,
        token_id: tokenId,
        wallet_address_from: signer.address,
        wallet_address_to: item.seller,
        setErrors,
      })
      // alert("You successfully paid!");
      toast.success("You successfully paid!");
      setmsg("");
      setBtnContent("Pay Now");
      router.push("/profile");
    } catch (e) {
      console.log("Buying Error: ", e);
      // alert("Something went wrong. Please try again!");
      toast.error("Something went wrong. Please try again!");
      setmsg("");
      setBtnContent("Pay Now");
    }
  }

  return (
    <>
    <Header title="NFT - Financial Obligation Details"/>
    <ToastContainer position="top-center" autoClose="2000" />
    <div className="py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <div className="col-span-1 p-5">
              <Image src={item?.image} alt="" width={400} height={520} />
            </div>
            <div className="col-span-1 p-5">
              <div className="mt-10"></div>
              <h2 className="text-lg mb-5">Category: <span className="text-red-700">{item?.name}</span></h2>
              <h2 className="text-lg mb-5">Description: <span className="text-red-700">{item?.description}</span></h2>
              <h2 className="text-lg mb-5">Price: <span className="text-red-700">{item?.price} POL</span></h2>
              <h2 className="text-lg mb-5">Creator address: <span className="text-red-700">{item?.seller}</span></h2>
              <div className="">
                <div className="text-red-500 text-lg mb-5">{msg}</div>
                {userAddress.toLowerCase() === item?.seller.toLowerCase() ? (
                  <div className="text-green-600 text-lg">{user?.user_type==3 ? "You already paid!" : "You created this NFT." }</div>
                ) : (
                  <Button type="button" className="h-12 text-lg"
                    onClick={() => {
                      buyNFT();
                    }}
                  >
                    {btnContent === "Processing..." && (
                      <span className={styles.spinner} />
                    )}
                    {btnContent}
                  </Button>
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
