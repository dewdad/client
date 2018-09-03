<template>
    <el-dialog
        title="创建自定义镜像"
        :visible.sync="isShow"
        width="45%"
        class="ModifySafeGroup">
        <div class="enterPwd mt10 font12">
            <span class="title">
                安全组名称 <b class="color-danger">*</b>
            </span>
            <div class="right ml20">
                <el-input size="small" @blur="checkedName" v-model="security.groupName"></el-input>
                <span v-show="keyPairNameShow === 1" class="color-danger ml10">必填项</span>
                <span v-show="keyPairNameShow === 2" class="color-danger ml10">格式不对</span>
                <div class="color999 mt10">不能输入中文，长度为2-64个字符，不能以特殊字符及数字开头，只可包含特殊字符中的".","_"或"-"</div>
            </div>
        </div>
        <div class="enterPwd mt10 font12">
            <span class="title">
                描述
            </span>
            <div class="right ml20">
                <el-input size="small" v-model="security.groupDesc"></el-input>
                <div class="color999 mt10">长度为2-128个字符，不能以http://或https://开头。</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm" :loading="confirmBtn">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>

import { createGroup, modifyGroup } from '@/service/ecs/security.js';

export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            modifyType: 1,
            security:{
                groupId:'',
                groupName:'',
                groupDesc:''
            },
            confirmBtn: false,
            keyPairNameShow: 0
        };
    },
    props:{

    },
    methods: {
        show(rowItem) {
            this.security.groupName = rowItem && rowItem.name;
            this.security.groupId = rowItem && rowItem.id;
            this.modifyType = rowItem ? 1 : 2;
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
            this.confirmBtn = false;
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
        async confirm() {
            await this.checkedName();
            if (this.keyPairNameShow !== 0) {
                return;
            }
            this.confirmBtn = true;
            switch(this.modifyType){
                case 1:
                    this.modifyGroupFn();
                    break;
                case 2:
                    this.createGroupFn();
                    break;
            }
        },

        // 确认创建安全组
        createGroupFn() {
            let params = {
                name: this.security.groupName
            };
            createGroup(params)
                .then((ret) =>{
                    this.resolve(params);
                    this.hide();
                    this.setting();
                }).catch((err) =>{
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        // 确认修改安全组
        modifyGroupFn() {
            let params = {
                name: this.security.groupName,
                remark: this.security.groupDesc
            };
            modifyGroup(this.security.groupId, params)
                .then((ret) =>{
                    this.resolve(params);
                    this.hide();
                    this.setting();
                }).catch((err) =>{
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        // 验证名称
        checkedName() {
            let regResult = this.security.groupName.match(/^[A-Za-z_][A-Za-z0-9\u0391-\uFFE5-_. ]{1,127}$/);
            if (!this.security.groupName) {
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
.ModifySafeGroup{
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
