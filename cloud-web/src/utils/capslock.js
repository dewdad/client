/*
 * @Author: wenfang 
 * @Date: 2018-08-02 10:51:31 
 * @Last Modified by: wenfang
 * @Last Modified time: 2018-08-02 20:53:21
 * 密码框大写键盘监听
 */

import {on, off} from './utils';
function checkCapsLock(el, binding, vnode) {
    return function(e) {
        e = e || window.event;
        let valueCapsLock = e.keyCode ? e.keyCode : e.which; // 按键
        let valueShift = e.shiftKey ? e.shiftKey : valueCapsLock == 16 ? true : false; // shift键是否按住
        if (
            (valueCapsLock >= 65 && valueCapsLock <= 90 && !valueShift) || // 输入了大写字母，并且shift键没有按住，说明Caps Lock打开
            (valueCapsLock >= 97 && valueCapsLock <= 122 && valueShift)
        ) {
            // 输入了小写字母，并且按住 shift键，说明Caps Lock打开
            el['cxt'].style.display = '';
        } else {
            if (valueCapsLock === 20) {
                // capslock键
                el['cxt'].style.display = el['cxt'].style.display === 'none' ? '' : 'none';
                return;
            }
            el['cxt'].style.display = 'none';
        }
    };
}
function inputBlur(el) {
    return function() {
        el['cxt'].style.display = 'none';
    };
}
export default {
    bind(el, binding, vnode) {
        el.style.position = 'relative';
        // 创建一个DIV节点
        let div = document.createElement('div');
        // 默认隐藏DIV节点
        div.style.display = 'none';
        // 获取input框对象
        let input = el.querySelector('input');
        el['cxt'] = div;
        el['inputPwd'] = input;
        let html = `<div
        role="tooltip" 
        aria-hidden="true" 
        class="el-tooltip__popper is-dark" 
        style="position:absolute; left: -104px; top: 2px; transform-origin: right center 0px; z-index: 2001; " x-placement="left">
        您已开启大写键盘
        <div x-arrow="" class="popper__arrow" style="top: 11px;"></div>
        </div>`;
        div.innerHTML = html;
        el.append(div);
        on(el, 'keypress', checkCapsLock(el, binding, vnode));
        // 因keypress事件无法扑捉到大写键 因此还需添加keydown监听事件
        on(el, 'keydown', checkCapsLock(el, binding, vnode));
        // 给input对象添加 onblur事件
        on(el['inputPwd'], 'blur', inputBlur(el));
    },

    update(el, binding, vnode) {},

    unbind(el, binding, vnode) {
        // 解绑所有监听事件
        off(el, 'keypress', checkCapsLock(el, binding, vnode));
        off(el, 'keydown', checkCapsLock(el, binding, vnode));
        off(el['inputPwd'], 'keypress', checkCapsLock(el, binding, vnode));
    }
};
