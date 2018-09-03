<template>
    <div class="email-dropdown" v-if="isShow">
        <ul>
            <li class="email-dropdown__item">请选择邮箱类型</li>
            <li v-for="(e, index) in emails" :key="index" :class="{'email-dropdown__item': true, 'is-active': focusIndex === index ? true : false}" @keyup.enter="liClick(e)" @click="liClick(e)"  >{{prefix[0]}}@{{e}}</li>
        </ul>
    </div>
</template>
<script>
import {DICT_USER} from '@/constants/dicts/user';
import {EMAIL_REGEXP} from '@/constants/regexp.js';
import {getDom} from '@/utils/utils';
const keydown = function(e) {
    e = e || window.event;
    $log(e.keyCode);
    switch (e.keyCode) {
        case 38 /*设置焦点代码  上*/:
            this.focusIndex--;
            break;
        case 40 /*设置焦点代码  下*/:
            this.focusIndex++;
            break;
        case 13 /*回车选中*/:
            if(this.focusIndex >= 0) {
                if (this.emails[this.focusIndex] !== undefined) {
                    this.$emit('input', this.prefix[0] + '@' + this.emails[this.focusIndex]);
                    this.destroy();
                }
            }
            break;
    }
    if (this.focusIndex <= -1) this.focusIndex = this.emails.length - 1;
    if (this.focusIndex > this.emails.length - 1) this.focusIndex = 0;
};
export default {
    name: 'EmailSelect',
    data() {
        return {
            DICT_USER,
            EMAIL_REGEXP,
            focusIndex: -1,
            keydown: null,
        };
    },
    props: {
        value: String
    },
    computed: {
        prefix: function() {
            let string = this.value ? this.value.split('@') : '';
            return string;
        },
        emails: function() {
            return this.DICT_USER.EMAIL_LIST.filter(item => {
                return item.includes(this.prefix[1]);
            });
        },
        isShow: function() {
            // 判断输入的邮箱后缀是否在可选邮箱列表中
            let sufix = this.emails.find(val => {
                return val === this.prefix[1];
            });
            return sufix === undefined && this.emails.length > 0;
        }
    },
    watch: {
        isShow: function(newval) {
            if (newval) {
                document.addEventListener('keydown', this.keydown);
            } else {
                this.destroy();
            }
        },
        focusIndex: function() {
            this.$nextTick(() => {
                if (!this.isShow) return;
                let obj = getDom.getClass('is-active')[0];
                let dropdown = getDom.getClass('email-dropdown')[0];
                // 判断是否有平剧条
                if (dropdown.scrollHeight <= dropdown.clientHeight) return;
                let top = 0;
                if (obj) {
                    top = obj.offsetTop;
                }
                let keyCode = window.event.keyCode; // 获取键盘事件
                let lineHeight = 30; // 行的高度
                let margin = lineHeight; // 滚动间距 30为行的高度
                if (keyCode === 38) { 
                    margin = -lineHeight;// 向上时 滚动间距
                }
                if (top > dropdown.clientHeight - lineHeight) { // 当前元素距顶部距离大于可见高度时，设置滚动条位置
                    dropdown.scrollTop = dropdown.scrollTop + margin;
                } else {
                    dropdown.scrollTop = 0;
                }
                // 如果最当前元素是最后一个 将滚动条滚动到最底部
                if (top === dropdown.scrollHeight - lineHeight) {
                    dropdown.scrollTop = top;
                }
            });
        }
    },
    destroyed() {
        this.destroy();
    },
    methods: {
        // 回调事件
        liClick(e) {
            this.$emit('input', this.prefix[0] + '@' + e);
        },
        destroy() {
            document.removeEventListener('keydown', this.keydown);
        }
    },
    created() {
        this.keydown = () => keydown.call(this);
        document.addEventListener('keydown', this.keydown);
    }
};
</script>
<style scoped lang="scss">
.email-dropdown {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 100%;
    background: #fff;
    z-index: 2;
    max-height: 350px;
    overflow-y: auto;
    border: 1px solid #c3c5c6;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-top-color: transparent;
    .email-dropdown__item {
        color: #333;
        font-weight: 500;
        line-height: 20px;
        text-align: left;
        padding: 5px 10px;
        margin: 0px !important;
        &:not(:first-child) {
            cursor: pointer;
            &:focus,
            &:hover,&.is-active {
                background: #f7f7f7;
            }
        }
    }
    // &::-webkit-scrollbar {
    //     width: 5px;
    // }

    // &::-webkit-scrollbar-track {
    //     background-color: #fff;
    // }

    // &::-webkit-scrollbar-thumb {
    //     background-color: #e5e5e5;
    // }

    // &::-webkit-scrollbar-thumb:hover {
    //     background-color: #e5e5e5;
    // }

    // &::-webkit-scrollbar-thumb:active {
    //     background-color: #e5e5e5;
    // }
}
</style>
