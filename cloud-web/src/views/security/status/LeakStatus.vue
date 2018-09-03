<template>
    <span :class="klass">{{text}}</span>
</template>

<script>
import {STATUS_LIST} from '@/constants/dicts/security.js';

export default {
    props: {
        data: String
    },
    computed: {
        text() {
            let data = STATUS_LIST.find(e => e.value === this.data);
            return data && data.label || '';
        },
        klass() {
            let data = this.data;
            if (data === '1') {
                return 'font12 color-warning';
            } else if (data === '0') {
                return 'font12 color-danger';
            }else if (data === '3') {
                return 'font12 color-success';
            }
            return 'font12';
        }
    }
};
</script>

<style>
</style>
