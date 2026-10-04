import { it,expect } from 'vitest';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const Cache=require('../cache-handler.cjs');
it('stores buffers and invalidates tags',async()=>{const c=new Cache();const k='test-'+Date.now();await c.set(k,{body:Buffer.from('abc')},{tags:['demo']});expect((await c.get(k)).value.body.toString()).toBe('abc');await c.revalidateTag('demo');expect(await c.get(k)).toBeNull();});
