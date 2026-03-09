import {Socket} from "socket.io";
export interface JwtPayload {
    userId: string;      // 用户ID
    phone: string;
    role: string;
}
// 扩展 Socket 类型，添加用户信息
export interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        username: string;
    };
    rooms: Set<string>;
}