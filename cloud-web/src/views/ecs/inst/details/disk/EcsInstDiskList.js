import EcsInstDetailHeader from '../DetailHeader';
import ClouddiskTable from '@/views/ecs/clouddisc/clouddiskTable.vue';
import EcsInstMountClouddisk from './EcsInstMountClouddisk.vue';
import {getInstanceDetail} from '@/service/ecs/detail/index';
import {isEmpty} from '@/utils/utils';
export default {
    name: 'EcsInstDiskList',
    components: {
        EcsInstDetailHeader,
        ClouddiskTable,
        EcsInstMountClouddisk
    },
    data() {
        return {
            ecsInst: null,
            instanceId: ''
        };
    },
    created() {
        this.instanceId = this.$route.params.id;
        if (!isEmpty(this.instanceId)) {
            this.getInstanceDetail(this.instanceId);
        } else {
            this.$store.commit('SET_PAGE_LOAD_ERROR', '参数错误');
        }
    },
    methods: {
        // 获取基本信息与配置信息
        getInstanceDetail: function(instanceId) {
            return getInstanceDetail(instanceId).then(res => {
                if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                    console.warn('getInstanceDetail', res);
                    let ecsInst = res.data;
                    this.ecsInst = ecsInst;
                } else {
                    this.$store.commit('SET_PAGE_LOAD_ERROR', '您查找的实例不存在');
                }
            });
        },
        //挂载云盘
        instMountDisk() {
            this.$refs.ecsInstMountClouddisk
                .show(this.ecsInst)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.$message.success('操作成功');
                    this.refresh();
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        refresh() {
            this.$refs.table.getDiskList();
        }
    }
};
