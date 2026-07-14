import { relations } from 'drizzle-orm'
import { address } from './address'
import { account, session, user } from './auth'
import { site, site_contact, site_pictures } from './site'
/** auth **/

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}))

/** site **/
export const siteRelations = relations(site, ({ one, many }) => ({
	user: one(user, {
		fields: [site.user_id],
		references: [user.id],
	}),
	address: one(address, {
		fields: [site.address],
		references: [address.id],
	}),
	site_pictures: many(site_pictures),
	site_contact: one(site_contact, {
		fields: [site.id],
		references: [site_contact.site_id],
	}),
}))
export const siteContactRelations = relations(site_contact, ({ one }) => ({
	user: one(site, {
		fields: [site_contact.site_id],
		references: [site.id],
	}),
}))
export const sitePicturesRelations = relations(site_pictures, ({ one }) => ({
	site: one(site, {
		fields: [site_pictures.site_id],
		references: [site.id],
	}),
}))

/** address **/
export const addressRelations = relations(address, ({ one }) => ({
	site: one(site, {
		fields: [address.id],
		references: [site.address],
	}),
}))
