<template>
  <span class="zt-timer" v-if="isShow">
    {{data}} <slot></slot>
  </span>
</template>
<script>
export default {
    name: 'zt-timer',
    props: {
        stop: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number
        },
        mode: {
            type: String,
            default: 'minus'
        },
        limit: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isDestroyed: false,
            data: this.value
        };
    },
    created() {
        this.init();
    },
    destroyed() {
        this.isDestroyed = true;
    },
    methods: {
        init() {
            this.setValue();
        },
        start() {
            this.setValue();
        },
        setValue() {
            if (this.isDestroyed) return;

            switch (this.mode) {
                case 'plus':
                    if (!this.stop && this.data < this.limit) {
                        this.data++;
                        setTimeout(() => {
                            this.setValue();
                        }, 1000);
                    }
                    break;
                case 'minus':
                    if (!this.stop && this.data > this.limit) {
                        this.data--;
                        setTimeout(() => {
                            this.setValue();
                        }, 1000);
                    }
                    break;
            }
        }
    },
    computed: {
        isShow() {
            return this.data >= 0;
        }
    },
    watch: {
        stop(value, oldValue) {
            if (value === oldValue) return;
            if (!value) {
                this.start();
            }
        },
        data(value, oldValue) {
            if (value === oldValue) return;
            this.$emit('input', value);
            if (value === this.limit && this.mode === 'minus') {
                this.$emit('end');
            }
            if (value === this.limit && this.mode === 'plus') {
                this.$emit('end');
            }
        }
    }
};
</script>
