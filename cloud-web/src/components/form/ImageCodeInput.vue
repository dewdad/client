<template>
    <div class="inline-block width-full">
        <el-input ref="input" @input="inputChange" v-model="code" class="no-style" @blur="onBlur" @focus="onFocus" :maxlength="4" :prefix-icon='icon ?"iconfont icon-message_people": ""' :placeholder="$t('form.input.imageCode')">
        </el-input>
        <span class="image-code">
            <a href="javascript:;" @click="getImgCode" :title="$t('form.btn.changePictureCode')"><img id="imageCode" :src="imageSrc" alt=" " width="80px"></a>
        </span>
    </div>
</template>
<script>
import {checkImageCode} from '@/service/register';
export default {
    name: 'ImageCodeInput',
    data() {
        return {
            imageId: '',
            imageSrc: '',
            code: ''
        };
    },
    props: {
        icon: {
            default: true
        }
    },
    created() {
        this.imageSrc = API_URL + '/identity/user/imageCode?' + Math.random();
    },
    methods: {
        onBlur() {
            this.$emit('blur');
        },
        onFocus() {
            this.$emit('focus');
        },
        inputChange(value) {
            this.$emit('input', this.code);
        },
        // 获取图片验证码
        getImgCode() {
            this.imageSrc = API_URL + '/identity/user/imageCode?' + Math.random();
        },
        async checkImageCode() {
            let result = await checkImageCode(this.code);
            return result;
        }
    }
};
</script>
<style scoped lang="scss">
.image-code {
    position: absolute;
    right: 10px;
    line-height: 40px;
    padding: 0 5px;
    background: transparent;
    border-color: transparent;
}
</style>
