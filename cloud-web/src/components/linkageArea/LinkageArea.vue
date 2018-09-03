<template>
    <div class="area-select">
        <div class="area-item" :style="extendStyle">
            <el-select v-model="areaInfo.province" clearable @change="changeArea(1)" :size="size" :placeholder="$t('basicInfo.provinceSel')">
                <el-option v-for="(item, key) in provinceData" :key="key" :label="key" :value="key">
                </el-option>
            </el-select>
        </div>
        <div class="area-item" :style="extendStyle">
            <el-select v-model="areaInfo.city" clearable @change="changeArea(2)" :size="size" :placeholder="$t('basicInfo.citySel')">
                <el-option v-for="(item, key) in cityData" :key="key" :label="key" :value="key">
                </el-option>
            </el-select>
        </div>
        <div class="area-item" :style="extendStyle">
            <el-select v-model="areaInfo.area" clearable @change="changeArea(3)" :size="size" :placeholder="$t('basicInfo.areaSel')">
                <el-option v-for="item in areaData" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
import areaData from '@/assets/area.json';
export default {
    data() {
        let {province = '', city = '', area = ''} = this.originData;
        return {
            province: '',
            provinceData: areaData,
            city: '',
            area: '',
            areaInfo: {province, city, area}
        };
    },
    props: {
        extendStyle: {
            type: Object
        },
        originData: {
            type: Object
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    computed: {
        cityData() {
            for (let k in areaData) {
                if (k === this.areaInfo.province) {
                    return areaData[k];
                }
            }
            return '';
        },
        areaData() {
            for (let k in this.cityData) {
                if (k === this.areaInfo.city) {
                    return this.cityData[k];
                }
            }
            return '';
        }
    },
    methods: {
        changeArea(type) {
            switch (type) {
                case 1:
                    this.areaInfo.city = '';
                    this.areaInfo.area = '';
                    break;
                case 2:
                    this.areaInfo.area = '';
                    break;
                case 3:
                    break;
            }
            // let allData = {
            //     province: this.areaInfo.province,
            //     city: this.areaInfo.city,
            //     area: this.areaInfo.area,
            // };
            this.$emit('select', this.areaInfo);
        }
    }
};
</script>

<style lang="scss" scoped>
.area-select {
    display: flex;
    line-height: 1;
}
.area-item {
    flex: 1;
    margin-right: 10px;
    &:last-child {
        margin-right: 0;
    }
}
</style>