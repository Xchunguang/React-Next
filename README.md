# React使用Next.js作服务器端渲染



## 内容包含
- 什么是React服务端渲染，为什么
- 解决React SEO
- 是否需要服务端渲染
- 使用Next.js实现React的服务端渲染,基本语法
	- Next.js简介
	- 安装
	- getInitialProps
	- jsx style
	- static静态目录
	- 两种路由方式
	- 自定义Head组件
- 引入Ant design
- 动态导入<a href="https://github.com/zeit/next.js/tree/master/examples/with-dynamic-import">示例</a>
- 静态导出
- 缓存
- Next.js整合dva

## 什么是React服务端渲染，为什么
- 服务端渲染（Server side rendering）,是指通过服务器执行React页面的渲染和生成，并返回给客户端静态的HTML页面。
- 服务端渲染主要优势：
	- SEO
	- 首屏渲染友好
	- 速度相对快
## 解决React SEO
使用React编写出来的程序是单页的应用程序，前段请求会都是一个html模板，对于信息分发类或者公众网站来说致命，SEO无法优化，搜索引擎无法找到网站想要分发出去的东西。使用服务端渲染每一个路径都会返回不同的html，包含不同的head，可以对其进行SEO优化。实际上React更适合制作后台系统，软件服务，无需被搜索引擎抓取，如果非必要，也可以选择使用传统的开发方法。

## 使用Next.js实现React的服务端渲染,基本语法
- Next.js简介：

	他是服务端渲染和静态导出React程序的框架。<a href="https://github.com/zeit/next.js/tree/master">Next.js</a>

	下载演示demo：<a href="https://github.com/Xchunguang/React-Next">github</a>
- 安装
	- npm install next --save
	- package.json中添加script命令
	 
		    "scripts": {
			    "dev": "node .",
			    "build": "next build && next export",
			    "preexport": "npm run build",
			    "export": "next export",
			    "prestart": "npm run export",
			    "start": "serve out"
			  }

	- 创建pages目录
- getInitialProps
	- Next改变了组件的getInitialProps方法，传入了一个上下文对象，这个对象在服务端和客户端时候有不同的属性。因此可以在组件中处理上下文对象。
	
			import React from 'react'
			export default class extends React.Component {
			  static async getInitialProps ({ req }) {
				console.log(req);
			    return req
			      ? { userAgent: req.headers['user-agent'] }
			      : { userAgent: navigator.userAgent }
			  }
			  render () {
			    return <div>
			      show userAgent: {this.props.userAgent}
			    </div>
			  }
			}

	- 另一方面getInitialProps还会被用来获取数据。

			import { Component } from 'react'
			import Head from 'next/head'
			import fetch from 'isomorphic-fetch'
			import Post from '../components/post'
			
			export default class Index extends Component {
			
			  static async getInitialProps () {
			    // fetch list of posts
			    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_page=1')
			    const postList = await response.json()
			    return { postList }
			  }
			  render(){
			      return (
			        <main>
			          <Head>
			            <title>Home page</title>
			          </Head>    
			          <h1>List of posts</h1>		
			          <section>
			            {this.props.postList.map(post => <Post {...post} key={post.id} />)}
			          </section>
			          
			        </main>
			      )
			  }
			  
			}
		
		并且，在加载页面的时候，需要执行完该方法才会执行render，所以有时可能会产生等待。好消息就是在执行导出静态页面时，会执行完所有getInitialProps导出成HTML。

- jsx style

	Next使用的内嵌css是style-jsx提供的，是Next推荐的css声明方法，支持css完整语法，组件内部避免样式污染。

		<style jsx>{`
		  .container{
		  	width:100%;
		  	height:100%;
		  	display:inline-block;
		  	text-align:center;
		  	line-height:100px;
		  }
  		@media (max-width: 600px) {
	        .container {
	          background: blue;
	        }
	      }
		`}</style>
