<template>
    <div class="inst-create create-ecs">
        <div class="create-form" style="padding-top:30px">
            <!-- 云盘名称 -->
            <el-card class="box-card create-form-item create-form-item__name" shadow="hover">
                <div class="create-form-item__label">
                    <label>
                        <zt-icon icon="icon-chuangjianyunzhuji-shilimingcheng"></zt-icon>
                        云盘名称
                    </label>
                </div>
                <div class="create-form-item__content">
                    <div style="width: 300px">
                        <zt-form ref="instNameForm" :show-message="true" inline-message size="small" :model="form" :rules="rules" label-width="0" style="width:300px;">
                            <zt-form-item id="instname" label="" class="hide-star" prop="diskName">
                                <el-input v-model="form.diskName" placeholder="请输入云盘名称" size="small"></el-input>
                                <span class="input-help">只能由中文字符、英文字母、数字、下划线、中划线组成，且长度小于等于64个字符</span>
                            </zt-form-item>
                            <zt-form-item label="" class="mb0 hide-star" prop="desc">
                                <el-input type="textarea" v-model="form.desc" maxlength="300" autosize placeholder="磁盘描述" :clearable="true"></el-input>
                                <span class="input-help">{{$t('ecs.create.instdesc.tips')}}</span>
                            </zt-form-item>
                        </zt-form>
                    </div>
                </div>
            </el-card>
            <!-- 云盘名称 end -->
            <!-- 云盘 -->
            <el-card class="box-card create-form-item" shadow="hover">
                <div class="create-form-item__label">
                    <label>
                        <zt-icon icon="icon-yunzhujichuangjian-cunchu"></zt-icon>
                        云盘
                    </label>
                </div>
                <div class="create-form-item__content">
                    <div class="storage">
                        <ul>
                            <li class="is-open">
                                <div class="content">
                                    <div class="font12">
                                        <el-select style="width:170px" v-model="sysDisk.type" placeholder="请选存储类型" popper-class="el-popper--small" key-value="value" size="small" class="mr10">
                                            <el-option v-for="type in STORAGE_TYPES" :key="type.value" :label="type.label" :value="type">
                                            </el-option>
                                        </el-select>
                                        <zt-input-number style="width:170px" v-model="sysDisk.size" :tooltip="'容量范围: 20G - 32768G'" size="small" :precision="0" :step="10" suffix="G" controls-position="right" :min="20" :max="32768"></zt-input-number>
                                        <span class="ml10" v-if="sysDisk.type.value === 'SSD'">1960 IOPS</span>
                                        <span class="ml10" v-if="sysDisk.type.value === 'SATA'">1120 IOPS</span>
                                    </div>
                                    <div class="mt10 font12 color999">
                                        {{$t('ecs.create.storage.sysDiskTxt')}}
                                        <a class="font12">详细说明</a>
                                    </div>
                                </div>

                            </li>
                        </ul>
                    </div>
                </div>
            </el-card>
            <!-- 申请量 -->
            <el-card class="box-card create-form-item" shadow="hover">
                <div class="create-form-item__label">
                    <label>
                        <zt-icon icon="icon-shenqingshuliang"></zt-icon>
                        申请量
                    </label>
                </div>
                <div class="create-form-item__content">
                    <zt-input-number style="width:170px" v-model="numberApply" :tooltip="'容量范围: 20G - 32768G'" size="small" :precision="0" :step="1" suffix="块" controls-position="right" :min="1" :max="250"></zt-input-number>
                    <span class="input-help">最多可开通 250 块云盘，已开通 {{numberApply}} 块</span>

                    <!-- 当前配置 -->
                    <div style="padding:20px;background-color:#F9FAFD;" class="mt20">
                        <div class="configure  font12">
                            <p class="mb10">
                                <span class="color666">当前配置</span>
                            </p>
                            <el-row :gutter="15">
                                <el-col :span="6">
                                    <span class="color999">云盘名称：</span>
                                    <span class="">{{form.diskName}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span class="color999">云盘：</span>
                                    <span class="">{{sysDisk.type.label}} {{sysDisk.size}}GB</span>
                                </el-col>
                                <el-col :span="6">
                                    <span class="color999">申请数量：</span>
                                    <span class="">{{numberApply}}</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>

                </div>
            </el-card>
            <!-- 申请量 end -->
        </div>
        <div class="create-footer">
            <el-button type="warning" :plain="creating" @click="createInst" :loading="creating">{{creating ? '正在为您创建...' : '立即创建'}}</el-button>
            <el-button type="info" @click="$router.go(-1)">取消</el-button>
        </div>
    </div>
</template>

<script>
import {addClass, removeClass} from '@/utils/utils';
import ZtInputNumber from '@/components/ZTInput-number/index.js';
import {STORAGE_TYPES} from '@/constants/dicts/ecs';
import {INST_NAME} from '@/constants/regexp';
import {createDisk} from '@/service/ecs/disk/disk';
export default {
    data() {
        return {
            creating: false,
            form: {
                diskName: '',
                desc: ''
            },
            STORAGE_TYPES,
            sysDisk: {
                type: STORAGE_TYPES[0],
                size: 20
            },
            number: 10,
            numberApply: 1,
            rules: {
                diskName: [
                    {
                        required: true,
                        message: '请输入云盘名称',
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 64,
                        show: true,
                        tipsMessage: this.$t('valid.name.length'),
                        message: '名称格式不正确',
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: INST_NAME,
                        show: true,
                        tipsMessage: this.$t('valid.name.regex'),
                        message: '名称格式不正确',
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    components: {
        ZtInputNumber
    },
    methods: {
        createInst() {
            this.$refs.instNameForm.validate(valid => {
                if (valid) {
                    let data = {
                        name: this.form.diskName,
                        createNum: this.numberApply,
                        volumeType: this.sysDisk.type.value,
                        size: this.sysDisk.size,
                        description: '',
                        ecsId: '',
                        snapshotId: ''
                    };
                    this.creating = true;
                    createDisk(data)
                        .then(res => {
                            if (res.code === '0000') {
                                this.$message.success('创建成功');
                                this.$router.push({name: 'app.ecs.clouddisc-list'});
                            }
                        })
                        .catch(err => {
                            $log(err);
                        })
                        .finally(() => {
                            this.creating = false;
                        });
                }
            });
        }
    },
    destroyed() {
        removeClass(document.body, 'create');
    },
    mounted() {
        addClass(document.body, 'create');
    }
};
</script>

<style scoped lang="scss">
.storage {
    .el-select,
    .el-input,
    .el-input-number {
        width: 170px !important;
    }
    li:not(:last-child) {
        margin-bottom: 10px;
    }
    .head {
        position: relative;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        display: flex;
        .el-icon-arrow-right {
            position: absolute;
            left: -17px;
            top: 0px;
            font-size: 12px;
            color: #364556;
            line-height: 28px;
            transition: transform 0.3s;
        }
        .head-inner {
            label,
            span {
                margin-right: 50px;
            }
            width: 100%;
            padding: 0 2px;
            &:hover {
                background: #eceff8;
                // border-bottom: solid 1px #0d7ef2;
            }
        }
    }
    .devname {
        margin-left: 76px;
    }
    .numbers {
        margin-left: 40px;
        margin-right: 35px;
        .el-input-number {
            width: 120px !important;
        }
    }
    .heop-tips {
        margin-left: 40px;
    }
    .is-open {
        .head .head-inner {
            background: #eceff8;
            border-bottom: solid 1px #0d7ef2;
        }
        .el-icon-arrow-right {
            transform: rotate(90deg);
        }
        .content {
            display: block;
        }
    }
    .el-button.el-button--primary {
        width: 32px;
        height: 32px;
        padding: 0px;
    }
    .el-button.el-button--text {
        height: 32px;
        padding: 0px 10px 0 0;
        line-height: 32px;
        .el-icon-plus {
            display: inline-block;
            width: 32px;
            height: 32px;
            line-height: 32px;
            background: #0d7ef2;
            color: #fff;
            padding: 0px;
        }
        &.is-disabled {
            .el-icon-plus {
                background: #ccd1db;
            }
        }
    }
}
</style>


