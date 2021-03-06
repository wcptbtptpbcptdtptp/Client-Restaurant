import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/auth/Login';
import main from '@/components/main/Main';
import register from '@/components/auth/Register';
import ordering from '@/components/main/order/Ordering';
import ordered from '@/components/main/order/Ordered';
import orderall from '@/components/main/order/OrderAll';
import management from '@/components/main/dish/Management';
import newdish from '@/components/main/dish/NewDish';
import QRcode from '@/components/main/QRcode';
import info from '@/components/main/self/Info';
import trackorder from '@/components/main/order/TrackOrder';
import changepw from '@/components/main/self/ChangePW';

Vue.use(Router);

export default new Router({
  routes: [
    // 开发用，临时将默认页改成
    // {
    //   path: '/',
    //   redirect: '/main/dish/newdish'
    // },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      component: main
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/main/order/dealing',
      name: 'ordering',
      component: ordering
    },
    {
      path: '/main/order/dealed',
      name: 'ordered',
      component: ordered
    },
    {
      path: '/main/order/all',
      name: 'orderall',
      component: orderall
    },
    {
      path: '/main/dish/management',
      name: 'management',
      component: management
    },
    {
      path: '/main/dish/newdish',
      name: 'newdish',
      component: newdish
    },
    {
      path: '/main/QRcode',
      name: 'QRcode',
      component: QRcode
    },
    {
      path: '/main/info',
      name: 'info',
      component: info
    },
    {
      path: '/main/info/password',
      name: 'changepw',
      component: changepw
    },
    {
      path: '/main/order/trackorder',
      name: 'trackorder',
      component: trackorder
    }
  ]
});
