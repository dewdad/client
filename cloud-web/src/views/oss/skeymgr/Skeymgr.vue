<template>
    <div class="page-main">
        <page-header>
            秘钥管理
            <template slot="right">
                <el-button v-if="tableDataList.length <= 1" type="primary" size="small" @click="createKeyDialog=true">创建秘钥</el-button>
                <el-tooltip v-if="tableDataList.length > 1" content="一个用户最多创建两个秘钥" transition="scale" placement="bottom" effect="light">
                    <span class="mr10">
                        <el-button type="primary" size="small" :disabled="true">创建秘钥</el-button>
                    </span>
                </el-tooltip>
                <el-tooltip content="刷新" placement="left">
                    <el-button type="info" size="small" @click="getData">
                        <i class="iconfont icon-refresh_people"></i>
                    </el-button>
                </el-tooltip>
            </template>
        </page-header>
        <div class="page-body">
            <el-alert :title="$t('oss.skeymgrTips')" type="warning" :closable="false">
            </el-alert>
            <el-table :data="tableDataList" v-loading="loading" element-loading-spinner="el-icon-loading" stripe header-row-class-name="data-list" border class="data-list mt20">
                <el-table-column prop="accessKeyId" width="320px" label="Access Key ID">
                </el-table-column>
                <el-table-column prop="accessKeySecret" label="Access Key Secret">
                    <template slot-scope="scope">
                        <a href="javascript:;" v-if="scope.row.accessKeySecret === null || !scope.row.showPwdFlag" @click="toggleKey(scope.$index, true)">显示</a>
                        <span v-if="scope.row.accessKeySecret !== null && scope.row.showPwdFlag">
                            <span :class="{'greenbg': scope.row.status === 'active', 'yellowbg': scope.row.status === 'inactive'}">{{scope.row.accessKeySecret}}</span>
                            <a href="javascript:;" @click="toggleKey(scope.$index, false)">隐藏</a>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 'active'" class="color-success">有效</span>
                        <span v-if="scope.row.status === 'inactive'" class="color-danger">无效</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="创建时间" width="120px">
                    <template slot-scope="scope">
                        {{scope.row.ctime|date}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <a v-if="tableDataList.length > 1 && checkStatus(scope.$index)" href="javascript:;" @click="changeStatus(scope.row)">{{ scope.row.status === 'active' ? '禁用' : '启用'}}</a>
                        <el-tooltip v-if="tableDataList.length === 1 || !checkStatus(scope.$index)" content="至少保留一条有效密钥" transition="scale" placement="bottom" effect="light">
                            <a disabled>禁用</a>
                        </el-tooltip>
                        <a v-if="tableDataList.length > 1 && scope.row.status === 'inactive'" href="javascript:;" @click="deleteKey(scope.row.id)">删除</a>
                        <el-tooltip v-if="tableDataList.length === 1 || scope.row.status === 'active'" content="删除数据请先禁用" transition="scale" placement="bottom" effect="light">
                            <a disabled>删除</a>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 创建秘钥弹框 -->
        <create-key v-if="createKeyDialog" v-model="createKeyDialog"></create-key>
        <!-- 手机验证弹框 -->
        <mobile-code-dialog ref="mobileCodeDialog" :code-type="KEY_AUTH_CODE_FLAG"></mobile-code-dialog>
    </div>
</template>
<script>
import {getAuthKeys, setKeyStatus, deleteKey} from '@/service/oss/accessKey';
import {KEY_AUTH_CODE_FLAG} from '@/constants/const';
import PageHeader from '@/components/pageHeader/PageHeader';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';
import CreateKey from './CreateKey';
import {mapState} from 'vuex';
export default {
    name: 'Skeymgr',
    data() {
        return {
            loading: true,
            KEY_AUTH_CODE_FLAG,
            createKeyDialog: false,
            tableDataList: []
        };
    },
    components: {
        PageHeader,
        CreateKey,
        MobileCodeDialog
    },
    computed: {
        ...mapState({
            showPwdFlag: state => state.oss.showPwdFlag
        })
    },
    created() {
        this.getData();
    },
    methods: {
        // 检测当前有状态，如果数据中有一个无效时，其他记录不操作
        checkStatus(index) {
            if (this.tableDataList[index].status === 'inactive') return true;
            for (const [key, value] of Object.entries(this.tableDataList)) {
                if (value['status'] === 'inactive' && key !== index) {
                    return false;
                }
            }
            return true;
        },
        // 获取秘钥列表数据
        async getData() {
            this.loading = true;
            return getAuthKeys(this.showPwdFlag)
                .then(res => {
                    this.loading = false;
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let array = res.result.map(item => {
                            item['showPwdFlag'] = 0;
                            return item;
                        });
                        console.log('array', array);
                        this.tableDataList = array;
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        // 创建秘钥
        // createKey() {
        //     this.$refs.createKeyDialog
        //         .show()
        //         .then(res => {
        //             this.getData();
        //         })
        //         .catch(() => {
        //             alert('取消');
        //         });
        // },
        // 显示or隐藏秘钥
        toggleKey(index, flag) {
            if (flag === false) {
                this.tableDataList[index]['showPwdFlag'] = false;
            }
            if (flag === true) {
                if (this.showPwdFlag) {
                    this.tableDataList[index]['showPwdFlag'] = true;
                } else {
                    this.$refs.mobileCodeDialog.show().then( async (res) => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            this.$store.commit('oss/SET_SHOW_PWD_FLAG', 1);
                            await this.getData();
                            this.tableDataList[index]['showPwdFlag'] = true;
                        }
                    });
                }
            }
        },
        // 禁用 启用
        changeStatus(row) {
            let status = 'suspend';
            if (row.status === 'inactive') status = 'resume';
            setKeyStatus(row.id, status).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.getData();
                }
            });
        },
        // 删除前操作
        async deleteBefore(keyId) {
            return this.$confirm('确定要删除ID为' + keyId + '的密钥吗？', '删除', {
                type: 'warning'
            }).then(() => {
                if (this.showPwdFlag) {
                    return Promise.resolve();
                } else {
                    return this.$refs.mobileCodeDialog.show().then(res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            this.$store.commit('oss/SET_SHOW_PWD_FLAG', 1);
                            return Promise.resolve();
                        }
                    });
                }
            });
        },
        // 删除秘钥
        deleteKey(keyId) {
            this.deleteBefore(keyId)
                .then(() => {
                    return deleteKey(keyId);
                })
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getData();
                    }
                });
        }
    }
};
</script>
<style scoped>
</style>
