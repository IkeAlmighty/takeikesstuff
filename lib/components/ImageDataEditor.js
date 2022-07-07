import { useState } from "react";
import S3Image from "../components/S3Image";

export default function ImageDataEditor({ imageKey, label, onSave, onDelete }) {
  const [labelText, setLabelText] = useState(label || "");

  return (
    <div className="m-1 inline-block rounded p-5 border-l-2 border-b-2">
      <S3Image imageKey={imageKey} className="h-[200px]" />
      <input
        className="p-2 m-2 block border-2 rounded"
        type="text"
        placeholder="label"
        value={labelText}
        onChange={(e) => setLabelText(e.target.value)}
      />
      <button
        className="m-2 py-1 float-left"
        onClick={() => onSave(imageKey, labelText)}
      >
        Save
      </button>
      <button
        className="m-2 py-1 float-right"
        onClick={() => onDelete(imageKey)}
      >
        Delete
      </button>
    </div>
  );
}
