<template>
    <el-dialog title="设置自动快照策略" :visible.sync="isShow" width="1200px" class="SetDiskDialog" @close="cancel">
        <div class="setDisk">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="notSet set">
                        <div class="head mb20">
                            <div class="left">
                                <b class="leftBlueBox"></b>
                                <span class="ml10">未设置快照磁盘</span>
                            </div>
                            <div class="right">
                                <el-select v-model="searchObjExtra.selFieldL.field" size="small" filterable placeholder="请选择">
                                    <el-option v-for="item in searchObjExtra.fields" :key="item.field" :label="item.label" :value="item.field">
                                    </el-option>
                                </el-select>
                                <el-input class="ml10 noSetInput" v-model="searchObjExtra.selFieldL.inputval" size="small"></el-input>
                            </div>
                        </div>
                        <!-- 列表 -->
                        <div>
                            <el-table class="data-list" :data="unsetDisk" max-height="400" v-loading="loading" header-row-class-name="data-list" style="width: 100%">
                                <template v-for="col in cols">
                                    <!-- 磁盘名称 -->
                                    <template v-if="col.column=='diskName'">
                                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                            <template slot-scope="scope">
                                                <ul>
                                                    <li v-tooltip="{content: scope.row.id, fold: true}">
                                                        <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                                    </li>
                                                    <li v-tooltip="{content: scope.row.name, fold: true}">
                                                        <span class="font12">{{scope.row.name}}</span>
                                                    </li>
                                                </ul>
                                            </template>
                                        </el-table-column>
                                    </template>
                                    <!-- 实例名称 -->
                                    <template v-if="col.column=='name'">
                                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                            <template slot-scope="scope">
                                                <ul v-if="scope.row.attachments.length">
                                                    <li v-tooltip="{content: scope.row.attachments[0].serverId, fold: true}">
                                                        <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.attachments[0].serverId}}">{{ scope.row.attachments[0].serverId }}</router-link>
                                                    </li>
                                                    <li>
                                                        <span class="font12 mr10">{{scope.row.attachments[0].hostname}}</span>
                                                    </li>
                                                </ul>
                                                <span v-else> - </span>
                                            </template>
                                        </el-table-column>
                                    </template>
                                    <!-- 磁盘种类 -->
                                    <!-- <template v-if="col.column=='diskType'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.type">{{scope.row.volume_type}}</span>
                                    </template>
                                </el-table-column>
                            </template> -->
                                    <!-- 磁盘属性 -->
                                    <template v-if="col.column=='bootable'">
                                        <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filter-multiple="false" :filters="col.dropdowns" :filter-method="filterHandler">
                                            <template slot-scope="scope">
                                                {{scope.row.bootable ? '系统盘' : '数据盘' }}
                                            </template>
                                        </el-table-column>
                                    </template>
                                </template>
                                <!-- 操作 -->
                                <template>
                                    <el-table-column label="操作" key="op" width="50">
                                        <template slot-scope="scope">
                                            <!-- 选择 -->
                                            <span @click="selDisk(scope.row.id)" class="color-primary finger-cursor">选择</span>
                                        </template>
                                    </el-table-column>
                                </template>
                            </el-table>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="alreadySet set">
                        <div class="head mb20">
                            <div class="left">
                                <b class="leftBlueBox"></b>
                                <span class="ml10">已设置快照磁盘</span>
                            </div>
                            <div class="right">
                                <el-select v-model="searchObjExtra.selFieldR.field" size="small" placeholder="请选择">
                                    <el-option v-for="item in searchObjExtra.fields" :key="item.field" :label="item.label" :value="item.field">
                                    </el-option>
                                </el-select>
                                <el-input class="ml10 noSetInput" v-model="searchObjExtra.selFieldR.inputval" size="small"></el-input>
                            </div>
                        </div>
                        <!-- 列表 -->
                        <div>
                            <el-table class="data-list" :data="alreadyDisk" max-height="400" v-loading="loading" header-row-class-name="data-list" style="width: 100%">
                                <template v-for="col in cols">
                                    <!-- 磁盘名称 -->
                                    <template v-if="col.column=='diskName'">
                                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                            <template slot-scope="scope">
                                                <ul>
                                                    <li v-tooltip="{content: scope.row.name, fold: true}">
                                                        <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                                    </li>
                                                    <li v-tooltip="{content: scope.row.name, fold: true}">
                                                        <span class="font12">{{scope.row.name}}</span>
                                                    </li>
                                                </ul>
                                            </template>
                                        </el-table-column>
                                    </template>
                                    <!-- 实例名称 -->
                                    <template v-if="col.column=='name'">
                                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                            <template slot-scope="scope">
                                                <ul v-if="scope.row.attachments.length">
                                                    <li v-tooltip="{content: scope.row.attachments[0].serverId, fold: true}">
                                                        <router-link :to="{name:'app.ecs.inst.detail',params:{id:scope.row.attachments[0].serverId}}">{{ scope.row.attachments[0].serverId }}</router-link>
                                                    </li>
                                                    <li v-tooltip="{content: scope.row.attachments[0].hostname, fold: true}">
                                                        <span class="font12 mr10">{{scope.row.attachments[0].hostname}}</span>
                                                    </li>
                                                </ul>
                                                <span v-else> - </span>
                                            </template>
                                        </el-table-column>
                                    </template>
                                    <!-- 磁盘种类 -->
                                    <!-- <template v-if="col.column=='diskType'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.type">{{scope.row.type}}</span>
                                    </template>
                                </el-table-column>
                            </template> -->
                                    <!-- 磁盘属性 -->
                                    <template v-if="col.column=='bootable'">
                                        <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filter-multiple="false" :filters="col.dropdowns" :filter-method="filterHandler">
                                            <template slot-scope="scope">
                                                {{scope.row.bootable ? '系统盘' : '数据盘' }}
                                            </template>
                                        </el-table-column>
                                    </template>
                                </template>
                                <!-- 操作 -->
                                <template>
                                    <el-table-column label="操作" key="op" width="50">
                                        <template slot-scope="scope">
                                            <!-- 选择 -->
                                            <span @click="cancelDisk(scope.row.id)" class="color-primary finger-cursor">取消</span>
                                        </template>
                                    </el-table-column>
                                </template>
                            </el-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" size="small" @click="isShow = false" :disbled="setting">取 消</el-button>
            <el-button type="primary" size="small" @click="confirm" :loading="setting">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {getDiskList, setDiskSnapshotPolicy} from '@/service/ecs/disk/disk.js';
