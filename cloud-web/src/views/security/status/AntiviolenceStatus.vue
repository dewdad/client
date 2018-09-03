<template>
    <span :class="data === '0' ? 'color-danger' : 'color-success'">{{getName(data)}}</span>
</template>

<script>
export default {
    props: {
        data: String
    },
    data() {
        return {
            label: {'0': '已封停', '1': '已解封', '2': '误报'}
        };
    },
    methods: {
        getName(val) {
            return this.label[val] || val;
        }
    }
};
</script>
