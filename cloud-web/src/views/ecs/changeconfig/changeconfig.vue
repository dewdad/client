<template>
    <div class="LiftAndFall">
        <!-- 返回上一级 -->
        <div class="GoBack">
            <b class="font16 mr10">升降配</b>
            <el-button size="mini" type="info" @click="$router.go(-1)"><i class="iconfont icon-fanhui"></i>{{ $t('common.goback') }}</el-button>
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
                {{ecsInst}}
                <el-row :gutter="20">
                    <el-col :span="8">
                        <b>实例名称 : </b>
                        <span>{{get(ecsInst, 'name')}}</span>
                    </el-col>
                    <el-col :span="8">
                        <b>实例ID : </b>
                        <span>{{ecsInst.id}}</span>
                    </el-col>
                    <!-- <el-col :span="8">
                        <b>区域 : </b>
                        <span>{{ecsInst.zone}}</span>
                    </el-col> -->

                    <el-col :span="8">
                        <b>实例 : </b>
                        <span>{{ get(ecsInst, 'flavor.instSpec') }} {{get(ecsInst, 'flavor.vcpus')}} vCPU {{ get(ecsInst,'flavor.ram')/1024}} GB</span>
                    </el-col>
                    <el-col :span="8">
                        <b>镜像 : </b>
                        <span>{{get(ecsInst, 'image.name')}}</span>
                    </el-col>
                    <!-- <el-col :span="8">
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
                    </el-col> -->
                    <!-- <el-col :span="8">
                        <b>公网带宽 : </b>
                        <span>{{ ecsInst.bandWidth ? (ecsInst.bandWidth.length>= 7)?ecsInst.band :( ecsInst.bandWidth +'Mbps'):'未分配' }}</span>
                    </el-col> -->
                    <!-- <el-col :span="8">
                        <b>安全组 : </b>
                        <span>{{ ecsInst.security_groups ? ecsInst.security_groups[0].name : '' }}</span>
                    </el-col> -->
                </el-row>
            </div>
        </div>
        <!-- 实例规格 -->
        <div class="Spec">
            <el-row>
                <el-col :span="24" style="">
                    <!-- 切换规格类型 -->
                    <div class="title pull-left lh30" style="width: 80px;">{{ $t('ecs.changeconfig.SpecTitle') }}</div>
                    <div class="Switch" style="overflow: hidden">
                        <flavor-table v-model="flavor" @loading="handleFlavorLoading"></flavor-table>
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
            <!-- <div class="pull-left">
                <span class="color999">{{ $t('ecs.changeconfig.cost') }} : </span>
                <span ng-if="!isComputing" style="color:#FF6600;font-size:24px" class="ng-binding ng-scope">¥&nbsp;8,700.00</span>
            </div> -->
            <div class="pull-right">
                <button type="button" class="mr20 zt-next font12" @click="confirm">{{ $t('ecs.changeconfig.CostBtn') }}</button>
                <button class="btn ng-cancle font12">{{ $t('common.cancel') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import {saveInstFlavor} from '@/service/ecs/list.js';
import {getInstanceDetail} from '@/service/ecs/detail/index';
import FlavorTable from '@/views/ecs/create/components/FlavorTable';
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            flavorLoading: false,
            ecsInst: {},
            sysDisk: [],
            dataDisks: [],
            flavorType: 'generalType',
            instFlavor: {},
            flavor: {},
            instanceNet: {},
            flavorName: 'g1.ecs.xlarge',
            currentSpec: {}
        };
    },
    components: {
        FlavorTable
    },
    computed: {
        ...mapGetters(['navCollapse', 'collapse'])
    },
    created() {
        if (this.$route.params.item) {
            this.ecsInst = this.$route.params.item;
        } else {
            alert(this.$route.params.id);
            this.getInstanceDetail(this.$route.params.id);
        }
        
        // this.getInstanceNet(this.stateParams.id);
        // this.getDiskList({instanceId: this.stateParams.id});
    },
    methods: {
        handleFlavorLoading(val) {
            this.flavorLoading = val;
        },
        handleCurrentChange(val) {
            if (!val) return;
            this.flavorName = val.name;
            this.currentSpec = val;
        },
        //获取实例规格
        getInstanceDetail: function(instId) {
            getInstanceDetail(instId).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    console.log('getFlavorsDetail', res);
                    this.ecsInst = res.data[0];
                    this.flavor = res.data[0].flavor;
                    console.log('getFlavorsDetail flavor', this.flavor);
                }
            }).catch(err => {
                $log(err);
            });
        },

        // //获取实例网络信息
        // getInstanceNet: function(instanceId) {
        //     getInstanceNet(instanceId).then(res => {
        //         if (res.code && res.code === this.CODE.SUCCESS_CODE) {
        //             let respData = res.result;
        //             this.instanceNet = respData;

        //             console.log('getInstanceNet', this.instanceNet);
        //         }
        //     });
        // },

        // //获取本实例的磁盘信息；
        // getDiskList: function(params) {
        //     this.sysDisk = [];
        //     this.dataDisks = [];
        //     getDiskList(params).then(res => {
        //         console.log('getDiskList', res);
        //         if (res.code && res.code === this.CODE.SUCCESS_CODE) {
        //             let resDatas = res.result.records || [];
        //             resDatas.forEach(item => {
        //                 var val = parseInt(item.isBoot);
        //                 if (val == 1) {
        //                     this.sysDisk.push(item);
        //                 } else {
        //                     this.dataDisks.push(item);
        //                 }
        //             });
        //         }
        //     });
        // },
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
        left:50px;
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
    left: 200px;
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
 