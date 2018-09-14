<template>
    <div class="page-header">
        <div class="page-header__title">
            <img src="@/assets/images/ecs/disk_icon.svg" width="50" alt="" class="ecs-detail-img">
        </div>
        <div class="page-header__content">
            <div class="font16"> {{ diskName || "-"}}</div>            
        </div>
        <div class="page-header__buttons">
            <div class="right">
                <el-button type="primary" @click="createSnap" size="small">
                    创建快照
                </el-button>
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh" @click="refresh"></i>
                </el-button>
            </div>            
        </div>

        <!-- 对话框 创建快照 -->
        <create-snap-dialog ref="CreateSnapDialog"/>
        <!-- 对话框 设置自动快照策略 -->
        <set-auto-snap-dialog ref="SetAutoSnapDialog"/>  

    </div>
</template>

<script>
import CreateSnapDialog from './../../inst/ecsDialog/CreateSnapDialog';
import SetAutoSnapDialog from './../../inst/ecsDialog/SetAutoSnapDialog';

export default {
    name: 'EcsDiskDetailHeader',
    components: {
        CreateSnapDialog,
        SetAutoSnapDialog,     
    },
    props: ['rowItem'], 
    created(){        
    },
    methods: {       
        /**
         * 创建快照
         */
        createSnap:function () {          
            this.$refs.CreateSnapDialog
                .show(this.rowItem)
                .then(ret => {
                    console.log('操作成功', ret);
                    return this.$message.success('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });           
        },
        /**
         * 设置自动快照策略
         */
        setAutoSnap:function () {           
            this.$refs.SetAutoSnapDialog
                .show(this.rowItem)
                .then(ret => {
                    console.log('操作成功', ret);
                    return this.$message.success('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });           
        },  
        
        //刷新
        refresh: function() {            
            this.$emit('refresh');
        }
    },
    computed: {
        diskName() {
            let name = this.rowItem.image_id ? '-系统盘' : '-数据盘';
            name = this.rowItem.attachments && this.rowItem.attachments.length > 0 && this.rowItem.attachments[0].hostname + name;
            return this.rowItem.name || name;
        } 
    }    
};
</script>
 
<style scoped lang="scss">
 .ecs-detail-img {
    height: 50px;
    background-repeat: no-repeat;
    background-position: left;
}
</style>
 