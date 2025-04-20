// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      username: 'john_doe',
      password: 'secure123',
      share_link: {
        create: {
          hash: 'abc123xyz'
        }
      },
      contents: {
        create: [
          {
            link: 'https://example.com/video1',
            type: 'video',
            title: 'Intro to TypeScript',
            tags: {
              create: [
                { title: 'typescript' },
                { title: 'beginner' }
              ]
            }
          },
          {
            link: 'https://example.com/article1',
            type: 'article',
            title: 'Understanding Prisma Relations',
            tags: {
              create: [
                { title: 'prisma' },
                { title: 'orm' }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeded user with id:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
