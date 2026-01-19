<script setup lang="ts">
import { ref } from 'vue'
import { useScoopStore } from '../stores/scoop'
import type { ScoopSearchResult } from '../types'

const store = useScoopStore()
const searchQuery = ref('')
const isSearching = ref(false)

async function handleSearch(): Promise<void> {
  if (!searchQuery.value.trim()) return

  isSearching.value = true
  await store.searchApps(searchQuery.value)
  isSearching.value = false
}

async function handleInstall(app: ScoopSearchResult): Promise<void> {
  try {
    const result = await store.installApp(app.name)
    if (result.success) {
      // 刷新已安装应用列表
      await store.fetchInstalledApps()
    }
  } catch (error) {
    console.error('Install failed:', error)
  }
}
</script>

<template>
  <div class="app-search-container">
    <div class="search-header">
      <el-input
        v-model="searchQuery"
        class="search-input"
        placeholder="输入应用名称搜索..."
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :loading="isSearching" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <div v-if="store.isLoading && !store.searchResults.length" class="loading">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <span>搜索中...</span>
    </div>

    <el-empty
      v-else-if="store.searchQuery && !store.searchResults.length"
      description="未找到相关应用"
    />

    <div v-else-if="store.searchResults.length" class="results">
      <div class="results-count">找到 {{ store.searchResults.length }} 个结果</div>

      <el-table :data="store.searchResults" style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="150">
          <template #default="{ row }">
            <div class="app-name">
              <el-icon><Box /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="source" label="来源" width="100">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.source }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :loading="store.isLoading"
              @click="handleInstall(row)"
            >
              安装
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-else class="tips">
      <el-empty description="输入应用名称开始搜索" />
    </div>
  </div>
</template>

<style scoped>
.app-search-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-header {
  margin-bottom: 20px;
}

.search-input {
  max-width: 500px;
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

.results-count {
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

.tips {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
