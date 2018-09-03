<template>
    <div class="creatflexip">
        <div class="page-main">
            <div class="baseConfig">
                <i class="iconfont icon-Information-jibenxinxi"></i>
                <span class="configTitle">基础配置</span>
                <zt-form label-width="100px" class="demo-ruleForm">
                    <zt-form-item class="mt10" label="计费方式">
                        <el-button-group>
                            <el-button type="primary">包年包月</el-button>
                            <el-button disabled class="ml5">按量付费 </el-button>
                        </el-button-group>
                    </zt-form-item>
                    <zt-form-item label="区域" >
                        <RegionSelect @input="selectZone"></RegionSelect>
                    </zt-form-item>
                    <zt-form-item label="网络类型">
                        <el-button type="primary">公网IP</el-button>
                    </zt-form-item>
                    <zt-form-item label="线路类型">
                        <el-button type="primary">BGP(多线)</el-button>
                    </zt-form-item>
                    <zt-form-item label="宽带">
                        <div >
                            <el-slider class="bandWidthClass" v-model="bandWidth" :max="200" :min="1" show-input>
                            </el-slider>
                            <div class="bandwidthTips">
                                <span class="bandwidthTips1">1M</span>
                                <span class="bandwidthTips2">50M</span>
                                <span class="bandwidthTips3">100M</span>
                                <span class="bandwidthTips4">200M</span>
                            </div>
                            <span class="bandWidthUnit">M</span>
                        </div>

                    </zt-form-item>
                </zt-form>
            </div>
            <div class="appliNum">
                <i class="iconfont icon-shenqingshuliang"></i>
                <span class="configTitle">申请数量</span>
                <el-input-number class="ml20" v-model="appliNum" controls-position="right" :min="1" :max="50"></el-input-number>
                <span class="appliNumUnit">块</span>
            </div>
            <div class="currConfig">
                <div class="currConfigInfo">
                    <span class="configTitle">当前配置</span>
                    <el-row type="flex" justify="space-around">
                        <el-col :span="8">
                            <div>地域：{{zone.text}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div>申请数量：{{appliNum}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div>宽带：{{bandWidth}}</div>
                        </el-col>
                    </el-row>
                </div>

            </div>
            <div class="purchase">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="12">
                        <div class="color-secondary ">
                            购买周期：
                            <el-select v-model="value" placeholder="请选择">
                                <el-option v-for="item in purchaseCycle" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <span class="ml20">购买费用：</span>
                            <span class="color-warning font18">¥0.00</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class=" pull-right">
                            <el-button type="warning" size="small" @click="toCreat">立即创建</el-button>
                            <el-button type="info" size="small">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog class="saveSuccess" title="提示" :visible.sync="saceSuccessVisible" width="300px" center>
            <i class='iconfont icon-success color-success font18'></i> &nbsp;
            <span>创建一个公网IP成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saceSuccessVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog class="saveError" title="提示" :visible.sync="saveErrorVisible" width="300px" center>
            <i class='iconfont icon-error color-danger font18'></i> &nbsp;
            <span>创建弹性公网IP,成功0个,失败1个</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveErrorVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { create } from '@/service/ecs/floating';
import RegionSelect from '@/components/form/RegionSelect';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            region: '',
            saceSuccessVisible: false,
            saveErrorVisible: false,
            value: '',
            appliNum: 0,
            bandWidth: 0,
            regionList: AREA_CITY.regions,
            currentRadio: AREA_CITY.regions[0].respool[0].value,
            respool: AREA_CITY.regions[0].respool[0].text,
            purchaseCycle: [
                {
                    value: '一个周',
                    label: '一个周'
                },
                {
                    value: '一个月',
                    label: '一个月'
                },
                {
                    value: '两个月',
                    label: '两个月'
                },
                {
                    value: '三个月',
                    label: '三个月'
                },
                {
                    value: '半年',
                    label: '半年'
                },
                {
                    value: '一年',
                    label: '一年'
                },
                {
                    value: '两年',
                    label: '两年'
                },
                {
                    value: '三年',
                    label: '三年'
                },
                {
                    value: '四年',
                    label: '四年'
                },
                {
                    value: '五年',
                    label: '五年'
                }
            ],
            zone: {}
        };
    },
    created() {},
    computed: {
        ...mapGetters(['token'])
    },
    methods: {
        selectZone(value) {
            let currentIndex = this.regionList.findIndex(item => {
                return item.value === this.currentRadio;
            });
            let currentZoneIndex = this.regionList[
                currentIndex
            ].respool.findIndex(item => {
                return item.value === value;
            });
            this.zone = this.regionList[currentIndex].respool[currentZoneIndex];
        },
        toCreat() {
            let data = {
                zone: this.zone.value,
                createNum: this.appliNum,
                bandWidth: this.bandWidth
            };
            create(data)
                .then(result => {
                    if (result.code === this.CODE.SUCCESS_CODE) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.$router.push({ name: 'app.ip.flexip' });
                    } else {
                        this.$message.error(result.msg);
                    }
                })
                .catch(() => {
                    // 显示异常
                    this.$message.error(this.$t('exception.server'));
                });
        }
    },
    components: { RegionSelect }
};
</script>
<style lang="scss" >
.creatflexip {
    background: #f0f2f5;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 118%;
    .page-main {
        width: 90%;
        margin:80px auto;
        padding:0 !important;
        position: relative;
        .iconfont {
            margin-right: 5px;
            &:hover {
                color: #0c7ef1;
            }
        }
        .configTitle {
            font-size: 16px;
            color: #111;
            .name {
                display: inline-block;
                width: 100px;
            }
        }
        .el-button {
            height: 32px;
            width: 110px;
            font-size: 14px;
        }
        .baseConfig {
            padding: 20px 40px 30px;
            background: #fff;
            min-height: 440px;
            .bandWidthUnit {
                position: absolute;
                top: 0;
                right: 58.5%;
                color: #999;
            }
            .bandwidthTips {
                margin-top: -5px;
                .bandwidthTips1 {
                    position: absolute;
                    left: -0.5%;
                }
                .bandwidthTips2 {
                    position: absolute;
                    left: 7%;
                }
                .bandwidthTips3 {
                    position: absolute;
                    left: 15%;
                }
                .bandwidthTips4 {
                    position: absolute;
                    left: 31%;
                }
            }

            .el-input-number--small .el-input__inner {
                padding-left: 0;
            }
        }
        .appliNum {
            padding: 20px 40px;
            margin: 10px 0;
            background: #fff;
            position: relative;
            min-height: 100px;
            .appliNumUnit {
                position: absolute;
                top: 30px;
                left: 19%;
                color: #999;
            }
        }
        .currConfig {
            background: #fff;
            border: 1px solid #fff;
            .currConfigInfo {
                margin: 20px;
                padding: 20px;
                background: #d8ebfe;
                height: 100px;
            }
        }
        .purchase {
            padding:30px 40px;
            min-height: 90px;
            position:fixed;
            bottom:0;
            left: 5%;
            right:5%;
            background: #fff;
            box-shadow: 0 -3px 3px #ebecec;
        }
    }
    .el-dialog {
        .el-dialog__footer {
            border-top: 1px solid #dde3ec;
            padding: 14px 20px;
            background: #f3f5fa;
        }
    }
    .el-slider {
        width: 45%;
        .el-slider__bar {
            height: 32px;
        }
        .el-slider__runway {
            height: 32px;
            margin: 5px;
        }
        .el-slider__button {
            border-radius: 0;
            width: 12px;
            height: 32px;
        }
        .el-slider__input {
            margin-top: 5px;
        }
        .el-slider__button-wrapper {
            top: -1px;
        }
        .el-slider__runway.show-input {
            margin-right: 130px;
        }
    }
}
</style>
