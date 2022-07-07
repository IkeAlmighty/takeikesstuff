import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Upload() {
  const video = useRef();
  const canvas = useRef();

  const [mode, setMode] = useState("video");

  useEffect(() => {
    async function startVideo() {
      // start video feedback so that user can aim camera:
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        let { width, height } = stream.getTracks()[0].getSettings();
        canvas.current.width = window.innerWidth;
        canvas.current.height = (window.innerWidth / width) * height;

        video.current.srcObject = stream;
      } catch (err) {
        alert(err);
      }
    }

    startVideo();
  }, []);

  async function takeSnapShot() {
    // give the camera a sec to load

    setMode("review");

    canvas.current
      .getContext("2d")
      .drawImage(
        video.current,
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
  }

  async function uploadImage() {
    // create image blob:

    const fileBlob = await new Promise((resolve) =>
      canvas.current.toBlob((blob) => resolve(blob))
    );

    const file = new File([fileBlob], Date.now());
    const filename = encodeURIComponent(file.name);

    const res = await fetch(`/api/s3/presignedURL?file=${filename}`);
    const { url, fields } = await res.json();

    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, { method: "POST", body: formData });

    if (!upload.ok) {
      alert("error on upload!");
    } else {
      alert("upload success!");
      setMode("video");
    }
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <video
        ref={video}
        autoPlay
        className={`${mode !== "video" && "hidden"}`}
      />

      <button
        className={`${mode !== "video" && "hidden"} block my-3 mx-auto`}
        onClick={() => takeSnapShot()}
      >
        Take Picture
      </button>

      <canvas
        className={`${mode !== "review" && "hidden"} my-3`}
        ref={canvas}
      />

      <button
        className={`${mode !== "review" && "hidden"} block my-3 mx-auto`}
        onClick={() => uploadImage()}
      >
        Upload Image
      </button>

      <div className="text-3xl my-40 text-blue-400 underline">
        <Link href="/edit">
          <a>Edit Image Data</a>
        </Link>
      </div>
    </div>
  );
}
