1.Echart y轴内容太多的解决办法：https://blog.csdn.net/zm_miner/article/details/78321254
（1）对文本进行倾斜
在xAxis.axisLabe中修改rotate的值
  xAxis: {
            data: ["衬衫11111","羊毛二二","雪纺衫111","裤子111","高跟鞋11","袜子111"],//x轴中的数据
            name:"123",//坐标轴名称。
            nameLocation:'end',//坐标轴名称显示位置。
            axisLabel : {//坐标轴刻度标签的相关设置。
                interval:0,
                rotate:"45"
            }
        },
interval

坐标轴刻度标签的显示间隔(在类目轴中有效哦)，默认会采用标签不重叠的方式显示标签（也就是默认会将部分文字显示不全）
可以设置为0强制显示所有标签，如果设置为1，表示隔一个标签显示一个标签，如果为3，表示隔3个标签显示一个标签，以此类推

一开始我没设置 因为标签文本过长的原因他就自动不显示全部 ，        
  被遮挡住就让grid 组件离容器向上移动 把grid中的bottom的值调大一些
   grid:{//直角坐标系内绘图网格
              show:true,//是否显示直角坐标系网格。[ default: false ]
              left:"20%",//grid 组件离容器左侧的距离。
              right:"30px",
              borderColor:"#c45455",//网格的边框颜色
              bottom:"20%" //
          },       
（2）.换行显示
  在xAxis.axisLabel中 使用formatter回调函数实现换行
      axisLabel : {//坐标轴刻度标签的相关设置。
                  formatter : function(params){
                     var newParamsName = "";// 最终拼接成的字符串
                              var paramsNameNumber = params.length;// 实际标签的个数
                              var provideNumber = 4;// 每行能显示的字的个数
                              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                              /**
                               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                               */
                              // 条件等同于rowNumber>1
                              if (paramsNameNumber > provideNumber) {
                                  /** 循环每一行,p表示行 */
                                  for (var p = 0; p < rowNumber; p++) {
                                      var tempStr = "";// 表示每一次截取的字符串
                                      var start = p * provideNumber;// 开始截取的位置
                                      var end = start + provideNumber;// 结束截取的位置
                                      // 此处特殊处理最后一行的索引值
                                      if (p == rowNumber - 1) {
                                          // 最后一次不换行
                                          tempStr = params.substring(start, paramsNameNumber);
                                      } else {
                                          // 每一次拼接字符串并换行
                                          tempStr = params.substring(start, end) + "\n";
                                      }
                                      newParamsName += tempStr;// 最终拼成的字符串
                                  }
  
                              } else {
                                  // 将旧标签的值赋给新标签
                                  newParamsName = params;
                              }
                              //将最终的字符串返回
                              return newParamsName
                  }
  
(3).文字竖直显示
              同样和换行一个道理,只是这个是单个文字换行
              在xAxis.axisLabel中 使用formatter回调函数实现换行
              axisLabel: {  
                                             interval: 0,  
                                             formatter:function(value)  
                                             {  
                                                 return value.split("").join("\n");  
                                             }  
                                         }    
（4）.隔一个换行
在xAxis.axisLabel中 使用formatter回调函数实现换行
axisLabel : {//坐标轴刻度标签的相关设置。
                clickable:true,//并给图表添加单击事件  根据返回值判断点击的是哪里
                interval : 0,
                formatter : function(params,index){
                    if (index % 2 != 0) {
                        return '\n\n' + params;
                    }
                    else {
                        return params;
                    }
                }

            }                                    
2.<p>高德地图参考网址：<a href="https://elemefe.github.io/vue-amap/#/zh-cn/introduction/install">https://elemefe.github.io/vue-amap/#/zh-cn/introduction/install</a></p>
<p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://travis-ci.org/PanJiaChen/vue-element-admin" rel="nofollow">
    <img src="https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/releases">
    <img src="https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg" alt="GitHub release">
  </a>
  <a href="https://gitter.im/vue-element-admin/discuss">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="gitter">
  </a>
  <a href="https://panjiachen.github.io/vue-element-admin-site/donate">
    <img src="https://img.shields.io/badge/%24-donate-ff69b4.svg" alt="donate">
  </a>
</p>

English | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Spanish](./README.es.md)

## Introduction

