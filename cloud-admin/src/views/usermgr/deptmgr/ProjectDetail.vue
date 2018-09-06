<template>
    <el-dialog title="租户详情" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <div class="detailbox">
            <p> 租户名称: {{item.id}}</p>
            <p> 租户ID: {{item.serviceDesc}}</p>
            <p>  激活: {{ item.result==0?'未知':(item.result==1?'成功':'失败') }}</p>
            <p>  描述: {{item.operUserId}}</p>
        </div>
    </el-dialog>
</template>
<script>

export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            item:[]
        };
    },
    props: {},
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },

    }
};
</script>
<style lang="scss">
    .detailbox{
        color:#666;
        p{
            margin-bottom:10px;
        }
    }
</style>
