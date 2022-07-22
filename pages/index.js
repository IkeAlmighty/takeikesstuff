import Head from "next/head";
import Link from "next/link";

import S3Image from "../lib/components/S3Image";
import ClaimModal from "../lib/components/ClaimModal";
import Item from "../lib/components/Item";

import { listObjectKeys } from "../lib/s3";
import { useEffect, useState } from "react";
import { getSession } from "../lib/session";

export default function Home() {
  const [objectData, setObjectData] = useState([]);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimObjectKey, setClaimModalObjectKey] = useState(undefined);

  useEffect(() => {
    async function fetchAndSetObjectData() {
      const keys = await listObjectKeys();
      const apiRes = await fetch("/api/db/s3ObjectData");
      const objects = await apiRes.json();

      // add keys that are not in database to render list
      keys.forEach((key) => {
        if (objects.filter((ob) => ob._id === key).length === 0) {
          objects.push({ key });
        }
      });

      const unclaimed = await objects.filter((ob) => !ob.claimedBy);

      setObjectData(unclaimed);
    }

    fetchAndSetObjectData();
  }, []);

  function initClaimModal(objectKey) {
    setClaimModalObjectKey(objectKey);
    setShowClaimModal(true);
  }

  async function confirmClaim(objectKey) {
    setShowClaimModal(false);

    let addClaimResponse = await fetch(
      `/api/users/addclaim?objectKey=${objectKey}`
    );

    // send claimResponse error to alert box
    if (!addClaimResponse.ok) {
      alert(await addClaimResponse.text());
    } else {
      // remove the item from the ui:
      setObjectData(objectData.filter((obj) => obj.key !== objectKey));
    }
  }

  return (
    <div className="p-2 max-w-xl mx-auto">
      <Head>
        <title>Take Ike's Stuff</title>
      </Head>

      <div className="w-full text-right">
        <Link href="/myclaims">
          <a className="text-blue-700 px-1">See Your Items</a>
        </Link>
      </div>

      <h1>Take My Stuff Please</h1>
      <h4>Mostly** Free Stuff that YOU COULD OWN</h4>

      {objectData.map((obj) => (
        <Item
          key={obj._id}
          objectData={obj}
          onClaim={(key) => initClaimModal(key)}
        />
      ))}

      <ClaimModal
        objectKey={claimObjectKey}
        visible={showClaimModal}
        onClaim={(objectKey) => confirmClaim(objectKey)}
        onCancel={() => setShowClaimModal(false)}
      />
    </div>
  );
}
