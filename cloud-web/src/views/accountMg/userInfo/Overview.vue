<template>
    <div class="page-body userInfosetting">
        <page-header class="no-border">
            <span class="font18">{{ $t('basicInfo.basicInfo') }}</span>
        </page-header>
        <div class="userInfo">
            <zt-form ref="userInfo" v-loading.lock="fullscreenLoading" size="small" :model="PeopleUserInfo" label-width="115px" :rules="rules" inline-message>
                <!-- 基本信息 -->
                <div class="userInfoBox">
                    <div class="item-title">{{ $t('basicInfo.basicMessage') }}</div>
                    <zt-form-item :label="$t('basicInfo.companyName')">
                        {{comName}}
                    </zt-form-item>
                    <!-- 营业年限 -->
                    <zt-form-item :label="$t('basicInfo.businessLife')">
                        <el-select clearable v-model="PeopleUserInfo.comAge" placeholder="" popper-class="el-popper--small">
                            <el-option :label="$t('basicInfo.comAgeData.one')" :value="$t('basicInfo.comAgeData.one')"></el-option>
                            <el-option :label="$t('basicInfo.comAgeData.two')" :value="$t('basicInfo.comAgeData.two')"></el-option>
                            <el-option :label="$t('basicInfo.comAgeData.three')" :value="$t('basicInfo.comAgeData.three')"></el-option>
                            <el-option :label="$t('basicInfo.comAgeData.four')" :value="$t('basicInfo.comAgeData.four')"></el-option>
                            <el-option :label="$t('basicInfo.comAgeData.five')" :value="$t('basicInfo.comAgeData.five')"></el-option>
                            <el-option :label="$t('basicInfo.comAgeData.six')" :value="$t('basicInfo.comAgeData.six')"></el-option>
                        </el-select>
                    </zt-form-item>
                    <!-- 企业规模 -->
                    <zt-form-item :label="$t('basicInfo.companyScale')">
                        <el-select clearable v-model="PeopleUserInfo.comScale" placeholder="" popper-class="el-popper--small">
                            <el-option :label="$t('basicInfo.comScaleData.one')" :value="$t('basicInfo.comScaleData.one')"></el-option>
                            <el-option :label="$t('basicInfo.comScaleData.two')" :value="$t('basicInfo.comScaleData.two')"></el-option>
                            <el-option :label="$t('basicInfo.comScaleData.three')" :value="$t('basicInfo.comScaleData.three')"></el-option>
                            <el-option :label="$t('basicInfo.comScaleData.four')" :value="$t('basicInfo.comScaleData.four')"></el-option>
                            <el-option :label="$t('basicInfo.comScaleData.five')" :value="$t('basicInfo.comScaleData.five')"></el-option>
                        </el-select>
                    </zt-form-item>
                    <!-- 企业性质 -->
                    <zt-form-item :label="$t('basicInfo.companyNature')">
                        <el-select clearable v-model="PeopleUserInfo.comNature" placeholder="" popper-class="el-popper--small">
                            <el-option :label="$t('basicInfo.comNatureData.one')" :value="$t('basicInfo.comNatureData.one')"></el-option>
                            <el-option :label="$t('basicInfo.comNatureData.two')" :value="$t('basicInfo.comNatureData.two')"></el-option>
                            <el-option :label="$t('basicInfo.comNatureData.three')" :value="$t('basicInfo.comNatureData.three')"></el-option>
                            <el-option :label="$t('basicInfo.comNatureData.four')" :value="$t('basicInfo.comNatureData.four')"></el-option>
                        </el-select>
                    </zt-form-item>
                </div>
                <!-- 业务信息 -->
                <div class="userInfoBox">
                    <div class="item-title" style="margin-bottom: 8px;">{{ $t('basicInfo.businessInfo') }}</div>
                    <!-- 营业范围 -->
                    <zt-form-item :label="$t('basicInfo.businessScope')" clearable prop=''>
                        <el-select clearable v-model="PeopleUserInfo.mainBusinness" placeholder="" popper-class="el-popper--small">
                            <el-option :label="$t('basicInfo.mainBusinnessData.one')" :value="$t('basicInfo.mainBusinnessData.one')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.two')" :value="$t('basicInfo.mainBusinnessData.two')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.three')" :value="$t('basicInfo.mainBusinnessData.three')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.four')" :value="$t('basicInfo.mainBusinnessData.four')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.five')" :value="$t('basicInfo.mainBusinnessData.five')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.six')" :value="$t('basicInfo.mainBusinnessData.six')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.seven')" :value="$t('basicInfo.mainBusinnessData.seven')"></el-option>
                            <el-option :label="$t('basicInfo.mainBusinnessData.eight')" :value="$t('basicInfo.mainBusinnessData.eight')"></el-option>
                        </el-select>
                    </zt-form-item>
                    <!-- 主营业务 -->
                    <zt-form-item :label="$t('basicInfo.mainBusiness')" :popover="$t('basicInfo.lengthTip')" :showPopover="!!PeopleUserInfo.majorapp && PeopleUserInfo.majorapp.length === 100">
                        <el-input clearable :maxlength="100" v-model="PeopleUserInfo.majorapp"></el-input>
                    </zt-form-item>
                    <!-- 网址 -->
                    <zt-form-item :label="$t('basicInfo.website')" prop='website'>
                        <el-input clearable :maxlength="100" v-model="PeopleUserInfo.website " :placeholder="$t('basicInfo.websiteTip')"></el-input>
                    </zt-form-item>
                </div>
                <!-- 联系信息 -->
                <div class="userInfoBox">
                    <div class="item-title">{{ $t('basicInfo.contactInfo') }}</div>
                    <!-- 所在地区 -->
                    <zt-form-item :label="$t('basicInfo.localArea')">
                        <linkage-area size="small" v-if="!fullscreenLoading" :originData="areaInfo" @select="getAreaData"></linkage-area>
                    </zt-form-item>
                    <!-- 地址 -->
                    <zt-form-item :label="$t('basicInfo.address')" prop='detailAddr' :popover="$t('basicInfo.lengthTip')" :showPopover="PeopleUserInfo.detailAddr && PeopleUserInfo.detailAddr.length === 100">
                        <el-input clearable :maxlength="100" v-model="PeopleUserInfo.detailAddr"></el-input>
                    </zt-form-item>
                    <!-- 联系电话 -->
                    <zt-form-item :label="$t('basicInfo.contactPhone')" prop='telephone'>
                        <el-input clearable v-model="PeopleUserInfo.telephone " :placeholder="$t('basicInfo.phoneTip')"></el-input>
                    </zt-form-item>
                    <!-- 传真 -->
                    <zt-form-item :label="$t('basicInfo.fax')" prop='fax'>
                        <el-input clearable v-model="PeopleUserInfo.fax" :placeholder="$t('basicInfo.phoneTip')"></el-input>
                    </zt-form-item>
                    <zt-form-item class="text-right">
                        <el-button size="medium" type="primary" @click="saveInfo">{{ $t('common.keep') }}</el-button>
                    </zt-form-item>
                </div>

            </zt-form>
        </div>
    </div>
