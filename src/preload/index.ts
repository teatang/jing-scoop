import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Scoop API
const scoopApi = {
  getPath: () => ipcRenderer.invoke('scoop:get-path'),
  listApps: () => ipcRenderer.invoke('scoop:list'),
  getAppInfo: (appName: string) => ipcRenderer.invoke('scoop:info', appName),
  searchApps: (query: string) => ipcRenderer.invoke('scoop:search', query),
  installApp: (appName: string) => ipcRenderer.invoke('scoop:install', appName),
  uninstallApp: (appName: string) => ipcRenderer.invoke('scoop:uninstall', appName),
  updateApp: (appName: string) => ipcRenderer.invoke('scoop:update', appName),
  checkUpdates: () => ipcRenderer.invoke('scoop:check-updates'),
  getUpdates: () => ipcRenderer.invoke('scoop:get-updates')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('scoop', scoopApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.scoop = scoopApi
}
