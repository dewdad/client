<template>
    <span :class="data === '0' ? 'color-danger' : 'color-success'">{{data.online === '0' ? '离线' : '在线'}}</span>
</template>

<script>
export default {
    props: {
        data: String
    }
};
</script>
