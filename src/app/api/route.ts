import { openai } from "@/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: body.messages,
        });

        console.log(completion.choices[0].message);
        const theResponse = completion.choices[0].message;

        return NextResponse.json({
            output: theResponse,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message ||
                "An error occurred while processing your request.",
        }, { status: 500 });
    }
}
