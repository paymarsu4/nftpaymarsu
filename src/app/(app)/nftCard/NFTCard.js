import GetIpfsUrlFromPinata from "@/lib/utils";
import Image from "next/image";
import styles from "./NFTCard.module.css";
import Link from "next/link";

export default function NFTCard({ item }) {
  const IPFSUrl = GetIpfsUrlFromPinata(item.image);
  // console.log(item);

  const limitedDescription =
    item.description.length > 100
      ? item.description.substring(0, 100) + "..."
      : item.description;

  return (
    <div className={styles.tile}>
      <div className={styles.imageContainer}>
        <Image src={item.image} alt="NFT Image" width={500} height={360} />
      </div>
      <div className={styles.overlay}>
        <Link href={`/nft/${item.tokenId}`} className="inline-flex items-center px-4 py-2 bg-red-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150">
          <strong>{item.name}</strong>
          {/* <p>{limitedDescription}</p> */}
        </Link>
      </div>
    </div>
  );
}
