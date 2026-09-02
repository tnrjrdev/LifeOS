"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGoals() {
  try {
    return await prisma.goal.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}

export async function addGoal(formData: FormData) {
  const title = formData.get("title") as string;
  const targetStr = formData.get("targetAmount") as string;
  
  if (!title || !targetStr) return;

  await prisma.goal.create({
    data: { 
      title, 
      targetAmount: parseFloat(targetStr) 
    },
  });
  
  revalidatePath("/goals");
}
