<template>
    <el-container>
        <app-header></app-header>
        <template v-if="showSide">
            <el-aside width="" :class="{minBar: isCollapse}" @mouseover.native="isCollapse = false" @mouseleave.native="isCollapse = true">
                <!-- <ul class="el-menu">
                        <li role="menuitem" tabindex="-1" class="el-menu-item text-center el-aside-top" @click="isCollapse = !isCollapse">
                            <div class="el-menu-item__inner">
                                <i class="iconfont icon-menu_people1" v-if="!isCollapse"></i>
                                <i class="iconfont icon-menu_people" v-if="isCollapse"></i>
                            </div>
                        </li>
                    </ul> -->
                <el-menu :default-active="activeIndex" @select="handleSelect">
                    <template v-for="nav in navList">
                        <el-menu-item v-if="nav.hidden !== true" :index="nav.sref" :key="nav.serf">
                                <div class="el-menu-item__inner">
                                    <i :class="nav.icon"></i>
                                    <span>{{nav.text}}</span>
                                </div>
                        </el-menu-item>
                    </template>
                    <!-- 这里写一个空的是为了返回控制台首页清空activeIndex的时候菜单选中状态不变化的问题 -->
                    <el-menu-item v-show="false" index=""></el-menu-item>
                </el-menu>
            </el-aside>
            <el-main :class="mainLeft">
                <!-- 二级菜单 -->
                <submenu v-if="hasSubMenu" :sub-menu-list="subMenuList" :module-name="moduleName"></submenu>
                <div class="el-main-wrap" :class="{'not-open': navCollapse}">
                    <transition name="fade">
                        <router-view v-show="pageLoadError === ''" />
                    </transition>
                    <page-error v-if="pageLoadError"></page-error>
                </div>
                <!-- <page-loading v-if="pageLoading && !pageLoadError"></page-loading> -->
            </el-main>
        </template>
        <template v-else class="Nomenu">
            <transition name="fade">
                <router-view v-show="pageLoadError === ''" />
            </transition>
            <page-error v-if="pageLoadError"></page-error>
        </template>
        <real-name-verify v-if="showVerifyDialog" name="dialogVisible"></real-name-verify>
    </el-container>
</template>

<script>
import {mapState} from 'vuex';
import submenu from '@/components/submenu/Index';
import AppHeader from '@/components/header/AppHeader';
import PageLoading from '@/components/pageLoading/PageLoading';
import PageError from '@/components/pageError/PageError';
import RealNameVerify from '@/components/dialog/RealNameVerify';
import {getSubMenu} from '@/utils/utils';
import {getLoginState} from '@/service/login';
export default {
    name: 'Layout',
    data() {
        return {
            activeIndex: '',
            moduleName: '',
            isCollapse: true,
            openDelay: 300
        };
    },
    components: {
        AppHeader,
        submenu,
        PageLoading,
        PageError,
        RealNameVerify
    },
    computed: {
        ...mapState({
            // isCollapse: state => state.collapse,
            pageLoading: state => state.pageLoading,
            pageLoadError: state => state.pageLoadError,
            isLogined: state => state.isLogined,
            navCollapse: state => state.navCollapse,
            showVerifyDialog: state => state.showVerifyDialog
        }),
        navList: function() {
            return window.navList;
        },
        // 判断是不有二级菜单
        hasSubMenu: function() {
            return this.subMenuList.length > 0 ? true : false;
        },
        mainLeft: function() {
            // 此处根据侧边栏是否折叠以及是否有二级菜单且根据展开状态给el-main动态添加class
            // let left = this.isCollapse ? 'left-xs' : 'left-sm';
            return 'left-xs';
        },
        subMenuList: function() {
            let obj = getSubMenu(this.$route.matched);
            this.setData(obj);
            return obj.subMenu;
        },
        // 是否显示侧边栏
        showSide: function() {
            try {
                let fullpage = this.$route.meta.fullpage;
                return fullpage === true ? false : true;
            } catch (error) {
                return true;
            }
        }
    },
    watch: {
        '$router': function(newval) {
            let res = getLoginState();
            if (res.code !== '0000') {
                this.$store.dispatch('LOGOUT');
            }
        },
        isLogined: function(newval) {
            if (newval !== true) {
                this.$router.push({name: 'login'});
            }
        },
        hasSubMenu: function(newval) {
            if (!newval) {
                this.activeIndex = '';
            }
        }
    },
    methods: {
        handleSelect(index) {
            this.$router.push({
                name: index
            });
        },
        setData(obj) {
            this.moduleName = obj.moduleName;
            this.activeIndex = obj.activeIndex;
        }
    },
    mounted() {}
};
</script>

<style scoped>
.Nomenu {
    padding: 50px;
}
</style>
