import EcsInstDetailHeader from '../DetailHeader';
import AmendName from '@/components/amend/AmendName';

let tableData = [
    {
        name: '2016-05-02',
        id: '2016-05-02',
        countSnapshot: 2,
        describe: '',
        ipaddr: '192.168.94.229',
        snapSize: '20GB',
        privateNetwork: '专有网络-1529573966628',
    },
    {
        name: 'd-yjtbeyhgsymp',
        id: 'd-yjtbeyhgsymp',
        countSnapshot: 2,
        describe: '',
        ipaddr: '192.168.94.229',
        snapSize: '20GB',
        privateNetwork: '专有网络-1529573966628'
    }
];
let cols = [
    { column: 'name', text: '磁盘ID/磁盘名称', width: '20%' },
    { column: 'describe',text: '描述',width: '4%'},
    { column: 'ipaddr', text: 'IP地址', width: '10%' },
    { column: 'privateNetwork', text: '所属专用网络', width: '10%' },
];
export default {
    name: 'EcsInstSecuritygrpList',
    components: {
        EcsInstDetailHeader,
        AmendName
    },
    data() {
        return {
            ecsInst:{ name:'ecs实例名称'},
            tableData,
            cols,
            showId: ''
        };
    },
    methods: {
        /**
         * 进入单元格
         */
        showEditName(row, column, cell, event){
            this.showId = row.id;
        },
        /**
         * 离开单元格
         */ 
        hideEditName(row, column, cell, event){
            this.showId = '';
        }
    }
};