<template>
    <article>
        <el-row :gutter="15">
            <el-col :span="instance.type === 'master' ? 16 : 24">
                <!-- 基本信息 -->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="iconfont icon-user_profile_people mr10"></i>基本信息
                    </div>
                    <div class="panel-body zt-panel-body-info">
                        <table class="table zt-table-info">
                            <tbody>
                                <tr>
                                    <td>云数据库ID：</td>
                                    <td>
                                        {{get(instance, 'localId')}}
                                    </td>
                                    <td>云数据库名称：</td>
                                    <td>
                                        {{get(instance, 'name')}}
                                    </td>
                                    <td>区域：</td>
                                    <td>
                                        {{get(instance, 'region')}}
                                    </td>
                                </tr>
                                <tr>
                                    <td>实例类型：</td>
                                    <td>
                                        {{get(instance, 'type')|showTextByKey(DICT_RDS.INST_TYPE)}}
                                    </td>
                                    <td>运行状态：</td>
                                    <td>
                                        <zt-status :status="DICT_RDS.RDS_STATUS" :value="get(rdsInst, 'instance.status')"></zt-status>
                                    </td>
                                    <td>创建时间：</td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>描述：</td>
                                    <td colspan="5"></td>

                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </el-col>
            <el-col v-if="instance.type === 'master'" :span="8">
                <!-- 实例分布 -->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="iconfont icon-casedistribution_pe mr10"></i>实例分布
                    </div>
                    <div class="panel-body zt-panel-body-info">
                        <table class="table zt-table-info" style="height:159px;">
                            <tbody>
                                <tr rows="4">
                                    <td width="50%" style="height:100%;border-right: 1px solid #ddd; color:#333;" class="text-center">
                                        只读实例
                                        <h1 class="color-success">{{replica.length}}</h1>
                                        <div class="mt20">
                                            <a href="" class="font12">添加只读实例</a>
                                        </div>
                                    </td>
                                    <td width="50%" class="text-center">
                                        灾备实例
                                        <h1>-</h1>
                                        <div class="mt20">&nbsp;</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="15">
            <el-col :span="24">
                <!-- 配置信息 -->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="iconfont icon-Configurationinform mr10"></i>配置信息
                    </div>
                    <div class="panel-body zt-panel-body-info">
                        <table class="table zt-table-info">
                            <tbody>
                                <tr>
                                    <td>实例规格：</td>
                                    <td>
                                        {{get(instance, 'flavor.type')}}
                                    </td>
                                    <td>数据库引擎：</td>
                                    <td>
                                        {{get(instance, 'dataStoreInfo.type')}} {{get(instance, 'dataStoreInfo.version')}}
                                    </td>
                                    <td>数据库版本：</td>
                                    <td>
                                        {{get(instance, 'flavor.cpu')}} 核
                                    </td>
                                </tr>
                                <tr>
                                    <td>实例类型：</td>
                                    <td>
                                        {{get(instance, 'flavor.type')}}
                                    </td>
                                    <td>总存储空间：</td>
                                    <td>
                                        {{get(instance, 'volume.size')}}G
                                    </td>
                                    <td>已用存储空间：</td>
                                    <td>
                                        {{get(instance, 'volume.used')}} G
                                    </td>
                                </tr>
                                <tr>
                                    <td>服务端口：</td>
                                    <td>
                                        {{get(instance, 'flavor.type')}}
                                    </td>
                                    <td>私有网络：</td>
                                    <td>
                                        {{get(instance, 'dataStoreInfo.type')}} {{get(instance, 'dataStoreInfo.version')}}
                                    </td>
                                    <td>子网：</td>
                                    <td>
                                        {{get(instance, 'flavor.cpu')}} 核
                                    </td>
                                </tr>
                                <tr>
                                    <td>私有IP：</td>
                                    <td>
                                        {{get(instance, 'flavor.mem')}} G
                                    </td>
                                    <td>公网IP：</td>
                                    <td>
                                        {{get(instance, 'flavor.name')}}
                                    </td>
                                    <td colspan="2"></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </el-col>
        </el-row>
        <apply-ip ref="applyIp" :instId="instInfo.id"></apply-ip>
    </article>
