<template>
    <div class="page-main">
        <page-header>
            云主机
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText = ''">
                            <el-option label="部门名称" value="domain_name"></el-option>
                            <el-option label="租户名称" value="project_name"></el-option>
                            <el-option label="名称" value="name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="ecsList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="ecsList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 部门 -->
                        <template v-if="col.column=='dept'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.domain_name}}</span>

                                </template>
                            </el-table-column>
                        </template>
                        <!-- 租户 -->
                        <template v-if="col.column=='renter'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.project_name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <a class="font12 mr10" @click="showDetail(scope.row)">{{scope.row.name}}</a>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='net'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <p class="font12 mr10 color999">{{returnName(scope.row.addresses.addresses)}}</p>
                                    <p class="font12 mr10 ">{{returnValue(scope.row.addresses.addresses)}}</p>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='setting'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.flavor.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="80" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <zt-status :status="ECS_STATUS" :value="scope.row.status" class="text-nowrap status-column font12"></zt-status>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='creatTime'">
                            <el-table-column min-width="140" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.created | date}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="bootEcs(scope.row,'start')" class="btn-linker" v-if="scope.row.status == 'SHUTOFF' || scope.row.status == 'STOPPED' ">启动</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'SHUTOFF' || scope.row.status == 'STOPPED' "></b>
                                <a  @click="rebootEcs(scope.row)" class="btn-linker" v-if="scope.row.status == 'ACTIVE' ">重启</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'ACTIVE' "></b>
                                <a  @click="bootEcs(scope.row,'stop')" class="btn-linker" v-if="scope.row.status == 'ACTIVE' ">关机</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'ACTIVE' "></b>
                                <el-dropdown>
                                            <span class="btn-linker">
                                                更多
                                                <i class="el-icon-arrow-down el-icon--right"></i>
                                            </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="delEcs(scope.row)">删除</el-dropdown-item>
                                        <el-dropdown-item @click.native="serverGetVNCConsole(scope.row)">远程连接</el-dropdown-item>
                                        <el-dropdown-item @click.native="bootEcs(scope.row,'pause')" v-if="scope.row.status != 'PAUSED'">暂停</el-dropdown-item>
                                        <el-dropdown-item @click.native="bootEcs(scope.row,'unpause')" v-if="scope.row.status == 'PAUSED'">解除暂停</el-dropdown-item>
                                        <!--<el-dropdown-item @click.native="Virtualmig(scope.row)">云主机热迁移</el-dropdown-item>-->
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination background
                   @current-change="currentChange"
                   @size-change="handleSizeChange"
                   :current-page="searchObj.paging.pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="searchObj.paging.limit"
                   layout="sizes, prev, pager, next"
                   :total="searchObj.paging.totalItems">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import ZtStatus from '@/components/status/ZtStatus';
