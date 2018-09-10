<template>
    <div class="page-main overflow-box">
        <!-- 头部(部门选择) -->
        <div class="selDepart mb20">
            <div class="finger-cursor" @click="selDepartBox">
                <span class="el-dropdown-link font18">
                    VDC部门1<i class="el-icon-caret-bottom el-icon--right color-secondary"></i>
                </span>
            </div>
            <el-tree v-show="departShow"
            :data="departData" 
            :expand-on-click-node="false" 
            :props="defaultProps"
            @node-click="selDepart"></el-tree>
            <span class="color-secondary font12">您可以通过切换部门查看相应配额使用情况</span>
        </div>
        <!-- 外层 -->
        <el-row :gutter="20" >
            <el-col :span="24">
                <!-- 弹性云主机、CPU、内存 -->
                <div class="floor-one">
                    <el-row :gutter="20">
                        <el-col :span="8"> 
                            <div class="floor-one__box">
                                <div class="box-left">
                                    <i class="iconfont icon-yunzhuji-gailan color-primary"></i>
                                </div>
                                <div class="box-right">
                                    <div class="title pull-left">
                                        <div class="lh30"><span class="font30">25</span>/100个</div>
                                        <span class="color-secondary">弹性云主机</span>
                                    </div>
                                    <el-progress type="circle" :width="48" :show-text="false" :stroke-width="4" :percentage="80" class="pull-right" color="#0d7ef2"></el-progress>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="floor-one__box">
                                <div class="box-left">
                                    <i class="iconfont icon-CPU-gailan color-primary"></i>
                                </div>
                                <div class="box-right">
                                    <div class="title pull-left">
                                        <div class="lh30"><span class="font30">25</span>/100个</div>
                                        <span class="color-secondary">CPU </span>
                                    </div>
                                    <el-progress type="circle" :width="48" :show-text="false" :stroke-width="4" :percentage="80" class="pull-right" color="#7460ee"></el-progress>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="floor-one__box">
                                <div class="box-left">
                                    <i class="iconfont icon-neicun-gailan color-primary"></i>
                                </div>
                                <div class="box-right">
                                    <div class="title pull-left">
                                        <div class="lh30"><span class="font30">25</span>/100个</div>
                                        <span class="color-secondary">内存</span>
                                    </div>
                                    <el-progress type="circle" :width="48" :show-text="false" :stroke-width="4" :percentage="80" class="pull-right" color="#18bcc9"></el-progress>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 磁盘数量、容量、快照数量、容量等 -->
                <div class="floor-two mt20">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <div class="floor-two__box">
                                <div class="box-left">
                                    <i class="iconfont icon-cipan-gailan color-warning"></i>
                                </div>
                                <div class="box-right">
                                    <div class="pull-left box-right__number">
                                        <div class="title mb15">
                                            <div class="lh30" style="height: 30px;"><span class="font30">25</span>/100个</div>
                                            <span class="color-secondary">磁盘数量</span>
                                        </div>
                                        <div class="usageRate">
                                            <el-progress :percentage="50" :show-text="false" :stroke-width="4" color="#f77e28"></el-progress>
                                            <span class="color-secondary font12">已使用：50%</span>
                                        </div>
                                    </div>
                                    <div class="pull-left box-right__capacity" style="width: 49%">
                                        <div class="title mb15">
                                            <div class="lh30" style="height: 30px;"><span class="font30">205604</span>/205604GB</div>
                                            <span class="color-secondary">磁盘数量</span>
                                        </div>
                                        <div class="usageRate">
                                            <el-progress :percentage="50" :show-text="false" :stroke-width="4" color="#f77e28"></el-progress>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="floor-two__box mt20">
                                <div class="box-left">
                                    <i class="iconfont icon-kuaizhao-gailan color-primary"></i>
                                </div>
                                <div class="box-right">
                                    <div class="pull-left box-right__number">
                                        <div class="title mb15">
                                            <div class="lh30" style="height: 30px;"><span class="font30">25</span>/100个</div>
                                            <span class="color-secondary">快照数量</span>
                                        </div>
                                        <div class="usageRate">
                                            <el-progress :percentage="50" :show-text="false" :stroke-width="4" color="#0d7ef2"></el-progress>
                                            <span class="color-secondary font12">已使用：50%</span>
                                        </div>
                                    </div>
                                    <div class="pull-left box-right__capacity" style="width: 49%">
                                        <div class="title mb15">
                                            <div class="lh30" style="height: 30px;"><span class="font30">205604</span>/205604GB</div>
                                            <span class="color-secondary">快照数量</span>
                                        </div>
                                        <div class="usageRate">
                                            <el-progress :percentage="50" :show-text="false" :stroke-width="4" color="#0d7ef2"></el-progress>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <!-- 网络、安全组等 -->
                        <el-col :span="8">
                            <div class="info-box">
                                <ul>
                                    <li class="info-box__li">
                                        <div class="title">
                                            <i class="iconfont icon-wangluo-gailan"></i>
                                            <span class="ml10">网络</span>
                                        </div>
                                        <span class="pull-right statistics font12"><span class="font30">25</span>/100个</span>
                                    </li>
                                    <li class="info-box__li">
                                        <div class="title">
                                            <i class="iconfont icon-anquanzu-gailan"></i>
                                            <span class="ml10">安全组</span>
                                        </div>
                                        <div class="pull-right statistics font12"><span class="font30">25</span>/100个</div>
                                    </li>
                                    <li class="info-box__li">
                                        <div class="title">
                                            <i class="iconfont icon-luyouqi-gailan"></i>
                                            <span class="ml10">路由器</span>
                                        </div>
                                        <div class="pull-right statistics font12"><span class="font30">25</span>/100个</div>
                                    </li>
                                    <li class="info-box__li">
                                        <div class="title">
                                            <i class="iconfont icon-fudongIP-gailan"></i>
                                            <span class="ml10">浮动IP</span>
                                        </div>
                                        <div class="pull-right statistics font12"><span class="font30">25</span>/100个</div>
                                    </li>
                                </ul>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 租户 -->
                <div class="floor-tenant mt20">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="floor-tenant__box">
                                <div class="title demo-input-suffix">
                                    <span class="mr40 font16 lh32">租户</span>
                                    <el-input
                                        style="width:180px"
                                        placeholder="请输入内容"
                                        prefix-icon="el-icon-search"
                                        size="small"
                                        class="pull-right"
                                        v-model="searchVal">
                                    </el-input>
                                </div>
                                <!-- 租户列表 -->
                                <ul class="floor-tenant__box__ul">
                                    <li class="floor-tenant__box__li">
                                        <i class="iconfont icon-zuhu mr10"></i>
                                        <span>租户a</span>
                                    </li>
                                    <li class="floor-tenant__box__li">
                                        <i class="iconfont icon-zuhu mr10"></i>
                                        <span>租户a</span>
                                    </li>
                                    <li class="floor-tenant__box__li">
                                        <i class="iconfont icon-zuhu mr10"></i>
                                        <span>租户a</span>
                                    </li>
                                    <li class="floor-tenant__box__li">
                                        <i class="iconfont icon-zuhu mr10"></i>
                                        <span>租户a</span>
                                    </li>

                                </ul>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="floor-tenant__resource">
                                <div class="title">
                                    <span class="mr40 font16">租户资源</span>
                                </div>
                                <div class="floor-tenant__resource__list">
                                    <div class="resource-list" v-for="(item, index) in resourceArr" :key="index">
                                        <div class="resource-list__father">
                                            <div class="resource-title">
                                                <i :class="item.class"></i>
                                                <span class="ml10">{{item.name}}</span>
                                            </div>
                                            <div class="pull-right statistics"><span>25</span>/100</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import EchartsLine from '@/components/charts/EchartsLine';
