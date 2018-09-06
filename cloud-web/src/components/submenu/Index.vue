<template>
    <div :class="{'submenu': true, 'left': true, 'is-open': !navCollapse, 'not-open': navCollapse}">
        <nav>
            <div class="submenu-top" v-if="!showBack">{{moduleName}}</div>
            <div class="submenu-top back" v-if="showBack" @click="$router.push({name: backUrl})">
                <i class="el-icon-arrow-left"></i> 返回</div>
            <el-menu ref="submenu" :default-active="activeIndex" @select="handleSelect" unique-opened>
                <template v-for="(nav, index) in subMenuList">
                    <template v-if="showNav(nav)">
                        <el-submenu v-if="nav.submenu" :index="nav.sref" :key="index">
                            <template slot="title">
                                <i class="el-icon-caret-bottom"></i>
                                <span>{{nav.text}}</span>
                            </template>
                            <el-menu-item v-for="child in nav.submenu" :index="child.sref" :class="{'is-actives': child.sref === activeIndex}" :key="child.sref">{{child.text}}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :index="nav.sref" :class="{'is-actives': nav.sref === activeIndex}" :key="index">
                             <span slot="title">{{nav.text}}</span>
                        </el-menu-item>
                    </template>
                </template>
                <oss-side-bar v-if="$route.path.startsWith('/app/oss') === true"></oss-side-bar>
            </el-menu>
            <nav-collapse></nav-collapse>
        </nav>
    </div>
</template>
<script>
import OssSideBar from '@/views/oss/SideBar';
import NavCollapse from '@/components/submenu/NavCollapse';
import {mapGetters} from 'vuex';
// import {removeClass} from '@/utils/utils';
export default {
    name: 'Index',
    data() {
        return {
            activeIndex: '',
            showMenu: true,
            backUrl: ''
        };
    },
    components: {
        OssSideBar,
        NavCollapse
    },
    computed: {
        // 检查是否显示返回链接
        showBack: function() {
            try {
                let parent = this.$route.matched[this.$route.matched.length - 2];
                let current = this.$route.matched[this.$route.matched.length - 1];
                // 如果 当前路由设置了返回
                if (current.meta.hasOwnProperty('showBack') && current.meta.showBack) {
                    this.setBackUrl(current.meta.backUrl);
                    return true;
                }
                // 如果上级路由设置了返回
                if (parent && parent.meta.hasOwnProperty('showBack') && parent.meta.showBack) {
                    this.setBackUrl(parent.meta.backUrl);
                    return true;
                }
                return false;
            } catch (error) {
                $log(error);
                return false;
            }
        },
        ...mapGetters(['navCollapse'])
    },
    watch: {
        // 根据路由设置菜单选中状态
        $route: function(newval) {
            // let submenu = document.getElementsByClassName('submenu')[0];
            // let element = submenu.getElementsByClassName('is-active');
            // for(let e of element) {
            //     removeClass(e, 'is-active');
            // }
            this.activeIndex = (newval.meta && newval.meta.activeIndex) || newval.name;
        }
    },
    props: {
        left: String,
        moduleName: String,
        subMenuList: Array
    },
    methods: {
        handleSelect(index) {
            this.$router.push({
                name: index
            });
        },
        setBackUrl(url) {
            this.backUrl = url;
        },
        showNav(nav) {
            return process.env.VUE_APP_BUILD === 'pro' ? nav.hidden !== true && nav.evn === 'pro' : nav.hidden !== true;
        }
    },
    mounted() {
        this.activeIndex = this.$route.name;
    }
};
</script>
<style scoped lang="scss">
</style>
