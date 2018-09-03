<template>
    <!-- 检索项 -->
    <div class="retrieval font12 mb10" v-show="this.retrievalData.length > 0">
        <i class="iconfont icon-screen_people"></i>
        <span>检索项 : </span>
        <span class="retrievalItem" v-for="(ret, index) in retrievalData" :key="ret.labelKey">
            {{ret.labelKey + ':' + ret.labelvalue}}
            <i @click="deleteFn(index)" class="ml10 finger-cursor el-icon-close"></i>
        </span>
        <span @click="deleteAllFn" class="ml10 deleteRetrieval finger-cursor">清除</span>
    </div>
</template>
<script>
export default {
    data() {
        return {
        };
    },
    props: {
        retrievalData: {
            type: Array
        },
    },
    methods: {
        // 清除筛选标签
        deleteAllFn() {
            this.retrievalData.splice(0, this.retrievalData.length);
            this.$emit('select', this.retrievalData);
        },
        // 清除当前标签
        deleteFn(index) {
            this.retrievalData.splice(index, 1);
            this.$emit('select', this.retrievalData);
        }
    }
};
</script>

<style scoped lang="scss">
.retrieval{
    .retrievalItem{
        background-color: #f6f8fa;
        border: 1px solid #d1d5de;
        padding: 2px 5px;
        margin-right: 5px;
    }
}
</style>
