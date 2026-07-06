import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const AddReview = mutation({
    args: {
        name: v.string(),
        socialUrl: v.optional(v.string()),
        text: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('reviews', {
            name: args.name,
            socialUrl: args.socialUrl,
            text: args.text,
            status: args.status,
            createdAt: Date.now(),
        });
    },
});

export const GetPublishedReviews = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('reviews')
            .withIndex('by_status', (q) => q.eq('status', 'published'))
            .order('desc')
            .take(24);
    },
});
