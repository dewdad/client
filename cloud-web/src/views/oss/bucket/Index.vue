<template>
    <div class="page-main oss" v-loading="loading">
        <page-header>
            <img src="@/assets/images/control/oss_icon.svg" height="50" alt="">
            <div slot="content">
                <div class="font16">{{get(headerInfo, 'bucket')}}</div>
                <div class="font12 mt10">
                    <label class="mr20">
                        <span class="color-secondary">类型：</span> 标准存储 </label>
                    
                    <label>
                        <span class="color-secondary">创建时间：</span>{{headerInfo.mtime|date('YYYY-MM-DD HH:mm:ss')}}</label>
                </div>
            </div>
            <div slot="right">
                <el-button type="info" size="small" icon="el-icon-delete" @click="deleteBucket">
                    删除
                </el-button>
                <el-tooltip content="刷新" placement="left">
                    <el-button type="info" size="small" @click="reloadView">
                        <i class="iconfont icon-refresh_people"></i>
                    </el-button>
                </el-tooltip>
            </div>
        </page-header>
        <div class="page-body">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="空间管理" name="overview"></el-tab-pane>
                <el-tab-pane label="文件管理" name="filemgr"></el-tab-pane>
                <el-tab-pane label="基础设置" name="basicset"></el-tab-pane>
                <!-- <el-tab-pane label="用户域名" name="domain"></el-tab-pane>
                <el-tab-pane label="数据监控" name="basicdata"></el-tab-pane> -->
            </el-tabs>
            <el-row>
                <el-col :span="24">
                    <transition name="fade-in-linear">
                        <!-- 当 `currentView` 改变时，组件也跟着改变 -->
                        <div v-if="showCustomeComp" style="min-height: 200px;">
                            <component v-bind:is="currentView" :bucketId="bucketId" :headerInfo="headerInfo"></component>
                        </div>
                        <!-- <router-view /> -->
                    </transition>
                </el-col>
            </el-row>

        </div>
        <mobile-code-dialog ref="mobileCodeDialog" :code-type="KEY_AUTH_CODE_FLAG"></mobile-code-dialog>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';
import Overview from './Overview.vue';
import Filemgr from './Filemgr.vue';
import Basicset from './Basicset.vue';
import Domain from './Domain.vue';
import Basicdata from './Basicdata.vue';
import {getBucket, deleteBucket} from '@/service/oss';
import {sleep} from '@/utils/utils';
import {KEY_AUTH_CODE_FLAG} from '@/constants/const';

export default {
    name: 'Index',
    data() {
        return {
            loading: true,
            KEY_AUTH_CODE_FLAG,
            activeName: 'overview',
            // 当前显示的组件
            currentView: Overview,
            // is组件是否显示
            showCustomeComp: true,
            // 每个tab对应的组件
            component: {
                overview: Overview,
                filemgr: Filemgr,
                basicset: Basicset,
                domain: Domain,
                basicdata: Basicdata
            },
            // 头部信息
            headerInfo: {},
            // 当前桶ID
            bucketId: ''
        };
    },
    components: {
        PageHeader,
        Overview,
        Filemgr,
        MobileCodeDialog
    },
    watch: {
        // 监听路由参数变化 view参数变化时动态显示不同的组件
        $route: function() {
            this.init();
            this.getBucket();
        }
    },
    async created() {
        await this.getBucket();
        this.init();
    },
    methods: {
        // 加根据参数加载组件
        init() {
            try {
                let view = this.$route.params.view;
                view = view.toLowerCase();
                if (view) {
                    this.activeName = view;
                    this.currentView = this.component[view];
                }
            } catch (error) {
                this.$message({
                    message: '参数错误',
                    type: 'error'
                });
            }
        },
        // tab点击事件
        handleClick(tab, event) {
            // this.currentView = tab.name
            this.$router.push({name: 'app.oss.bucket', params: {view: tab.name}});
        },
        async getBucket() {
            this.bucketId = this.$route.params.bucketId;
            this.loading = true;
            return getBucket(this.bucketId)
                .then(res => {
                    this.loading = false;
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.headerInfo = res.data;
                        console.log('headerInfo', this.headerInfo);
                    } else {
                        this.$alert('您查询的空间不存在', {
                            title: '提示',
                            type: 'error'
                        }).then(() => {
                            this.$store.commit('SET_PAGE_LOAD_ERROR', '您查询的空间不存在');
                        });
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        // 刷新组件
        reloadView() {
            this.showCustomeComp = false;
            // 延迟1秒重载组件
            sleep(1).then(() => {
                this.showCustomeComp = true;
            });
        },
        // 删除bucket
        deleteBucket() {
            this.$messageBox.confirm('您确定要进行bucket删除操作吗？', '删除', {
                subMessage: this.headerInfo.bucket,
                alertMessage: '删除操作无法恢复，请谨慎操作',
                type: 'warning'
            }).then(() => {
                alert();
                this.$refs.mobileCodeDialog.show().then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        alert();
                        deleteBucket(this.bucketId).then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                // 通知bucket列表刷新
                                this.$store.commit('oss/CHANGE_REFRESH_BUCKET');
                                this.$router.push({name: 'app.oss.overview'});
                            }
                        });
                    }
                }).catch(err => {
                    $log(err);
                });
            });
        }
    }
};
</script>
<style scoped>
label {
    font-weight: normal;
}
</style>
