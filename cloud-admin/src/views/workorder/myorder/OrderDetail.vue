<template>
    <el-dialog title="工单详情" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <div class="detailbox">
            <p class="top">工单详情</p>
            <p>  工单号: {{item.orderNO }}</p>
            <p>  标题: {{item.orderTitle}}</p>
            <p>  描述: {{item.orderDesc}}</p>
            <p>  电话: {{item.mobile }}</p>
            <p>  邮箱: {{ item.email}}</p>
            <p>  附件: {{item.email}}</p>
            <hr>
            <p class="top mt20" >最新回复</p>
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
            console.log('item',item);
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
        .top{
            border-left: 3px solid #4895d7;
            height: 16px;
            font-size: 14px;
            color: #333333;
            padding-left: 10px;
            margin-bottom: 16px;
            line-height: 100%;
        }
        color:#666;
        p{
            margin-bottom:10px;
        }
    }
</style>
