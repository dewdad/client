<template>
    <el-dialog
        title="问题补充"
        :visible.sync="isShow"
        width="45%"
        class="Supplement">
        <el-form inline-message :model="ruleForm" label-width="100px" :rules="rules" style="width:452px;" size="small"  ref="ruleForm">
            <el-form-item label="问题标题">
                <span>{{myticketInfo.title}}</span>
            </el-form-item>
            <el-form-item label="补充" prop="supple">
                <el-input type="textarea"  class="supple-text" v-model="ruleForm.supple"></el-input>
            </el-form-item>
            <el-form-item label="附件">
                <div class="el-upload__tip input-help mb10 pt0">
                    可上传3个 附件每个附件大小不得超过8M。附件支持的格式有：<br>
                    jpg,jpeg,png,bmp,gif,txt,rar,zip,doc,xls,docx,xlsx,pdf,ini,conf,eml
                </div>
                <el-upload multiple ref="upload" 
                    :action="uploadAction" 
                    :headers="uploadHeaders"
                    :accept="ZT_CONFIG.TS_IMAGE_ACCEPT"
                    :limit="3"
                    :file-list="fileList" 
                    :on-exceed="handleExceed" 
                    :on-change="handleChange"
                    list-type="picture-card" 
                    :on-success="handleAvatarSuccess" 
                    :on-remove="handleRemove" 
                    :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                </el-upload> 
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import ZT_CONFIG from '@/constants/config';
import { supplement } from '@/service/order';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            ZT_CONFIG,
            floatId: '',
            ruleForm:{
                supple:'',
            },
            rules:{
                supple: [
                    { required: true, message: '请输入补充说明', trigger: 'blur' }
                ]
            },
            uploadImgUrl: [],
            uploadAction: API_URL + '/fileProcess/upload',
            uploadHeaders: {
                'X-People-Token': this.$store.state.token
            },
            fileList: [],
            myticketInfo: {}
        }; 
    },
    watch: {
        isShow(val) {
            if(!val){
                this.ruleForm.ecsCase = '';
                this.$refs['ruleForm'].resetFields();
            }
        }
    },
    methods: {
        show(params) {
            this.myticketInfo = params;
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
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            if (!this.$refs['ruleForm']) return false;
            
            // 表单验证
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.saveSupplement();
                    this.hide();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleExceed(files, fileList) {
            let msg = '只能上传3个附件';
            this.$message.error(msg);
        },
        //文件上传:回调函数======================start=============================
        handleChange(file, fileList) {
            // 先清空，保证错误信息被更新
            // this.fileList = [];
            //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            this.fileList = fileList;
        },
        handleAvatarSuccess(res, file, fileList) { 
            console.warn(res);
            this.fileList = fileList;
            if (res.code === '0000') {
                let fileUrls = res.data || [];
                console.log('fileUrls',fileUrls);
                file.remoteFileId = fileUrls[0];
                this.uploadImgUrl.push(fileUrls[0]);               
            }else{
                file.status = 'fail';
            }
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        beforeAvatarUpload(file, showError) {
            console.log(file);

            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            const MiB = 1024 * 1024; //1MB 字节大小；
            const isLt8M = file.size < this.ZT_CONFIG.TS_IMAGE_SIZE_MAX * MiB;
            if (!isJPG) {
                let msg = 'account.Auth.companyAuth.msg.imageAccept';
                // showError(msg);
                this.$message.error(msg);
            }
            if (!isLt8M) {
                let msg = '上传图片大小不能超过' + this.ZT_CONFIG.TS_IMAGE_SIZE_MAX + 'MiB';
                // showError(msg);
                this.$message.error(msg);
            }
            return isJPG && isLt8M;
        },
        // 保存问题补充
        saveSupplement() {
            let params = {
                attachUrl: this.uploadImgUrl.join(','),
                orderId: this.myticketInfo.id,
                orderNO: this.myticketInfo.orderNO,
                suppleContent: this.ruleForm.supple
            };
            this.loading = true;
            supplement(params)
                .then(res => {
                    if (res && res.data) {
                        if(res.code === '0000'){
                            this.$refs.upload.clearFiles();
                            this.resolve(res);
                            return this.$alert('操作成功！','提示');
                        }

                    }
                    this.loading = false;
                })
                .catch(e => {
                    console.error('getEcsInstList', e);
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss">
.Supplement{
    .tip{
        background-color: #FBF7CF;
        padding: 15px 30px;
        color: #F68300;
        border: 1px solid #F6E0C4;
        ul, li{
            list-style-type: disc;
        }
    }
    .el-upload--picture-card{
        width: 90px;
        height: 90px;
        line-height: 90px;
        i {
            font-size: 40px;
            font-weight: 700;
            line-height: 90px;
        }
    } 
    .el-upload__input {
        display: none !important;
    }
    .avatar-ticket-info {
        width: 80px;
        height: 80px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .el-upload-list__item{
        width: 90px;
        height: 90px;
    }
    .supple-text{
        line-height: 20px;
        min-width:100%;
        max-width: 100%;
    }
    ::-webkit-scrollbar{
        display:block;
        width: 6px;
        height: 6px;
        background-color: #fff;
    }
    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        background-color:#c2c2c2;
    }
}
</style>
