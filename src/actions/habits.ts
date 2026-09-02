"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHabits() {
  try {
    return await prisma.habit.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return [];
  }
}

export async function getTasks() {
  try {
    return await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function addHabit(formData: FormData) {
  const name = formData.get("name") as string;
  const frequency = formData.get("frequency") as string;
  
  if (!name) return;

  await prisma.habit.create({
    data: { name, frequency: frequency || "daily" },
  });
  
  revalidatePath("/");
  revalidatePath("/habits");
}

export async function addTask(formData: FormData) {
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  
  if (!title) return;

  await prisma.task.create({
    data: { title, priority: priority || "medium" },
  });
  
  revalidatePath("/");
  revalidatePath("/habits");
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "completed" ? "pending" : "completed";
  await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
  revalidatePath("/");
  revalidatePath("/habits");
}
