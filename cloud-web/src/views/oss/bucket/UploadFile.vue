<template>
    <el-dialog v-if="isShow" :title="dialogTitle" :visible.sync="isShow" width="640px" :append-to-body="true" :before-close="handleClose" :close-on-press-escape="true" :close-on-click-modal="true" @close="cancel">
        <div style="padding-right: 130px">
            <zt-form v-show="!uploading" ref="uploadForm" label-width="80px" :model="upload" size="small" inline-message>
                <zt-form-item label="文件目录">
                    <el-radio-group v-model="upload.dirtype" class="primary">
                        <el-radio label="currentdir" border>当前目录</el-radio>
                        <el-radio label="specifieddir" border>指定目录</el-radio>
                    </el-radio-group>
                </zt-form-item>
                <zt-form-item v-if="upload.dirtype === 'currentdir'" label="目录地址">
                    {{ upload.currentPath==="" ? "/":upload.currentPath}}
                </zt-form-item>
                <zt-form-item v-show="upload.dirtype === 'specifieddir'" label="目录地址" prop="dirname" :rules="rules" >
                    <el-input v-model="upload.dirname" placeholder="请输入目录名称" @change="dir"></el-input>
                </zt-form-item>
                <zt-form-item label="文件上传">
                    <el-upload ref="upload" class="upload-demo" :on-progress="onProgress" :with-credentials="true" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :show-file-list="false" drag :action="uploadAction" :headers="uploadHeaders" :data="{prefix: upload.currentPath}" :auto-upload="autoUpload" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>支持多选</div>
                        <div class="el-upload__tip" slot="tip">
                            文件的命名规范如下：<br/> 1.使用UTF-8编码
                            <br/> 2.长度必须在1-1023字节之间
                            <br/> 3.不能以[/]或[\]开头
                            <br/> 注意：对象名称需要区分大小写，如无特殊说明，本文档中的对象、文件称谓等同于Object
                        </div>
                    </el-upload>
                </zt-form-item>
            </zt-form>
        </div>
        <div v-show="uploading">
            <div>
                <span class="color-success">{{successFilesNums}}</span>已完成，
                <span class="color-danger">{{errorFilesNums}}</span>失败，
                <span class="color-primayr">{{uploadingFilesNums}}</span>上传中，共{{fileList.length}}个文件 </div>
            <el-table :data="fileList" stripe border class="data-list mt10" :row-style="setBackground" :highlight-current-row="false">
                <el-table-column prop="name" label="文件名" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="文件大小">
                    <template slot-scope="scope">
                        {{scope.row.size|convertByteSize(2, 'string')}}
                    </template>
                </el-table-column>
                <el-table-column label="目标Bucket">
                    <template slot-scope="scope">
                        {{bucketId}}
                    </template>
                </el-table-column>
                <el-table-column label="上传进度">
                    <template slot-scope="scope">
                        {{parseInt(scope.row.percentage)}}%
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i v-if="scope.row.status === 'success'" class="iconfont icon-success color-success font14"></i>
                        <a v-if="scope.row.status === 'uploading'" href="javascript:;" @click="cancelUpload(scope.row, scope.$index)">取消</a>
                        <span v-if="scope.row.status === 'cancel'" class="color-danger">已取消</span>
                        <span v-if="scope.row.status === 'error'">上传失败</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer text-right">
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
            <!-- <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">确定</el-button>
            <el-button type="info" @click="cancel" size="small">取消</el-button> -->
        </div>
    </el-dialog>
