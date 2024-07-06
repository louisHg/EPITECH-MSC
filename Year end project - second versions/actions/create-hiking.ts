"use server";

import axios from "axios";
import * as z from "zod";
import { CreateHikingSchema } from "@/schemas";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import getTotalDistance from "@/lib/getTotalDistance";

export const createHiking = async (
  values: z.infer<typeof CreateHikingSchema>
) => {
  const validatedFields = CreateHikingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { title, description, difficultyId, travelPoints } =
    validatedFields.data;

  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized!" };
  }

  const firstPoint = travelPoints[0];

  const distance =
    Math.round((getTotalDistance(travelPoints as [number, number][]) + Number.EPSILON) * 100) / 100;

  const geoInfos = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&lat=${firstPoint[0]}&lon=${firstPoint[1]}`
  );

  console.log(geoInfos.data);

  if (!geoInfos.data) {
    return { error: "Invalid geo point!" };
  }

  const city = geoInfos.data.address[geoInfos.data.addresstype];

  const area = geoInfos.data.address.state;

  const country = geoInfos.data.address.country;
  console.log(city, area, country);

  const currentUser = await getUserByEmail(session.user.email);

  if (!currentUser) {
    return { error: "User not found!" };
  }

  try {
    const newHiking = await db.hiking.create({
      data: {
        title,
        userId: currentUser.id,
        description,
        difficultyId: parseInt(difficultyId),
        city,
        distance,
        country,
        area,
      },
    });

    travelPoints.map(async (point, index) => {
      await db.travelPoint.create({
        data: {
          hikingId: newHiking.id,
          latitude: point[0] as number,
          longitude: point[1] as number,
          order: index,
        },
      });
    });

    return { success: "Hiking created successfully", hiking: newHiking };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
