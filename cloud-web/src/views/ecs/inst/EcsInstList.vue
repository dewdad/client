<template>
    <div class="page-main ecs-list-page list-page">
        <!-- <zt-scroller> -->
        <page-header>
            {{$t('ecs.inst.list.title')}}
            <!-- <region-radio slot="content" v-model="region" type="list"></region-radio> -->
            <div slot="right" class="right-btn">
                <el-button type="primary" @click="createInst" size="small">{{$t('ecs.inst.list.createInst')}}</el-button>
                <el-button type="info" size="small" @click="getEcsInstList" class="pd9" v-tooltip.bottom="{content: $t('common.refresh'), theme: 'is-light'}">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <div class="search-box">
                <ecs-select @select="ecsSelect" @search="setOptions" @help="showHelpDialog"></ecs-select>
            </div>
            <!-- 检索项 -->
            <retrieval @select="getRetrieval" :retrievalData="retrievalData"></retrieval>
            <!-- 列表 -->
            <!-- <zt-status v-for="item in ECS_STATUS" :status="ECS_STATUS" :value="item.value" :key="item.value" ></zt-status> -->
            <el-table @filter-change="filterHandler" v-loading="loading" :data="tableDataList" style="width: 100%" row-class-name="data-list" header-row-class-name="data-list" border class="data-list">
                <!-- 名称 -->
                <el-table-column prop="name" :label="getLabel('name')" min-width="183">
                    <template slot-scope="scope">
                        <div class="id-column table-row-list">
                            <div class="text-nowrap table-row-list-item hoverToShowContent">
                                <!-- <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,item:scope.row}}">e-m5e3k7ais9uf86u9m1pu</router-link> <copy-text class="hoverToShow" :bindText="scope.row.id"></copy-text> -->
                                <router-link :disabled="dropdownActive(scope.row.status, modifyConfigActivedStatus)" :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,flavorId:scope.row.flavorId,item:scope.row}}">{{ scope.row.id }}</router-link>
                                <copy-text class="hoverToShow finger-cursor" :bindText="scope.row.id" position="right"></copy-text>
                            </div>
                            <div class="flex text-nowrap flex-align-center table-row-list-item hoverToShowContent">
                                <!-- hoverToShow -->
                                <span class="text-ellipsis" v-tooltip="{content: scope.row.name, fold: true}">{{scope.row.name}}</span>
                                <i v-if="!dropdownActive(scope.row.status, modifyConfigActivedStatus)" class="iconfont icon-edit_people ml10 box-border amendInfo finger-cursor" style="padding: 1px" @click="editinstname(scope.row)"></i>
                                <copy-text class="ml5 flex finger-cursor hoverToShow" :bindText="scope.row.name" position="right"></copy-text>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <!-- 操作系统 -->
                <el-table-column prop="os" :label="getLabel('os')" min-width="70" class-name="text-center" align="center">
                    <template slot-scope="scope">
                        {{scope.row.image.name}}
                    </template>
                </el-table-column>
                <!-- IP地址 -->
                <el-table-column prop="ipaddr" :label="getLabel('ipaddr')" min-width="125">
                    <template slot-scope="scope">
                        <ul>
                            <li v-for="(ip, index) in scope.row.addresses.addresses" :key="index" class="text-nowrap">
                                <span>{{index}}：</span>
                                {{ip[0].addr}}
                                <span class="color-secondary">（内）</span>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <!-- 状态 -->
                <el-table-column :filter-multiple="false" prop="status" :label="getLabel('status')" :filters="getDropdown('status')" :filtered-value="[status]" min-width="80">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" :disabled="scope.row.status !== 'BUILD'" :content="scope.row.status === 'BUILD' ? '预计需要3-6分钟' : ''" placement="top">
                            <zt-status :status="ECS_STATUS" :value="scope.row.status" class="text-nowrap status-column"></zt-status>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!-- 配置  -->
                <el-table-column prop="cfginfo" :label="getLabel('cfginfo')" min-width="90">
                    <template slot-scope="scope">
                        <ul class="left">
                            <!-- ngIf: !item.toCpu -->
                            <li v-if="!scope.row.toCpu" class="">
                                <span class="text-nowrap">vCPU: {{scope.row.flavor.vcpus}}{{ $t('common.cpuAlias') }}</span>
                            </li>
                            <li v-if="!scope.row.toCpu" class="">
                                <span class="text-nowrap">{{$t('ecs.inst.list.memory')}}：{{scope.row.flavor.ram/1024 }}G</span>
                            </li>
                            <!-- <li v-if="scope.row.bandWidth && scope.row.bandWidth != 0 && !scope.row.toCpu" class="">
                                        <span class="">{{$t('ecs.inst.list.bandWidth')}}: {{scope.row.bandWidth }}MB</span>
                                    </li> -->
                            <li v-if="!!scope.row.toCpu" class="">
                                <span class="">{{$t('ecs.inst.list.configChanged')}}<br/> {{ scope.row.status == 'CHANGE' ? $t('common.state.rebootingAlias') : $t('common.state.awaitReboot')}} </span>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="getLabel('createTime')" min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.created|date('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('common.tableHeaderOperateText')" key="op" width="260" class-name="option-column text-nowrap">
                    <template slot-scope="scope">
                        <!-- 管理 -->
                        <router-link :disabled="dropdownActive(scope.row.status, modifyConfigActivedStatus)" :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,item:scope.row}}">{{$t('ecs.inst.list.manage') }}</router-link>
                        <b class="link-division-symbol"></b>
                        <!-- 远程登录 -->
                        <a @click="getVncBefore(scope.row)" :disabled="dropdownActive(scope.row.status, remoteLoginActivedStatus)">{{$t('ecs.inst.list.remoteLogin') }}</a>
                        <b class="link-division-symbol"></b>
                        <!-- 更改实例规格 -->
                        <router-link :to="{name:'app.ecs.changeconfig',params:{id:scope.row.id,item:scope.row}}" :disabled="dropdownActive(scope.row.status, modifyConfigActivedStatus)">{{$t('ecs.inst.list.modifyConfig') }}</router-link>
                        <b class="link-division-symbol"></b>
                        <!-- 更多 -->
                        <zt-dropdown size="small" trigger="click" :placement="getPlacement(scope.$index)">
                            <span class="el-dropdown-link">
                                {{$t('common.more')}}
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <zt-dropdown-menu slot="dropdown" :placement="getPlacement(scope.$index)">
                                <zt-dropdown-item v-tooltip.left="dropdownActive(scope.row.status, item.activedStatus) ? item.tip : ''" v-for="item in ECS_DROPDOWN" :key="item.text" :disabled="!item.children && dropdownActive(scope.row.status, item.activedStatus)">
                                    {{item.text}}
                                    <zt-dropdown-menu slot="dropdown" v-if="item.children">
                                        <zt-dropdown-item @click="dropdownClickHandler(child, scope.row)" v-tooltip.left="dropdownActive(scope.row.status, child.activedStatus) ? child.tip : ''" v-for="child in getChildren(item,scope.row)" :key="child.text" :disabled="dropdownActive(scope.row.status, child.activedStatus)">
                                            <span>{{child.text}}</span>
                                        </zt-dropdown-item>
                                    </zt-dropdown-menu>
                                </zt-dropdown-item>
                            </zt-dropdown-menu>
                        </zt-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" :current-page.sync="pageIndex" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="sizes, prev, pager, next" :total="totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- </zt-scroller> -->
        <!-- <zt-affix :offset-bottom="70" @change="onAffixChange"> -->
        <!-- <div class="pagination affix">
                <el-pagination v-if="!loading" background @size-change="handleSizeChange" :current-page.sync="pageIndex" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="sizes, prev, pager, next" :total="totalItems">
                </el-pagination>
            </div> -->
        <!-- </zt-affix> -->
        <real-name-verify v-if="dialogVisible" name="dialogVisible"></real-name-verify>

        <!-- 实例信息展示 -->
        <!-- <div :class="{
            'instanceInfo': true,
            'instanceInfo1': (navCollapse && !collapse),
            'instanceInfo2': (navCollapse && collapse),
            'instanceInfo3': (!navCollapse && collapse),
            'instanceInfo4': instanceInfoData === 4,}">
           
            <div class="name">
                <span class="font14">虚拟机</span>
                <i class="el-icon-close finger-cursor" @click="closeInstanceInfo"></i>
            </div>
            
            <div class="selTime">
                <button @click="selTimeFn(1)" :class="{'ml20':true, 'color-primary-btn': selTimeData === 1}">1小时</button>
                <button @click="selTimeFn(6)" :class="{'color-primary-btn': selTimeData === 6}">6小时</button>
                <button @click="selTimeFn(24)" :class="{'color-primary-btn': selTimeData === 24}">1天</button>
                <button @click="selTimeFn(168)" :class="{'mr30':true, 'color-primary-btn': selTimeData === 168}">7天</button>
                <el-date-picker
                v-model="chartSearchObj.datetimerange"
                type="datetimerange"
                size="small"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']">
                </el-date-picker>
                <a class="font12 ml20 finger-cursor">设置报警规则</a>
            </div>
            
            <div class="lineInfo">
                <div class="lineInfo-item pl20">
                    <div class="ml10 mb20">CPU使用率</div>
                    <charts-line :chart-data="cpuChartData.datas" :chartExtendData="cpuChartData.chartExtendData" :settings="cpuChartData.settings" height="180px">
                    </charts-line>
                </div>
                <div class="lineInfo-item pl20">
                    <div class="ml10 mb20">外网网络</div>
                    <charts-line :chart-data="netChartData.datas" :chartExtendData="netChartData.chartExtendData" :settings="netChartData.settings" height="180px">
                    </charts-line>
                </div>
            </div>
        </div> -->

        <!-- HelpDialog -->
        <help-dialog ref="HelpDialog"></help-dialog>

        <!-- 对话框 停止实例 -->
        <stop-inst-dialog ref="stopInstDialog" />
        <!-- 对话框 修改信息 -->
        <modify-info-dialog ref="ModifyInfoDialog" />
        <!-- 对话框 编辑标签 -->
        <!-- <edit-label-dialog ref="editLabelDialog"/> -->
        <!-- 对话框 远程登录指导 -->
        <telnet-guide-dialog ref="telnetGuideDialog" />
        <!-- 对话框 修改实例名称 -->
        <amend-name-dialog ref="amendNameDialog" />
        <!-- 对话框 删除 -->
        <delete-dialog ref="deleteDialog" />
        <!-- 对话框 删除 -->
        <delete-inst-dialog ref="deleteInstDialog" />
        <!-- 对话框 创建自定义镜像 -->
        <custom-image-dialog ref="CustomImageDialog"/>
        <!-- 对话框 更换系统磁盘 -->
        <!-- <rep-sys-disk-dialog ref="RepSysDiskDialog"/> -->
        <!-- 对话框 更换系统磁盘二级对话框 -->
        <!-- <rep-sys-disk-option-dialog ref="RepSysDiskOptionDialog"/> -->

        <!-- 对话框 重启强制重启实例 -->
        <restart-inst-dialog ref="restartInstDialog" />
        <!-- 对话框 启动实例 -->
        <start-inst-dialog ref="startInstDialog" />
        <!-- 对话框 修改远程链接密码 -->
        <modify-remote-pwd ref="modifyRemotePwd" />
        <!-- 重置密码 -->
        <reset-password ref="resetPassword" />
        <!-- 对话框 绑定公网IP -->
        <bind-public-ip-dialog :opType="opType" ref="bindPublicIpDialog" />
        <!-- 对话框 绑定连接IP -->
        <bind-link-ip-dialog :opType="opType" ref="bindLinkIpDialog" />
        <!-- 手机验证弹框 -->
        <mobile-code-dialog ref="mobileCodeDialog" :code-type="CHECK"></mobile-code-dialog>

    </div>
