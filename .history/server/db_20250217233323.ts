import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;


export const pool = new Pool({ connectionString: "postgresql://neondb_owner:npg_7xupFKyQe6is@ep-dry-recipe-a4g5w0uz.us-east-1.aws.neon.tech/neondb?sslmode=require" });
export const db = drizzle({ client: pool, schema });
