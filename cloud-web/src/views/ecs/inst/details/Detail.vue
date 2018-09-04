<template>
    <div class="page-main">
        <ecs-inst-detail-header :ecsInst='ecsInst'  @refresh="search(1)"></ecs-inst-detail-header>
        <div class="page-body details-case" v-loading.fullscreen.lock="loadingBody">
            <el-row :gutter="10">
                <el-col :span="7" class="leftInfo" style="width: 31.172%">
                    <!-- 基本信息 -->
                    <div class="panel panel-default">
                        <div class="panel-heading ">
                            <i class="iconfont icon-Information-jibenxinxi color-title mr5"></i>
                            <span class="color-title">{{ $t('ecs.inst.details.title.basicInfo') }}</span>
                        </div>
                        <div class="panel-body zt-panel-body-info">
                            <table class="table zt-table-info">
                                <tbody class="">
                                    <tr>
                                        <td>{{ $t('abbr.id') }}：</td>
                                        <td class="text-ellipsis">{{ ecsInst.id }}
                                            <span v-show="ecsInst.id">
                                                <copy-text :bindText="ecsInst.id"></copy-text>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('common.name') }}：</td>
                                        <td class="td-flex" style="text-align: left;">
                                            <div class="over-Ellipsis mr5" v-tooltip="ecsInst.name && ecsInst.name.length > 20 ? ecsInst.name : ''">
                                                {{ ecsInst.name }}
                                                <span v-show="ecsInst.name && ecsInst.name.length<20"><copy-text :bindText="ecsInst.name "></copy-text></span>
                                            </div>
                                            <div v-show="ecsInst.name && ecsInst.name.length>=20">
                                                <copy-text :bindText="ecsInst.name "></copy-text>
                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('common.status') }}：</td>
                                        <td>
                                            <zt-status :status="ECS_STATUS" :value="ecsInst.status" ></zt-status>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('common.description') }}：</td>
                                        <td class="text-ellipsis" v-tooltip="{content: ecsInst.remark, fold: true}">{{ ecsInst.remark || '-'}}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('ecs.inst.details.instSpecification') }}：</td>
                                        <td>{{ ecsInst.flavor.name }}</td>
                                    </tr>
                                    <!-- 登录凭证 -->
                                    <tr>
                                        <td>{{ $t('common.logonCredentials') }}：</td>
                                        <td>
                                            <span v-if="ecsInst.key_name">
                                                <span>{{ $t('common.KeyPair') }}</span>
                                            </span>
                                            <span v-else>
                                                <span>{{$t('common.pwd') }}</span>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 配置信息 -->
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="iconfont icon-Configurationinform color-title mr5"></i>
                            <span class="color-title">{{ $t('ecs.inst.details.title.configInfo') }}</span>
                        </div>

                        <div class="panel-body zt-panel-body-info">
                            <table class="table zt-table-info">
                                <tbody class="">
                                    <!-- vCPU -->
                                    <tr>
                                        <td>{{ $t('abbr.vcpu') }}：</td>
                                        <td>{{ecsInst.flavor.vcpus || '-'}}{{$t('common.cpuAlias')}}</td>
                                    </tr>
                                    <!-- 内存 -->
                                    <tr>
                                        <td>{{ $t('common.memory') }}：</td>
                                        <td>{{ecsInst.flavor.ram?(ecsInst.flavor.ram/1024 +'GiB'): '-' }}</td>
                                    </tr>
                                    <!-- 磁盘数量 -->
                                    <tr>
                                        <td>{{ $t('common.diskNumber') }}：</td>
                                        <td>{{ (instDetailTop.diskCount) }}块</td>
                                    </tr>
                                    <!-- 操作系统 -->
                                    <tr>
                                        <td>{{ $t('common.os') }}：</td>
                                        <td>{{ ecsInst.osVersion }}</td>
                                    </tr>
                                    <!-- 公网IP -->
                                    <tr v-show="!ecsInst.floatIp || ecsInst.floatIp.indexOf('10.3') === -1">
                                        <td>浮动IP：</td>
                                        <td>{{ecsInst.floatIp ||'-'}}
                                            <span v-show="ecsInst.floatIp">
                                                <copy-text :bindText="ecsInst.floatIp"></copy-text>
                                            </span>
                                        </td>
                                    </tr>
                                    <!-- 私有IP -->
                                    <tr>
                                        <td>{{ $t('common.privateIP') }}：</td>
                                        <td>{{ecsInst.ip ||'-'}}
                                            <span v-show="ecsInst.ip">
                                                <copy-text :bindText="ecsInst.ip"></copy-text>
                                            </span>
                                        </td>
                                    </tr>
                                    <!-- 连接IP -->
                                    <tr v-show="ecsInst.floatIp && ecsInst.floatIp.indexOf('10.3') != -1">
                                        <td>{{ $t('common.connectionIP') }}：</td>
                                        <td>{{ecsInst.floatIp ||'-'}}
                                            <span v-show="ecsInst.floatIp">
                                                <copy-text :bindText="ecsInst.floatIp"></copy-text>
                                            </span>
                                        </td>
                                    </tr>
                                    <!-- 安全组 -->
                                    <tr>
                                        <td>{{ $t('common.securityGroup') }}：</td>
                                        <td>{{getSecurityGroupName(securityGroupName) || '-'}}
                                            <span v-show="securityGroupName">
                                                <copy-text :bindText="getSecurityGroupName(securityGroupName)"></copy-text>
                                            </span>

                                        </td>
                                    </tr>
                                    <!-- 私有网络 -->
                                    <tr>
                                        <td>{{ $t('common.privateNet') }}：</td>
                                        <td>{{vpcName || '-'}}
                                            <span v-show="vpcName">
                                                <copy-text :bindText="vpcName"></copy-text>
                                            </span>

                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </el-col>

                <el-col :span="17" style="width: 68.8%" v-loading="!loading">
                    <div class="panel panel-default" >
                        <!-- 时间段筛选 -->
                        <div class="panel-heading chart-heading">
                            <i class="iconfont icon-Monitoringinformati mr5 color-title"></i>
                            <span class="color-title">{{ $t('ecs.inst.details.title.monitorInfo') }}</span>
                            <el-radio-group v-model="searchDate" @change="dataChangeType" class="pull-right header-radio-group ml80">
                                <el-radio border name="1小时" label="1h">1小时</el-radio>
                                <el-radio border name="6小时" label="6h">6小时</el-radio>
                                <el-radio border name="1天" label="1d">1天</el-radio>
                                <el-radio border name="7天" label="7d">7天</el-radio>
                                <el-radio border name="30天" label="30d">30天</el-radio>
                            </el-radio-group>

                            <div class="text-right panel-heading__right">
                                <el-date-picker type="datetimerange" 
                                format="yyyy-MM-dd HH:mm" 
                                prefix-icon="el-icon-date"  
                                class="date-screen" 
                                @change="selectDetailTime" 
                                v-model="searchObj.dateRange" 
                                size="mini" align="right" 
                                unlink-panels :range-separator="$t('common.to')" 
                                :clearable="false"
                                :start-placeholder="$t('common.beginDate')" 
                                :end-placeholder="$t('common.endDate')">
                                </el-date-picker>
                            </div>
                        </div>
                        <!-- CPU使用率 -->
                        <div class="panel-body zt-panel-body">
                            <span class="font12 ml15 title">{{ $t('ecs.inst.details.cpuPercentUsed') }}</span>
                            <echarts-line v-if="xData_cpu.length > 0" 
                                :legendData="legendData_cpu" 
                                :seriesData="seriesData_cpu" 
                                :lineStyle="lineStyle_cpu" 
                                :areaStyle="areaStyle_cpu" 
                                :xAxisData="xData_cpu" 
                                :xType="xType"
                                :markPointSymbolSize="['158','55']" 
                                :mouldColor="['#0d7ef2','#3ac76c', '#61a0a8', '#c4ccd3']" 
                                :dotStyle="['dbecfd']"
                                :idString="'mychart_cpu'">
                            </echarts-line>
                            <div v-else class="content"><span class="text color-secondary">暂无数据</span></div>
                        </div>
                        <!-- 内存使用率 -->
                        <div class="panel-body zt-panel-body">
                            <span class="font12 ml15 title">{{ $t('ecs.inst.details.memoryPercentUsed') }}</span>
                            <echarts-line v-if="xData_mem.length > 0" 
                                :legendData="legendData_mem" 
                                :seriesData="seriesData_mem" 
                                :lineStyle="lineStyle_mem" 
                                :areaStyle="areaStyle_mem" 
                                :xAxisData="xData_mem" 
                                :xType="xType"
                                :markPointSymbolSize="['150','55']"
                                :mouldColor="['#3ac76c', '#0d7ef2', '#61a0a8', '#c4ccd3']"
                                :dotStyle="['b0e9c4']"
                                :idString="'mychart_mem'"></echarts-line>
                            <div v-else class="content"><span class="text color-secondary">暂无数据</span></div>
                        </div>
                        <!-- 网络流量 -->
                        <div class="panel-body zt-panel-body">
                            <span class="font12 ml15 title">{{ $t('ecs.inst.details.outerNetwork') }}</span>
                            <echarts-line v-if="xData_net.length > 0" 
                                :legendData="legendData_net" 
                                :seriesData="seriesData_net" 
                                :lineStyle="lineStyle_net" 
                                :areaStyle="areaStyle_net" 
                                :xAxisData="xData_net" 
                                :xType="xType"
                                :markPointSymbolSize="['168','55']"
                                :mouldColor="['#7c84dc', '#ff6600', '#61a0a8', '#c4ccd3']"
                                :dotStyle="['ffc299', 'cbcef1']" 
                                :yUnit="'b/s'"
                                :idString="'mychart_net'">
                            </echarts-line>
                            <div v-else class="content"><span class="text color-secondary">暂无数据</span></div>
                            <div class="font12 color-secondary text-c mt5">出口流量为实例内外网出口流量之和，入口流量为实例内外网入口流量之和</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script src="./Detail.js"></script>