</template>
<script>
// import {uploadFile} from '@/service/oss/filemgr';
const percentageBg = require('@/assets/images/percentageBg.png');
export default {
    name: 'UploadFile',
    data() {
        // 验证目录方法
        const validateDirname = (rule, value, callback) => {
            let pattern1 = /^\//;
            let pattern2 = /\/{2,}/;
            let pattern3 = /\/\.\.\//;
            let pattern4 = /\/\.\.$/;
            if (pattern1.test(value) || pattern2.test(value) || pattern3.test(value) || pattern4.test(value) || value.trim() === '..' || value.trim().indexOf('../') === 0) {
                this.allowUpload = false;
                callback(new Error('目录名称不符合命名规范'));
                return;
            }
            this.allowUpload = true;
            callback();
        };
        return {
            dialogTitle: '文件上传',
            isShow: false,
            isSubmit: false,
            allowUpload: true,
            uploading: false,
            autoUpload: true, // 自动上传
            upload: {
                dirtype: 'currentdir',
                dirname: '',
                currentPath: ''
            },
            // uploadAction: '/fileProcess/upload','/oss/bucket/' + this.bucketId + '/uploadFile'
            uploadAction: '',
            uploadHeaders: {
                // 'X-People-Token': this.$store.state.token
            },
            reject: null,
            resolve: null,
            PATH:'',
            rules: [{validator: validateDirname, trigger: 'blur'}],
            fileList: [
                {
                    name: 'ss',
                    size: 100
                }
            ]
        };
    },
    props: {
        bucketId: String,
        path: {
            type: String,
            default: ''
        }
    },
    watch: {
        'upload.dirtype': function() {
            // 重置参数
            this.upload.dirname = '';
            this.allowUpload = true;
            this.$refs.uploadForm.clearValidate();
        }
    },
    computed: {
        // 完成文件数
        successFilesNums: function() {
            let count = 0;
            this.fileList.forEach(file => {
                if (file.status === 'success') count++;
            });
            return count;
        },
        // 失败的文件数
        errorFilesNums: function() {
            let count = 0;
            this.fileList.forEach(file => {
                if (file.status === 'error') count++;
            });
            return count;
        },
        // 上传中的文件数
        uploadingFilesNums: function() {
            let count = 0;
            this.fileList.forEach(file => {
                if (file.status === 'uploading') count++;
            });
            return count;
        }
    },
    methods: {
        show() {
            this.upload.currentPath = this.path;
            if (this.upload.dirtype === 'currentdir' && this.path === ''){
                this.uploadAction = API_URL + '/oss/bucket/' + this.bucketId + '/uploadFile?prefix=/';
            }else if(this.upload.dirtype === 'currentdir' && this.path !== ''){
                this.uploadAction = API_URL + '/oss/bucket/' + this.bucketId + '/uploadFile?prefix=' + this.path;
            }
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        dir(){
            if(this.upload.dirtype === 'specifieddir' && this.upload.dirname !== ''){
                this.uploadAction = API_URL + '/oss/bucket/' + this.bucketId + '/uploadFile?prefix=' + this.upload.dirname + '/';
            }
        },
        // 关闭弹框组件
        close() {
            this.isShow = false;
            // 关闭窗口前取消上传
            this.fileList.forEach(file => {
                this.$refs.upload.abort(file);
            });
            // 重置组件的参数
            this.uploading = false;
            this.fileList = [];
            this.upload = {
                dirtype: 'currentdir',
                dirname: '',
                currentPath: ''
            };
        },
        // 闭前的回调，会暂停 Dialog 的关闭
        handleClose(done) {
            if (this.uploadingFilesNums > 0) {
                this.$confirm('当前还有未完成的任务，关闭窗口将取消当前任务中的所有上传', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        done();
                    })
                    .catch(_ => {});
            } else {
                done();
            }
        },
        cancel() {
            this.close();
        },
        // 传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
        beforeUpload(file) {
            this.uploading = this.allowUpload ? true : false;

            return this.allowUpload;
        },
        // 文件上传时的钩子
        onProgress(event, file, fileList) {
            this.fileList = fileList;
            $log('上传中', file.percentage);
        },
        // 文件上传成功时的钩子
        onSuccess(response, file, fileList) {
            this.fileList = fileList;
            if (response.code === '0000') {
                // let dirname = this.upload.dirtype === 'currentdir' ? this.upload.currentPath : this.upload.dirname + '/';
                // uploadFile(this.bucketId, response.data, dirname).then(res => {
                //     if (res.code === '0000') {
                //         this.$emit('success');
                //     }
                // });
            }
            $log('上传完成', response, fileList);
        },
        // 文件上传失败时的钩子
        onError(response, file, fileList) {
            this.fileList = fileList;
            $log('上传失败', response, fileList);
        },
        // 取消上传
        cancelUpload(file, index) {
            console.log(file);
            this.$confirm('取消上传后将不能继续？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$refs.upload.abort(file);
                this.fileList[index].status = 'cancel';
            });
        },
        // 根据上传百分比动态设置背景
        setBackground({row, index}) {
            return {'background-image': 'url(' + percentageBg + ')', 'background-size': row.percentage + '% 100%', 'background-repeat': 'no-repeat'};
        }
    }
};
</script>
<style>
.el-upload-dragger {
    border-radius: 0 !important;
}
.el-upload__tip {
    line-height: 20px;
}

.el-upload__input {
    display: none !important;
}
</style>
