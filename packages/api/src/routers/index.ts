import { protectedProcedure, router } from '../index'
import { appRouter as siteRouter } from './site'

export const appRouter = router({
	site: siteRouter,
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: 'This is private',
			user: ctx.session.user,
		}
	}),
})

export type AppRouter = typeof appRouter
