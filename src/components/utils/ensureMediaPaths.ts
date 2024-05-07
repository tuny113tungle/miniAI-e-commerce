import { isNil } from 'lodash';

// Service media will save file
// For example
// sample.png will have sample_1.png, sample_2.png, sample_3.png
const getOptimizedSize = (url: string, size: number) => {
  return url;
  if (url.startsWith('https://media.risensgroup.com')) {
    // append to query string
    // width=size
    const urlObject = new URL(url);
    urlObject.searchParams.set('width', size.toString());
    return urlObject.toString();
  }
  return url;
};

const ensureMediaPath = (path: string, defaultPath?: string): string | undefined => {
  if (isNil(path)) return (defaultPath && ensureMediaPath(defaultPath)) || undefined;
  if (path.includes('zdn.vn/zapps')) {
    return path;
  }
  if (path.startsWith('http')) {
    return path;
  }
  if (path.startsWith('data:image')) {
    return path;
  }
  if (path.startsWith('data:video')) {
    return path;
  }
  if (path.startsWith('data:audio')) {
    return path;
  }
  if (path.startsWith('/assets')) {
    return path;
  }
  return `https://media.risensgroup.com${path.startsWith('/') ? '' : '/'}${path}`;
};

export { ensureMediaPath, getOptimizedSize };
