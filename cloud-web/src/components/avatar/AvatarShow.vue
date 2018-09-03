<template>
    <div class="container" :style="boxSizeStyle">
        <img  src="@/assets/images/control/top-head.svg" width="100%">
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    data() {
        return {
            avatarUrlShow: true,
            errorImg: 'this.src="' + require('@/assets/images/LOGO.svg') + '"'
        };
    },
    props: {
        boxSize: {
            type: Number,
            default: 72
        },
        avatarUrl: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState('user', ['photoId']),
        boxSizeStyle() {
            return {
                width: this.boxSize + 'px',
                height: this.boxSize + 'px'
            };
        }
    }
};
</script>
<style lang="scss" scoped>
.container {
    overflow: hidden;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    margin: 0 auto;
    line-height: 0;
    img {
        object-fit: cover;
    }
}
</style>

