import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ScoopApp, ScoopSearchResult, ScoopInfo, ScoopUpdateInfo } from '../types'

export const useScoopStore = defineStore('scoop', () => {
  // State
  const installedApps = ref<ScoopApp[]>([])
  const searchResults = ref<ScoopSearchResult[]>([])
  const selectedApp = ref<ScoopInfo | null>(null)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const theme = ref<'light' | 'dark'>('light')
  const scoopPath = ref<string | null>(null)
  const updates = ref<ScoopUpdateInfo[]>([])

  // Getters
  const hasError = computed(() => error.value !== null)
  const appCount = computed(() => installedApps.value.length)
  const updateCount = computed(() => updates.value.length)

  // Actions
  async function fetchScoopPath(): Promise<void> {
    try {
      scoopPath.value = await window.scoop.getPath()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    }
  }

  async function fetchInstalledApps(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      installedApps.value = await window.scoop.listApps()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  async function searchApps(query: string): Promise<void> {
    searchQuery.value = query
    isLoading.value = true
    error.value = null
    try {
      searchResults.value = await window.scoop.searchApps(query)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAppInfo(appName: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      selectedApp.value = await window.scoop.getAppInfo(appName)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  async function installApp(appName: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true
    error.value = null
    try {
      const result = await window.scoop.installApp(appName)
      if (!result.success) {
        error.value = result.error || '安装失败'
      }
      return result
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function uninstallApp(appName: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true
    error.value = null
    try {
      const result = await window.scoop.uninstallApp(appName)
      if (!result.success) {
        error.value = result.error || '卸载失败'
      }
      // 刷新应用列表
      await fetchInstalledApps()
      return result
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function updateApp(appName: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true
    error.value = null
    try {
      const result = await window.scoop.updateApp(appName)
      if (!result.success) {
        error.value = result.error || '更新失败'
      }
      // 刷新应用列表
      await fetchInstalledApps()
      return result
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUpdates(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      updates.value = await window.scoop.getUpdates()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  function setTheme(newTheme: 'light' | 'dark'): void {
    theme.value = newTheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    installedApps,
    searchResults,
    selectedApp,
    searchQuery,
    isLoading,
    error,
    theme,
    scoopPath,
    updates,
    // Getters
    hasError,
    appCount,
    updateCount,
    // Actions
    fetchScoopPath,
    fetchInstalledApps,
    searchApps,
    fetchAppInfo,
    installApp,
    uninstallApp,
    updateApp,
    fetchUpdates,
    setTheme,
    toggleTheme,
    clearError
  }
})
