/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug, generateTagSlug, normalizeTagName } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') !== 'false';
    const authorId = searchParams.get('authorId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const username = searchParams.get('username');

    const where: any = {};

    // Check if any published posts exist
    const hasPublishedPosts = await prisma.post.count({ where: { published: true } });
    
    if (published && hasPublishedPosts > 0) {
      where.published = true;
    } else if (published && hasPublishedPosts === 0) {
      // If no published posts, show all posts for development
      console.log('No published posts found, showing all posts');
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (user) {
        where.authorId = user.id;
      }
    }

    if (tag) {
      
      const normalizedTag = normalizeTagName(tag);
      
  
      const allTags = await prisma.tag.findMany({
        select: { id: true, name: true, slug: true },
      });

    
      const matchingTags = allTags.filter(t => 
        normalizeTagName(t.name) === normalizedTag ||
        t.slug.includes(tag.toLowerCase()) ||
        normalizeTagName(t.slug) === normalizedTag
      );

      if (matchingTags.length > 0) {
        where.tags = {
          some: {
            id: { in: matchingTags.map(t => t.id) }
          }
        };
      } else {
        return NextResponse.json([]);
      }
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        {
          tags: {
            some: {
              name: { contains: search, mode: 'insensitive' }
            }
          }
        },
        {
          author: {
            name: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    console.log('Posts query where:', where);
    
    // Check total posts in database
    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({ where: { published: true } });
    console.log(`Total posts: ${totalPosts}, Published: ${publishedPosts}`);
    
    const posts = await prisma.post.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Posts found:', posts.length);
    
    // If no published posts but there are drafts, return info
    if (posts.length === 0 && published) {
      const drafts = await prisma.post.count({ where: { published: false } });
      console.log(`No published posts found. Drafts available: ${drafts}`);
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // SMART TAG HANDLING - Reuses existing or creates new
    const tagConnections = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        if (typeof tagName !== 'string') continue;
        const normalizedName = normalizeTagName(tagName);
        
        // First, check if similar tag exists
        const allTags = await prisma.tag.findMany();
        const existingTag = allTags.find(t => 
          normalizeTagName(t.name) === normalizedName
        );

        if (existingTag) {
          // Reuse existing tag
          tagConnections.push({ id: existingTag.id });
        } else {
          // Create new tag with clean slug
          const tagSlug = generateTagSlug(String(tagName));
          const newTag = await prisma.tag.create({
            data: { 
              name: tagName, 
              slug: tagSlug
            },
          });
          tagConnections.push({ id: newTag.id });
        }
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