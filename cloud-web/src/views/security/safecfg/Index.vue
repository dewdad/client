<template>
<div class="page-main safecfg-page">
    <!-- 搜素栏 -->
    <page-header class="mb20">安全配置</page-header>

    <pannel class="bm20">
        <div class="width-full" slot="header">
            Agent插件 <el-button class="pull-right pd0 font12 lh20" type="text">管理</el-button>
        </div>
        <div class="content font12">
            <div class="color-secondary mb10">业务优先级模式：<span class="color-default">{{mode1Count}} 台</span></div>
            <el-alert title="该模式会优先保证客户业务的高效运行，云安全进程的CPU占用峰值小于10%" :closable="false"></el-alert>
            <hr>
            <div class="color-secondary mb10">防护优先级模式：<span class="color-default">{{mode2Count}} 台</span></div>
            <el-alert title="该模式会优先保证客户业务的安全运行，云安全进程的CPU占用峰值小于20%" :closable="false"></el-alert>
        </div>
    </pannel>

    <pannel class="bm20">
        <div class="width-full" slot="header">
            定时自动检测时间段 <el-button class="pull-right pd0 font12 lh20" type="text">设置</el-button>
        </div>
        <div class="content font12">
            <div class="color-secondary mb10">检测时间段: <span class="color-default">未设置</span></div>
            <el-alert title="该模式会优先保证客户业务的高效运行，云安全进程的CPU占用峰值小于10%" :closable="false"></el-alert>
        </div>
    </pannel>
</div>
</template>

<script>
import Pannel from '@/components/pannel/index.vue';
import {safeConfigWebshellConfigList} from '@/service/security';
import {mapState, mapActions} from 'vuex';

export default {
    components: {
        Pannel
    },
    computed: {
        ...mapState('security', ['agentModelList']),
        mode1Count() {
            if (!this.agentModelList || !this.agentModelList.length) {
                return 0;
            }
            let item = this.agentModelList.filter(e => e.model === '1');
            return item ? item.length : 0;
        },
        mode2Count() {
            if (!this.agentModelList || !this.agentModelList.length) {
                return 0;
            }
            let item = this.agentModelList.filter(e => e.model === '2');
            return item ? item.length : 0;
        }
    },
    methods: {
        ...mapActions('security', ['fetchAgentModelList']),
        async safeConfigWebshellConfigList() {
            try {
                let ret = await safeConfigWebshellConfigList();
                $log('safeConfigWebshellConfigList <-', ret);
            } catch (error) {
                console.warn('safeConfigWebshellConfigList', error.message);
            }
        }
    },
    async created() {
        this.fetchAgentModelList();
        this.safeConfigWebshellConfigList();
    }
};
</script>

<style lang="scss">
.safecfg-page {
    .content {
        box-sizing: border-box;
        padding: 20px 10px;
    }
}
</style>
