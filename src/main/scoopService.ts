import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

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

interface ScoopExportApp {
  Name: string
  Version: string
  Source: string
  Updated: string
  Info: string
}

interface ScoopExport {
  apps: ScoopExportApp[]
}

/**
 * 解析 Microsoft JSON Date 格式 (如 "/Date(1767081158140)/")
 */
function parseJsonDate(dateStr: string): string {
  if (!dateStr) return ''
  const match = dateStr.match(/\/Date\((\d+)\)\//)
  if (match) {
    const timestamp = parseInt(match[1], 10)
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN')
  }
  return dateStr
}

class ScoopService {
  /**
   * 获取 Scoop 安装路径
   */
  async getScoopPath(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('echo %SCOOP%')
      const path = (stdout || '').toString().trim()
      return path || null
    } catch {
      return null
    }
  }

  /**
   * 列出已安装的应用 (使用 scoop export)
   */
  async listApps(): Promise<ScoopApp[]> {
    try {
      const { stdout } = await execAsync('scoop export')
      const output = (stdout || '').toString()
      const data = JSON.parse(output) as ScoopExport

      return data.apps.map((app) => ({
        name: app.Name,
        version: app.Version,
        description: app.Info || '',
        source: app.Source,
        updated: parseJsonDate(app.Updated)
      }))
    } catch (error) {
      console.error('Failed to list apps:', error)
      return []
    }
  }

  /**
   * 获取应用详情
   */
  async getAppInfo(appName: string): Promise<ScoopInfo | null> {
    try {
      const { stdout } = await execAsync(`scoop info ${appName} --json`)
      const output = (stdout || '').toString()
      const info = JSON.parse(output) as ScoopInfo
      return info
    } catch {
      return null
    }
  }

  /**
   * 搜索应用 (解析表格输出)
   */
  async searchApps(query: string): Promise<ScoopSearchResult[]> {
    try {
      const { stdout } = await execAsync(`scoop search ${query}`)
      const output = (stdout || '').toString()

      const results: ScoopSearchResult[] = []
      const lines = output.split('\n')

      // 跳过前两行 (标题和分隔线)
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // 解析表格格式: Name  Version  Source
        // 使用正则表达式提取各列
        const match = line.match(/^(\S+)\s+(\S+)\s+(\S+)/)
        if (match) {
          results.push({
            name: match[1],
            version: match[2],
            description: '',
            source: match[3]
          })
        }
      }

      return results
    } catch (error) {
      console.error('Failed to search apps:', error)
      return []
    }
  }

  /**
   * 安装应用
   */
  async installApp(appName: string): Promise<{ success: boolean; error?: string }> {
    try {
      await execAsync(`scoop install ${appName}`, {
        timeout: 300000
      })
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * 卸载应用
   */
  async uninstallApp(appName: string): Promise<{ success: boolean; error?: string }> {
    try {
      await execAsync(`scoop uninstall ${appName}`, {
        timeout: 300000
      })
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * 更新应用
   */
  async updateApp(appName: string): Promise<{ success: boolean; error?: string }> {
    try {
      await execAsync(`scoop update ${appName}`, {
        timeout: 300000
      })
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * 检查可用的更新
   */
  async checkUpdates(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('scoop status')
      const output = (stdout || '').toString()

      // 解析表格格式
      const updates = this.parseUpdatesTable(output)
      return updates.map((u) => u.name)
    } catch {
      return []
    }
  }

  /**
   * 获取可更新应用的详细信息
   */
  async getUpdates(): Promise<ScoopUpdateInfo[]> {
    try {
      const { stdout } = await execAsync('scoop status')
      const output = (stdout || '').toString()
      return this.parseUpdatesTable(output)
    } catch (error) {
      console.error('Failed to get updates:', error)
      return []
    }
  }

  /**
   * 解析 scoop status 表格输出
   */
  private parseUpdatesTable(output: string): ScoopUpdateInfo[] {
    const updates: ScoopUpdateInfo[] = []

    const lines = output.split('\n')

    // 跳过前两行 (标题和分隔线)
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // 检查是否是空行或分隔线
      if (line.startsWith('----') || line.startsWith('Name ')) continue

      // 表格格式: Name  Installed Version  Latest Version  Missing Dependencies  Info
      // 使用正则提取各列
      const match = line.match(/^(\S+)\s+(\S+)\s+(\S+)/)
      if (match) {
        updates.push({
          name: match[1],
          currentVersion: match[2],
          availableVersion: match[3],
          source: 'main' // 默认来源，无法从 status 输出获取
        })
      }
    }

    return updates
  }
}

export const scoopService = new ScoopService()
