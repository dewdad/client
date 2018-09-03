<template>
    <div class='companyAuth'>
        <div class='panal-body' v-if="step==0">
            <el-row>
                <el-col :span='24'>
                    <div class="Auth-box">
                        <div class="toFill">
                            <div class="message">
                                <div class="bigTitle text-center">
                                    <i class="iconfont icon-notice_people color-warning"></i>{{$t("account.Auth.companyAuth.contextTitle")}}
                                </div>
                                <!-- <div class="subTitle">{{$t("account.Auth.companyAuth.subtitle")}}</div> -->
                            </div>
                            <zt-form class="show-icon font14" label-width="142px" :model="companyAuth" :rules="rules" size="small" ref="companyAuth" inline-message>
                                <zt-form-item :label='$t("account.Auth.companyAuth.label.companyName")' prop="companyName" :error="companyNameExist"
                                :showPopover="companyAuth.companyName && companyAuth.companyName.length === ZT_CONFIG.INPUT_MAXLENGTH"  
                                :popover="replaceParamVal($t('common.maxlengthWeakTip'),[ZT_CONFIG.INPUT_MAXLENGTH])">
                                    <el-autocomplete v-model="companyAuth.companyName" :maxlength="ZT_CONFIG.INPUT_MAXLENGTH" value-key="companyName" :trigger-on-focus="false" :fetch-suggestions="querySearch" 
                                    :placeholder='$t("account.Auth.companyAuth.placeholder.companyName")' auto-complete="off" :debounce="300" @focus="clearValidate('companyName')" @select="handleSelect">
                                    </el-autocomplete>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.companyAuth.label.area")' prop="area">
                                    <linkage-area @select="getAreaData" :originData="areaInfo" size=""></linkage-area>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.companyAuth.label.creditCode")' prop="creditCode" 
                                :showPopover="companyAuth.creditCode && (companyAuth.creditCode.length === ZT_CONFIG.BUSINESS_LICENSE_NO_LENGTH)"  
                                :popover="replaceParamVal($t('common.maxlengthWeakTip'),[ZT_CONFIG.BUSINESS_LICENSE_NO_LENGTH])">
                                    <el-input :maxlength="ZT_CONFIG.BUSINESS_LICENSE_NO_LENGTH" v-model="companyAuth.creditCode" :placeholder='$t("account.Auth.companyAuth.placeholder.creditCode")' auto-complete="off"></el-input>
                                </zt-form-item>
                                <zt-form-item :label='$t("account.Auth.companyAuth.label.bankName")' prop="bankName" 
                                :showPopover="companyAuth.bankName && companyAuth.bankName.length === ZT_CONFIG.INPUT_MAXLENGTH"  
                                :popover="replaceParamVal($t('common.maxlengthWeakTip'),[ZT_CONFIG.INPUT_MAXLENGTH])">
                                    <el-input :maxlength="ZT_CONFIG.INPUT_MAXLENGTH" v-model="companyAuth.bankName" :placeholder='$t("account.Auth.companyAuth.placeholder.bankName")' auto-complete="off"></el-input>
                                </zt-form-item>

                                <zt-form-item :label='$t("account.Auth.companyAuth.label.bankAcctNo")' prop="bankAcctNo" has-help
                                :showPopover="companyAuth.bankAcctNo && companyAuth.bankAcctNo.length === ZT_CONFIG.COMPANY_ACCOUNT_LENGTH"  
                                :popover="replaceParamVal($t('common.maxlengthWeakTip'),[ZT_CONFIG.COMPANY_ACCOUNT_LENGTH])"
                                class="mb0">
                                    <el-input :maxlength="ZT_CONFIG.COMPANY_ACCOUNT_LENGTH" v-model="companyAuth.bankAcctNo" :placeholder='$t("account.Auth.companyAuth.placeholder.bankAcctNo")' auto-complete="off"></el-input>  
                                    <!-- <div class="input-help">{{$t("account.Auth.companyAuth.tips.bankAcctNo")}}</div>                                                                     -->
                                </zt-form-item>
                                <zt-form-item>
                                    <div class="input-help">{{$t("account.Auth.companyAuth.tips.bankAcctNo")}}</div>    
                                </zt-form-item>
                                
                                <zt-form-item :label='$t("account.Auth.companyAuth.label.companyLicense")' prop="fileList" :error="companyLicenseError">
                                    <zt-upload class="avatar-uploader" ref="upload" :file-list="fileList" :accept="ZT_CONFIG.IMAGE_ACCEPT" :action="uploadAction" list-type="picture-card" :on-change="handleChange" :on-remove="handleRemove" :on-success="handleAvatarSuccess" :on-progress="handleProgress" :before-upload="beforeAvatarUpload">
                                        <i class="el-icon-plus"></i>
                                        <div slot="tip" class="font12 color999">{{replaceParamVal($t("account.Auth.companyAuth.tips.companyLicense"),[ZT_CONFIG.IMAGE_SIZE_MAX])}}</div>
                                    </zt-upload>
                                </zt-form-item>
                                <zt-form-item>
                                    <el-button size="medium" @click="next" type="warning" long>{{ $t('common.next') }}</el-button>
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
                                <span>{{$t("account.Auth.companyAuth.alterTips")}}</span>
                            </div>

                            <div class="zt-info">
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.authType")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{$t("account.Auth.companyAuth.companyAuthTitle")}}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.companyAuth.label.companyName")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{ companyAuth.companyName }}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.companyAuth.label.area")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{ (municipalitys.includes(companyAuth.province)?'':companyAuth.province) + companyAuth.city + companyAuth.area }}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.companyAuth.label.creditCode")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{companyAuth.creditCode}}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.companyAuth.label.bankName")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{companyAuth.bankName}}</div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.companyAuth.label.bankAcctNo")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>{{companyAuth.bankAcctNo}}</div>
                                    </el-col>
                                </el-row>
                                <el-row v-if="fileList.length > 0">
                                    <el-col :span="12" class="text-right">
                                        <div class="pr20">{{$t("account.Auth.companyAuth.companyLicense")+"："}}</div>
                                    </el-col>
                                    <el-col :span="12" class="text-center">
                                        <img v-for="(img,index) in fileList" :src="img.url" :key='index' class="avatar">
                                    </el-col>
                                </el-row>

                                <el-row class="mt20">
                                    <el-col :span="12" class="text-right">
                                        <el-button @click="prev" :disabled="saveLoading" class="authBtn" type="prev">{{ $t('common.pre') }}</el-button>
                                    </el-col>
                                    <el-col :span="12" class="pl10">
                                        <el-button :loading="saveLoading" :disabled="saveLoading" @click="submit" class="authBtn" type="warning">{{ $t('common.submit') }}</el-button>
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
import LinkageArea from '@/components/linkageArea/LinkageArea';
import {API_UserAccount} from '@/constants/apiUrl';
import ZT_CONFIG from '@/constants/config';
import {userAuthApply, getUserAuthCompanyList} from '@/service/user.js';
import {mapGetters} from 'vuex';
import {replaceParamVal} from '@/utils/utils';

