async function fetchImageUrl(imageKey) {
  let res = await fetch(`/api/s3/signedURL?key=${imageKey}`);
  return { url: await res.text() };
}

// lists up to 1000 image keys from the s3 bucket. If limit
// is not specified, it lists 1000
async function listObjectKeys(limit) {
  let res = await fetch(`/api/s3/listobjectkeys?limit=${limit ? limit : 1000}`);
  return await res.json();
}

async function uploadImage(e) {
  const file = e.target.files[0];
  const filename = encodeURIComponent(file.name);
  const res = await fetch(`/api/s3/presignedURL?file=${filename}`);
  const { url, fields } = await res.json();

  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return upload;
}

async function deleteImage(imageKey) {
  return await fetch(`/api/s3/deleteObject?key=${imageKey}`);
}

export { uploadImage, fetchImageUrl, listObjectKeys, deleteImage };
