import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

// hinh anh nhan vao tu mobile la dang uri
// Blob (viết tắt của Binary Large Object) là một kiểu dữ liệu đại diện cho dữ liệu nhị phân – ví dụ như ảnh, video, file PDF, v.v.
const uriToBlob = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob(); // convert file uri → blob
  return blob;
};

const uploadImage = async (asset) => {
  console.log("asset", asset);
  const blob = await uriToBlob(asset.uri); // call convert

  // Lấy extension
  let extension = "jpg";
  if (asset.fileName && asset.fileName.includes(".")) {
    extension = asset.fileName.split(".").pop();
  } else {
    const uriParts = asset.uri.split(".");
    if (uriParts.length > 1) {
      extension = uriParts.pop().split("?")[0];
    }
  }
  const type = asset.type?.startsWith("video") ? "videos" : "images";
  const fileName = asset.fileName || `${Date.now()}.${extension}`;
  console.log("file name", fileName);

  const storageRef = ref(storage, `${type}/${fileName}`);
  console.log("storageRef", storageRef);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  console.log("downloadUrl", downloadURL);
  return downloadURL;
};

export default uploadImage;
