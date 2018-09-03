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
            <div>
                <div v-for="item in platFormList" :key="item.id" class="mb20">
                    <span>平台：{{item.resource}}</span>
                    <el-select v-model="item.id" key="id" :placeholder="请选择角色" :popper-append-to-body="false" value-key="name" size="small" class="mr10">
                        <el-option v-for="role in item.roleArr" :key="role.name" :label="role.name" :value="name">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--<el-form ref="subNetForm" :inline="true" :show-message="false" inline-message size="small" :model="form" :rules="rules" label-width="0">-->
               <!--<div v-for="item in platFormList" :key="item.id">-->
                   <!--<el-form-item  class="mb10 hide-star" prop="netWork" >-->
                       <!--<span>平台：{{item.resource}}</span>-->
                       <!--<el-select v-model="form.netWork" key="newWork" :placeholder="$t('form.input.network')" :popper-append-to-body="false" value-key="name" size="small" class="mr10" @change="netWorkHandleChange">-->
                           <!--<el-option v-for="net in netWorkList" tooltip="fsa" :key="net.name" :label="net.name" :value="net">-->
                           <!--</el-option>-->
                       <!--</el-select>-->
                   <!--</el-form-item>-->
                   <!--<el-form-item label="" class="mb10 hide-star" prop="netWork">-->
                       <!--&lt;!&ndash;<el-select v-model="form.netWork" key="newWork" :placeholder="$t('form.input.network')" :popper-append-to-body="false" value-key="name" size="small" class="mr10" @change="netWorkHandleChange">&ndash;&gt;-->
                           <!--&lt;!&ndash;<el-option v-for="net in netWorkList" tooltip="fsa" :key="net.name" :label="net.name" :value="net">&ndash;&gt;-->
                           <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                       <!--&lt;!&ndash;</el-select>&ndash;&gt;-->

                   <!--</el-form-item>-->
               <!--</div>-->
             <!--</el-form>-->
        </el-row>

    </div>
</template>
<script>
import {searchBindAuth,getplatformList,searchPlatAuth} from '@/service/platform.js';
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
            platForm:{

            },
            roleIds: [],
            platFormList: [],
            roles:[]

        };
    },
    components: {


    },
    methods: {
        searchPlatAuth(){
            let params = {
                paging:this.searchObj.paging
            };
            $log('params', params);
            searchPlatAuth(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.roles = resData.data || [];
                }

            });
        },
        getplatformList(){
            let params = {
                paging:this.searchObj.paging

            };
            $log('params', params);
            this.searchPlatAuth();
            getplatformList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data.data;
                let roles = this.roles;
                if(resData){
                    for ( let i = 0 ; i < resData.length ; i++){
                        let curId = resData[i].id;
                        let obj = {
                            id:'',
                            roleArr:[]
                        };
                        for(let m = 0 ; m < roles.length ; m++){
                            if(curId === roles[m].platformResourceId){
                                obj.roleId = roles[m].id;
                                obj.roleArr.push(roles[m]);
                            }
                        }
                        this.platFormList.push(obj);
                    }
                    console.log('dssdsda',this.platFormList);
                }

            });
        },
        searchBindAuth(){
            searchBindAuth(this.stateParams.val).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    this.tableData = resData.data || [];
                }

            });
        },
        goBack(){
            window.history.back();
        },

    },
    mounted(){
        this.searchBindAuth();
        this.getplatformList();
    }
};
</script>
<style scoped>
</style>
