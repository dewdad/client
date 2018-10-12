<template>
<div class="mb10">
    <!-- {{selectOption}} -->
    <!-- {{getParams(selectOption)}} -->
    <div class="ecs-select" :class="{selected: select}" @mouseenter="showHover = true" @mouseleave="showHover = false">
        <div class="ecs-select-input-wrapper flex" :class="{'focus': inputFocus || showHover}">
            <!-- 下拉框 -->
            <span class="prefix" @mouseenter="open" @mouseleave="close">
                <i class="icon el-icon-caret-bottom" /><span class="option" v-show="select">{{select}}：</span>
                <ul class="options box-shadow" v-show="showOptions">
                    <li @click="selectClickHandler(item)" v-for="item in list" :key="item.value" :class="['select-item', 'text-ellipsis', {active: item.label === select}]" v-show="item.value !== 'status'">
                        {{item.label}} <i class="iconfont icon-Correct" v-if="item.label === select"></i>
                    </li>
                </ul>
            </span>
            <!-- 输入框 -->
            <el-input :placeholder="placeholder" v-model="input" class="ecs-select-input" size="small" @focus="inputFocus = true" @blur="inputBlur" @keyup.enter.native="submit" maxlength="64">
                <!-- 帮助提示 -->
                <!-- <el-tooltip slot="append" class="item" effect="dark" placement="top">
                    <span slot="content" @click="$emit('help')">{{$t('ecs.inst.list.help')}}</span>
                    <i class="iconfont icon-iconfontwenhao1" @click="$emit('help')"></i>
                </el-tooltip> -->
            </el-input>
            <!-- 搜索历史 -->
            <div class="history box-shadow" v-show="inputFocus && !select && !showOptions && !input && searchHistoryDesc.length">
                <ul>
                    <li class="text-ellipsis" v-tooltip.right="item.value.length > 18 ? item.value : null" v-for="(item, key) in searchHistoryDesc" :key="key" @click="historyClickHandler(item)"><i class="el-icon-time"></i> {{item.type}}：{{item.value}}</li>
                </ul>
            </div>
        </div>
        <el-button class="ml10" type="primary" @click="submit" icon="el-icon-search" :size="size">{{ $t('common.searchButtonText') }}</el-button>
    </div>
    <search-filter :data="selectOption" @close="closeSearchFilter" @clear="clear"></search-filter>
</div>
</template>

<script>
import {ESC_SEARCH_TYPE as list} from '@/constants/dicts/ecs.js';
import SearchFilter from '@/views/ecs/inst/list/SearchFilter.vue';
import {cloneDeep} from '@/utils/utils';
import {mapMutations, mapGetters} from 'vuex';
import {IP_REGEXP} from '@/constants/regexp.js';

