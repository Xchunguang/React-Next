import Head from 'next/head';
import {Component} from 'react';
import DataPicker from '../components/DataPicker';
import {Button} from 'antd';
import Link from 'next/link';
export default class extends Component{
	 

	  getUserInfo=()=>{
	    fetch('https://jsonplaceholder.typicode.com/posts?_page=1')
	    .then((res)=> res.json())
        .then((json)=>{
        	console.log(json);
    	});
    	
    	
	  }

	  render(){
	  	return (
				<div className='container'>
					<Head>
				      <meta name='viewport1' content='width=device-width, initial-scale=1' />
				      <meta charSet='utf-8' />
				      <link rel='stylesheet' href='/static/antd.min.css' />
				    </Head>
					<p>helloworld</p>
					<DataPicker/>
					{/*静态图片使用方法：<img src='/static/Tulips.jpg' />*/}

					 <Link prefetch href="/">
			          <a>Back To Home</a>
			         </Link>

			         <p><Button onClick={this.getUserInfo}>fetch Test</Button></p>

			     	{/*样式表*/}
			         <style jsx>{`
				      .container{
				      	width:100%;
				      	height:100%;
				      	display:inline-block;
				      	text-align:center;
				      	line-height:100px;
				      }
				    `}</style>
				</div>
			)
	  }
}