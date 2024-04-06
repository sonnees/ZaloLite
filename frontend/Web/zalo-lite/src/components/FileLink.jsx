import React from "react";
import { FiDownload } from "react-icons/fi";

const FileLink = ({ fileName, fileSize, fileURL, fileKey }) => {
  // Hàm để xác định loại file từ tên file hoặc đuôi file
  const getFileType = (fileKey) => {
    const fileExtension = fileKey.split("|")[0].split(".").pop().toLowerCase();
    if (fileExtension === "zip") {
      return "zip";
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return "doc";
    } else if (fileExtension === "pdf") {
      return "pdf";
    } else {
      return "default";
    }
  };

  // Hàm render icon dựa trên loại file
  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case "zip":
        return <img src="/zip.png" alt="Zip Icon" className="h-14 w-14" />;
      case "doc":
        return <img src="/doc.png" alt="Doc Icon" className="h-14 w-14" />;
      case "pdf":
        return <img src="/pdf.png" alt="PDF Icon" className="h-14 w-14" />;
      default:
        return (
          <img src="/default.png" alt="Default Icon" className="h-14 w-14" />
        );
    }
  };

  const fileType = getFileType(fileKey);

  return (
    <div className="flex items-center">
      {renderFileIcon(fileType)}
      <div className="ml-2 mr-6">
        <p className="text-sm font-semibold text-tblack">{fileName}</p>
        <p className="mt-[2px] text-[13px] text-[#7589A3]">{fileSize}</p>
      </div>
      <a href={fileURL} download className="ml-auto">
        <FiDownload className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800" />
      </a>
    </div>
  );
};

export default FileLink;
