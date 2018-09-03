import Vue from 'vue';
import msgboxVue from './index.vue';

const MessageBoxConstructor = Vue.extend(msgboxVue);
let instance;

const initInstance = () => {
    instance = new MessageBoxConstructor({
        el: document.createElement('div'),
        propsData: {name: 'dialogVisible'}
    });
};

const MessageBox = {
    show: showMessageBox
};

function showMessageBox() {
    return new Promise(resolve => {
        initInstance();
        document.body.appendChild(instance.$el);
        instance.$on('close', () => {
            resolve('close');
        });
    });
}
export default MessageBox;
export {MessageBox};
