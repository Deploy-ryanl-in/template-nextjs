import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = { title: 'Personal PaaS', description: 'Next.js starter on ryanl.in' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
