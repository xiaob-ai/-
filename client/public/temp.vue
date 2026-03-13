<!-- ZhihuChat.vue -->
<template>
  <div class="min-h-screen bg-[#f6f6f6] flex justify-center py-8 px-4 font-sans">
    <!-- 主容器 -->
    <div class="w-full max-w-[888px] bg-white rounded-lg shadow-sm border border-[#e7e7e7] overflow-hidden flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[700px]">

      <!-- 左侧：会话列表 -->
      <div class="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-[#e7e7e7] flex flex-col bg-white">
        <!-- 头部 -->
        <div class="h-14 px-4 flex items-center justify-between border-b border-[#f0f0f0]">
          <h2 class="text-lg font-semibold text-[#121212]">私信</h2>
          <button
              class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors group"
              @click="showNewChatModal = true"
          >
            <svg class="w-5 h-5 text-[#8590a6] group-hover:text-[#175199]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="px-3 py-3">
          <div class="relative">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索联系人"
                class="w-full h-9 pl-9 pr-3 bg-[#f6f6f6] border border-transparent focus:border-[#175199] focus:bg-white rounded-md text-sm text-[#121212] placeholder-[#8590a6] outline-none transition-all"
            >
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8590a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- 会话列表 -->
        <div class="flex-1 overflow-y-auto">
          <div
              v-for="chat in filteredChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
              'flex items-center px-4 py-3 cursor-pointer transition-all hover:bg-[#f6f6f6] border-l-[3px]',
              currentChat?.id === chat.id ? 'bg-[#f6f6f6] border-[#175199]' : 'border-transparent'
            ]"
          >
            <div class="relative">
              <img :src="chat.avatar" class="w-10 h-10 rounded-full object-cover border border-[#e7e7e7]">
              <div
                  v-if="chat.unread > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#f1403c] rounded-full flex items-center justify-center text-[10px] text-white font-medium border-2 border-white px-1"
              >
                {{ chat.unread > 99 ? '99+' : chat.unread }}
              </div>
              <div v-if="chat.online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#12b886] rounded-full border-2 border-white"></div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <span class="text-[15px] font-medium text-[#121212] truncate">{{ chat.name }}</span>
                <span class="text-xs text-[#8590a6] whitespace-nowrap">{{ formatChatTime(chat.lastMessageTime) }}</span>
              </div>
              <p class="text-sm text-[#8590a6] truncate">{{ chat.lastMessage }}</p>
            </div>
          </div>

          <!-- 无搜索结果 -->
          <div v-if="filteredChats.length === 0" class="px-4 py-8 text-center text-[#8590a6] text-sm">
            未找到相关联系人
          </div>
        </div>
      </div>

      <!-- 右侧：聊天窗口 -->
      <div class="flex-1 flex flex-col bg-white min-w-0 relative">
        <template v-if="currentChat">
          <!-- 聊天头部 -->
          <div class="h-14 px-4 flex items-center justify-between border-b border-[#f0f0f0] bg-white">
            <div class="flex items-center gap-3">
              <img :src="currentChat.avatar" class="w-8 h-8 rounded-full object-cover">
              <div>
                <h3 class="text-[15px] font-semibold text-[#121212]">{{ currentChat.name }}</h3>
                <p v-if="currentChat.online" class="text-xs text-[#8590a6]">在线</p>
                <p v-else class="text-xs text-[#8590a6]">{{ currentChat.bio || '上次在线 2小时前' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                  class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
                  title="查看资料"
                  @click="viewProfile"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
              <button
                  class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
                  title="更多操作"
                  @click="showChatMenu = !showChatMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <div v-if="showChatMenu" class="absolute right-4 top-12 bg-white border border-[#e7e7e7] rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <button
                    class="w-full px-4 py-2 text-left text-sm text-[#f1403c] hover:bg-[#f6f6f6] transition-colors"
                    @click="deleteChat"
                >
                  删除会话
                </button>
                <button
                    class="w-full px-4 py-2 text-left text-sm text-[#121212] hover:bg-[#f6f6f6] transition-colors"
                    @click="blockUser"
                >
                  屏蔽用户
                </button>
              </div>
            </div>
          </div>

          <!-- 消息区域 -->
          <div
              ref="messageContainer"
              class="flex-1 overflow-y-auto px-4 py-4 bg-white scroll-smooth"
              @scroll="handleScroll"
          >
            <!-- 加载更多 -->
            <div v-if="loadingMore" class="text-center py-2 text-[#8590a6] text-xs">
              <svg class="w-4 h-4 animate-spin mx-auto mb-1" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              加载中...
            </div>

            <div class="space-y-4">
              <div
                  v-for="(msg, index) in messages"
                  :key="msg.id"
                  class="flex flex-col animate-fade-in"
              >
                <!-- 时间分隔线 -->
                <div v-if="shouldShowTimeDivider(index)" class="flex items-center justify-center my-4">
                  <span class="text-xs text-[#8590a6] bg-[#f6f6f6] px-3 py-1 rounded-full">
                    {{ formatMessageTime(msg.timestamp) }}
                  </span>
                </div>

                <!-- 消息气泡 -->
                <div :class="['flex items-end gap-3', msg.isSelf ? 'flex-row-reverse' : '']">
                  <img
                      :src="msg.isSelf ? currentUser.avatar : currentChat.avatar"
                      class="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#e7e7e7] cursor-pointer hover:opacity-80 transition-opacity"
                      @click="viewUserProfile(msg.isSelf ? currentUser.id : currentChat.id)"
                  >

                  <div :class="['flex flex-col max-w-[70%]', msg.isSelf ? 'items-end' : 'items-start']">
                    <!-- 引用内容 -->
                    <div
                        v-if="msg.quote"
                        class="mb-1 px-3 py-2 bg-[#f6f6f6] border-l-2 border-[#175199] rounded text-sm text-[#8590a6] max-w-full"
                    >
                      <p class="truncate">{{ msg.quote }}</p>
                    </div>

                    <!-- 消息内容 -->
                    <div
                        :class="[
                        'px-4 py-2.5 rounded-lg text-[15px] leading-relaxed break-words relative group transition-all',
                        msg.isSelf
                          ? 'bg-[#175199] text-white rounded-br-sm hover:bg-[#134d88]'
                          : 'bg-[#f6f6f6] text-[#121212] rounded-bl-sm border border-[#e7e7e7] hover:bg-[#f0f0f0]'
                      ]"
                    >
                      {{ msg.content }}

                      <!-- 操作按钮（悬停显示） -->
                      <div
                          :class="[
                          'absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-white shadow-sm rounded-md p-0.5 border border-[#e7e7e7]',
                          msg.isSelf ? 'right-full mr-2' : 'left-full ml-2'
                        ]"
                      >
                        <button
                            @click="quoteMessage(msg)"
                            class="p-1 hover:bg-[#f6f6f6] rounded text-[#8590a6] hover:text-[#175199]"
                            title="引用"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                          </svg>
                        </button>
                        <button
                            v-if="msg.isSelf"
                            @click="recallMessage(msg)"
                            class="p-1 hover:bg-[#f6f6f6] rounded text-[#8590a6] hover:text-[#f1403c]"
                            title="撤回"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- 状态 -->
                    <div v-if="msg.isSelf" class="flex items-center gap-1 mt-1">
                      <span v-if="msg.status === MessageStatus.READ" class="text-xs text-[#8590a6]">已读</span>
                      <span v-else-if="msg.status === MessageStatus.DELIVERED" class="text-xs text-[#8590a6]">已送达</span>
                      <span v-else-if="msg.status === MessageStatus.FAILED" class="text-xs text-[#f1403c] cursor-pointer hover:underline" @click="resendMessage(msg)">发送失败，点击重试</span>
                      <svg v-else-if="msg.status === MessageStatus.SENDING" class="w-3 h-3 text-[#8590a6] animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="border-t border-[#f0f0f0] bg-white p-4">
            <!-- 引用提示 -->
            <div
                v-if="quotingMessage"
                class="flex items-center justify-between mb-2 px-3 py-2 bg-[#f6f6f6] rounded-md text-sm text-[#8590a6] animate-slide-down"
            >
              <span class="truncate max-w-[90%]">引用：{{ quotingMessage.content }}</span>
              <button
                  @click="cancelQuote"
                  class="text-[#8590a6] hover:text-[#f1403c] p-1 hover:bg-white rounded transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- 工具栏 -->
            <div class="flex items-center gap-1 mb-2">
              <button
                  class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
                  title="表情"
                  @click="toggleEmojiPicker"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
              <button
                  class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
                  title="图片"
                  @click="triggerImageUpload"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </button>
              <button
                  class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
                  title="文件"
                  @click="triggerFileUpload"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
              </button>
              <div class="flex-1"></div>
              <span :class="['text-xs', messageInput.length > 450 ? 'text-[#f1403c]' : 'text-[#8590a6]']">
                {{ messageInput.length }}/500
              </span>
            </div>

            <!-- 输入框 -->
            <div class="relative">
              <textarea
                  ref="inputRef"
                  v-model="messageInput"
                  @keydown.enter.prevent="handleEnter"
                  @input="handleInput"
                  @paste="handlePaste"
                  placeholder="输入私信内容..."
                  rows="3"
                  maxlength="500"
                  class="w-full px-3 py-2 bg-[#f6f6f6] border border-transparent focus:border-[#175199] focus:bg-white rounded-lg text-[15px] text-[#121212] placeholder-[#8590a6] outline-none resize-none transition-all pr-20"
              ></textarea>
              <button
                  @click="sendMessage"
                  :disabled="!canSend"
                  :class="[
                  'absolute bottom-2 right-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  canSend
                    ? 'bg-[#175199] text-white hover:bg-[#134d88] active:scale-95'
                    : 'bg-[#e7e7e7] text-[#8590a6] cursor-not-allowed'
                ]"
              >
                发送
              </button>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-[#8590a6]">
          <div class="w-24 h-24 mb-4 bg-[#f6f6f6] rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-[#e7e7e7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <p class="text-base font-medium">选择一个会话开始聊天</p>
          <p class="text-sm mt-1 opacity-60">或与关注的人发起新对话</p>
          <button
              class="mt-4 px-4 py-2 bg-[#175199] text-white rounded-md text-sm hover:bg-[#134d88] transition-colors"
              @click="showNewChatModal = true"
          >
            发起新对话
          </button>
        </div>
      </div>
    </div>

    <!-- 新对话弹窗 -->
    <div v-if="showNewChatModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewChatModal = false">
      <div class="bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-[#121212] mb-4">发起新对话</h3>
        <input
            v-model="newChatSearch"
            type="text"
            placeholder="搜索用户..."
            class="w-full h-10 pl-4 pr-3 bg-[#f6f6f6] border border-[#e7e7e7] focus:border-[#175199] focus:bg-white rounded-md text-sm text-[#121212] placeholder-[#8590a6] outline-none transition-all mb-4"
        >
        <div class="max-h-60 overflow-y-auto">
          <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="flex items-center px-3 py-2 hover:bg-[#f6f6f6] rounded-md cursor-pointer transition-colors"
              @click="startNewChat(user)"
          >
            <img :src="user.avatar" class="w-10 h-10 rounded-full object-cover mr-3">
            <div>
              <p class="text-[15px] font-medium text-[#121212]">{{ user.name }}</p>
              <p class="text-xs text-[#8590a6]">{{ user.bio }}</p>
            </div>
          </div>
          <div v-if="filteredUsers.length === 0" class="text-center py-4 text-[#8590a6] text-sm">
            未找到用户
          </div>
        </div>
        <button
            class="mt-4 w-full py-2 border border-[#e7e7e7] text-[#8590a6] rounded-md hover:bg-[#f6f6f6] transition-colors"
            @click="showNewChatModal = false"
        >
          取消
        </button>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'

import {useUserStore} from "@/stores/user.ts";


const userStore = useUserStore()

// ==================== 类型定义 ====================

/** 消息发送状态 */
enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  RECALLED = 'recalled'
}

/** 消息类型 */
enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system'
}

