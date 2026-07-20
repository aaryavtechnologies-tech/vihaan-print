import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "vihaan_id_print/general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const removeBg = formData.get("removeBg") === "true";

    const uploadOptions: any = {
      folder: folder,
      resource_type: "auto",
      // Optimization
      quality: "auto",
      fetch_format: "auto",
    };

    if (removeBg) {
      uploadOptions.background_removal = "cloudinary_ai";
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, uploadOptions);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image to Cloudinary", details: error.message },
      { status: 500 }
    );
  }
}
