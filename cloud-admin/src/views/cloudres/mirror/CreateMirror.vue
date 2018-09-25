<template>
    <el-dialog title="创建镜像" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules" class="detailbox">
            <p class="top">基本信息</p>
            <div class="orderIntro">
                <el-form-item label="镜像名称 " prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="输入镜像名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="源 " prop="mirrortype" :label-width="formLabelWidth">
                    <el-input placeholder="输入源" value="文件" disabled></el-input>
                    <el-upload
                            class="upload-demo mt10"
                            action="http://10.11.3.99:7100/fileProcess/upload"
                            :on-change="change"
                            :limit="1"
                            :on-exceed="handleExceed"
                            list-type="picture"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="镜像格式" prop="diskFormat" :label-width="formLabelWidth">
                    <el-select placeholder="镜像格式" v-model="form.diskFormat" >
                        <el-option v-for="item in diskFormats" :value="item.key" :label="item.value" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <p class="top">镜像共享</p>
            <div class="orderIntro">
                <el-form-item label="可见性" prop="public" :label-width="formLabelWidth">
                    <el-radio v-model="form.public" label="1">是</el-radio>
                    <el-radio v-model="form.public" label="2">否</el-radio>
                </el-form-item>
                <el-form-item label="受保护的" prop="isProtected" :label-width="formLabelWidth">
                    <el-radio v-model="form.isProtected" label="1">是</el-radio>
                    <el-radio v-model="form.isProtected" label="2">否</el-radio>
                </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {createMirror} from '@/service/cloudres.js';
export default {
    data() {
        let diskFormats = [
            {key: 'ISO', value: 'ISO-光盘镜像'},
            {key: 'VHD', value: 'VHD-数据磁盘'},
            {key: 'QCOW2', value: 'QEMU模拟器'},
            {key: 'VDI', value: '数据磁盘镜像'},
            {key: 'VMDK', value: '虚拟机磁盘'},
            {key: 'AKI', value: 'Amazon 内核镜像'},
            {key: 'AMI', value: 'Amazon 机器镜像'},
            {key: 'RAW', value: 'RAW'}
        ];
        return{
            diskFormats,
            formLabelWidth: '150px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            fileList: [],
            fileListArr: [],
            form:{
                name:'',
                mirrortype:1,
                diskFormat:'',
                public:'1',
                isProtected:'1',

            },
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                mirrortype: [
                    { required: true, message: '请选择镜像类型', trigger: 'blur' }
                ],
                diskFormat: [
                    { required: true, message: '请选择镜像格式', trigger: 'blur' }
                ]
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
        show() {
            this.isShow = true;
            this.form.name = '';
            this.form.mirrortype = 1;
            this.form.diskFormat = '';
            this.form.public = '1';
            this.form.isProtected = '1';
            this.form.imageUrl = '';
            this.form.fileList = [];
            this.form.fileListArr = [];
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
        change(file,filelist){
            this.fileListArr = filelist;
        },
        handleExceed(files, fileList) {
            this.$alert(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        confirm() {
            this.confirmBtn = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let arr = [];
                    if(this.fileListArr.length > 0){
                        for(let i = 0;i < this.fileListArr.length ; i++){
                            arr.push(this.fileListArr[i].response.data[0]);
                        }
                    }

                    this.form.imageUrl = arr[0] || '';
                    this.form.isProtected = this.form.isProtected == '1' ? true : false;
                    this.form.public = this.form.public == '1' ? true : false;
                    createMirror(this.form)
                        .then(res => {
                            if(res.code === '0000'){
                                this.resolve(this.form);
                                this.form.isProtected = '1' ;
                                this.form.public = '1';
                                this.hide();
                                this.setting();
                                this.confirmBtn = false;
                            }else{
                                this.form.isProtected = '1';
                                this.form.public = '1';
                                this.$alert('操作失败', '提示', {
                                    type: 'error'
                                });
                                this.confirmBtn = false;
                                return;
                            }
                        })
                        .catch(err => {
                            this.form.isProtected = '1';
                            this.form.public = '1';
                            this.confirmBtn = false;
                            this.$alert(err, '提示', {
                                type: 'error'
                            });
                        });
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        }

    }
};
</script>
<style lang="scss">
    .detailbox{
        .top{
            border-left: 3px solid #4895d7;
            height: 16px;
            font-size: 14px;
            color: #333333;
            padding-left: 10px;
            margin-bottom: 16px;
            line-height: 100%;
        }
        color:#666;
        p{
            margin-bottom:10px;
        }
        .reply{
            border: 1px solid #999;
            padding: 20px 10px;
            p{
                margin: 0;
            }
        }
        .orderIntro{
            p{
                display: flex;
                span:first-child{
                    margin-right: 10px;
                }
                span:last-child{
                    flex: 1;
                }
            }
        }
    }
    .upload-demo input[type='file']{
        display: none;
    };
</style>
