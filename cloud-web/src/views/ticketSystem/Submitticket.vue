<template>
    <div class="page-main" v-loading="loading">
        <!-- 返回上一步 -->       
        <div>            
            <el-button size="mini" type="info" @click="goBack">
                <i class="iconfont icon-fanhui"></i>{{ $t('common.goback') }}
            </el-button>
        </div>
        <!-- 提交工单 -->
        <div class="submitTicket panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>提交工单
            </div>
            <div class="panel-body zt-panel-body-info font12">
                <zt-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <zt-form-item label="标题" prop="title">
                        <el-input type="textarea" v-model="ruleForm.title" resize="none" rows="5" 
                        placeholder="问题标题，不得超过100字!">
                        </el-input>
                    </zt-form-item>

                    <zt-form-item label="产品类型" prop="moduleType">
                        <el-select v-model="ruleForm.moduleType" value-key="value" placeholder="请选择产品类型">
                            <el-option
                            v-for="item in moduleTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                            </el-option>
                        </el-select>
                    </zt-form-item>

                    <zt-form-item label="故障类型" prop="orderType">
                        <el-select v-model="ruleForm.orderType" placeholder="请选择故障类型">
                            <el-option
                            v-for="item in ruleForm.moduleType.orderTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </zt-form-item>

                    <zt-form-item label="优先级" prop="orderLevel">
                        <el-radio v-model="ruleForm.orderLevel" :label="2">重要</el-radio>
                        <el-radio v-model="ruleForm.orderLevel" :label="1">一般</el-radio>
                        <div class="prioritytip" v-show="ruleForm.orderLevel === 2">关键业务受影响，需要紧急协助</div>
                        <div class="prioritytip" v-show="ruleForm.orderLevel === 1">业务咨询或普通业务受影响，需要协助</div>
                    </zt-form-item>

                    <zt-form-item label="问题描述" prop="orderDesc">
                        <el-input type="textarea" v-model="ruleForm.orderDesc" rows="5" resize="none" 
                        placeholder="问题描述，不得超过100字，若提交密码或AccessKeys等信息，请通过“机密信息”方式添加，并在问题处理完毕后及时修改">
                        </el-input>                        
                    </zt-form-item>

                    <zt-form-item label="实例ID" prop="resourceId">
                        <el-input v-model="ruleForm.resourceId"></el-input>
                    </zt-form-item>

                    <zt-form-item label="补充说明" prop="remark">
                        <el-input type="textarea" v-model="ruleForm.remark" resize="none" rows="5" 
                        placeholder="补充说明，不得超过100字，若为弹性云服务器相关问题，请补充说明IP端口、网站地址、web目录等；若为RDS相关问题，请补充说明账号等，并尽快提交充分信息便于排查">
                        </el-input>
                    </zt-form-item>

                    <zt-form-item label="机密信息" prop="secretInfo">
                        <el-input type="textarea" v-model="ruleForm.secretInfo" resize="none" rows="5" 
                        placeholder="请在此处填写实例名、账号、密码等机密信息，提交后，机密信息将做加密处理" >
                        </el-input>
                    </zt-form-item>

                    <zt-form-item label="手机号码" prop="mobile">
                        <el-input v-model="ruleForm.mobile"></el-input>
                    </zt-form-item>

                    <zt-form-item label="邮箱" prop="email">
                        <el-input v-model="ruleForm.email"></el-input>
                    </zt-form-item>

                    <zt-form-item label="上传附件">    
                        <zt-upload multiple ref="upload"
                        :action="uploadAction"
                        :headers="uploadHeaders"
                        :accept="ZT_CONFIG.TS_IMAGE_ACCEPT"
                        :limit="ZT_CONFIG.TS_IMAGE_TOTAL_LIMIT"
                        :file-list="fileList" 
                        :on-exceed="handleExceed" 
                        :on-change="handleChange"
                        list-type="picture"
                        :on-success="handleAvatarSuccess" 
                        :on-remove="handleRemove" 
                        :before-upload="beforeAvatarUpload">
                            <i class="el-icon-plus"></i>
                            <div slot="tip" class="el-upload__tip input-help ">
                                {{ replaceParamVal("可上传{imageLimit}个 附件每个附件大小不得超过{maxsize}M。附件支持的格式有：{fileAccept}",
                                [ZT_CONFIG.TS_IMAGE_TOTAL_LIMIT,ZT_CONFIG.TS_IMAGE_SIZE_MAX,ZT_CONFIG.TS_IMAGE_ACCEPT]) }}
                            </div>
                        </zt-upload>  
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="loading">提交工单</el-button>
                        <el-button @click="goBack" :disabled="loading">取消</el-button>
                    </zt-form-item>
                </zt-form>
            </div>
        </div>
    </div>
