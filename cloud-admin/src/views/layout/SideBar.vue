<template>
    <div class="height-all">
        <div class="sidebar-menu" :class="{'sidebar-menu--collapse':isCollapse}"  @mouseenter="isCollapse = false" @mouseleave="isCollapse = true">
            <el-menu :default-active="activeMenuCode" @select="handleSelect">           
                <template v-for="(menu) in menuList">
                    <el-menu-item  :index="menu.menuCode" :key="menu.menuCode">                    
                        <em :class="menu.menuIcon"></em>
                        <span v-if="!isCollapse" slot="title">{{menu.menuName}}</span>   
                    </el-menu-item> 
                </template>           
            </el-menu>
        </div>

        <div class="sidebar-submenu">          
            <el-menu :default-active="activeRouteHref" unique-opened @select="goto">           
                <template v-for="submenu in submenus">
                    <el-menu-item  :index="submenu.routeHref" :key="submenu.menuCode">                    
                        <em :class="submenu.menuIcon"></em>
                        <span slot="title">{{submenu.menuName}}</span>                  
                    </el-menu-item>
                </template>              
            </el-menu>
        </div>       
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {GetmenuList} from '@/service/overview.js';
export default {
    name: 'sidebar',
    data() {
        return {          
            navList: [],
            activeRouteHref: '',
            isCollapse: true,
            activeMenuCode: '0000', //menuCode
        };
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo,
            //isCollapse: state => state.collapse,
        }),
        menuList: function() {
            return this.navList;
        },
        submenus: function() {
            if(this.menuList.length){
                //return this.menuList[this.activeMenuCode].submenus || [];
                let menu = this.menuList.find( (menu) => {
                    return menu.menuCode === this.activeMenuCode;
                });
                return menu.submenus || [];
            } 
        }
    },
    watch: {
        '$route': function(newVal) {            
            if(newVal) {                
                this.activeRouteHref = this.parseRouterName();                
            }
        }
    },
    methods: { 
        goto(index) {
            console.log(index);
            if(index && (index.includes('http://') || index.includes('https://')) ){
                window.location.href = index;
            }else {
                this.$router.push({name: index});
            }
        },
        getmenuList(){
            $log('this.user:',this.user);
            let param = { roleId:this.user.roleId };
            
            //let reg = /http:/;
            GetmenuList(param)
                .then( res => {
                    this.navList = res || [];

                    //匹配激活的一级菜单 （只有两级菜单的情况）
                    this.navList.forEach( (menu) => {                    
                        if(menu.submenus && menu.submenus.length){
                            let routerName = this.parseRouterName();
                            let submenu = menu.submenus.find( (submenu) => {
                                if(submenu.routeHref && submenu.routeHref !== '#'){
                                    return submenu.routeHref === routerName;
                                }                           
                            });                        
                            if(submenu) { 
                                this.activeRouteHref = routerName;                        
                                if(submenu.parentMenuCode && submenu.parentMenuCode){
                                    this.activeMenuCode = submenu.parentMenuCode;
                                }
                            }
                        }
                    });
                });
        },
        parseRouterName(){
            let routerName = '';
            if (this.$route.meta && this.$route.meta.parentName) {
                routerName = this.$route.meta.parentName;
            }else {
                routerName = this.$route.name;
            }
            return routerName;
        },
        handleSelect(active) {
            this.activeMenuCode = active;

            if(this.menuList.length){                
                let menu = this.menuList.find( (menu) => {
                    return menu.menuCode === this.activeMenuCode;
                });
                let submenus = menu.submenus || [];
                if(submenus.length){
                    let submenu = submenus[0];                   
                    this.goto(submenu.routeHref);
                }
            } 
        }
    },
    mounted(){
        this.getmenuList();
    }
};
</script>
<style  lang="scss">

</style>
