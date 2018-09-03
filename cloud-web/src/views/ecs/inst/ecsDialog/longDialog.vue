<template>
    <el-dialog class="longDialog" :title="$t('dialog.telnetGuide.title')" width="667px" :visible.sync="isShow">       
        <!-- 没有绑定公网IP或者连接IP的云服务器 -->
        <div class="NoIp">
            <h5 class="title">{{$t('dialog.telnetGuide.noIpTitle')}}</h5> 
            <div class="Content mt10">
                <ul>
                    <li>
                        <el-row>
                            <el-col :span="1">
                                <span class="orderNum">1</span>
                            </el-col>
                            <el-col :span="23" class="plx">
                                <span class="intro">{{ $t('dialog.telnetGuide.byVncLogin') }}</span>
                            </el-col>
                        </el-row>
                    </li>
                    <li>
                        <el-row>
                            <el-col :span="1">
                                <span class="orderNum">2</span>
                            </el-col>
                            <el-col :span="23" class="plx">
                                <p class="intro">{{ $t('dialog.telnetGuide.byOtherHostLogin') }}</p>
                                <p class="intro"><em class="dot"></em> {{ $t('dialog.telnetGuide.telnet') }}</p>
                                <p class="intro"><em class="dot"></em> {{ $t('dialog.telnetGuide.bySelfhostToTargetHost') }}</p>
                            </el-col>
                        </el-row>
                    </li>
                    <li></li>
                </ul>
            </div>
        </div>
        <!-- Linux系统的云服务器 -->
        <div class="Linux">
            <h5 class="title">{{$t('dialog.telnetGuide.linuxHost')}}</h5>            
            <div class="Content mt10">
                <ul>
                    <li>
                        <el-row>
                            <el-col :span="1">
                                <span class="orderNum">1</span>
                            </el-col>
                            <el-col :span="23" class="plx">
                                <span class="intro">{{$t('dialog.telnetGuide.bindPublicIP')}}</span>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.openSSHClient')}}</span>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputPubIPAndPort')}}</span>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputUserNamePwd')}}</span>
                                </p>
                            </el-col>
                        </el-row>
                    </li>
                    <li>
                        <el-row>
                            <el-col :span="1">
                                <span class="orderNum">2</span>
                            </el-col>
                            <el-col :span="23" class="plx">
                                <span class="intro">{{$t('dialog.telnetGuide.bindLinkIP')}}</span>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.newMedia')}}</span>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.openSSHClient')}}</span>
                                </p>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputLinkIPAndPort')}}</span>
                                    <span class="mr30 pl15"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputUserNamePwd')}}</span>
                                </p>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Windows系统的云服务器 -->
        <div class="Windows">
            <h5 class="title">{{$t('dialog.telnetGuide.windowHost')}}</h5>            
            <div class="Content mt10">
                <ul>
                    <li>
                        <el-row>
                            <el-col :span="1">
                                <span class="orderNum">1</span>
                            </el-col>
                            <el-col :span="23" class="plx">
                                <span class="intro">{{$t('dialog.telnetGuide.bindPublicIP')}}</span>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.aboutDownload')}}</span>
                                </p>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputUserNamePwd')}}</span>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputPublicIP')}}</span>                                    
                                </p>
                            </el-col>
                        </el-row>
                    </li>
                    <li>
                        <el-row>
                            <el-col :span="1">
                                <span class="orderNum">2</span>
                            </el-col>
                            <el-col :span="23" class="plx">
                                <span class="intro">{{$t('dialog.telnetGuide.bindLinkIP')}}</span>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.newMedia')}}</span>
                                </p>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.aboutDownload')}}</span>
                                </p>
                                <p>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputUserNamePwd')}}</span>
                                    <span class="mr30"><em class="dot mr5"></em>{{$t('dialog.telnetGuide.inputLinkIP')}}</span>                                    
                                </p>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
        </div>

        <span slot="footer" class="dialog-footer">           
            <el-button type="info" class="font12" @click="cancel" size="small">{{$t('common.close')}}</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null
        };
    },
    methods: {
        show() {
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
            this.setting();
        }
    }
};
</script>

<style lang="scss">
.longDialog {
    h5.title {
        margin-top:12px;
        font-weight:700;
    } 
    .el-dialog .el-dialog__body {
        padding: 5px 20px 30px;
    }
    
    .pl15 {
        padding-left:15px !important;
    }
    .el-dialog__header{
        border-bottom: 1px solid #e6e6e6;
    }    
    .Content{
        padding: 0 20px;
        border: 1px solid rgba(13, 126, 242, 0.21);
        ul li{
            margin: 12px 0;
            .plx{
                padding-left:5px;
            }
        }
        .orderNum{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            display: inline-block;
            background:#4b7de1;
            color: #ffffff;
        }
    }
    em.dot{
        width: 8px;
        height: 8px;
        background: rgb(12,127,247);
        border-radius: 50%;
        display: inline-block;
    }
    .longDialog-item{
        padding: 15px;
        margin: 15px 0;
    }
    p{
        margin: 0;
        padding-top:3px;
    }
}
</style>
