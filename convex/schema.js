import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string()
    }),
    workspace: defineTable({
        messages: v.any(),
        fileData: v.optional(v.any()),
    }),
    stats: defineTable({
        key: v.string(),
        count: v.number(),
    }).index('by_key', ['key']),
    reviews: defineTable({
        name: v.string(),
        socialUrl: v.optional(v.string()),
        text: v.string(),
        status: v.string(),
        createdAt: v.number(),
    }).index('by_status', ['status']),
});
