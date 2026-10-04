import { connection } from 'next/server';
import Image from 'next/image';
import Link from 'next/link';
import Counter from '@/components/Counter';
export default async function Home() {
  await connection();
  return <main><p className="eyebrow">PERSONAL PAAS / NEXT.JS</p><h1>你的项目，已经上线。</h1>
    <p>这个页面在服务器渲染。修改代码、提交并推送，平台会自动部署新版本。</p>
    <p>服务器时间：<time data-testid="server-time">{new Date().toISOString()}</time></p>
    <Counter /><Image src="/sample.png" alt="示例图像" width={32} height={32} />
    <nav><Link href="/stream">流式响应</Link><Link href="/isr">ISR 缓存</Link><a href="/api/hello">服务端 API</a><a href="/healthz">健康检查</a></nav>
  </main>;
}
