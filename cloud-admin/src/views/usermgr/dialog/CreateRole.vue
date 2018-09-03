<template>
    <el-dialog title="创建角色" :visible.sync="isShow" width="600px" class="CreateRole" v-dialogDrag>
        <el-form size="small">
            <el-form-item label="角色名称 " :label-width="formLabelWidth">
                <el-input placeholder="输入角色名称" v-model="roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" :label-width="formLabelWidth">
                    <el-radio v-model="radioType" label="1">管理员</el-radio>
                    <el-radio v-model="radioType" label="2">用户</el-radio>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm" :loading="confirmBtn">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>

export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            radioType: '1',
            roleName: '',
            confirmBtn: false
        };
    },
    props: {},
    methods: {
        show(item,optype) {
            this.isShow = true;

            console.log('optype',optype);
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
        // confirm() {
        //     this.confirmBtn = true;
        //     let data = {
        //         name: this.keyPairName,
        //         zone: AREA_CITY.regions[0].value
        //     };
        //     console.warn(data);
        //     createKeypairs(data)
        //         .then(res => {
        //             this.resolve(data);
        //             this.hide();
        //             this.setting();
        //             this.confirmBtn = false;
        //         })
        //         .catch(err => {
        //             this.confirmBtn = false;
        //             this.$alert(err, '提示', {
        //                 type: 'error'
        //             });
        //         });
        // },
        // 检查是否名称是否填写正确
        checkName() {
            let regResult = this.keyPairName.match(/^[a-zA-Z0-9_]{0,}$/);
            if (!this.keyPairName) {
                this.keyPairNameShow = 1;
            } else if(!regResult) {
                this.keyPairNameShow = 2;
            } else {
                this.keyPairNameShow = 0;
            }
        }



    }
};
</script>
<style lang="scss">

</style>
