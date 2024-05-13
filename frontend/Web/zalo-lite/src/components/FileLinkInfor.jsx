import React from "react";
import { FiDownload } from "react-icons/fi";

const FileLinkInfor = ({ fileName, fileSize, fileURL, fileKey, fileTime }) => {
  // Hàm để xác định loại file từ tên file hoặc đuôi file
  const getFileType = (fileKey) => {
    const fileExtension = fileKey.split("|")[0].split(".").pop().toLowerCase();
    if (fileExtension === "zip") {
      return "zip";
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return "doc";
    } else if (fileExtension === "pdf") {
      return "pdf";
    } else if (fileExtension === "xlsx") {
      return "xlsx";
    } else {
      return "default";
    }
  };

  // Hàm render icon dựa trên loại file
  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case "zip":
        return <img src="/zip.png" alt="Zip Icon" className="h-10 w-10" />;
      case "doc":
        return <img src="/doc.png" alt="Doc Icon" className="h-10 w-10" />;
      case "pdf":
        return <img src="/file-pdf.png" alt="PDF Icon" className="h-10 w-10" />;
      case "xlsx":
        return <img src="/xlsx.png" alt="PDF Icon" className="h-10 w-10" />;
      // xlsx.png
      default:
        return (
          <img src="/default.png" alt="Default Icon" className="h-10 w-10" />
        );
    }
  };

  const fileType = getFileType(fileKey);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" : ""}${day}/${
      month < 10 ? "0" : ""
    }${month}/${year}`;
  }

  return (
    <div className="flex w-full items-center  py-[10px] hover:bg-[#F1F3F4] ">
      <a
        href={fileURL}
        download
        className="flex w-full items-center  hover:bg-[#F1F3F4]"
      >
        {renderFileIcon(fileType)}
        <div className="ml-2 w-[185px]">
          <p className="w-[265px] truncate text-sm font-semibold text-tblack">
            {fileName}
          </p>
          <p className="mt-[2px] text-[13px] text-[#7589A3]">{fileSize}</p>
        </div>
        <div className="ml-auto flex h-full flex-col">
          <div className="mt-4 self-end">
            <span className="text-[13px] text-[#7589A3]">
              {formatDate(fileTime)}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default FileLinkInfor;
