import EcsInstDetailHeader from '../DetailHeader';
import AllTable from '@/components/table/allTable.vue';

let tableData = [
    {
        name: '2016-05-02',
        countSnapshot: 2,
        disksize: '20GB',
        snapSize: '20GB',
        isBoot: '数据盘'
    },
    {
        name: 'd-yjtbeyhgsymp',
        countSnapshot: 2,
        disksize: '20GB',
        snapSize: '20GB',
        isBoot: '数据盘'
    }
];
let cols = [
    { column: 'name', text: '磁盘ID/磁盘名称', width: '20%' },
    { column: 'isBoot',text: '源磁盘属性',width: '4%'},
    { column: 'disksize', text: '源磁盘容量', width: '10%' },
    { column: 'countSnapshot', text: '快照数量', width: '10%' },
    { column: 'snapSize', text: '源磁盘容量', width: '10%' }
];
export default {
    name: 'EcsInstSnapList',
    components: {
        EcsInstDetailHeader,
        AllTable
    },
    data() {
        return {
            ecsInst:{ name:'ecs实例名称'},
            tableData,
            cols
        };
    }
};