import React, { useState } from "react";
import { useAuth } from "../components/Context/Authcontent" // adjust path if needed

const FileUploader = () => {
  const { token } = useAuth(); // Get token from context
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return setMessage("❌ Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // optional, only if your backend needs it
        },
        body: formData,
      });

      const data = await response.json();
      setMessage(`✅ Uploaded: ${data.filename}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default FileUploader;
