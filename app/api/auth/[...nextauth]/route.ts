import NextAuth from 'next-auth'

import { authOptions } from '@/app/libs/authOptions';

const handler = NextAuth(authOptions) as never;

export {handler as GET, handler as POST}; 
// export const { GET, POST } = handler
// export const GET = handler.handlers.GET;
// export const POST = handler.handlers.POST;

// export const authHandler = NextAuth(authOptions);

// export default authHandler;

// export const GET = NextAuth(authOptions);
// export const POST = NextAuth(authOptions);
