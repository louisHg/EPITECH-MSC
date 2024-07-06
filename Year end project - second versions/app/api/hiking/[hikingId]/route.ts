import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { hikingId: string } }
) {
  try {
    if (!params.hikingId) {
      return new NextResponse("Hiking id is required", { status: 400 });
    }

    const hiking = await db.hiking.findUnique({
      where: {
        id: params.hikingId,
      },
    });

    return NextResponse.json(hiking);
  } catch (error) {
    console.log("[HIKINGGET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { hikingId: string } }
// ) {
//   try {
//     const user = await auth();

//     const body = await req.json();
//     const {
//       userId,
//       name,
//       description,
//       city,
//       country,
//       area,
//       difficultyId,
//       distance,
//       latitude,
//       longitude,
//       duration,
//       bannerImg,
//     } = body;

//     if (!user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!params.hikingId) {
//       return new NextResponse("Hiking id is required", { status: 400 });
//     }

//     const hiking = await db.hiking.updateMany({
//       where: {
//         id: params.hikingId,
//       },
//       data: {
//         userId,
//         title,
//         description,
//         city,
//         country,
//         area,
//         difficultyId,
//         distance,
//         latitude,
//         longitude,
//         duration,
//         bannerImg,
//       },
//     });

//     return NextResponse.json(hiking);
//   } catch (error) {
//     console.log("[HIKINGPATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function DELETE(
  req: Request,
  { params }: { params: { hikingId: string } }
) {
  try {
    const user = await auth();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.hikingId) {
      return new NextResponse("Hiking id is required", { status: 400 });
    }

    const hiking = await db.hiking.deleteMany({
      where: {
        id: params.hikingId,
      },
    });

    return NextResponse.json(hiking);
  } catch (error) {
    console.log("[HIKINGDELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
