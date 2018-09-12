<template>
    <component v-bind:is="currentView"></component>
    
</template>

<script>
import { mapState } from 'vuex';
import Overview from '@/views/dashboard/Overview'; //超级管理员
import DepartOverview from '@/views/dashboard/DepartOverview'; //部门管理员
export default {   
    data(){
        return {
            currentView:'',
        };        
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    created(){
        switch(parseInt(this.user.roleType) ){
            case 1:{ this.currentView = Overview ; break;}
            case 2:
            case 3:{ this.currentView = DepartOverview ; break;}
            case 4:{break;}
            default:{break;}
        }        
    }    
};
</script>

<style scoped lang="scss">

</style>



