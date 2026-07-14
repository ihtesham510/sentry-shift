import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const address = pgTable('address', {
	id: uuid('id').primaryKey().defaultRandom(),
	address_line_1: text('address_line_1').notNull(),
	address_line_2: text('address_line_2'),
	state: text('state').notNull(),
	city: text('city').notNull(),
	country: text('country').notNull(),
	postal_code: text('postal_code').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
