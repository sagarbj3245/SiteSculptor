import { mutation, query } from './_generated/server';

export const RecordVisit = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db
            .query('stats')
            .withIndex('by_key', (q) => q.eq('key', 'visits'))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { count: existing.count + 1 });
            return existing.count + 1;
        }

        await ctx.db.insert('stats', { key: 'visits', count: 1 });
        return 1;
    },
});

export const GetVisits = query({
    args: {},
    handler: async (ctx) => {
        const doc = await ctx.db
            .query('stats')
            .withIndex('by_key', (q) => q.eq('key', 'visits'))
            .unique();
        return doc?.count ?? 0;
    },
});
