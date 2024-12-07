import { resolve } from 'path'

export default {
  define: {
    'process.env': {}
  },
  server: {
    open: false
  },
  resolve: {
    alias: {
      'next/image': resolve('./src/components/mocks/MockNextImage.tsx')
    }
  }
}
