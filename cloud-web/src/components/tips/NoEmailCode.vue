<template>
    <el-popover
        placement="bottom"
        :title="$t('tips.noEmail.title')"
        width="400"
        trigger="hover"
        >
        <div v-html="$t('tips.noEmail.content')"></div>
        <span slot="reference" class="color-primary underline text-pre"><i class="iconfont icon-iconfontwenhao1" v-if="showIcon"></i><span> {{$t('tips.noEmail.title')}}</span></span>
  </el-popover>
</template>
<script>
export default {
    props: {
        showIcon: {
            default: false,
            type: Boolean
        }
    }
};
</script>
