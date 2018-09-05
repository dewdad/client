<template>
    <div class="zt-table">
        <!-- 筛选操作 -->
        <search-box v-if="search" :fields="searchCondition" @select="handleSearch"></search-box>
        <el-table class="data-list" @filter-change="filterHandler" @cell-mouse-enter="cellMouseEnter" v-loading="loading" :data="dataList" header-row-class-name="data-list" style="width: 100%">
            <slot name="default"></slot>
        </el-table>
        <div class="pagination">
            <el-pagination background :current-page="paging.pageIndex" @current-change="handleCurrentChange" :page-size="paging.limit" layout="total, prev, pager, next" :total="paging.totalItems">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import searchBox from '@/components/search/SearchBox';
export default {
    name: 'ZtTable',
    data() {
        return {
            inlineForm: {
                field: '',
                value: ''
            },
            currentPage: 1
        };
    },
    components: {
        searchBox
    },
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        search: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array
        },
        searchCondition: {
            type: Array
        },
        paging: {
            type: Object,
            default: () => {
                return {
                    pageIndex: 1,
                    limit: 10,
                    totalItems: 0
                };
            }
        },
        cellMouseEnter: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        dataList: function() {
            return this.data;
        }
    },
    created() {

    },
    methods: {
        handleCurrentChange(page) {
            this.currentPage = page;
            this.doSearch();
        },
        handleSearch(params) {
            this.inlineForm.field = params.selValue.field;
            this.inlineForm.value = params.selInputValue;
            this.doSearch();
        },
        doSearch() {
            let data = {
                pageIndex: this.currentPage,
                limit: this.paging.limit,
                fileds: {
                    [this.inlineForm.field]: this.inlineForm.value
                }
            };
            this.$emit('search', data);
        },
        // 状态筛选
        filterHandler(filters) {
            let values = Object.values(filters);
            let value = values[0][0];
            this.$emit('filterVal', value);
        }
    }
};
</script>
<style scoped>
</style>
