<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-form :inline="true"  size="small">
                    <el-form-item>
                        <el-button class=" fa fa-angle-left" type="primary" @click="goBack" size="small">&nbsp;返回</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-form ref="platAuthForm" :inline="false" :show-message="false" inline-message size="small" :model="platAuthForm"  label-width="60px">
                   <el-form-item  class="mb10 hide-star"  v-for="(item,index) in platAuthForm" :key="item['id'+index]" label="平台:">
                        <span>{{item['id'+index]}} {{index}}</span>
                       <el-select v-model="item['id'+index]" @change="changeVal(index)" placeholder="请选择平台角色"  value-key="id" size="small" class="mr10">
                           <span>{{index}}</span>
                           <el-option v-for="role in platFormList[0]" :key="role.id" :label="role.name" :value="role">
                           </el-option>
                       </el-select>
                   </el-form-item>

             </el-form>
        </el-row>
        <el-row>
            {{platAuthForm}}
        </el-row>
        <el-row>
            {{platFormList}}
        </el-row>
        <el-row>
             <span class="dialog-footer">
                <el-button type="primary" class="font12" @click="bindAuth">提  交</el-button>
            </span>
        </el-row>
    </div>
</template>
<script>
import {searchBindAuth,bindAuth,getPlatformList} from '@/service/usermgr/platform.js';
export default {
    name: 'app',

    data() {
        let stateParams = this.$route.params || {};
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        return {
            stateParams,
            searchObj,
            platAuthForm:{

            },
            platformRoleIds:[],
            roleIds: [],
            platFormList: [],
            roles:[]

        };
    },
    components: {


    },
    methods: {
        changeVal(i){
            console.log('this.platAuthForm',i);
        },
        // searchPlatAuth(){
        //     let params = {
        //         paging:this.searchObj.paging
        //     };
        //     $log('paramsss', params);
        //     searchPlatAuth(params).then(ret => {
        //         $log('data', ret);
        //         let resData = ret.data;
        //         if(resData && resData.data){
        //             this.roles = resData.data || [];
        //         }
        //
        //     });
        // },
        // getplatformList(){
        //     let params = {
        //         paging:this.searchObj.paging
        //
        //     };
        //     $log('params', params);
        //     this.searchPlatAuth();
        //     getplatformList(params).then(ret => {
        //         $log('data', ret);
        //         let resData = ret.data.data;
        //         let roles = this.roles;
        //         if(resData){
        //             for ( let i = 0 ; i < resData.length ; i++){
        //                 let curId = resData[i].id;
        //                 let arr = [];
        //                 for(let m = 0 ; m < roles.length ; m++){
        //                     if(curId === roles[m].platformResourceId){
        //                         arr.push(roles[m]);
        //                     }
        //                 }
        //                 this.platAuthForm['id' + i ] = '';
        //                 this.platFormList.push(arr);
        //             }
        //             console.log('this.platAuthForm',this.platAuthForm);
        //             console.log('dssdsda',this.platFormList);
        //         }
        //
        //     });
        // },
        searchBindAuth(){
            searchBindAuth(this.stateParams.val).then(ret => {
                $log('searchBindAuth', ret);
                let resData = ret.data;
                if(resData && resData.data){

                }
            });
        },
        getPlatformList(){
            getPlatformList(this.stateParams.val).then(ret => {
                $log('getPlatformList', ret);
                // let resData = ret.data;
                // if(resData && resData.data){
                //
                // }
            });
        },
        goBack(){
            window.history.back();
        },
        bindAuth(){
            let param = {
                roleType:this.stateParams.val,
                platformRoleIds:this.platformRoleIds
            };
            bindAuth(param).then(ret => {
                $log('searchBindAuth', ret);
                let resData = ret.data;
                if(resData && resData.data){

                }
            });
        }

    },
    mounted(){
        this.searchBindAuth();
        this.getPlatformList();


    }
};
</script>
<style scoped>
</style>
