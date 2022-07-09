import Head from "next/head";

import S3Image from "../lib/components/S3Image";
import { listObjectKeys } from "../lib/s3";
import { useEffect, useState } from "react";

export default function Home() {
  const [objectData, setObjectData] = useState([]);

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

      setObjectData(objects);
    }

    fetchAndSetObjectData();
  }, []);

  function claimToSession(objectKey) {
    // show popup with data form, prefilled with previous data entered
  }

  return (
    <div className="p-2 max-w-xl mx-auto">
      <Head>
        <title>Take Ike's Stuff</title>
      </Head>
      <h1>Take My Stuff Please</h1>
      <h4>Mostly** Free Stuff that YOU COULD OWN</h4>

      {objectData.map((obj) => (
        <div key={obj.key} className="border-b-2 border-black pb-2 mb-10">
          <S3Image imageKey={obj.key} className="h-[300px]" />
          <button onClick={() => claimToSession(obj.key)}>CLAIM</button>
          <span className="mx-5">{obj.label}</span>
        </div>
      ))}
    </div>
  );
}
