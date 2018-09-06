<template>
    <div v-if="isShow" class="preview">
        <el-dialog title="预览" :visible.sync="isShow" width="600px" :append-to-body="true" @close="cancel">
            <div class="form" style="padding-right:10px;">
                <zt-form v-loading="loading" ref="myForm" label-width="80px" size="small" inline-message>
                    <zt-form-item label="文件名">
                        {{currentFile.key}}
                    </zt-form-item>
                    <zt-form-item label="url">
                        <el-input type="textarea" :rows="3" resize="none" readonly v-model="currentFile.downloadFileLink">
                        </el-input>
                        <span class="mt10">
                            <a href="javascript:;" class="font12" v-clipboard="'' + currentFile.downloadFileLink + ''" @success="copyHandleSuccess" @error="copyHandleError">复制文件URL</a> |
                            <a :href="currentFile.downloadFileLink"  class="font12" target="_blank">下载文件</a>
                        </span>
                    </zt-form-item>
                    <zt-form-item label="类型">
                        {{currentFile.mimeType}}
                    </zt-form-item>
                </zt-form>
            </div>
            <div slot="footer" class="dialog-footer text-right">
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getFileLink} from '@/service/oss/filemgr';
export default {
    name: 'Preview',
    data() {
        return {
            isShow: false,
            reject: null,
            resolve: null,
            loading: false,
            initialIndex: 0,
            currentFile: {
                key: '',
                downloadFileLink: '',
                viewFileLink: ' ',
                mimeType: ''
            }
        };
    },
    props: {
        path: String,
        bucketId: String,
        file: Object
    },
    methods: {
        show(cfile) {
            this.currentFile = cfile;
            this.isShow = true;
            this.getFileLink(cfile);
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
        },
        cancel() {
            this.close();
        },
        getFileLink(file) {
            this.loading = true;
            getFileLink(this.bucketId, file.key)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.currentFile.downloadFileLink = res.data;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        copyHandleSuccess() {
            this.$message.success('复制成功');
        },
        copyHandleError() {
            this.$message.error('复制失败');
        }
    }
};
</script>
<style scoped>
</style>
