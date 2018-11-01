<template>
    <div class="page-main">
        <el-dialog title="绑定平台权限" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
            <el-row >
                <el-form ref="platAuthForm" :inline="false" :show-message="false" inline-message size="small" :model="platAuthForm"  label-width="120px">
                    <el-form-item  class="mb10 hide-star"  v-for="(item,index) in platFormList" :key="item['id'+index]" :label="item.resource">
                        <el-select v-model="platAuthForm[index]"  placeholder="请选择平台角色"  value-key="id" size="small" class="mr10">
                            <el-option v-for="(role,idx) in item.platformRoleVoList" :key="idx" :label="role.name" :value="role">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="default" class="font12 " @click="cancel">取 消</el-button>
                        <el-button type="primary" class="font12 ml20" @click="bindAuth">提  交</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-dialog>

    </div>
</template>
<script>
import {getPlatformList,bindAuth} from '@/service/platform.js';
export default {
    name: 'app',

    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        return {
            isShow:false,
            searchObj,
            platAuthForm:{

            },
            platformRoleIds:[],
            platFormList: [],
            item:{}
        };
    },
    components: {


    },
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            this.getPlatformList();
            this.$nextTick(() => {
                this.$refs['platAuthForm'].clearValidate();
            });
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

        },

        getPlatformList(){
            getPlatformList(this.item.val).then(ret => {
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
        cancel(){
            this.goBack();
        },
        goBack(){
            window.history.back();
        },
        bindAuth(){
            this.platformRoleIds = [];
            for(let key in this.platAuthForm){
                if(this.platAuthForm[key]){
                    this.platformRoleIds.push(this.platAuthForm[key].id);
                }
            }
            let param = {
                roleType:this.item.val,
                platformRoleIds:this.platformRoleIds
            };
            console.log('param',param);
            bindAuth(param).then(ret => {
                if(ret.code === '0000'){
                    this.$alert('操作成功','提示');
                    this.hide();
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    return;
                }
            })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },  
    }
};
</script>
<style scoped>
</style>
