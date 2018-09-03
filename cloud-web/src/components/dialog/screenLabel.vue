<template>
    <div class="screenLabel">
        <!-- 全选 -->
        <div class="allSel">
            <el-checkbox class="ml20" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <!-- 标签列表 -->
        <div class="mt10">
            <div class="mb10 ml20">
                <el-checkbox-group v-model="checkedLabel" v-for="edit in screenData"  @change="handleCheckedCitiesChange" :key="edit.key">
                    <el-checkbox class="mb10"  :label="edit.key" >{{edit.key}}:{{edit.value}}</el-checkbox>
                </el-checkbox-group> 
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class="selBtn">
            <span class="mr30 finger-cursor" @click="sureScreenFn">确定</span>
            <span class="finger-cursor" @click="canselScreenFn">取消</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            checkAll: false,
            checkedScreen: ['上海', '北京'],
            isIndeterminate: true
        };
    },
    props: {
        screenData: {
            type: Array
        },
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkedCities = val ? this.screenData : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.screenData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.screenData.length;
        }
    }
};
</script>

<style scoped lang="scss">
    .screenLabel{
        position: absolute;
        z-index: 999;
        background-color: #ffffff;
        min-width: 225px;
        width: 240px;
        border: 1px solid #e1e1e1;
        -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
        box-shadow: 0 6px 12px rgba(0,0,0,.175);
        .allSel{
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #e6e6e6;
        }
        .selBtn{
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #2B65C5;
            border-top: 1px solid #e6e6e6;
        }
    }
</style>