//import VDistpicker from 'v-distpicker';
export default {
    name: 'app',
    components: {
        'zt-upload': ZTUpload,
        SingleHeader,
        SingleFooter,
        LinkageArea
        //VDistpicker,
    },
    data() {
        //验证企业注册地区
        const ValidateArea = (rule, value, callback) => {
            if (this.companyAuth.province === '' || this.companyAuth.city === '') {
                callback(new Error(this.$t('account.Auth.companyAuth.validator.area.required')));
            } else {
                callback();
            }
        };
        //验证同一社会信用代码
        const ValidateCreditCode = (rule, value, callback) => {
            let creditCodeReg = /[A-Za-z0-9]{18}/g;
            if (value && !creditCodeReg.test(value)) {
                callback(new Error(this.$t('account.Auth.companyAuth.validator.creditCode.maxlength')));
            } else {
                callback();
            }
        };
        //验证对公账号
        const ValidateBankAcctNo = (rule, value, callback) => {
            let bankAcctNoReg = /[0-9]{1,30}/g;
            if (value && !bankAcctNoReg.test(value)) {
                callback(new Error(this.$t('account.Auth.companyAuth.validator.bankAcctNo.error')));
            } else {
                callback();
            }
        };
        //验证材料
        const validateMaterial = (rule, value, callback) => {
            console.log(this.fileList.length === 0);
            if (this.fileList.length === 0) {
                return callback(new Error(this.$t('account.Auth.companyAuth.validator.companyLicense.required')));
            }
            let isAllFileUploaded = this.fileList.every(file => !!file.remoteFileId);
            if (!isAllFileUploaded) {
                return callback($t('account.Auth.departAuth.material.validator.error'));
            }
            callback();
        };
        // 已认证企业重名校验
        const existCompanyName = (rule, value, callback) => {
            let isExistCompany = this.certifiedEnterprises.some(ce => {
                return this.companyAuth.companyName === ce.companyName; 
            });
            if(isExistCompany){ 
                return callback($t('account.Auth.companyAuth.companyNameExist'));
            }
            callback();
        };
        return {
            ZT_CONFIG,
            replaceParamVal,
            step: 0,
            imageUrl: '',
            fileList: [],
            areaInfo: {},
            saveLoading: false,
            certifiedEnterprises: [], //已认证企业
            fileobj: {}, //上传文件
            disabledNext: true,
            dialogImageUrl: '',
            dialogVisible: false,
            CreditCodeIsError: true,
            companyNameExist:'', //企业名称已认证
            companyLicenseIsError: true,
            bankAcctNoError: true,
            uploadAction: API_URL + '/' + API_UserAccount.uploadFile,
            municipalitys:['北京','上海','天津','重庆','香港','澳门'], //直辖市以及特别行政区
            // companyLicenseError:'',
            companyAuth: {
                companyType: '3', //企业性质： 1：政府机关； 2：事业单位； 3：企业;
                area: '',
                province: '',
                city: '',
                companyName: '',
                creditCode: '',
                bankAcctNo: '',
                companyLicense: '',
                companyLicenseUrl: ''
            },
            rules: {
                area: [{validator: ValidateArea, required: true, trigger: ['submit']}],
                companyName: [
                    {
                        required: true,
                        message: this.$t('account.Auth.companyAuth.validator.companyName.required'),
                        trigger: ['submit']
                    },
                    {
                        validator: existCompanyName,
                        trigger: ['submit']
                    }
                ],
                creditCode: [
                    {
                        required: true,
                        message: this.$t('account.Auth.companyAuth.validator.creditCode.required'),
                        trigger: ['submit']
                    },
                    {
                        min: ZT_CONFIG.BUSINESS_LICENSE_NO_LENGTH, //18
                        max: ZT_CONFIG.BUSINESS_LICENSE_NO_LENGTH,
                        message: this.$t('account.Auth.companyAuth.validator.creditCode.maxlength'),
                        trigger: 'blur'
                    },
                    {validator: ValidateCreditCode, trigger: 'blur'}
                ],
                bankName: [
                    {
                        required: true,
                        message: this.$t('account.Auth.companyAuth.validator.bankName.required'),
                        trigger: ['submit']
                    },
                    {
                        max: ZT_CONFIG.INPUT_MAXLENGTH,
                        message: this.$t('account.Auth.companyAuth.validator.bankName.maxlength'),
                        trigger: 'blur'
                    }
                ],
                bankAcctNo: [
                    {
                        required: true,
                        message: this.$t('account.Auth.companyAuth.validator.bankAcctNo.required'),
                        trigger: ['submit']
                    },
                    {
                        //min: ZT_CONFIG.COMPANY_ACCOUNT_LENGTH, //19
                        max: ZT_CONFIG.COMPANY_ACCOUNT_LENGTH,
                        message: this.$t('account.Auth.companyAuth.validator.bankAcctNo.maxlength'),
                        trigger: 'blur'
                    },
                    {validator: ValidateBankAcctNo, trigger: 'blur'}
                ],
                fileList: [{validator: validateMaterial, required: true, trigger: ['change', 'submit']}]
            }
            //headers: {'X-People-Token': this.$store.state.token}
        };
    },
    computed: {
        ...mapGetters(['token', 'userInfo']),
        companyLicenseError() {
            let item = this.fileList.find(e => e.status === 'fail' && !! e.errorMessage);
            return item ? item.errorMessage : '';
        }
    },
    created() {
        this.searchCertifedEnterprise();
    },
    methods: {
        prev() {
            this.step = 0;
            console.log('this.areaInfo', this.areaInfo);
        },
        next() {
            this.$refs['companyAuth'].validate(valid => {
                if (valid) {
                    this.step = 1;
                    let {province, city, area} = this.companyAuth;
                    this.areaInfo = {province, city, area};
                } else {
                    return false;
                }
            });
        },

        //企业地址组件：选择地址后回调
        getAreaData({province, city, area}) {
            Object.assign(this.companyAuth, {province, city, area});
            $log('this.companyAuth', this.companyAuth);
            this.clearValidate('area');
        },

        //==============企业名称:==================start=======
        //查询已认证企业
        searchCertifedEnterprise() {
            //后台查询
            let data = {
                //limit:10,
                pageIndex: 1,
                //companyName:'',
                status: 2 //已认证
            };
            getUserAuthCompanyList(data)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        this.certifiedEnterprises = res.result || [];
                    }
                })
                .catch(err => {
                    // 显示异常
                    this.$message.error(err);
                });

            // //测试数据
            // return this.certifiedEnterprises = [
            //     { uid:1,companyName:'人民网股份有限公司'},
            //     { uid:2,companyName:'人民网湖南分公司股份有限公司'},
            //     { uid:3,companyName:'人民网北京总部'}
            // ];
        },
        //查询过滤
        querySearch(queryString, cb) {
            if (queryString && queryString.length >= 3) {
                let certEprs = this.certifiedEnterprises || [];
                let results = queryString
                    ? certEprs.filter(certEpr => {
                        let companyName = certEpr.companyName.toLowerCase();
                        return companyName.indexOf(queryString.toLowerCase()) > -1;
                    })
                    : certEprs;
                // 调用 callback 返回建议列表的数据
                cb(results);
            } else {
                cb([]);
            }
        },
        //企业名称选择
        handleSelect(item) {
            console.log(item);
            //弹出企业名称已经认证弹窗
            const h = this.$createElement;
            let message = h('div', null, [
                h('div', {props: {type: 'warning', closable: false}}, [
                    h('p', {
                        attr: {slot: 'description'},
                        domProps: {
                            innerHTML: replaceParamVal($t('account.Auth.companyAuth.dlg.context'), [item.companyName])
                        }
                    })
                ])
            ]);
            this.$confirm(message, $t('common.tip'), {
                type: 'warning'
            })
                .then(() => {
                    //确定： 部门认证
                    this.$router.push({name: 'auth.departAuth', params: {id: item.uid, item: item}});
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log($t('common.cancel'));
                    }
                });
        },
        //============企业名称================================end=========

        //提交
        submit() {
            this.companyAuth.companyLicenseUrl = this.fileList[0].remoteFileId;
            //实名认证申请
            let {companyType, province, city, area, companyName, companyLicenseUrl, bankName, bankAcctNo, creditCode} = this.companyAuth;
            let postdata = {
                companyType,
                province,
                city,
                area,
                companyName,
                companyLicenseUrl,
                bankName,
                bankAcctNo,
                companyLicense: creditCode,
                uid: this.userInfo.uid
            };
            this.saveLoading = true;
            userAuthApply(postdata)
                .then(res => {
                    this.saveLoading = false;
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        // this.userInfo.authStatus = 1;
                        let usrinfo = Object.assign({}, this.userInfo);
                        usrinfo.authStatus = 1;
                        this.$store.commit('user/SET_USERINFO', usrinfo);
                        this.$router.push({name: 'accountMg.auth'});
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    // 显示异常
                    this.saveLoading = false;
                    this.$message.error(this.$t('exception.server'));
                });
        },
        clearValidate(field) {
            this.$refs['companyAuth'].clearValidate(field);
        },

        //文件上传:回调函数======================start=============================
        handleChange(file, fileList) {
            this.fileList = [];
            //文件选择、上传文件成功或者文件删除成功
            this.fileList = [file];
        },
        handleRemove(file, fileList) {
            //删除文件
            this.fileList = [];
        },
        handlePreview(file) {
            //文件上传成功后 预览
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleAvatarSuccess(res, file, fileList) {
            //文件上传成功
            this.clearValidate('fileList');
            if (res && res.result) {                
                file.remoteFileId = res.result || '';
                this.fileList = [file];
                this.disabledNext = false;
            } else {
                this.disabledNext = true;
                //status:'uploading','fail','ready','success'
                file.status = 'fail';
            }
        },
        handleProgress(event, file, fileList) {
            //当前上传的文件上传进度
            this.fileList = [file];
        },
        beforeAvatarUpload(file, callback) {
            //文件上传之前
            console.log(this.uploadAction);
            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            let mb = 1024 * 1024; //1MB 字节大小；
            const isLt8M = file.size < this.ZT_CONFIG.IMAGE_SIZE_MAX * mb;           
            if (!isJPG) {
                let msg = $t('account.Auth.companyAuth.msg.imageAccept');
                callback(msg);
                // this.companyLicenseError = msg;
                //this.$message.error(msg);
            }
            if (!isLt8M) {
                let msg = $t('account.Auth.imageSizeTip') + this.ZT_CONFIG.IMAGE_SIZE_MAX + $t('abbr.mb');
                callback(msg);
                // this.companyLicenseError = msg;
                //this.$message.error(msg);
            }
            return isJPG && isLt8M;
        }
        //文件上传:回调函数======================end=============================
    }
};
</script>
<style scoped lang='scss'>
.pr10 {
    padding-right: 10px;
}
.pr20 {
    padding-right: 20px;
}

.pl10 {
    padding-left: 10px;
}
.authBtn {
    width: 180px;
    height: 38px;
    text-align: center;
}
.icon-notice_people:before {
    content: '\e6b6';
    padding: 10px;
}
.upload.el-form-item__label:before {
    float: right;
    content: '*';
    color: #f56c6c;
    padding-left: 10px;
}
img {
    border: 0;
    width: 117px;
}

.el-upload--picture-card i {
    font-size: 40px;
    font-weight: 700;
    line-height: 117px;
}
.bigTitle2 {
    height: 60px;
    font-size: 16px;
    line-height: 60px;
    background-color: #f9fafd;
    border: solid 1px #dde6f4;
}
// .el-upload-list__item.is-fail .el-upload-list__item-status-label {
//     display: block;
// }

// .el-upload-list__item.is-fail .el-upload-list__item-status-label {
//     position: absolute;
//     right: -15px;
//     top: -6px;
//     width: 40px;
//     height: 24px;
//     background: #13ce66;
//     text-align: center;
//     -webkit-transform: rotate(45deg);
//     transform: rotate(45deg);
//     -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
//     box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
// }

.el-upload-list--picture-card .el-progress {
    top: 88%;
}
</style>
