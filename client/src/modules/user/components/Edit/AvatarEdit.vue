<template>
  <div class="avatar-selector ">
    <!-- 标题区域 -->
    <div class="selector-header">
      <h3 class="title">选择头像</h3>
      <p class="subtitle">从预设头像中选择一个作为你的形象</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="controls">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索头像..."
            class="search-input"
        />
      </div>

      <div class="filter-tabs">
        <button
            v-for="category in categories"
            :key="category.id"
            :class="['tab-btn', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id as AvatarCategory"
        >
          <span class="tab-icon">{{ category.icon }}</span>
          <span class="tab-text">{{ category.name }}</span>
          <span class="tab-count">{{ getCategoryCount(category.id) }}</span>
        </button>
      </div>
    </div>

    <!-- 头像网格 -->
    <div class="avatars-grid" :class="{ 'has-selection': selectedAvatar }">
      <div
          v-for="avatar in filteredAvatars"
          :key="avatar.id"
          :class="['avatar-item', {
          selected: selectedAvatar?.id === avatar.id,
          'is-favorite': avatar.isFavorite
        }]"
          @click="selectAvatar(avatar)"
      >
        <div class="avatar-wrapper">
          <img
              :src="avatar.url"
              :alt="avatar.name"
              class="avatar-image"
              loading="lazy"
              @error="handleImageError"
          />
          <div class="avatar-overlay">
            <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <button
              class="favorite-btn"
              @click.stop="toggleFavorite(avatar)"
              :class="{ active: avatar.isFavorite }"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
        <span class="avatar-name">{{ avatar.name }}</span>
        <span class="avatar-category">{{ getCategoryName(avatar.category) }}</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredAvatars.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>没有找到匹配的头像</p>
      <button @click="resetFilters" class="reset-btn">重置筛选</button>
    </div>
    <div class="bg-secondary rounded p-2 text-white w-20 text-center mx-auto cursor-pointer " @click="$emit('close')">收起</div>
    <!-- 底部操作栏 -->
    <div class="action-bar" v-click-outside="hideBottomSheet" :class="{ visible: selectedAvatar }">
      <div class="selected-preview">
        <img :src="selectedAvatar?.url" class="preview-img" />
        <div class="preview-info">
          <span class="preview-name">{{ selectedAvatar?.name }}</span>
          <span class="preview-category">{{ getCategoryName(selectedAvatar?.category) }}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="clearSelection" class="btn-secondary">清除</button>
        <button @click="confirmSelection" class="btn-primary">
          确认选择
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed} from 'vue'
import type{ AvatarItem, AvatarCategory } from '@/types'
import {vClickOutside} from "@/utils"
// ==================== 类型定义 ====================



/** 分类配置接口 */
interface CategoryConfig {
  id: AvatarCategory | string
  name: string
  icon: string
}



/** 组件事件定义 */
interface Emits {
  (e: 'select', avatar: AvatarItem): void
  (e: 'update:favorite', avatarId: string, isFavorite: boolean): void
  (e: 'close'): void
}

/** 组件暴露的方法接口 */
interface AvatarSelectorExpose {
  selectedAvatar: AvatarItem | null
  clearSelection: () => void
  getSelectedAvatar: () => AvatarItem | null
  resetFilters: () => void
}

// ==================== 常量定义 ====================

const categories: CategoryConfig[] = [
  { id: 'all', name: '全部', icon: '✨' },
  { id: 'anime', name: '动漫', icon: '🎨' },
  { id: 'pixel', name: '像素', icon: '👾' },
  { id: 'abstract', name: '抽象', icon: '🎭' },
  { id: 'animal', name: '动物', icon: '🐾' },
  { id: 'robot', name: '机器人', icon: '🤖' }
]

