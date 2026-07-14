import { db } from '@sentry-shift/db'
import { address } from '@sentry-shift/db/schema/address'
import { site, site_contact, site_pictures } from '@sentry-shift/db/schema/site'
import { getUploadUrl } from '@sentry-shift/s3'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { protectedProcedure, router } from '../index'

export const appRouter = router({
	addSite: protectedProcedure
		.input(
			z.object({
				site: createInsertSchema(site).omit({
					address: true,
					user_id: true,
				}),
				address: createInsertSchema(address),
				site_contact: z.optional(
					createInsertSchema(site_contact).omit({
						site_id: true,
					}),
				),
				site_pictures: z.optional(
					z.array(
						createInsertSchema(site_pictures).omit({
							site_id: true,
						}),
					),
				),
			}),
		)
		.mutation(async ({ input, ctx: { user_id } }) => {
			return await db.transaction(async tx => {
				const [created_address] = await tx
					.insert(address)
					.values(input.address)
					.returning()

				if (!created_address) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'error while creating address',
					})
				}

				const [created_site] = await tx
					.insert(site)
					.values({
						...input.site,
						address: created_address.id,
						user_id,
					})
					.returning()

				if (!created_site) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'error while creating site',
					})
				}

				const [created_contact] = input.site_contact
					? await tx
							.insert(site_contact)
							.values({
								...input.site_contact,
								site_id: created_site.id,
							})
							.returning()
					: [null]

				const created_pictures = input.site_pictures?.length
					? await tx
							.insert(site_pictures)
							.values(
								input.site_pictures.map(pic => ({
									...pic,
									site_id: created_site.id,
								})),
							)
							.returning()
					: []

				return {
					site: created_site,
					address: created_address,
					site_contact: created_contact,
					site_pictures: created_pictures,
				}
			})
		}),
	getSites: protectedProcedure.query(
		async ({ ctx }) =>
			await db.query.site.findMany({
				where: eq(site.user_id, ctx.user_id),
				with: {
					address: true,
					site_pictures: true,
					site_contact: true,
				},
			}),
	),
	getUploadUrl: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				contentType: z.string(),
			}),
		)
		.mutation(
			async ({ input }) => await getUploadUrl(input.name, input.contentType),
		),
})
