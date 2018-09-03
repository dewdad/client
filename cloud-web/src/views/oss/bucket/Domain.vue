<template>
    <div class="mt10">
        <el-row>
            <el-col :span="12">
                <span class="font16 lh32">用户域名管理</span>
            </el-col>
            <el-col :span="12" class="text-right">
                <span class="lh32 mr10 color-secondary font12">每个存储空间最多可以绑定
                    <mark class="color-success">19</mark> 个域名</span>
                <el-button type="primary" size="small" @click="isShow=true">
                    <i class="iconfont icon-binding_people"></i> 绑定用户域名
                </el-button>
            </el-col>
        </el-row>
        <el-table :data="domainList" style="width: 100%" stripe border class="data-list mt20">
            <el-table-column prop="userDomain" label="用户域名">
            </el-table-column>
            <el-table-column prop="ossDomain" label="绑定的OSS域名">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <a href="javascript:;" @click="unbind(scope.row.userDomain, scope.$index)">解绑</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- 绑定用户域名弹框 -->
        <el-dialog v-if="isShow" title="绑定用户域名" :visible="isShow" @close="cancel" width="600px">
            <div style="padding-right: 150px;">
                <zt-form ref="addForm" label-width="110px" :model="addForm" size="small" :rules="rules" inline-message>
                    <zt-form-item label="用户域名" prop="domain">
                        <el-input v-model="addForm.domain" placeholder="请输入用户域名" @keyup.enter.native="confirm"></el-input>
                        <span class="input-help">域名由特定字符集、英文字母、数字及“-”(即连字符或减号)任意组合而成, 但开头及结尾均不能含有“-”。 域名中字母不分大小写，且至少包含一个“.”。域名最长可达67个字节(包括后缀.com、.net、.org等)。</span>
                    </zt-form-item>
                </zt-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">提交</el-button>
                <el-button type="info" @click="cancel" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getUserDomainList, bindDomain} from '@/service/oss/index';
import {DOMAIN_REGEXP} from '@/constants/regexp';
let [isShow, loading, isSubmit] = [false, false, false];
export default {
    name: 'Domain',
    data() {
        return {
            domainList: [],
            isShow,
            loading,
            isSubmit,
            addForm: {
                domain: ''
            },
            rules: {
                domain: [
                    {
                        required: true,
                        message: '请输入用户域名',
                        trigger: ['blur', 'change']
                    },
                    {
                        pattern: DOMAIN_REGEXP,
                        message: '域名格式不正确',
                        trigger: ['blur']
                    }
                ]
            }
        };
    },
    props: {
        bucketId: {
            type: String,
            default: ''
        }
    },
    created() {
        if (this.bucketId) {
            this.getUserDomainList();
        }
    },
    methods: {
        // 加载域名列表数据
        getUserDomainList() {
            this.loading = true;
            getUserDomainList(this.bucketId)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.domainList = res.result;
                    }
                })
                .finally(() => {
                    this.loading = true;
                });
        },
        // 解绑
        unbind(domain, index) {
            this.$confirm('您确定要解绑此域名吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    bindDomain(this.bucketId, domain, 'unbind').then(res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            this.$message.success('解绑成功');
                            this.domainList.splice(index, 1);
                        }
                    });
                })
                .catch(err => {
                    console.log('取消解绑');
                });
        },
        // 提交绑定域名表单
        confirm() {
            this.$refs['addForm'].validate(valid => {
                if (valid) { // 验证通过
                    this.isSubmit = true;
                    bindDomain(this.bucketId, this.addForm.domain, 'bind')
                        .then(res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('绑定成功');
                                // 关闭弹框
                                this.cancel();
                                // 重新加载数据
                                this.getUserDomainList();
                            }
                        })
                        .finally(() => {
                            this.isSubmit = false;
                        });
                }
            });
        },
        // 关闭弹框
        cancel() {
            // 清空输入框的值
            this.addForm.domain = '';
            // 注销弹框
            this.isShow = false;
        }
    }
};
</script>
<style scoped>
</style>
