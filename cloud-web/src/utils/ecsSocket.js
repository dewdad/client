import store from '@/store';
var t;

class EcsSocket {
    constructor() {
        this.url = ECS_WS_URL;
        this.init();
    }

    init() {
        if (this.isClose) return;
        console.log('连接', this.url);
        let socket = null;
        socket = new WebSocket(this.url);
        socket.onopen = this.onopen.bind(this);
        socket.onmessage = this.onmessage.bind(this);
        socket.onclose = this.onclose.bind(this);
        socket.onerror = this.onerror.bind(this);
        this.socket = socket;
    }

    //重连
    reconnection() {
        if (this.isClose) return;
        //与服务器已经建立连接
        if (this.socket && this.socket.readyState == 1) {
            t = clearTimeout(t);
        } else {
            //已经关闭了与服务器的连接
            if (this.socket.readyState == 3) {
                this.init();
            }
            //0正尝试与服务器建立连接,2正在关闭与服务器的连接
            t = setTimeout(() => {
                this.reconnection();
            }, 10000);
        }
    }

    onopen() {
        console.log('onopen()');
        if (this.list) {
            this.send();
        }
    }

    onclose() {
        console.log('onclose()');
    }

    onmessage(e) {
        console.log('onmessage()');
        let self = this;
        if (e.data === '') return;
        let data = JSON.parse(e.data);
        data.forEach(response => {
            typeof self.onchangeFn === 'function' && self.onchangeFn(response);
        });
        console.log('说：' + e.data);
    }

    onerror() {
        console.log('error...');
        this.reconnection();
    }

    disconnect() {
        this.isClose = true;
        if (this.socket) {
            this.socket.close();
        }
        t = clearTimeout(t);
    }

    send() {
        if (this.list && this.list.length && !this.hasend) {
            var obj = {
                'ecsId': this.list,
                'token': store.state.token
            };
            if (this.socket && this.socket.readyState == this.socket.OPEN) {
                this.socket.send(JSON.stringify(obj));
                // 只发送一次
                this.hasend = true;
            }
        }
    }

    setESC(arr) {
        let val = arr && arr.join(',');
        let old = this.list && this.list.join(',');
        if (val === old) return;
        this.list = arr;
        this.send();
    }

    onchange(callback) {
        if (typeof callback === 'function') {
            this.onchangeFn = callback;
        }
    }

}
export default EcsSocket;
