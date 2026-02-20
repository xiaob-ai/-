//手机号校验函数
function validatePhone(rule: any,value:any,callback: any){
    if(!rule){
        return
    }
    if(!value){
        callback(new Error('手机号不能为空'))
    }
    // 正则校验
    if(!/^1[3456789]\d{9}$/.test(value)){
        callback(new Error('手机号格式不正确'))
    }
    callback()
}

//密码校验函数（不得小于6位）
function validatePassword(rule: any,value:any,callback: any){
    if(!rule)return
    if(!value){
        callback(new Error('密码不能为空'))
    }
    if(value.length<6){
        callback(new Error('密码不得小于6位'))
    }
    callback()
}

function validateUsername(rule: any,value:any,callback:any){
    if(!rule)return
    if(!value){
        callback(new Error("用户名不能为空！"))
    }
    callback()
}
export {
    validatePhone,
    validatePassword,
    validateUsername
}

//节流
export function throttle(fn: any, delay: number) {
    let timer: any = null;
    return function () {
        if (timer) return;
        timer = setTimeout(() => {
            fn();
            timer = null;
        }, delay);
    };
}
export async function importStore() {
    const {useUserStore} = await import('../stores/user')
    const {useAppStore} =await  import('../stores/app')
    const userStore = useUserStore()
    const appStore = useAppStore()
    return {userStore,appStore}
}

export function debounce(fn: Function , delay:number, immediate:boolean = false) {
    let timer:any = null;
    const debounced = function (...args:any[]) {
        const callNow = immediate && !timer;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (!immediate) fn.apply(this, args);
        }, delay);
        if (callNow) fn.apply(this, args);
    };
    debounced.cancel = () => {
        timer && clearTimeout(timer);
        timer = null;
    };
    return debounced;
}