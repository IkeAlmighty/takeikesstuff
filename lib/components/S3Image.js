import { useEffect, useState } from "react";
import { fetchImageUrl } from "../s3";
import Image from "next/image";

// FIXME: this component needs updated so that it can work optionally
// with rounded edges, ect
export default function S3Image({ imageKey, alt, className }) {
  const [url, setURL] = useState(undefined);

  useEffect(() => {
    if (!imageKey) return;

    async function _fetchImageUrl() {
      const { url } = await fetchImageUrl(imageKey);
      setURL(url);
    }

    _fetchImageUrl();
  }, [imageKey]);

  return (
    // Use Nextjs Image tag because it won't build otherwise
    <div
      style={{
        position: "relative",
      }}
      className={className}
    >
      <Image
        src={url ? url : "/404.png"}
        alt={alt ? alt : "image did not load"}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}
