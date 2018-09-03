<template>
    <div class="createDisc">
        <!-- 计费方式 -->
        <div class="billMethod backWhite mb10">
            <el-row>
                <el-col :span="3">
                    <span class="font14 ml20 mr30">
                        <i class="iconfont font16 icon-jifeifangshi mr5"></i>
                        计费方式
                    </span>
                </el-col>
                <el-col :span="20">
                    <el-button size="small" type="primary">包年包月</el-button>
                    <el-button size="small" type="info">按量付费</el-button>
                    <i class="ml10 font16 iconfont icon-wenhao"></i>
                </el-col>
            </el-row>
        </div>
        <!-- 地域 -->
        <div class="region backWhite mb10">
            <el-row>
                <el-col :span="3">
                    <span class="font14 ml20 mr30">
                        <i class="iconfont font16 icon-quyu mr5"></i>
                        地域
                    </span>
                </el-col>
                <el-col :span="20">
                    <div class="clearFLoat">
                        <div class="place mr10">
                            <p><el-button class="selPlace" size="small" type="primary">北京1</el-button></p> 
                            <el-select class="selPlace" v-model="value" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="place mr10">
                            <p><el-button class="selPlace" disabled size="small">北京1</el-button></p> 
                            <el-select class="selPlace" disabled v-model="value" size="small" placeholder="暂不可用">
                            </el-select>
                        </div>
                    </div>
                    <div class="font12 mt10 color999">不同区域云产品之间内网不互通；选择最靠近您客户的区域，可降低访问时延、提高下载速度</div>
                </el-col>
            </el-row>
        </div>
        <!-- 云盘名称 -->
        <div class="diskName backWhite mb10">
            <el-row>
                <el-col :span="3">
                    <span class="font14 ml20 mr30">
                        <i class="iconfont font16 icon-head_file_people mr5"></i>
                        云盘名称
                    </span>
                </el-col>
                <el-col :span="4"><el-input size="small" autocomplete="on" placeholder="请输入内容"></el-input></el-col>
            </el-row>
            
        </div>
        <!-- 云盘 -->
        <div class="disk backWhite mb10">
            <el-row>
                <el-col :span="3">
                    <span class="font14 ml20 mr30">
                        <i class="iconfont font16 icon-yunpan mr5"></i>
                        云盘
                    </span>
                </el-col>
                <el-col :span="18">
                    <el-select v-model="diskValue" size="small" placeholder="请选择">
                        <el-option
                            v-for="item in diskData"
                            :key="item.diskValue"
                            :label="item.label"
                            :value="item.diskValue">
                        </el-option>
                    </el-select>
                    <el-popover placement="top" transition="scale-in" title="" width="180" trigger="hover" content="容量范围：20 - 32768">
                        <el-input-number slot="reference" class="ml10 inputNumber" v-model="number" controls-position="right" :step="10" size="small" :min="10" :max="50">
                        </el-input-number>
                    </el-popover>
                    <span class="capacity color999">GB</span>
                    <span>1000 IOPS</span>
                    <span class="ml10 font12 finger-cursor color-primary">用快照创建磁盘</span>
                    <div class="font12 mt10 color999">如何选择高效云盘 / SSD云盘<span class="finger-cursor color-primary">详细说明</span></div>
                </el-col>
            </el-row>
        </div>
        <!-- 申请量 -->
        <div class="quantity backWhite mb10">
            <el-row>
                <el-col :span="3">
                    <span class="font14 ml20 mr30">
                        <i class="iconfont font16 icon-shenqingshuliang mr5"></i>
                        申请量
                    </span>
                </el-col>
                <el-col :span="20">
                    <el-input-number class="inputNumber" v-model="numberApply" label="块" controls-position="right" :step="1" size="small" :min="1" :max="50">
                    
                    </el-input-number>
                    <span class="quantityUnit color999">块</span>
                    <div class="color999 mt10 font12">最多开通250块云盘，已开通0块</div>
                </el-col>
            </el-row>
        </div>
        <!-- 当前配置 -->
        <div class="backWhite">
            <div class="configure mt20 font12">
                <p class="mb10"><span class="color666">当前配置</span></p>
                <el-row :gutter="15">
                    <el-col :span="6">
                        <span class="color999">区域：</span>
                        <span class="">北京1/资源池A</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="color999">云盘名称：</span>
                        <span class="">高效云盘 20GB</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="color999">云盘：</span>
                        <span class="">高效云盘 20GB</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="color999">申请数量：</span>
                        <span class="">{{numberApply}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        
        <!-- 配置费用 -->
        <div class="Cost">
            <div class="pull-left">
                <span class="color999">{{ $t('ecs.changeconfig.cost') }} : </span>
                <span ng-if="!isComputing" style="color:#FF6600;font-size:24px" class="ng-binding ng-scope">¥&nbsp;8,700.00</span>
            </div>
            <div class="pull-right">
                <button type="button" class="mr20 zt-next font12">立即创建</button>
                <button class="btn ng-cancle font12">{{ $t('common.cancel') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
let diskData = [{
    diskValue: 'a',
    label: '资源地A'
}];
export default {
    data() {
        return {
            options: [{
                value: 'a',
                label: '资源地A'
            }],
            value: '',
            diskValue: '',
            diskData,
            number: 10,
            numberApply: 1
        };
    }
};
</script>

<style scoped lang="scss">
.createDisc{
    background-color: #F0F2F5;
    padding: 15px 20px;
    .region{
        .clearFLoat::after{
            content: '';
            display: block;
            clear: both;
        }
        .place{
            float: left;
        }
        p{
            margin: 0;
        }
        .selPlace{
            width: 150px;
        }
    }
    .configure{
        padding: 20px;
        background-color: #F1F6F9;
        margin: 20px;
        margin-bottom: 60px;
    }
    .disk{
        .capacity{
            position: relative;
            left: -55px;
        }
    }
    .quantityUnit{
        position: relative;
        left: -50px;
    }
    .inputNumber{
        width: 23%;
        text-align: left !important;
    }
}
.Cost {
    position: fixed;
    width: auto;
    bottom: 0;
    left: 300px;
    right: 0;
    padding: 20px 40px;
    box-shadow: 0 -3px 3px #ebecec;
    background-color: #fff;
    z-index: 90;
    button {
        width: 120px;
        height: 36px;
        box-sizing: border-box;
    }
    button:first-child {
        border: 0;
        margin-right: 30px;
        color: #fff;
        background: #ff8a00;
    }
    button:last-child {
        color: #333;
    }
}
.backWhite{
    background-color: #ffffff;
    padding: 15px;
}
</style>


