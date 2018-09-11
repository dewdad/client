<template>
    <el-dialog title="删除文件" :visible.sync="isShow" width="500px" class="zt-dialog" @close="cancel">
        <div class="title img-text-center">
            <i class="el-icon-warning"></i>
            <span>您所选的</span>
            <span @click="toggleClass = !toggleClass">
                <a>{{files.length}}个文件 </a>
                <i :class="{'el-icon-arrow-up':toggleClass,'el-icon-arrow-down':!toggleClass}" class="font12">
                </i>
            </span>
            <span> 将执行删除操作，您是否确认操作？</span>
        </div>
        <div class="zt-alert">
            <el-alert v-show="toggleClass" class="font12 mt5" type="info" :closable="false" title="">
                <ul>
                    <li v-for="file in files" :key="file.key">{{file.key || file}}</li>
                </ul>
            </el-alert>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow=false" size="small" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" class="font12" @click="confirm" size="small" :loading="loading" >{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {removeFile} from '@/service/oss/filemgr';
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            loading: false,
            toggleClass: false,
            files: [],
            type: ''
        };
    },
    props: {
        bucketId: {
            type: String,
            default: ''
        }
    },
    watch: {
        isShow: function(newval) {
            if (!newval) {
                setTimeout(() => {
                    this.files = [];
                    this.toggleClass = false;
                    this.loading = false;
                }, 500);
            }
        }
    },
    methods: {
        show(files, type) {
            this.files = files;
            this.type = type;
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
            typeof this.reject() === 'function' && this.reject();
        },
        confirm() {
            let fileName = [];
            for (let file of this.files) {
                fileName.push(file.key || file);
            }
            removeFile(this.bucketId, fileName, this.type)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.$message.success('文件删除成功');
                        // this.fileList.splice(index, 1);
                        this.resolve();
                        this.hide();
                    }
                })
                .catch(err => {
                    $log(err);
                });

            //this.hide();
        }
    }
};
</script>
<style lang="scss" scoped>
.zt-dialog {
    font-size: 12px;
    .title {
        font-size: 14px;
        vertical-align: center;
        .el-icon-warning {
            font-size: 28px;
            color: #f60;
            margin-right: 10px;
        }
    }
    .zt-alert {
        padding: 0 38px;
    }
}
</style>