const presetAvatars: AvatarItem[] = [
  // 动漫风格
  { id: '1', name: '樱花少女', category: 'anime', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf', isFavorite: false },
  { id: '2', name: '热血少年', category: 'anime', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4', isFavorite: false },
  { id: '3', name: '魔法师', category: 'anime', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack&backgroundColor=c0aede', isFavorite: false },
  { id: '4', name: '剑士', category: 'anime', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eden&backgroundColor=ffd5dc', isFavorite: false },

  // 像素风格
  { id: '5', name: '像素勇者', category: 'pixel', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Annie&backgroundColor=ffdfbf', isFavorite: false },
  { id: '6', name: '像素法师', category: 'pixel', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bob&backgroundColor=b6e3f4', isFavorite: false },
  { id: '7', name: '像素忍者', category: 'pixel', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Calvin&backgroundColor=c0aede', isFavorite: false },
  { id: '8', name: '像素骑士', category: 'pixel', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Dora&backgroundColor=ffd5dc', isFavorite: false },

  // 抽象几何
  { id: '9', name: '几何蓝', category: 'abstract', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Eliza&backgroundColor=b6e3f4', isFavorite: false },
  { id: '10', name: '几何紫', category: 'abstract', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Frank&backgroundColor=c0aede', isFavorite: false },
  { id: '11', name: '几何橙', category: 'abstract', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Gina&backgroundColor=ffdfbf', isFavorite: false },
  { id: '12', name: '几何粉', category: 'abstract', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Henry&backgroundColor=ffd5dc', isFavorite: false },

  // 动物头像
  { id: '13', name: '小狐狸', category: 'animal', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ivy&backgroundColor=ffdfbf', isFavorite: false },
  { id: '14', name: '小熊', category: 'animal', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jack&backgroundColor=b6e3f4', isFavorite: false },
  { id: '15', name: '小兔', category: 'animal', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Kate&backgroundColor=c0aede', isFavorite: false },
  { id: '16', name: '小猫', category: 'animal', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo&backgroundColor=ffd5dc', isFavorite: false },

  // 机器人
  { id: '17', name: '机甲战士', category: 'robot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mike&backgroundColor=b6e3f4', isFavorite: false },
  { id: '18', name: '管家机器人', category: 'robot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nina&backgroundColor=c0aede', isFavorite: false },
  { id: '19', name: '探索者', category: 'robot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Oscar&backgroundColor=ffdfbf', isFavorite: false },
  { id: '20', name: '守护者', category: 'robot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Penny&backgroundColor=ffd5dc', isFavorite: false }
]

// ==================== 状态定义 ====================

const avatars = ref<AvatarItem[]>([...presetAvatars])
const activeCategory = ref<AvatarCategory>('all')
const searchQuery = ref<string>('')
const selectedAvatar = ref<AvatarItem | null>(null)

// ==================== 计算属性 ====================

const filteredAvatars = computed<AvatarItem[]>(() => {
  let result = [...avatars.value]

  // 分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter((a: AvatarItem) => a.category === activeCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((a: AvatarItem) =>
        a.name.toLowerCase().includes(query) ||
        getCategoryName(a.category).toLowerCase().includes(query)
    )
  }

  // 收藏置顶排序
  return result.sort((a: AvatarItem, b: AvatarItem) =>
      (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
  )
})

// ==================== 方法定义 ====================

/**
 * 获取分类下的头像数量
 * @param categoryId - 分类ID
 * @returns 头像数量
 */
const getCategoryCount = (categoryId: string): number => {
  if (categoryId === 'all') return avatars.value.length
  return avatars.value.filter((a: AvatarItem) => a.category === categoryId).length
}

/**
 * 获取分类名称
 * @param categoryId - 分类ID
 * @returns 分类名称
 */
const getCategoryName = (categoryId: AvatarCategory | string | undefined): string => {
  if (!categoryId) return ''
  const category = categories.find((c: CategoryConfig) => c.id === categoryId)
  return category?.name || String(categoryId)
}
// 隐藏下部弹框
const hideBottomSheet = (e: Event): void => {
    const el=e.target as HTMLElement
    if(e&&selectedAvatar.value&&el.contains(document.querySelector('.avatar-item'))){
      clearSelection()
    }
}

/**
 * 选择头像
 * @param avatar - 选中的头像对象
 */
const selectAvatar = (avatar: AvatarItem): void => {
  selectedAvatar.value = avatar
}

/**
 * 切换收藏状态
 * @param avatar - 目标头像对象
 */
const toggleFavorite = (avatar: AvatarItem): void => {
  avatar.isFavorite = !avatar.isFavorite
  emit('update:favorite', avatar.id, avatar.isFavorite)
}

/**
 * 清除当前选择
 */
const clearSelection = (): void => {
  selectedAvatar.value = null
}

/**
 * 确认选择并触发事件
 */
const confirmSelection = (): void => {
  if (selectedAvatar.value) {
    emit('select', selectedAvatar.value)
  }
}

/**
 * 重置所有筛选条件
 */
const resetFilters = (): void => {
  activeCategory.value = 'all'
  searchQuery.value = ''
}

/**
 * 处理图片加载失败
 * @param event - 错误事件对象
 */
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%23999"%3E头像%3C/text%3E%3C/svg%3E'
}

// ==================== 事件与暴露 ====================

const emit = defineEmits<Emits>()

defineExpose<AvatarSelectorExpose>({
  clearSelection,
  getSelectedAvatar: (): AvatarItem | null => selectedAvatar.value,
  resetFilters
})
</script>

<style scoped>
.avatar-selector {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 头部样式 */
.selector-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 控制区域 */
.controls {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f9fafb;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* 分类标签 */
.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: #f3f4f6;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;
}

.tab-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.tab-btn.active {
  background: #6366f1;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.tab-icon {
  font-size: 14px;
}

.tab-count {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.tab-btn.active .tab-count {
  background: rgba(255,255,255,0.3);
}

/* 头像网格 */
.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  margin-bottom: 80px;
  transition: margin-bottom 0.3s ease;
}

.avatars-grid.has-selection {
  margin-bottom: 100px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.avatar-item:hover {
  transform: translateY(-4px);
}

.avatar-item.selected {
  transform: scale(1.05);
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  overflow: hidden;
  background: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.avatar-item:hover .avatar-wrapper {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.avatar-item.selected .avatar-wrapper {
  box-shadow: 0 0 0 3px #6366f1, 0 8px 24px rgba(99, 102, 241, 0.25);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-item:hover .avatar-image {
  transform: scale(1.1);
}

/* 选中遮罩 */
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-item.selected .avatar-overlay {
  opacity: 1;
}

.check-icon {
  width: 32px;
  height: 32px;
  color: white;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: check-draw 0.3s ease forwards;
}

@keyframes check-draw {
  to { stroke-dashoffset: 0; }
}

/* 收藏按钮 */
.favorite-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 10;
}

.avatar-item:hover .favorite-btn,
.favorite-btn.active {
  opacity: 1;
  transform: scale(1);
}

.favorite-btn svg {
  width: 14px;
  height: 14px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.favorite-btn.active svg {
  color: #ef4444;
  filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
}

.favorite-btn:hover {
  transform: scale(1.1) !important;
  background: white;
}

/* 头像信息 */
.avatar-name {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-category {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

/* 收藏标识 */
.is-favorite .avatar-wrapper::before {
  content: '★';
  position: absolute;
  top: -4px;
  left: -4px;
  width: 20px;
  height: 20px;
  background: #fbbf24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  box-shadow: 0 2px 6px rgba(251, 191, 36, 0.4);
  z-index: 5;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.reset-btn {
  margin-top: 12px;
  padding: 8px 20px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #f5f5ff;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
}

.action-bar.visible {
  transform: translateY(0);
}

.selected-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.preview-info {
  display: flex;
  flex-direction: column;
}

.preview-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.preview-category {
  font-size: 12px;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primary {
  padding: 10px 24px;
  border: none;
  background: #6366f1;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* 响应式 */
@media (max-width: 640px) {
  .avatar-selector {
    padding: 16px;
    border-radius: 0;
    max-width: 100%;
  }

  .avatars-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }

  .avatar-wrapper {
    width: 70px;
    height: 70px;
  }

  .action-bar {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
  }

  .btn-secondary, .btn-primary {
    flex: 1;
    justify-content: center;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .avatar-selector {
    background: #1f2937;
  }

  .title {
    color: #f9fafb;
  }

  .subtitle {
    color: #9ca3af;
  }

  .search-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .search-input:focus {
    border-color: #818cf8;
    background: #374151;
  }

  .tab-btn {
    background: #374151;
    color: #d1d5db;
  }

  .tab-btn:hover {
    background: #4b5563;
  }

  .avatar-name {
    color: #e5e7eb;
  }

  .avatar-wrapper {
    background: #374151;
  }

  .action-bar {
    background: rgba(31, 41, 55, 0.95);
    border-color: #374151;
  }

  .preview-name {
    color: #f9fafb;
  }

  .btn-secondary {
    background: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
  }
}
</style>