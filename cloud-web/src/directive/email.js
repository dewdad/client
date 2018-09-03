// import { on, off } from './utils';
import EmailSelect from '@/components/form/EmailSelect';
import Vue from 'vue';

let Box = Vue.extend(EmailSelect);

let instance;
let inputComponentInstance;
function created (el) {
    instance = new Box();
    instance.vm = instance.$mount();
    el.appendChild(instance.vm.$el);
}
function hide () {
    let hasEl = instance.vm.$el && instance.vm.$el.style;
    if (hasEl) {
        setTimeout(() => {
            if (hasEl) {
                instance.vm.$el.style.display = 'none';
            }
        }, 500);
    }
}
function show () {
    if (instance.vm.$el && instance.vm.$el.style) {
        instance.vm.$el.style.display = 'block';
    }
}
export default {
    bind (el, binding, vnode) {
        created(el);
        inputComponentInstance = vnode.componentInstance;
        inputComponentInstance.$on('blur', (event) => {
            hide();
        });
        inputComponentInstance.$on('focus', (event) => {
            show();
        });
        inputComponentInstance.$on('input', (val) => {
            instance.vm.value = val;
            show();
        });
        instance.vm.$on('input', (val) => {
            inputComponentInstance.$emit('input', val);
            setTimeout(() => {
                inputComponentInstance.$emit('blur', val);
            }, 0);
        });

        window.instance = instance;
        window.vnode = vnode;
        console.log('instance', instance);
        console.log('el', vnode);
    },

    update (el, binding, vnode) { },

    unbind (el, binding, vnode) {
    }
};
