
import postgres from "postgres";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";



const Client = postgres(process.env.DATABASE_URL as string)

export const db = drizzle(Client, {schema, logger:true})