import { BottomNavbarLink } from '@/models/bottom-navbar'

export interface Menu extends BottomNavbarLink {
  pattern: RegExp
}
