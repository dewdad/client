<template>
    <div class="page-main">
        <page-header>
            磁盘列表
            <div slot="right">
                <el-button type="primary" size="small" @click="$router.push({name: 'app.ecs.clouddisc.createDisc'})">创建云盘</el-button>
                <el-button type="info" size="small" @click="refresh">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>

        <div class="page-body">
            <clouddisk-table ref="cloudDisk" :isShowSearch="true"></clouddisk-table>
        </div>
    </div>
</template>
<script src="./clouddiscList.js">
</script>

<style scope lang="scss">
</style>