/** 用户接口 */
interface User {
  id: string
  name: string
  avatar: string
  bio?: string
  online?: boolean
}

/** 消息接口 */
interface Message {
  id: string | number
  content: string
  timestamp: Date
  isSelf: boolean
  status: MessageStatus
  type: MessageType
  quote?: string
  fileName?: string
  fileSize?: number
  imageUrl?: string
}

/** 会话接口 */
interface Chat {
  id: number
  userId: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
  online: boolean
  bio?: string
}

// ==================== 响应式数据 ====================

const currentUser = ref<User>({
  id: 'me',
  name: '当前用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  bio: '热爱技术，热爱生活'
})

const searchQuery = ref<string>('')
const messageInput = ref<string>('')
const quotingMessage = ref<Message | null>(null)
const currentChat = ref<Chat | null>(null)
const messages = ref<Message[]>([])
const messageContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const loadingMore = ref<boolean>(false)
const showChatMenu = ref<boolean>(false)
const showNewChatModal = ref<boolean>(false)
const newChatSearch = ref<string>('')
const previewImage = ref<string | null>(null)

// ==================== 模拟数据 ====================

const chats = ref<Chat[]>([
  {
    id: 1,
    userId: 'zhihu-helper',
    name: '知乎小管家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhihu',
    lastMessage: '你好，欢迎使用知乎！',
    lastMessageTime: new Date(),
    unread: 2,
    online: true,
    bio: '知乎官方账号'
  },
  {
    id: 2,
    userId: 'pm-wang',
    name: '产品经理老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    lastMessage: '这个功能什么时候上线？',
    lastMessageTime: new Date(Date.now() - 600000),
    unread: 0,
    online: true,
    bio: '专注用户体验'
  },
  {
    id: 3,
    userId: 'designer-li',
    name: '设计师小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    lastMessage: '设计稿已经发你了',
    lastMessageTime: new Date(Date.now() - 7200000),
    unread: 1,
    online: false,
    bio: 'UI/UX 设计师'
  },
  {
    id: 4,
    userId: 'dev-zhang',
    name: '前端开发小张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    lastMessage: '组件写好了，看一下',
    lastMessageTime: new Date(Date.now() - 86400000),
    unread: 0,
    online: false,
    bio: 'Vue/React 开发者'
  }
])

