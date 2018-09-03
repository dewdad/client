<template>
    <div class="LiftAndFall">
        <!-- 返回上一级 -->
        <div class="GoBack">
            <b class="font16 mr10">升降配</b>
            <el-button size="mini" type="info"><i class="iconfont icon-fanhui"></i>{{ $t('common.goback') }}</el-button>
        </div>
        <!-- 升降配须知 -->
        <div class="Notes">
            <div>
                <span>{{ $t('ecs.changeconfig.riseFall') }}:</span>{{ $t('ecs.changeconfig.riseFallList.one') }}</div>
            <div>
                <span></span>{{ $t('ecs.changeconfig.riseFallList.two') }}</div>
        </div>
        <!-- 当前配置 -->
        <div class="Configure">
            <div class="title">
                <i class="iconfont icon-user_setting_people mr10"></i>{{ $t('ecs.changeconfig.ConfigureTitle') }}</div>
            <div class="Intro">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <b>实例名称 : </b>
                        <span>{{ecsInst.name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <b>实例ID : </b>
                        <span>{{ecsInst.id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <b>区域 : </b>
                        <span>{{ecsInst.zone}}</span>
                    </el-col>

                    <el-col :span="8">
                        <b>实例 : </b>
                        <span>{{ ecsInst.instanceType }} {{ecsInst.cpu}} vCPU {{ecsInst.ram/1024}} GB</span>
                    </el-col>
                    <el-col :span="8">
                        <b>镜像 : </b>
                        <span>{{ecsInst.osType}}</span>
                    </el-col>
                    <el-col :span="8">
                        <b>系统盘 : </b>
                        <span>{{ sysDisk[0] ? sysDisk[0].type:'' }} {{ sysDisk[0]?sysDisk[0].diskSize:0}}GB</span>
                    </el-col>
                    <el-col :span="24" v-for='(item,index) in dataDisks' :key="index">
                        <b>数据盘 : </b>
                        <span>{{ item.type }} {{ item.diskSize}}GB</span>
                    </el-col>

                    <el-col :span="8">
                        <b>网络 : </b>
                        <span>专有网络 - {{ instanceNet.vpcName }}</span>
                    </el-col>
                    <el-col :span="8">
                        <b>公网带宽 : </b>
                        <span>{{ ecsInst.bandWidth ? (ecsInst.bandWidth.length>= 7)?ecsInst.band :( ecsInst.bandWidth +'Mbps'):'未分配' }}</span>
                    </el-col>
                    <el-col :span="8">
                        <b>安全组 : </b>
                        <span>{{ ecsInst.groupNames }}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 实例规格 -->
        <div class="Spec">
            <el-row>
                <el-col :span="4">
                    <div class="title lh30">{{ $t('ecs.changeconfig.SpecTitle') }}</div>
                </el-col>
                <el-col :span="20">
                    <!-- 切换规格类型 -->
                    <div class="Switch">
                        <div>
                            <el-radio-group v-model="flavorType" @change="changeFlavorList">
                                <el-radio-button label="generalType" size="small" class="mr10">通用型</el-radio-button>
                                <el-radio-button label="largeCpuType" size="small" class="mr10">计算型</el-radio-button>
                                <el-radio-button label="largeMemoryType" size="small">内存型</el-radio-button>
                            </el-radio-group>
                            <!-- <el-button type="primary" size="small">通用型</el-button>
                            <el-button size="small">计算型</el-button>
                            <el-button size="small">内存型</el-button> -->
                        </div>
                        <el-table :data="flavors" row-class-name="data-list" stripe header-row-class-name="data-list" border class="data-list font12 mt30" size="small" highlight-current-row @current-change="handleCurrentChange">
                            <el-table-column prop="types" label="规格族">
                                <template slot-scope="scope">
                                    <el-radio v-model="flavorName" :label="scope.row.name" class="mr10">{{scope.row.types}}</el-radio>
                                    <el-popover placement="top" width="300" trigger="hover" transition="scale-in" content="实例网络性能与计算规格对应(实例计算规格越大则网络性能强)">
                                        <span class="iconfont icon-user_setting_people" slot="reference"></span>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="实例规格"></el-table-column>
                            <el-table-column prop="vCpu" label="vCPU"></el-table-column>
                            <el-table-column prop="ram" label="内存"></el-table-column>
                            <el-table-column prop="cpuType" label="处理器型号"></el-table-column>
                            <el-table-column prop="cpuSpeed" label="处理器主频"></el-table-column>
                        </el-table>
                        <!-- 当前选中实例 -->
                        <div class="mt10 font12">
                            <span class="mr10 color666">{{ $t('ecs.changeconfig.currentSel') }}:</span>
                            <span class="mr10">{{flavorName}}</span>
                            <!-- <span>({{currentSpec[0].vCpu}}, {{currentSpec[0].types}})</span> -->
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 配置费用 -->
        <div class="Cost" :class="{
            'cost1': (navCollapse && !collapse),
            'cost2': (navCollapse && collapse),
            'cost3': (!navCollapse && collapse),
            }">
            <div class="pull-left">
                <span class="color999">{{ $t('ecs.changeconfig.cost') }} : </span>
                <span ng-if="!isComputing" style="color:#FF6600;font-size:24px" class="ng-binding ng-scope">¥&nbsp;8,700.00</span>
            </div>
            <div class="pull-right">
                <button type="button" class="mr20 zt-next font12" @click="confirm">{{ $t('ecs.changeconfig.CostBtn') }}</button>
                <button class="btn ng-cancle font12">{{ $t('common.cancel') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import {getInstFlavor, saveInstFlavor} from '@/service/ecs/list.js';
import {getFlavorsDetail, getInstanceNet} from '@/service/ecs/detail/index';
import {getDiskList} from '@/service/ecs/disk/disk.js';
import {mapGetters} from 'vuex';
export default {
    data() {
        let stateParams = this.$route.params;
        let ecsInst = {
            id: stateParams.id
        };
        if (stateParams && stateParams.item) ecsInst = stateParams.item;
        return {
            stateParams,
            ecsInst,
            sysDisk: [],
            dataDisks: [],
            flavorType: 'generalType',
            instFlavor: {},
            flavor: {},
            flavors: [],
            instanceNet: {},
            flavorName: 'g1.ecs.xlarge',
            currentSpec: {}
        };
    },
    computed: {
        ...mapGetters(['navCollapse', 'collapse'])
    },
    mounted() {
        this.getInstFlavor(this.stateParams.id);
        this.getFlavorsDetail(this.ecsInst.flavorId);
        this.getInstanceNet(this.stateParams.id);
        this.getDiskList({instanceId: this.stateParams.id});
    },
    methods: {
        handleCurrentChange(val) {
            if (!val) return;
            this.flavorName = val.name;
            this.currentSpec = val;
        },
        //获取实例规格
        getFlavorsDetail: function(flavorId) {
            getFlavorsDetail(flavorId).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    console.log('getFlavorsDetail', res);
                    let jsonData = res.result;
                    let flavor = JSON.parse(jsonData);
                    this.flavor = flavor.flavor;
                    console.log('getFlavorsDetail flavor', this.flavor);
                }
            });
        },

        //获取实例网络信息
        getInstanceNet: function(instanceId) {
            getInstanceNet(instanceId).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let respData = res.result;
                    this.instanceNet = respData;

                    console.log('getInstanceNet', this.instanceNet);
                }
            });
        },
        //获取实例规格列表数据
        getInstFlavor: function() {
            getInstFlavor().then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let respData = res.result;
                    this.instFlavor = respData;
                    this.flavors = respData[this.flavorType];
                    console.log('getInstFlavor', this.dataList);
                }
            });
        },

        changeFlavorList: function() {
            this.flavors = this.instFlavor[this.flavorType];
        },

        //获取本实例的磁盘信息；
        getDiskList: function(params) {
            this.sysDisk = [];
            this.dataDisks = [];
            getDiskList(params).then(res => {
                console.log('getDiskList', res);
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resDatas = res.result.records || [];
                    resDatas.forEach(item => {
                        var val = parseInt(item.isBoot);
                        if (val == 1) {
                            this.sysDisk.push(item);
                        } else {
                            this.dataDisks.push(item);
                        }
                    });
                }
            });
        },
        //确定升降配
        confirm: function() {
            let data = {
                instanceId: this.stateParams.id,
                flavorId: this.currentSpec.id
            };
            saveInstFlavor(data).then(
                res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        this.$router.push({name: 'app.ecs.list'});
                        this.$message.success('操作成功');
                    } else {
                        this.$alert(res.msg, '提示', {
                            type: 'error'
                        });
                    }
                },
                error => {
                    this.$alert(error, '提示', {
                        type: 'error'
                    });
                }
            );
        }
    }
};
</script>
 