</template>
<script src="./EcsInstList.js"></script>
<style lang='scss'>
.ecs-list-page {
    min-height: 550px;

    .pd9 {
        padding: 9px !important;
    }
    .retrieval {
        .retrievalItem {
            background-color: #f6f8fa;
            border: 1px solid #d1d5de;
            padding: 2px 5px;
            margin-right: 5px;
        }
    }
    .instanceInfo {
        box-shadow: 0px 5px 5px #e8e8e8;
        border-radius: 0;
        border: #f3f5fa 1px solid;
        width: auto;
        background-color: #fff;
        position: fixed;
        bottom: -320px;
        right: 15px;
        left: 315px;
        height: 320px;
        overflow: hidden;
        z-index: 99;
        transition: all 0.5s;
        -moz-transition: all 0.5s; /* Firefox 4 */
        -webkit-transition: all 0.5s; /* Safari 和 Chrome */
        -o-transition: all 0.5s;
        .name {
            border-bottom: 1px solid #f3f5fa;
            padding: 5px 0px 5px 20px;
            i {
                float: right;
                font-weight: bold;
                margin-right: 10px;
            }
        }
        .selTime {
            padding: 12px 0;
            button {
                width: 60px;
                height: 32px;
                border: 1px solid #d1d5de;
                background-color: #fff;
                margin-right: 5px;
            }
        }
        .lineInfo {
            display: flex;
            .lineInfo-item:first-child {
                border-right: 1px solid #dadde0;
            }
            .lineInfo-item {
                flex: 1;
            }
        }
    }

    .instanceInfo1 {
        left: 165px;
    }
    .instanceInfo2 {
        left: 65px;
    }
    .instanceInfo3 {
        left: 215px;
    }
    .instanceInfo4 {
        bottom: 0px;
    }

    .copy {
        top: 1px;
    }
    .hoverToShowContent {
        .hoverToShow {
            display: none;
        }

        &:hover .hoverToShow {
            display: inline-block;
        }
    }

    .pd0 .cell {
        padding: 0;
    }

    .right-btn {
        margin-bottom: -2px;
    }

    .status-column {
        .zticon {
            font-size: 14px;
        }
    }
}
</style>
