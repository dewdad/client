<template>
    <div>
        <el-row>
            <el-col :span="24">
                <!-- 基础数据 -->
                <base-data :show-file-nums="true" ref="baseData" :headerInfo="headerInfo"></base-data>
            </el-col>
            <el-col :span="24">
                <!-- 访问域名 -->
                <div class="oss-box">
                    <div class="oss-box-header">{{$t('oss.overview.accessDomain')}}</div>
                    <div class="oss-box-content">
                        <el-table :data="domainList" style="width: 100%" stripe header-row-class-name="no-line" border class="data-list">
                            <el-table-column prop="reqName" label="" width="300">
                                <template slot-scope="scope">
                                    <span class="mr10">{{ scope.row.reqName }}</span>
                                    <el-tooltip :content="$t('oss.overview.networkAccessTips')" transition="scale-in" placement="top" effect="light">
                                        <span style="display:inline-block;width:12px;">
                                            <i class="iconfont icon-wenhao font14 color-primary"></i>
                                        </span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ossDomain" :label="$t('oss.overview.accessDomain')" :render-header="renderHeader">
                            </el-table-column>
                            <el-table-column prop="httts" label="HTTPS" width="100">
                                <template slot-scope="scope">
                                    <mark class="greenbg">支持</mark>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
            <el-col :span="24">
                <!-- 基础设置 -->
                <div class="oss-box mt20">
                    <div class="oss-box-header">{{$t('oss.overview.baseSetting')}}</div>
                    <div class="oss-box-content">
                        <div class="settings">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <span class="name col-xs-4">读写限制</span>
                                    <span class="status col-xs-4 color-secondary">{{ headerInfo.isPrivate ? '私有' : '公开' }}</span>
                                    <span class=" col-xs-4 text-right">
                                        <el-button type="info" size="mini">设置</el-button>
                                    </span>
                                </el-col>
                                <el-col :span="8">
                                    <span class="name col-xs-4">防盗链</span>
                                    <span class="status col-xs-4 color-secondary">{{ settings.spams.pattern === '' ? '未开启':'已开启'}}</span>
                                    <span class=" col-xs-4 text-right">
                                        <el-button type="info" size="mini">设置</el-button>
                                    </span>
                                </el-col>
                                <el-col :span="8">
                                    <span class="name col-xs-4">镜像回源</span>
                                    <span class="status col-xs-4 color-secondary">{{ settings.mirror.source === '' ? '未开启':'已开启'}}</span>
                                    <span class=" col-xs-4 text-right">
                                        <el-button type="info" size="mini">设置</el-button>
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <span class="name col-xs-4">静态页面</span>
                                    <span class="status col-xs-4 color-secondary">{{ settings.pageIndex ? '已开启':'未开启'}}</span>
                                    <span class=" col-xs-4 text-right">
                                        <el-button type="info" size="mini">设置</el-button>
                                    </span>
                                </el-col>
                                <el-col :span="8">
                                    <span class="name col-xs-4">跨域设置</span>
                                    <span class="status col-xs-4 color-secondary">即将上线</span>
                                </el-col>
                                <el-col :span="8">
                                    <span class="name col-xs-4">日志管理</span>
                                    <span class="status col-xs-4 color-secondary">即将上线</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import BaseData from '../BaseData.vue';
import {getBucketDomainList,getBucketBasic} from '@/service/oss/index';
export default {
    name: 'Overview',
    data() {
        return {
            domainList: [],
            settings: {
                spams: {
                    pattern: ''
                },
                mirror: {
                    source: ''
                },
                pageIndex: false
            }
        };
    },
    props: {
        headerInfo: {
            type: Object,
            default: function () {
                return {
                    name: '',
                    isPrivate: false,
                    createTime: '',
                    usedCap: '',
                    transferIn: '',
                    hitPut: 0,
                    hitGet: 0,
                    objNum: 0
                };
            }
        }
    },
    components: {
        BaseData
    },
    watch: {
        // 路由参数变化时 重新加载数据
        $route: function() {
            this.init();
        }
    },
    created() {
        console.log('headerInfo', this.headerInfo);
        this.init();
    },
    methods: {
        // 加载数据
        init() {
            let bucketId = this.$route.params.bucketId;
            this.getBucketDomainList(bucketId);
            this.getBucketBasic(bucketId);
        },
        renderHeader(h, {column, $index}) {
            /* eslint-disable */
            return (
                <span>
                    访问域名
                    <el-popover transition="scale-in" placement="top" trigger="hover" width="300">
                        <i slot="reference" class="iconfont icon-wenhao font14 color-primary" />
                        {this.$t('oss.overview.accessDomainTips')}
                    </el-popover>
                </span>
            );
        },
        // 查询空间域名列表
        getBucketDomainList(bucketId) {
            getBucketDomainList(bucketId).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.domainList = res.result;
                }
            });
        },
        // 查询基础设置信息
        getBucketBasic(bucketId) {
            getBucketBasic(bucketId).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.settings = {...res.result};
                }
            });
        },
    }
};
</script>
<style scoped lang="scss">
.settings {
    padding: 20px 10px;
    font-size: 12px;
    line-height: 45px;
    .el-col {
        &:hover {
            background: #f1f6f9;
        }
    }
}
</style>
