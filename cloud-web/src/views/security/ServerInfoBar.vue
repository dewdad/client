<template>
<div class="server-info-bar" v-if="total > 0">
    <p class="font12">{{data.server_info.server_detail.ip}}
        <span class="pull-right total text-right font12">{{total}} 个</span>
    </p>
    <div class="bar">
        <div class="server-info-bar-container">
            <el-tooltip :content="item.content" placement="top" v-for="item in blocks" :key="item.name">
                <span :style="item.style" class="color-white text-nowrap font12 count">{{item.count}}个</span>
            </el-tooltip>
        </div>
    </div>
</div>
<!-- <span v-else class="text color-secondary">{{$t('common.noData')}}</span> -->
</template>

<script>
export default {
    props: {
        data: Object
    },
    data() {
        return {
            level: {
                super: {
                    color: '#FF0000',
                    name: '严重'
                },
                high: {
                    color: '#D45E5A',
                    name: '高危'
                },
                medium: {
                    color: '#ff9406',
                    name: '中危'
                },
                low: {
                    color: '#c2c2c2',
                    name: '低危'
                }
            }
        };
    },
    computed: {
        total() {
            return (
                this.data.low +
                this.data.medium +
                this.data.high +
                this.data.super
            );
        },
        blocks() {
            let blocks = [];
            let level = this.level;
            let data = this.data;
            for (const key in level) {
                if (level.hasOwnProperty(key)) {
                    let count = data[key];
                    if (count) {
                        let item = {
                            content: `${this.level[key].name} : ${count} 个`,
                            name: this.level[key].name,
                            count
                        };
                        item.style = {
                            flex: count,
                            background: this.level[key].color
                        };
                        blocks.push(item);
                    }
                }
            }
            return blocks;
        }
    }
};
</script>

<style lang="scss" scoped>
.server-info-bar {
    text-align: left;
    .bar,
    .server-info-bar-container {
        display: flex;
        flex: 1;
        width: 100%;
    }
    .total {
        margin-left: 15px;
    }
    .count{
        padding: 2px;
    }
    .count:not(:last-of-type) {
        margin-right: 2px;
    }
}
</style>