const allUsers = ref<User[]>([
  { id: 'user1', name: '前端达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User1', bio: '专注前端技术分享' },
  { id: 'user2', name: '产品经理阿强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User2', bio: '数据驱动决策' },
  { id: 'user3', name: '设计师小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User3', bio: '追求极致视觉' },
  { id: 'user4', name: '全栈工程师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User4', bio: '从前端到后端' }
])

// ==================== 计算属性 ====================

const filteredChats = computed<Chat[]>(() => {
  if (!searchQuery.value.trim()) return chats.value
  const query = searchQuery.value.toLowerCase()
  return chats.value.filter(chat =>
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
  )
})

const filteredUsers = computed<User[]>(() => {
  if (!newChatSearch.value.trim()) return allUsers.value
  const query = newChatSearch.value.toLowerCase()
  return allUsers.value.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.bio?.toLowerCase().includes(query)
  )
})

const canSend = computed<boolean>(() => {
  return messageInput.value.trim().length > 0 && messageInput.value.length <= 500
})

// ==================== 方法 ====================

/** 选择会话 */
const selectChat = (chat: Chat): void => {
  currentChat.value = chat
  chat.unread = 0
  loadMessages(chat.id)
  showChatMenu.value = false
  nextTick(() => {
    scrollToBottom()
    focusInput()
  })
}

