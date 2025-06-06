import { useEffect, useState } from "react";


export const  useImages = (stickerData) => {
  const [loaded, setLoaded] = useState({});
  useEffect(() => {
    stickerData.forEach(({ src }) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        setLoaded((prev) => ({ ...prev, [src]: img }));
      };
    });
  }, [stickerData]);
  return loaded;
};