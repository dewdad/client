<template>
    <div class="check-rules">
        <ul class="list-unstyled">
            <li v-for="(item, key) in result" :key="key">
                <span>
                    <i :class="{'iconfont icon-cross': !item.checked, 'iconfont icon-Correct': item.checked}"></i>
                    {{oldRules[key].tipsMessage||oldRules[key].message}}
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import {cloneDeep} from '@/utils/utils';

export default {
    name: 'CheckRules',
    data() {
        return {
            validateResult: [],
        };
    },
    props: {
        value: String,
        rules: Array
    },
    computed: {
        newRules() {
            return this.rules.map((e, i) => {
                let o = cloneDeep(e);
                o.message = i;
                return o;
            });
        },
        showRules() {
            return this.newRules.filter(e => e.show).map(e => {
                let o = cloneDeep(e);
                delete o.trigger;
                return o;
            });
        },
        oldRules() {
            return this.rules.filter(e => e.show);
        },
        result() {
            if (!this.value) {
                return this.showRules;
            }
            let showRules = cloneDeep(this.showRules);
            $log(this.validateResult);
            return showRules.map(e => {
                e.checked = !this.validateResult.find(i => {
                    return i.message === e.message;
                });
                return e;
            });
        }
    },
    watch: {
        value: function(newval, oldval) {
            this.validate(newval);
        }
    },
    methods: {
        validate(value) {
            this.validator.validate(
                {
                    rules: value
                },
                {first: false},
                (errors, invalidFields) => {
                    this.validateResult = invalidFields && invalidFields.rules || [];
                }
            );
        },
        init() {
            let descriptor = {};
            descriptor.rules = this.showRules;
            $log(this.showRules);
            this.validator = new AsyncValidator(descriptor);
            this.validate(this.value);
        }
    },
    created() {
        this.init();
    }
};
</script>
