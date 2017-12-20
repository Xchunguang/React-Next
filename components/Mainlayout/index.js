import Link from 'next/link';
import Head from 'next/head';
export default ({children,title='this is default title'})=>(
	  <div>
	    <Head>
	      <title>{ title }</title>
	      <meta charSet='utf-8' />
	      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
	    </Head>
	    <header>
	      <nav>
	        <Link href='/'><a>Home</a></Link> |
	        <Link href='/about'><a>About</a></Link> |
	        <Link href='/post'><a>Contact</a></Link>
	      </nav>
	    </header>

	    { children }

	    <footer>
	      {'I`m here to stay'}
	    </footer>
	  </div>

)