import EchartsPie from '@/components/charts/EchartsPie';
let resourceArr = [
    {class: 'iconfont icon-yunzhuji-gailan', name: '弹性主机'},
    {class: 'iconfont icon-CPU-gailan', name: 'CPU'},
    {class: 'iconfont icon-neicun-gailan', name: '内存'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘数量'},
    {class: 'iconfont icon-cipan-gailan', name: '磁盘内存'},
    {class: 'iconfont icon-kuaizhao-gailan', name: '快照数量'},
    {class: 'iconfont icon-kuaizhao-gailan', name: '快照容量'},
    {class: 'iconfont icon-wangluo-gailan', name: '网络'},
    {class: 'iconfont icon-anquanzu-gailan', name: '安全组'},
    {class: 'iconfont icon-luyouqi-gailan', name: '路由器'},
    {class: 'iconfont icon-fudongIP-gailan', name: '浮动IP'}
];
export default {
    data() {
        return {
            resourceArr,
            searchVal: '',
            departData: [
                {
                    label: '一级部门1',
                    children: [{
                        label: '二级部门1-1',
                        children: [{
                            label: '三级部门1-1-1'
                        }]
                    }]
                },
                {
                    label: '一级部门2',
                    children: [{
                        label: '二级部门2-1',
                        children: [{
                            label: '三级部门2-1-1'
                        }]
                    }]
                },
                {
                    label: '一级部门3',
                    children: [{
                        label: '二级部门3-1',
                        children: [{
                            label: '三级部门3-1-1s'
                        }]
                    }]
                }
            ],
            departShow: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    methods:{
        // 选择部门
        selDepart() {
            this.departShow = false;
        },
        // 打开部门菜单
        selDepartBox(){
            this.departShow = !this.departShow;
        }
    },
    components: {
        EchartsLine,
        EchartsPie
    },
};
</script>

<style lang="scss">
.overflow-box{
    background: #ebeef3;
    .el-dropdown-link{
        color: #333 !important;
    }
}
// 
.floor-one{
    &__box{
        background-color: #fff;
        border-radius: 4px;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        .box-right{
            margin-left: 80px;
            padding: 46px 30px;

        }
    }
}

// 
.floor-two{
    &__box{
        background-color: #fff;
        border-radius: 4px;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        .box-right{
            margin-left: 80px;
            padding-top: 32px;
            &__number{
                width: 50%;
                padding-left: 30px;
            }
            .usageRate{
                width: 200px;
            }
        }
    }
}
.floor-tenant{
    &__box{
        background-color: #fff;
        padding-bottom: 30px;
        border-radius: 4px;
        .title{
            padding: 14px 30px;
            .el-input__inner{
                border-radius: 0;
            }
        }
        &__ul{
            height: 246px;
            overflow: auto;
        }
        &__li{
            height: 40px;
            cursor: pointer;
            line-height: 40px;
            padding-left: 30px;
            &:hover{
                color: #0d7ef2;
                background-color: #eceff8;
                i{
                    color: #0d7ef2;
                }
            }
        }
    }
    &__resource{
        background-color: #fff;
        padding-bottom: 30px;
        border-radius: 4px;
        .title{
            padding: 19px 30px;
        }
        &__list{
            padding: 0 30px;
            height: 246px;
            &::after{
                content: '';
                display: block;
                clear: both;
            }
            .resource-list{
                height: 50px;
                line-height: 50px;
                width: 33.3%;
                margin-bottom: 10px;
                float: left;
                &__father{
                    margin: 0 5px;
                    padding: 0 20px;
                    background-color: #f6f8fb;
                    &::after{
                        content: '';
                        display: block;
                        clear: both;
                    }
                }
                .resource-title{
                    display: flex;
                    align-items: center;
                    float: left; 
                }
                i{
                    font-size: 22px;
                    color: #8da3c6;
                }
                .statistics{
                    height: 50px;
                }
            }
        }
    }
}
.box-left{
    padding: 57px 28px;
    float: left;
    border-right: 1px solid #ebf3f7;
    i{
        font-size: 24px;
    }
}
.lh30{
    line-height: 30px;
    height: 30px;
}
.dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #36ab46;
    margin-right: 5px;
    vertical-align: middle;
    position: relative;
    top: -1px;
    &.color-warning {
        background-color: #ff4400;
    }
}
.info-box {
    background-color: #fff;
    padding: 0 30px;
    border-radius: 4px;
    height: 300px;
    &__li{
        border-bottom: 1px solid #ebf3f7;
        height: 75px;
        line-height: 75px;
        .title{
            display: flex;
            align-items: center;
            float: left; 
        }
        i{
            font-size: 22px;
            color: #8da3c6;
        }
        .statistics{
            height: 75px;
        }
    }
}

.selDepart{
    position: relative;
    .el-tree{
        width: 210px;
        background-color: #ffffff;
        box-shadow: 0px 0px 6px 0px 
            rgba(0, 0, 0, 0.1);
        border: solid 1px #ebebeb;
        position: absolute;
        padding: 12px;
        z-index: 999;
        .el-icon-caret-right:before{
            content: "\e616";
            font-weight: 400;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            font-size: inherit;
            &[class*='el-icon'] {
                font-family: 'element-icons' !important;
            }
        }
        .el-tree-node__expand-icon.expanded{
            &:before{
                content: "\E63C";
            }
            transform: rotate(180deg);
        }  
        .el-tree-node:focus>.el-tree-node__content{
            color: #0d7ef2;
        }
    }
}
</style>
