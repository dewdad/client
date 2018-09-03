<template>
    <span :class="data === '0' ? 'color-danger' : 'color-success'">{{getProprotectSwitch(data)}}</span>
</template>

<script>
import {PROTECT_SWITCH} from '@/constants/dicts/security.js';
export default {
    props: {
        data: String
    },
    data() {
        return {
            filters: PROTECT_SWITCH
        };
    },
    methods: {
        getProprotectSwitch(value) {
            let item = this.filters.find(e => e.value === value);
            return item ? item.text : '保护中';
        }
    }
};
</script>
