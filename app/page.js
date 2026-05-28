"use client";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // අලුත් ෆොටෝස් තෝරද්දී කලින් තෝරපුවටම එකතු වීම
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  // තෝරපු ෆොටෝස් අයින් කරන්න
  const clearFiles = () => {
    setFiles([]);
  };

  // Upload කරන Function එක (කලින් විදිහටමයි)
  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    let successCount = 0;

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
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setUploading(false);
    setFiles([]); 
    setProgress(0);
    alert(`Success! ${successCount}/${files.length} photos uploaded to Drive.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Drive Uploader 📸</h1>
        
        {/* බට්න් දෙක (Camera සහ Gallery) */}
        <div className="flex gap-4 mb-6">
          {/* 1. Camera බට්න් එක (capture="environment" මගින් කෙලින්ම කැමරාව විවෘත වේ) */}
          <label className="flex-1 cursor-pointer bg-blue-50 text-blue-700 py-3 px-4 rounded-lg font-semibold hover:bg-blue-100 transition-all border border-blue-200">
            📸 Camera
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </label>

          {/* 2. Gallery බට්න් එක (multiple මගින් ෆොටෝස් කිහිපයක් තෝරාගත හැක) */}
          <label className="flex-1 cursor-pointer bg-green-50 text-green-700 py-3 px-4 rounded-lg font-semibold hover:bg-green-100 transition-all border border-green-200">
            🖼️ Gallery
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange}
              className="hidden" 
            />
          </label>
        </div>

        {/* තෝරපු ෆොටෝස් ගාණ පෙන්වීම සහ Clear කිරීම */}
        {files.length > 0 && (
          <div className="mb-6 bg-gray-100 p-3 rounded-lg flex justify-between items-center">
            <p className="text-gray-700 font-medium text-sm">
              Selected: <span className="font-bold">{files.length}</span> photos
            </p>
            <button 
              onClick={clearFiles}
              className="text-red-500 text-sm font-bold hover:text-red-700"
            >
              Clear ✖
            </button>
          </div>
        )}

        {/* Upload බට්න් එක */}
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