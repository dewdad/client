<template>
    <div class="zt-card">
        <dt>
            <slot name="icon"></slot>
        </dt>
        <dd>
            <div class="zt-card__content">
                <slot name="content"></slot>
            </div>
            <div class="zt-card__right">
                <slot name="right"></slot>
            </div>
        </dd>
    </div>
</template>
<script>
export default {
    name: 'ZtCard',
    data() {
        return {};
    }
};
</script>
<style scoped lang="scss">
.zt-card {
    display: flex;
    width: 100%;
    padding: 27px 30px;
    border: 1px solid #d1d5de !important;
    align-items: center;
    dt {
        font-size: 32px;
    }
    dd {
        flex: 1;
        display: flex;
        align-items: center;
        .zt-card__content {
            flex: 1;
            padding: 0px 20px;
        }
        .zt-card__right {
            font-size: 12px;
            // border-left: 1px solid #e4e5e9;
        }
    }
    &:hover {
        box-shadow: 0 0 10px 0 rgba(80, 90, 109, 0.16);
    }
}
</style>
