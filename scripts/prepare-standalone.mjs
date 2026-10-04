import fs from 'node:fs/promises';
await fs.cp('public','.next/standalone/public',{recursive:true});
await fs.cp('.next/static','.next/standalone/.next/static',{recursive:true});
await fs.copyFile('cache-handler.cjs','.next/standalone/cache-handler.cjs');
