<template>
    <el-dialog title="修改租户" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules" label-width="120px">
            <!-- 名称 -->
            <el-form-item label="部门" prop="domainId"  >
                <el-input   :value="domainName" disabled></el-input>
            </el-form-item>

            <!-- 名称 -->
            <el-form-item label="名称" prop="name" >
                <el-input clearable :maxlength="100" v-model="form.name"></el-input>
            </el-form-item>

            <!-- 描述 -->
            <el-form-item label="描述" prop="description"  >
                <el-input clearable type="textarea" v-model="form.description"></el-input>
            </el-form-item>

            <!-- 是否激活 -->
            <el-form-item label="是否激活" prop="enabled"  >
                <el-radio v-model="form.enabled" label='1'>是</el-radio>
                <el-radio v-model="form.enabled" label='2'>否</el-radio>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {editRente} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            brunch:{},
            item:{},
            domainName:'',
            form:{
                name: '',
                domainId: '',
                description: '',
                enabled: '1',

            },
            rules:{
                'name':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],

            }
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    props: {},
    methods: {
        show(item,brunch) {
            this.isShow = true;
            this.item = item;
            console.log('iiii',item);
            this.form.name = item.name;
            this.form.description = item.description;
            this.form.enabled = item.status == 'true' ? '1' : '2';
            this.brunch = brunch;
            this.domainName = brunch.name;
            this.form.domainId = brunch.id;
            console.log('item......',item);
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
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
        //保存（提交）
        submitForm() {
            this.confirmBtn = true;
            let param = {
                id:this.item.id,
                data:{
                    status:this.form.enabled == '1' ? 1 : 0,
                    deptId:this.brunch.id,
                    extendId:this.brunch.extendId,
                    name:this.form.name,
                    description:this.form.description,
                }
            };
            editRente(param).then(ret => {
                if(ret.data.code === '0000'){
                    this.confirmBtn = false;
                    this.hide();
                    this.setting();
                    this.$alert('操作成功','提示');
                    return;
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                    this.confirmBtn = false;
                }

            });
        },

    },
    mounted(){

    }
};
</script>
<style lang="scss">

</style>
