import { useEffect, useState } from "react";
import S3Image from "../components/S3Image";

export default function ClaimModal({ objectKey, visible, onClaim, onCancel }) {
  const [phone, setPhone] = useState("");

  async function processClaim() {
    const sessionApiResponse = await fetch("/api/users/session");
    if (!sessionApiResponse.ok) {
      // register claim under phone number
      let signInResponse = await fetch(`/api/users/signin?phone=${phone}`);
      if (signInResponse.status > 209) alert("Server Error");
    }

    onClaim(objectKey);
  }

  return (
    <div
      className={`${
        visible ? "block" : "hidden"
      } fixed w-full h-full top-0 left-0 bg-slate-800 text-white`}
    >
      <button
        className="left-0 m-3 px-5 bg-slate-700"
        onClick={() => onCancel()}
      >
        X
      </button>
      <div className="mx-auto p-3 max-w-xl">
        <S3Image imageKey={objectKey} alt="Image of item you wish to claim" />

        <div className="my-1">Phone Number:</div>
        <input
          type="phone"
          placeholder="0001231234"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-3 block text-black rounded"
        />

        {phone.length === 10 && (
          <button
            className="bg-slate-500 my-10 p-5 text-3xl font-mono"
            onClick={() => processClaim()}
          >
            Confirm Claim :&#41;
          </button>
        )}
      </div>
    </div>
  );
}
