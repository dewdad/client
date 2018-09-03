<template>
    <el-dialog title="导入镜像" :visible.sync="isShow" class="ImportImageDialog">
        <!-- tip提示 -->
        <div class="tip mb20 font12">
            导入镜像步骤：
            <ul>
                <li>1.创建私有镜像使用的文件需要先上传到对象存储的空间中。</li>
                <li>2.目前支持使用vhd，zvhd，vmdk，qcow2格式镜像文件创建自定义镜像。</li>
                <li>3.制作自定义镜像时间预计5-10分钟完成，请耐心等待</li>
            </ul>
        </div>
        <div style="padding-left:50px;">
            <zt-form inline-message :model="iImageForm" size="small" class="demo-ruleForm" :rules="rules" ref="iImageForm">
                <!-- 镜像文件在对象存储中的地址 -->
                <zt-form-item label="镜像文件在对象存储中的地址" class="first-form" label-width="120px" prop="ossUrl">
                    <el-input v-model="iImageForm.ossUrl" size="small" placeholder="请输入镜像文件在对象存储中的地址"></el-input>
                    <div class="mt5"><a class="font12 finger-cursor">如何获取镜像文件在对象存储中的地址</a></div>      
                </zt-form-item>
                <!-- 镜像名称 -->
                <zt-form-item label="镜像名称" label-width="120px" prop="name">
                    
                            <el-input v-model="iImageForm.name" size="small" placeholder="请输入镜像名称"></el-input>
                     
             
                </zt-form-item>
                <!-- 系统平台 -->
                <zt-form-item label="系统平台" label-width="120px" prop="osType">
                    <el-select v-model="iImageForm.osType" size="small" placeholder="请选择系统平台">
                        <el-option
                        v-for="(value,key) in sysplatform"
                        :key="key"
                        :label="key"
                        :value="key">
                        </el-option>
                    </el-select>
                </zt-form-item>
                <!-- 操作系统 -->
                <zt-form-item label="操作系统" label-width="120px" prop="osVer">
                    <el-select v-model="iImageForm.osVer" size="small" placeholder="请选择操作系统名称">
                        <el-option
                        v-for="item in sysplatform[iImageForm.osType]"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </zt-form-item>
                <!-- 系统盘大小(GB) -->
                <zt-form-item label="系统盘大小(GB)" label-width="120px" prop="minSize">
                    <el-input-number v-model="iImageForm.minSize" controls-position="right" :step="10" :min="5" :max="500"></el-input-number>
                    <div class="font12 color999">系统盘大小取值为5-500GB</div>
                </zt-form-item>
                <!-- 镜像描述 -->
                <zt-form-item label="镜像描述" label-width="120px" prop="description">
                    <el-input size="small" v-model="iImageForm.description"></el-input>
                </zt-form-item>
            </zt-form>
        </div>
        
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="confirm">确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { addCustomImage } from '@/service/customImage.js';

