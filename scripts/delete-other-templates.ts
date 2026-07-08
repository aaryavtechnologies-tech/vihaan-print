import { prisma } from "../src/lib/prisma";

async function main() {
  const templates = await prisma.template.findMany({ select: { id: true, name: true } });
  for (const t of templates) {
    if (t.name !== "St. John Samaritan ID") {
      console.log("Deleting template:", t.name);
      await prisma.template.delete({ where: { id: t.id } });
    }
  }
  console.log("Cleanup done.");
}
main().finally(() => prisma.$disconnect());
