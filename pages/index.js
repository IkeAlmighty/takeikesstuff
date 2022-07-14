import Head from "next/head";

import S3Image from "../lib/components/S3Image";
import ClaimModal from "../lib/components/ClaimModal";
import { listObjectKeys } from "../lib/s3";
import { useEffect, useState } from "react";

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

      const filtered = await filterClaimsFromObjects(objects);

      setObjectData(filtered);
    }

    fetchAndSetObjectData();
  }, []);

  async function filterClaimsFromObjects(objects) {
    // get the user session, if there is one:
    const getSessionResponse = await fetch("api/users/session");

    if (getSessionResponse.ok) {
      const session = await getSessionResponse.json();

      // filter out all the claims under this session's id

      let filtered = objects.filter((obj) => obj.claimedBy !== session._id);
      return filtered;
    }

    return objects; // return all the objects if there is no session
  }

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
      <h1>Take My Stuff Please</h1>
      <h4>Mostly** Free Stuff that YOU COULD OWN</h4>

      {objectData.map((obj) => (
        <div
          key={obj.key}
          className="border-2 border-black pb-2 mb-10 bg-zinc-200 rounded p-3"
        >
          <S3Image imageKey={obj.key} className="h-[300px] mb-3" />
          <div className="my-3">{obj.label}</div>
          <button
            className="bg-slate-100"
            onClick={() => initClaimModal(obj.key)}
          >
            CLAIM
          </button>
        </div>
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
