<script setup lang="ts">
import { ref } from 'vue'
import { useScoopStore } from '../stores/scoop'
import type { ScoopUpdateInfo } from '../types'

const store = useScoopStore()
const selectedApps = ref<string[]>([])
const isUpdating = ref(false)

async function fetchUpdates(): Promise<void> {
  await store.fetchUpdates()
  selectedApps.value = store.updates.map((u) => u.name)
}

async function handleUpdateAll(): Promise<void> {
  isUpdating.value = true
  try {
    for (const appName of selectedApps.value) {
      await store.updateApp(appName)
    }
    await fetchUpdates()
  } finally {
    isUpdating.value = false
  }
}

async function handleUpdate(app: ScoopUpdateInfo): Promise<void> {
  await store.updateApp(app.name)
  await fetchUpdates()
}

function handleSelectionChange(rows: ScoopUpdateInfo[]): void {
  selectedApps.value = rows.map((r) => r.name)
}
</script>

<template>
  <div class="app-updates-container">
    <div class="updates-header">
      <el-button type="primary" :loading="store.isLoading" @click="fetchUpdates">
        <el-icon><Refresh /></el-icon>
        检查更新
      </el-button>
      <el-button
        v-if="store.updates.length > 0"
        type="success"
        :loading="isUpdating"
        :disabled="selectedApps.length === 0"
        @click="handleUpdateAll"
      >
        <el-icon><Download /></el-icon>
        更新选中 ({{ selectedApps.length }})
      </el-button>
    </div>

    <div v-if="store.isLoading && !store.updates.length" class="loading">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <span>检查更新中...</span>
    </div>

    <el-empty v-else-if="store.updates.length === 0" description="所有应用已是最新版本">
      <el-button type="primary" @click="fetchUpdates">
        <el-icon><Refresh /></el-icon>
        重新检查
      </el-button>
    </el-empty>

    <div v-else class="updates-list">
      <div class="updates-count">{{ store.updates.length }} 个应用可更新</div>

      <el-table :data="store.updates" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="名称" min-width="150">
          <template #default="{ row }">
            <div class="app-name">
              <el-icon><Box /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="当前版本" width="120">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.currentVersion }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="可用版本" width="120">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.availableVersion }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.source }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :loading="store.isLoading"
              @click="handleUpdate(row)"
            >
              更新
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.app-updates-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.updates-header {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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

.updates-count {
  margin-bottom: 12px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
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
</style>