/** 加载消息历史 */
const loadMessages = (chatId: number): void => {
  const now = new Date()
  messages.value = [
    {
      id: 'msg-1',
      content: '你好，最近怎么样？',
      timestamp: new Date(now.getTime() - 86400000),
      isSelf: false,
      status: MessageStatus.READ,
      type: MessageType.TEXT
    },
    {
      id: 'msg-2',
      content: '挺好的，最近在忙一个新项目',
      timestamp: new Date(now.getTime() - 82800000),
      isSelf: true,
      status: MessageStatus.READ,
      type: MessageType.TEXT
    },
    {
      id: 'msg-3',
      content: '听起来不错，是什么类型的项目？',
      timestamp: new Date(now.getTime() - 79200000),
      isSelf: false,
      status: MessageStatus.READ,
      type: MessageType.TEXT
    },
    {
      id: 'msg-4',
      content: '一个知识分享平台的私信功能重构，要求界面简洁优雅，使用 Vue3 + TypeScript + Tailwind CSS',
      timestamp: new Date(now.getTime() - 7200000),
      isSelf: true,
      status: MessageStatus.READ,
      type: MessageType.TEXT
    },
    {
      id: 'msg-5',
      content: '哇，这听起来很有意思！用 Vue3 组合式 API 吗？',
      timestamp: new Date(now.getTime() - 3600000),
      isSelf: false,
      status: MessageStatus.READ,
      type: MessageType.TEXT
    }
  ]
}

