<template>
    <el-dialog
        title="创建密钥对"
        :visible.sync="isShow"
        width="45%"
        class="CreateKeypair">
        <div class="enterPwd mt10 font12">
            <span class="title">
                密钥对名称 <b class="color-danger">*</b>
            </span>
            <div class="right ml20">
                <el-input size="small" @blur="checkName" v-model="keyPairName" maxlength="64" placeholder="请输入密钥对名称"></el-input>
                <span v-show="keyPairNameShow === 1" class="color-danger ml10">必填项</span>
                <span v-show="keyPairNameShow === 2" class="color-danger ml10">格式不对</span>
                <div class="color999 mt10">只能由英文字母、数字、下划线、中划线组成，且长度小于等于64个字。</div>
            </div>
        </div>
        <div class="enterPwd mt10 font12">
            <span class="title">
                创建类型 <b class="color-danger">*</b>
            </span>
            <div class="right ml20">
                <div class="mt10">
                    <el-radio v-model="radioType" label="1">自动新建密钥对</el-radio>
                    <el-radio v-model="radioType" label="2">导入已有密钥对</el-radio>
                </div>
                <div class="color999 mt10" v-show="radioType === '1'">创建完成后请一定下载私钥，您只有一下载私钥的机会。</div>
                <div class="existKeypair mt10" v-show="radioType === '2'">
                    <textarea v-model="keyContent"></textarea>
                    <div class="color999">(Base64编码)<a class="finger-cursor">导入样例</a></div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm" :loading="confirmBtn">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { createKeypairs } from '@/service/ecs/keypairs.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            radioType: '1',
            keyPairName: '',
            keyPairNameShow: 0,
            keyContent: '',
            confirmBtn: false
        };
    },
    props:{

    },
    watch: {
        isShow (val) {
            if (!val) {
                this.keyPairName = '';
            }
        }
    },
    methods: {
        show(rowItem) {
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
            this.confirmBtn = true;
            let data = {
                name: this.keyPairName,
                zone: AREA_CITY.regions[0].value
            };
            console.warn(data);
            createKeypairs(data)
                .then(res => {
                    this.resolve(data);
                    this.hide();
                    this.setting();
                    this.confirmBtn = false;
                })
                .catch(err => {
                    this.confirmBtn = false;
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
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
.CreateKeypair{
    .tip{
        background-color: #FBF7CF;
        padding: 15px 30px;
        color: #F68300;
        border: 1px solid #F6E0C4;
        ul, li{
            list-style-type: disc;
        }
    }
    .enterPwd{
        display: flex;
        justify-content: center;
        span.title{
            flex: 1;
            padding-top: 10px;
            padding-left: 20px;
        }
        .right{
            flex: 4;
            div{
                width: 300px;
            }
            .existKeypair textarea{
                min-width: 280px;
                max-width: 280px;
                min-height: 200px;
                max-height: 200px;
                border-radius: 5px;
                resize: none;
            }
        }
        .el-input{
            input{
                width: 300px;
            }
        }
    }
    .el-dialog .el-dialog__body{
        max-height: 380px;
        overflow: auto;
    }
}
</style>
