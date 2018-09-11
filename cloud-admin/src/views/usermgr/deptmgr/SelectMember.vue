<template>
    <el-dialog title="管理成员" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <el-row>
            <div class="mb10" v-if="selectedUser.length>0">已选择：{{selectedUser[0].name}} 等 <span class="text-success font16 ">{{selectedUser.length}}</span> 位成员</div>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;height:400px;overflow-y: auto">
                <div class="mb10">所有成员：</div>
                <div class="item" v-for="(user,index) in allUsers" :key="user.id" v-if="allUsers.length>0">
                    <span>{{user.name}}</span>
                    <el-button type="primary pull-right" size="small" style="font-size: 18px;" @click="chooseCur(index)">+</el-button>
                </div>
            </el-col>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;border-left:0;height:400px;overflow-y: auto">
                <div class="mb10">已选择成员：</div>
                <div class="item" v-for="(user,index) in selectedUser" :key="user.id" v-if="selectedUser.length>0">
                    <span>{{user.name}}</span>
                    <el-button type="primary pull-right" size="small" style="font-size: 18px;" @click="delCur(index)">-</el-button>
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {selectAllUsers,searchByProjectId,editRente} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            item:{},
            brunch:{},
            allUsers:[],
            selectedUser:[],
            confirmBtn:false
        };
    },
    props: {},
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        show(item,brunch) {
            this.isShow = true;
            this.item = item;
            this.brunch = brunch;
            console.log('item????',item);
            console.log('item????,,,,',brunch);
            this.selectAllProject();
            this.searchByProjectId();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        //通过租户id查找用户
        searchByProjectId(){
            let param = {
                deptId:this.brunch.id,
                projectId:this.item.id,
            };
            searchByProjectId(param).then(ret => {
                $log('list....searchByProjectId', ret);
                let resData = ret.data;
                if(resData){
                    this.selectedUser = resData || [];
                }
            });
        },
        //查询所有用户
        selectAllProject(){
            let param = {
                limit:9999,
                domainId:this.brunch.id
            };
            selectAllUsers(param).then(ret => {
                $log('list', ret);
                let resData = ret.data;
                if(resData){
                    this.allUsers = resData.data || [];
                }

            });
        },
        //保存（提交）
        submitForm() {
            this.confirmBtn = true;
            let param = {
                id:this.item.id,
                data:{
                    grantUsers:this.selectedUser,
                    quota:{},
                    tenantinfo:{
                        enabled:this.brunch.enabled == '1' ? true : false,
                        status:this.brunch.enabled == '1' ? 1 : 0,
                        deptId:this.brunch.id,
                        name:this.item.name,
                        description:this.item.description,
                    },
                    revokeUsers:[]
                }
            };
            editRente(param).then(ret => {
                $log('result...', ret);
                if(ret.data.code === '0000'){
                    this.confirmBtn = false;
                    return this.$confirm('操作成功');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    this.confirmBtn = false;
                }

            });
        },
        hide() {
            this.isShow = false;

        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        chooseCur(i){
            let item = this.allUsers.splice(i,1);
            this.selectedUser.push(item[0]);
        },
        delCur(i){
            let item = this.selectedUser.splice(i,1);
            this.allUsers.push(item[0]);
        },

    },
    mounted(){

    }
};
</script>
<style lang="scss">
    .item{
        &:last-child{
            border-bottom:1px solid #BBB;
        }
        border: 1px solid #BBB;
        border-bottom:0;
        background-color: #f9f9f9;
        overflow: hidden;
        line-height:40px;
        padding:5px;
        p{
            margin-bottom:10px;
        }
    }
</style>