import {ecsList,delEcs,rebootEcs,bootEcs,serverGetVNCConsole,Virtualmig} from '@/service/cloudres.js';
export default {
    name: 'app',

    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'dept', text:'部门' , width: '10%'},
            { column: 'renter', text:'租户' , width: '10%'},
            { column: 'name', text: '名称', width: '10%' },
            { column: 'net', text: '网络', width: '10%' },
            { column: 'setting', text: '配置', width: '10%' },
            { column: 'status', text: '状态', width: '5%' },
            { column: 'creatTime', text: '创建时间', width: '10%' }
        ];
        const ECS_STATUS = [
            {
                text: '关机',
                value: 'SHUTOFF',
                className: 'color-danger',
                icon: 'icon-workorder_attachmen'
            },
            {
                text: '运行中',
                value: 'active',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '运行中',
                value: 'ACTIVE',
                className: 'color-success',
                icon: 'icon-running_people'
            },
            {
                text: '暂停',
                value: 'PAUSED',
                className: 'color-danger',
                icon: 'icon-workorder_attachmen'
            },
            {
                text: '失败',
                value: 'ERROR',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '关机',
                value: 'STOPPED',
                className: 'color-danger',
                icon: 'icon-overdue_people'
            },
            {
                text: '待重启',
                value: 'WAIT_REBOOT',
                className: 'color-warning',
                icon: 'zticon-running_people'
            },
            {
                text: '创建中',
                value: 'build',
                className: 'color-primary',
                type: 'progress'
            },
            {
                text: '停止中',
                value: 'SHUTDOWN',
                className: 'color-danger',
                type: 'progress'
            },
            {
                text: '调整套餐中',
                value: 'resize',
                className: 'color-progress-warning',
                type: 'progress'
            },
            {
                text: '重启中',
                value: 'hard_reboot',
                className: 'color-success',
                type: 'progress'
            },
            {
                text: '重启中',
                value: 'reboot',
                className: 'color-success',
                type: 'progress'
            },
            {
                text: '启动中',
                value: 'STARTUP',
                className: 'color-success',
                type: 'progress'
            },
            {
                text: '重装中',
                value: 'rebuild',
                className: 'color-progress-info',
                type: 'progress'
            },
            {
                text: '确认中',
                value: 'verify_resize',
                className: 'color-danger',
                type: 'progress'
            },
            {
                text: '删除中',
                value: 'deleted',
                className: 'color-progress-warning',
                type: 'progress'
            },
            {
                text: '恢复中',
                value: 'revert_resize',
                className: 'color-progress-warning',
                type: 'progress'
            },
            {
                text: '挂起',
                value: 'suspended',
                className: 'color-primary',
                icon: 'zticon-stop'
            },
            {
                text: '未知',
                value: 'unknown',
                className: 'color-danger',
                icon: 'zticon-stop'
            }
        ];

        return {
            ECS_STATUS,
            cols,
            searchObj,
            formInline: {
                searchText:''
            },
            type:'domain_name',
            tableData: []

        };
    },
    components: {
        PageHeader,
        ZtStatus


    },
    methods: {
        ecsList(){
            let params = {
                paging:this.searchObj.paging,
            };
            if(this.type && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            $log('params', params);
            ecsList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.resultList){
                    this.tableData = resData.resultList || [];
                    this.searchObj.paging.totalItems = resData.totalRows || 0;
                }

            });
        },

        returnName(item){
            for(let key in item){
                return key;
            }
        },
        returnValue(item){
            for(let key in item){
                return item[key][0].address;
            }
        },

        getStatusText(status){
            let outstr = '';
            if(status){
                switch(status){
                    case 'ACTIVE': { outstr = '运行';break;}
                    case 'SHUTOFF':{ outstr = '关机';break;}
                    case 'BUILDING':{ outstr = '未完成构建';break;}
                    case 'DELETED':{ outstr = '删除';break;}
                    case 'ERROR':{ outstr = '出错';break;}
                    case 'HARD_REBOOT':{ outstr = '硬重启中';break;}
                    case 'MIGRATING': { outstr = '迁移' ; break ; }
                    case 'PASSWORD':{ outstr = '密码重置';break;}
                    case 'PAUSED':{ outstr = '暂停';break;}
                    case 'REBOOT':{ outstr = '软重启中';break;}
                    case 'REBUILD':{ outstr = '重建';break;}
                    case 'RESCUED':{ outstr = '救援';break;}
                    case 'RESIZED':{ outstr = '关闭';break;}
                    case 'RESIZE':{ outstr = '正在调整配置';break;}
                    case 'VERIFY_RESIZE':{ outstr = '等待确认';break;}
                    case 'REVERT_RESIZE':{ outstr = '放弃调整配置';break;}
                    case 'SOFT_DELETED':{ outstr = '软删除';break;}
                    case 'STOPPED':{ outstr = '停止';break;}
                    case 'SUSPENDED':{ outstr = '挂起';break;}
                    case 'UNKNOWN':{ outstr = '未知';break;}
                    case 'SHELVED_OFFLOADED':{ outstr = '废弃';break;}
                    case 'BUILD':{ outstr = '创建中';break;}
                    default:{ outstr = status; }
                }
            }
            return outstr;
        },
        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.ecsList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.ecsList();
        },
        /** 虚拟机操作
         * item: 行数据对象；
         * operateName： 动作操作选项(pause:暂停;unpause:解除暂停;stop:停止;start:启动;lock:锁定;unlock:解除锁定;suspend: 挂起;
         * resume: 解除挂起;rescue:抢救;unrescue:取消抢救;shelve:搁置;shelveOffload:删除已搁置的实例 ;unshelve:取消搁置)
         * */
        rebootEcs(item){
            rebootEcs(item.id).then(ret=>{
                if(ret.code === '0000'){
                    this.ecsList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            });
        },
        //远程连接
        serverGetVNCConsole(item){
            serverGetVNCConsole(item.id).then(ret=>{
                // window.location.href = ret.data.url;
                window.open(ret.data.url);
            });
        },
        //云主机热迁移
        Virtualmig(item){
            console.log('itemcxssd',item);
            let param = {
                id:item.id,
                param:{
                    host:item.host,
                    serverId:item.id,
                }
            };
            Virtualmig(param).then(ret=>{
                if(ret.code === '0000'){
                    this.ecsList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            });
        },
        bootEcs(item,opName){
            let param = {
                id:item.id,
                type:opName
            };
            bootEcs(param).then(ret=>{
                if(ret.code === '0000'){
                    this.ecsList();
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            });

        },
        showDetail(item){
            return this.$router.push({name:'app.resources.instance.instanceDetail',params:{id:item.id,item:item}});
        },
        del(item){
            delEcs(item.id).then(ret=>{
                if(ret.code === '0000'){
                    this.ecsList();
                    return this.$alert('操作成功','提示');
                }

            });
        },
        /**
         * 删除角色
         */
        delEcs(item) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.del(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },

    mounted(){
        this.ecsList();
    }
};
</script>
<style scoped>
</style>
