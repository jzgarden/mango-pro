import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {addGlobalUncaughtErrorHandler, registerMicroApps, start} from 'qiankun';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


// tslint:disable-next-line:typedef
function genActiveRule(routerPrefix) {
  // hash 路由设置
  return (location) => location.hash.startsWith(routerPrefix);
  // 普通路由设置
   // return (location) => location.pathname.startsWith(routerPrefix);
}

registerMicroApps(
  [
    //        这里注释的是可以借鉴的，之前测试留下的(还是有用的)。为什么放在这里，

    {
      name: 'mango-iview', // app name registered
      entry: 'http://localhost:4300/#/test233',
      container: '#mango-iview-label', // 标签id
      activeRule: '#/test233',
      props: { microName: '我是父应用呀!', micro: 'micro' },
    },
    // {
    //   name: 'AngularMicroApp', // app name registered
    //   entry: '//localhost:4300',
    //   container: '#angular_micro',
    //   activeRule: genActiveRule('/one'),
    //   props: { microName: '我是父应用呀!' },
    // },
  ],
  {
    // qiankun 生命周期钩子 - 加载前
    beforeLoad: (app: any) => {
      // 加载子应用前，加载进度条
      //   NProgress.start();
      console.error('before load', app.name);
      return Promise.resolve();
    },
    // qiankun 生命周期钩子 - 挂载后
    afterMount: (app: any) => {
      // 加载子应用前，进度条加载完成
      //   NProgress.done();
      console.log('after mount', app.name);
      return Promise.resolve();
    },
  },
);

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event: Event | string) => {
  console.error(event);
  const {message: msg} = event as any;
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    console.error('微应用加载失败，请检查应用是否可运行');
  }
});

console.log(11223);

start();
