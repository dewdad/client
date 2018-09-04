<template>
    <div class="diskSnapshot page-main">
        <page-header>
            <img src="@/assets/images/ecs/disk_icon.svg" width="50" alt=""> {{rowItem.name}}
            <div slot="right">
                <el-button type="info" size="small">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 基本信息 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont color333 icon-user_profile_people mr10"></i>基本信息
            </div>
            <div class="panel-body zt-panel-body-info">
                <table class="table zt-table-info">
                    <tbody>
                        <tr>
                            <td class="br">源磁盘ID：
                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:rowItem.id,item:rowItem}}">{{ rowItem.id }}</router-link>
                            </td>
                            <td class="br">源磁盘名称：
                                <span class="color333">{{rowItem.name || '-'}}</span>
                            </td>
                            <td>源磁盘属性：
                                <span class="color333">{{ rowItem.isBoot === '1' ? '系统盘' : '数据盘' }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="br">源磁盘容量：
                                <span class="color333">{{rowItem.diskSize}}GB</span>
                            </td>
                            <td class="br"></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mb20 font16">快照列表</div>
        <search-box :fields="searchObjExtra.fields" @select="getScreenVal"></search-box>
        <!-- 列表 -->
        <div id="table">
            <el-table class="data-list" @cell-mouse-enter="showEditName" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <!-- 实例名称 -->
                    <template v-if="col.column=='name'">
                        <el-table-column min-width="180" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <ul>
                                    <li>
                                        <span class="font12 mr10">{{scope.row.id}}</span>
                                    </li>
                                    <li>
                                        <span class="font12 mr10">{{scope.row.name}}</span>
                                        <AmendName :scope="scope" v-show="scope.row.name === showId"></AmendName>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 源磁盘ID -->
                    <template v-if="col.column=='diskId'">
                        <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.diskId,item:scope.row}}">{{ scope.row.diskId }}</router-link>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 源磁盘容量 -->
                    <template v-if="col.column=='disksize'">
                        <el-table-column width="80" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{scope.row.diskSize}}GB</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 源磁盘属性 -->
                    <template v-if="col.column=='isBoot'">
                        <el-table-column width="80" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="color333">{{ scope.row.isBoot === '1' ? '系统盘' : '数据盘' }}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 磁盘状态 -->
                    <template v-if="col.column=='diskStatus'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="color090">
                                    <i class="iconfont icon-chenggong mr5"></i>{{showTextByKey(diskStatusArr,scope.row.diskStatus)}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 创建时间 -->
                    <template v-if="col.column=='createTime'">
                        <el-table-column width="150" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="">{{scope.row.createDate}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 保留时间 -->
                    <template v-if="col.column=='retainTime'">
                        <el-table-column width="80" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="">{{scope.row.holeDay === '-1' ? '不限':scope.row.holeDay}}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 状态 -->
                    <template v-if="col.column=='status'">
                        <el-table-column :prop="col.column" width="60" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span class="color090">{{scope.row.snapshotStatus=='available'?'成功':''}}</span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <!-- 操作 -->
                <template>
                    <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                        <template slot-scope="scope">
                            <!-- 快照列表 -->
                            <el-tooltip v-if="scope.row.diskStatus=='in-use'" content="请先卸载磁盘" transition="scale" placement="bottom" effect="light">
                                <span>
                                    <a disabled>回滚磁盘</a>
                                </span>
                            </el-tooltip>
                            <a @click="rollbackDisk(scope.row)" v-else-if="scope.row.diskStatus=='available'" class="color999 finger-cursor">回滚磁盘</a>
                            <span  v-else class="color999 finger-cursor">回滚磁盘</span>
                            <b class="siderbarLeft"></b>
                            <a class="color-primary finger-cursor" @click="deleteSnap(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="pagination">
                <el-pagination background :current-page="searchObj.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchObj.limit" layout="sizes, prev, pager, next" :total="searchObj.totalItems">
                </el-pagination>
            </div>
        </div>

    </div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import AmendName from '@/components/amend/AmendName';
import searchBox from '@/components/search/SearchBox';

import {getDiskList, diskRollback} from '@/service/ecs/disk/disk.js';
import {getSnapshotList, deleteSnapshots} from '@/service/ecs/snapshot.js';
import {showTextByKey} from '@/utils/utils.js';

export default {
    data() {
        let searchObj = {
            //分页
            pageIndex: 1,
            limit: 10,
            totalItems: 0
        };

        let fields = [{field: 'name', label: '快照名称', inputval: ''}, {field: 'id', label: '快照ID', inputval: ''}];

        let searchObjExtra = {
            fields: fields,
            selField: fields[0]
        };
        let cols = [
            {column: 'name', text: '快照ID/名称', width: '20%'},
            {column: 'diskId', text: '源磁盘ID', width: '20%'},
            {column: 'disksize', text: '源磁盘容量', width: '10%'},
            {column: 'isBoot', text: '源磁盘属性', width: '4%'},
            {column: 'diskStatus', text: '源磁盘状态', width: '10%'},
            {column: 'createTime', text: '创建时间', width: '10%'},
            {column: 'retainTime', text: '保留时间', width: '10%'},
            {column: 'status', text: '状态', width: '10%'},
            {column: 'countSnapshot', text: '快照数量', width: '10%'}
        ];
        //磁盘状态
        let diskStatusArr = [
            {key: 'creating', text: '创建中', color: 'orange'},
            {key: 'in-use', text: '使用中', color: 'highgreen'},
            {key: 'available', text: '待挂载', color: 'red'},
            {key: 'error', text: '创建错误', color: 'highred'},
            {key: 'attaching', text: '挂载中', color: 'orange'},
            {key: 'detaching', text: '卸载中', color: 'orange'},
            {key: 'restoring-backup', text: '恢复中', color: 'orange'},
            {key: 'error_restoring', text: '恢复错误', color: 'highred'},
            {key: 'uploading', text: '上传中', color: 'orange'},
            {key: 'downloading', text: '下载中', color: 'orange'},
            {key: 'extending', text: '扩容中', color: 'orange'},
            {key: 'error_extending', text: '扩容错误', color: 'highred'},
            {key: 'deleting', text: '删除中', color: 'orange'},
            {key: 'error_deleting', text: '删除错误', color: 'highred'},
            {key: 'rollbacking', text: '回滚中', color: 'orange'},
            {key: 'error_rollbacking', text: '回滚错误', color: 'highred'}
        ];
        let stateParams = this.$route.params || {};
        return {
            stateParams,
            searchObj,
            rowItem: stateParams.item || {},
            fields,
            diskStatusArr,
            searchObjExtra,
            tableData: [],
            cols,
            showId: ''
        };
    },
    components: {
        PageHeader,
        searchBox,
        AmendName
    },
    created() {
        if (this.stateParams && this.stateParams.item) {
        } else {
            //刷新页面，路由参数item会丢失，则通过id查询磁盘信息
            this.getDiskInfoById(); //获取磁盘信息
        }
        this.getSnapshotList();
    },
    methods: {
        showTextByKey,
        //获取云盘列表数据
        getDiskInfoById() {
            let params = {
                paging: {
                    pageIndex: 1,
                    limit: 10
                },
                id: this.stateParams.id //传入磁盘id
            };
            getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.result;
                    if (resData && resData.records) {
                        this.rowItem = resData.records[0] || {};
                    }
                }
            });
        },
        //查询快照列表
        getSnapshotList() {
            let data = Object.assign({}, this.searchObj);
            data.diskId = this.stateParams.id;
            getSnapshotList(data).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    console.log('getSnapshotList', res);
                    let resData = res.result;
                    if (resData && resData.records) {
                        this.tableData = resData.records || [];
                        this.searchObj.totalItems = resData.total || 0;
                        console.log('getInstanceDetail tableData', this.tableData);
                    }
                }
            });
        },

        //删除快照
        deleteSnap(rowItem) {
            const h = this.$createElement;
            let message = h('div', null, [h('p', {class: {font16: true, mt10: true}}, '您确定要删除快照:' + rowItem.name + '吗？')]);
            //删除确认
            this.$confirm(message, '删除').then(() => {
                //提交后台,删除镜像
                deleteSnapshots(rowItem.id)
                    .then(res => {
                        if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                            this.$message.success('删除成功');
                            this.getSnapshotList(); //查询刷新数据；
                        }
                    })
                    .catch(err => {
                        console.log('deletePolicy err', err);
                    });
            });
        },

        rollbackDisk(rowItem) {
            let diskType = rowItem.isBoot == '0' ? '数据盘' : '系统盘';
            const h = this.$createElement;
            let message = h('div', null, [
                h('el-alert', {props: {type: 'warning', closable: false}}, [
                    h('p', {
                        attr: {slot: 'description'},
                        domProps: {innerHTML: `${diskType}上该时刻之后的数据将被清除。请谨慎操作！<br/>只有停止中的实例和当前磁盘没有创建中的快照才可以回滚磁盘。`}
                    })
                ]),
                h('p', {class: {font16: true, mt10: true}}, `您确定要把磁盘：${rowItem.diskId}的数据回滚到${rowItem.createDate}时刻吗？`)
            ]);
            //回滚磁盘
            this.$confirm(message, '回滚磁盘').then(() => {
                //提交后台,删除镜像
                let data = {
                    disk_id: rowItem.diskId,
                    snapshot_id: rowItem.id
                };
                diskRollback(data)
                    .then(res => {
                        if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                            this.$message.success('操作成功');
                            this.getSnapshotList(); //查询刷新数据；
                        }
                    })
                    .catch(err => {
                        console.log('diskRollback err', err);
                    });
            });
        },

        getScreenVal(data) {
            console.warn(data);
            this.getSnapshotList();
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        /**
         * 进入单元格
         */
        showEditName(row, column, cell, event) {
            this.showId = row.id;
        }
    }
};
</script>

<style lang="scss" scoped>
 .zt-table-info td{
     width: 33.3%;
     color: #999999;
 }
 .br{
     border-right: 1px solid #ddd;
 }
 .link-division-symbol{
    margin-right: 8px;
    margin-left: 8px;
    height: 9px;
    display: inline-block;
    border-right: 1px solid #4895d7;
}
</style>