</template>
<script>
import {isArray, isEmpty, cloneDeep, sleep} from '@/utils/utils';
import {mapState} from 'vuex';
import {DICT_RDS} from '@/constants/dicts/rds';
import {getDetails, updateFloatIp} from '@/service/rds/detail';
import {getList as queryFloatIp} from '@/service/ecs/floating';
import {getList} from '@/service/rds/list';
import ApplyIp from './ApplyIp';
export default {
    name: 'Details',
    data() {
        return {
            instInfo: {},
            loading: true,
            unbingLoading: false,
            bingLoading: false,
            DICT_RDS,
            // 数据库类型
            dataStore: [],
            // 只读副本
            replica: [],
            // 连接地址
            floating: {
                floating_ip_address: ''
            }
        };
    },
    components: {
        ApplyIp
    },
    computed: {
        ...mapState({
            rdsInst: state => state.rds.instance,
            instList: state => state.rds.instList
        }),
        instId: function() {
            return this.$route.params.id;
        },
        // 计算详情页所需要的数据
        instance: function() {
            try {
                // 根据数据datastoreVersionId 和flavorId找到对应的配置信息
                let db = this.dataStore.find(item => {
                    return item.id === this.instInfo.datastoreVersionId;
                });
                let flavor = {};
                if (db !== undefined && isArray(db.flavorList)) {
                    flavor = db.flavorList.find(item => {
                        return item.id === this.instInfo.flavorId;
                    });
                    if (flavor === undefined) flavor = {};
                }
                let new_obj = Object.assign({}, this.rdsInst, this.instInfo, {flavor});
                $log('合并后的对象', new_obj);
                return new_obj;
            } catch (error) {
                $log(error);
            }
        }
    },
    async created() {
        // 如果loalstorage中没有RDS列表缓存 获取rds列表数据并缓存
        if (isEmpty(this.instList)) await this.getList();

        // 从instList获取更多实例的相关信息
        if (isArray(this.instList)) {
            this.instInfo = this.instList.find(item => {
                return item.id === this.instId;
            });
        }
        await this.getDetails();
        this.queryFloatIp();
    },
    methods: {
        // 获取RDS列表
        async getList() {
            return getList().then(resp => {
                if (resp.code === this.CODE.SUCCESS_CODE) {
                    let dataList = cloneDeep(resp.result.data);
                    if (isEmpty(dataList)) dataList = [];
                    this.$store.commit('rds/SET_INST_LIST', dataList);
                }
            });
        },
        async getDetails() {
            return getDetails(this.instId)
                .then(res => {
                    this.dataStore = res.dataStoreType.MySQL;
                    if (res.replica.code === this.CODE.SUCCESS) {
                        this.replica = res.replica.result;
                    }
                })
                .catch(err => {
                    $log(err);
                });
        },
        // 查询是否绑定IP
        queryFloatIp(flag = '') {
            this.loading = true;
            queryFloatIp({fixed_ip_address: this.instance.hostName, router_id: this.instance.vpcId})
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let floatingips = JSON.parse(res.result).floatingips;
                        if (!isEmpty(floatingips)) this.floating = floatingips[0];
                        if (flag === 'bind') {
                            if (!isEmpty(this.floating.floating_ip_address)) {
                                this.$message({
                                    message: '绑定成功',
                                    type: 'success'
                                });
                                this.bingLoading = false;
                            } else {
                                // 继续查询
                                this.queryFloatIp('bind');
                            }
                        }
                        if (flag === 'unbind') {
                            if (isEmpty(this.floating)) {
                                this.$message({
                                    message: '解绑成功',
                                    type: 'success'
                                });
                                this.unbingLoading = false;
                            } else {
                                // 继续查询
                                this.queryFloatIp('unbind');
                            }
                        }
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        applyIp() {
            this.$refs.applyIp
                .show()
                .then(res => {
                    this.bingLoading = true;
                    return sleep(10000); // 绑定成功后延迟10秒查询
                })
                .then(() => {
                    this.queryFloatIp('bind');
                });
        },
        // 解绑链接IP
        unbind() {
            this.$confirm('您确定要解绑外网地址：' + this.floating.floating_ip_address + '吗?', '解绑', {
                type: 'warning'
            }).then(action => {
                this.unbingLoading = true;
                updateFloatIp(this.rdsInst.id, 'disablePublicAccess')
                    .then(res => {
                        if (res.code === this.CODE.SUCCESS_CODE) {
                            return sleep(10000); // 成功后延迟10秒
                        }
                    })
                    .then(() => {
                        this.queryFloatIp('unbind');
                    })
                    .finally(() => {
                        // this.unbingLoading = false;
                    });
            });
        }
    }
};
</script>
<style scoped>
</style>
