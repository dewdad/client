import LabelDropdown from '@/components/label/LabelDropdown';
import Retrieval from '@/components/retrieval/retrieval';
import searchBox from '@/components/search/SearchBox';
import CreateSnapDialog from './../inst/ecsDialog/CreateSnapDialog';
import CreateBackDialog from './dialog/CreateBackDialog';
import ModifyDiskDescripDialog from './../inst/ecsDialog/ModifyDiskDescripDialog';
import ModifyDiskPropDialog from './../inst/ecsDialog/ModifyDiskPropDialog';
import MountDataDisk from './dialog/MountDataDisk';
import EditName from './dialog/EditName';
import {getDiskList, resizeDisk, unmoutDisk, releaseDisk} from '@/service/ecs/disk/disk.js';

let statusArr = [
    {text: '全部', state: true, value: ''},
    {
        text: '使用中',
        state: false,
        value: 'in-use',
        className: 'color-success',
        icon: 'zticon-running_people'
    },
    {
        text: '待挂载',
        value: 'available',
        className: 'color-primary',
        icon: 'zticon-recentcreation_peop'
    },
    {
        text: '恢复失败',
        value: 'error-restoring',
        className: 'color-danger',
        icon: 'icon-shibaibaocuo',
        type: 'font'
    }
];
export default {
    name: 'ClouddiskTable',
    components: {
        // PageHeader,
        // RegionRadio,
        LabelDropdown,
        Retrieval,
        CreateSnapDialog,
        CreateBackDialog,
        ModifyDiskDescripDialog,
        ModifyDiskPropDialog,
        MountDataDisk,
        searchBox,
        EditName
    },
    props: {
        isShowSearch: {
            type: Boolean,
            default: false
        },
        instanceId: {
            type: String,
            default: ''
        }
    },
    data() {
        let fields = [{field: 'name', label: '磁盘名称', inputval: ''}, {field: 'id', label: '磁盘ID', inputval: ''}];
        let searchObjExtra = {
            frominfo: '',
            fields: fields,
            selField: fields[0]
        };

        let cols = [
            {column: 'name', text: '磁盘ID/磁盘名称', width: '20%'},
            {
                column: 'size',
                text: '磁盘容量',
                width: '4%'
            },
            {
                column: 'diskStatus',
                text: '磁盘状态',
                width: '4%',
                dropdowns: statusArr
            },
            {column: 'mounted', text: '挂载到', width: '4%'},
            {column: 'desc', text: '磁盘描述', width: '4%'},
            {
                column: 'createTime',
                text: '创建时间',
                width: '4%'
            }
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
            extra: {
                //startTime:'',
                //endTime:'',
                //orderBy:'', //排序字段
                //ascOrDesc: '', //'DESC'、'ASC'  //descend 降序,ascend 升序
            }
        };
        let allLabelData = [
            {labelKey: 'dded', labelvalue: 'fddff'},
            {labelKey: 'ddd', labelvalue: 'fff2'},
            {labelKey: '2ddd', labelvalue: 'f3ff'},
            {labelKey: 'dd1', labelvalue: 'fddff'},
            {labelKey: 'dd2', labelvalue: 'fff2'},
            {labelKey: '2d3d', labelvalue: 'f3ff'}
        ];
        return {
            loading: false,
            searchObjExtra,
            statusArr,
            cols,
            tableData: [],
            searchObj,
            inlineForm: {
                field: '',
                value: ''
            },
            labelQueryData: [],
            allLabelData,
            fieldValue: '',
            retrievalData: [],
            selectLabelList: [],
            showId: '',
            status: ''
        };
    },
    created() {
        this.getDiskList();
    },
    methods: {
        filterHandler(filters) {
            let values = Object.values(filters);
            let value = values[0][0];
            if (value) {
                this.status = value;
            } else {
                this.status = '';
            }
            this.getDiskList();
        },
        search(params) {
            $log(params);
            this.inlineForm.field = params.selValue.field;
            this.inlineForm.value = params.selInputValue;
            this.searchObj.paging.pageIndex = 1;
            this.getDiskList();
        },
        //获取云盘列表数据
        getDiskList() {
            let params = {
                paging: this.searchObj.paging,
                fileds: {
                    [this.inlineForm.field]: this.inlineForm.value
                },
                status: this.status
            };
            this.loading = true;
            this.tableData = [];
            getDiskList(params)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getDiskList', res);
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.tableData = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total || 0;
                            console.log('getInstanceDetail tableData', this.tableData);
                        }
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSizeChange: function(params) {
            console.log('params:', params);
        },

        handleCurrentChange: function(params) {
            this.searchObj.paging.pageIndex = params;
            this.getDiskList();
        },
        /**
         * 编辑磁盘名称
         * @param {*} rowItem
         */
        editinstname(rowItem) {
            this.$refs.EditName.show(rowItem).then(res => {
                this.getDiskList();
            });
        },

        //卸载
        unmountDisk(rowItem) {
            let msg = {};
            switch (rowItem.isBoot) {
                case '1': {
                    msg.diskType = '系统盘';
                    msg.alertInfo = `
                    1、云硬盘卸载前，请保证该云硬盘在操作系统内的逻辑磁盘已通过unmount等命令进行卸载操作。<br/>
                    2、云硬盘卸载后，数据无法再写入对应云硬盘。                           
                    `;
                    break;
                }
                case '0': {
                    msg.diskType = '数据盘';
                    msg.alertInfo = `
                    1、云服务器卸载系统盘后，将无法登录及使用。<br/>
                    2、云服务器卸载系统盘后，如需重新挂载系统盘，请注意只能挂载与原服务器镜像相同的系统盘，否则会挂载失败。
                    `;
                    break;
                }
                default: {
                }
            }
            const h = this.$createElement;
            let message = h('div', null, [
                h('p', {class: {font16: true, mt10: true}}, `您确认要卸载此${msg.diskType}吗？`),
                h('el-alert', {props: {type: 'warning', closable: false}}, [
                    h('p', {
                        attr: {slot: 'description'},
                        domProps: {
                            innerHTML: msg.alertInfo
                        }
                    })
                ])
            ]);
            //卸载磁盘
            this.$confirm(message, '卸载磁盘').then(() => {
                //提交后台,卸载磁盘
                unmoutDisk({disk_id: rowItem.id}).then();
            });
        },

        //释放磁盘
        releaseDisk(rowItem) {
            const h = this.$createElement;
            let message = h('div', null, [
                h('p', {class: {font16: true, mt10: true}}, `您确认要释放本磁盘吗？`),
                h('el-alert', {props: {type: 'warning', closable: false}}, [
                    h('p', {
                        attr: {slot: 'description'},
                        domProps: {
                            innerHTML: `
                            1.释放磁盘前，请先删除磁盘的快照，否则无法释放磁盘。<br/>
                            2.如果已为磁盘设置了"快照随磁盘释放"，则快照会随磁盘一起被删除。<br/>
                            3.磁盘释放后，数据将被永久清除，无法恢复，请谨慎操作。
                            `
                        }
                    })
                ])
            ]);
            //释放磁盘
            this.$confirm(message, '释放磁盘').then(() => {
                //提交后台,释放磁盘
                releaseDisk({disk_id: rowItem.id}).then();
            });
        },

        //云盘扩容
        resizeDisk() {
            //提交后台
            resizeDisk();
        },

        /**
         * 编辑标签
         */
        editLabel: function(rowItem) {
            console.log('editLabel:', rowItem);
            this.$refs.editLabelDialog
                .show(rowItem, 1, 2)
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

        getSelLabelList(data) {
            this.retrievalData = data;
        },
        getRetrieval(data) {
            this.selectLabelList = data;
        },
        /**
         * 创建快照
         */
        createSnap: function(rowItem) {
            console.log('editLabel:', rowItem);
            this.$refs.CreateSnapDialog.show(rowItem)
                .then(ret => {
                    this.$message.success('操作成功');
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
         * 创建备份
         */
        createBack: function(rowItem) {
            this.$refs.CreateBackDialog.show(rowItem)
                .then(ret => {})
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        /**
         * 修改磁盘描述
         */
        modifyDiskDescrip: function(rowItem) {
            console.log('editLabel:', rowItem);
            this.$refs.ModifyDiskDescripDialog.show(rowItem)
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
         * 修改磁盘属性
         */
        modifyDiskProp: function(rowItem) {
            console.log('editLabel:', rowItem);
            this.$refs.ModifyDiskPropDialog.show(rowItem)
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
         * 挂载数据盘
         */
        mountDataDiskFn(rowItem) {
            console.log('MountDataDisk:', rowItem);
            this.$refs.MountDataDisk.show(rowItem)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.$message.success('操作成功');
                    this.getDiskList();
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
         * 更多菜单指令事件
         */
        handleCommand({handle, rowItem}) {
            if (!handle && !rowItem) return;
            if (handle && this[handle]) {
                this[handle](rowItem);
            }
        },
        /**
         * 进入单元格
         */
        showEditName(row, column, cell, event) {
            this.showId = row.id;
        }
    }
};
