import {setStore, getStore} from './utils';

class UserAction {
    constructor() {
        // 储存 key
        this.STORE = 'useraction';
        // 超时时间（毫秒）
        this.TIMEOUT = 2000;
        // 初始化
        this.update();
    }

    // 更新当前操作时间
    update() {
        setStore(this.STORE, this.now);
    }

    // 当前时间
    get now() {
        return new Date().getTime();
    }

    // 当前操作时间
    get timestamp() {
        return getStore(this.STORE);
    }

    // 是否超时
    get isTimeout() {
        return this.now - this.timestamp > this.TIMEOUT;
    }
}
export default new UserAction();
