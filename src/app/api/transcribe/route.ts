import { openai } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const theFile: File | null = data.get("file") as unknown as File;

    try {
        const response = await openai.audio.transcriptions.create({
            file: theFile,
            model: "gpt-4o-mini-transcribe",
            prompt: `Hey, transcribe "${theFile.name}" like a linguistic pro`,
            language: "en"
        })

        const caption = response.text.trim();
        return NextResponse.json({
            output: caption || "Transcription completed successfully.",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message ||
                "An error occurred while processing your request.",
        }, { status: 500 });
    }
}
