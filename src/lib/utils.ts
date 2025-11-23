import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function generateSlug(title: string): string {
  
//   if (title.length < 50) {
    
//     return slugify(title, {
//       lower: true,
//       strict: true,
//       remove: /[*+~.()'"!:@]/g,
//     });
//   }
  
  
//   return slugify(title, {
//     lower: true,
//     strict: true,
//     remove: /[*+~.()'"!:@]/g,
//   }) + '-' + Math.random().toString(36).substring(2, 9);
// }

// // Add this helper for consistent tag slugs
// export function generateTagSlug(tagName: string): string {
//   return slugify(tagName, {
//     lower: true,
//     strict: true,
//     remove: /[*+~.()'"!:@]/g,
//   });
// }


// // export function generateSlug(title: string): string {
// //   return slugify(title, {
// //     lower: true,
// //     strict: true,
// //     remove: /[*+~.()'"!:@]/g,
// //   }) + '-' + Math.random().toString(36).substring(2, 9);
// // }

// export function formatDate(date: Date | string): string {
//   return new Date(date).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
// }

// export function readingTime(content: string): number {
//   const wordsPerMinute = 200;
//   const words = content.split(/\s+/).length;
//   return Math.ceil(words / wordsPerMinute);
// }

// export function truncate(str: string, length: number): string {
//   if (str.length <= length) return str;
//   return str.substring(0, length) + '...';
// }


// import slugify from 'slugify';

// // For POST titles - adds random suffix to ensure uniqueness
// export function generateSlug(title: string): string {
//   return slugify(title, {
//     lower: true,
//     strict: true,
//     remove: /[*+~.()'"!:@]/g,
//   }) + '-' + Math.random().toString(36).substring(2, 9);
// }

// // NEW: For TAG names - NO random suffix, just clean slug
// export function generateTagSlug(tagName: string): string {
//   return slugify(tagName, {
//     lower: true,
//     strict: true,
//     remove: /[*+~.()'"!:@&]/g,
//   });
// }

// export function formatDate(date: Date | string): string {
//   return new Date(date).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
// }

// export function readingTime(content: string): number {
//   const wordsPerMinute = 200;
//   const words = content.split(/\s+/).length;
//   return Math.ceil(words / wordsPerMinute);
// }

// export function truncate(str: string, length: number): string {
//   if (str.length <= length) return str;
//   return str.substring(0, length) + '...';
// }

import slugify from 'slugify';

// For POST titles - adds random suffix
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }) + '-' + Math.random().toString(36).substring(2, 9);
}

// For TAG names - clean slug without suffix
export function generateTagSlug(tagName: string): string {
  return slugify(tagName, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@&]/g,
  });
}

// NEW: Normalize tag name for fuzzy matching
export function normalizeTagName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
