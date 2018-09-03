<template>
    <div id="header">
        <el-header height="">
            <el-row>
                <el-col :span="6">
                    <el-menu mode="horizontal" router>
                        <!-- logo -->
                        <el-menu-item index="/app" key="/app" style="width: 50px; padding: 0px;">
                            <img src="@/assets/images/logo_collapsed.svg" width="24">
                        </el-menu-item>
                        <!-- 管理控制台 -->
                        <el-menu-item index="/app/overview" key="/app/overview">
                            <i class="iconfont icon-head_console_people"></i>{{$t('header.console')}}
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <!-- 右边菜单 -->
                <el-col :span="18">
                    <el-menu mode="horizontal" @select="handleSelect" class="pull-right">
                        <!-- 工单 -->
                        <el-menu-item index="app.ticketSystem.myTicket-list" key="app.ticketSystem.myTicket-list">
                            <i class="iconfont icon-head_workorder_peop"></i>{{$t('header.nav.workOrder')}}
                        </el-menu-item>
                        <!-- 头像 -->
                        <el-menu-item index="accountMg.info" key="app.accountMg" class="headImg">
                            <avatar-show class="inline-block" :boxSize="30" :avatarUrl="getAvatarUrl"></avatar-show>                            
                            <div @click.stop="preventBubble" class="pop-box">
                                <div class="pop-box__popover">
                                    <!-- 第二栏 -->
                                    <div class="pop-box__popover__popMain lh-normal font14">
                                        <p @click.stop="$router.push({'name': 'accountMg.info'})">
                                            {{$t('header.avatarMenu.basicInfo')}}
                                        </p>
                                    </div>
                                    <!-- 退出控制台 -->
                                    <div class="pop-box__popover__popBottom lh-normal">
                                        <el-button long @click="logOut">{{$t('header.avatarMenu.exitControl')}}</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-header>
    </div>
</template>
<script>
import AvatarShow from '@/components/avatar/AvatarShow';
export default {
    name: 'AppHeader',
    data() {
        return {
            input: '',
        };
    },
    created() {
    },
    computed: {
    },
    methods: {
        handleSelect(index, path) {
            this.$router.push({name: index});
        },
        logOut() {
            this.$store.dispatch('LOGOUT');
            this.$router.push({name: 'login'});
        }
    },
    components: {
        AvatarShow
    }
};
</script>
<style  lang="scss">
.pop-box {
    &__popover{
        background-color: #222a3f;
        // height: 270px;
        width: 188px;
        position: absolute;
        right: 0;
        box-sizing: border-box;
        display: none;
        transition: all .5s;
        // opacity: 0;
        box-shadow: 0px 1px 3px 0px 
        rgba(0, 0, 0, 0.1);
        &__popHeader{
            height: 88px;
            padding: 20px 30px;
            color: #fff !important;
            .bind-state{
                display: flex;
                margin-top: 8px;
                &__item{
                    margin-right: 15px;
                    flex: 1;
                    &:last-child{
                        margin:0;
                    }
                }
            }
        }
        &__popMain{
            padding: 10px 0;
            border-bottom: 1px solid rgba(238,238,238,.2);
            color: #fff;
            p{
                text-align: center;
                line-height: 32px;
                height: 32px;
                margin: 0;
            }
            p:hover{
                background-color: #19233c;
                color: #0d7ef2;
            }
        }
        &__popBottom{
            .el-button{
                background-color: #222a3f;
                border: 0;
                color: #fff;
            }
        }
        &__popBottom:hover{
            .el-button{
                color: #0d7ef2;
            }
        }
    }
}
.headImg:hover .pop-box__popover{
    display: block;
}
.color-phone{
    color: #abd037 !important;
}
.color-error{
    color: #dcdcdc !important;
}
.color-white{
    color: #FFF !important;
}
.app-header-popover {
    padding: 0 !important;
}
.h15{
    height: 15px;
}
.tooltip-box{
    display: inline-block;
    position: relative;
    &__tip{
        position: absolute;
        background-color: #FFF;
        left: -42px;
        display: inline-block;
        bottom: -35px;
        min-width: 100px;
        text-align: center;
        color: #333;
        opacity: 0;
        transition: all .5s;
        padding: 5px 8px;
        border: 1px solid #c3c5c6;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.34);
        &__arrow{
            display: inline-block;
            border: 6px solid transparent;
            border-bottom-color: #fff;
            position: absolute;
            top: -12px;
            left:48px;
        }
    }
    .arrow_tip{
        min-width: 80px;
        left: -42px;
    }

    // &:hover &__tip{
    //     opacity: 1;
    // }
}
.tooltip-box:hover .tooltip-box__tip{
    opacity: 1;
}
</style>