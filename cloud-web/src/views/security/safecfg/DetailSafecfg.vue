<template>
<div class="safecfg">
    <div class="panel panel-default mt20">
        <div class="panel-heading">漏洞管理</div>
        <div class="panel-body zt-panel-body-info content">
            <label>Linux软件漏洞</label> <el-switch v-model="leak"  @click.native="setSafeConfigWebshellConfig(!leak)"></el-switch>
        </div>
    </div>
    <div class="panel panel-default mt20">
        <div class="panel-heading">基线检查</div>
        <div class="panel-body zt-panel-body-info content">
            <label>检测开关</label> <el-switch v-model="baseline" @click.native="setSafeConfigBaseLineConfig(!baseline)"></el-switch>
        </div>
    </div>
    <div class="panel panel-default mt20">
        <div class="panel-heading">防暴力破解</div>
        <div class="panel-body zt-panel-body-info content">
            <label>拦截开关</label> <el-switch v-model="bruteForce" @click.native="setBruteForceConfig(!bruteForce)"></el-switch>
        </div>
    </div>
    <div class="panel panel-default mt20">
        <div class="panel-heading">防端口扫描</div>
        <div class="panel-body zt-panel-body-info content">
            <label>拦截开关</label> <el-switch v-model="portscan" @click.native="setPortScanConfig(!portscan)"></el-switch>
        </div>
    </div>
</div>
</template>

<script>
import {
    safeConfigStatus,
    setPortScanConfig,
    setBruteForceConfig,
    setSafeConfigWebshellConfig,
    setSafeConfigBaseLineConfig
} from '@/service/security';
import {mapActions} from 'vuex';

export default {
    data() {
        return {
            leak: false,
            baseline: false,
            bruteForce: false,
            portscan: false
        };
    },
    computed: {
        serverId() {
            return this.$route.params.serverID;
        }
    },
    created() {
        this.init();
    },
    methods: {
        ...mapActions('security', [
            'fetchBruteForceConfig',
            'fetchPortScanConfig'
        ]),
        // 修改漏洞开关
        async setSafeConfigWebshellConfig(val) {
            try {
                let ret = await setSafeConfigWebshellConfig({
                    server_id: this.serverId,
                    op_status: val ? '1' : '0'
                });
                $log('setSafeConfigWebshellConfig', ret);
                if (ret) {
                    this.$message.success('操作成功');
                }
                this.fetchData();
            } catch (error) {
                this.fetchData();
                console.warn('setSafeConfigWebshellConfig 失败', error.message);
            }
        },
        // 修改漏洞开关
        async setSafeConfigBaseLineConfig(val) {
            try {
                let ret = await setSafeConfigBaseLineConfig({
                    server_id: this.serverId,
                    op_status: val ? '1' : '0'
                });
                $log('setSafeConfigBaseLineConfig', ret);
                if (ret) {
                    this.$message.success('操作成功');
                }

                this.fetchData();
            } catch (error) {
                this.fetchData();
                console.warn('setSafeConfigBaseLineConfig 失败', error.message);
            }
        },
        // 端口扫描开关
        async setPortScanConfig(val) {
            try {
                let ret = await setPortScanConfig({
                    server_id: this.serverId,
                    op_status: val ? '1' : '0'
                });
                $log('setPortScanConfig', ret);
                if (ret) {
                    this.$message.success('操作成功');
                }

                this.fetchPortScan();
            } catch (error) {
                this.fetchPortScan();
                console.warn('setPortScanConfig 失败', error.message);
            }
        },
        // 放爆破开关
        async setBruteForceConfig(val) {
            try {
                let ret = await setBruteForceConfig({
                    server_id: this.serverId,
                    op_status: val ? '1' : '0'
                });
                $log('setBruteForceConfig', ret);
                if (ret) {
                    this.$message.success('操作成功');
                }
                this.fetchBruteForce();
            } catch (error) {
                this.fetchBruteForce();
                console.warn('setBruteForceConfig 失败', error.message);
            }
        },
        async fetchData() {
            try {
                let ret = await safeConfigStatus({
                    server_id: this.serverId
                });
                $log('获取安全设置结果', ret);
                let {leak_switch, baseline_switch} = ret;
                this.leak = leak_switch === '1';
                this.baseline = baseline_switch === '1';
            } catch (error) {
                console.warn('获取安全设置失败', error.message);
            }
        },
        fetchBruteForce() {
            this.fetchBruteForceConfig({
                server_id: this.serverId
            }).then(ret => {
                if (ret) {
                    this.bruteForce = ret.switch === '1';
                }
            });
        },
        fetchPortScan() {
            this.fetchPortScanConfig({
                server_id: this.serverId
            }).then(ret => {
                if (ret) {
                    this.portscan = ret.switch === '1';
                }
            });
        },
        init() {
            this.fetchData();
            this.fetchBruteForce();
            this.fetchPortScan();
        }
    }
};
</script>

<style lang="scss">
.safecfg {
    .content {
        padding: 15px 30px;
    }
    label {
        min-width: 130px;
    }
}
</style>
