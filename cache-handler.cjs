const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const v8 = require('node:v8');
const root = process.env.PAAS_CACHE_DIR || '/tmp/paas-next-cache';
const limit = 8 * 1024 * 1024;
const maxEntries = 128;
// Cache Components is disabled. Cache entries include ISR and fetch tag metadata.
// Removing invalidated entries avoids an unbounded separate tag index.
class CacheHandler {
  file(key) { return path.join(root, crypto.createHash('sha256').update(key).digest('hex')); }
  async get(key, context = {}) {
    try {
      const entry = v8.deserialize(await fs.readFile(this.file(key)));
      const tags = [...(entry.tags || []), ...(context.tags || []), ...(context.softTags || [])];
      if (tags.some(t => (CacheHandler.invalidations.get(t) || 0) >= entry.lastModified)) return null;
      return { value: entry.value, lastModified: entry.lastModified };
    } catch { return null; }
  }
  async set(key, value, context = {}) {
    await fs.mkdir(root, { recursive: true, mode: 0o700 });
    const headerTags = value?.headers?.['x-next-cache-tags']?.split(',') || [];
    const tags = [...new Set([...(context.tags || []), ...(context.softTags || []), ...headerTags])];
    const data = v8.serialize({ value, lastModified: Date.now(), tags });
    if (data.length > limit / 2) return;
    const name = this.file(key), temporary = name + '.' + crypto.randomUUID();
    await fs.writeFile(temporary, data, { mode: 0o600 });
    await fs.rename(temporary, name);
    const files = await Promise.all((await fs.readdir(root)).map(async n => {
      try { const s = await fs.stat(path.join(root, n)); return { n, size: s.size, time: s.mtimeMs }; } catch { return null; }
    }));
    const sorted = files.filter(Boolean).sort((a, b) => a.time - b.time);
    let total = sorted.reduce((n, f) => n + f.size, 0), count = sorted.length;
    for (const file of sorted) {
      if (total <= limit && count <= maxEntries) break;
      await fs.unlink(path.join(root, file.n)).catch(() => {}); total -= file.size; count--;
    }
  }
  async revalidateTag(tags) {
    tags = Array.isArray(tags) ? tags : [tags];
    for (const tag of tags) CacheHandler.invalidations.set(tag, Date.now());
    const files = await fs.readdir(root).catch(() => []);
    for (const file of files) {
      try { const entry = v8.deserialize(await fs.readFile(path.join(root, file)));
        if ((entry.tags || []).some(t => tags.includes(t))) await fs.unlink(path.join(root, file));
      } catch { /* Another request can already have removed this entry. */ }
    }
    // Bound metadata too. Entries with old tags are removed above; metadata is a race guard.
    if (CacheHandler.invalidations.size > 512) CacheHandler.invalidations.clear();
  }
  resetRequestCache() {}
}
CacheHandler.invalidations = new Map();
module.exports = CacheHandler;
