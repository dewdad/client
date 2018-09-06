<template>
<div class="page-main">
    <page-header>
        <img src="@/assets/images/control/cloud_disk_icon.svg" height="50" alt="">
        <div slot="content">
            <div class="font16">{{countData.name}}</div>
        </div>
    </page-header>
    <div class="panel panel-default mb20" v-loading="isLoading">
        <div class="panel-heading">
            <i class="ecs-ecs_essential-information_people"></i>专有网络基本信息
        </div>
        <div class="panel-body zt-panel-body-info">
            <table class="table zt-table-info">
                <tbody class="">
                    <tr>
                        <td>{{ $t('common.name') }}：</td>
                        <td>{{countData.name}}</td>
                        <td>是否共享：</td>
                        <td>
                            <span :class="{'color-success': countData.shared , 'color-danger': !countData.shared}">
                                {{countData.shared ? '是' : '否'}}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t('common.ID') }}：</td>
                        <td>{{countData.id}}</td>
                        <td>是否外部网络：</td>
                        <td>
                            <span :class="{'color-success': countData['router:external'] , 'color-danger': !countData['router:external']}">
                                {{countData['router:external'] ? '是' : '否'}}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>状态：</td>
                        <td><zt-status :status="ECS_STATUS" :value="countData.status" ></zt-status></td>
                        <td>租户ID：</td>
                        <td>{{countData.tenant_id}}</td>
                    </tr>
                    <tr>
                        <td>管理状态：</td>
                        <td>{{countData.admin_state_up ? 'UP' : 'DOWN'}}</td>
                        <td>网段：</td>
                        <td>{{countData.neutronSubnets[0].cidr}}</td>
                    </tr>
                    <tr>
                        <td>DHCP：</td>
                        <td>{{countData.neutronSubnets[0].enable_dhcp ? '已激活' : '未激活'}}</td>
                        <td>IP版本：</td>
                        <td>IPV{{countData.neutronSubnets[0].ip_version}}</td>
                    </tr>
                    <tr>
                        <td>网关IP：</td>
                        <td>{{countData.neutronSubnets[0].gateway_ip}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
import {getNetworkCount} from '@/service/ecs/network.js';
import {ECS_STATUS} from '@/constants/dicts/ecs.js';

export default {
    data() {
        return {
            data: {},
            countData: {},
            isLoading: false,
            listData: [],
            ECS_STATUS
        };
    },
    created() {
        this.init();
    },
    computed: {
        netIntro () {
            return this.listData.filter(
                item => item.id === this.$route.params.id
            );
        }
    },
    methods: {
        init() {
            let vpcId = this.$route.params.id;
            if (vpcId) {
                // queryNetworkByID({vpcId}).then(ret => {
                //     $log('queryNetworkByID', ret);
                //     this.data = ret;
                // });
                getNetworkCount({vpcId}).then(ret => {
                    $log('getNetworkCount', ret);
                    this.countData = ret;
                });
            } else {
                // TODO 没有ID 跳转列表页
            }
        }
    }
};
</script>

<style>
</style>
