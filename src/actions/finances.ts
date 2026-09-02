"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getBalance() {
  try {
    const transactions = await prisma.transaction.findMany();
    const balance = transactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
    }, 0);
    return balance;
  } catch {
    return 0;
  }
}

export async function addTransaction(formData: FormData) {
  const description = formData.get("description") as string;
  const amountStr = formData.get("amount") as string;
  const type = formData.get("type") as string; // "income" or "expense"
  const category = formData.get("category") as string;
  
  if (!description || !amountStr) return;

  await prisma.transaction.create({
    data: { 
      description, 
      amount: parseFloat(amountStr), 
      type: type || "expense",
      category: category || "Outros"
    },
  });
  
  revalidatePath("/");
  revalidatePath("/finances");
}
