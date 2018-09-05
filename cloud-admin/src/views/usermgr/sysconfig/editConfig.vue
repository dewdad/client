<template>
    <div class="page-main">
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
            <el-col :span="22">
                <el-form ref="configForm" :inline="false" :rules="rules" :show-message="false" inline-message size="small" :model="configForm"  label-width="80px">
                    <el-form-item label="编码：" prop="code">
                        <el-input v-model="configForm.code" placeholder="输入编码"></el-input>
                    </el-form-item>
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="configForm.name" placeholder="输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input v-model="configForm.description" placeholder="输入描述" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <el-form ref="valueListForm" :inline="false"  :show-message="false" inline-message size="small" :model="valueListForm"  label-width="80px">
                    <el-form-item label="值：" prop="value">
                        <el-button type="primary" class="font12 ml20" @click="addValue">添加值</el-button>
                    </el-form-item>
                    <div v-for="(item,index) in valueListForm.itemlist" :key="index">
                        <el-form-item label="编码：" prop="code" style="display: inline-block;">
                            <el-input v-model="item.code" placeholder="输入编码" style="width:130px"></el-input>
                        </el-form-item>
                        <el-form-item label="名称：" prop="name" style="display: inline-block">
                            <el-input v-model="item.name" placeholder="输入名称" style="width:130px"></el-input>
                        </el-form-item>
                        <el-form-item label="值：" prop="code" style="display: inline-block">
                            <el-input v-model="item.value" placeholder="输入值" style="width:220px"></el-input>
                        </el-form-item>
                        <el-form-item label="排序：" prop="orderSeq" style="display: inline-block;width:210px;">
                            <el-input-number class="width-full" controls-position="right" :min="0" :max="100" v-model="item.orderSeq"></el-input-number>
                        </el-form-item>
                        <el-button type="primary" class="font12 ml20" @click="deleteCurrent(index)" size="small">删 除</el-button>
                    </div>
                    <el-form-item>
                        <el-button type="primary" class="font12 ml20" @click="submitForm">提  交</el-button>
                        <el-button type="default" class="font12 ml20" @click="cancel">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

    </div>
</template>
<script>
import {editConfig,addConfig} from '@/service/usermgr/sysconfig.js';
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
            configForm:{
                code:'',
                name:'',
                description:''

            },
            valueListForm:{
                itemlist:[]
            },
            configItemList:[

            ],
            platformRoleIds:[],
            platFormList: [],
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur,submit' }
                ],
                roleVal: [
                    { required: true, message: '请输入角色', trigger: 'blur' }
                ]
            },

            someEmpty:false,
            valueEmpty:false,
            form1Valid:false,
            form2Valid:false,
        };
    },
    components: {


    },
    methods: {
        setOriginData(){
            if(this.stateParams.opType != 1){
                let item = this.stateParams.item;
                this.configForm.code = item.code;
                this.configForm.name = item.name;
                this.configForm.description = item.desc;
                for(let i = 0;i < item.itemList.length ; i++){
                    let obj = {
                        code:item.itemList[i].code,
                        name:item.itemList[i].name,
                        value:item.itemList[i].value,
                        orderSeq:item.itemList[i].orderSeq
                    };
                    this.valueListForm.itemlist.push(obj);
                }
            }
            console.log('stateParams',this.stateParams);
        },
        addValue(){
            this.someEmpty = false;
            let len = this.valueListForm.itemlist.length + 1;
            let obj = {
                code:'',
                name:'',
                value:'',
                orderSeq:len
            };
            this.valueListForm.itemlist.push(obj);
            if(this.valueListForm.itemlist && this.valueListForm.itemlist.length === 0){
                this.valueEmpty = true;
                return;
            }else{
                this.valueEmpty = false;
            }
        },
        deleteCurrent(i){
            this.valueListForm.itemlist.splice(i,1);
        },
        submitForm(){
            this.$refs.configForm.validate((valid) => {
                if (valid) {
                    this.form1Valid = true;
                } else {
                    return false;
                }
            });
            this.$refs.valueListForm.validate((valid) => {
                if (valid) {
                    this.form2Valid = true;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            if(this.form1Valid && this.form2Valid){
                if(this.stateParams.opType == 1){
                    let params = {
                        itemList:this.valueListForm.itemlist,
                        code:this.configForm.code,
                        name:this.configForm.name,
                        desc:this.configForm.description,
                        configType:this.stateParams.opType,
                    };
                    this.add(params);
                }else{
                    let params = {
                        itemList:this.valueListForm.itemlist,
                        code:this.configForm.code,
                        name:this.configForm.name,
                        desc:this.configForm.description,
                        configType:this.stateParams.opType,
                        id:this.stateParams.item.id,
                    };
                    this.edit(params);
                }
            }
        },
        //添加权限
        add(param){
            addConfig(param)
                .then(res => {
                    console.log('res',res);
                    if(res.data.code == '0000'){
                        console.log('操作成功', res);
                        return this.$confirm('操作成功');

                    }else{
                        this.$alert('添加失败', '提示', {
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
        //修改权限
        edit(param){
            editConfig(param)
                .then(res => {
                    if(res.data.code == '0000'){
                        console.log('操作成功', res);
                        return this.$confirm('操作成功');
                    }else{
                        this.$alert('修改失败', '提示', {
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
        cancel(){
            this.goBack();
        },
        goBack(){
            window.history.back();
        },

    },
    created(){
        this.setOriginData();
    },
    mounted(){
        // this.searchBindAuth();
        // this.getPlatformList();
    }
};
</script>
<style scoped>
</style>
