import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { difficultyId: string } }
) {
  try {
    if (!params.difficultyId) {
      return new NextResponse("Difficulty id is required", { status: 400 });
    }

    const difficulty = await db.difficulty.findUnique({
      where: {
        id: parseInt(params.difficultyId),
      },
    });

    return NextResponse.json(difficulty);
  } catch (error) {
    console.log("[DIFFICULTY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { difficultyId: string } }
) {
  try {
    const user = await auth();

    const body = await req.json();
    const { label } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!params.difficultyId) {
      return new NextResponse("Difficulty id is required", { status: 400 });
    }

    const difficulty = await db.difficulty.updateMany({
      where: {
        id: parseInt(params.difficultyId),
      },
      data: {
        label,
      },
    });

    return NextResponse.json(difficulty);
  } catch (error) {
    console.log("[DIFFICULTY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { difficultyId: string } }
) {
  try {
    const user = await auth();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.difficultyId) {
      return new NextResponse("Difficulty id is required", { status: 400 });
    }

    const difficulty = await db.difficulty.deleteMany({
      where: {
        id: parseInt(params.difficultyId),
      },
    });

    return NextResponse.json(difficulty);
  } catch (error) {
    console.log("[DIFFICULTY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