export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
    
            sysplatform:{
                'Windows': ['Windows 10 64bit', 'Windows 7 Enterprise 64bit', 'Windows Server 2016 Standard 64bit', 'Windows Server 2016 Datacenter 64bit', 'Windows Server 2012 R2 Standard 64bit', 'Windows Server 2012 Essentials R2 64bit', 'Windows Server 2012 R2 Datacenter 64bit', 'Windows Server 2012 Datacenter 64bit', 'Windows Server 2012 Standard 64bit','Windows Server 2008 WEB R2 64bit', 'Windows Server 2008 R2 Standard 64bit', 'Windows Server 2008 R2 Enterprise 64bit', 'Windows Server 2008 R2 Datacenter 64bit'],
                'SUSE': ['SUSE Linux Enterprise Server 12 SP2 64bit', 'SUSE Linux Enterprise Server 12 SP1 64bit', 'SUSE Linux Enterprise Server 11 SP4 64bit', 'SUSE Linux Enterprise Server 11 SP3 64bit', 'SUSE Linux Enterprise Server 11 SP3 32bit'],
                'Oracle Linux': ['Oracle Linux Server release 7.3 64bit', 'Oracle Linux Server release 7.2 64bit', 'Oracle Linux Server release 7.0 64bit', 'Oracle Linux Server release 6.8 64bit', 'Oracle Linux Server release 6.7 64bit', 'Oracle Linux Server release 6.5 64bit'],
                'Redhat': ['Redhat Linux Enterprise 7.3 64bit','Redhat Linux Enterprise 7.2 64bit','Redhat Linux Enterprise 7.1 64bit','Redhat Linux Enterprise 7.0 64bit','Redhat Linux Enterprise 6.8 64bit', 'Redhat Linux Enterprise 6.7 64bit','Redhat Linux Enterprise 6.6 64bit', 'Redhat Linux Enterprise 6.6 32bit', 'Redhat Linux Enterprise 6.4 64bit', 'Redhat Linux Enterprise 6.4 32bit'],
                'Ubuntu': ['Ubuntu 16.04 server 64bit','Ubuntu 14.04.4 server 64bit', 'Ubuntu 14.04.4 server 32bit', 'Ubuntu 14.04.3 server 64bit','Ubuntu 14.04.3 server 32bit', 'Ubuntu 14.04.1 server 64bit', 'Ubuntu 14.04.1 server 32bit', 'Ubuntu 14.04 server 64bit', 'Ubuntu 14.04 server 32bit'],
                'OpenSUSE': ['OpenSUSE 42.2 64bit','OpenSUSE 42.1 64bit', 'OpenSUSE 13.2 64bit', 'OpenSUSE 11.3 64bit'],
                'CentOS': ['CentOS 7.3 64bit', 'CentOS 7.2 64bit', 'CentOS 7.1 64bit', 'CentOS 7.0 64bit', 'CentOS 7.0 32bit','CentOS 6.8 64bit', 'CentOS 6.7 64bit','CentOS 6.7 32bit','CentOS 6.6 64bit','CentOS 6.6 32bit','CentOS 6.5 64bit', 'CentOS 6.5 32bit', 'CentOS 6.4 64bit','CentOS 6.4 32bi','CentOS 6.3 64bit','CentOS 6.3 32bit'],
                'Debian': ['Debian GNU/Linux 8.7.0 64bit','Debian GNU/Linux 8.6.0 64bit','Debian GNU/Linux 8.5.0 64bit','Debian GNU/Linux 8.4.0 64bit','Debian GNU/Linux 8.2.0 64bit','Debian GNU/Linux 8.8.0 64bit','Debian GNU/Linux 9.0.0 64bit'],
                'Fedora': ['Fedora 25 64bit','Fedora 24 64bit','Fedora 23 64bit','Fedora 22 64bit'],
                'EulerOS': ['EulerOS 2.2 64bit']
            },
            iImageForm: {
                ossUrl:'',
                name: '',
                osType: '',
                osVer: '',
                minSize: 5,
                description: ''
            },
            rules: {
                ossUrl:[{required: true, message: '必填项', trigger: 'blur' }],
                name:[{required: true, message: '必填项', trigger: 'blur' }],
                osType:[{required: true, message: '必填项', trigger: 'change' }],
                osVer:[{required: true, message: '必填项', trigger: 'change' }],
                minSize:[{required: true, message: '必填项', trigger: 'blur' }],
                description:[{required: false, message: '必填项', trigger: 'blur' }],
            },            
        };
    },
    props: {},
    methods: {
        show() {
            this.isShow = true;

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {            
            this.iImageForm = {
                ossUrl:'',
                name: '',
                osType: '',
                osVer: '',
                minSize: 5,
                description: ''
            },
            this.$refs['iImageForm'].resetFields();    
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
        //提交表单
        confirm() { 
            addCustomImage(this.iImageForm)
                .then(res => {
                    this.resolve();
                    this.hide();
                    //this.setting();              
                })
                .catch(err => {
                    console.log('updateImage', err);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.ImportImageDialog {
    .demo-ruleForm{
        width: 80%;
    }
    .tip {
        background-color: #fbf7cf;
        padding: 15px 30px;
        color: #f68300;
        border: 1px solid #f6e0c4;
    }

    .enterPwd {
        line-height: normal;
        span.title {
            width: 120px;
            display: inline-block;
            line-height: 20px;
            position: relative;
            top: -16px;
        }
        .right {
            display: inline-block;
        }
    }
}
</style>
