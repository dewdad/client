<template>
    <div class="mt10">
        <page-header>
            白名单设置
            <div slot="right">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="isShow = true">添加的白名单分组</el-button>
            </div>
        </page-header>
        <el-row v-loading="loading">
            <el-col :span="24">
                <transition-group name="fade" tag="div">
                    <!-- 分组列表循环 -->
                    <div v-for="(item, index) in whiteList" :key="item.groupName" class="panel panel-default mt20">
                        <div class="panel-heading">
                            <i class="iconfont icon-head_workorder_peop mr10"></i>{{item.groupName}}
                            <div class="text-right panel-heading__right">
                                <a href="javascript:;" @click="deleteWhite(item.id, item.groupName, index)">删除</a>
                                <b class="link-division-symbol"></b>
                                <a href="javascript:;" @click="editGroup(item.id, item.groupName, item.whiteList)">修改</a>
                                <b class="link-division-symbol"></b>
                                <a href="javascript:;" @click="clearWhite(item)">清空</a>
                            </div>
                        </div>
                        <div class="panel-body">
                            <el-row :gutter="20">
                                <el-col v-for="white in item.whiteList" :key="white.ipAddress" :xs="3" :lg="3">
                                    {{white.ipAddress}}
                                </el-col>
                                <el-col :span="24" v-if="item.whiteList.length === 0">
                                    <span class="color-secondary">该分组下暂无IP，请先添加。</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </transition-group>
            </el-col>
        </el-row>
        <!-- 添加白名单分组弹框 -->
        <el-dialog v-if="isShow" :title="myForm.id ? '修改白名单分组' : '添加白名单分组'" :visible.sync="isShow" :append-to-body="true" :close-on-click-modal="false" @close="isShow=false" :before-close="beforeClose">
            <div class="form" style="padding-right:100px;">
                <zt-form v-loading="isSubmit" loading="empty" ref="myForm" :rules="rules" label-width="100px" :model="myForm" size="small" inline-message>
                    <zt-form-item label="分组名称" prop="groupName">
                        <el-input v-model="myForm.groupName" placeholder="请输入分组名称"></el-input>
                    </zt-form-item>
                    <zt-form-item label="组内白名单" prop="ipAddress">
                        <el-input type="textarea" :resize="'none'" :rows="6" v-model="myForm.ipAddress" placeholder="请输入组内白名单"></el-input>
                        <span class="input-help">
                            <a href="javascript:;" class="font12">加载ECS内网IP</a>
                            <span class="pull-right">还可以添加{{inputLengh}}个白名单</span>
                        </span>
                        <span class="input-help">
                            指定IP地址：192.168.0.1 允许192.168.0.1的IP地址访问RDS<br/> 指定IP段：192.168.0.0/24 允许从192.168.0.1到192.168.0.255的IP地址访问RDS<br/> 多个IP设置，用英文逗号隔开，如192.168.0.1,192.168.0.0/24
                        </span>
                        <span class="input-help">
                            <a>如何定位本地IP</a>
                        </span>
                        <span class="input-help">
                            <el-alert type="warning" title="新名单将于1分钟后生效" :closable="false">
                            </el-alert>
                        </span>
                    </zt-form-item>
                </zt-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="isSubmit" :disabled="isSubmit" size="small">确定</el-button>
                <el-button type="info" @click="isShow=false" :disabled="isSubmit" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getWhiteList, addWhite, deleteWhite, clearWhite} from '@/service/rds/whitelist';
import {isArray} from '@/utils/utils';
export default {
    name: 'Whitelist',
    data() {
        // 验证IP地址栏输入有效性
        const validateIP = (rule, value, callback) => {
            let ips = value.split(',');
            let check = true;
            for (let index = 0; index < ips.length; index++) {
                let ip = ips[index];
                if (ip == '') {
                    check = false; //不合法;
                    break;
                }
                let exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if (ip.indexOf('/') !== -1) {
                    // 192.168.168.0/24 格式
                    if (ip == '0.0.0.0/0') {
                        continue;
                    }
                    let arr = ip.split('/');

                    let reg = arr[0].match(exp);
                    if (reg == null) {
                        check = false; //不合法;
                        break;
                    } else {
                        continue;
                    }
                } else {
                    // 192.168.168.0格式
                    let reg = ip.match(exp);
                    if (reg == null) {
                        check = false; //不合法;
                        break;
                    } else {
                        continue;
                    }
                }
            }
            if (!check) {
                callback(new Error('格式错误'));
            }
            callback();
        };
        return {
            loading: true,
            isShow: false,
            isSubmit: false,
            whiteList: [],
            myForm: {
                id: '',
                groupName: '',
                ipAddress: ''
            },
            rules: {
                groupName: [
                    {
                        required: true,
                        message: '请输入分组名称',
                        trigger: ['blur', 'change']
                    }
                ],
                ipAddress: [
                    {
                        required: true,
                        message: '请输入组内白名单',
                        trigger: ['blur', 'change']
                    },
                    {validator: validateIP, trigger: 'blur'}
                ]
            }
        };
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                (this.isSubmit = false),
                (this.myForm = {
                    id: '',
                    groupName: '',
                    ipAddress: ''
                });
            }
        }
    },
    computed: {
        // 可输入IP数量
        inputLengh: function() {
            let ipAddress = this.myForm.ipAddress;
            if (ipAddress !== '') {
                let arr = ipAddress.split(',');
                return 1000 - arr.length;
            }
            return 1000;
        },
        instId: function() {
            return this.$route.params.id;
        }
    },
    created() {
        this.getWhiteList();
    },
    methods: {
        getWhiteList() {
            getWhiteList(this.instId)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.whiteList = res.result;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        confirm() {
            // 验证提交表单
            this.$refs.myForm.validate(valid => {
                if (valid) {
                    let params = {
                        instanceId: this.instId,
                        id: this.myForm.id,
                        groupName: this.myForm.groupName,
                        ipAddress: this.myForm.ipAddress
                    };
                    this.isSubmit = true;
                    addWhite(params)
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('操作成功');
                                // 关闭对话框并重新加载数据
                                this.isShow = false;
                                this.getWhiteList();
                            }
                        })
                        .catch(err => {
                            $log(err);
                        })
                        .finally(() => {
                            this.isSubmit = false;
                        });
                }
            });
        },
        beforeClose(done) {
            if (this.isSubmit) {
                this.$alert('正在提交数据,请勿关闭对话框。', '提示', {
                    type: 'error'
                });
                return false;
            }
            done();
        },
        // 修改名单分组
        editGroup(id, groupName, whiteList) {
            this.myForm.id = id;
            this.myForm.groupName = groupName;
            let ipAddress = [];
            if (isArray(whiteList)) {
                whiteList.forEach(item => {
                    ipAddress.push(item.ipAddress);
                });
                this.myForm.ipAddress = ipAddress.join(',');
            }
            this.isShow = true;
        },
        // 删除分组
        deleteWhite(id, groupName, index) {
            this.$confirm('您确定要删除' + groupName + '分组吗？', '删除', {
                type: 'error'
            }).then(() => {
                deleteWhite(id).then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('删除成功');
                        this.whiteList.splice(index, 1);
                    }
                });
            });
        },
        // 清空分组内的白名单
        clearWhite(item) {
            this.$confirm('您确定要清空' + item.groupName + '分组下的白名单吗吗？', '删除', {
                type: 'warning'
            }).then(() => {
                clearWhite(item.id).then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('清除成功');
                        item.whiteList = [];
                    }
                });
            });
        }
    }
};
</script>
<style scoped>
</style>
