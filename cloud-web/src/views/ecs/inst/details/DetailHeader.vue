<template>
    <div class="page-header"  style="height: 50px;">
        <div class="page-header__title">
            <img src="@/assets/images/ecs/ecs_icon.svg" alt="" width="36" class="ecs-detail-img">
        </div>
        <div class="page-header__content">
            <div class="font16"> {{ ecsInst.name || "-"}}</div>
            <!-- <div>
                <span class="color999">{{$t('common.disk')}}：</span>
                <span class="mr10 colorblue1">{{ instDetailTop.diskCount }}</span>
                <span class="color999">{{$t('common.snap')}}：</span>
                <span class="mr10 colorblue1">{{ instDetailTop.snapshotCount }}</span>
                <span class="color999">{{$t('common.image')}}：</span>
                <span class="mr10">{{ instDetailTop.imageName }}</span>
                <span class="color999">{{$t('ecs.inst.list.netType')}}：</span>
                <span class="mr10">{{ instDetailTop.diskCount || $t('common.pn') }}</span>
                <span class="color999">{{$t('common.status')}}：</span>
                <span>{{ instDetailTop.instanceStatus }}</span>
            </div> -->
        </div>
        <div class="page-header__buttons">
            <!-- <el-button type="info" size="small" @click="stopInst" v-if="instDetailTop.instanceStatus == 'ACTIVE'">
                <i class="iconfont icon-tingzhi"></i> {{ $t('ecs.inst.list.dropdownBtns.stop') }}
            </el-button>
            <el-button type="info" size="small" @click="restartInst" v-if="instDetailTop.instanceStatus == 'ACTIVE'">
                <i class="iconfont icon-zhongqi"></i> {{ $t('ecs.inst.list.dropdownBtns.restart') }}
            </el-button> -->
            <!-- <el-button type="info" size="small" @click="startInst" v-if="instDetailTop.instanceStatus == 'SHUTOFF'">
                <i class="iconfont icon-restart_people"></i> {{ $t('ecs.inst.list.dropdownBtns.start') }}
            </el-button> -->
            <el-button type="info" size="small" class="refresh-btn" @click="refresh">
                <i class="iconfont icon-icon-refresh" v-tooltip.bottom="{content: $t('common.refresh'), theme: 'is-light'}" ></i>
            </el-button>
        </div>

        <!-- 对话框 停止实例 -->
        <!-- <stop-inst-dialog ref="stopInstDialog"/> -->

        <!-- 对话框 重启强制重启实例 -->
        <!-- <restart-inst-dialog ref="restartInstDialog"/> -->

        <!-- 手机验证弹框 -->
        <!-- <mobile-code-dialog ref="mobileCodeDialog" :code-type="CHECK"></mobile-code-dialog> -->

    </div>
</template>

<script>
import { mapState } from 'vuex';
import { CHECK } from '@/constants/const';
// import { getInstanceCountInfo } from '@/service/ecs/detail/index';
import { ecsInstAction } from '@/service/ecs/list';
import StopInstDialog from '../ecsDialog/stopCaseDialog';
import RestartInstDialog from '../ecsDialog/restartInstDialog';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';

export default {
    name: 'EcsInstDetailHeader',
    components:{
        RestartInstDialog,
        StopInstDialog,
        MobileCodeDialog
    },
    props: ['ecsInst'],
    data() {
        let stateParams = this.$route.params || {};  
        return {
            CHECK,
            stateParams,          
            instDetailTop:{}
        };
    },   
    computed: {
        ...mapState({
            user: state => state.user.userInfo
        })
    },

    methods: {
        

        //开关机操作统一处理 （停止、强制停止、启动、重启、强制重启）
        ecsInstAction: function(instanceId,type) { 
            //向后台提交表单请求
            ecsInstAction(instanceId,type).then( (res) => {
                console.log('ecsInstAction:::',res);

            });
        },

        //停止实例
        stopInst: function() {
            this.$refs.stopInstDialog
                .show()
                .then( ret => {
                    console.log('stopInst ret:::',ret);
                    this.$refs.mobileCodeDialog.show().then( async (res) => {
                        if (res.code === this.CODE.SUCCESS_CODE) {                         
                            this.ecsInstAction(this.stateParams.id,ret);
                        }
                    });                    
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
            
        },        

        //重启、强制重启实例
        restartInst: function() {
            this.$refs.restartInstDialog
                .show()
                .then( ret => {
                    console.log('restartInst ret:::',ret);
                    this.$refs.mobileCodeDialog.show().then( async (res) => {
                        if (res.code === this.CODE.SUCCESS_CODE) {                         
                            this.ecsInstAction(this.stateParams.id,ret);
                        }
                    });                    
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },

        //启动实例
        startInst: function() {
            this.$confirm('确定要对该云服务器进行开机操作吗？', '启动', {
                type: 'warning'
            }).then(() => {
                console.log('startInst ret:::');
                this.$refs.mobileCodeDialog.show().then( async (res) => {
                    if (res.code === this.CODE.SUCCESS_CODE) {                         
                        this.ecsInstAction(this.stateParams.id,1);
                    }
                });
            });
        },

        //刷新
        refresh: function() {
            this.$emit('refresh',this.stateParams.id);
        }
    },
};
</script>
<style scoped lang="scss">
.ecs-detail-img {
    /* height: 50px; */
    background-repeat: no-repeat;
    background-position: left;
}
.el-button.refresh-btn.el-button--small{
    padding: 9px;
    i{
        padding: 9px 0;
    }
}
</style>



        
        