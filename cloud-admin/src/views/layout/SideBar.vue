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

                <!-- 这里写一个空的是为了返回控制台首页清空activeIndex的时候菜单选中状态不变化的问题 -->
                <el-menu-item v-show="false" index="0000"></el-menu-item>          
            </el-menu>
        </div>

        <div class="sidebar-submenu" v-if="submenus.length">          
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
//import {GetmenuList} from '@/service/overview.js';
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
            return window.navList || [];
        },
        submenus: function() {
            if(window.navList.length){
                let submenus = [];
                this.parseActivemenu(window.navList); 
                $log('activeMenuCode----------',this.activeMenuCode);                        
                let menu = window.navList.find( (menu) => {
                    return menu.menuCode === this.activeMenuCode;
                });                
                if(menu) {                     
                    submenus = menu.submenus || [];
                }
                
                $log('menu----------',menu);
                return submenus;                              
            } 
            return [];
        }
    },
    watch: {
        '$route': function(newVal) {            
            if(newVal) {
                this.parseActivemenu(this.menuList);
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
     
        parseRouterName(){
            let routerName = '';
            if (this.$route.meta && this.$route.meta.parentName) {
                routerName = this.$route.meta.parentName;
            }else {
                routerName = this.$route.name;
            }
            return routerName;
        },

        //处理激活的一二级菜单；
        parseActivemenu(menuList){        
            if(menuList && menuList.length){
                this.activeRouteHref = this.parseRouterName();
                menuList.forEach( (menu) =>{
                    if(menu.submenus && menu.submenus.length){                        
                        let submenu = menu.submenus.find( (submenu) => {
                            if(submenu.routeHref && submenu.routeHref !== '#'){
                                return submenu.routeHref === this.activeRouteHref;
                            }                           
                        });                        
                        if(submenu) { 
                            this.activeMenuCode = menu.menuCode; 
                        }else{                         
                            this.activeMenuCode = '0000';
                        }
                    }
                }); 
            }
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
    created(){
        this.parseActivemenu();
    }
};
</script>
<style  lang="scss">

</style>