export default {
    props: {
        value: {
            type: Object,
            default() {
                return {};
            }
        },
        size: {
            default: 'mini'
        }
    },
    data() {
        return {
            option: this.value,
            inputFocus: false,
            showHover: false,
            showOptions: false,
            select: list[0].label,
            selectOption: {}, // ESC 选择器 筛选条件。
            input: '',
            list
        };
    },
    components: {
        SearchFilter,
    },
    watch: {
        selectOption: {
            immediate: true,
            handler() {
                this.$emit('search', this.getParams(this.selectOption));
            }
        },
    },
    computed: {
        ...mapGetters('ecs', ['searchHistoryDesc']),
        placeholder() {
            let item = this.list.find(e => e.label === this.select) || this.list[0];
            return item.placehold;
        }
    },
    methods: {
        ...mapMutations('ecs', ['saveHistory']),
        selectClickHandler(val) {
            this.close();
            if (val.value === '') {
                this.select = '';
            } else {
                this.select = val.label;
            }
        },
        historyClickHandler(item) {
            console.log('historyClickHandler', item);
            let input = item.value;
            let select = item.type;
            this.search({
                select,
                input
            });
        },
        getParams(params) {
            let ret = {};
            Object.keys(params).map(e => {
                let key = this.getKey(e);
                if (key) {
                    ret[key] = params[e];
                }
            });
            return ret;
        },
        /**
         * 获取筛选key
         */
        getKey(name) {
            let item = this.list.find(e => e.label === name);
            return item ? item.value : undefined;
        },
        inputBlur() {
            // 失焦之后不能马上隐藏
            setTimeout(() => {
                this.inputFocus = false;
            }, 150);
        },
        open(event) {
            this.showOptions = true;
        },
        close() {
            this.showOptions = false;
        },
        submit() {
            if (!this.select) {
                this.fuzzySearch();
                return;
            }
            this.search();
        },
        search({select, input} = {}) {
            let type = select || this.select;
            let value = input || this.input;
            this.inputFocus = false;
            this.ecsSelect({
                type,
                value,
                data: {[type]: value}
            });
            this.saveHistory({type, value});
            this.input = '';
        },
        // 模糊搜索
        fuzzySearch() {
            let val = this.input;
            let select = '实例名称';
            if (val.startsWith('e-')) {
                select = '实例ID';
            } else if (val.startsWith('img-')) {
                select = '镜像ID';
            } else if (val.startsWith('sg-')) {
                select = '安全组ID';
            } else if (val.startsWith('net-')) {
                select = '私有网络ID';
            } else if (val.startsWith('sn-')) {
                select = '子网ID';
            } else if (IP_REGEXP.test(val)) {
                if (val.startsWith('10') || val.startsWith('192') || val.startsWith('175')) {
                    select = '私有IP';
                } else {
                    select = '弹性公网IP';
                }
            }
            this.search({
                select,
                input: val
            });
        },
        ecsSelect(val) {
            this.selectOption = Object.assign({}, this.selectOption, val.data);
        },
        // 清除筛选条件
        clear() {
            this.selectOption = {};
        },
        closeSearchFilter(key) {
            let selectOption = cloneDeep(this.selectOption);
            delete selectOption[key];
            this.selectOption = selectOption;
        },
    }
};
</script>

<style lang="scss">
.ecs-select {
    display: flex;
    width: 410px;
    height: 32px;

    .prefix {
        min-width: 30px;
        line-height: 30px;
        height: 30px;
        text-align: center;
        white-space: nowrap;
        position: relative;

        .option{
            font-size: 12px;
            position: relative;
            top: -1px;
        }
        .options {
            position: absolute;
            z-index: 9999;
            background: #fff;
            text-align: left;
            border: 1px solid #c3c5c6;
            left: -1px;
            top: calc(100% + 1px);
            border-top: none;
        }

        .select-item {
            height: 32px;
            line-height: 32px;
            padding: 0 30px 0 10px;
            color: #333333;
            font-size: 12px;
            min-width: 110px;
            position: relative;
            cursor: pointer;
            
            &.active, &:hover{
                color: #0c7ef1;
                background: #f9fafd;
            }

            .iconfont {
                height: 32px;
                line-height: 32px;
                position: absolute;
                right: 10px;
            }
        }

        .el-input__inner {
            height: 30px;
        }

        &:hover .icon{
            color: #364556;
            transform:rotate(180deg);
        }
    }
    .icon {
        width: 30px;
        line-height: 30px;
        color: #9999;
    }
    .ecs-select-input-wrapper{

        

        position: relative;
        flex: 1;
        border: 1px solid #c3c5c6;
        .el-input__inner {
            border: none;
        }
        input {
            border: none;
            padding-left: 0;
            // 高分屏下出现遮挡
            position: relative;
            top: 1px;
            height: 28px;
        }

        .ecs-select-input {
            flex: 1;
            // 火狐浏览器计算flex 超出
            max-width: 298px;
        }
    }

    .ecs-select-input-wrapper.focus{
        border-color: #0d7ef2;
    }
    .iconfont:hover {
        color: #0d7ef2;
    }
    
    .el-input-group__append {
        padding: 0 8px 0 0;
        border: none;
        background: transparent;
        .iconfont{
            font-size: 16px;
            height: 30px;
            line-height: 30px;
            vertical-align: middle;

        }
    }

    .el-button{
      width: 70px;
    }

    .history {
        position: absolute;
        background: #fff;
        top: 31px;
        z-index: 9998;
        width: calc(100% + 2px);
        left: -1px;
        border: 1px solid #c3c5c6;
        border-top: none;

        li {
            height: 32px;
            line-height: 32px;
            padding: 0 30px 0 10px;
            color: #333333;
            font-size: 12px;
            min-width: 110px;
            position: relative;
            cursor: pointer;
            
            &.active, &:hover{
                color: #0c7ef1;
                background: #f9fafd;
            }
        }
    }
}
</style>
