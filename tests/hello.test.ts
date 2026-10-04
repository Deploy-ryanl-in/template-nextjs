import { describe,it,expect } from 'vitest';
import { hello } from '../src/lib/hello';
describe('hello',()=>{it('formats user input as data',()=>expect(hello('Ryan')).toEqual({message:'Hello, Ryan!'}));it('bounds input length',()=>expect(hello('a'.repeat(500)).message.length).toBeLessThan(100));});
