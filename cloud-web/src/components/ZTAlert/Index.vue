 <template>
    <div class="zt-alert">

        <div class="zt-alert__content">
            <div class="zt-alert__title">
                <span class="zt-alert__icon zt-icon-success is-big">
                    <i :class="'iconfont ' + icon"></i>
                </span>
                <span> {{title}}</span>
            </div>
            <p v-if="hasDesc" class="zt-alert__description">
                <slot name="description"></slot>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {};
    },
    props: {
        icon: String,
        title: String,
        description: {
            type: String,
            default: ''
        }
    },
    computed: {
        hasDesc: function() {
            return this.$slots.description ? true : false;
        }
    }
};
</script>
 <style scoped lang="scss">
.zt-alert {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
    position: relative;
    background-color: transparent;
    overflow: hidden;
    opacity: 1;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
    .zt-alert__title {
        display: flex;
        font-size: 18px;
        line-height: 1;
        align-items: center;
        font-weight: bold;
        .zt-alert__icon.is-big {
            font-size: 30px;
            width: 30px;
            margin-right: 10px;
        }
    }
    .zt-alert__content {
    }
    .zt-alert__description {
        font-size: 12px;
        line-height: 18px;
        padding-left: 40px;
    }
}
</style>
 