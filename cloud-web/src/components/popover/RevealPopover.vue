<template>
    <el-popover transition="scale-in" placement="top" trigger="hover">
        <div class="nameTip">
            <div>设备名 :
                <span class="font12">{{scopeRow.mount||"-"}}</span>
            </div>
            <div>实例名称/ID :
                <router-link v-if="!!scopeRow.instanceId" class="font12 color-primary" :to="{name:'app.ecs.inst.detail',params:{id:scopeRow.instanceId}}">{{scopeRow.instanceId}}
                </router-link>
                <span>/</span>
                <span class="color-primary">{{scopeRow.instanceName||'-'}}</span>
            </div>
            <div>实例状态 :
                <span class="font12 color-success"><i class="iconfont icon-running_people mr5"></i>{{scopeRow.instanceStatus}}</span>
            </div>
            <div>创建时间 :
                <span class="font12">{{scopeRow.created_at|date}}</span>
            </div>
        </div>
        <i slot="reference" class="iconfont icon-notice_people font12"></i>
    </el-popover>
</template>
<script>
export default {
    props:{
        scopeRow:{
            type: Object
        }
    },
    mounted() {
        console.log(this.scopeRow);
    }
};
</script>
<style lang="scss" scoped>
.nameTip {
    padding: 5px;
}
</style>

