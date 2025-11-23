/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
// This GET function fetches ALL published posts for your main feed.
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true, // It only fetches posts that are marked as published
      },
      orderBy: {
        publishedAt: 'desc', // Orders them by the most recent
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch all posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// // GET /api/posts - Fetch all posts
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const published = searchParams.get('published') !== 'false';
//     const authorId = searchParams.get('authorId');
//     const tag = searchParams.get('tag');
//     const search = searchParams.get('search');

//     const where: any = {};

//     if (published) {
//       where.published = true;
//     }

//     if (authorId) {
//       where.authorId = authorId;
//     }

//     if (tag) {
//       where.tags = {
//         some: {
//           slug: tag,
//         },
//       };
//     }

//     if (search) {
//       where.OR = [
//         { title: { contains: search, mode: 'insensitive' } },
//         { content: { contains: search, mode: 'insensitive' } },
//       ];
//     }

//     const posts = await prisma.post.findMany({
//       where,
//       include: {
//         author: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             avatar: true,
//           },
//         },
//         tags: true,
//         _count: {
//           select: {
//             likes: true,
//             comments: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return NextResponse.json(posts);
//   } catch (error) {
//     console.error('Fetch posts error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// POST /api/posts - Create new post
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, published, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    // Handle tags
    const tagConnections = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        const tagSlug = generateSlug(tagName);
        
        // Find or create tag
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        
        tagConnections.push({ id: tag.id });
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: (session.user as any).id,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

