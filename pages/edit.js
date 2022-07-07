// a page that shows every photo taken and allows me to delete them
// and pair bucket objects with labels in the mongo database

import { useEffect, useState } from "react";
import { deleteImage, listObjectKeys } from "../lib/s3";
import ImageDataEditor from "../lib/components/ImageDataEditor";
import Link from "next/link";

export default function Edit() {
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

  function deleteImageAndDataByKey(imageKey) {
    // remove key from render list:
    setObjectData(objectData.filter((obj) => obj.key !== imageKey));

    deleteImage(imageKey);
    fetch(`/api/db/deleteObjectDataByKey?key=${imageKey}`);
  }

  async function saveImageLabel(imageKey, label) {
    await fetch(
      `/api/db/updateObjectLabelByKey?key=${imageKey}&label=${label}`
    );
    alert("saved!");
  }

  return (
    <div className="text-center">
      <h3>Edit Image Data</h3>
      {objectData.map((obj) => (
        <ImageDataEditor
          key={obj.key}
          imageKey={obj.key}
          label={obj.label}
          onSave={saveImageLabel}
          onDelete={deleteImageAndDataByKey}
        />
      ))}

      <div className="text-3xl p-3 w-full text-blue-400 underline fixed bottom-0 bg-white">
        <Link href="/upload">
          <a>Upload More Images</a>
        </Link>
      </div>
    </div>
  );
}