</template>
<script>
import ZTUpload from '@/components/ZTUpload';
import ZT_CONFIG from '@/constants/config';
import {replaceParamVal} from '@/utils/utils';
import { createTicket } from '@/service/ticket';
export default {
    components:{
        'zt-upload': ZTUpload,
    },
    data() {
        let moduleTypes = [
            {
                value: '1', 
                label: '弹性云主机',
                orderTypes: [
                    {value: 10, label: '远程连接'},
                    {value: 11, label: '镜像'},
                    {value: 12, label: '安全组配置'},
                    {value: 13, label: '升降配'},
                    {value: 14, label: '磁盘扩容'},
                    {value: 15, label: '挂载磁盘'},
                ]
            },
            // {value: '2', label: '云数据库RDS',
            //     orderTypes: [
            //         {value: 20, label: '版本/规格'},
            //         {value: 21, label: '只读实例'},
            //         {value: 22, label: '监控与报警'},
            //         {value: 23, label: '日志'},
            //         {value: 24, label: '参数设置'},
            //         {value: 25, label: '备份恢复'}
            //     ]
            // },
            {value: '3', label: '对象存储OSS',
                orderTypes: [
                    {value: 30, label: '文件上传/下载'},
                    {value: 31, label: '读写限制'},
                    {value: 32, label: 'SDK/API'},
                    {value: 33, label: '图片处理服务'},
                    {value: 34, label: '域名/监控'},
                    {value: 35, label: '静态页面'},
                    {value: 36, label: '防盗链'},
                    {value: 37, label: '镜像回源'},
                ]
            },
            {value: '6', label: '专有网络VPC',
                orderTypes: [
                    {value: 60, label: 'VPC使用场景'},
                    {value: 61, label: 'VPC配置'},
                    {value: 62, label: '对等连接'},
                    {value: 63, label: '虚拟防火墙'},
                ]
            },            
        ];
        return {
            ZT_CONFIG,
            replaceParamVal,
            loading : false,
            uploadAction: API_URL + '/fileProcess/upload',
            uploadHeaders: {
                'X-People-Token': this.$store.state.token
            },
            moduleTypes,
            fileList:[],
            ruleForm: {                
                title: '', //工单标题                
                moduleType: '', //产品类型
                orderType: '', //缺陷类型
                orderLevel: 2, //优先级
                orderDesc: '', //问题描述
                resourceId: '', //实例id
                remark: '', //补充描述
                secretInfo: '', //工单描述
                mobile: '',
                email: '', 
                attach:'', //附件文件
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                moduleType: [
                    { required: true, message: '请选择产品类型', trigger: 'change' }
                ],
                orderType: [
                    { required: true, message: '请选择故障类型', trigger: 'change' }
                ],
                orderDesc: [
                    { required: true, message: '请输入问题描述', trigger: 'change' }
                ],
                resourceId: [
                    {required: false, message: '', trigger: 'change' }
                ],              
                secretInfo: [
                    { required: false, message: '', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入正确的邮箱地址', trigger: 'blur' }
                ]
            },
        };
    },
    methods: {
        submitForm(){
            this.$refs['ruleForm'].validate( valid => {
                if (valid) {                   
                    let fileUploadedArr = [];
                    this.fileList.forEach(file => {
                        if (file.remoteFileId) {
                            fileUploadedArr.push(file.remoteFileId);
                        }
                    }); 
                    let { 
                        title,
                        moduleType,
                        orderType,
                        orderLevel,
                        orderDesc,
                        resourceId,
                        remark,
                        secretInfo,
                        mobile,
                        email } = this.ruleForm;
                    let postData = {
                        title,
                        moduleType: moduleType.value,
                        orderType,
                        orderLevel,
                        orderDesc,
                        resourceId,
                        remark,
                        secretInfo,
                        mobile,
                        email,
                        attach:fileUploadedArr.join(',')
                    };
                    this.loading = true;
                    createTicket(postData)
                        .then( res => {
                            this.loading = false;
                            if (res && res.code === this.CODE.SUCCESS_CODE) {

                                this.goBack();                                                                                
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            $log(err);
                        });
                }
            });
        },      

        goBack(){
            return this.$router.push( { name:'app.ticketSystem.myTicket'} );
        },

       

        //文件上传:回调函数======================start=============================
        handleChange(file, fileList) {
            // 先清空，保证错误信息被更新
            // this.fileList = [];
            //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            this.fileList = fileList;
        },
        handlePictureCardPreview(file) {        
        },
        handleAvatarSuccess(res, file, fileList) { 
            this.fileList = fileList;
            if (res.code === '0000') {
                let fileUrls = res.data || [];
                file.remoteFileId = fileUrls[0];                 
            }else{
                file.status = 'fail';
            }
        },
        handleExceed(files, fileList) {
            // let msg = $t('account.Auth.departAuth.material.validator.max');
            this.$message.error('上传材料证明不能多于3张');
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        beforeAvatarUpload(file, showError) {
            console.log(file);

            // const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            const MiB = 1024 * 1024; //1MB 字节大小；
            const isLt8M = file.size < this.ZT_CONFIG.TS_IMAGE_SIZE_MAX * MiB;
            // if (!isJPG) {
            //     let msg = $t('account.Auth.companyAuth.msg.imageAccept');
            //     showError(msg);
            //     //this.$message.error(msg);
            // }
            if (!isLt8M) {
                let msg = $t('account.Auth.imageSizeTip') + this.ZT_CONFIG.TS_IMAGE_SIZE_MAX + $t('abbr.mb');
                showError(msg);
            }
            return isLt8M;
        }
        //文件上传:回调函数======================end=============================
    }
};
</script>
<style lang="scss">
.submitTicket{
    margin: 20px 30px;
    .panel-body{
        padding: 20px 60px;
        .el-form {           
            .el-form-item {
                .el-upload--picture{
                    border:1px dashed #666;
                    width:120px;
                    i {
                        font-size: 40px;
                        font-weight: 700;
                        line-height: 117px;
                    }
                }
                .el-upload__input {
                    display: none !important;
                }
                .avatar-ticket-info {
                    width: 117px;
                    height: 117px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                }                
            }
        }
        .prioritytip {
            font-size: 12px;
            color: #333;
            padding: 10px 20px;
            border: 1px solid #8DACEB;
            background-color: #edf2fc;
            line-height: 1;
        }
        .orderDesc{
            line-height: normal;
        }
        .el-form-item__label{
            font-size: 12px;
        }
    }
    
}
    .el-upload-list--picture .el-upload-list__item.is-success{
        display: inline-block !important;
        width:auto !important;
        margin-right:10px;
    }
</style>


