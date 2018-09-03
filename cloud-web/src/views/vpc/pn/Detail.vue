<template>
<div class="page-main">
    <page-header>
        <img src="@/assets/images/control/cloud_disk_icon.svg" height="50" alt="">
        <div slot="content">
            <div class="font16">{{data.name}}</div>
        </div>
    </page-header>
    <div class="panel panel-default mb20">
        <div class="panel-heading">
            <i class="ecs-ecs_essential-information_people"></i>{{ $t('security.basicInfo') }}
        </div>
        <div class="panel-body zt-panel-body-info">
            <table class="table zt-table-info">
                <tbody class="">
                    <tr>
                        <td>{{ $t('common.name') }}：</td>
                        <td>{{data.name}}</td>
                        <td>创建时间：</td>
                        <td>{{data.createDate}}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('common.ID') }}：</td>
                        <td>{{data.id}}</td>
                        <td>默认专有网络：</td>
                        <td>{{data.isProper === '0' ? '是' : '否'}}</td>
                    </tr>
                    <tr>
                        <td>状态：</td>
                        <td>可用</td>
                        <td>备注：</td>
                        <td>{{data.remark}}</td>
                    </tr>
                    <tr>
                        <td>区域：</td>
                        <td>
                            {{data.zone | zone}}
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <i class="ecs-ecs_essential-information_people"></i>资源部署信息
        </div>
        <div class="panel-body zt-panel-body-info">
            <table class="table zt-table-info">
                <tbody class="">
                    <tr>
                        <td>ECS实例：</td>
                        <td>{{countData.ecsCount}}</td>
                        <td>防火墙：</td>
                        <td>{{countData.ecsCount}}</td>
                    </tr>
                    <tr>
                        <td>子网：</td>
                        <td>{{countData.subnetCount}}</td>
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
import {queryNetworkByID, getNetworkCount} from '@/service/ecs/network.js';

export default {
    data() {
        return {
            data: {},
            countData: {}
        };
    },
    created() {
        this.init();
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
        }
    }
};
</script>

<style>
</style>
