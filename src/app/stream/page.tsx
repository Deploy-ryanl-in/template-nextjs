import { Suspense } from 'react';
import { connection } from 'next/server';
async function Delayed() { await connection();await new Promise(resolve=>setTimeout(resolve,1200));return <p>流式内容已到达</p>; }
export default function Stream() { return <main><h1>流式响应</h1><Suspense fallback={<p>正在加载…</p>}><Delayed /></Suspense></main>; }
