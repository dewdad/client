<template>
    <div class="page-main">
        <ecs-inst-detail-header :ecsInst='ecsInst'></ecs-inst-detail-header>       

        <div class="page-body">
            <el-row :gutter="20" class="mt10 mb20">
                <el-col :span="8" ><span class="font16">磁盘列表</span></el-col>
                <el-col :span="16">
                    <div class="operateDisk">
                        <el-button type="primary" size="mini">新建云盘</el-button>
                        <el-button type="info" size="mini" @click="instMountDisk">
                            <i class="iconfont icon-upload_people"></i>
                            挂载云盘
                        </el-button>
                    </div>
                    
                </el-col>
            </el-row>

            <clouddisk-table :isShowSearch="false"></clouddisk-table>
        </div> 

        <ecs-inst-mount-clouddisk ref="ecsInstMountClouddisk"></ecs-inst-mount-clouddisk>       
    </div>
</template>
<script src="./EcsInstDiskList.js">

</script>

<style scope lang="scss">
.operateDisk{
    float: right;
}
</style>