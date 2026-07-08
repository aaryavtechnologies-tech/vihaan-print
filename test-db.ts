import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const students = await prisma.student.findMany();
  console.log("TOTAL STUDENTS:", students.length);
  if (students.length > 0) {
    console.log(students[0]);
  }
}
run().finally(() => prisma.$disconnect());
