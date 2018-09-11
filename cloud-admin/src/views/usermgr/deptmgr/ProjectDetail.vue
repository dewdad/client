<template>
    <el-dialog title="租户详情" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <div class="detailbox">
            <p> 租户名称: {{item.name}}</p>
            <p> 租户ID: {{item.id}}</p>
            <p>  激活: {{ item.status==1?'是':'否' }}</p>
            <p>  描述: {{item.description}}</p>
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
        color:#666;
        p{
            margin-bottom:10px;
        }
    }
</style>
