<template>
    <div class="page-main">
        <ecs-disk-detail-header :rowItem='rowItem' @refresh="getDiskInfoById"></ecs-disk-detail-header>
        <div class="page-body">
            <!-- 基本信息 -->
            <div class="panel panel-default">
                <div class="panel-heading">
                    <i class="iconfont icon-user_profile_people mr10"></i>基本信息
                    <div class="text-right panel-heading__right">
                        <a class="mr10 finger-cursor" @click="modifyDiskDescrip">修改磁盘描述</a>
                    </div>
                </div>
                <div class="panel-body zt-panel-body-info">
                    <table class="table zt-table-info">
                        <tbody>
                            <tr>
                                <td>磁盘ID：
                                    <span>{{rowItem.id}}</span>
                                </td>
                                <td>磁盘属性：
                                    <span v-if="rowItem.isBoot==='1'">系统盘</span>
                                    <span v-if="rowItem.isBoot==='0'">数据盘</span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘种类：
                                    <span v-if="rowItem.type=='SATA'">高效云盘</span>
                                    <span v-if="rowItem.type=='SSD'">SSD云盘</span>
                                </td>
                                <td>区域：
                                    <span v-if="rowItem.zone=='az1.dc1'">北京1</span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘状态：
                                    <span class="color090">{{rowItem.diskStatus}}</span>
                                </td>
                                <td>创建时间：
                                    <span>{{rowItem.createDate}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘名称：
                                    <span>{{rowItem.name}}</span>
                                </td>
                                <td>本磁盘快照：
                                    <span>共{{rowItem.countSnapshot || '0'}}个快照
                                        <router-link :to="{name:'app.ecs.snapshot.detail',params:{id:rowItem.id,item:rowItem}}" class="font12 ml5">查看详情</router-link>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘容量：
                                    <span>{{rowItem.diskSize}}GB</span>
                                </td>
                                <td>磁盘描述：
                                    <span>{{rowItem.remark || '-'}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 磁盘挂载信息 -->
            <div class="panel panel-default">
                <div class="panel-heading">
                    <i class="iconfont icon-user_profile_people mr10"></i>磁盘挂载信息
                    <div class="text-right panel-heading__right">
                        <a class="mr10 finger-cursor" @click="modifyDiskProp">修改属性</a>
                    </div>
                </div>
                <div class="panel-body zt-panel-body-info">
                    <table class="table zt-table-info">
                        <tbody class="">
                            <tr>
                                <td>所挂载的实例：
                                    <router-link v-if="!!rowItem.instanceId" :to="{name:'app.ecs.inst.detail',params:{id:rowItem.instanceId}}"></router-link>
                                    <span v-else>{{rowItem.instanceId || '(未设置)' }}</span>
                                    <span>/</span>
                                    <span>{{rowItem.instanceName || '(未设置)' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>设备名：
                                    <span>{{ rowItem.mount || "-"}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>           
        </div>
        
        <!-- 对话框 修改磁盘描述 -->
        <modify-disk-descrip-dialog ref="ModifyDiskDescripDialog" />
        <!-- 对话框 修改属性 -->
        <modify-disk-prop-dialog ref="ModifyDiskPropDialog" />
    </div>
</template>

<script>
import EcsDiskDetailHeader from './detailHeader';
import ModifyDiskDescripDialog from './../../inst/ecsDialog/ModifyDiskDescripDialog';
import ModifyDiskPropDialog from './../../inst/ecsDialog/ModifyDiskPropDialog';

import {getDiskList} from '@/service/ecs/disk/disk.js';
export default {
    components: {
        EcsDiskDetailHeader,        
        ModifyDiskDescripDialog,
        ModifyDiskPropDialog
    },
    data() {
        let stateParams = this.$route.params || {};
        return {
            stateParams,
            diskId: stateParams.id,
            rowItem: stateParams.item || {}
        };
    },
    computed: {},
    created() {
        if (this.stateParams && this.stateParams.item) {
        } else {
            //刷新页面，路由参数item会丢失，则通过id查询磁盘信息
            this.getDiskInfoById(); //获取磁盘信息
        }
    },
    methods: {
        //获取云盘列表数据
        getDiskInfoById() {
            let params = {
                paging: {
                    pageIndex: 1,
                    limit: 10
                },
                id: this.stateParams.id //传入磁盘id
            };
            getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.result;
                    if (resData && resData.records) {
                        this.rowItem = resData.records[0] || {};
                    }
                }
            });
        },
        
        /**
         * 修改磁盘描述
         */
        modifyDiskDescrip: function() {
            this.$refs.ModifyDiskDescripDialog.show(this.rowItem)
                .then(ret => {
                    console.log('操作成功', ret);
                    Object.assign(this.rowItem, ret);
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        /**
         * 修改磁盘属性
         */
        modifyDiskProp: function() {
            this.$refs.ModifyDiskPropDialog.show(this.rowItem)
                .then(ret => {
                    console.log('操作成功', ret);
                    Object.assign(this.rowItem, ret);
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        }
    },
    
};
</script>
 
<style scoped lang="scss">
.br {
    border-right: 1px solid #ddd;
}
.zt-table-info td {
    width: 50%;
    color: #999999;
}
</style>
 