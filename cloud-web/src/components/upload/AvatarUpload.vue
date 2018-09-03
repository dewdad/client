<template>
    <div>
        <el-row>
            <!-- imgInput框 -->
            <el-col :span="widthRatio[0]">
                <el-input v-model="imageName" size="small" readonly :placeholder="$t('management.uploadFile')"></el-input>
            </el-col>
            <!-- 上传按钮 -->
            <el-col :span="widthRatio[1]">
                <el-upload :on-error="uploadError"  :before-upload="beforeProgress" :on-progress="uploadProgress" :action="uploadAction" :on-success="handleAvatarSuccess">
                    <el-button type="info" class="ml10" size="small">{{ $t('management.upload') }}</el-button>
                </el-upload>
            </el-col>
            <!-- 错误提示 -->
            <el-col :span="widthRatio[2]">
                <span class="color-danger ml10 lh32" v-show="standardShow"><i class="iconfont icon-shibaibaocuo font14"></i> {{$t('management.uploadRuleTip')}}</span>
                <span class="color-danger ml10 lh32" v-show="uploadFail"><i class="iconfont icon-shibaibaocuo font14"></i> {{$t('management.uploadFail')}}</span>
            </el-col>
        </el-row>
        <!-- 注释 -->
        <div class="mt5 font12" v-show="true">{{ $t('management.uploadRule') }}</div>
        <!-- 上传进度条 -->
        <div class="imgProgress mt5">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="imgProgress" v-show="imgProgress > 0"></el-progress>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            imageName: '',
            imgSize: '',
            Suffixname: '', // 后缀名
            fileType: '',
            imgProgress: 0, // 上传进度
            Standard: true, //上传规格
            uploadFail: false,
            imgType: ['image/jpeg', 'image/png', 'image/jpg']
        };
    },
    methods: {
        // 文件上传完成
        handleAvatarSuccess(res, file) {
            if (!this.Standard) {
                return;
            }
            $log('文件上传完成', file);
            if (file.response.code === '0000') {
                $log('文件上传完成成功', file);
                this.imageName = file.name;
                this.$emit('getPhotoId', file);
            } else {
                this.imgProgress = 0;
                this.uploadFail = true;
                $log('文件上传失败');
            }
        },
        uploadError(err, file, fileList) {
            console.log('文件上传错误',err);
            this.uploadFail = true;
        },
        // 上传文件进度
        uploadProgress(event) {
            if (!this.Standard) {
                return;
            }
            this.imgProgress = parseInt(event.percent);
        },
        // 文件上传之前
        beforeProgress(file) {
            $log(file);
            this.uploadFail = false;
            this.Suffixname = file.type;
            this.imgSize = file.size;
            // 清除上次图片
            this.imageName = '';
            // 清除上次上传进度
            this.imgProgress = 0;
            if (this.imgSize >= 2097152) {
                this.Standard = false;
                return false;
            } else if (!(this.imgType.includes(this.Suffixname))){
                this.Standard = false;
                return false;
            }
            this.Standard = true;
        }
    },
    computed: {
        standardShow () {
            return this.imgSize > 2097152 || this.Suffixname !== '' && !(this.imgType.includes(this.Suffixname));
        }
    },
    props: {
        dialogVisible: {
            type: Boolean
        },
        widthRatio: {
            type: Array,
            default: function() {
                return [9, 3, 8];
            }
        },
        uploadAction: {
            type: String
        }
    },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.imgProgress = 0;
                this.imageName = '';
                this.fileType = '';
                this.imgSize = '';
                this.Suffixname = '';
                this.uploadFail = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>

</style>

