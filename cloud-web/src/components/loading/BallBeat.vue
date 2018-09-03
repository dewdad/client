<template>
    <div class="loader-inner ball-beat">
        <div :style="{'background-color': color, 'width': size + 'px', 'height': size + 'px'}"></div>
        <div :style="{'background-color': color, 'width': size + 'px', 'height': size + 'px'}"></div>
        <div :style="{'background-color': color, 'width': size + 'px', 'height': size + 'px'}"></div>
    </div>
</template>
<script>
export default {
    name: 'BallBeat',
    props: {
        size: {
            type: String,
            default: '15'
        },
        color: {
            type: String,
            default: '#ffffff'
        }
    },
    data() {
        return {};
    }
};
</script>
<style scoped>
@-webkit-keyframes ball-beat {
    50% {
        opacity: 0.2;
        -webkit-transform: scale(0.75);
        transform: scale(0.75);
    }
    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes ball-beat {
    50% {
        opacity: 0.2;
        -webkit-transform: scale(0.75);
        transform: scale(0.75);
    }
    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

.ball-beat > div {
    /* background-color: #fff;
    width: 15px;
    height: 15px; */
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
    -webkit-animation: ball-beat 0.7s 0s infinite linear;
    animation: ball-beat 0.7s 0s infinite linear;
}

.ball-beat > div:nth-child(2n-1) {
    -webkit-animation-delay: 0.35s !important;
    animation-delay: 0.35s !important;
}
</style>
