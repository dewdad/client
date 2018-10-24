<template>
    <div class="page-main">
        <page-header>
            免费试用
        </page-header>
        <el-row class="mt20">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" size="small">
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="createOrder({},1)">-->
                            <!--<span class="icon-zt_plus"></span>-->
                            <!--创建工单-->
                        <!--</el-button>-->
                    <!--</el-form-item>-->
                    <el-form-item>
                        <el-select placeholder="请选择" v-model="type" @change="formInline.searchText = ''">
                            <el-option label="名称" value="name"></el-option>
                            <el-option label="状态" value="status"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'name'" @change="clearIndex"></el-input>
                        <el-select placeholder="搜索关键字" v-model="formInline.searchText" v-if="type == 'status'" @change="clearIndex">
                            <el-option v-for="item in approveStatus" :value="item.key" :label="item.value" :key="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml10" size="small" type="primary" @click="freeList" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-zt_refresh" @click="freeList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 工单号 -->
                        <template v-if="col.column=='company'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.company}}</span>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-if="col.column=='email'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.email}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 联系方式 -->
                        <template v-if="col.column=='tel'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.tel}}</span>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-if="col.column=='name'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='approveRemark'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.approveRemark}}</span>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-if="col.column=='userName'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.userName}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-if="col.column=='userPass'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.userPass}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 状态 -->
                        <template v-if="col.column=='status'">
                            <el-table-column width="90" :prop="col.column" :label="col.text" :key="col.column" >
                                <template slot-scope="scope">
                                    <span class="font12 mr10" v-if="scope.row.status == 1">待审批</span>
                                    <span class="font12 mr10" v-if="scope.row.status == 2">审批通过</span>
                                    <span class="font12 mr10" v-if="scope.row.status == 3">审批不通过</span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <a  @click="applyRequest(scope.row)" class="btn-linker" v-if="scope.row.status == 1">审批</a>
                                <!--<b class="link-division-symbol" v-if="scope.row.status == 1"></b>-->
                                <!--<a  @click="reply(scope.row)" class="btn-linker" v-if="scope.row.status == 1">处理</a>-->
                                <!--<b class="link-division-symbol" ></b>-->
                                <!--<a  @click="delOrder(scope.row)" class="btn-linker" >删除</a>-->

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
        <apply-request ref="ApplyRequest"></apply-request>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import ApplyRequest from './ApplyRequest';
import {freeList} from '@/service/usermgr/free.js';
export default {
    name: 'app',

    data() {
        let approveStatus = [
            {key: 3, value: '未通过'},
            {key: 2, value: '通过'},
            {key: 1, value: '待审核'},
        ];
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'company', text:'公司名称' , width: '10%'},
            { column: 'email', text:'邮件地址' , width: '15%'},
            { column: 'name', text: '名称', width: '10%' },
            { column: 'tel', text: '电话', width: '10%' },
            { column: 'approveRemark', text: '审批备注', width: '10%' },
            { column: 'status', text: '审批状态', width: '10%' },
            { column: 'userName', text: '演示账号名', width: '10%' },
            { column: 'userPass', text: '账号密码', width: '10%' },
        ];

        let moduleTypes = [
            {value: 1, label: '弹性云主机',
                orderTypes: [
                    {value: 10, label: '远程连接'},
                    {value: 11, label: '镜像'},
                    {value: 12, label: '安全组配置'},
                    {value: 13, label: '升降配'},
                    {value: 14, label: '磁盘扩容'},
                    {value: 15, label: '挂载磁盘'}
                ]
            },

            {value: 3, label: '对象存储OSS',
                orderTypes: [
                    {value: 30, label: '文件上传/下载'},
                    {value: 31, label: '读写限制'},
                    {value: 32, label: 'SDK/API'},
                    {value: 33, label: '图片处理服务'},
                    {value: 34, label: '域名/监控'},
                    {value: 35, label: '静态页面'},
                    {value: 36, label: '防盗链'},
                    {value: 37, label: '镜像回源'}
                ]
            },
            {value: 6, label: '专有网络VPC',
                orderTypes: [
                    {value: 60, label: 'VPC使用场景'},
                    {value: 61, label: 'VPC配置'},
                    {value: 62, label: '对等连接'},
                    {value: 63, label: '虚拟防火墙'}
                ]
            },            
        ];

        return {
            cols,
            searchObj,
            moduleTypes,
            approveStatus,
            daterange: '',
            formInline: {
                searchText: ''
            },
            type:'name',
            tableData: []

        };
    },
    components: {
        PageHeader,
        ApplyRequest
    },
    methods: {
        freeList(){
            let params = {
                paging:this.searchObj.paging
            };
            if(this.type && this.formInline.searchText){
                params[this.type] = this.formInline.searchText;
            }
            $log('params', params);
            this.tableData = [];
            freeList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                    this.searchObj.paging.totalItems = resData.total || 0;
                }

            });
        },
        applyRequest(item){
            this.$refs.ApplyRequest.show(item).then(ret => {
                $log('data', ret);
                if(ret && ret.approveRemark){
                    this.freeList();
                    return this.$alert('操作成功','提示');
                }
            });
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        clearIndex(){
            if([this.type] && this.formInline.searchText){
                this.searchObj.paging.pageIndex = 1;
            }
        },


        currentChange(val){
            this.searchObj.paging.pageIndex = val;
            this.freeList();
        },
        handleSizeChange (val) {
            this.searchObj.paging.limit = val;
            this.freeList();
        },



    },

    mounted(){
        this.freeList();
    }
};
</script>
<style scoped>
</style>
