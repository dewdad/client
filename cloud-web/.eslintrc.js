module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential'
        // '@vue/standard'
    ],
    // 对任何未声明的变量引用引起一个警告过滤
    globals: {
        API_URL: true,
        AREA_CITY: true,
        ZT_ECS_APPLY_MAX: true,
        ZT_ECS_DATA_DISC_AMOUNT_MAX: true,
        ZT_ECS_SYS_DISC_SIZE_MAX: true,
        ZT_ECS_LABEL_MAX: true,
        $log: true,
        $t: true //国际化
    },
    rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        // 禁止使用分号结尾
        semi: [2, 'always'],
        // 强制使用单引号或反勾号
        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: true
            }
        ],
        // 4 个空格缩进
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ],
        'no-unused-vars': ['error', {args: 'none'}],
        'no-empty': 'off',
        // 不充许多个空格
        'no-multi-spaces': 'error',
        // 要求中缀操作符周围有空格
        'space-infix-ops': 'error',
        'vue/prop-name-casing': ['error', 'camelCase|snake_case']
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
