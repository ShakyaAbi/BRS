import { NextRequest, NextResponse } from "next/server";
import { addGuide, getGuides } from "@/lib/guides-store";

export async function GET() {
  const guides = await getGuides();
  return NextResponse.json(guides);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const brandId = formData.get("brandId");

    if (!(file instanceof File) || typeof brandId !== "string") {
      return NextResponse.json({ error: "Missing guide or brand" }, { status: 400 });
    }

    const guide = await addGuide(file, brandId);
    return NextResponse.json(guide, { status: 201 });
  } catch (error) {
    console.error("Guide upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
