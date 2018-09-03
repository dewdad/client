<template>
    <span>
        <i v-if="type === 'font'" :class="prefix + ' ' + icon"></i>
        <svg v-if="type === 'svg'" class="zticon" aria-hidden="true">
            <use :xlink:href="'#' + icon"></use>
        </svg>
        <span v-if="type === 'progress'" :class="prefix + ' ' + icon">
            <div class="progress ">
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" :style="{width: percent + '%'}">
                    <span class="sr-only">40% Complete (success)</span>
                </div>
            </div>
        </span>
    </span>
</template>
<script>
export default {
    name: 'ZTIcon',
    data() {
        return {};
    },
    props: {
        prefix: {
            type: String,
            default: 'iconfont'
        },
        icon: String,
        type: {
            type: String,
            default: 'font'
        },
        percent: {
            type: Number,
            default: 0
        }
    }
};
</script>
<style scoped lang="scss">
.progress {
    width: 60px;
    height: 10px;
    border-radius: 10px;
    margin-bottom: 0px;
    border: 1px solid inherit;
}

.color-danger {
    .progress {
        border: 1px solid #f40000;
    }
    .progress-bar {
        background-color: #f40000 !important;
    }
}

.color-success {
    .progress {
        border: 1px solid #009900;
    }
    .progress-bar {
        background-color: #009900 !important;
    }
}

.color-progress-info {
    .progress {
        border: 1px solid #898a8a;
    }
    .progress-bar {
        background-color: #898a8a !important;
    }
}

.color-progress-warning {
    .progress {
        border: 1px solid #806b00;
    }
    .progress-bar {
        background-color: #806b00 !important;
    }
}

.color-primary {
    .progress {
        border: 1px solid #0d7ef2;
    }
    .progress-bar {
        background-color: #0d7ef2 !important;
    }
}

.progress-bar-striped,
.progress-striped .progress-bar {
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 75%, transparent 75%, transparent);
    background-size: 10px 10px;
}
</style>
