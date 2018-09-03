<template>
    <el-dialog
        title="创建自定义镜像"
        :visible.sync="isShow"
        width="45%"
        class="CustomImageDialog">
        <!-- tip提示 -->
        <div class="tip font12">
            <ul>
                <li>创建镜像的同时系统默认会创建相关快照。</li>
                <li>请您在使用linux系统创建自定义镜像时，注意不要在/etc/fstab文件中加载数据盘的信息，否则使用该镜像创建的实例无法启动。</li>
                <li>您可对当前ECS实例做个完整的镜像模板，包含该实例下的所有磁盘。该实例的每块磁盘会新增一个快照,可以在快照列表中查询。需要等待每块磁盘的快照创建完成，镜像才能可以使用，期间不要更改实例状态，如停止或重启实例，请耐心等待。</li>
            </ul>
        </div>
        <div class="enterPwd mt10 font12">
            <span class="title">
                自定义镜像名称<b class="color-danger">*</b>
            </span>
            <div class="right ml20">
                <el-input size="small" v-model="customImage.imageName"></el-input>
                <div class="color999 mt10">不能输入中文，长度为2-64个字符，不能以特殊字符及数字开头，只可包含特殊字符中的".","_"或"-"</div>
            </div>
        </div>
        <div class="enterPwd mt10 font12">
            <span class="title">
                自定义镜像描述<b class="color-danger">*</b>
            </span>
            <div class="right ml20">
                <el-input size="small" v-model="customImage.imageDesc"></el-input>
                <div class="color999 mt10">长度为2-128个字符，不能以http://或https://开头。</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="confirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { createCustomImage } from '@/service/ecs/list.js';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            customImage:{
                ecsId:'',
                imageName:'',
                imageDesc:''
            }
        };
    },
    props:{

    },
    methods: {
        show(rowItem) {
            this.customImage.ecsId = rowItem.id;

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
            if (this.customImage.imageName.indexOf('self') != -1 || this.customImage.imageName.indexOf('define') != -1) {
                this.$alert('镜像名称不能包含self, define等字样。','提示',{
                    type: 'error'
                });   
                return;
            }

            createCustomImage(this.customImage)
                .then( (res) => {                  
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE){  
                        this.hide();
                        // this.setting();

                        this.$message.success('操作成功');
                        this.resolve(this.customImage);
                    }  
                },
                (err) => {
                    this.$alert(err,'提示',{
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss">
.CustomImageDialog{
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
            flex: 5;
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