- static静态目录

	使用Next.js提供static静态路径，只需要在项目中创建一个static路径，即可通过/static/***.jpg进行访问：

		<img src='/static/Tulips.jpg' />
- 两种路由方式

	Next.js 提供了两种路由方式：
	- Link组件：
		- 工作流程：
			1. 获取新组件
			2. 如果组件中含有getInitialProps，则执行获取数据，获取失败则渲染_error.js
			3. 渲染新组件
		- 每个顶层组件还会传入一个URL对象，提供了相关方法：
			- pathname:String-当前URL的path部分
			- query：Object-当前URL的查询字符串对象
			- back：回退
			- push(url,as=url):传入URl字符串执行pushState
			- replace(url,as=url):执行replaceState
				
					import Link from 'next/link';

				    <Link prefetch href="/about">
    					<a>About</a>
    				</Link>	
	- Router组件：
	
			import Router from 'next/router'

			export default () => (
			  <div>Click <span onClick={() => Router.push('/about')}>here</span> to read more</div>
			)
		- 监听路由变化：

				Router.onRouteChangeStart = (url) => {
				  console.log('App is changing to: ', url)
				}

		- 取消监听：
		
				Router.onRouteChangeStart = null;

		- 如果路由加载取消了（连续快速点击两个链接），就会触发routeChangeError的回调，传入的err参数中将包含一个cancelled属性，值为true。

				Router.onRouteChangeError = (err, url) => {
				  if (err.cancelled) {
				    console.log(`Route to ${url} was cancelled!`)
				  }
				}

- 自定义Head组件

	Next.js提供了`<Head>` 组件，可以自己定义head中的内容，可以实现SEO优化

		import Head from 'next/head';
		import {Component} from 'react';
		export default class extends Component{	
			  render(){
			  	return (
						<div className='container'>
							<Head>
						      <meta name='viewport1' content='width=device-width, initial-scale=1' />
						      <meta charSet='utf-8' />
						      <link rel='stylesheet' href='/static/antd.min.css' />
						    </Head>
							<p>helloworld</p>
						</div>
					)
			  }
		}

## 引入ant design
- 查看<a href="https://github.com/zeit/next.js/tree/master/examples/with-ant-design">示例</a>
- npm install antd --save
- <Head></Head>中引入css：layout.js
 
	    import Head from 'next/head'
		export default ({ children }) =>
		  <div>
		    <Head>
		      <meta name='viewport' content='width=device-width, initial-scale=1' />
		      <meta charSet='utf-8' />
		      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/2.9.3/antd.min.css' />
		    </Head>
		    <style jsx global>{`
		      body {
		      }
		    `}</style>
		    {children}
		  </div>

- children中组件可直接使用import：

		import { DatePicker } from 'antd';


## 动态导入
- Next.js支持JavaScript的TC39 动态导入建议。借此，您可以动态导入JavaScript模块（包括React组件）并使用它们。您可以将动态导入视为另一种将代码拆分为可管理的块的方法。由于Next.js支持使用SSR进行动态导入，因此您可以使用它做出惊人的事情。
- 详见<a href="https://github.com/zeit/next.js/tree/master#dynamic-import">官网示例</a>
		
		//基本用法
		import dynamic from 'next/dynamic'

		const DynamicComponent = dynamic(import('../components/hello'))
		
		export default () =>
		  <div>
		    <Header />
		    <DynamicComponent />
		    <p>HOME PAGE is here!</p>
		  </div>

## 静态导出
- 这是一种运行你的Next.js应用程序作为独立的静态应用程序没有任何Node.js服务器的方式。导出应用几乎支持Next.js的所有功能，包括动态URL，预取，预加载和动态导入。导出的静态文件每个页面也是单独导出，易于作SEO优化。
- 点击<a href="这是一种运行你的Next.js应用程序作为独立的静态应用程序没有任何Node.js服务器的方式。导出应用几乎支持Next.js的所有功能，包括动态URL，预取，预加载和动态导入。">了解更多</a>
- 创建next.config.js,添加如下代码：
	
		const fetch = require('isomorphic-fetch');
		const path = require('path');
		const glob = require('glob');
		module.exports = {
		  async exportPathMap () {
		    return {
		      '/': { page: '/' },
		      'about':{page:'/about'}
		    }
		  },
		  webpack: (config) => {
		    config.module.rules.push(
		      
		    );
		
		    return config;
		  },
		}
	将项目中页面的路径配置。

- 你的package.json需要有以下命令：

		{
		  "scripts": {
		    "build": "next build && next export"
		  }
		}

- npm run build
- 成功之后再项目目录中会出现一个out文件夹，即为构建的所有静态页面。可以将其放到服务器环境部署。例如：下载解压Tomcat，将out文件夹下的所有文件复制粘贴到tomcat/webpack/ROOT/目录下，运行访问http://localhost:8080 即可运行。
## 缓存
React 的服务端渲染会耗费大量CPU，为了解决此，使用缓存ssr-cache

- 查看<a href="https://github.com/zeit/next.js/blob/master/examples/ssr-caching">实例</a>
- npm install lru-cache --save
- 编辑server.js,添加如下代码：

		const LRUCache = require('lru-cache')

		// This is where we cache our rendered HTML pages
		const ssrCache = new LRUCache({
		  max: 100,
		  maxAge: 1000 * 60 * 60 // 1hour
		})

		// Use the `renderAndCache` utility defined below to serve pages
		server.get('/', (req, res) => {
		renderAndCache(req, res, '/')
		})

		/*
		 * NB: make sure to modify this to take into account anything that should trigger
		 * an immediate page change (e.g a locale stored in req.session)
		 */
		function getCacheKey (req) {
		  return `${req.url}`
		}
		
		function renderAndCache (req, res, pagePath, queryParams) {
		  const key = getCacheKey(req)
		
		  // If we have a page in the cache, let's serve it
		  if (ssrCache.has(key)) {
		    console.log(`CACHE HIT: ${key}`)
		    res.send(ssrCache.get(key))
		    return
		  }
		
		  // If not let's render the page into HTML
		  app.renderToHTML(req, res, pagePath, queryParams)
		    .then((html) => {
		      // Let's cache this page
		      console.log(`CACHE MISS: ${key}`)
		      ssrCache.set(key, html)
		
		      res.send(html)
		    })
		    .catch((err) => {
		      app.renderError(err, req, res, pagePath, queryParams)
		    })
		}


