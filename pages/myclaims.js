import { useEffect, useState } from "react";
import S3Image from "../lib/components/S3Image";
import { getSession } from "../lib/session";

import Item from "../lib/components/Item";

import Link from "next/link";

export default function MyClaims() {
  const [phoneInputFieldType, setPhoneInputFieldType] = useState("password");
  const [claimedItems, setClaimedItems] = useState([]);
  const [phone, setPhone] = useState("");

  async function removeItemFromClaims(key) {
    const deleteClaimResponse = await fetch("/api/users/removeclaim", {
      method: "DELETE",
      body: JSON.stringify({ _id: key }),
    });

    // update ui
    if (deleteClaimResponse.ok) {
      setClaimedItems(claimedItems.filter((item) => item._id !== key));
    }
  }

  async function signInAndLoadItems() {
    const signInResponse = await fetch(`/api/users/signin?phone=${phone}`);

    await loadClaimsIfSession();
  }

  async function loadClaimsIfSession() {
    // if there is a session logged in already, then
    // go ahead and fetch the claims for it:
    const session = await getSession();

    if (session) {
      const claimsApiResponse = await fetch("/api/users/claims");

      if (claimsApiResponse.ok) {
        const claims = await claimsApiResponse.json();

        setClaimedItems(claims);
      }
    }
  }

  useEffect(() => {
    // FIXME: someone could edit this line in client and add weird non existant phone numbers
    if (phone.length === 10) {
      signInAndLoadItems();
    }
  }, [phone]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="p-2 m-1 text-right text-blue-600">
        <Link href="/">
          <a>View Unclaimed Items</a>
        </Link>
      </div>
      <div className="my-10">
        <div className="p-2 m-1">Your Phone Number: </div>
        <input
          className="p-2 m-1"
          type={`${phoneInputFieldType}`}
          placeholder="xxxyyyzzzz"
          onChange={(e) => setPhone(e.target.value)}
        />
        <div
          onClick={() =>
            setPhoneInputFieldType(
              `${phoneInputFieldType === "password" ? "text" : "password"}`
            )
          }
          className="mx-10 inline-block cursor-pointer text-blue-600"
        >
          {phoneInputFieldType === "password" ? "view" : "hide"}
        </div>
      </div>

      {claimedItems.map((item) => (
        <Item
          key={item._id}
          objectData={item}
          onRemove={(key) => removeItemFromClaims(key)}
        />
      ))}
    </div>
  );
}
