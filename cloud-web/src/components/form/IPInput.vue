<template>
    <div class="ip-input">
        <el-input ref="ipt1" @focus="focus(1)" @input="change" :value="ipt1" :maxlength="3"></el-input><span class="separator bold">·</span>
        <el-input ref="ipt2" @focus="focus(2)" @input="change" :value="ipt2" :maxlength="3"></el-input><span class="separator bold">·</span>
        <el-input ref="ipt3" @focus="focus(3)" @input="change" :value="ipt3" :maxlength="3"></el-input><span class="separator bold">·</span>
        <el-input ref="ipt4" @focus="focus(4)" @input="change" :value="ipt4" :maxlength="3"></el-input><span class="separator">/</span>
        <el-input ref="ipt5" @focus="focus(5)" @input="input" :value="ipt5" :maxlength="4"></el-input>
    </div>
</template>

<script>
export default {
    props: {
        value: String
    },
    data() {
        return {
            index: 0,
            ipt1: '',
            ipt2: '',
            ipt3: '',
            ipt4: '',
            ipt5: ''
        };
    },
    methods: {
        format(event) {
            // 格式化参数
            let e = event || e;
            if (!e.target) return;
            let val = parseInt(e.target.value);
            // NaN 直接置空
            if (Number.isNaN(val)) {
                setTimeout(() => {
                    e.target.value = '';
                }, 0);
            } else {
                setTimeout(() => {
                    e.target.value = val;
                }, 0);
            }
        },
        input() {
            this.format(event);
            this.emit();
        },
        emit() {
            // 触发v-model修改
            let arr = [];
            for (let index = 0; index < 5; index++) {
                const e = this.$refs[`ipt${index + 1}`].$el.querySelector('input');
                arr[index] = e.value;
            }
            // 贪婪匹配最后一个点号为斜杆
            let str = arr.join('.').replace(/(.*)\./, '$1/');
            // 修改v-model
            this.$emit('input', str);
        },
        next() {
            this.$refs[`ipt${this.index + 1}`].focus();
        },
        focus(index) {
            // 保存当前输入框索引。
            this.index = index;
        },
        change(val) {
            this.input(event);
            if (!val) return;
            // 长度为3跳到下一个
            if (val.length === 3) {
                this.next();
            }
        }
    },
    created() {
        if (this.value) {
            let valArr = this.value.split('.').map(e => e.split('/'));
            this.ipt1 = valArr[0];
            this.ipt2 = valArr[1];
            this.ipt3 = valArr[2];
            this.ipt4 = valArr[3][0];
            this.ipt5 = valArr[3][1];
        }
    }
};
</script>

<style lang="scss">
.ip-input {
    display: inline-flex;

    .separator {
        padding: 0 6px;
        font-size: 18px;
        line-height: 32px;

        &.bold {
            font-weight: 700;
        }
    }
}
</style>
