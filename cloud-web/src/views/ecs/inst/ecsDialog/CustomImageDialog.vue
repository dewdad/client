<template>
    <el-dialog title="创建自定义镜像" :visible.sync="isShow" width="600px" class="CustomImageDialog" @close="cancel">
        <!-- tip提示 -->
        <div class="tip font12">
            <ul>
                <li>创建镜像的同时系统默认会创建相关快照。</li>
                <li>请您在使用linux系统创建自定义镜像时，注意不要在/etc/fstab文件中加载数据盘的信息，否则使用该镜像创建的实例无法启动。</li>
                <li>您可对当前ECS实例做个完整的镜像模板，包含该实例下的所有磁盘。该实例的每块磁盘会新增一个快照,可以在快照列表中查询。需要等待每块磁盘的快照创建完成，镜像才能可以使用，期间不要更改实例状态，如停止或重启实例，请耐心等待。</li>
            </ul>
        </div>
        <div style="padding-right: 150px;">
            <zt-form class="mt20" inline-message size="small" :model="customImage" label-width="130px" :rules="rules" ref="ruleForm">
                <zt-form-item label="自定义镜像名称" class="mb20" prop="imageName">
                    <div>
                        <el-input v-model="customImage.imageName" placeholder="请输入自定义镜像名称" maxlength="64" :clearable="true"></el-input>
                        <span class="input-help">不能输入中文，长度为2-64个字符，不能以特殊字符及数字开头，只可包含特殊字符中的".","_"或"-"</span>
                    </div>
                </zt-form-item>
            </zt-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow=false" :disabled="loading">取 消</el-button>
            <el-button type="primary" size="small" :loading="loading" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {createCustomImage} from '@/service/ecs/list.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            customImage: {
                ecsId: '',
                imageName: '',
                imageDesc: ''
            },
            rules: {
                imageName: [
                    {
                        required: true,
                        message: '请输入自定义镜像名称',
                        trigger: ['submit', 'change']
                    },
                    {
                        min: 2,
                        max: 64,
                        message: '长度为2-64个字符',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: /^[a-zA-Z]{1}[a-zA-Z0-9._-]+$/,
                        message: '格式错误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {},
    watch: {
        isShow: function(newval) {
            if (newval) {
                this.customImage.imageName = '';
                this.$nextTick(() => {
                    this.$refs.ruleForm.clearValidate();
                });
            }
        }
    },
    methods: {
        show(rowItem) {
            this.customImage.ecsId = rowItem.id;
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
        },
        cancel() {
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            if (this.customImage.imageName.indexOf('self') != -1 || this.customImage.imageName.indexOf('define') != -1) {
                this.$alert('镜像名称不能包含self, define等字样。', '提示', {
                    type: 'error'
                });
                return;
            }
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    createCustomImage(this.customImage).then(
                        res => {
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.hide();
                                // this.setting();
                                this.$message.success('操作成功');
                                this.resolve(this.customImage);
                            }
                        }
                    ).catch(err => {
                        $log(err);
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            });
        }
    }
};
</script>
<style lang="scss">
.CustomImageDialog {
    .tip {
        background-color: #fbf7cf;
        padding: 15px 30px;
        color: #f68300;
        border: 1px solid #f6e0c4;
        ul,
        li {
            list-style-type: disc;
        }
    }
    .enterPwd {
        display: flex;
        justify-content: center;
        span.title {
            flex: 1;
            padding-top: 10px;
            padding-left: 20px;
        }
        .right {
            flex: 5;
            div {
                width: 300px;
            }
        }
        .el-input {
            input {
                width: 300px;
            }
            flex: 5;
        }
    }
}
</style>