<style scoped lang="scss">
.LiftAndFall {
    padding: 20px 50px 20px 20px;
    margin-bottom: 76px;
    .cost1{
        left:150px;
    }
    .cost2{
        left:50px;
    }
    .cost3{
        left:200px;
    }

}
.GoBack {
    height: 70px;
    line-height: 70px;
}
.Notes {
    width: 100%;
    background-color: #fbf7cf;
    padding: 15px 20px;
    color: #f68300;
    border: 1px solid #f6e0c4;
    font-size: 12px;
    margin-bottom: 20px;
    span {
        display: inline-block;
        width: 80px;
    }
}
.Configure {
    background-color: #f1f6f9;
    padding: 5px 20px 20px 20px;
    margin-bottom: 30px;
    .title {
        border-bottom: 1px solid #e2e2e2;
        padding: 10px 0;
        font-size: 16px;
    }
    .Intro {
        line-height: 20px;
        margin-top: 10px;
        font-size: 12px;
    }
}
.Cost {
    position: fixed;
    width: auto;
    bottom: 0;
    left: 300px;
    right: 0;
    padding: 20px 40px;
    box-shadow: 0 -3px 3px #ebecec;
    background-color: #fff;
    z-index: 90;
    transition: all 0.5s;
    button {
        width: 120px;
        height: 36px;
        box-sizing: border-box;
    }
    button:first-child {
        border: 0;
        margin-right: 30px;
        color: #fff;
        background: #ff8a00;
    }
    button:last-child {
        color: #333;
    }
}
</style>
 