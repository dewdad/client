<template>
    <el-dialog title="查看租户配额" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-row class="table top">
            <el-col :span="8">资源</el-col>
            <el-col :span="8">使用量</el-col>
            <el-col :span="8">总量</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">CPU</el-col>
            <el-col :span="8">{{dept.CPU || '-'}}</el-col>
            <el-col :span="8">{{dept.qCpu || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">实例</el-col>
            <el-col :span="8">{{dept.INSTANCES || '-'}}</el-col>
            <el-col :span="8">{{dept.qInstances || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">磁盘</el-col>
            <el-col :span="8">{{dept.VOLUMES || '-'}}</el-col>
            <el-col :span="8">{{dept.qVolumes || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">快照</el-col>
            <el-col :span="8">{{dept.SNAPSHOTS || '-'}}</el-col>
            <el-col :span="8">{{dept.qSnapshot || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">磁盘大小(GB)</el-col>
            <el-col :span="8">{{dept.VOLUME_SIZE || '-'}}</el-col>
            <el-col :span="8">{{dept.qVolumeSize || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">内存(GB)</el-col>
            <el-col :span="8">{{dept.RAM || '-'}}</el-col>
            <el-col :span="8">{{dept.qRam || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">安全组</el-col>
            <el-col :span="8">{{dept.SECURITY_GROUP || '-'}}</el-col>
            <el-col :span="8">{{dept.qSecutityGroup || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">安全组规则</el-col>
            <el-col :span="8">{{dept.SECURITY_GROUP_RULE || '-'}}</el-col>
            <el-col :span="8">{{dept.qSecutityGroupRule || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">浮动IP</el-col>
            <el-col :span="8">{{dept.FLOATINGIP || '-'}}</el-col>
            <el-col :span="8">{{dept.qFloatingIps || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">网络</el-col>
            <el-col :span="8">{{dept.NETWORK || '-'}}</el-col>
            <el-col :span="8">{{dept.qNetwork || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">端口</el-col>
            <el-col :span="8">{{dept.PORTS || '-'}}</el-col>
            <el-col :span="8">{{dept.qPorts || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">路由</el-col>
            <el-col :span="8">{{dept.ROUTER || '-'}}</el-col>
            <el-col :span="8">{{dept.qRouters || '-'}}</el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import {viewProjectUsage} from '@/service/usermgr/deptmgr.js';
export default {
    name: 'app',

    data() {

        let cols = [
            { column: 'resource', text:'资源' , width: '30%'},
            { column: 'used', text:'使用量' , width: '15%'},
            { column: 'all', text: '总量', width: '20%' }
        ];

        return {
            cols,
            isShow: false,
            resolve: null,
            reject: null,
            dept:{},
            item:{}

        };
    },
    components: {

    },
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            this.viewProjectUsage(item);
            console.log('item',item);
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        //通过租户id查找用户
        viewProjectUsage(item){
            let param = {
                projectId:item.id
            };
            viewProjectUsage(param).then(ret => {
                $log('list....viewProjectUsage', ret);
                let resData = ret.data;
                if(resData.length > 0) this.dept = resData[0];
            });
        },
        hide() {
            this.isShow = false;

        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },

    },
    mounted(){

    }
};
</script>
<style scoped lang="scss">
    .table{
        .el-col-8{
            padding-left:10px;
            border-right:1px solid #d1d5d7;
        }
        .el-col-8:nth-child(3){
            border-right:0;
        }
        margin-bottom:0;
        border: 1px solid #d1d5d7 ;
        border-top:0 ;
        height: 32px;
        line-height: 32px;
        color: #454a51 !important;
        font-size: 12px;
        &.top{
            background: #f7f8fa;
            border-bottom: 1px solid #d1d5d7;
            border-top: 1px solid #d1d5d7;
        }

    }
</style>
