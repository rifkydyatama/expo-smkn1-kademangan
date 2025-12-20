import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Ambil semua data pendaftar
export const getParticipants = query({
  handler: async (ctx) => {
    return await ctx.db.query("participants").order("desc").collect();
  },
});

// Simpan pendaftar baru
export const registerParticipant = mutation({
  args: {
    name: v.string(),
    origin_school: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const ticketCode = "EXPO-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    return await ctx.db.insert("participants", {
      ...args,
      status: "REGISTERED",
      ticket_code: ticketCode,
    });
  },
});

// Ambil settings
export const getSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("event_settings").collect();
    const config: Record<string, string> = {};
    settings.forEach((s) => (config[s.key] = s.value));
    return config;
  },
});