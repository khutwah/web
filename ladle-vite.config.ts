import { resolve } from 'path'

export default {
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      'next/image': resolve('./src/components/mocks/MockNextImage.tsx')
    }
  }
}
