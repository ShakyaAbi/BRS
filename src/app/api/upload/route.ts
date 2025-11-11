import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ASSET_UPLOAD_DIR } from "@/lib/server-paths";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    await fs.mkdir(ASSET_UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(ASSET_UPLOAD_DIR, filename);
    await fs.writeFile(filePath, bytes);

    const url = `/uploads/assets/${filename}`;
    return NextResponse.json({ url, size: file.size, originalName: file.name });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
