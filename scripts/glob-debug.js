const glob = require('next/dist/compiled/glob');

function wrapExport(fn) {
  const wrapped = function patched(pattern, options, cb) {
    if (typeof pattern === 'string' && pattern.includes('Users\\jorge')) {
      console.error('[glob-call]', {
        pattern,
        cwd: options && options.cwd,
        dot: options && options.dot,
        follow: options && options.follow,
        stack: new Error().stack,
      });
    }
    return fn(pattern, options, cb);
  };
  Object.assign(wrapped, fn);
  wrapped.Glob = fn.Glob;
  return wrapped;
}

if (glob && glob.Glob) {
  const originalError = glob.Glob.prototype._readdirError;
  if (!originalError.__patched) {
    glob.Glob.prototype._readdirError = function patched(path, err, cb) {
      const pattern = this && this.pattern;
      const cwd = this && this.cwd;
      const opts = this && this.options;
      const stack = new Error().stack;
      console.error('[glob-debug]', { pattern, cwd, errorPath: path, code: err && err.code, follow: opts && opts.follow, dot: opts && opts.dot, stack });
      return originalError.call(this, path, err, cb);
    };
    glob.Glob.prototype._readdirError.__patched = true;
  }

  const originalGlob = glob.Glob;
  if (!originalGlob.__ctorPatched) {
    const originalConstructor = originalGlob;
    function PatchedGlob(pattern, options, cb) {
      if (typeof pattern === 'string' && pattern.includes('Users\\jorge')) {
        console.error('[glob-ctor]', {
          pattern,
          cwd: options && options.cwd,
          dot: options && options.dot,
          follow: options && options.follow,
          stack: new Error().stack,
        });
      }
      return originalConstructor.call(this, pattern, options, cb);
    }
    PatchedGlob.prototype = originalConstructor.prototype;
    PatchedGlob.Glob = originalConstructor.Glob;
    glob.Glob = PatchedGlob;
    glob.Glob.__ctorPatched = true;
  }
}

const resolved = require.resolve('next/dist/compiled/glob');
const cacheEntry = require.cache[resolved];
if (cacheEntry) {
  cacheEntry.exports = wrapExport(cacheEntry.exports);
}