</template>
<script>
import VDistpicker from 'v-distpicker';
import LinkageArea from '@/components/linkageArea/LinkageArea';
import {saveUserInfo} from '@/service/user.js';
import {getUserInfoDetail, updateUserInfoDetail} from '@/service/user';
import {mapGetters} from 'vuex';
export default {
    data() {
        // const MOBILE_REGEXP = /0\d{2,3}-\d{8,9}/;
        const MOBILE_REGEXP = /^((0?1[358]\d{9})|(0\d{2,3}-\d{8,9}))$/; // 电话号码验证正则
        const wEBSITE_REGEXP = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~/])+$/;

        return {
            comName: '',
            PeopleUserInfo: {
                city: '',
                comAge: '',
                comScale: '',
                comNature: '',
                detailAddr: '',
                fax: '',
                id: '',
                fullscreenLoading: false,
                userInfoType: false, // 判断初始基本资料是否为空
                mainBusinness: '',
                majorapp: '',
                province: '',
                telephone: '',
                uid: '',
                website: '',
                area: '',
                zoom: ''
            },
            rules: {
                mainBusinness: [
                    {
                        required: true,
                        message: this.$t('account.baseInfo.mainBusinnessIsEmpty'),
                        trigger: ['blur']
                    }
                ],
                website: [
                    {
                        pattern: wEBSITE_REGEXP,
                        message: this.$t('account.baseInfo.websiteIsError'),
                        trigger: ['blur']
                    }
                ],
                telephone: [
                    {
                        pattern: MOBILE_REGEXP,
                        message: this.$t('account.baseInfo.telephoneIsError'),
                        trigger: ['blur']
                    }
                ],
                fax: [
                    {
                        pattern: MOBILE_REGEXP,
                        message: this.$t('account.baseInfo.faxIsError'),
                        trigger: ['blur']
                    }
                ]
            },
            areaInfo: {}
        };
    },
    created() {
        this.getUserInfoDetail();
        this.comName = this.userInfo.comName;
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        // 获取基本资料详情
        getUserInfoDetail() {
            this.fullscreenLoading = true;
            getUserInfoDetail({uid: this.userInfo.uid}).then(res => {
                this.PeopleUserInfo = res.result || {};
                // 初始化传递省市区参数
                this.$set(this.areaInfo, 'province', this.PeopleUserInfo.province);
                this.$set(this.areaInfo, 'city', this.PeopleUserInfo.city);
                this.$set(this.areaInfo, 'area', this.PeopleUserInfo.zoom);
                this.fullscreenLoading = false;
                if (JSON.stringify(this.PeopleUserInfo) === '{}') {
                    this.userInfoType = true;
                } else {
                    this.userInfoType = false;
                }
            });
        },
        // 保存基本资料
        saveInfo() {
            this.$refs['userInfo'].validate(valid => {
                if (valid) {
                    console.log(JSON.stringify(this.PeopleUserInfo));
                    let saveInfoFn = saveUserInfo; //默认新增接口
                    if (!this.userInfoType) saveInfoFn = updateUserInfoDetail; //如果是修改，则saveInfoFn 指向修改用户接口
                    saveInfoFn(this.PeopleUserInfo)
                        .then(result => {
                            if (result && result.code === this.CODE.SUCCESS_CODE) {
                                console.log(JSON.stringify(result));
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.getUserInfoDetail();
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                        .catch(() => {
                            // 显示异常
                            this.$message.error(this.$t('exception.server'));
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获得地区所选值
        getAreaData(params) {
            $log(params);
            this.PeopleUserInfo.province = params.province;
            this.PeopleUserInfo.city = params.city;
            this.PeopleUserInfo.zoom = params.area;
        }
    },
    components: {
        VDistpicker,
        LinkageArea
    }
};
</script>
<style  lang='scss'>
.userInfosetting {
    padding: 0 5px;
    position: relative;
    .userInfo {
        padding-left: 20px;
        margin-top: 22px;
        .userInfoBox {
            width: 597px;
            .el-select {
                width: 100%;
            }
            .item-title {
                color: #333;
                font-weight: bold;
                line-height: 37px;
                height: 40px;
                font-size: 16px;
                margin-bottom: 9px;
            }
            .el-form-item__label {
                text-align: left;
                padding-left: 20px;
            }
            .el-form-item {
                margin-bottom: 19px;
            }
        }
        .el-button {
            width: 180px;
            margin-top: 10px;
            margin-right: 1px;
        }
        .bor-danger {
            input {
                border-color: #f56c6c;
            }
            input[type='text']:focus {
                border-color: #f56c6c !important;
            }
        }
    }
    .el-form .el-form-item__error:before,
    .lengthLimit::before {
        font-family: 'iconfont' !important;
        font-size: 14px;
        content: '\e6c6';
        color: #f40000;
        display: inline-block;
        margin-right: 2px;
        margin-bottom: 5px;
        z-index: 2;
    }

    .lengthLimit {
        position: absolute;
        right: -153px;
        color: #f56c6c;
    }
    .el-loading-mask {
        background-color: hsla(0, 0%, 100%, 0) !important;
    }
}
</style>
