import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicIdFromUrl(url: string) {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  
  // check if there is a version string (v123456789)
  let startIndex = uploadIndex + 1;
  if (parts[startIndex].match(/^v\d+$/)) {
    startIndex++;
  }
  
  const pathWithExtension = parts.slice(startIndex).join('/');
  const lastDot = pathWithExtension.lastIndexOf('.');
  if (lastDot === -1) return pathWithExtension;
  return pathWithExtension.substring(0, lastDot);
}

async function main() {
  console.log("Fetching students...");
  const students = await prisma.student.findMany();
  let imgCount = 0;
  for (const student of students) {
    if (student.photo) {
      const publicId = getPublicIdFromUrl(student.photo);
      if (publicId) {
        console.log("Deleting Cloudinary asset (student):", publicId);
        await cloudinary.uploader.destroy(publicId).catch(console.error);
        imgCount++;
      }
    }
  }

  console.log("Fetching generated cards...");
  const cards = await prisma.generatedCard.findMany();
  for (const card of cards) {
    if (card.frontImage) {
      const publicId = getPublicIdFromUrl(card.frontImage);
      if (publicId) {
        console.log("Deleting Cloudinary asset (card front):", publicId);
        await cloudinary.uploader.destroy(publicId).catch(console.error);
        imgCount++;
      }
    }
    if (card.backImage) {
      const publicId = getPublicIdFromUrl(card.backImage);
      if (publicId) {
        console.log("Deleting Cloudinary asset (card back):", publicId);
        await cloudinary.uploader.destroy(publicId).catch(console.error);
        imgCount++;
      }
    }
  }

  console.log(`Deleted ${imgCount} images from Cloudinary.`);
  console.log("Deleting database records...");
  const deletedCards = await prisma.generatedCard.deleteMany();
  console.log(`Deleted ${deletedCards.count} generated cards.`);
  const deletedStudents = await prisma.student.deleteMany();
  console.log(`Deleted ${deletedStudents.count} students.`);
  
  // Also delete generation jobs and print jobs to be fully clean if wanted,
  // but let's stick to students and cards.
  
  console.log("Data clearing complete.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
