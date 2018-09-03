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
        <el-row >
            <el-col :span="10" style="max-height:450px;overflow: auto">
                <el-form ref="platAuthForm" :inline="false" :show-message="false" inline-message size="small" :model="platAuthForm"  label-width="120px">
                    <el-form-item  class="mb10 hide-star"  v-for="(item,index) in platFormList" :key="item['id'+index]" :label="item.resource">
                        <el-select v-model="platAuthForm[index]" @change="changeVal(index)" placeholder="请选择平台角色"  value-key="id" size="small" class="mr10">
                            <el-option v-for="(role,idx) in item.platformRoleVoList" :key="idx" :label="role.name" :value="role.platformResourceId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="14">
                <el-button type="primary" class="font12 ml20" @click="bindAuth">提  交</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {searchBindAuth,getPlatformList,bindAuth} from '@/service/usermgr/platform.js';
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
            platFormList: [],
        };
    },
    components: {


    },
    methods: {
        changeVal(i){
            console.log('this.platAuthForm',i);
        },

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
                let resData = ret.data;
                if(resData ){
                    this.platFormList = resData;
                    for ( let i = 0 ; i < resData.length ; i++){
                        this.platAuthForm['id' + i ] = '';
                    }
                }
            });
        },
        goBack(){
            window.history.back();
        },
        bindAuth(){
            for(let key in this.platAuthForm){
                if(this.platAuthForm[key]){
                    this.platformRoleIds.push(this.platAuthForm[key]);
                }
            }
            let param = {
                roleType:this.stateParams.val,
                ids:{
                    platformRoleIds:this.platformRoleIds
                }
            };
            bindAuth(param).then(ret => {
                $log('searchBindAuth', ret);
                // let resData = ret.data;
                // if(resData && resData.data){
                //
                // }
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
