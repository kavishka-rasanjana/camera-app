"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Photo eka select karama (hari camera eken gaththama) preview karanna
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Backend ekata photo eka upload karanna
  const uploadToDrive = async () => {
    if (!image) return;
    setUploading(true);
    setMessage("Uploading to Drive...");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ Photo eka Drive ekata Save wuna!");
        setImage(null); // Reset image
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (error) {
      setMessage("❌ Error ekak awa.");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Drive Uploader 📸</h1>

        {/* Camera Input Eka */}
        <div className="mb-6">
          <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer shadow-md w-full block transition duration-300">
            Open Camera & Take Photo
            <input
              type="file"
              accept="image/*"
              capture="environment" /* Meken phone eke back camera eka open wenawa */
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mb-6">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              onClick={uploadToDrive}
              disabled={uploading}
              className={`mt-4 w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ${
                uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {uploading ? "Uploading..." : "Save to Google Drive ☁️"}
            </button>
          </div>
        )}

        {/* Success/Error Message */}
        {message && <p className="mt-4 font-medium text-gray-700">{message}</p>}
      </div>
    </div>
  );
}