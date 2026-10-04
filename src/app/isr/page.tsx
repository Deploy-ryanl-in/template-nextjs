export const revalidate = 10;
export default function ISR() { return <main><h1>ISR 缓存</h1><time data-testid="isr-time">{new Date().toISOString()}</time></main>; }
