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

    
    const clientId = "794964050855-vrgtb49slp0bvjmuaabbefu38prmu26q.apps.googleusercontent.com";
    const clientSecret = "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";
    const refreshToken = "1//04IbkV-nJTNBBCgYIARAAGAQSNwF-L9IrcgbpjD76lkJA6OPYkauvtG7PR3DPcevAtQa_w0YiMeTP5A1g5Q7BWgMJ4pu6CDq42G8";
    const folderId = "1TopvnY8EhXKwFMVDaw9eYI5M97X0Htto";

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const buffer = Buffer.from(await file.arrayBuffer());
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name}`,
        parents: [folderId],
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