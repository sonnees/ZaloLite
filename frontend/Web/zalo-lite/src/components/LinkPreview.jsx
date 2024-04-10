import React, { useState, useEffect } from "react";
import axios from "axios";

const LinkPreview = ({ url }) => {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const response = await axios.get(
          `https://api.linkpreview.net/?key=13591e41bdb3556d908a2dc32c06e054&q=${encodeURIComponent(
            url,
          )}`,
        );

        if (response.data) {
          setPreviewData(response.data);
        }
      } catch (error) {
        console.error("Error fetching link preview:", error);
      }
    };

    fetchPreviewData();
  }, [url]);

  if (!previewData) {
    return null; // Hoặc bạn có thể render một phần tử "loading" ở đây
  }

  // Hàm xử lý khi nhấp vào liên kết
  const handleLinkClick = () => {
    window.open(url, "_blank");
  };

  return (
    <div onClick={handleLinkClick} style={{ cursor: "pointer"}}>
      <p>{previewData.title}</p>
      <img src={previewData.image} alt="Link preview" />
      <p>{previewData.description}</p>
    </div>
  );
};

export default LinkPreview;
