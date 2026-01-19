<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useScoopStore } from './stores/scoop'
import AppList from './components/AppList.vue'
import AppSearch from './components/AppSearch.vue'
import AppUpdates from './components/AppUpdates.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const store = useScoopStore()
const activeTab = ref('installed')

onMounted(async () => {
  await store.fetchScoopPath()
  if (store.scoopPath) {
    await store.fetchInstalledApps()
    await store.fetchUpdates()
  }
})
</script>

<template>
  <el-config-provider :theme="store.theme === 'dark' ? { dark: true } : undefined">
    <el-container class="app-container">
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <el-icon :size="32" color="#409eff"><Box /></el-icon>
          <span>Jing Scoop</span>
        </div>

        <el-menu
          :default-active="activeTab"
          class="sidebar-menu"
          @select="(key: string) => (activeTab = key)"
        >
          <el-menu-item index="installed">
            <el-icon><List /></el-icon>
            <span>已安装</span>
          </el-menu-item>
          <el-menu-item index="updates">
            <el-icon><RefreshRight /></el-icon>
            <span>可更新</span>
            <el-badge
              v-if="store.updateCount > 0"
              :value="store.updateCount"
              :max="99"
              class="update-badge"
            />
          </el-menu-item>
          <el-menu-item index="search">
            <el-icon><Search /></el-icon>
            <span>搜索安装</span>
          </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">
          <div v-if="store.scoopPath" class="scoop-path">
            <el-icon><Location /></el-icon>
            <el-tooltip :content="store.scoopPath" placement="top">
              <span class="path-text">{{ store.scoopPath }}</span>
            </el-tooltip>
          </div>
          <el-alert v-else title="未检测到 Scoop" type="warning" :closable="false" />
          <ThemeToggle />
        </div>
      </el-aside>

      <el-main class="main-content">
        <el-header class="header">
          <h2>
            {{
              activeTab === 'installed'
                ? '已安装的应用'
                : activeTab === 'updates'
                  ? '可更新'
                  : '搜索并安装应用'
            }}
          </h2>
          <div class="header-actions">
            <el-button
              v-if="activeTab === 'installed'"
              type="primary"
              :loading="store.isLoading"
              @click="store.fetchInstalledApps()"
            >
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </el-header>

        <div class="content">
          <AppList v-if="activeTab === 'installed'" />
          <AppUpdates v-else-if="activeTab === 'updates'" />
          <AppSearch v-else />
        </div>
      </el-main>

      <el-message-box />
    </el-container>
  </el-config-provider>
</template>

<style>
html {
  --el-text-color-primary: #303133;
  --el-text-color-secondary: #606266;
}

html.dark {
  --el-bg-color: #141414;
  --el-bg-color-page: #1d1d1d;
  --el-border-color: #434343;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-secondary: #a3a6ad;
}
</style>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  background: var(--el-bg-color-page);
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.update-badge {
  margin-left: auto;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--el-border-color);
}

.scoop-path {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.path-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.main-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color-page);
}

.header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style>
