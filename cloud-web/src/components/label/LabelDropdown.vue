<template>
    <!-- 标签下拉列表选择组件 -->
    <div class="label-dropdown" v-clickoutside="handler" @click="showLabels=!showLabels">
        <el-button type="info"><i class="iconfont icon-biaoqianmen-tianchong font16"></i> 标签</el-button>
        <transition name="dropdown" >
            <div v-if="showLabels" class="dropdown">
                <!-- 全选 -->
                <div class="checkAll"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></div>
                <!-- 可供选项 -->
                <div class="labels">
                    <el-checkbox-group v-if="labelList.length > 0" v-model="selectLabelList" @change="handleCheckedChang">
                        <el-checkbox v-for="label in labelList" :label="label.labelKey" :key="label.labelKey">{{ label.labelKey + ':' + label.labelvalue}}</el-checkbox>
                    </el-checkbox-group>
                    <div v-if="labelList.length === 0" class="nodata text-center">暂无数据</div>
                </div>
                <div class="buttoms">
                    <button type="button"  @click.stop="handleSelect">确定</button>
                    <button type="button"  @click.stop="showLabels=false">取消</button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Clickoutside from '@/utils/clickoutside';
export default {
    name: 'LabelDropdown',
    data() {
        return {
            checkAll: false,
            isIndeterminate: false,
            showLabels: false,
            selectLabelList: [],
            selectLabelListData: [],
        };
    },
    directives: {
        clickoutside: Clickoutside
    },
    props: {
        labelList: {
            type: Array
        },
        selectLabelData: {
            type: Array
        }
    },
    watch: {
        selectLabelData (val) {
            console.warn(val.length);
            if (val.length === 0) {
                this.checkAll = false;
            }
            this.bindLabelConvert(val);
            // this.selectLabelList = val;
        }
    },
    mounted() {
        this.bindLabelConvert(this.selectLabelData);
        // this.selectLabelList = this.selectLabelData;
    },
    methods: {
        // 点击确定按钮回调事件
        handleSelect() {
            let confirmData = [];
            for (let check in this.selectLabelList) {
                let data = this.labelList.filter(
                    item => item.labelKey === this.selectLabelList[check]
                );
                confirmData.push(data[0]);
            }
            this.$emit('select', confirmData);
            this.showLabels = false;
        },
        // 点击其他区域关闭选择框
        handler() {
            this.showLabels = false;
        },
        // 全选事件
        handleCheckAllChange(val) {
            if (val) {
                this.bindLabelConvert (this.labelList);
            } else{
                this.selectLabelList = [];
            }
            this.isIndeterminate = false;
            console.log('selectLabelList', this.selectLabelList);
        },
        // 单个选中回调事件
        handleCheckedChang(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.labelList.length;
        },
        // 绑定值转化
        bindLabelConvert (data) {
            this.selectLabelList = [];
            if(!data){
                return;
            }
            for(let key in data) {
                this.selectLabelList.push(data[key].labelKey);
            }
        },
        deepClone (obj) {
            let objClone = Array.isArray(obj) ? [] : {};
            if (obj && typeof obj === 'object') {
                for (let key in obj) {
                    if(obj.hasOwnProperty(key)) {
                        //判断ojb子元素是否为对象，如果是，递归复制
                        if(obj[key] && typeof obj[key] === 'object') {
                            objClone[key] = this.deepClone(obj[key]);
                        } else {
                            //如果不是，简单复制
                            objClone[key] = obj[key];
                        }
                    }
                }
            }
            return objClone;
        } 
    }
};
</script>
<style scoped lang="scss">
.label-dropdown {
    position: relative;
    display: inline-block;
    white-space: nowrap;
    height: 32px;
    line-height: 1;
    margin-left: 10px;
    .dropdown {
        width: 240px;
        position: absolute;
        z-index: 1000;
        top: 32px;
        background: #fff;
        border: 1px solid #e1e1e1;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        background-clip: padding-box;
        .checkAll {
            border-bottom: 1px solid #e1e1e1;
            label {
                padding: 10px 20px;
                display: block;
            }
        }
        .labels {
            max-height: 200px;
            overflow-y: auto;
            .el-checkbox-group {
                .el-checkbox {
                    display: block;
                    border-bottom: 1px solid #e1e1e1;
                    padding: 10px 20px;
                    margin-left: 0px;
                    &:hover {
                        background: #fafafa;
                    }
                }
            }
            .nodata {
                border-bottom: 1px solid #e1e1e1;
                padding: 10px 20px;
            }
        }
        .buttoms {
            padding: 10px 20px;
            button {
                display: inline-block;
                width: 50%;
                background: #fff;
                border: none;
                color: #0d7ef2;
                text-align: center;
            }
        }
    }
}
</style>
