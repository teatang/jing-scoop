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
