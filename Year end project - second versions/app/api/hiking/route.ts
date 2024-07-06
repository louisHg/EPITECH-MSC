import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hikings = await db.hiking.findMany({
      include: {
        travelPoint: true,
      },
    });

    return NextResponse.json(hikings);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
