<template>
    <el-container>
        <el-header style="background-color:#001529">
            <nav-bar></nav-bar>
        </el-header>

        <el-container>
            <el-aside width="auto">
                <side-bar></side-bar>
            </el-aside>
            <el-main id="setHeightAuto">
                <app-main></app-main>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import {mapState} from 'vuex';
import NavBar from './NavBar';
import AppMain from './AppMain';
import SideBar from './SideBar';
export default {
    data() {
        return {
            screenHeight: 0
        };
    },

    props: {},

    components: {
        AppMain,
        NavBar,
        SideBar
    },

    computed: {
        ...mapState({
            // isCollapse: state => state.collapse,
            // pageLoading: state => state.pageLoading,
            // pageLoadError: state => state.pageLoadError,
            isLogined: state => state.isLogined
            // navCollapse: state => state.navCollapse,
            // showVerifyDialog: state => state.showVerifyDialog
        })        
        // // 判断是不有二级菜单
        // hasSubMenu: function() {
        //     return this.subMenuList.length > 0 ? true : false;
        // },
        // mainLeft: function() {
        //     // 此处根据侧边栏是否折叠以及是否有二级菜单且根据展开状态给el-main动态添加class
        //     // let left = this.isCollapse ? 'left-xs' : 'left-sm';
        //     return 'left-xs';
        // },
        // subMenuList: function() {
        //     let obj = getSubMenu(this.$route.matched);
        //     this.setData(obj);
        //     return obj.subMenu;
        // },
        // // 是否显示侧边栏
        // showSide: function() {
        //     try {
        //         let fullpage = this.$route.meta.fullpage;
        //         return fullpage === true ? false : true;
        //     } catch (error) {
        //         return true;
        //     }
        // }
    },
    watch: {
        isLogined: function(newval) {
            if (newval !== true) {
                this.$router.push({name: 'login'});
            }
        },
        screenHeight(val) {
            this.screenHeight = val;
            let el = document.getElementById('setHeightAuto');
            el.style.maxHeight = this.screenHeight + 'px';
            el.style.overflow = 'auto';
        }
    },
    created() {},

    methods: {
        setHeight() {
            let screenH = document.documentElement.clientHeight - 60;
            let el = document.getElementById('setHeightAuto');
            el.style.maxHeight = screenH + 'px';
            el.style.overflow = 'auto';
        }
    },
    mounted() {
        this.setHeight();
        const that = this;
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.documentElement.clientHeight - 60;
                that.screenWidth = this.screenHeight;
            })();
        };
    }
};
</script>
<style lang='scss' scoped>
.el-container {
    height: 100%;
}
.el-header {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #001529;
    text-align: center;
}
#setHeightAuto {
    padding: 20px;
}
.el-main {
    background-color: #fff; // #e9eef3;
    color: #333;
    min-width: 1166px;
}

body > .el-container {
    margin-bottom: 40px;
}
</style>
