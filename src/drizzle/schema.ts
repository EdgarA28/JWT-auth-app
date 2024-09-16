import { varchar } from "drizzle-orm/pg-core"
import { pgTable, uuid } from "drizzle-orm/pg-core"






export const UserTable = pgTable("userAuth",{
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull()
})