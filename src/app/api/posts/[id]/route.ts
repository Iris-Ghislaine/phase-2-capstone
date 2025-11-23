/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { generateSlug } from '../../../../lib/utils';

// GET /api/posts/[id] - Get single post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIXED: params is Promise
) {
  try {
    const { id } = await params; // FIXED: await params
    
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
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

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Fetch post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update post

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, published, tags } = body;

    const updateData: any = {
      title,
      content,
      excerpt,
      coverImage,
      published,
    };

    if (title) {
        updateData.slug = generateSlug(title);
    }

    if (published && !post.published) {
      updateData.publishedAt = new Date();
    }

    if (tags && Array.isArray(tags)) {
      const tagConnections = [];
      for (const tagName of tags) {
        const normalizedName = tagName.trim();
        if (!normalizedName) continue;

        const tagSlug = generateSlug(normalizedName);
        
        // Use upsert on a unique field, like slug, but ensure data consistency
        // A more robust way is to find or create.
        const existingTag = await prisma.tag.findFirst({
            where: {
                name: {
                    equals: normalizedName,
                    mode: 'insensitive' // Case-insensitive search
                }
            }
        });

        if (existingTag) {
            tagConnections.push({ id: existingTag.id });
        } else {
            const newTag = await prisma.tag.create({
                data: {
                    name: normalizedName,
                    slug: tagSlug
                }
            });
            tagConnections.push({ id: newTag.id });
        }
      }

      updateData.tags = {
        set: [], // Disconnect all old tags
        connect: tagConnections, // Connect the new/existing tags
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> } 
// ) {
//   try {
//     const { id } = await params; 
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     if (post.authorId !== (session.user as any).id) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     const body = await request.json();
//     const { title, content, excerpt, coverImage, published, tags } = body;

//     const updateData: any = {
//       title,
//       content,
//       excerpt,
//       coverImage,
//       published,
//     };

//     if (published && !post.published) {
//       updateData.publishedAt = new Date();
//     }

//     if (tags && Array.isArray(tags)) {
//       const tagConnections = [];
//       for (const tagName of tags) {
//         const tagSlug = generateSlug(tagName);
//         const tag = await prisma.tag.upsert({
//           where: { slug: tagSlug },
//           update: {},
//           create: { name: tagName, slug: tagSlug },
//         });
//         tagConnections.push({ id: tag.id });
//       }

//       updateData.tags = {
//         set: [],
//         connect: tagConnections,
//       };
//     }

//     const updatedPost = await prisma.post.update({
//       where: { id },
//       data: updateData,
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
//       },
//     });

//     return NextResponse.json(updatedPost);
//   } catch (error) {
//     console.error('Update post error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIXED
) {
  try {
    const { id } = await params; // FIXED: await params
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
