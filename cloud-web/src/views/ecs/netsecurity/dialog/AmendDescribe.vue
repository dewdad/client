<template>
    <el-dialog
        title="修改描述"
        :visible.sync="isShow"
        width="40%"
        class="AmendDescribe">
        <div class="enterPwd mt10 font12">
            <span class="title">
                描述 <b class="color-danger">*</b>
            </span>
            <div class="right">
                <el-input size="small" v-model="input"></el-input>
                <div class="color999 mt10">长度为2-256个字符，不能以http://或https://开头</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            input: ''
        };
    },
    props:{       
    },
    methods: {
        show(name) {
            this.isShow = true;
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
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            this.hide();
            //this.setting();
            this.resolve({
                name:this.input
            });
        }
    }
};
</script>
<style lang="scss">
.AmendDescribe{
    .enterPwd{
        display: flex;
        justify-content: center;
        span.title{
            flex: 1;
            padding-top: 10px;
            padding-left: 20px;
        }
        .right{
            flex: 5
        }
        .el-input{
            input{
                width: 300px;
            }
            flex: 5
        }
    }
}
</style>
