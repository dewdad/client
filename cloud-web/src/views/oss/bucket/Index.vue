<template>
    <div class="page-main oss" v-loading="loading">
        <page-header>
            <img src="@/assets/images/control/oss_icon.svg" height="50" alt="">
            <div slot="content">
                <div class="font18">{{get(headerInfo, 'bucket')}}</div>
             </div>
            <div slot="right" class="font12">
                <label v-if="permission === 'Read'" class=" mr10 color-danger"><span class="color-secondary">读写权限：</span> <el-popover  placement="top" title="" width="220" trigger="hover" content="尊敬的客户您好，公共读（public-read）权限可以不通过身份验证直接读取您 Bucket中的数据，安全风险高，为确保您的数据安全，不推荐此配置，建议您选择私有（private）。">
                                <i class="iconfont icon-wuuiconsuotanhao" slot="reference"></i>
                            </el-popover> 公共读 </label>
                <label v-else class="mr10 "><span class="color-secondary">读写权限：</span> 私有 </label>
                <label class="mr20 "><a class="font12" @click="dialogVisible = true">修改</a></label>
                <label class="mr20 "><span class="color-secondary">创建时间：</span>{{headerInfo.mtime|date('YYYY-MM-DD HH:mm')}}</label>
                <el-button v-if="!get(headerInfo, 'usage.rgwMain.num_objects')"  type="info" size="small"  @click="deleteBucket">
                    删除空间
                </el-button>
                <el-tooltip content="刷新" placement="left">
                    <el-button type="info" size="small" @click="reloadView">
                        <i class="iconfont icon-refresh_people"></i>
                    </el-button>
                </el-tooltip>
            </div>
        </page-header>
        <div class="page-body">
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="空间管理" name="overview"></el-tab-pane>
                <el-tab-pane label="文件管理" name="filemgr"></el-tab-pane>
                <el-tab-pane label="基础设置" name="basicset"></el-tab-pane>
                <el-tab-pane label="用户域名" name="domain"></el-tab-pane>
                <el-tab-pane label="数据监控" name="basicdata"></el-tab-pane>
            </el-tabs> -->
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
        <el-dialog title="读写权限" :visible.sync="dialogVisible" width="600px">
            <zt-form label-width="90px" :model="rwAuthForm">
                <zt-form-item label="读写权限" prop="privacy" :rules="[{required: true, message: '请选择读写权限'}]">
                    <el-radio-group v-model="rwAuthForm.privacy" class="primary" size="small">
                                <el-radio-button :label="true" border>私有</el-radio-button>
                                <el-radio-button :label="false" border>公共读</el-radio-button>
                            </el-radio-group>
                            <span v-if="!rwAuthForm.privacy" class="input-help color-danger">公共读：对文件写操作需要进行身份验证；可以对文件进行匿名读。</span>
                            <span  v-if="rwAuthForm.privacy" class="input-help">私有：对文件的所有访问操作需要进行身份验证。</span> 
                </zt-form-item>
               
            </zt-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="info" :disabled="updating" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" :loading="updating" @click="editPermission">确定</el-button>
            </span>
        </el-dialog>
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
import {getBucket, getBucketBasic, deleteBucket, setBucketPrivacy} from '@/service/oss';
import {sleep} from '@/utils/utils';
import {KEY_AUTH_CODE_FLAG} from '@/constants/const';

export default {
    name: 'Index',
    data() {
        return {
            loading: true,
            dialogVisible: false,
            updating: false,
            KEY_AUTH_CODE_FLAG,
            activeName: 'overview',
            // 当前显示的组件
            currentView: Filemgr,
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
            permission: '',
            // 当前桶ID
            bucketId: '',
            rwAuthForm: {
                privacy: ''
            }
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
        },
        dialogVisible: function () {
            this.rwAuthForm.privacy = this.permission === 'Read' ? false : true;
        }
    },
    async created() {
        this.init();
    },
    methods: {
        init() {
            this.bucketId = this.$route.params.bucketId;
            this.getBucketBasic();
            this.getBucket();
        },
        async getBucket() {
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
        getBucketBasic() {
            getBucketBasic(this.bucketId).then(res => {
                if (res.code === '0000') {
                    // this.baseInfo = res.data;
                    this.permission = res.data.grants[0].permission;
                }
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
            this.$messageBox
                .confirm('您确定要进行bucket删除操作吗？', '删除', {
                    subMessage: this.headerInfo.bucket,
                    alertMessage: '删除操作无法恢复，请谨慎操作',
                    type: 'warning'
                })
                .then(() => {
                    this.$refs.mobileCodeDialog
                        .show()
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
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
                        })
                        .catch(err => {
                            $log(err);
                        });
                });
        },
        editPermission() {
            this.updating = true;
            setBucketPrivacy(this.bucketId, this.rwAuthForm.privacy).then(res => {
                if (res.code === '0000') {
                    this.permission = this.rwAuthForm.privacy ? 'private' : 'Read';
                    this.dialogVisible = false;
                    this.$message.success('操作成功');
                }
            }).finally(() => {
                this.updating = false;
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
