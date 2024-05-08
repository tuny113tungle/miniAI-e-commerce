import { defineConfig } from 'vite';
import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: './',
    base: './',
    plugins: [reactRefresh()],
    // Rewrite the path of long path into @/xxx
    // @components: ./components
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    // Allow require image in tsx
    // https://vitejs.dev/guide/features.html#static-assets-handling
    server: {
      fs: {
        strict: false,
      },
    },
  });
};
