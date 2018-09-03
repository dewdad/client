<template>
    <el-dialog v-if="isShow" title="创建存储空间" :visible.sync="isShow" width="600px" :append-to-body="true" @close="cancel">
        <div class="form" style="padding-right:130px;">
            <zt-form ref="bucketForm" label-width="110px" :model="bucket" size="small" :rules="rules" inline-message>
                <zt-form-item label="存储空间名称" prop="name">
                    <el-input v-model="bucket.name" placeholder="请输入储存空间名称"></el-input>
                    <span class="input-help">存储名称作为唯一标识符，遇到冲突请更换名称，名称由4~63个字符组成，可包含小写字母、数字、中划线</span>
                </zt-form-item>
                <zt-form-item label="读写权限">
                    <region-radio v-model="bucket.region"></region-radio>
                </zt-form-item>
                <zt-form-item label="存储区域">
                    <el-radio-group v-model="bucket.rwAuth" class="primary">
                        <el-radio label="true" border>私有</el-radio>
                        <el-radio label="false" border>公开</el-radio>
                    </el-radio-group>
                    <span v-if="bucket.rwAuth === 'false'" class="input-help danger">公开：对文件写操作需要进行身份验证;可以对文件进行匿名读。</span>
                    <span v-if="bucket.rwAuth === 'true'" class="input-help">私有：对文件的所有访问操作需要进行身份验证。</span>
                </zt-form-item>
            </zt-form>
        </div>
        <div slot="footer" class="dialog-footer text-right">
            <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">确定</el-button>
            <el-button type="info" @click="cancel" size="small">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import RegionRadio from '@/components/regionRadio/RegionRadio';
import {NAME_REGEXP} from '@/constants/regexp';
import {createBucket} from '@/service/oss/index';
export default {
    name: 'CreateKey',
    data() {
        return {
            isShow: false,
            isSubmit: false,
            reject: null,
            resolve: null,
            bucket: {
                name: '',
                region: '',
                rwAuth: 'false'
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入存储空间名称',
                        trigger: ['blur', 'change']
                    },
                    {
                        pattern: NAME_REGEXP,
                        message: '名称不能包含非法字符',
                        trigger: ['blur']
                    },
                    {
                        min: 4,
                        max: 63,
                        message: '名称长度在4-63个字符之间',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    components: {
        RegionRadio
    },
    methods: {
        show() {
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
            // 重置bucket表单值
            this.bucket = {
                name: '',
                region: '',
                rwAuth: 'false'
            };
        },
        cancel() {
            this.close();
        },
        confirm() {
            this.$refs['bucketForm'].validate(valid => {
                if (valid) {
                    this.isSubmit = true;
                    createBucket({bucketName: this.bucket.name, isPrivate: this.bucket.rwAuth})
                        .then(res => {
                            this.isSubmit = false;
                            if (res.code === this.CODE.SUCCESS_CODE) {
                                this.$message({
                                    message: '创建成功',
                                    type: 'success'
                                });
                                this.resolve(res);
                                this.close();
                            }
                        })
                        .catch(() => {
                            this.isSubmit = false;
                        });
                }
            });
        }
    }
};
</script>
<style scoped>
.createBody {
    padding: 10px;
}
</style>