[vue-element-admin](https://panjiachen.github.io/vue-element-admin) is a production-ready front-end solution for admin interfaces. It is based on [vue](https://github.com/vuejs/vue) and uses the UI Toolkit [element-ui](https://github.com/ElemeFE/element).

[vue-element-admin](https://panjiachen.github.io/vue-element-admin) is based on the newest development stack of vue and it has a built-in i18n solution, typical templates for enterprise applications, and lots of awesome features. It helps you build large and complex Single-Page Applications. I believe whatever your needs are, this project will help you.

- [Preview](https://panjiachen.github.io/vue-element-admin)

- [Documentation](https://panjiachen.github.io/vue-element-admin-site/)

- [Gitter](https://gitter.im/vue-element-admin/discuss)

- [Donate](https://panjiachen.github.io/vue-element-admin-site/donate/)

- [Wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)

- [Gitee](https://panjiachen.gitee.io/vue-element-admin/) 国内用户可访问该地址在线预览

- Base template recommends using: [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)
- Desktop: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)
- Typescript: [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))
- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

**After the `v4.1.0+` version, the default master branch will not support i18n. Please use [i18n Branch](https://github.com/PanJiaChen/vue-element-admin/tree/i18n), it will keep up with the master update**

**The current version is `v4.0+` build on `vue-cli`. If you find a problem, please put [issue](https://github.com/PanJiaChen/vue-element-admin/issues/new). If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-element-admin/tree/tag/3.11.0), it does not rely on `vue-cli`**

**This project does not support low version browsers (e.g. IE). Please add polyfill by yourself.**

## Preparation

You need to install [node](https://nodejs.org/) and [git](https://git-scm.com/) locally. The project is based on [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [axios](https://github.com/axios/axios) and [element-ui](https://github.com/ElemeFE/element), all request data is simulated using [Mock.js](https://github.com/nuysoft/Mock).
Understanding and learning this knowledge in advance will greatly help the use of this project.

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/PanJiaChen/vue-element-admin/tree/CodeSandbox)

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## Sponsors

Become a sponsor and get your logo on our README on GitHub with a link to your site. [[Become a sponsor]](https://www.patreon.com/panjiachen)

### Akveo
<a href="https://store.akveo.com/products/vue-java-admin-dashboard-spring?utm_campaign=akveo_store-Vue-Vue_demo%2Fgithub&utm_source=vue_admin&utm_medium=referral&utm_content=github_banner"><img width="500px" src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin-site/master/docs/.vuepress/public/images/vue-java-banner.png" /></a><p>Java backend integration</p>

### Flatlogic

<a href="https://flatlogic.com/admin-dashboards?from=vue-element-admin"><img width="150px" src="https://wpimg.wallstcn.com/9c0b719b-5551-4c1e-b776-63994632d94a.png" /></a><p>Admin Dashboard Templates made with Vue, React and Angular.</p>

## Features

```
- Login / Logout

- Permission Authentication
  - Page permission
  - Directive permission
  - Permission configuration page
  - Two-step login

- Multi-environment build
  - Develop (dev)
  - sit
  - Stage Test (stage)
  - Production (prod)

- Global Features
  - I18n
  - Multiple dynamic themes
  - Dynamic sidebar (supports multi-level routing)
  - Dynamic breadcrumb
  - Tags-view (Tab page Support right-click operation)
  - Svg Sprite
  - Mock data
  - Screenfull
  - Responsive Sidebar

- Editor
  - Rich Text Editor
  - Markdown Editor
  - JSON Editor

- Excel
  - Export Excel
  - Upload Excel
  - Visualization Excel
  - Export zip

- Table
  - Dynamic Table
  - Drag And Drop Table
  - Inline Edit Table

- Error Page
  - 401
  - 404

- Components
  - Avatar Upload
  - Back To Top
  - Drag Dialog
  - Drag Select
  - Drag Kanban
  - Drag List
  - SplitPane
  - Dropzone
  - Sticky
  - CountTo

- Advanced Example
- Error Log
- Dashboard
- Guide Page
- ECharts
- Clipboard
- Markdown to html
```

## Getting started

```bash
# clone the project
git clone -b i18n git@github.com:PanJiaChen/vue-element-admin.git

# enter the project directory
cd vue-element-admin

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9527

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/PanJiaChen/vue-element-admin/releases).

## Online Demo

[Preview](https://panjiachen.github.io/vue-element-admin)

## Donate

If you find this project useful, you can buy author a glass of juice :tropical_drink:

![donate](https://wpimg.wallstcn.com/bd273f0d-83a0-4ef2-92e1-9ac8ed3746b9.png)

[Paypal Me](https://www.paypal.me/panfree23)

[Buy me a coffee](https://www.buymeacoffee.com/Pan)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2017-present PanJiaChen

7.移动端振动
（1）https://cnlwzrf.blog.csdn.net/article/details/82888077?spm=1001.2101.3001.6650.7&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-82888077-blog-109054706.235%5Ev28%5Epc_relevant_default_base1&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-82888077-blog-109054706.235%5Ev28%5Epc_relevant_default_base1&utm_relevant_index=10
（2）https://blog.csdn.net/qq_26642611/article/details/109054706
8.箭头css设置：https://www.jb51.net/css/529202.html
9.自定义滚动条：(1)https://baijiahao.baidu.com/s?id=1721537879627492922&wfr=spider&for=pc
(2)https://blog.csdn.net/zh_rey/article/details/72473284?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-72473284-blog-125845255.235%5Ev32%5Epc_relevant_increate_t0_download_v2_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-72473284-blog-125845255.235%5Ev32%5Epc_relevant_increate_t0_download_v2_base&utm_relevant_index=2
（3）滚动条图解：http://www.taodudu.cc/news/show-4548472.html