import { NextRequest, NextResponse } from "next/server";
import { readSettings, writeSettings } from "@/lib/settings-store";
import type { SettingsData } from "@/lib/types";

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as SettingsData;
    const updated = await writeSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update settings", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
