<template>
    <div class="page-main">
        <page-header>
            云主机
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="createRole({},1)">-->
                            <!--<span class="icon-zt_plus"></span>-->
                            <!--新建角色-->
                        <!--</el-button>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-select placeholder="请选择" v-model="type">-->
                            <!--<el-option label="角色名称" value="name"></el-option>-->
                            <!--<el-option label="角色名称" value="name"></el-option>-->
                            <!--<el-option label="角色名称" value="name"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="关键字">-->
                        <!--<el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button class="ml10" size="small" type="primary" @click="getRoleList" icon="el-icon-search">搜索</el-button>-->
                    <!--</el-form-item>-->
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
                                    <span class="font12 mr10">{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 租户 -->
                        <template v-if="col.column=='renter'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10" v-if="scope.row.roleType == 1">超级管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 2">部门管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 3">子部门管理员</span>
                                    <span class="font12 mr10" v-if="scope.row.roleType == 4">用户</span>

                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='net'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='setting'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='status'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{getStatusText(scope.row.status)}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='creatTime'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.creatTime | date}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="delEcs(scope.row)" class="btn-linker">删除</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'SHUTOFF' || scope.row.status == 'STOPPED' "></b>
                                <a  @click="bootEcs(scope.row,'start')" class="btn-linker" v-if="scope.row.status == 'SHUTOFF' || scope.row.status == 'STOPPED' ">启动</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'ACTIVE' "></b>
                                <a  @click="rebootEcs(scope.row,'')" class="btn-linker" v-if="scope.row.status == 'ACTIVE' ">重启</a>
                                <b class="link-division-symbol" v-if="scope.row.status == 'ACTIVE' "></b>
                                <a  @click="delRole(scope.row)" class="btn-linker" v-if="scope.row.status == 'ACTIVE' ">关机</a>

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
        <!--<relate-auth ref="RelateAuth"></relate-auth>-->
        <!--<create-role ref="CreateRole"></create-role>-->
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
// import RelateAuth from './RelateAuth';
// import CreateRole from './CreateRole';
import {ecsList,delEcs,rebootEcs,bootEcs} from '@/service/cloudres.js';
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
            { column: 'status', text: '状态', width: '10%' },
            { column: 'creatTime', text: '创建时间', width: '10%' }
        ];

        return {
            cols,
            searchObj,
            formInline: {
                data:'',
                searchText:''
            },
            type:'name',
            tableData: []

        };
    },
    components: {
        PageHeader,
        // RelateAuth,
        // CreateRole
    },
    methods: {
        ecsList(){
            let params = {
                paging:this.searchObj.paging,
                // [this.type]:this.formInline.searchText
            };
            $log('params', params);
            ecsList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        // relateAuth(item){
        //     this.$refs.RelateAuth.show(item)
        //         .then(ret => {
        //             return this.$alert('操作成功','提示');
        //         })
        //         .catch(err => {
        //             if (err) {
        //                 console.log('Error', err);
        //             } else {
        //                 console.log('取消');
        //             }
        //         });
        // },
        createRole(item,optype){
            this.$refs.CreateRole.show(item,optype)
                .then(ret => {
                    this.ecsList();
                    return this.$alert('操作成功','提示');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
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
                this.ecsList();
            });
        },
        bootEcs(item,opName){
            let param = {
                id:item.id,
                type:opName
            };
            bootEcs(param).then(ret=>{
                this.ecsList();
            });

        },
        del(item){
            delEcs(item.id).then(ret=>{
                this.ecsList();
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
