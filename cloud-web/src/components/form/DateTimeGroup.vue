<template>
    <div class="date-group">
        <el-radio-group size="small" v-model="searchDate" @change="dataChangeType" class="header-radio-group">
            <el-radio border name="1小时" label="1h">1小时</el-radio>
            <el-radio border name="6小时" label="6h">6小时</el-radio>
            <el-radio border name="1天" label="1d">1天</el-radio>
            <el-radio border name="7天" label="7d">7天</el-radio>
            <el-radio border name="30天" label="30d">30天</el-radio>
        </el-radio-group>
        <el-date-picker type="datetimerange" format="yyyy-MM-dd" prefix-icon="el-icon-date" class="date-screen ml10" @change="selectDetailTime" v-model="searchObj.dateRange" size="mini" align="right" unlink-panels :range-separator="$t('common.to')" :clearable="false" :start-placeholder="$t('common.beginDate')" :end-placeholder="$t('common.endDate')">
        </el-date-picker>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchDate: '1h',
            searchObj: {
                startDate: '',
                endDate: '',
                dateRange: []
            }
        };
    },
    props: {
        defaultDate: {
            type: String,
            default: '1d'
        },
        showPicker: {
            type: Boolean,
            default: true
        }
    },
    created() {
        this.searchDate = this.defaultDate;
        this.dataChangeType('1h');
    },
    methods: {
        dataChangeType(value) {
            this.searchObj.dateRange = [];
            console.log(value);
            let now, st;
            now = new Date();
            st = new Date(now);
            switch (value) {
                case '1h': {
                    st.setHours(st.getHours() - 1);
                    break;
                }
                case '6h': {
                    st.setHours(st.getHours() - 6);
                    break;
                }
                case '1d': {
                    st.setHours(st.getHours() - 24);
                    break;
                }
                case '7d': {
                    st.setHours(st.getHours() - 7 * 24);
                    break;
                }
                case '30d': {
                    st.setHours(st.getHours() - 24 * 30);
                    break;
                }
                default: {
                    st.setHours(st.getHours() - 1);
                }
            }
            this.searchObj.startDate = st;
            this.searchObj.endDate = now;
            this.searchObj.dateRange.push(st);
            this.searchObj.dateRange.push(now);
            // console.warn(this.searchObj);
            this.timeFormat();
        },
        selectDetailTime() {
            this.searchDate = '';
            this.searchObj.startDate = this.searchObj.dateRange[0];
            this.searchObj.endDate = this.searchObj.dateRange[1];
            // console.log(this.searchObj);
            this.timeFormat();
        },
        // 时间格式转换
        timeFormat() {
            let filters = this.$options.filters;
            let data = {
                startTime: filters['date'](this.searchObj.startDate, 'YYYY-MM-DD HH:mm:ss'),
                endTime: filters['date'](this.searchObj.endDate, 'YYYY-MM-DD HH:mm:ss')
            };
            this.$emit('getTime', data);
        }
    }
};
</script>
<style lang="scss">
.date-group {
    .el-radio[button] {
        padding: 2px;
    }
    .el-radio:not(.is-bordered) .el-radio__input.is-checked + .el-radio__label {
        color: #fff;
    }
    .el-range-editor--mini.el-input__inner {
        height: 24px;
        width: 200px;
        position: relative;
        top: 1px;
    }
    .el-range-editor--mini .el-range__icon,
    .el-range-editor--mini .el-range__close-icon {
        line-height: 16px;
    }
    .el-date-editor .el-range-separator {
        width: 20px;
        line-height: 16px;
    }
    .el-date-editor .el-range__close-icon {
        display: none;
    }
}
</style>
