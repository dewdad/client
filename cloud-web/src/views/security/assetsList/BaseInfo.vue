<template>
<div class="mt20">
    <el-row>
        <el-col :span="24">
            <div class="panel panel-default" v-if="data">
                <div class="panel-heading">
                    <i class="ecs-ecs_essential-information_people"></i>{{ $t('security.basicInfo') }}
                </div>
                <div class="panel-body zt-panel-body-info">
                    <table class="table zt-table-info">
                        <tbody class="">
                            <tr>
                                <td class="title">{{ $t('common.name') }}：</td>
                                <td>{{data.name}}</td>
                                <td class="title">{{ $t('common.ID') }}：</td>
                                <td>{{data.serverID}}</td>
                                <td class="title">{{ $t('common.region') }}：</td>
                                <td>{{data.addr}}</td>
                            </tr>
                            <tr>
                                <td class="title">{{ $t('common.publicNetworkIP') }}：</td>
                                <td>{{data.wwwip}}</td>
                                <td class="title">{{ $t('common.intranetIP') }}：</td>
                                <td>{{data.ip}}</td>
                                <td class="title">{{ $t('common.os') }}：</td>
                                <td>{{data.version}}</td>
                            </tr>
                            <tr>
                                <td class="title">保护状态：</td>
                                <td>
                                    <protect-status :data="data.protect_switch"></protect-status>
                                </td>
                                <td class="title">在线状态：</td>
                                <td>
                                    <online-status :data="data.online"></online-status>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {mapState} from 'vuex';
import OnlineStatus from '../status/OnlineStatus';
import ProtectStatus from '../status/ProtectStatus';
export default {
    components: {
        OnlineStatus,
        ProtectStatus
    },
    data() {
        return {
            serverID: ''
        };
    },
    computed: {
        ...mapState('security', ['assetList']),
        data() {
            if (this.assetList && this.assetList.data) {
                return this.assetList.data.find(
                    e => e.serverID === this.serverID
                );
            }
        }
    },
    watch: {
        $route: {
            immediate: true,
            handler: function() {
                let {serverID} = this.$route.params;
                if (serverID) {
                    this.serverID = serverID;
                }
                console.log('serverID', serverID);
            }
        }
    },
    methods: {
        handleCommand() {}
    }
};
</script>
