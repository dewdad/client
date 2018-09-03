import RegionRadio from '@/components/regionRadio/RegionRadio';
import PageHeader from '@/components/pageHeader/PageHeader';
import SearchBox from '@/components/search/SearchBox';
import ZtStatus from '@/components/status/ZtStatus';
import Backup from './Backup';
import {getList, serverAction} from '@/service/rds/list';
import {cloneDeep, showTextByKey, isObject, isArray, isEmpty} from '@/utils/utils';
import {DICT_RDS} from '@/constants/dicts/rds';

// 表头列
const tableColums = [
    {
        prop: 'name',
        label: '实例ID/名称',
        render: true,
        width: '200px'
    },
    {
        prop: 'status',
        label: '运行状态',
        width: '100px',
        render: true,
        // 数据过滤的选项是否多选
        filterMultiple: false,
        // 选中的数据过滤项
        filteredValue: [''],
        // 数据过滤的选项
        filters: [
            {
                text: '全部',
                value: ''
            },
            ...DICT_RDS.RDS_STATUS
        ]
    },
    {
        prop: 'type',
        label: '实例类型',
        filterMultiple: false,
        filteredValue: [''],
        render: true,
        filters: [
            {
                text: '全部',
                value: ''
            },
            ...DICT_RDS.INST_TYPE
        ]
    },
    {
        prop: 'availabilityZone',
        label: '所在区域',
        render: true
    },
    {
        prop: 'netype',
        render: true,
        label: '网络类型'
    },
    {
        prop: 'createTime',
        render: true,
        label: '创建时间',
        width: '150px'
    },
    {
        prop: 'datatype',
        render: true,
        label: '数据库类型',
        width: '200px'
    }
];
export default {
    name: 'List',
    data() {
        return {
            // 当前区域
            region: '',
            loading: false,
            regions: AREA_CITY.regions,
            searchObjExtra: {
                fields: [
                    {
                        label: '实例名称',
                        field: 'name'
                    }
                ]
            },
            // 查询参数
            searchParams: {
                name: '',
                status: '',
                type: ''
            },
            DICT_RDS,
            // 存储类型
            volumeType: DICT_RDS.VOLUME_TYPE,
            // 表列
            tableColums,
            // 表行数据
            dataList: [],
            // 当前选中操作实例
            currentRow: {
                instId: '',
                instName: ''
            }
        };
    },
    watch: {
        region: function(newval, oldval) {}
    },
    components: {
        RegionRadio,
        PageHeader,
        SearchBox,
        ZtStatus,
        Backup
    },
    created() {
        this.getList();
    },
    methods: {
        // 行数据的 Key，用来优化 Table 的渲染
        setRowKey(row) {
            return row.id;
        },
        // 当表格的筛选条件发生变化的时候会触发该事件
        filterChange(filters) {
            let keys = Object.keys(filters);
            let values = Object.values(filters);
            let obj = {};
            obj[keys[0]] = values[0][0];
            this.searchParams = Object.assign(this.searchParams, obj);
            this.getList();
        },
        // value转换
        showTextByKey(items, val, itemkeyname = 'value', itemtextname = 'text') {
            return showTextByKey(items, val, itemkeyname, itemtextname);
        },
        // 搜索宽回调方法
        search(params) {
            this.searchParams.name = params.selInputValue;
            this.getList();
        },
        // 获取RDS列表
        getList() {
            this.loading = true;
            getList({name: this.searchParams.name, type: this.searchParams.type, status: this.searchParams.status})
                .then(resp => {
                    if (resp.code === this.CODE.SUCCESS_CODE) {
                        let dataList = cloneDeep(resp.result.data);
                        if (isEmpty(dataList)) this.dataList = [];
                        if (isArray(dataList)) this.updateDataList(dataList);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 更新列表数据
        updateDataList(dataList) {
            let newDataList = [];
            // 先获取所有主实例
            dataList.forEach(function(item) {
                if (item.type != 'readreplica') {
                    item['children'] = [];
                    newDataList.push(item);
                }
            });
            dataList.forEach(function(item, index) {
                if (item.type == 'readreplica') {
                    let flag = false;
                    item['children'] = [];
                    newDataList.forEach(function(ar, i) {
                        if (item.replicaOf == ar.id) {
                            flag = true;
                            newDataList[i]['children'].push(item);
                        }
                    });
                    // 假如找不到对应的主实例
                    if (!flag) newDataList.push(item);
                }
            });
            this.dataList = newDataList;
            this.$store.commit('rds/SET_INST_LIST', newDataList);
        },
        // 更多下拉菜单回调
        command(obj) {
            if (isObject(obj)) {
                this.serverAction(obj.row, obj.action);
            }
        },
        serverAction(row, type) {
            const h = this.$createElement;
            this.currentRow.instId = row.id;
            this.currentRow.instName = row.name;
            if (type === 'restart') {
                // 重启
                // let message = h('div', null, [
                //     h('el-alert', {props: {type: 'error', title: '确定要对RDS实例进行重启操作吗？', showIcon: true}}),
                //     h('p', {class: {font14: true, mt10: true}}, '确定要对RDS实例进行重启操作吗？')
                // ]);
                this.$confirm('确定要对RDS实例进行重启操作吗？', '重启', {
                    type: 'warning'
                }).then(action => {
                    this.postAction(row.id, {restart: 'restart'}, '正在重启实例，请稍后...');
                });
            }
            if (type === 'backup') {
                // 备份
                this.$refs.backup.show();
            }
            if (type === 'release') {
                // 释放
                let message = h('div', null, [
                    h('el-alert', {props: {type: 'error', title: '您确定要释放该实例吗？', showIcon: true, closable: false}}),
                    h('p', {class: {font16: true, mt10: true}}, '建议您释放实例前先创建一个备份文。')
                ]);
                this.$confirm(message, '释放').then(action => {
                    this.postAction(row.id, {release: 'release'}, '正在释放实例，请稍后...');
                });
            }
        },
        // 发送操作请求
        postAction(id, params, title) {
            const loading = this.$loading({
                lock: true,
                text: title,
                spinner: 'el-icon-loading',
                customClass: 'fullscreen'
            });
            serverAction(id, params)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('操作成功');
                        this.getList();
                    }
                })
                .catch(err => {
                    throw new Error(err.toString());
                })
                .finally(() => {
                    loading.close();
                });
        }
    },
    mounted() {}
};
