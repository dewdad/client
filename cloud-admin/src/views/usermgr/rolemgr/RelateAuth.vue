<template>
    <el-dialog title="关联权限" :visible.sync="isShow" width="600px" class="AddPlatAuth" v-dialogDrag>
        <el-tree
                :data="data"
                show-checkbox
                default-expand-all
                node-key="menuCode"
                :default-checked-keys="selectedKeys"
                ref="tree"
                highlight-current
                :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="submit" >确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {getMenuListByType,subAuth} from '@/service/usermgr/rolemgr.js';
export default {
    data() {
        return{
            formLabelWidth: '110px',
            isShow: false,
            resolve: null,
            reject: null,
            defaultProps: {
                children: 'submenus',
                label: 'menuName'
            },
            menu:[],
            handlerArr:[],
            data:[],
            roleId:'',
            selectedKeys:[]
        };
    },
    props: {},
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        show(item) {
            this.roleId = item.id;
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        hide() {
            this.isShow = false;

        },
        //获取默认关联上的部门节点
        getSelectedKeys(){
            let data = this.data;
            let keys = [];
            for(let i = 0;i < data.length;i++){
                if(data[i].selected){
                    keys.push(data[i].menuCode);
                }
                if(data[i].submenus){
                    for(let j = 0;j < data[i].submenus.length;j++){
                        if(data[i].submenus[j].selected){
                            keys.push(data[i].submenus[j].menuCode);
                        }
                        if(data[i].submenus[j].submenus){
                            for(let m = 0;m < data[i].submenus[j].submenus.length;m++){
                                if(data[i].submenus[j].submenus[m].selected){
                                    keys.push(data[i].submenus[j].submenus[m].menuCode);
                                }
                            }
                        }

                    }

                }

            }
            this.selectedKeys = keys;
        },
        //获取被选择了的节点
        getKey() {
            this.menu = this.$refs.tree.getCheckedKeys();
            let handlers = this.$refs.tree.getCheckedNodes();
            let handlerArr = [];

            for(let i = 0;i < handlers.length; i++ ){
                if(handlers[i].opertions){
                    let len = handlers[i].opertions.length;
                    for(let j = 0;j < len; j++){
                        handlerArr.push(handlers[i].opertions[j]);
                    }
                    let menuL = handlers[i].submenus.length;
                    for(let m = 0;m < menuL;m++){
                        if(handlers[i].submenus[m].opertions){
                            let len2 = handlers[i].submenus[m].opertions.length;
                            for(let k = 0;k < len2;k++){
                                handlerArr.push(handlers[i].submenus[m].opertions[k]);
                            }
                        }
                    }

                }
            }
            this.handlerArr = handlerArr;
            console.log('handlerArr',handlerArr);
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
        getMenuListByType(){
            let params = {
                roleId:this.user.roleId,
                roleType:this.user.roleType,
            };
            $log('params', params);
            getMenuListByType(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData){
                    this.data = resData || [];
                    this.getSelectedKeys();
                    console.log('tree',this.data);
                }

            });
        },
        submit() {
            this.getKey();
            let param = {
                menu:this.menu,
                operations:this.handlerArr,
                roleId:this.roleId
            };
            subAuth(param)
                .then(res => {
                    if(res.code === '0000'){
                        this.resolve(param);
                        this.hide();
                        this.setting();
                    }else{
                        this.$alert('操作失败', '提示', {
                            type: 'error'
                        });
                    }
                })
                .catch(err => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },

    },
    mounted(){
        this.getMenuListByType();
    }




};
</script>
<style lang="scss">

</style>
