<template>
<div class="info-panel" v-if="showData && showData.length">
    <transition name="fade-in-linear" v-for="(item, key) in list" :key="key" >
        <div class="box" :class="[item.type, {warning: item.oecd.sum > 0}]" @mouseenter="hideTooltips">
            <el-popover
                placement="bottom-start"
                width="180"
                trigger="hover"
                transition="scale"
                popper-class="info-panel-popper"
            >
                <div>
                    {{item.type | name}}
                    <!-- 列表 -->
                    <div v-if="item && item.pending && item.pending.length !== undefined">
                        <div v-for="state in item.pending" :key="state.level">
                            {{getLevel(state.level)}}: {{state.count}} 个
                        </div>
                    </div>
                    <!-- 单条 -->
                    <div v-if="item && item.pending && item.pending.length === undefined">
                        {{item.pending && item.pending.count}} 个
                    </div>

                    <div class="mt20">{{$t('security.history')}}</div>
                    <div>{{item.type | name}}{{$t('common.total')}}：{{item && item.oecd && item.oecd.sum}}</div>
                </div>
                <div slot="reference">
                    <div class="color-secondary">{{item.type | name}}</div>
                    <div class="sum font36">
                        {{item && item.oecd && item.oecd.sum}} <small class="font14">个</small>
                    </div>
                </div>
            </el-popover>
        </div>
    </transition>
</div>
</template>

<script>
import {INFO} from '@/constants/dicts/security.js';
import {getDom} from '@/utils/utils';
export default {
    props: {
        data: Object
    },
    data() {
        return {
            list: []
        };
    },
    filters: {
        name(val) {
            return INFO[val].name;
        }
    },
    watch: {
        showData: {
            immediate: true,
            handler: function() {
                this.init();
            }
        }
    },
    methods: {
        hideTooltips() {
            let node = getDom.getClass('info-panel-popper');
            for (const key of Object.keys(node)) {
                node[key].style.display = 'none';
            }
        },
        // 获取安全等级
        getLevel(level) {
            if (!level) return;
            return INFO.leak.level[level];
        },
        init() {
            this.list = [];
            console.log(this.showData);
            if (this.showData) {
                this.showData.map((e, index) => {
                    console.log(e);

                    setTimeout(() => {
                        this.list.push(e);
                    }, index * 200);
                });
            }
        }
    },
    computed: {
        showData() {
            if (!this.data) return [];
            let showData = [];
            Object.keys(this.data).map(key => {
                let item = this.data[key];
                if (
                    key !== 'server_score_info' &&
                    item &&
                    Object.prototype.toString.call(item) === '[object Object]'
                ) {
                    item.type = key;
                    showData.push(item);
                }
            });
            return showData;
        }
    }
};
</script>

<style lang="scss">
.info-panel {
    flex-wrap: wrap;
    display: flex;
    margin-top: -10px;
    height: 200px;

    .box {
        height: 90px;
        width: calc((100% - 30px) / 4);
        border: 1px solid #d5e3fe;
        box-sizing: border-box;
        padding: 10px 20px;
        margin-top: 10px;
        @each $type in leak, base_line, brute_force, weak_pwd, port_scan,
            abn_login, webshell, host_anomaly
        {
            &.#{$type} {
                background-image: url('../../assets/images/secureoverview/wloophole.png');
                background-position: 100% 100%;
                background-repeat: no-repeat;
            }
        }
        &:not(:nth-of-type(4n)) {
            margin-right: 10px;
        }
        &.warning {
            border: 1px solid #ffe5b6;
            .sum {
                color: #f60;
            }

            @each $type in leak, base_line, brute_force, weak_pwd, port_scan,
                abn_login, webshell, host_anomaly
            {
                &.#{$type} {
                    background-image: url('../../assets/images/secureoverview/wloophole-warning.png');
                    background-position: 100% 100%;
                    background-repeat: no-repeat;
                }
            }
        }
    }
}
.info-panel-popper {
    background: #3e424e;
    color: #fff;

    .popper__arrow {
        display: none !important;
    }
}
</style>
