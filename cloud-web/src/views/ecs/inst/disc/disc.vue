<template>
    <div class="page-main">
        <page-header>
            实例列表
            <!-- <region-radio slot="content"></region-radio> -->
            <div slot="right">
                <a type="primary" class="el-button el-button--small el-button--primary font12" target="_blank">创建实例</a>
                <el-button type="info" size="small">
                    <i class="iconfont icon-icon-refresh"></i>
                </el-button>
            </div>
        </page-header>
        <div class="page-body">
            <!-- 筛选操作 -->
            <div class="search-box">
                <zt-form :inline="true" size="small" v-model="fieldValue" class="search-form-inline">
                    <zt-form-item label="">
                        <el-select value-key="field" placeholder="请选择">
                            <el-option v-for="field in searchObjExtra.fields" :label="field.label" :value="field"  :key="field.field"></el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item label="">
                        <el-input placeholder="关键字"></el-input>
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="primary"  icon="el-icon-search">查询</el-button>
                        <label-dropdown :labelList="allLabelData" @select="getSelLabelList"></label-dropdown>
                    </zt-form-item>
                </zt-form>
            </div>
            <!-- 列表 -->
            <div id="table">
                <el-table class="font12" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                    <template v-for="col in cols">
                        <!-- 实例名称 -->
                        <template v-if="col.column=='name'">
                            <el-table-column width="140" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <ul>
                                        <li>
                                            <!-- <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link> -->
                                        </li>
                                        <li>
                                            <span class="font12 mr10 color-primary">{{scope.row.name}}</span>
                                            <el-popover transition="scale-in" placement="top" trigger="hover">
                                                <div>
                                                    <div>设备名 :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                    <div>实例名称/ID :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                    <div>实例状态 :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                    <div>创建时间 :<span class="font12 color-primary">{{scope.row.name}}</span></div>
                                                </div>
                                                <i slot="reference" class="iconfont icon-notice_people font12"></i>
                                            </el-popover>
                                        </li>
                                        <li>
                                            <span class="font12 mr10">{{scope.row.name}}</span>
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 标签 -->
                        <template width="50" v-if="col.column=='lable'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <el-popover transition="scale-in" placement="top" trigger="hover">
                                        <div>
                                            <!-- <div v-if="!!scope.row.labels.length">
                                                <el-row>
                                                    <li v-for="(label,index) in scope.row.labels" :key="index">
                                                        <span>{{ label.labelKey }}:{{ label.labelValue }}</span>
                                                    </li>
                                                </el-row>
                                            </div> -->
                                            <div>
                                                <span class="mr10">{{ $t('common.noData') }}</span>
                                                <a @click="editLabel">{{ $t('ecs.inst.list.dropdownBtns.editLable') }}</a>
                                            </div>
                                        </div>
                                        <i slot="reference" class="iconfont icon-biaoqianmen-tianchong font16"></i>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 磁盘种类 -->
                        <template v-if="col.column=='diskType'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <span v-html="scope.row.diskType"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 磁盘状态 -->
                        <template v-if="col.column=='diskStatus'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                <template slot-scope="scope">
                                    <i class="iconfont icon-step_done_people mr5"></i>
                                    <span class="color090">{{scope.row.diskStatus}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 付费方式 -->
                        <template v-if="col.column=='volume_type'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            </el-table-column>
                        </template>
                        <!-- 可用区 -->
                        <template v-if="col.column=='bootable'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span>{{scope.row.region}}</span>
                                    <br>
                                    <span>{{scope.row.region}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 磁盘属性 -->
                        <template v-if="col.column=='isBoot'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                            </el-table-column>
                        </template>
                        <!-- 快照数量 -->
                        <template v-if="col.column=='countSnapshot'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <a class="zt-numlink">{{scope.row.countSnapshot}}</a>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" width="250">
                            <template slot-scope="scope">
                                <!-- 管理 -->
                                <span class="finger-cursor" v-show="false">管理</span>
                                <!-- 创建快照 -->
                                <span class="color-primary finger-cursor" v-show="cloudDiskShow">创建快照</span>
                                <b class="link-division-symbol" v-show="cloudDiskShow"></b>
                                <!-- 设置自动快照策略 -->
                                <span class="color-primary finger-cursor" v-show="cloudDiskShow">设置自动快照策略</span>
                                <b class="link-division-symbol" v-show="cloudDiskShow"></b>
                                <!-- 更多 -->
                                <el-dropdown v-show="cloudDiskShow" class="font12" trigger="click" placement="bottom-start">
                                    <span class="el-dropdown-link color-primary">
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-tooltip content="Top center" placement="left">
                                            <el-dropdown-item class="color999">挂载</el-dropdown-item>
                                        </el-tooltip>
                                        <el-tooltip content="Top center" placement="left">
                                            <el-dropdown-item class="color999">卸载</el-dropdown-item>
                                        </el-tooltip>
                                        <el-tooltip content="Top center" placement="left">
                                            <el-dropdown-item class="color999">释放</el-dropdown-item>
                                        </el-tooltip>
                                        <el-dropdown-item> 修改磁盘描述</el-dropdown-item>
                                        <el-dropdown-item> 修改磁盘描述</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
        <div class="pagination">
            <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
            </el-pagination>
        </div>
        <!-- 对话框 编辑标签 -->
        <edit-label-dialog ref="editLabelDialog"/>
    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import AllTable from '@/components/table/allTable.vue';
import EditLabelDialog from './../inst/ecsDialog/editLabelDialog';

let fields = [
    { field: 'name', label: '磁盘名称',inputval:'', tagType: 'INPUT' },
    { field: 'ip', label: '磁盘ID',inputval:'', tagType: 'INPUT' },    
];
let searchObjExtra = {
    frominfo: '',
    fields:fields,
    selField:fields[0]
};

let tableData = [
    {
        name: '2016-05-02',
        lable: '王小虎',
        region: '高效云盘',
        ipaddr:'10.3.38.196',
        status:'运行中',
        nettype: '专有网络',
        cfginfo: '配置',
        paytype:'付费方式',
        volume_type:'免费试用',
        diskStatus: '运行中',
        countSnapshot: 0,
        diskType:'高效云盘<br>20GB',

    },
    {
        name: 'd-yjtbeyhgsymp',
        lable: '王小虎',
        region: '高效云盘',
        ipaddr:'10.3.38.196',
        status:'运行中',
        nettype: '专有网络',
        cfginfo: '配置',
        paytype:'付费方式',
        volume_type:'免费试用',
        diskStatus: '运行中',
        countSnapshot: 0,
        diskType:'高效云盘<br>20GB',
        isBoot: '数据盘'
    }
];
let cols = [
    { column: 'name', text: '磁盘ID/磁盘名称', width: '20%' },
    { column: 'lable', text: '标签', width: '4%' },
    { 
        column: 'diskType',
        text: '磁盘种类',
        width: '4%',
        dropdowns: [
            {key: 0, 'text': '全部', 'state': true, value: ''},
            {key: 1, 'text': 'SSD云盘', 'state': false, value: 'SSD'},
            {key: 2, 'text': '高效云盘', 'state': false, value: 'SATA'}
        ] 
    },
    { 
        column: 'diskStatus',
        text: '磁盘状态',
        width: '4%',
        dropdowns: [
            {key: 0, 'text': '全部', 'state': true, value: ''},
            {key: 1, 'text': '使用中', 'state': false, value: 'in-use'},
            {key: 2, 'text': '待挂载', 'state': false, value: 'available'}
        ] 
    },
    { column: 'volume_type', text: '付费方式', width: '4%' },
    { column: 'bootable', text: '可用区', width: '4%' },
    { 
        column: 'isBoot',
        text: '磁盘属性',
        width: '4%',
        dropdowns: [
            {key: 0, 'text': '全部', 'state': true, value: ''},
            {key: 1, 'text': '系统盘', 'state': false, value: '1'},
            {key: 2, 'text': '数据盘', 'state': false, value: '0'}
        ] 
    },
    { column: 'countSnapshot', text: '快照数量', width: '10%' }
];
let searchObj = {    
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    },
    ////需要放入的其它参数
    //params: {},
    //附加查询条件
    extra:{     
        //startTime:'',
        //endTime:'',    
        //orderBy:'', //排序字段
        //ascOrDesc: '', //'DESC'、'ASC'  //descend 降序,ascend 升序  
    }, 
};
let allLabelData = [
    {labelKey: 'dded', labelvalue:'fddff' },
    {labelKey: 'ddd', labelvalue:'fff2' },
    {labelKey: '2ddd', labelvalue:'f3ff' },
    {labelKey: 'dd1', labelvalue:'fddff' },
    {labelKey: 'dd2', labelvalue:'fff2' },
    {labelKey: '2d3d', labelvalue:'f3ff' }
];
export default {
    data() {
        return {
            searchObjExtra,
            cols,
            tableData,
            cloudDiskShow: true,
            searchObj,
            labelQueryData: [],
            allLabelData,
            fieldValue: ''
        };
    },
    methods: {
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        /**
         * 编辑标签
         */
        editLabel:function (rowItem) {
            console.log('editLabel:',rowItem); 
            this.$refs.editLabelDialog
                .show()
                .then(ret => {
                    console.log('操作成功', ret);
                    return this.$confirm('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });           
        },
        /**
         * 获取标签筛选值
         * */ 
        getSelLabelList(data){
            console.warn(data);
        }
    },
    components: {
        PageHeader,
        LabelDropdown,
        AllTable,
        EditLabelDialog
    },
};
</script>

<style scope lang="scss">
#table{
    font-size: 12px;
    .el-table .data-list th{
        line-height: 32px;
        height: 32px;
        border-top: 1px solid #c3c5c6;
        border-right: 0px solid transparent;
        background-color: #f5f6fb;
        color: #999;
        padding: 0px;
        font-size: 12px;
        font-weight: 500;
    }
    .el-table th .cell{
        border-right:1px solid #e8e8e8;
        font-size: 12px;
    }
}
</style>
