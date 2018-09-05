<template>
<div class="page-main">
    <page-header>
        <img src="@/assets/images/control/cloud_disk_icon.svg" height="50" alt="">
        <div slot="content">
            <div class="font16">{{data.name}}</div>
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
                        <td>{{data.name}}</td>
                        <td>是否共享：</td>
                        <td>{{data.createDate}}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('common.ID') }}：</td>
                        <td>{{data.id}}</td>
                        <td>是否外部网络：</td>
                        <td>{{data.isProper === '0' ? '是' : '否'}}</td>
                    </tr>
                    <tr>
                        <td>状态：</td>
                        <td>可用</td>
                        <td>租户ID：</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>管理状态：</td>
                        <td>
                        </td>
                        <td>网段：</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>DHCP：</td>
                        <td>
                        </td>
                        <td>IP版本：</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>网关IP：</td>
                        <td>
                        </td>
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
import {queryNetworkByID, getNetworkCount, queryNetwork} from '@/service/ecs/network.js';

export default {
    data() {
        return {
            data: {},
            countData: {},
            isLoading: false,
            listData: []
        };
    },
    created() {
        // this.init();
        this.fetchData();
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
                queryNetworkByID({vpcId}).then(ret => {
                    $log('queryNetworkByID', ret);
                    this.data = ret;
                });
                getNetworkCount({vpcId}).then(ret => {
                    $log('getNetworkCount', ret);
                    this.countData = ret;
                });
            } else {
                // TODO 没有ID 跳转列表页
            }
        },
        async fetchData() {
            try {
                // 清空数据
                this.isLoading = true;
                let params = {
                    pageIndex: 1
                };

                let ret = await queryNetwork(params);
                console.warn('fetchData', ret);

                this.listData = ret.data;

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('fetchData', error.message);
            }
        }
    }
};
</script>

<style>
</style>
