<template>
    <el-dialog
        title="绑定浮动IP"
        :visible.sync="isShow"
        width="45%"
        class="BindFLexIPDialog">
        <zt-form inline-message :model="flexData" label-width="100px" style="width:392px;" size="small"  ref="flexData" :show-message="false">
            <zt-form-item label="IP地址">
                <el-input size="small" v-model="flexData.felxIp"></el-input>
            </zt-form-item>
            <zt-form-item label="ECS实例" prop="flexData.ecsCase">
                <el-select v-model="flexData.ecsCase" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </zt-form-item>
        </zt-form>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
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
            flexData:{
                felxIp:'',
                ecsCase: ''
            },
            rules: {
                ecsCase: [
                    { required: true, message: '请选择ECS实例', trigger: 'change' }
                ],
            },
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }
            ],
        }; 
    },
    methods: {
        show(rowItem) {
            this.flexData.ecsId = rowItem.id;

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
        }
    }
};
</script>
<style lang="scss">
.BindFLexIPDialog{
    .tip{
        background-color: #FBF7CF;
        padding: 15px 30px;
        color: #F68300;
        border: 1px solid #F6E0C4;
        ul, li{
            list-style-type: disc;
        }
    }
}
</style>
