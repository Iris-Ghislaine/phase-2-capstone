import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth';

const handler = NextAuth(authOptions); // for handling authentication

export { handler as GET, handler as POST };
