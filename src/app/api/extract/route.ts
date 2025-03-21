import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ message: 'URL is required' }, { status: 400 });
  }

  try {
    const jobOfferContent = "Job Title: Software Engineer\nCompany: Tech Corp\nLocation: Remote\nDescription: We are looking for a skilled software engineer...";

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts information from job offers.",
        },
        {
          role: "user",
          content: `Extract the following information from this job offer: job title, company, location, and description. Return the information in JSON format. Job Offer: ${jobOfferContent}`,
        },
      ],
    });

    const extractedInfo = response.choices[0].message.content;

    if (!extractedInfo) {
      throw new Error('No content returned from OpenAI');
    }

    const parsedInfo = JSON.parse(extractedInfo);
    return NextResponse.json(parsedInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error extracting information' }, { status: 500 });
  }
}