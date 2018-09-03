<template>
    <el-dialog title="设置自动快照策略" :visible.sync="isShow" width="1200px" class="SetDiskDialog">
        <div class="setDisk">
            <div class="notSet set">
                <div class="head mb20">
                    <div class="left">
                        <b class="leftBlueBox"></b>
                        <span class="ml10">未设置快照磁盘</span>
                    </div>
                    <div class="right">
                        <el-select v-model="searchObjExtra.selFieldL.field" size="small" filterable  placeholder="请选择" >
                            <el-option v-for="item in searchObjExtra.fields" :key="item.field" :label="item.label" :value="item.field">
                            </el-option>
                        </el-select>
                        <el-input class="ml10 noSetInput" v-model="searchObjExtra.selFieldL.inputval" size="small"></el-input>
                    </div>
                </div>
                <!-- 列表 -->
                <div>
                    <el-table class="data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                        <template v-for="col in cols">
                            <!-- 磁盘名称 -->
                            <template v-if="col.column=='diskName'">
                                <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <ul>
                                            <li>
                                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                            </li>
                                            <li>
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
                                        <ul>
                                            <li>
                                                <span class="font12" v-if="!scope.row.instanceId">-</span>
                                                <router-link v-else :to="{name:'app.ecs.inst.detail',params:{id:scope.row.instanceId,item:scope.row}}">{{ scope.row.instanceId }}</router-link>
                                            </li>
                                            <li>
                                                <span class="font12 mr10">{{scope.row.instanceName || '-'}}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘种类 -->
                            <template v-if="col.column=='diskType'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.type">{{scope.row.type}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘属性 -->
                            <template v-if="col.column=='isBoot'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        {{scope.row.isBoot === 1 ? '系统盘' : '数据盘' }}
                                    </template>
                                </el-table-column>
                            </template>
                        </template>
                        <!-- 操作 -->
                        <template>
                            <el-table-column label="操作" key="op" width="50">
                                <template slot-scope="scope">
                                    <!-- 选择 -->
                                    <span @click="selDisk(scope.row)" class="color-primary finger-cursor">选择</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
            <div class="alreadySet set">
                <div class="head mb20">
                    <div class="left">
                        <b class="leftBlueBox"></b>
                        <span class="ml10">已设置快照磁盘</span>
                    </div>
                    <div class="right">
                        <el-select v-model="searchObjExtra.selFieldL.field" size="small" placeholder="请选择">
                            <el-option v-for="item in searchObjExtra.fields" :key="item.field" :label="item.label" :value="item.field">
                            </el-option>
                        </el-select>
                        <el-input class="ml10 noSetInput" v-model="searchObjExtra.selFieldL.inputval" size="small"></el-input>
                    </div>
                </div>
                <!-- 列表 -->
                <div>
                    <el-table class="data-list" :data="alreadyTableData" header-row-class-name="data-list" style="width: 100%">
                        <template v-for="col in cols">
                            <!-- 磁盘名称 -->
                            <template v-if="col.column=='diskName'">
                                <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                                    <template slot-scope="scope">
                                        <ul>
                                            <li>
                                                <router-link :to="{name:'app.ecs.clouddisc.detail',params:{id:scope.row.id,item:scope.row}}">{{ scope.row.id }}</router-link>
                                            </li>
                                            <li>
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
                                        <ul>
                                            <li>
                                                <span class="font12" v-if="!scope.row.instanceId">-</span>
                                                <router-link v-else :to="{name:'app.ecs.inst.detail',params:{id:scope.row.instanceId,item:scope.row}}">{{ scope.row.instanceId }}</router-link>
                                            </li>
                                            <li>
                                                <span class="font12 mr10">{{scope.row.instanceName || '-'}}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘种类 -->
                            <template v-if="col.column=='diskType'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.type">{{scope.row.type}}</span>
                                    </template>
                                </el-table-column>
                            </template>
                            <!-- 磁盘属性 -->
                            <template v-if="col.column=='isBoot'">
                                <el-table-column :prop="col.column" width="100" :label="col.text" :key="col.column" :filters="col.dropdowns" :filter-method="filterHandler">
                                    <template slot-scope="scope">
                                        {{scope.row.isBoot === 1 ? '系统盘' : '数据盘' }}
                                    </template>
                                </el-table-column>
                            </template>
                        </template>
                        <!-- 操作 -->
                        <template>
                            <el-table-column label="操作" key="op" width="50">
                                <template slot-scope="scope">
                                    <!-- 选择 -->
                                    <span @click="cancelDisk(scope.row)" class="color-primary finger-cursor">取消</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
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
                column: 'isBoot',
                text: '磁盘属性',
                width: '4%',
                dropdowns: [{key: 0, text: '全部', state: true, value: ''}, {key: 1, text: '系统盘', state: false, value: '1'}, {key: 2, text: '数据盘', state: false, value: '0'}]
            }
        ];

        let fields = [{field: 'diskName', label: '磁盘名称', inputval: ''}, {field: 'id', label: '磁盘ID', inputval: ''}];
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
            searchObjExtra,
            cols,
            rowItem: {},
            tableData: [],
            alreadyTableData: []
        };
    },
    props: {},
    methods: {
        show(rowItem) {
            this.rowItem = rowItem;
            this.isShow = true;

            this.getDiskUnlinked();
            this.getDiskLinked();

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
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            if (!this.rowItem.pid) return;
            let ids = [];
            this.alreadyTableData.forEach(item => {
                ids.push(item.id);
            });
            let data = {
                disk_ids: ids,
                policy_id: this.rowItem.pid,
                source_page: 'true'
            };
            setDiskSnapshotPolicy(data)
                .then( res => {
                    if (res && res.code === this.CODE.SUCCESS_CODE) { 
                        this.resolve(ids.length);
                        this.hide();
                        //this.setting();                                            
                    }                               
                })
                .catch(
                    err => {
                        this.$alert(err, '提示', {
                            type: 'error'
                        });
                    }
                );                
        },

        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },

        /**根据自动快照策略获取云盘数据
         * params = {
         *     limit:9999, //查全部
         *     pageIndex:1,
         *     snapshotPolicy:'9999' //’9999‘查未关联快照策略的磁盘， 快照策略id查询已关联该策略的磁盘；
         * };
         */
        getDiskBySnapshotPolicy(params) {
            getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    console.log('getDiskList', res);
                    let resData = res.result;
                    if (resData && resData.records) {
                        let datas = resData.records || [];
                        let {snapshotPolicy} = params;
                        if (snapshotPolicy && snapshotPolicy === '9999') {
                            this.tableData = datas; //未设置
                        } else {
                            this.alreadyTableData = datas; //已设置
                        }
                    }
                }
            });
        },

        getDiskUnlinked() {
            let params = {
                limit: 9999,
                pageIndex: 1,
                snapshotPolicy: '9999'
                //[this.searchObjExtra.selFieldL.field]: this.searchObjExtra.selFieldL.inputval
            };
            this.getDiskBySnapshotPolicy(params);
        },

        getDiskLinked(rowItem) {
            let params = {
                limit: 9999,
                pageIndex: 1,
                snapshotPolicy: this.rowItem.pid
                //[this.searchObjExtra.selFieldR.field]: this.searchObjExtra.selFieldR.inputval
            };
            this.getDiskBySnapshotPolicy(params);
        },

        /**
         * 选择快照磁盘
         */
        selDisk(rowItem) {
            this.popAndPushItem(this.tableData, this.alreadyTableData, rowItem);
        },
        /**
         * 取消快照磁盘
         */

        cancelDisk(rowItem) {
            this.popAndPushItem(this.alreadyTableData, this.tableData, rowItem);
        },

        /** ==数据从一个数组里移出，压入到另外一个数组中==
         * rowItem: 数据项或者行数据,假设rowItem.id存在
         * rowItem 从popArr 移出
         * pushArr： rowItem 往pushArr压入
         * */
        popAndPushItem(popArr, pushArr, rowItem) {
            if (popArr && pushArr && rowItem) {
                if (!Array.isArray(pushArr)) return;
                if (!Array.isArray(popArr)) return;
                //rowItem移出popArr
                let index = popArr.findIndex(pItem => pItem.id === rowItem.id);
                if (index > -1) popArr.splice(index, 1);

                //rowItem压入到pushAr前，判断防止重复
                let isExist = pushArr.some(pItem => pItem.id === rowItem.id);
                if (isExist) return;
                //rowItem压入到pushArr
                pushArr.push(rowItem);
            }
        }
    }
};
</script>
<style lang="scss">
.SetDiskDialog {
    padding: 0 40px;
    .setDisk {
        display: flex;
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
