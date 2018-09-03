<template>
<div class="page-body">
    <el-tabs v-model="currentView" @tab-click="handleClick">
        <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <el-row>
        <el-col :span="24">
            <transition name="fade-in-linear">
                <component v-bind:is="currentView"></component>
            </transition>
        </el-col>
    </el-row>

</div>
</template>

<script>
import Account from './Account';
import Port from './Port';
import Process from './Process';
import Webframe from './WebFrame';
// 查询方法： process 进程管理 port 端口清点 account 账号管理 web web框架清点

export default {
    components: {
        Account,
        Port,
        Process,
        Webframe
    },
    watch: {
        $route: {
            // 立即触发，无需再 created 里面再调用一次
            immediate: true,
            handler: function() {
                this.init();
            }
        }
    },
    data() {
        return {
            // 页签 (name与组建名一致)
            tabs: [
                {label: '进程管理', name: 'process'},
                {label: '端口清点', name: 'port'},
                {label: '账号管理', name: 'account'},
                {label: 'web框架清点', name: 'Webframe'}
            ],
            // 当前显示的页签
            currentView: 'process'
        };
    },
    methods: {
        // 根据路由设置当前页签
        init() {
            let view = this.$route.params.view;
            if (view) {
                this.currentView = view;
            }
        },
        // 切换页签
        handleClick(tab) {
            this.$router.push({
                name: 'app.security.assetslist.hostinfo',
                params: {
                    view: tab.name
                }
            });
        }
    }
};
</script>

<style>
</style>
