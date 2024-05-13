import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileLink = ({ fileName, fileSize, fileURL, fileKey }) => {
  const [showPdfContent, setShowPdfContent] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const getFileType = (fileKey) => {
    const fileExtension = fileKey.split("|")[0].split(".").pop().toLowerCase();
    return fileExtension;
  };

  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case "zip":
        return <img src="/zip.png" alt="Zip Icon" className="h-14 w-14" />;
      case "rar":
        return (
          <img
            src="/src/assets/icons/rar-file-format.png"
            alt="RAR Icon"
            className="h-14 w-14"
          />
        );
      case "docx":
        return (
          <img
            src="/src/assets/icons/doc.png"
            alt="Doc Icon"
            className="h-14 w-14"
          />
        );
      case "doc":
        return (
          <img
            src="/src/assets/icons/doc.png"
            alt="Doc Icon"
            className="h-14 w-14"
          />
        );
      case "pdf":
        return (
          <div onClick={() => setShowPdfContent(true)}>
            <img
              src="/file-pdf.png"
              alt="PDF Icon"
              className="h-14 w-14 cursor-pointer"
            />
          </div>
        );
      case "xlsx":
        return <img src="/xlsx.png" alt="Excel Icon" className="h-14 w-14" />;
      default:
        return (
          <img
            src="/src/assets/icons/attach-file.png"
            alt="Default Icon"
            className="h-14 w-14"
          />
        );
    }
  };

  const fileType = getFileType(fileKey);

  // const docs = [
  //   { uri: fileURL }, // Remote file
  // ];

  return (
    <>
      {fileType === "pdf" ? (
        <div className="flex w-[500px] flex-col">
          <iframe
            src={`${fileURL}#page=${pageNumber}`}
            width="100%"
            height="500px"
            frameBorder="0"
          ></iframe>
          <div className="mt-2 flex items-center justify-between">
            <div className="">
              <p className="text-sm font-semibold text-tblack">{fileName}</p>
            </div>
            <div>
              <p className="mt-[2px] text-[13px] text-[#7589A3]">{fileSize}</p>
            </div>
          </div>
        </div>
      ) : (
        // : fileType === "docx" ? (
        //   <>
        //     <DocViewer
        //       documents={docs}
        //       initialActiveDocument={docs[1]}
        //       pluginRenderers={DocViewerRenderers}
        //     />
        //   </>
        // )
        <div className="flex items-center">
          {renderFileIcon(fileType)}
          <a href={fileURL} target="_blank">
            <div className="ml-2 mr-6">
              <p className="text-sm font-semibold text-tblack">{fileName}</p>
              <p className="mt-[6px] text-[13px] text-[#7589A3]">{fileSize}</p>
            </div>
          </a>

          {!showPdfContent && (
            <a href={fileURL} download className="ml-auto">
              <FiDownload className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800" />
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default FileLink;
