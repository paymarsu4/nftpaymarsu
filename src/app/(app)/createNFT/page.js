"use client";
import { useContext, useState, useEffect } from "react";
import useSWR from 'swr'
import Header from '@/app/(app)/Header'
import { useRouter } from "next/navigation";
import axios from "axios";
import customAxios from "@/lib/axios";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/pinata";
import marketplace from "../../marketplace.json";
import { ethers } from "ethers";
import { WalletContext } from "@/app/context/wallet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@/app/global.css'
import styles from "./sellNFT.module.css"
import Button from "@/components/Button";
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import { useAuth } from "@/hooks/auth";
import { useNfts } from "@/hooks/nft";

export default function CreateNFT() {
  const router = useRouter();
  const { user } = useAuth({ middleware: 'auth' })
  const { saveNft } = useNfts({
      middleware: 'auth:sanctum',
  })
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });

  const [fileURL, setFileURL] = useState();
  const [pinataURL, setPinataURL] = useState("");
  const [message, updateMessage] = useState("");
  const [btn, setBtn] = useState(false);
  const [btnContent, setBtnContent] = useState("Submit");
  const [errors, setErrors] = useState([]);
  const [convertedPrice, setConvertedPrice] = useState(null);
  const { isConnected, signer } = useContext(WalletContext);
  const user_id = user.id;
  const college_id = user.college_id;
  // console.log(user)

  const { data: paymentcategories, error } = useSWR('/api/paymentcategories/getforopt', () =>
    customAxios.get('/api/paymentcategories/getforopt')
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            if (error.response.status !== 409) throw error
        }),
  )

  useEffect(() => {
      // console.log(paymentcategories)
      const convertPriceToFiat = async () => {
        if (formParams.price > 0) {
          const conversionRate = await getConversionRate('matic-network', 'php'); // Example: 'polkadot' to 'usd'
          if (conversionRate) {
            setConvertedPrice(formParams.price * conversionRate);
          }
        }
      };
      
      convertPriceToFiat();
  }, [paymentcategories, formParams.price]);

  const categories = [
    { value: "org_fee", label: "Org. Fee" },
    { value: "intramural_fee", label: "INTRAMURAL FEE" },
    { value: "paf", label: "PAF" },
    { value: "others", label: "Others" },
  ];

  const getConversionRate = async (crypto, fiat) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
      console.log('API Response:', response.data); // Log the response
      if (response.data && response.data[crypto] && response.data[crypto][fiat]) {
        return response.data[crypto][fiat];
      } else {
        console.error('Invalid response structure:', response.data);
        return null;
      }
      // return response.data[crypto][fiat];
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      return null;
    }
  };

  async function getPC(pcId) {
    if (pcId!=""){
      const category = await customAxios.get('/api/paymentcategories/show/'+pcId)
          .then(res => res.data)
          .catch(error => {
              console.log(error)
              if (error.response.status !== 409) throw error
          })
      updateFormParams({ category_id: category.id, name: category.category, description: category.description })
      console.log(category)
    } else{
      updateFormParams({ name: "", description: "" })
    }
  }

  async function onFileChange(e) {
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.set("file", file);
      setBtn(false);
      updateMessage("Uploading image... Please don't click anything!");
      const response = await uploadFileToIPFS(data);
      if (response.success === true) {
        setBtn(true);
        updateMessage("");
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      toast.error("Error during file upload. Please try again.");
      console.log("Error during file upload...", e);
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price, category_id } = formParams;
    if (!category_id || !name || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      setBtnContent("Submit");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      user_id,
      college_id,
      category_id,
      image: fileURL,
      marketplace_address: marketplace.address
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        saveNft({
          user_id,
          college_id,
          category_id,
          name,
          description,
          price,
          image_url: fileURL,
          pinata_url: response.pinataURL,
          marketplace_address: marketplace.address,
          setErrors,
        })

        toast.success("NFT Data Successfully created!");
        setPinataURL(response.pinataURL)
        return response.pinataURL;
      }
    } catch (e) {
      toast.error("Error saving data. Please try again.");
      console.log("Error uploading JSON metadata: ", e);
    }
  }

  async function listNFT(e) {
    try {
      setBtnContent("Processing...");
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      updateMessage("Uploading NFT...Please dont click anythying!");

      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.parseEther(formParams.price);

      toast("Opening your wallet...");
      await wait(1000);

      let transaction = await contract.createToken(metadataURL, price);
      await transaction.wait();

      setBtnContent("Submit");
      setBtn(false);
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "", category_id: "" });
      // alert("Successfully created your NFT Payment!");
      toast.success("Successfully created your NFT Payment!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (e) {
      // alert("Upload error", e);
      console.log(e)
      updateMessage("");
      toast.error("Error creating NFT. Please try again.");
      setBtnContent("Submit");
      setTimeout(() => router.push("/createNFT"), 2000);
    }
  }

  async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <>
    <Header title="Create Payment"/>
    <ToastContainer position="top-center" autoClose="2000" />
    <div className="py-6">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                {isConnected ? (
                  <>
                  <div className="mt-4">
                    <Label htmlFor="category_id">Category<span className="text-red-500">*</span></Label>
                    <Select 
                      id="category_id" 
                      name="category_id" 
                      className="block mt-1 w-full" 
                      options={paymentcategories}
                      selectLabel="Category"
                      onChange={(e) => {
                          getPC(e.target.value)
                        }
                      }
                      required
                    />
                    <InputError messages={errors.category_id} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
                    <TextArea
                      id="description"
                      className="block mt-1 w-full"
                      value={formParams.description}
                      onChange={(e) =>
                        updateFormParams({
                          ...formParams,
                          description: e.target.value,
                        })
                      }
                      rows="5"
                    />
                    <InputError messages={errors.description} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="price">Price ( in Polygon(MATIC) )<span className="text-red-500">*</span></Label>
                    <Input
                      id="price"
                      type="number"
                      value={formParams.price}
                      className="block mt-1 w-full"
                      onChange={(e) =>
                        updateFormParams({ ...formParams, price: e.target.value })
                      }
                      required
                    />
                    <InputError messages={errors.price} className="mt-2" />
                    {convertedPrice && (
                      <p className="mt-2 text-sm text-gray-800">
                        Converted Price: <span className="font-semibold">PHP {convertedPrice.toFixed(2)}</span>
                        <br></br>
                        Conversion provided by <a href="https://www.coingecko.com/en/coins/polygon/php" target="blank" className="font-semibold text-blue-500">CoinGecko</a>
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="file">Upload Image<span className="text-red-500">*</span></Label>
                    <Input
                        id="file"
                        type="file"
                        className="block mt-1 w-full"
                        onChange={onFileChange}
                        required
                    />
                    <InputError messages={errors.file} className="mt-2" />
                  </div>
                  <div className="mt-4">
                  <div className="text-red-500 text-center">{message}</div>
                    <button
                      onClick={listNFT}
                      type="submit"
                      className={
                        btn
                          ? `${styles.btn} ${styles.activebtn}`
                          : `${styles.btn} ${styles.inactivebtn}`
                      }
                    >
                      {btnContent === "Processing..." && (
                        <span className={styles.spinner} />
                      )}
                      {btnContent}
                    </button>
                  </div>
                  </>

                ) : (
                      <div>Connect Your Wallet to Continue...</div>
                )}
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
