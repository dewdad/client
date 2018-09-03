<template>
    <el-dialog
        title="修改描述"
        :visible.sync="isShow"
        width="40%"
        class="addInstToGroup">
        <div class="enterPwd mt10 font12">
            <el-row>
                <el-col :span="6" class="mt5">
                    <span class="title">
                        实例ID <b class="color-danger">*</b>
                    </span>
                </el-col>
                <el-col :span="16">
                    <el-select v-model="instVal" size="small" placeholder="请选择">
                        <el-option
                        v-for="(val, key) in instOptions"
                        :key="val"
                        :label="val"
                        :value="key">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
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
            input: '',
            instOptions: {},
            instVal: ''
        };
    },
    props:{       
    },
    methods: {
        show(name) {
            $log(name);
            this.instOptions = name;
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
                instVal:this.instVal
            });
        }
    }
};
</script>
<style lang="scss">
</style>
