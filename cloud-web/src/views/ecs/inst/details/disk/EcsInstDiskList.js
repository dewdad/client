import EcsInstDetailHeader from '../DetailHeader';

import ClouddiskTable from '@/views/ecs/clouddisc/clouddiskTable.vue';

import EcsInstMountClouddisk from './EcsInstMountClouddisk.vue';

export default {
    name: 'EcsInstDiskList',
    components: {
        EcsInstDetailHeader,
        ClouddiskTable,
        EcsInstMountClouddisk
    },
    data() {
        let stateParams = this.$route.params || {};
        return {
            ecsInst: stateParams.item || {id: stateParams.id},          
        };
    },
    methods: {
        //挂载云盘
        instMountDisk() {
            this.$refs.ecsInstMountClouddisk
                .show(this.ecsInst)
                .then(ret => {
                    console.log('操作成功', ret);
                    this.$message.success('操作成功');
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        }
    }
};
