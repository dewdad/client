<template>
    <el-dialog
        title="问题补充"
        :visible.sync="isShow"
        width="45%"
        class="Supplement">
        <zt-form inline-message :model="ruleForm" label-width="100px" :rules="rules" style="width:452px;" size="small"  ref="ruleForm">
            <zt-form-item label="问题标题">
                <span>{{myticketInfo.title}}</span>
            </zt-form-item>
            <zt-form-item label="补充" prop="supple">
                <textarea class="supple-text" v-model="ruleForm.supple"></textarea>
            </zt-form-item>
            <zt-form-item label="附件">
                <div class="el-upload__tip input-help mb10">
                    {{ replaceParamVal("可上传{imageLimit}个 附件每个附件大小不得超过{maxsize}M。附件支持的格式有：{fileAccept}",
                    [ZT_CONFIG.TS_IMAGE_TOTAL_LIMIT,ZT_CONFIG.TS_IMAGE_SIZE_MAX,ZT_CONFIG.TS_IMAGE_ACCEPT]) }}
                </div>
                <zt-upload multiple ref="upload" 
                    :action="uploadAction" 
                    :headers="uploadHeaders"
                    :accept="ZT_CONFIG.TS_IMAGE_ACCEPT"
                    :limit="1" 
                    :file-list="fileList" 
                    :on-exceed="handleExceed" 
                    :on-change="handleChange"
                    list-type="picture-card" 
                    :on-success="handleAvatarSuccess" 
                    :on-remove="handleRemove" 
                    :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                </zt-upload> 
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import ZTUpload from '@/components/ZTUpload';
import ZT_CONFIG from '@/constants/config';
import {replaceParamVal} from '@/utils/utils';
import { supplement } from '@/service/ticket';
export default {
    components:{
        'zt-upload': ZTUpload,
    },
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            ZT_CONFIG,
            replaceParamVal,
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
            let msg = $t('只能上传1个附件');
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
                let msg = $t('account.Auth.companyAuth.msg.imageAccept');
                showError(msg);
                //this.$message.error(msg);
            }
            if (!isLt8M) {
                let msg = $t('account.Auth.imageSizeTip') + this.ZT_CONFIG.TS_IMAGE_SIZE_MAX + $t('abbr.mb');
                showError(msg);
            }
            return isJPG && isLt8M;
        },
        // 保存问题补充
        saveSupplement() {
            let params = {
                orderAttach: this.uploadImgUrl[0],
                orderId: this.myticketInfo.id,
                orderNO: this.myticketInfo.orderNO,
                suppleContent: this.ruleForm.supple
            };
            this.loading = true;
            supplement(params)
                .then(res => {
                    if (res && res.data) {
                        let data = res.data;
                        $log(data);
                        this.resolve(res);
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
        min-height: 118px;
        max-height: 118px;
        min-width:100%;
        max-width: 100%;
    }
}
</style>
