import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    scoop: ScoopAPI
  }
}

export interface ScoopApp {
  name: string
  version: string
  description: string
  source: string
  updated: string
}

export interface ScoopUpdateInfo {
  name: string
  currentVersion: string
  availableVersion: string
  source: string
}

export interface ScoopSearchResult {
  name: string
  version: string
  description: string
  source: string
}

export interface ScoopInfo {
  name: string
  version: string
  description: string
  homepage: string
  license: string
  source: string
  updated: string
  installed: boolean
}

export interface ScoopAPI {
  getPath(): Promise<string | null>
  listApps(): Promise<ScoopApp[]>
  getAppInfo(appName: string): Promise<ScoopInfo | null>
  searchApps(query: string): Promise<ScoopSearchResult[]>
  installApp(appName: string): Promise<{ success: boolean; error?: string }>
  uninstallApp(appName: string): Promise<{ success: boolean; error?: string }>
  updateApp(appName: string): Promise<{ success: boolean; error?: string }>
  checkUpdates(): Promise<string[]>
  getUpdates(): Promise<ScoopUpdateInfo[]>
}
