<template>
    <div class="pageLoading">
        <div class="loading">
                <img src="statics/images/loading_1.gif" alt=""> {{$t('common.loading')}}...
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'PageLoading',
    data() {
        return {};
    }
};
</script>
<style scoped>
    .pageLoading {
        width: 100%;
        top: 0px;
        bottom: 0px;
        left:50px;
        position: fixed;
        z-index: 10;
        background: #fff;
    }
    .loading {
        width: 500px;
        height: 100px;
        margin: 0 auto;
        margin-top: calc(50vh - 50px);
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #555;
    }
</style>