- 多次刷新页面，在node的运行中cmd控制台输出CACHE HIT:key即为从缓存中读取。

		CACHE HIT: /
		CACHE MISS: /post/1
		CACHE HIT: /post/1
		CACHE MISS: /post/2
		CACHE HIT: /post/2

缓存使用的问题：当产生错误页面也会缓存上，并且每次读取均为错误页面，即使编译没有问题也会读取出错误页面。解决：更改server.js，使请求成功的时候才存入缓存，即使页面出错也不会出现之前的问题。代码：修改renderAndCache方法

		function renderAndCache (req, res, pagePath, queryParams) {
		  const key = getCacheKey(req)
		  // 如果在缓存中存在页面，则直接从缓存中读取，目前不完善，不能判断出错
		  if (ssrCache.has(key)) {
		          console.log(`CACHE HIT: ${key}`)
		          res.send(ssrCache.get(key))
		          return    
		  }
		
		  // 如果缓存中没有页面，则直接返回页面，并将页面添加到缓存中
		  app.renderToHTML(req, res, pagePath, queryParams)
		    .then((html) => {
		      // Let's cache this page
		      console.log(`CACHE MISS: ${key}`)
		      //将请求成功的页面添加进缓存
		      if(res.statusCode === 200){
		        ssrCache.set(key, html)
		      }else{
		        ssrCache.del(key);
		      }
		      
		      // console.log(res.statusCode);
		      res.send(html)
		    })
		    .catch((err) => {
		      app.renderError(err, req, res, pagePath, queryParams)
		    })
		}
## Next.js整合dva使用
<a href="https://github.com/dvajs/dva/blob/master/packages/dva-example-nextjs/">官网示例</a>

- npm install babel-plugin-module-resolver --save
- npm install dva-no-router --save
- .babelrc 添加如下：

		"plugins": [
		    ["module-resolver", {
		      "alias": {
		        "dva": "dva-no-router"
		      }
		    }]
		  ]

- index.js:

		import Link from 'next/link';
		import dva from 'dva';
		
		export default function () {
		  const app = dva();
		  app.router(() => {
		    return (
		      <div>
		        Hi,
		        <Link href="/users">Go to /users</Link>
		      </div>
		    );
		  });
		
		  const Component = app.start();
		  return (
		    <Component />
		  );
		}




## 如何使用
- 示例项目地址：<a href="https://github.com/Xchunguang/React-Next">点击访问</a>，亦可查看<a href="https://github.com/zeit/next.js/tree/master/examples">官方示例</a>
- npm install  下载依赖包
- npm run dev  开发环境调试
- npm build	   打包
- npm start	   运行
