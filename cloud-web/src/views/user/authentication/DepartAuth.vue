<template>
    <div class='departAuth'>
        <div class='panal-body' v-if="step==0">
            <el-row>
                <el-col :span='24'>
                    <div class="Auth-box">
                        <div class="toFill">
                            <div class="message">
                                <div class="img-text-center bigTitle text-center">
                                    <i class="iconfont icon-notice_people color-warning"></i>{{$t("account.Auth.companyAuth.contextTitle")}}</div>
                                <!-- <div class="subTitle ">{{$t("account.Auth.departAuth.subtitle")}} </div> -->
                            </div>
                            <zt-form label-width="128px" size="small" class="show-icon font14" :model="departAuth" :rules="rules" ref="departAuth" inline-message>
                                <zt-form-item :label='$t("account.Auth.departAuth.companyName.label")' prop="companyName" hide-success-icon>
                                    <span>{{departAuth.companyName}}</span>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.departAuth.companyDept.label")' prop="companyDept">
                                    <el-input :maxlength="ZT_CONFIG.INPUT_MAXLENGTH" v-model="departAuth.companyDept" :placeholder='$t("account.Auth.departAuth.companyDept.placeholder")' auto-complete="off"></el-input>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.departAuth.contact.label")' prop="contact">
                                    <el-input :maxlength="ZT_CONFIG.INPUT_MAXLENGTH" v-model="departAuth.contact" :placeholder='$t("account.Auth.departAuth.contact.placeholder")' auto-complete="off"></el-input>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.departAuth.tel.label")' prop="tel">
                                    <el-input :maxlength="ZT_CONFIG.MOBLIE_NUMBER_MAX" v-model="departAuth.tel" :placeholder='$t("account.Auth.departAuth.tel.placeholder")' auto-complete="off"></el-input>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.departAuth.material.label")' prop="fileList" :error="uploadErrorMessage">
                                    <zt-upload multiple ref="upload" :action="uploadAction" :limit="ZT_CONFIG.IMAGE_TOTAL_LIMIT" :file-list="fileList" :on-exceed="handleExceed" :on-change="handleChange" list-type="picture-card" :on-success="handleAvatarSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
                                        <i class="el-icon-plus"></i>
                                        <div slot="tip" class="el-upload__tip input-help ">
                                            {{ replaceParamVal( $t("account.Auth.departAuth.material.note"),[ZT_CONFIG.IMAGE_SIZE_MAX,ZT_CONFIG.IMAGE_TOTAL_LIMIT] )}}
                                        </div>
                                    </zt-upload>

                                    <!-- 图片放大预览 -->
                                    <!-- <el-dialog :visible.sync="dialogVisible">
                                        <img :src="dialogImageUrl" alt="">
                                    </el-dialog> -->
                                </zt-form-item>
                                <zt-form-item>
                                    <el-button size="medium" :disbaled="disabledNext" @click="next" type="warning" long>{{ $t('common.next') }}</el-button>
                                </zt-form-item>
                            </zt-form>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class='panal-body-info' v-else-if="step==1">
            <el-row>
                <el-col :span='24'>
                    <div class="Auth-box">
                        <div class="toFill">
                            <div class="bigTitle2 text-center">
                                <span>{{$t("account.Auth.departAuth.tips")}}</span>
                            </div>

                            <div class="zt-info">
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.departAuth.companyName.label")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{departAuth.companyName}}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.authType")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{$t("account.Auth.departAuth.departAuthTitle")}}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.departAuth.companyDept.label")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{departAuth.companyDept}}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.departAuth.contact.label")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{ departAuth.contact }}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.departAuth.tel.label")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{ departAuth.tel }}</div>
                                    </el-col>
                                </el-row>

                                <div  v-if="fileList.length > 0" class="text-center" style="width:381px;margin:0 auto;">
                                    <img v-for="(img,index) in fileList" :src="img.url" class="avatar-dept-info" :key="index">

                                </div>

                                <el-row :class="{mt10: fileList.length > 0}">
                                    <el-col :span="12" class="text-right pr10">
                                        <el-button @click="prev" size="medium" :disabled="saveLoading" class="authBtn" type="prev">{{ $t("common.pre") }}</el-button>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-button @click="submit" size="medium" :loading="saveLoading" :disabled="saveLoading" class="authBtn" type="warning">{{ $t("common.submit") }}</el-button>
                                    </el-col>
                                </el-row>

                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import ZTUpload from '@/components/ZTUpload';
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import {API_UserAccount} from '@/constants/apiUrl';
import {userAuthApply, getUserAuthInfo} from '@/service/user.js';
import {MOBILE_REGEXP, USERNAME_REGEXP} from '@/constants/regexp.js';
import ZT_CONFIG from '@/constants/config';
import {mapGetters} from 'vuex';
import {replaceParamVal, removeClass} from '@/utils/utils';
export default {
    name: 'app',
    components: {
        SingleHeader,
        SingleFooter,
        'zt-upload': ZTUpload
    },
    data() {
        const validateMaterial = (rule, value, callback) => {            
            if (this.fileList.length > 0) {
                //产品回复：要不就直接带着成功的图片一起进下一步，要不就提示：请删除或重新上传失败图片。二选一
                let isAllFileUploaded = this.fileList.every(file => !!file.remoteFileId);
                if (!isAllFileUploaded) {
                    //请删除或重新上传失败图片
                    return callback($t('account.Auth.departAuth.material.validator.error'));
                }
            }
            callback();
        };
        let stateParams = this.$route.params;
        let companyobj = stateParams.item || {};

        return {
            stateParams,
            ZT_CONFIG,
            replaceParamVal,
            step: 0,
            saveLoading: false,
            uploadAction: API_URL + '/' + API_UserAccount.uploadFile,
            fileList: [],
            disabledNext: true,
            dialogImageUrl: '',
            materialError: '',
            departAuth: {
                companyName: companyobj.companyName,
                companyDept: '',
                contact: '',
                tel: '',
                material: ''
            },
            rules: {
                companyName: [
                    {
                        required: true,
                        message: $t('account.Auth.departAuth.companyName.required'),
                        trigger: ['submit']
                    },
                    {
                        max: ZT_CONFIG.INPUT_MAXLENGTH,
                        message: $t('account.Auth.departAuth.companyName.validator.max'),
                        trigger: 'blur'
                    }
                ],
                companyDept: [
                    {
                        required: true,
                        message: $t('account.Auth.departAuth.companyDept.validator.required'),
                        trigger: ['submit']
                    },
                    {
                        max: ZT_CONFIG.INPUT_MAXLENGTH,
                        message: $t('account.Auth.departAuth.companyDept.validator.max'),
                        trigger: 'blur'
                    }
                ],
                tel: [
                    {
                        required: true,
                        message: $t('account.Auth.departAuth.tel.validator.required'),
                        trigger: ['submit']
                    },
                    {
                        pattern: MOBILE_REGEXP,
                        message: $t('account.Auth.departAuth.tel.validator.pattern'),
                        trigger: ['blur']
                    }
                ],
                contact: [
                    {
                        required: true,
                        message: $t('account.Auth.departAuth.contact.validator.required'),
                        trigger: ['submit']
                    },
                    {
                        max: ZT_CONFIG.INPUT_MAXLENGTH,
                        message: $t('account.Auth.departAuth.contact.validator.max'),
                        trigger: 'blur'
                    },
                    {
                        pattern: USERNAME_REGEXP,
                        message: $t('account.Auth.departAuth.contact.validator.pattern'),
                        trigger: ['blur']
                    }
                ],
                fileList: [{validator: validateMaterial, trigger: 'submit'}]
            }
            //headers: {'X-People-Token': this.$store.state.token}
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        /**
         * 计算上传失败错误信息
         */
        uploadErrorMessage() {
            let item = this.fileList.find(e => e.status === 'fail' && !! e.errorMessage);
            return item ? item.errorMessage : '';
        }
    },
    watch: {
        step: function() {
            removeClass(document.querySelector('.footer'), 'fixed');
            this.$store.commit('SET_RESIZE');
            window.scrollTo(0, 0);
        },
        fileList: function(newval, oldval) {
            let time = 0;
            if (newval.length < oldval.length) {
                time = 600;
            }
            window.setTimeout(() => {
                removeClass(document.querySelector('.footer'), 'fixed');
                this.$store.commit('SET_RESIZE');
            }, time);
        }
    },
    created() {
        if (this.stateParams && this.stateParams.item) {
        } else {
            this.getUserAuthInfo(this.stateParams.id);
        }
    },
    methods: {
        prev() {
            this.step = 0;
        },
        next() {
            this.$refs['departAuth'].validate(valid => {
                if (valid) {                   
                    let isAllFileUploaded = this.fileList.every(file => !!file.remoteFileId);
                    if (isAllFileUploaded) {
                        this.step = 1;
                    }
                } else {
                    return false;
                }
            });
        },
        //查询已认证企业
        //查用户认证详情：获取已认证企业名称
        getUserAuthInfo(uid) {
            getUserAuthInfo(uid).then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.result;
                    this.departAuth.companyName = resData.companyName;
                }
            });
        },
        submit() {
            let {companyName, companyDept, contact, tel} = this.departAuth;
            let fileUploadedArr = [];
            this.fileList.forEach(file => {
                if (file.remoteFileId) {
                    fileUploadedArr.push(file.remoteFileId);
                }
            });
            let postdata = {
                fUid: this.stateParams.id, //已认证企业对应的uid
                uid: this.userInfo.uid, //登录用户uid
                companyName,
                companyDept,
                contactName: contact,
                contactPhone: tel,
                companyLicenseUrl: fileUploadedArr.join(',')
            };
            userAuthApply(postdata)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        let usrinfo = Object.assign({}, this.userInfo);
                        usrinfo.authStatus = 1;
                        this.$store.commit('user/SET_USERINFO', usrinfo);
                        this.$router.push({name: 'accountMg.auth'});
                    }
                })
                .catch(err => {
                    // 显示异常
                    this.$message.error(err);
                });
        },
        clearValidate(field) {
            this.$refs['departAuth'].clearValidate(field);
        },

        //文件上传:回调函数======================start=============================
        handleChange(file, fileList) {
            // 先清空，保证错误信息被更新
            this.fileList = [];
            //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            this.fileList = fileList;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            //this.dialogVisible = true;
        },
        handleAvatarSuccess(res, file, fileList) {
            // this.clearValidate('fileList');
            if (res && res.result) {               
                file.remoteFileId = res.result || '';
                this.fileList = fileList;
                //fileList.every( (file) => !!file.remoteFileId) && (this.step = 1);
                this.disabledNext = false;
            } else {
                this.disabledNext = true;
                file.status = 'fail';
            }
        },
        handleExceed(files, fileList) {
            let msg = $t('account.Auth.departAuth.material.validator.max');
            this.$message.error(msg);
            // this.materialError = msg;
            //this.$alert(msg);
            //this.$alert(`限制选择 ${this.ZT_CONFIG.IMAGE_TOTAL_LIMIT} 个文件，当前已选择了 ${files.length + fileList.length} 个文件`);
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        beforeAvatarUpload(file, showError) {
            console.log(file);

            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            const MiB = 1024 * 1024; //1MB 字节大小；
            const isLt8M = file.size < this.ZT_CONFIG.IMAGE_SIZE_MAX * MiB;
            if (!isJPG) {
                let msg = $t('account.Auth.companyAuth.msg.imageAccept');
                showError(msg);
                //this.$message.error(msg);
            }
            if (!isLt8M) {
                let msg = $t('account.Auth.imageSizeTip') + this.ZT_CONFIG.IMAGE_SIZE_MAX + $t('abbr.mb');
                showError(msg);
            }
            return isJPG && isLt8M;
        }
        //文件上传:回调函数======================end=============================
    }
};
</script>
<style scoped lang='scss'>
.avatar {
    width: 117px;
    height: 117px;
    margin-right: 20px;
    margin-top: 20px;
}
.el-message--warning .el-message__content {
    color: #fff;
}
.el-message--warning {
    background-color: #fff;
    border-color: #fff;
}

.pr10 {
    padding-right: 10px;
}
.pr20 {
    padding-right: 20px;
}

.pl10 {
    padding-left: 10px;
}

.el-upload--picture-card i {
    font-size: 40px;
    font-weight: 700;
    line-height: 117px;
}
.avatar-dept-info {
    width: 117px;
    height: 117px;
    margin-right: 10px;
    margin-bottom: 10px;
}

.departAuth {
    .Auth-box {
        .toSub {
            .inform-box {
                font-size: 14px;
                width: 620px;
                margin: auto;
                padding: 45px 20px;
                .authBtn {
                    width: 100%;
                    height: 38px;
                    text-align: center;
                }
            }
        }
    }
}

.zt-info {
    .el-row {
        line-height: 1;
        margin-bottom: 20px;
    }
}
</style>
