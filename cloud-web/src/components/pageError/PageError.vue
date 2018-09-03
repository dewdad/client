<template>
    <div class="PageError">
        <div class="error">
            <img src="@/assets/images/control/error.png" alt="">
            <span class="pull-left text-left text">
                出错啦!<br> {{pageLoadError}}
            </span>

        </div>

    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    name: 'PageError',
    data() {
        return {};
    },
    computed: {
        ...mapState({
            pageLoadError: state => state.pageLoadError
        })
    }
};
</script>
    <style scoped>
.error {
    width: 500px;
    height: 300px;
    margin: 0 auto;
    padding-top: 15%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #555;
}
.error img {
    float: left;
}
.error .text {
    padding-top: 50px;
}
</style>