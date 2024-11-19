import type { GlobalProvider } from '@ladle/react'

import '../src/app/globals.css'
import './ladle.css'

export const Provider: GlobalProvider = ({ children }) => children
