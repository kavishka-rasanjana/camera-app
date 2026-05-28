import { google } from "googleapis";
import { NextResponse } from "next/server";
import stream from "stream";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    
    const buffer = Buffer.from(await file.arrayBuffer());
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

   
    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name}`, 
        parents: [process.env.DRIVE_FOLDER_ID], 
      },
      media: {
        mimeType: file.type,
        body: bufferStream,
      },
    });

    return NextResponse.json({ success: true, fileId: response.data.id });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}