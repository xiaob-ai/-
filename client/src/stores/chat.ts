// stores/chat.ts
import { defineStore } from 'pinia';
import {computed, reactive, ref} from 'vue';
import { io, Socket } from 'socket.io-client';
import type {ChatUser, Conversation} from "@/utils/request/chat/types.ts";
import {ElMessage} from "element-plus";
import type {Message} from "@/utils/request/chat/types.ts";


export const useChatStore = defineStore('chat', () => {
    // State
    const socket = ref<Socket | null>(null);
    const conversations = ref<Conversation[]>([]);
    const isConnected = ref(false);
    const onlineUsersId = ref<Set<string>>(new Set());
    const joinedConversation = ref<Set<string>>(new Set())
    const yourId = ref('')
    // 聊天数据
    const messagesMap = reactive<Map<string, Message[]>>(new Map())
    const currentChatter = ref<ChatUser| null>(null)
    const connectChatters = ref<Map<string, ChatUser>>(new Map())
    const currentConservationKey = ref('')
    //当前的聊天记录
    const currentChatHistory = computed(()=>{
        return messagesMap.get(currentConservationKey.value) || [] as Message[]
    })
    const conversationIsLoading = ref(false)
    // Actions
    function connect(token: string) {
        //建立连接
        socket.value = io('http://localhost:3001', {
            transports: ['websocket'],
            auth: { token },
        });
        socket.value.on('init_data',initData)
        // 监听连接状态
        socket.value.on('connect', () => {
            isConnected.value = true;
            ElMessage.success('websocket连接成功');
        });
        socket.value.on('error', (error) => {
            ElMessage.error(error);
        })
        socket.value.on('joinChat',onJoinChat)
        socket.value.on('new_message',onNewMessage)
        socket.value.on('disconnect', () => {
            isConnected.value = false;
            ElMessage.error('websocket连接断开');
        });
        // 监听用户上线信息
        socket.value.on('userOnline',event=>{ onlineUsersId.value.add(event.userId)})
        // 监听用户下线信息
        socket.value.on('userOffline',event=>{ onlineUsersId.value.delete(event.userId)})

    }
    function initData(data:Conversation[]) {
        conversations.value = data;
        conversationIsLoading.value = true;
    }
    //加入聊天
    function joinChat(targetUserId: string,userId: string){
        yourId.value = userId;
        currentConservationKey.value = [targetUserId, userId].sort().join('_');
        // 判断是否已经加入过
        if(joinedConversation.value.has(currentConservationKey.value)){
            currentChatter.value = connectChatters.value.get(targetUserId) as ChatUser
            const currentConversation = conversations.value.find(conversation => conversation.userId ===targetUserId)
            if(currentConversation){
                currentConversation.unread =0
            }
            return;
        }
        socket.value?.emit('joinChat', { targetUserId ,userId});
    }
    function onJoinChat(data: any) {
        if(data.success){
            messagesMap.set(data.conversationId, data.history)
            currentChatter.value = data.targetUser;
            joinedConversation.value.add(data.conversationId)
            connectChatters.value.set(data.targetUser.id, data.targetUser)
        }
        else{
            ElMessage.error(data.error);
        }
    }
    //发送消息
    function sendMessage(content: string,receiverId: string,senderId: string) {
        socket.value?.emit('send_message', { content , receiverId, senderId });
    }
    function onNewMessage(data: any) {
        if(messagesMap.has(data.conversationKey)){
            messagesMap.get(data.conversationKey)?.push(data)
        }
        conversationIsLoading.value = false;
        socket.value?.emit('refreshConversations',{ userId: yourId.value } );
    }

    //判断聊天对象是否连接
    function isChatterOnline(userId: string) {
        return onlineUsersId.value.has(userId);
    }
    function disconnect() {
        socket.value?.disconnect();
        socket.value = null;
        onlineUsersId.value.clear();
        joinedConversation.value.clear();
        conversations.value = [];
        currentChatter.value = null;
        messagesMap.clear()
        isConnected.value = false;
        connectChatters.value = new Map()
        currentConservationKey.value = ''
    }

    return {
        conversationIsLoading,
        currentChatter,
        conversations,
        isConnected,
        joinChat,
        isChatterOnline,
        connect,
        sendMessage,
        disconnect,
        messagesMap,
        currentChatHistory,
    };
});