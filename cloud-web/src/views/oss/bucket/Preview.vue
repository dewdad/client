<template>
    <div v-if="isShow" class="preview">
        <el-dialog title="预览" :visible.sync="isShow" width="600px" :append-to-body="true" @close="cancel">
            <div class="form" style="padding-right:10px;">
                <zt-form ref="myForm" label-width="80px" size="small" inline-message>
                    <zt-form-item label="" label-width="0px">
                        <el-carousel v-loading="loading" trigger="click" height="150px" :autoplay="false" indicator-position="none" arrow="always" :initial-index="initialIndex" @change="change">
                            <el-carousel-item v-for="item in fileList" :key="item.name" style="background:#F5F5F5; line-height: 150px;" class="text-center">
                                <h3 v-if="item.mimeType.indexOf('image') === -1" class="text-center" style="line-height: 110px;">此格式不支持预览</h3>
                                <img v-else :src="item.viewFileLink" style="max-height:150px;">
                            </el-carousel-item>
                        </el-carousel>
                    </zt-form-item>
                    <zt-form-item label="文件名">
                        {{currentFile.key}}
                    </zt-form-item>
                    <zt-form-item label="url">
                        <el-input type="textarea" :rows="3" resize="none" readonly v-model="currentFile.viewFileLink">
                        </el-input>
                        <span class="mt10">
                            <a href="javascript:;" class="font12" v-clipboard="'' + currentFile.viewFileLink + ''" @success="copyHandleSuccess" @error="copyHandleError">复制文件URL</a> |
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
import {cloneDeep} from '@/utils/utils';
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
        fileList: Array
    },
    methods: {
        show(cfile) {
            this.isShow = true;
            try {
                // 初始状态激活的幻灯片的索引，从 0 开始
                this.initialIndex = this.fileList.findIndex(file => {
                    return file === cfile;
                });
                // this.change(this.initialIndex);
            } catch (error) {
                $log(error);
            }
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
        // 幻灯片切换时触发
        async change(index) {
            this.currentFile = cloneDeep(this.fileList[index]);
            if (!this.fileList[index].downloadFileLink) {
                this.getFileLink(this.fileList[index].key, index);
            }
        },
        getFileLink(fileKey, index) {
            this.loading = true;
            getFileLink(this.bucketId, fileKey)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.currentFile.downloadFileLink = res.result.downloadFileLink;
                        this.currentFile.viewFileLink = res.result.viewFileLink;
                        this.fileList[index].viewFileLink = res.result.viewFileLink;
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
