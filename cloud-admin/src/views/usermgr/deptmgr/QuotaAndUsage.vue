<template>
    <el-dialog title="查看配额" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-row class="table top">
            <el-col :span="8">资源</el-col>
            <el-col :span="8">使用量</el-col>
            <el-col :span="8">总量</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">CPU</el-col>
            <el-col :span="8">{{dept.usage.cores || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.cpu || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">实例</el-col>
            <el-col :span="8">{{dept.usage.instances || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.instances || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">磁盘</el-col>
            <el-col :span="8">{{dept.usage.volumes || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.volumes || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">快照</el-col>
            <el-col :span="8">{{dept.usage.snapshots || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.snapshot || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">磁盘快照大小(GB)</el-col>
            <el-col :span="8">{{dept.usage.gigabytes || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.volumeSize || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">内存(GB)</el-col>
            <el-col :span="8">{{dept.usage.ram || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.ram || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">安全组</el-col>
            <el-col :span="8">{{dept.usage.security_group || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.securityGroup || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">安全组规则</el-col>
            <el-col :span="8">{{dept.usage.security_group_rule || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.securityGroupRule || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">浮动IP</el-col>
            <el-col :span="8">{{dept.usage.floatingip || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.floatingIps || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">网络</el-col>
            <el-col :span="8">{{dept.usage.network || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.network || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">端口</el-col>
            <el-col :span="8">{{dept.usage.port || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.ports || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">路由</el-col>
            <el-col :span="8">{{dept.usage.router || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.routers || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">子网</el-col>
            <el-col :span="8">{{dept.usage.subnet || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.subnet || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">备份</el-col>
            <el-col :span="8">{{dept.usage.backup || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.backup || '-'}}</el-col>
        </el-row>
        <el-row class="table">
            <el-col :span="8">备份大小(GB)</el-col>
            <el-col :span="8">{{dept.usage.backupSize || '-'}}</el-col>
            <el-col :span="8">{{dept.quota.backupSize || '-'}}</el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import {searchQuota} from '@/service/usermgr/deptmgr.js';
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
            dept:{
                usage:{
                    cores: '',
                    instances: '',
                    volumes: '',
                    snapshots: '',
                    gigabytes: '',
                    ram: '',
                    security_group: '',
                    security_group_rule: '',
                    floatingip: '',
                    network: '',
                    port: '',
                    router: '',
                    subnet: '',
                    region: '',
                    backup: '',
                    backupSize: ''
                },
                quota:{
                    cpu: '',
                    instances: '',
                    volumes: '',
                    snapshot: '',
                    volumeSize: '',
                    ram: '',
                    securityGroup: '',
                    securityGroupRule: '',
                    floatingIps: '',
                    network: '',
                    ports: '',
                    routers: '',
                    subnet: '',
                    backup: '',
                    backupSize: ''
                }
            },
            item:{}

        };
    },
    components: {

    },
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            this.searchQuota();
            if(item.usage && item.quota){
                this.dept.usage = item.usage;
                this.dept.quota = item.quota;
            }
            console.log('item',item);
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        //通过租户id查找用户
        searchQuota(){
            searchQuota(this.item.id).then(ret => {
                $log('list....searchByProjectId', ret);
                let resData = ret.data;
                if((resData && resData.quota) || (resData && resData.usage)){
                    this.dept.quota = resData.quota || [];
                    this.dept.usage = resData.usage || [];
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
