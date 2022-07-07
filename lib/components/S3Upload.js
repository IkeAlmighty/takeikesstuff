import { useRef, useState } from "react";
import { uploadImage } from "../s3";

export default function S3Upload({ label, onUpload, className, style }) {
  const [imageUploading, setImageUploading] = useState(false);

  const fileupload = useRef(null);
  return (
    <>
      {/* Because it's hard to style file inputs, we use a button input
      as a proxy and hide the actual file input: */}
      <input
        disabled={imageUploading}
        className={className}
        style={
          style && !className
            ? style
            : { display: "block", margin: "auto auto" }
        }
        type="button"
        value={
          label
            ? imageUploading
              ? "Uploading Image..."
              : label
            : "Upload Image"
        }
        onClick={() => {
          setImageUploading(true);
          fileupload.current.click();
        }}
      />
      <input
        style={{ display: "none" }}
        ref={fileupload}
        type="file"
        accept="image/png, image/jpeg"
        onChange={async (e) => {
          let res = await uploadImage(e);
          setImageUploading(false);
          if (res.ok) {
            onUpload(e.target.value.split("\\").pop());
          }
        }}
      />
    </>
  );
}
