<template>
    <div class="basicset">
        <!-- 权限设置 -->
        <section class="section">
            <h3>权限设置</h3>
            <div class="section-inner">
                <div class="item">
                    <label class="name"></label>
                    <div class="item-content">OSS ACL提供Bucket级别的权限访问控制，了解
                        <a>读写权限设置</a>
                    </div>
                </div>
                <div class="item">
                    <label class="name">Bucket ACL</label>
                    <div class="item-content">
                        <div v-if="!rwAuthForm.setting">{{permission}}
                            <el-popover placement="top" title="" width="300" trigger="hover" content="尊敬的客户您好，公共读（public-read）权限可以不通过身份验证直接读取您 Bucket中的数据，安全风险高，为确保您的数据安全，不推荐此配置，建议您选择私有（private）。">
                                <i class="iconfont icon-notice_people color-danger" slot="reference"></i>
                            </el-popover>
                        </div>
                        <div v-else>
                            <el-radio-group v-model="rwAuthForm.privacy" class="primary" size="small">
                                <el-radio-button :label="true" border>私有</el-radio-button>
                                <el-radio-button :label="false" border>公共读</el-radio-button>
                            </el-radio-group>
                            <span class="input-help color-danger">公共读：对文件写操作需要进行身份验证；可以对文件进行匿名读。</span>
                            <!-- <span  class="helptips">私有：对文件的所有访问操作需要进行身份验证。</span> -->
                        </div>
                        <template v-if="!rwAuthForm.setting">
                            <el-button type="info" size="small" @click="rwAuthForm.setting = true">设置</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" size="small" @click="setBucketPrivacy">保存</el-button>
                            <el-button type="info" size="small" @click="rwAuthForm.setting = false">取消</el-button>
                        </template>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import {setBucketPrivacy, getBucketBasic} from '@/service/oss/index';
export default {
    name: 'Basicset',
    data() {
        return {
            rwAuthForm: {
                privacy: false,
                setting: false
            },
            baseInfo: {},
            permission: ''
        };
    },
    props: {
        bucketId: {
            type: String,
            default: ''
        }
    },
    created() {
        this.getBucketBasic();
    },
    methods: {
        getBucketBasic() {
            getBucketBasic(this.bucketId).then(res => {
                if (res.code === '0000') {
                    this.baseInfo = res.data;
                    this.permission = res.data.grants[0].permission === 'Read' ? '公共读' : '私有';
                    this.rwAuthForm.privacy = res.data.grants[0].permission === 'Read' ? false : true;
                }
            });
        },
        setBucketPrivacy() {
            setBucketPrivacy(this.bucketId, this.rwAuthForm.privacy).then(res => {
                if (res.code === '0000') {
                    this.rwAuthForm.setting = false;
                    this.permission = this.rwAuthForm.privacy ? '私有' : '公共读';
                    this.$message.success('操作成功');
                }
            });
        }
    }
};
</script>
<style scoped lang="scss">
.section {
    position: relative;
    &:not(:first-child) {
        padding-top: 10px;
    }
    padding-bottom: 15px;
    h3 {
        margin: 0px;
        font-size: 14px;
        line-height: 32px;
        font-weight: 500;
    }
    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #e4e7ed;
        z-index: 1;
    }
    .section-inner {
        padding-left: 50px;
        .item {
            display: flex;
            margin-bottom: 10px;
            label.name {
                display: inline-block;
                width: 100px;
                font-weight: 500;
                margin-right: 24px;
                text-align: right;
                vertical-align: top;
                padding-top: 5px;
            }
            .item-content {
                color: #999;
                line-height: 30px;
                text-align: left;
                flex: 1;
                display: inline-block;
                .el-button {
                    margin-top: 10px;
                }
                .helptips {
                    display: block;
                }
            }
        }
    }
}
</style>
