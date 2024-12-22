import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function LogoUploader() {
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the uploaded files (e.g., send them to the server)
    console.log("Uploaded files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag & drop the school's logo here, or click to select files</p>
    </div>
  );
}

export default LogoUploader;
