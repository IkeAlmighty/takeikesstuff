import { useEffect, useState } from "react";
import Item from "../lib/components/Item";
import S3Image from "../lib/components/S3Image";
import { getSession } from "../lib/session";

export default function Admin({ itemsByClaim }) {
  const [claimsInformation, setClaimsInformation] = useState({});

  useEffect(() => {
    async function loadSessionAndSetItems() {
      const apiClaimInfoResponse = await fetch(
        "/api/users/getClaimInformation"
      );

      if (apiClaimInfoResponse.ok) {
        const json = await apiClaimInfoResponse.json();
        setClaimsInformation(json);
      } else {
        alert(
          `${
            apiClaimInfoResponse.status === 401
              ? "Unauthorized!"
              : "server error"
          }`
        );
      }
    }

    loadSessionAndSetItems();
  }, []);

  return (
    <div className="mx-auto px-1 max-w-xl">
      <h1 className="my-20 mx-2">Claimed Items</h1>
      {Object.keys(claimsInformation).map((phone) => (
        <div>
          <div className="text-3xl">{phone}</div>
          {claimsInformation[phone].map((item) => {
            return <Item key={item.key} objectData={item} />;
          })}
        </div>
      ))}
    </div>
  );
}
