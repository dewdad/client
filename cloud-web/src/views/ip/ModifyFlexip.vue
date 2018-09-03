<template>
    <div class="modifyflexip">
        <div class="page-main">
            <page-header>
                修改带宽
                <el-button class="pheaderBtn" type="info" @click="$router.push({'name': 'app.ip.flexip'})">
                    <i class="iconfont icon-fanhui"></i>
                    返回弹性公网IP列表
                </el-button>
            </page-header>
            <div class="currConfig">
                <div class="configTitle">当前配置</div>
                <el-row type="flex" justify="space-around">
                    <el-col :span="8">
                        <div>
                            <span class="configName">地域：</span>{{zone}}
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <span class="configName">线路类型：</span>BGP(多线)</div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <span class="configName">网络类型：</span>公网</div>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col :span="8">
                        <div>
                            <span class="configName">带宽：</span>{{bandWidth}}
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="baseConfig">
                <i class="iconfont icon-Information-jibenxinxi"></i>
                <span class="configTitle ml5">基础配置</span>
                <zt-form label-width="110px" class="demo-ruleForm">
                    <zt-form-item label="网络类型">
                        <el-button type="primary">公网IP</el-button>
                    </zt-form-item>
                    <zt-form-item label="宽带">
                        <div class="block " style="position:relative">
                            <el-slider class="bandWidthClass"  v-model="bandWidth" :max="200" show-input>
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
            <div class="footer ">
                <el-button type="info" size="small">取消</el-button>
                <el-button type="warning" @click="toModify" size="small">确定升配</el-button>

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
    </div>
</template>
<script>
import { updateFloatingIp } from '@/service/ecs/floating';
import { mapGetters } from 'vuex';
import PageHeader from '@/components/pageHeader/PageHeader';
export default {
    data() {
        return {
            zone: '',
            saceSuccessVisible: false,
            saveErrorVisible: false,
            value: 0,
            regionList: AREA_CITY.regions,
            bandWidth: 0,
            id:''
        };
    },
    created() {
        this.getParams();
    },
    computed: {
        ...mapGetters(['token', 'userInfo'])
    },
    methods: {
        toModify() {
            console.log(this.bandWidth);
            let data = {
                type: 'modify',
                id: this.id,
                bandWidth: this.bandWidth
            };
            updateFloatingIp(data)
                .then(result => {
                    if (result.code === this.CODE.SUCCESS_CODE) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.$router.push({ name: 'app.ip.flexip' });
                    }
                })
                .catch((err) => {
                    // 显示异常
                    console.log(err);
                });
        },
        getParams() {
            // 取到路由带过来的参数
            this.id = this.$route.params.id;
            this.bandWidth = parseInt(this.$route.params.bandWidth);
            let currentIndex = this.regionList.findIndex(item => {
                return item.value === this.$route.params.zone;
            });
            this.zone = this.regionList[currentIndex].text;
        }
    },
    components: { PageHeader }
};
</script>
<style  lang="scss" >
.modifyflexip {
    height: calc(100vh - 50px);
    border-bottom: 1px solid #ccc;
    .page-main {
        margin-right: 15px;
        .pheaderBtn {
            font-size: 12px;
            padding: 5px 20px !important;
            margin-left: 5px;
        }
        .iconfont:hover {
            color: #0c7ef1;
        }
        .baseConfig {
            padding: 20px;
            font-size: 14px;
            .bandWidthUnit {
                position: absolute;
                top: 13px;
                right: 58.5%;
                color: #999;
            }
            .bandwidthTips {
                margin-top: -17px;
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
        .currConfig {
            padding: 20px;
            margin: 10px 0 20px 0;
            min-height: 90px;
            background: #d8ebfe;
            font-size: 12px;
            .configName {
                color: #999;
            }
            .el-row {
                padding: 5px;
            }
            .configTitle {
                font-size: 14px;
                color: #111;
                padding: 15px 0;
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;
            }
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
        }
        .el-slider__button {
            border-radius: 0;
            width: 12px;
            height: 32px;
        }
        .el-slider__input {
            margin-top: 16px;
        }
        .el-slider__button-wrapper {
            top: -2px;
        }
        .el-slider__runway.show-input {
            margin-right: 130px;
        }
    }
    .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        border-top: 1px solid #ccc;
        padding: 20px;
        .el-button {
            float: right;
            width: 100px;
            margin: 10px;
        }
    }
}
</style>
