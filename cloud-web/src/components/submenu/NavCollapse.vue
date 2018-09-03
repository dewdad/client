<template>
    <div class="viewFramework-product-navbar-collapse">
        <div class="product-navbar-collapse-inner" @click="collapse">
            <div class="product-navbar-collapse-bg"></div>
            <div class="product-navbar-collapse" >
                <span class="iconfont icon-collapse-left  icon-weibiaoti26"></span>
                <span class="iconfont icon-collapse-right icon-shousuo"></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NavCollapse',
    data() {
        return {};
    },
    methods: {
        collapse() {
            this.$store.commit('SET_NAV_COLLAPSE');
        }
    }
};
</script>
<style lang="scss">
.viewFramework-product-navbar-collapse {
    position: absolute;
    right: -50px;
    top: 50%;
    margin-top:-50px;
    width: 20px;
    height: 50px;
    z-index: 3;
    &:hover {
        .product-navbar-collapse-bg {
            border-left-width: 20px;
        }
        .product-navbar-collapse {
            left: 0px;
        }
    }
    
}
.left {
    .viewFramework-product-navbar-collapse {
        right: -20px;
    }
}
.is-open .viewFramework-product-navbar-collapse {
    left: 130px;
    &:hover {
        .product-navbar-collapse-bg {
            border-right-width: 20px;
        }
        .product-navbar-collapse {
            right: 0px;
        }
    }
}
.viewFramework-product-navbar-collapse .product-navbar-collapse-inner {
    top: -50%;
    position: relative;
    overflow: hidden;
}

.viewFramework-product-navbar-collapse .product-navbar-collapse-bg {
    width: 0;
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    border-bottom: 9px solid transparent;
    border-left: 13px solid #d9dee4;
    border-top: 9px solid transparent;
    transition: all 0.1s ease, 0.1s ease;
    &:hover {
        border-left: 20px;
    }
}

.is-open .viewFramework-product-navbar-collapse .product-navbar-collapse-bg {
    right: 0;
    left: auto;
    border-bottom: 9px solid transparent;
    border-right: 13px solid #d9dee4;
    border-top: 9px solid transparent;
    border-left: 0px solid transparent;
}

.viewFramework-product-navbar-collapse .product-navbar-collapse {
    height: 50px;
    position: relative;
    left: -7px;
    text-align: center;
    cursor: pointer;
    transition: all 0.1s ease, 0.1s ease;
}

.is-open .viewFramework-product-navbar-collapse .product-navbar-collapse {
    right: -7px;
    left: auto;
}



.viewFramework-product-navbar-collapse .icon-collapse-left {
    display: none;
}

.is-open .viewFramework-product-navbar-collapse .icon-collapse-left {
    display: inline;
}

.is-open .viewFramework-product-navbar-collapse .icon-collapse-right {
    display: none;
}

.is-open .viewFramework-product-navbar-collapse .product-navbar-collapse>span {
    color: #333;
}

.viewFramework-product-navbar-collapse .product-navbar-collapse>span {
    font-size: 15px;
    line-height: 48px;
    vertical-align: text-top;
}

</style>
