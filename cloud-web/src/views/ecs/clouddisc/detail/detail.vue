<template>
    <div class="page-main" v-loading="loading">
        <ecs-disk-detail-header :rowItem='rowItem' @refresh="getDiskInfoById"></ecs-disk-detail-header>
        <div class="page-body">
            <!-- 基本信息 -->
            <div class="panel panel-default">
                <div class="panel-heading">
                    <i class="iconfont icon-user_profile_people mr10"></i>基本信息
                    <!-- <div class="text-right panel-heading__right">
                        <a class="mr10 finger-cursor" @click="modifyDiskDescrip">修改磁盘描述</a>
                    </div> -->
                </div>
                <div class="panel-body zt-panel-body-info">
                    <table class="table zt-table-info">
                        <tbody>
                            <tr>
                                <td>磁盘ID：</td>
                                <td>
                                    <span>{{rowItem.id}}</span>
                                </td>
                                <td>磁盘属性：</td>
                                <td>
                                    <span v-if="rowItem.bootable===true">系统盘</span>
                                    <span v-if="rowItem.bootable===false">数据盘</span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘状态：</td>
                                <td>
                                    <zt-status :status="statusArr" :value="rowItem.status" class="text-nowrap status-column"></zt-status>
                                </td>
                                <td>创建时间：</td>
                                <td>
                                    <span>{{rowItem.created_at|date}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘名称：</td>
                                <td>
                                    <span v-if="rowItem.attachments && rowItem.attachments.length && rowItem.attachments[0].device === '/dev/vda'">{{rowItem.name || rowItem.attachments[0].hostname + '-系统盘'}}</span>
                                    <span v-else>{{rowItem.name}}</span>
                                </td>
                                <td>磁盘描述：</td>
                                <td>
                                    <span>{{rowItem.description || '-'}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>磁盘容量：</td>
                                <td colspan="3">
                                    <span>{{rowItem.size}}GB</span>
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
                    <!-- <div class="text-right panel-heading__right">
                        <a class="mr10 finger-cursor" @click="modifyDiskProp">修改属性</a>
                    </div> -->
                </div>
                <div class="panel-body zt-panel-body-info">
                    <table class="table zt-table-info">
                        <tbody class="">
                            <tr>
                                <td>所挂载的实例：
                                    <router-link v-if="rowItem.attachments && rowItem.attachments.length" :to="{name:'app.ecs.inst.detail',params:{id:rowItem.attachments[0].serverId}}">{{rowItem.attachments[0].serverId}}/{{rowItem.attachments[0].hostname}}</router-link>
                                    <span v-else>(未设置)</span>
                                </td>
                            </tr>
                            <tr>
                                <td>设备名：
                                    <span v-if="rowItem.attachments && rowItem.attachments.length">{{ rowItem.attachments[0].device }}</span>
                                    <span v-else>-</span>
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
import {DISK_STATUS} from '@/constants/dicts/ecs';
let statusArr = [{text: '全部', state: true, value: ''}, ...DISK_STATUS];
export default {
    components: {
        EcsDiskDetailHeader,
        ModifyDiskDescripDialog,
        ModifyDiskPropDialog
    },
    data() {
        let stateParams = this.$route.params || {};
        return {
            statusArr,
            loading: false,
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
            this.loading = true;
            getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.data;
                    if (resData && resData.data) {
                        this.rowItem = resData.data[0] || {};
                    }
                }
            }).finally(() => {
                this.loading = false;
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
    }
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
 