/** 发送消息 */
const sendMessage = async (): Promise<void> => {
  if (!canSend.value || !currentChat.value) return

  const content = messageInput.value.trim()
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    content,
    timestamp: new Date(),
    isSelf: true,
    status: MessageStatus.SENDING,
    type: MessageType.TEXT,
    quote: quotingMessage.value?.content
  }

  messages.value.push(newMessage)
  messageInput.value = ''
  quotingMessage.value = null
  resetInputHeight()

  nextTick(() => {
    scrollToBottom()
    focusInput()
  })

  // 模拟发送
  try {
    await simulateSend(newMessage)
    newMessage.status = MessageStatus.SENT

    setTimeout(() => {
      newMessage.status = MessageStatus.READ
    }, 1500)

    // 更新会话列表
    updateChatLastMessage(currentChat.value.id, content)

    // 模拟自动回复
    setTimeout(() => {
      receiveReply()
    }, 2500)

  } catch (error) {
    newMessage.status = MessageStatus.FAILED
    console.error('发送失败:', error)
  }
}

/** 模拟发送请求 */
const simulateSend = (message: Message): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 800)
  })
}

/** 重发消息 */
const resendMessage = (msg: Message): void => {
  msg.status = MessageStatus.SENDING
  simulateSend(msg).then(() => {
    msg.status = MessageStatus.SENT
    setTimeout(() => {
      msg.status = MessageStatus.READ
    }, 1000)
  })
}

/** 接收回复 */
const receiveReply = (): void => {
  if (!currentChat.value) return

  const replies = [
    '明白了，继续说',
    '这个设计确实不错，很知乎风格',
    '我觉得可以这么实现，用 Composition API 挺好的',
    '有道理，TypeScript 的类型安全确实很重要',
    '期待看到最终效果！',
    '需要我帮忙测试吗？我可以提点 UX 建议',
    '界面看起来很干净，符合知乎的极简美学'
  ]

  const reply: Message = {
    id: `msg-${Date.now()}`,
    content: replies[Math.floor(Math.random() * replies.length)],
    timestamp: new Date(),
    isSelf: false,
    status: MessageStatus.READ,
    type: MessageType.TEXT
  }

  messages.value.push(reply)
  updateChatLastMessage(currentChat.value.id, reply.content, true)

  nextTick(() => {
    scrollToBottom()
  })
}

/** 更新会话最后消息 */
const updateChatLastMessage = (chatId: number, content: string, isReply: boolean = false): void => {
  const chat = chats.value.find(c => c.id === chatId)
  if (chat) {
    chat.lastMessage = isReply ? content : `你: ${content}`
    chat.lastMessageTime = new Date()
    // 移到顶部
    const index = chats.value.findIndex(c => c.id === chatId)
    if (index > 0) {
      chats.value.splice(index, 1)
      chats.value.unshift(chat)
    }
  }
}

