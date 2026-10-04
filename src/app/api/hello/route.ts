import { hello } from '@/lib/hello';
export const dynamic = 'force-dynamic';
export function GET(request: Request) { return Response.json(hello(new URL(request.url).searchParams.get('name') || 'world'),{headers:{'Cache-Control':'no-store'}}); }
