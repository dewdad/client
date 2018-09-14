<template>
<div class="page-main security-assetslist-detail">
    <page-header v-show="showHeader">
        <img src="@/assets/images/control/cloud_disk_icon.svg" height="50" alt="">
        <div slot="content" v-if="data">
            <div class="font16">{{data.ip}}</div>
            <div class="font12">
                <label class="mr20">
                    <span class="color-secondary">在线状态: </span>
                    <online-status :data="data.online"></online-status>
                </label>
                <label>
                    <span class="color-secondary">保护状态：</span>
                    <protect-status :data="data.protect_switch"></protect-status>
                </label>
            </div>
        </div>
    </page-header>
    <router-view></router-view>
</div>
</template>
<script>
import PageHeader from '@/components/pageHeader/PageHeader';
import OnlineStatus from '../status/OnlineStatus';
import ProtectStatus from '../status/ProtectStatus';
import {mapState} from 'vuex';
const noHeaderNameList = ['app.security.assetslist.baselinecheck.detail', 'app.security.assetslist.vulnerablity.detail'];
export default {
    components: {
        ProtectStatus,
        OnlineStatus,
        PageHeader
    },
    computed: {
        ...mapState('security', ['assetList']),
        serverID() {
            return this.$route.params.serverID;
        },
        showHeader() {
            return noHeaderNameList.indexOf(this.$route.name) < 0;
        },
        data() {
            if (this.assetList && this.assetList.data) {
                return this.assetList.data.find(
                    e => e.serverID === this.serverID
                );
            }
        }
    },
    methods: {
        handleClick(tab, event) {
            // alert(tab.name);
        }
    }
};
</script>
<style scoped>
label {
    font-weight: normal;
}
</style>
