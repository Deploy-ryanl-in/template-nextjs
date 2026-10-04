import { revalidatePath } from 'next/cache';
export async function POST(request: Request) {
  const secret=process.env.REVALIDATE_TOKEN;
  if (!secret || request.headers.get('Authorization')!==`Bearer ${secret}`) return Response.json({error:'unauthorized'},{status:401});
  revalidatePath('/isr'); return Response.json({revalidated:true});
}
