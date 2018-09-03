<template>
    <div class="page-main rds-details" v-loading="loading">
        <page-header>
            <img src="@/assets/images/rds/rds_icon.svg" height="50" alt="">
            <div slot="content">
                <div class="font16">{{get(rdsInst, 'instance.name')}}</div>
                <div class="mt10 font12">
                    <label class="mr20">
                        <span class="color-secondary">状态：</span>
                        <zt-status :status="DICT_RDS.RDS_STATUS" :value="get(rdsInst, 'instance.status')"></zt-status>
                    </label>
                    <label>
                        <span class="color-secondary">创建时间：</span> {{get(rdsInst, 'instance.created')|date}}
                    </label>
                </div>
            </div>
            <div slot="right">
                <!-- <el-button type="info" size="small" icon="el-icon-delete">
                    删除
                </el-button>
                <el-tooltip content="刷新" placement="left">
                    <el-button type="info" size="small">
                        <i class="iconfont icon-refresh_people"></i>
                    </el-button>
                </el-tooltip> -->
            </div>
        </page-header>
        <div class="page-body">
            <keep-alive>
                <router-view :instId="instId" />
            </keep-alive>
        </div>
    </div>
</template>
<script>
import {getInstInfo} from '@/service/rds/detail';
import {DICT_RDS} from '@/constants/dicts/rds';
import {cloneDeep} from '@/utils/utils';
import ZtStatus from '@/components/status/ZtStatus';
export default {
    name: 'Inst',
    data() {
        return {
            loading: true,
            DICT_RDS,
            instId: '',
            rdsInst: {}
        };
    },
    components: {
        ZtStatus
    },
    computed: {},
    activated() {
        this.rdsInst = {};
        try {
            this.instId = this.$route.params.id;
            this.getInstInfo();
        } catch (error) {
            this.$store.commit('SET_PAGE_LOAD_ERROR', '参数错误');
            throw new Error(error.toString());
        }
    },
    methods: {
        getInstInfo() {
            this.loading = true;
            getInstInfo(this.instId)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.rdsInst = JSON.parse(res.result);
                        this.$store.commit('rds/SET_INSTANCE', cloneDeep(this.rdsInst.instance));
                    } else {
                        this.$store.commit('SET_PAGE_LOAD_ERROR', '查询的实例不存在');
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style scoped>
</style>