/** 引用消息 */
const quoteMessage = (msg: Message): void => {
  quotingMessage.value = msg
  focusInput()
}

/** 取消引用 */
const cancelQuote = (): void => {
  quotingMessage.value = null
}

/** 撤回消息 */
const recallMessage = (msg: Message): void => {
  if (!msg.isSelf) return
  const index = messages.value.findIndex(m => m.id === msg.id)
  if (index !== -1) {
    messages.value[index] = {
      ...msg,
      content: '消息已撤回',
      status: MessageStatus.RECALLED,
      type: MessageType.SYSTEM
    }
  }
}

/** 处理回车发送 */
const handleEnter = (e: KeyboardEvent): void => {
  if (!e.shiftKey) {
    sendMessage()
  } else {
    // Shift+Enter 换行
    messageInput.value += '\n'
    handleInput(e as unknown as Event)
  }
}

/** 处理输入 */
const handleInput = (e: Event): void => {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = Math.min(target.scrollHeight, 120) + 'px'
}

/** 重置输入框高度 */
const resetInputHeight = (): void => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
}

/** 处理粘贴 */
const handlePaste = (e: ClipboardEvent): void => {
  const items = e.clipboardData?.items
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile()
        if (blob) {
          // 处理粘贴的图片
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            // 这里可以实现图片发送逻辑
            console.log('粘贴了图片:', result)
          }
          reader.readAsDataURL(blob)
        }
      }
    }
  }
}

/** 聚焦输入框 */
const focusInput = (): void => {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

/** 滚动到底部 */
const scrollToBottom = (): void => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}





/** 格式化聊天列表时间 */
const formatChatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/** 格式化消息时间 */
const formatMessageTime = (date: Date): string => {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
}

/** 查看用户资料 */
const viewUserProfile = (userId: string): void => {
  console.log('查看用户资料:', userId)
  // 实现跳转逻辑
}

const viewProfile = (): void => {
  if (currentChat.value) {
    viewUserProfile(currentChat.value.userId)
  }
}

/** 删除会话 */
const deleteChat = (): void => {
  if (!currentChat.value) return
  const index = chats.value.findIndex(c => c.id === currentChat.value!.id)
  if (index !== -1) {
    chats.value.splice(index, 1)
    currentChat.value = null
    showChatMenu.value = false
  }
}

/** 屏蔽用户 */
const blockUser = (): void => {
  console.log('屏蔽用户:', currentChat.value?.userId)
  showChatMenu.value = false
  // 实现屏蔽逻辑
}

/** 发起新对话 */
const startNewChat = (user: User): void => {
  const existingChat = chats.value.find(c => c.userId === user.id)
  if (existingChat) {
    selectChat(existingChat)
  } else {
    const newChat: Chat = {
      id: Date.now(),
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      lastMessage: '暂无消息',
      lastMessageTime: new Date(),
      unread: 0,
      online: user.online || false,
      bio: user.bio
    }
    chats.value.unshift(newChat)
    selectChat(newChat)
  }
  showNewChatModal.value = false
  newChatSearch.value = ''
}

/** 切换表情选择器 */
const toggleEmojiPicker = (): void => {
  // 实现表情选择器逻辑
  console.log('打开表情选择器')
}

/** 触发图片上传 */
const triggerImageUpload = (): void => {
  // 实现图片上传逻辑
  console.log('触发图片上传')
}

/** 触发文件上传 */
const triggerFileUpload = (): void => {
  // 实现文件上传逻辑
  console.log('触发文件上传')
}

// ==================== 生命周期 ====================

// 点击外部关闭菜单
const handleClickOutside = (e: MouseEvent): void => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showChatMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听消息变化自动滚动
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d3d3d3;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b3b3b3;
}

/* 选中文字颜色 */
::selection {
  background: rgba(23, 81, 153, 0.2);
  color: #175199;
}

/* 动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}
</style>