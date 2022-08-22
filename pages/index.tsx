import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import undrawHome from '@/public/images/undraw_home.svg';
import undrawMobile from '@/public/images/undraw_mobile.svg';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='app min-h-screen min-w-screen'>
        <div className='flex container px-10 sm:px-20 flex-row justify-between h-screen w-screen'>
          <div className='w-full sm:w-5/12 flex flex-col justify-center prose'>
            <h1 className='text-indigo-500 mb-2'>Quiz app</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
              delectus amet nesciunt et perspiciatis porro possimus! Consectetur
              veniam atque quo impedit, deserunt, doloribus hic placeat
              exercitationem earum, corporis est adipisci.
            </p>
            <div className='my-5 flex'>
              <a
                href='/auth/signin'
                className='bg-indigo-500 text-white py-2 mr-3 px-6 text-lg rounded-full no-underline'
              >
                Login
              </a>
              <a
                href='/auth/signup'
                className='bg-indigo-500 text-white py-2 mr-3 px-6 text-lg rounded-full no-underline'
              >
                Register
              </a>
            </div>
          </div>
          <div className='hidden sm:w-5/12 sm:flex flex-col justify-center'>
            <Image src={undrawHome} className='w-full' />
          </div>
        </div>

        <div className='flex container px-10 sm:px-20 flex-row justify-between w-screen h-screen'>
          <div className='hidden sm:w-5/12 sm:flex flex-col justify-center'>
            <Image src={undrawMobile} className='w-full' />
          </div>
          <div className='w-full sm:w-5/12 flex flex-col justify-center prose'>
            <h1 className='text-indigo-500 mb-2'>Have android version!</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
              delectus amet nesciunt et perspiciatis porro possimus! Consectetur
              veniam atque quo impedit, deserunt, doloribus hic placeat
              exercitationem earum, corporis est adipisci.
            </p>
            <div className='my-5'>
              <a
                href="{{ asset('assets/apk/quizApp.apk') }}"
                className='bg-indigo-500 text-white py-2 mr-3 px-6 text-lg rounded-full no-underline'
                download='quiz-app.apk'
              >
                Download now!
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
