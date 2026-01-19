<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScoopStore } from '../stores/scoop'
import type { ScoopApp } from '../types'

const store = useScoopStore()
const searchText = ref('')
const selectedApp = ref<ScoopApp | null>(null)
const showDetail = ref(false)

const filteredApps = computed(() => {
  if (!searchText.value) return store.installedApps
  const query = searchText.value.toLowerCase()
  return store.installedApps.filter(
    (app) => app.name.toLowerCase().includes(query) || app.description.toLowerCase().includes(query)
  )
})

function selectApp(app: ScoopApp): void {
  selectedApp.value = app
  showDetail.value = true
}

function closeDetail(): void {
  showDetail.value = false
  selectedApp.value = null
}

async function handleUninstall(): Promise<void> {
  if (!selectedApp.value) return

  try {
    await store.uninstallApp(selectedApp.value.name)
    closeDetail()
  } catch (error) {
    console.error('Uninstall failed:', error)
  }
}

async function handleUpdate(): Promise<void> {
  if (!selectedApp.value) return

  try {
    await store.updateApp(selectedApp.value.name)
  } catch (error) {
    console.error('Update failed:', error)
  }
}
</script>

<template>
  <div class="app-list-container">
    <el-input v-model="searchText" placeholder="搜索已安装的应用..." clearable class="search-input">
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <div v-if="store.isLoading && !store.installedApps.length" class="loading">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <el-empty v-else-if="!filteredApps.length" description="没有找到应用" />

    <el-table
      v-else
      :data="filteredApps"
      highlight-current-row
      style="width: 100%"
      @row-click="selectApp"
    >
      <el-table-column prop="name" label="名称" min-width="150">
        <template #default="{ row }">
          <div class="app-name">
            <el-icon><Box /></el-icon>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="source" label="来源" width="120" />
      <el-table-column prop="updated" label="更新时间" width="180" />
    </el-table>

    <!-- 应用详情抽屉 -->
    <el-drawer
      v-model="showDetail"
      :title="selectedApp?.name || '应用详情'"
      direction="rtl"
      size="400px"
    >
      <template v-if="selectedApp">
        <div class="app-detail">
          <div class="detail-header">
            <el-icon :size="48" color="#409eff"><Box /></el-icon>
            <div>
              <h3>{{ selectedApp.name }}</h3>
              <el-tag type="info" size="small">{{ selectedApp.version }}</el-tag>
            </div>
          </div>

          <el-descriptions :column="1" border class="detail-info">
            <el-descriptions-item label="描述">
              {{ selectedApp.description || '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="来源">
              <el-tag size="small">{{ selectedApp.source }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ selectedApp.updated }}
            </el-descriptions-item>
          </el-descriptions>

          <div class="detail-actions">
            <el-button type="primary" @click="handleUpdate">
              <el-icon><Refresh /></el-icon>
              更新
            </el-button>
            <el-button type="danger" @click="handleUninstall">
              <el-icon><Delete /></el-icon>
              卸载
            </el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.app-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-input {
  margin-bottom: 16px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: var(--el-text-color-secondary);
}

.app-name {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

:deep(.el-table) {
  --el-table-text-color: var(--el-text-color-primary);
  --el-table-header-text-color: var(--el-text-color-secondary);
  --el-table-row-hover-bg-color: var(--el-fill-color-light);
}

.app-detail {
  padding: 0 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: var(--el-text-color-primary);
}

.detail-info {
  margin-bottom: 24px;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