<style lang="scss" scoped>
.panel-body.zt-panel-body {
    border-bottom: solid 1px #d1d4d8;
    padding: 5px 0 28px 0;
    position: relative;
    min-height: 210px;
    .content{
        font-size: 24px;
        height:100%;
        line-height: 210px;
        text-align: center;
    }
    .title{
        position: absolute;
        top: 12px;
    }
    &:last-child{
        border-bottom: 0;
    }
}
.panel{
    margin-bottom: 9px;
}
.el-radio-group .el-radio {
    color: #6d6d6d;
    min-width: 56px;
    border-color:#b8c2cc;
}
.zt-panel-body-info {
    padding: 0;
}
.iconfont{
    &:hover{
              color:#0d7ef2;
            }
}
.zt-table-info {
    margin-bottom: 0;
    tbody {
        tr {
            &:first-child td {
                border-top: none;
            }
            height: 40px;
            td {
                padding: 12px 0px;
                font-size: 12px;
                color: #333;
                &:first-child {
                    color: #999;
                    width: 100px;
                    padding-left: 15px;
                    span {
                        color: #999;
                    }
                }
                span {
                    color: #333;
                }
                &:nth-child(2n) {
                    padding-right: 15px;
                }
            }
        }
    }
}
.chart-heading{
    padding: 7px 15px;
}
.panel.panel-default .panel-heading .panel-heading__right .el-date-editor {
    width: 24%;
    top: 8px;
    height: 26px;
    padding: 3px 5px;
    padding-right: 0;
}
.color-title{
    color: #525d6a !important;
}
.header-radio-group .el-radio.is-checked{
    border-color: #0d7ef2;
}
.td-flex{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>