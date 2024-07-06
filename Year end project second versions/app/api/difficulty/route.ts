import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, res: Response) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const difficulties = await db.difficulty.findMany();

    return NextResponse.json(difficulties);
  } catch (error) {
    console.log("[DIFFICULTY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: {} }) {
  try {
    const user = await auth();
    const body = await req.json();

    const { label } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const difficulty = await db.difficulty.create({
      data: { label },
    });

    return NextResponse.json(difficulty);
  } catch (error) {
    console.log("[DIFFICULTY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
