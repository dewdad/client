<template>
<div class="detect-module" :class="[level, {isScaning: isScaning}]">
    <div class="process pull-left color-white mr30">
        <div class="circle" :class="{active: isScaning || !hasShowProcess}"></div>
        <span class="score">{{score || 100}}</span>
    </div>
    <div class="text color-white pull-left">
        <h2 class="tips">{{title}}</h2>
        <p class="desc" v-if="onlineInfo && !isScaning && hasShowProcess">
            <router-link to="#" class="color-white">
                在线： {{onlineInfo.online}}台
            </router-link>
            <router-link to="#" class="color-white">
                离线： {{onlineInfo.offline}}台
            </router-link>
        </p>
        <p v-if="isScaning && remainingTime">剩余时间约为: {{remainingTime}}</p>
    </div>
    <div class="pull-right text-right" v-if="!isScaning && hasShowProcess">
        <p class="color-white time">上次检测时间：{{infoData.last_scan_time | date}}</p>
        <el-button class="re-detect-btn"  @click="start">重新检测</el-button>
    </div>
    <el-progress v-if="isScaning && hasShowProcess" class="detect-module-progress" :percentage="percentage" :showText="false" :strokeWidth="5"></el-progress>
</div>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import {EVENTTYPES} from '@/constants/dicts/security.js';
let showScoreTimer, timer;
export default {
    data() {
        return {
            isStart: false,
            isDestoryed: false,
            hasShowProcess: true,
            isError: false,
            score: 100
        };
    },
    methods: {
        ...mapActions('security', ['onKeyScan', 'onkeyscanStatus']),
        async getStatus() {
            try {
                if (!this.isScaning || this.isDestoryed) return;
                let ret = await this.onkeyscanStatus();
                console.log('onkeyscanStatus', ret);

                if (!ret || !ret.length) {
                    throw new Error('检测失败');
                }

                // 停止轮询
                let [data] = ret;
                if (data.scan_status !== 1) {
                    let arr = ['0--从未扫描', '1——扫描中', '2——扫描完成'];
                    console.warn('停止轮询', arr[data.scan_status]);
                    return;
                }

                //开启下一轮
                timer = setTimeout(() => {
                    this.getStatus();
                }, 10000);
            } catch (error) {
                console.warn('onKeyScan', error.message);
                this.isStart = false;
                this.isError = true;
            }
        },
        async start() {
            try {
                this.isStart = true;
                this.isError = false;
                let ret = await this.onKeyScan();
                if (!ret) {
                    throw new Error('检测失败');
                }
                await this.onkeyscanStatus();
                this.getStatus();
            } catch (error) {
                console.warn('onKeyScan', error.message);
                this.isStart = false;
                this.isError = true;
            }
        },
        showScore() {
            if (this.score <= this.infoData.score) {
                this.hasShowProcess = true;
                return;
            }
            this.score--;
            timer = setTimeout(() => {
                this.showScore();
            }, 100);
        }
    },
    destroyed() {
        this.isDestoryed = true;
        if (timer) {
            timer = clearTimeout(timer);
        }
        if (showScoreTimer) {
            showScoreTimer = clearTimeout(showScoreTimer);
        }
    },
    watch: {
        isScaning: {
            immediate: true,
            handler: function(val) {
                if (val === true) {
                    this.getStatus();
                }
            }
        }
    },
    async created() {
        await this.onkeyscanStatus();
        if (this.showProcess) {
            this.hasShowProcess = false;
            this.showScore();
            // 未扫描进入当前组件。显示分数。
        } else {
            this.score = this.infoData.score || 100;
        }
    },
    computed: {
        ...mapState('security', ['infoData', 'scanStatus']),
        ...mapGetters('security', ['showProcess']),
        // score() {
        //     return this.isScaning ? 100 : this.infoData.score;
        // },
        isScaning() {
            // 当天未扫描
            if (!this.hasShowProcess) return false;

            if (this.scanStatus && this.scanStatus.length) {
                let data = this.scanStatus[0];
                // 0——从未扫描，1——扫描中，2——扫描完成
                return data.scan_status === 1;
            }
            return false;
        },
        percentage() {
            if (this.scanStatus && this.scanStatus.length) {
                let data = this.scanStatus[0];
                return parseInt(data.progress) || 0;
            }
            return 0;
        },
        remainingTime() {
            if (this.scanStatus && this.scanStatus.length) {
                let data = this.scanStatus[0];
                let time = data.remaining_time;
                let min = Math.floor(time / 60);
                let second = time % 60;
                // 0——从未扫描，1——扫描中，2——扫描完成
                return `${min} 分 ${second} 秒`;
            }
        },
        level() {
            if (this.hasShowProcess) {
                return 'level-' + this.infoData.level;
            } else if (this.score < 60) {
                return 'level-1';
            } else if (this.score < 80) {
                return 'level-2';
            } else {
                return 'level-3';
            }
        },
        levelName() {
            // 1——差，2——良，3——优
            let level = '优';
            switch (this.infoData.level) {
                case 1:
                    level = '差';
                    break;
                case 2:
                    level = '良';
                    break;
                case 3:
                    level = '优';
                    break;
                default:
                    break;
            }
            return level;
        },
        currentScanning() {
            if (this.scanStatus && this.scanStatus.length) {
                let data = this.scanStatus[0];
                let item = EVENTTYPES.find(e => e.value === data.scanning);
                return (item && item.label) || '';
            }
        },
        onlineInfo() {
            let info = this.infoData.online_info;
            let online = 0;
            let offline = 0;
            if (info) {
                info.map(e => {
                    online = offline + parseInt(e.online);
                    offline = offline + parseInt(e.count - e.online);
                });
                return {
                    online,
                    offline
                };
            }
        },
        title() {
            if (this.isError) {
                return this.$t('security.overview.detectionError');
            } else if (!this.hasShowProcess) {
                return this.$t('security.overview.detectionScore');
            } else if (this.isScaning) {
                return (
                    this.$t('security.overview.detecting') +
                    this.currentScanning
                );
            } else {
                return (
                    this.$t('security.overview.detectionResult') +
                    this.levelName
                );
            }
        }
    }
};
</script>

<style lang="scss">
.detect-module {
    position: relative;
    height: 160px;
    width: 100%;
    background-color: #67ba2f;
    padding: 20px 30px;

    &.level-3 {
        background: #67ba2f;
    }

    &.level-2 {
        background: #4b7de1;
    }

    &.level-1 {
        background: #f60;
    }

    &.isScaning {
        background: #67ba2f;
    }

    @keyframes myrotate {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    .time {
        padding: 25px 0 0 0;
        font-size: 12px;
    }

    .process {
        position: relative;
        width: 110px;
        height: 110px;
        line-height: 110px;
        text-align: center;

        .circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 1px solid #fff;
            border-radius: 50%;

            &.active {
                &::after {
                    content: '';
                    display: block;
                    width: 10px;
                    height: 10px;
                    background: #fff;
                    position: absolute;
                    top: 27px;
                    border-radius: 50%;
                }
                animation: myrotate 3s linear infinite;
            }
        }

        .score {
            font-size: 36px;
            position: relative;
            margin-right: -14px;
            &::after {
                content: '分';
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }
    .re-detect-btn {
        background: #ffffff4f;
        color: #fff;
        border: none;

        &:hover {
            background: #fff;
        }
    }

    .detect-module-progress {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: -4px;

        .el-progress-bar__outer,
        .el-progress-bar__inner {
            border-radius: 0;
        }
    }
}
</style>
