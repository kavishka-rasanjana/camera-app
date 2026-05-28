"use client";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Function triggered when files are selected (allows both camera and gallery)
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Function triggered when the Upload button is clicked
  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    let successCount = 0;

    // Upload photos one by one to avoid Vercel's 4.5MB payload limit
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) successCount++;
      } catch (error) {
        console.error("Upload failed", error);
      }
      // Calculate and update the upload percentage
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setUploading(false);
    setFiles([]); // Clear selected files after successful upload
    setProgress(0);
    alert(`Success! ${successCount}/${files.length} photos uploaded to Drive.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Drive Uploader 📸</h1>
        
        {/* The 'multiple' attribute allows selecting multiple files at once */}
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4 cursor-pointer"
        />

        {/* Display the number of selected photos */}
        {files.length > 0 && (
          <p className="mb-4 text-green-600 font-medium">
            {files.length} photo(s) selected
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`w-full py-3 rounded-lg text-white font-bold transition-all ${
            uploading || files.length === 0 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {uploading ? `Uploading... ${progress}%` : "Upload to Drive"}
        </button>
      </div>
    </div>
  );
}