import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { address } from './address'
import { user } from './auth'

export const site = pgTable('site', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	address: uuid('address')
		.notNull()
		.references(() => address.id, { onDelete: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const site_contact = pgTable(
	'site_contact',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		site_id: uuid('site_id')
			.notNull()
			.references(() => site.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		email: text('email'),
		phone: text('email'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},

	table => [index('site_contact_site_id_idx').on(table.site_id)],
)

export const site_pictures = pgTable(
	'site_pictures',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		site_id: uuid('site_id')
			.notNull()
			.references(() => site.id, { onDelete: 'cascade' }),
		key: text('key').notNull(),
		contentType: text('contentType').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index('site_pictures_site_id_idx').on(table.site_id)],
)
