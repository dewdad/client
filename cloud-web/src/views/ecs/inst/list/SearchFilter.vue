<template>
    <div class="search-filter" v-show="hasTag">
       <span class="color-secondary font12 search-filter-label"><i class="iconfont icon-shaixuan"></i> 检索项：</span>
        <el-tag v-for="(item, key) in listData" :key="key" size="mini" type="info" closable v-show="item && key"  @close="close(key)" v-tooltip.bottom="item.length > 18 ? item : null">
            <span class="text-ellipsis tips">{{getName(key)}}: {{item}}</span>
        </el-tag>
       <span @click="$emit('clear')" class="clear-btn">清除</span>
    </div>
</template>

<script>
import {ESC_SEARCH_TYPE as list} from '@/constants/dicts/ecs.js';

export default {
    props: {
        data: Object
    },
    data() {
        return {
            list,
            listData: {}
        };
    },
    computed: {
        hasTag() {
            return Object.keys(this.listData).filter(e => e && this.listData[e]).length;
        }
    },
    watch: {
        data: {
            immediate: true,
            handler() {
                console.log('wa', this.data);
                this.listData = this.data;
            }
        },
    },
    methods: {
        getName(val) {
            let item = this.list.find(e => e.value === val);
            return item ? item.label : val;
        },
        close(key) {
            this.$emit('close', key);
        }
    }
};
</script>

<style>
.search-filter .clear-btn{
    padding: 0 0 0 6px;
    border: none;
	font-size: 12px;
    color: #364556;
    cursor: pointer;
}
.search-filter .el-tag--mini{
    margin-bottom: 5px;
}
.search-filter {
    padding: 6px 0 0 0;
    margin-bottom: -5px;
}
.search-filter .el-tag {
    display: inline-flex;
    align-items: flex-end;
}
.search-filter .tips {
    display: block;
    max-width: 300px;
}

.search-filter .search-filter-label{
    padding: 0 5px 0 10px;
}
</style>