export default {
    data() {
        let cols = [
            {column: 'diskName', text: '磁盘ID/磁盘名称', width: '20%'},
            {column: 'name', text: '实例ID/实例名称', width: '4%'},
            {
                column: 'diskType',
                text: '磁盘种类',
                width: '4%',
                dropdowns: [{key: 0, text: '全部', state: true, value: ''}, {key: 1, text: 'SSD云盘', state: false, value: 'SSD'}, {key: 2, text: '高效云盘', state: false, value: 'SATA'}]
            },
            {
                column: 'bootable',
                text: '磁盘属性',
                width: '4%',
                dropdowns: [{key: 0, text: '全部', state: true, value: ''}, {key: 1, text: '系统盘', state: false, value: true}, {key: 2, text: '数据盘', state: false, value: false}]
            }
        ];

        let fields = [{field: 'name', label: '磁盘名称', inputval: ''}, {field: 'id', label: '磁盘ID', inputval: ''}];
        let searchObjExtra = {
            fields,
            selFieldL: {
                field: '',
                inputval: ''
            },
            selFieldR: {
                field: '',
                inputval: ''
            }
        };
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            setting: false,
            searchObjExtra,
            cols,
            rowItem: {},
            tableData: []
        };
    },
    props: {},
    computed: {
        unsetDisk: function() {
            let data = this.tableData;
            return data.filter(item => {
                $log(item);
                if (this.searchObjExtra.selFieldL.inputval !== '') {
                    return (!item.hasOwnProperty('policy_id') || item.policy_id === null) && item[this.searchObjExtra.selFieldL.field].includes(this.searchObjExtra.selFieldL.inputval);
                } else {
                    return !item.hasOwnProperty('policy_id') || item.policy_id === null;
                }
            });
        },
        alreadyDisk: function() {
            let data = this.tableData;
            return data.filter(item => {
                if (this.searchObjExtra.selFieldR.inputval !== '') {
                    return item.hasOwnProperty('policy_id') && item.policy_id && item[this.searchObjExtra.selFieldR.field].includes(this.searchObjExtra.selFieldR.inputval);
                } else {
                    return item.hasOwnProperty('policy_id') && item.policy_id;
                }
            });
        }
    },
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.isShow = true;
            this.getDiskList();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.tableData = [];
            this.rowItem = {};
            this.alreadyTableData = [];
        },
        cancel() {
            typeof this.reject() === 'function' && this.reject();
        },
        confirm() {
            if (!this.rowItem.pid) return;
            let ids = [];
            this.alreadyDisk.forEach(item => {
                ids.push(item.id);
            });
            if (ids.length === 0) {
                this.$alert('请选择磁盘', '提示', {
                    type: 'warning'
                });
                return;
            }
            let data = {
                diskIds: ids,
                policyId: this.rowItem.pid,
                sourcePage: 'policy-page'
            };
            this.setting = true;
            setDiskSnapshotPolicy(data)
                .then(res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) {
                        this.resolve(ids.length);
                        this.hide();
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.setting = false;
                });
        },

        filterHandler(value, row, column) {
            const property = column['property'];
            $log(column);
            return row[property] === value || value === '';
        },

        getDiskList() {
            let params = {
                limit: 9999,
                pageIndex: 1,
                policyId: this.rowItem.pid
                //[this.searchObjExtra.selFieldL.field]: this.searchObjExtra.selFieldL.inputval
            };
            this.loading = true;
            getDiskList(params)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getDiskList', res);
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.tableData = resData.data || [];
                        }
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // getDiskLinked(rowItem) {
        //     let params = {
        //         limit: 9999,
        //         pageIndex: 1,
        //         policy_id: this.rowItem.pid
        //         //[this.searchObjExtra.selFieldR.field]: this.searchObjExtra.selFieldR.inputval
        //     };
        //     this.seted = true;
        //     this.getDiskBySnapshotPolicy(params, 'seted');
        // },

        /**
         * 选择快照磁盘
         */
        selDisk(id) {
            let index = this.tableData.findIndex(item => {
                return item.id === id;
            });
            if (index !== -1) this.$set(this.tableData[index], 'policy_id', this.rowItem.pid);
        },
        /**
         * 取消快照磁盘
         */

        cancelDisk(id) {
            let index = this.tableData.findIndex(item => {
                return item.id === id;
            });
            if (index !== -1) this.$set(this.tableData[index], 'policy_id', null);
        }
    }
};
</script>
<style lang="scss">
.SetDiskDialog {
    padding: 0 40px;
    .setDisk {
        .set {
            flex: 1;
            .head {
                display: flex;
                width: 100%;
                line-height: 32px;
                .left {
                    flex: 1;
                }
                .right {
                    flex: 2;
                    text-align: right;
                }
                .el-select {
                    width: 100px;
                }
                .noSetInput {
                    width: 200px;
                }
            }
        }
        .notSet {
            border-right: 1px solid #e2e2e2;
            padding-right: 20px;
        }
        .alreadySet {
            padding-left: 20px;
        }
    }
}
</style>
