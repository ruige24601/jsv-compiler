在 *.js* 文件中使用 vue3 模板语法

# 使用
### 1. 创建vue3项目
```
create-vite-app <your projectname>
```
### 2. 安装依赖包
```
npm i -D jsv-compiler
```
### 3. 配置插件
文件: *vite.config.js*
```js
import {jsvPlugin} from 'jsv-compiler'

export default {
  configureServer: [jsvPlugin]
}
```
### 4. 使用示例
```js
import { reactive } from "vue";

export default {
	name: "App",
	setup() {
		let state = reactive({ 
			title: 'jsv-compiler',
			count: 0 
		});

		function handleClick() {
			state.count++;
		}

		let Title = `<template><h1>hello {{state.title}}</h1></template>`
		
		return (`
			<template>
				<Title />
				<div>{{ state.count }}</div>
				<button v-on:Click="handleClick">点击加1</button>
			</template>
			`)
	},
};
```
### 5. 语法高亮
在vscode中下载插件: jsv
