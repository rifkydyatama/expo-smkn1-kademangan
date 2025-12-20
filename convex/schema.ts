import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tabel untuk pendaftar
  participants: defineTable({
    name: v.string(),
    origin_school: v.string(),
    email: v.string(),
    phone: v.string(),
    status: v.string(), // "REGISTERED" atau "CHECKED-IN"
    ticket_code: v.string(),
    check_in_time: v.optional(v.string()),
  }),
  // Tabel untuk pengaturan event (judul, tanggal, dll)
  event_settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
  // Tabel untuk daftar kampus
  event_campuses: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    logo_url: v.optional(v.string()),
  }),
});