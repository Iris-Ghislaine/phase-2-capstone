
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// This GET function fetches all published posts for a SPECIFIC user.
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Find all posts where the author's username matches the one from the URL
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        author: {
          username: username,
        },
      },
      orderBy: {
        publishedAt: 'desc',
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
    console.error("Fetch user's posts error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}