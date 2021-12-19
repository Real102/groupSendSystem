module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/essential', '@vue/standard'],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-tabs': 'off', // 不使用tabs
		indent: 'off', // 缩进，交给prettier了
		'space-before-function-paren': 'off', // 函数括号前是否要空格
		'no-unused-vars': ['warn', { ignoreRestSiblings: true /* 解构剩余变量时不检查 */ }], // 定义了就得使用
		'no-var': 'warn', // 不适用var
		'prefer-const': ['warn', { destructuring: 'all' }], // 是否一定要用const
		'no-empty': 'warn'
	},
	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true
			}
		}
	]
}
