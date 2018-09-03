<template>
    <div class="copy">
        <!-- <div class="copy__success" :class="[{'active' : copySucc}, position]" v-if="copySucc"><i v-if="position !== 'right'" class="iconfont font14 icon-fuzhichenggong color-success" ></i> 复制成功</div> -->
        <i class="iconfont icon-fuzhi font14 finger-cursor" :title="$t('common.Clippings')" :class="{'color-secondary': copyStyle}" @mousedown="mousedownFn" @mouseup="mouseupFn" v-clipboard:copy="bindText" @success="copySuccess"></i>
    </div>
</template>
<script>
import {throttle} from 'lodash';
import {Message} from 'element-ui';
function $message(str) {
    Message({
        message: str,
        type: 'success',
        showClose: true,
        // customClass: 'copyMess'
    });
}
const throttled_message = throttle($message, 2000, {
    leading: true,
    trailing: false,
});
export default {
    data() {
        return {
            copyStyle: true,
            copySucc: false
        };
    },
    methods: {
        mousedownFn(e) {
            console.warn(e);
            if (e.which === 3) {
                return;
            }
            this.copyStyle = false;
            this.copySucc = true;
            setTimeout(() => {
                this.copySucc = false;
            }, 400);
        },
        mouseupFn(e) {
            if (e.which === 3) {
                return; 
            }
            this.copyStyle = true;
        },
        copySuccess() {
            throttled_message('已成功复制到剪贴板');
        }
    },
    props: {
        bindText: {
            type: String,
            default: ''
        },
        position: {
            default: 'top'
        }
    }
};
</script>
<style lang="scss">
    .copy{
        display: inline-block;
        position: relative;
        &__success{
            position: absolute;
            width: 72px;
            color: #009900;
            top: -12px;
            opacity: 0;
        }
        .active{
            transition: all .4s;
            top: -20px;
            opacity: 1;

            &.right{
                top: 0;
                right: -77px;
            }
        }
    }
    .copyMess{
        background-color: #f2ffea;
        border-color: #76b86e;
        border-radius: 0;
        min-width: 200px !important;
        padding: 10px 15px 10px 20px;
        .el-message__content{
            font-size: 12px;
        }
        .el-message__icon{
            display: none;
        }
    }
    
</style>

