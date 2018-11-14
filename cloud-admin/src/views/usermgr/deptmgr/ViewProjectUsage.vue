<template>
    <el-dialog title="查看租户配额" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-row class="table top">
            <el-col :span="8">资源</el-col>
            <el-col :span="16">总量</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">CPU</el-col>
            <el-col :span="16">{{dept.cpu ==0 ? 0:dept.cpu}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">实例</el-col>
            <el-col :span="16">{{dept.instances ==0 ? 0:dept.instances}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">磁盘</el-col>
            <el-col :span="16">{{dept.volumes ==0 ? 0:dept.volumes}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">快照</el-col>
            <el-col :span="16">{{dept.snapshot ==0 ? 0:dept.snapshot}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">磁盘大小(GB)</el-col>
            <el-col :span="16">{{dept.volumeSize ==0 ? 0:dept.volumeSize}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">内存(GB)</el-col>
            <el-col :span="16">{{dept.ram ==0 ? 0:dept.ram}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">安全组</el-col>
            <el-col :span="16">{{dept.securityGroup ==0 ? 0:dept.securityGroup}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">安全组规则</el-col>
            <el-col :span="16">{{dept.securityGroupRule ==0 ? 0:dept.securityGroupRule}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">浮动IP</el-col>
            <el-col :span="16">{{dept.floatingIps ==0 ? 0:dept.floatingIps}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">网络</el-col>
            <el-col :span="16">{{dept.network ==0 ? 0:dept.network}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">端口</el-col>
            <el-col :span="16">{{dept.ports ==0 ? 0:dept.ports}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">路由</el-col>
            <el-col :span="16">{{dept.routers ==0 ? 0:dept.routers}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">子网</el-col>
            <el-col :span="16">{{dept.subnet ==0 ? 0:dept.subnet}}</el-col>
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
            viewProjectUsage(item.id).then(ret => {
                $log('list....viewProjectUsage', ret);
                let resData = ret.data;
                if(resData){
                    this.dept = resData;
                }else{
                    this.dept = {
                        cpu:10,
                        instances:10,
                        volumes:10,
                        snapshot:10,
                        volumeSize:100,
                        ram:100,
                        securityGroup:10,
                        securityGroupRule:10,
                        floatingIps:10,
                        network:10,
                        ports:10,
                        routers:10,
                        subnet:10,
                        backup:10,
                        backupSize:10
                    };
                }
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
        .el-col-16{
            padding-left:10px;
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
