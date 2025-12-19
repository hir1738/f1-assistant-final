"use server";

import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createConversation(title: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [conversation] = await db
    .insert(conversations)
    .values({
      userId: session.user.id,
      title,
    })
    .returning();

  revalidatePath("/chat");
  return conversation;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  toolInvocations?: any
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      role,
      content,
      toolInvocations: toolInvocations || null,
    })
    .returning();

  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  return message;
}

export async function getConversations() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, session.user.id))
    .orderBy(desc(conversations.updatedAt));

  return userConversations;
}

export async function getMessages(conversationId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const conversationMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  return conversationMessages;
}
