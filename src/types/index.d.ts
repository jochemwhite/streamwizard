import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  label: string
  href: string
  icon?: any
  disabled?: boolean
  premium?: boolean
  new?: boolean
  beta? : boolean
  commingSoon?: boolean
}

export type DashboardSection = {
  title?: string
  routes: SidebarNavItem[]
}

export type DashboardConfig = {
  [sectionKey: string]: DashboardSection
}

export type MenuConfig = {
  features: NavItem[]
}

declare module "axios" {
  export interface AxiosRequestConfig {
    channelID?: number; // Your custom property
    broadcasterID?: number; // Your custom property
    // Add more custom properties as needed
  }
}
