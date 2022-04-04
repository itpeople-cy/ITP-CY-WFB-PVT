import AssetsView from '../components/Asset/AssetsView';
import UsersView from '../components/User/UsersView';
import Login from '../components/User/Login';
import UserLogin from '../components/User/UserLogin';
import Manufacturer from '../components/Manufacturer/Manufacturer';
import Factory from '../components/Factory/Factory';
import AssetsIcon from '../assets/img/AssetsIcon';
import UsersIcon from '../assets/img/UsersIcon';

export const config = {
  views: [
    {
      label: 'Login',
      viewId: 'login',
      path: '/login',
      icon: UsersIcon,
      component: UserLogin,
      show:false
    },
    {
      label: 'Assets',
      viewId: 'assets',
      path: '/assets',
      icon: UsersIcon,
      component: AssetsView,
      show:false
    },
    {
      label: 'Users',
      viewId: 'users',
      path: '/',
      icon: UsersIcon,
      component: Login,
      loggedIn:false
    },
    {
      label: 'Manufacturer',
      viewId: 'manufacturer',
      path: '/manufacturer',
      icon: AssetsIcon,
      component: Manufacturer,
      loggedIn:true
    },
    {
      label: 'Warehouse',
      viewId: 'warehouse',
      path: '/warehouse',
      icon: AssetsIcon,
      component: Manufacturer,
      loggedIn:true
    },
    {
      label: 'Tagging Supplier',
      viewId: 'taggingSupplier',
      path: '/taggingSupplier',
      icon: AssetsIcon,
      component: Factory,
      loggedIn:true
    },
    {
      label: 'Factory',
      viewId: 'factory',
      path: '/factory',
      icon: AssetsIcon,
      component: Factory,
      loggedIn:true
    },
    {
      label: 'Retailer',
      viewId: 'retailer',
      path: '/retailer',
      icon: AssetsIcon,
      component: Manufacturer,
      loggedIn:true
    }

  ],
};
export default config;
