import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const medabots = pgTable('medabots', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  medaforce: varchar('medaforce', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  head: varchar('head', { length: 100 }).notNull(),
  leftArm: varchar('left_arm', { length: 100 }).notNull(),
  rightArm: varchar('right_arm', { length: 100 }).notNull(),
});

export type Medabot = typeof medabots.$inferSelect;
export type NewMedabot = typeof medabots.$inferInsert;