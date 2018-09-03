<template>
    <el-dialog
        title="编辑标签"
        :visible.sync="isShow"
        width="45%"
        class="editLabelDialog"
        >
        <div class="contentBox font12">
            <!-- 标签盒子 -->
            <div class="labelBox">
                <span class="labelName" v-for="(label, index) in editData" :key="label.labelKey">
                    {{label.labelKey}}:{{label.labelValue}}
                    <i @click="deleteLabel(index)" class="el-icon-close finger-cursor font14 ml20"></i>
                </span>                
            </div>
            <!-- 其他 -->
            <div class="other mt10 mb20">
                注：每个资源最多绑定10个标签，单次操作绑定/解绑标签的数量分别不能超过10个
            </div>
            <!-- 编辑标签 -->
            <div class="edit">
                <span>绑定：</span>
                <div class="existLabel mr10" v-clickoutside="handler">
                    <el-button  @click="existLabelFn" type="info" size="small" :class="{'font12': true, 'colorDisabeld':existLabelState}">已有标签</el-button>
                    <!-- 已有标签筛选 -->
                    <div class="screenLabel"  v-show="existLabelStatus">
                        <!-- 全选 -->
                        <div class="allSel">
                            <el-checkbox class="ml20" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        </div>
                        <!-- 标签列表 -->
                        <div class="mt10">
                            <div class="mb10 ml20">
                                <el-checkbox-group v-model="checkedLabel" v-for="edit in allLabelData" @change="handleCheckedCitiesChange" :key="edit.labelKey">
                                    <el-checkbox class="mb10"  :label="edit.labelKey" >{{edit.labelKey}}:{{edit.labelValue}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <!-- 操作按钮 -->
                        <div class="selBtn">
                            <span class="mr30 finger-cursor" @click="sureScreenFn">确定</span>
                            <span class="finger-cursor" @click="canselScreenFn">取消</span>
                        </div>
                    </div>
                </div>
                <el-button v-show="newBulid" @click="newBulidFn" type="info" size="small" :class="{'font12': true, 'colorDisabeld':existLabelState}">新建标签</el-button>
                <span v-show="!newBulid">
                    <span class="ml20">键：</span>
                    <input @focus="getfocus" :class="{'nullKey' : nullKeyState}" v-model="keyLabel" type="text">
                    <span class="ml10">值：</span>
                    <input v-model="valueLabel" type="text">
                    <i @click="sureNewBulidFn" class="el-icon-circle-check ml10 mr5 finger-cursor color-primary font18"></i>
                    <i @click="queryNewBulidFn" class="el-icon-circle-close-outline finger-cursor font18"></i>
                </span>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">            
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" @click="finalConfirm">{{ $t('common.ok') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>

import { getLabelsList,saveLabels } from '@/service/ecs/labels.js';

// let labelData = [
//     {key: 'dded', value:'fddff' },
//     {key: 'ddd', value:'fff2' },
//     {key: '2ddd', value:'f3ff' },
// ];
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            newBulid: true,
            keyLabel: '', // 新建标签 => 键
            valueLabel: '', // 新建标签 => 值
            labelData:[], // 确认已选中标签
            checkedLabel: [], // 筛选标签勾中选项
            editData: [], 
            checkAll: false, // 全选
            isIndeterminate: true,
            existLabelStatus: false,
            nullKeyState: false,
            allLabelData:[], // 所有标签
            newBulidData: [], // 新建标签对象
            opType:1,
            rowItem:{},
            paramsObj:{}
        };
    },
    computed: {
        existLabelState() {
            return this.editData.length >= 10;
        }
    },
    watch: {
        isShow(val) {
            if (val) {
                let sanData = JSON.stringify(this.labelData);
                this.editData = JSON.parse(sanData);
                this.getCheckedLabel();
                this.existLabelStatus = false;
                this.newBulid = true;
            } else {
                this.newBulidData = [];
            }
        }
    },
    components:{
    },
    props: {
    },
    methods: {
        //type: 1：ecs ， 2： rds ，3：负载均衡
        //modules：type为为ECS的时候,modules 1:实例， 2：云盘，3：安全组
        show(rowItem,type,modules) {
            this.rowItem = rowItem;           
            this.isShow = true;
            this.paramsObj = { deviceId:rowItem.id, type, modules };

            this.getLabelsAll();
            this.getLabelsSelected(this.paramsObj);

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        hide() {
            this.isShow = false;
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            this.hide();
            this.setting();
        },
        //获取所有标签
        getLabelsAll: function () {
            getLabelsList().then( (data) => {
                console.log('getLabelsAll',data);
                if(data && data.code && data.code === '0000'){
                    let respData = data.result;
                    if( respData && respData.records ){
                        this.allLabelData = respData.records;
                    }
                }
            });
        },

        //查询已选标签
        getLabelsSelected: function (obj) {
            getLabelsList(obj).then( (data ) => {
                console.log('getLabelsSelected',data);
                if(data && data.code && data.code === '0000'){
                    let respData = data.result;
                    if( respData && respData.records ){
                        this.labelData = respData.records;
                    }
                }
            });
        },
        // 已有标签操作
        existLabelFn() {
            this.existLabelStatus = !this.existLabelStatus;
        },
        // 新建标签
        newBulidFn() {
            if(this.existLabelState){
                return;
            }
            this.newBulid = false;
        },
        // 确定添加标签
        sureNewBulidFn() {
            if(!(this.keyLabel === '')) {
                let state = this.editData.filter(
                    item => item.labelKey === this.keyLabel
                ).length === 0 ? true : false;
                if(!state) {
                    return;
                }
                let data = {
                    labelKey: this.keyLabel,
                    labelValue: this.valueLabel
                };
                this.newBulidData.push(data);
                this.editData.push(data);
                this.keyLabel = '';
                this.valueLabel = '';
            } else {
                this.nullKeyState = true;
            }
            if ( this.editData.length >= 10) {
                this.newBulid = true;
            }
        },
        getfocus() {
            this.nullKeyState = false;
        },
        // 取消标签
        queryNewBulidFn() {
            this.keyLabel = '';
            this.valueLabel = '';
            this.newBulid = true;
        },
        // 删除标签
        deleteLabel(index) {
            this.newBulidData = this.newBulidData.filter(
                item => item.labelKey !== this.editData[index].labelKey
            );
            this.editData.splice(index, 1);
            this.getCheckedLabel();
        },
        // 确认筛选
        sureScreenFn() {
            this.editData = [];
            for (let check in this.checkedLabel) {
                let data = this.allLabelData.filter(
                    item => item.labelKey === this.checkedLabel[check]
                );
                this.editData.push(data[0]);
            }
            this.editData = this.editData.concat(this.newBulidData);
            this.existLabelStatus = false;
        },
        // 取消筛选
        canselScreenFn() {
            this.getCheckedLabel();
            this.existLabelStatus = false;
        },
        handleCheckAllChange(val) {
            this.checkedLabel = [];
            if(val && this.allLabelData.length <= 10){
                for (let label in this.allLabelData) {
                    this.checkedLabel.push(this.allLabelData[label].labelKey);
                }
                // this.editData = this.allLabelData;
                // this.getCheckedLabel();
                return;
            } else if (this.allLabelData.length > 10){
                return;
            }
            // this.checkedLabel = [];
            // this.getCheckedLabel();
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.allLabelData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.allLabelData.length;
        },
        // 获取已选中的checkedLabel
        getCheckedLabel() {
            this.checkedLabel = [];
            for (let label in this.editData) {
                this.checkedLabel.push(this.editData[label].labelKey);
            }
        },
        // 最终确认筛选
        finalConfirm() {
            this.labelData = this.editData;
            for (let newBulid in this.newBulidData) {
                this.allLabelData.push(this.newBulidData[newBulid]);
            }
            
            let data = {
                //selectedLabels: 已选标签 例如：[{"key1":"value1"},{"key2":"value2"}]
                selectedLabels: this.labelData,
                ...this.paramsObj
            };

            //提交后台
            saveLabels(data).then(
                res => {
                    console.log('修改信息', res);
                    this.$message.success('操作成功');

                    this.hide();
                    // this.setting();
                    this.resolve(data);
                },
                err => {
                    this.$alert(err, '提示', {
                        type: 'error'
                    });
                });
        },
        handler() {
            this.existLabelStatus = false;
        },
    },
    mounted() {
        let sanData = JSON.stringify(this.labelData);
        this.editData = JSON.parse(sanData);
        this.getCheckedLabel();
    }
};
</script>
<style lang="scss" scoped>
.editLabelDialog{
    .el-dialo {
        position: relative;
    }
    .contentBox{
        padding: 10px;
        .labelBox{
            border: 1px solid #D1D5DE;
            min-height: 200px;
        }
    }
    .labelBox{
        .labelName{
            display: inline-block;
            height: 32px;
            line-height: 32px;
            border: 1px solid #ccc;
            background-color: #F9FAFD;
            margin: 10px 0 0 10px;
            padding: 0 10px;
        }
    }
    .edit{
        position: relative;
        .existLabel{
            display: inline-block;
        }
        input{
            height: 32px;
            border: 1px solid #d1d5de;
            width: 80px;
        }
        input.nullKey{
            border: 1px solid #eb675e;
        }
    }
    .colorDisabeld{
        color: #bbbbbb;
    }
    .screenLabel{
        position: absolute;
        top: 32px;
        z-index: 999;
        background-color: #ffffff;
        left: 36px;
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
}
</style>
