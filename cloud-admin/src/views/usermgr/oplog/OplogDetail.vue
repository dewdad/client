<template>
    <el-dialog title="日志详情" :visible.sync="isShow" width="600px" class="CreateResource" v-dialogDrag>
        <div class="detailbox">
            <p>ID: {{item.id}}</p>
            <p> 操作名称: {{item.serviceDesc}}</p>
            <p>  操作结果: {{ item.result==0?'未知':(item.result==1?'成功':'失败') }}</p>
            <p>  操作人ID: {{item.operUserId}}</p>
            <p>  操作人: {{item.operUserName}}</p>
            <p> 操作时间: {{item.operStartTime | date}} -- {{item.operEndTime | date}}</p>
            <p>  部门ID: {{item.domainId}}</p>
            <p>  部门名称: {{item.domainName}}</p>
            <p>  租户ID: {{item.projectId}}</p>
            <p>  租户名称: {{item.projectName}}</p>
            <p>  地区: {{item.region}}</p>
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
