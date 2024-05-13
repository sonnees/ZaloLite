import React, { useState, useEffect } from "react";
import axios from "axios";

const LinkPreview = ({ url, onPreviewError }) => {
  const [previewData, setPreviewData] = useState(null);
  const [previewLoaded, setPreviewLoaded] = useState(false);

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
          setPreviewLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching link preview:", error);
        // Gửi một cảnh báo đến component cha nếu không thể tải được link preview
        onPreviewError();
      }
    };

    fetchPreviewData();
  }, [url, onPreviewError]);

  // Hàm xử lý khi nhấp vào liên kết
  const handleLinkClick = () => {
    window.open(url, "_blank");
  };

  if (!previewLoaded) {
    return null; // Hoặc bạn có thể render một phần tử "loading" ở đây
  }

  if (!previewData) {
    // Nếu không thể tải được link preview, hiển thị nội dung gốc
    return (
      <div onClick={handleLinkClick} style={{ cursor: "pointer" }}>
        <p>{url}</p>
      </div>
    );
  }

  return (
    <div onClick={handleLinkClick} style={{ cursor: "pointer" }}>
      <p>{previewData.title}</p>
      <img src={previewData.image} alt="Link preview" />
      <p>{previewData.description}</p>
    </div>
  );
};

export default LinkPreview;
