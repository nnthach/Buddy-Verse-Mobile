import * as ImagePicker from "expo-image-picker";

export const pickImage = async (type) => {
  let mediaTypes;
  if (type === "image") {
    mediaTypes = ["images"];
  } else if (type === "video") {
    mediaTypes = ["videos"];
  } else {
    mediaTypes = ["images", "videos"];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
  });

  if (!result.canceled) {
    return result.assets.map((asset) => ({
      uri: asset.uri,
      type: asset.type?.startsWith("video") ? "video" : "image",
    })); // return array of images object
  }
};

export const removeImage = (images, imgIndex) => {
  return images.filter((_, index) => index !== imgIndex);
};
