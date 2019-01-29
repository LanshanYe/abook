import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     }
  //   ]
  // },
  {
    path: '/documentation', // 读者管理
    component: Layout,
    redirect: '/documentation/index',
    zhname: '读者管理',
    promiss: 'readManage',
    meta: { title: 'documentation', icon: 'documentation', roles: ['admin', 'readManage'] },
    children: [
      {
        path: 'Rcard', // 读者列表
        component: () => import('@/views/documentation/Rcard'),
        name: 'Rcard',
        zhname: '读者列表',
        promiss: 'readManage-card',
        meta: { title: 'rcard', roles: ['admin', 'readManage-card'] }
      },
      {
        path: 'index', // 借书管理
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        zhname: '借书管理',
        promiss: 'readManage-borrow',
        meta: { title: 'borrowBook', roles: ['admin', 'readManage-borrow'] }
      }
      // {
      //   path: 'readerManage', // 读者管理
      //   component: () => import('@/views/documentation/Rcard'),
      //   name: 'readerManage',
      //   zhname: '读者管理',
      //   promiss: 'readManage-readerManage',
      //   meta: { title: 'readerManage', icon: 'documentation', roles: ['admin', 'readManage-readerManage'] }
      // },
    ]
  },
  {
    path: '/systemSetup', // 系统设置
    component: Layout,
    zhname: '系统设置',
    redirect: 'noredirect',
    promiss: 'systemSetup',
    meta: { icon: 'lock', title: 'systemManage', roles: ['admin', 'systemSetup'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/systemSetup/index'),
        name: 'SystemSetup',
        zhname: '系统设置',
        promiss: 'systemSetupindex',
        meta: { title: 'systemSetup', roles: ['admin', 'systemSetupindex'] }
      },
      {
        path: 'Ractive', // 活动管理
        component: () => import('@/views/documentation/Ractive'),
        name: 'Ractive',
        zhname: '活动管理',
        promiss: 'readManage-active',
        meta: { title: 'ractive', roles: ['admin', 'readManage-active'] }
      },
      {
        path: '/infoManage', // 资讯管理
        component: () => import('@/views/infoManage/infoManage'),
        name: 'InfoManage',
        zhname: '资讯管理',
        promiss: 'infoManage',
        meta: { title: 'icons', roles: ['admin', 'infoManage'] }
      },
      {
        path: '/banner', // 轮播图管理
        zhname: '轮播图管理',
        promiss: 'banner',
        component: () => import('@/views/banner/banner'),
        name: 'banner',
        meta: { title: 'banner', roles: ['admin', 'banner'] }
      },

      {
        path: '/tab', // 服务指南
        zhname: '服务指南',
        promiss: 'service',
        component: () => import('@/views/tab/serviceList'),
        name: 'ServiceList',
        meta: { title: 'serviceList', roles: ['admin', 'service'] }
      },
      {
        path: '/libraryoverall', // 馆情列表
        zhname: '馆情列表',
        component: () => import('@/views/libraryoverall/libraryoverall'),
        name: 'libraryoverall',
        promiss: 'libraryoverall',
        meta: { title: 'libraryoverall', roles: ['admin', 'libraryoverall'] }
      },

      {
        path: 'passengerequipment', // 客流设备管理
        component: () => import('@/views/passenger/passengerequipment'),
        name: 'passengerEquipment',
        promiss: 'passenger-equipment',
        zhname: '客流设备管理',
        meta: { title: 'passengerEquipment', roles: ['admin', 'passenger-equipment'] }
      },
      {
        path: 'passengerdata', // 客流数据管理
        component: () => import('@/views/passenger/passengerdata'),
        name: 'passengerData',
        promiss: 'passenger-data',
        zhname: '客流数据管理',
        meta: { title: 'passengerData', roles: ['admin', 'passenger-data'] }
      }
    ]
  },
  {
    path: '/guide', // 捐赠管理
    component: Layout,
    redirect: '/guide/index',
    zhname: '捐赠管理',
    promiss: 'donationManage',
    meta: {
      title: 'guide', icon: 'guide',
      roles: ['admin', 'donationManage'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index', //  捐赠文档管理
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        zhname: '捐赠文档管理',
        promiss: 'donationManage-doc',
        meta: { title: 'donationDoc', roles: ['admin', 'donationManage-doc'] }
      },
      {
        path: 'donationList', //  捐赠图书列表
        component: () => import('@/views/guide/donationList'),
        name: 'DonationList',
        zhname: '捐赠图书列表',
        promiss: 'donationManage-booklist',
        meta: { title: 'donationList', roles: ['admin', 'donationManage-booklist'] }
      },
      {
        path: 'mainDonation', //  重要捐赠管理
        component: () => import('@/views/guide/mainDonation'),
        name: 'MainDonation',
        zhname: '重要捐赠管理',
        promiss: 'donationManage-mainbook',
        meta: { title: 'mainDonation', roles: ['admin', 'donationManage-mainbook'] }
      }
    ]
  },
  // {
  //   path: '/resource', // 资源管理
  //   component: Layout,
  //   zhname: '资源管理',
  //   promiss: 'resource',
  //   meta: {
  //     title: 'resource', icon: 'example',
  //     roles: ['admin', 'resource']
  //   },
  //   children: [
  //     {
  //       path: 'index', // 资源管理
  //       zhname: '资源管理',
  //       promiss: 'resourceindex',
  //       component: () => import('@/views/resourceManage/resource'),
  //       name: 'resource',
  //       meta: { title: 'resource', roles: ['admin', 'resourceindex'] }
  //     },
  //     {
  //       path: 'resourcetype', //  资源类型管理
  //       component: () => import('@/views/resourceManage/resourcetype'),
  //       name: 'resourcetype',
  //       zhname: '资源类型管理',
  //       promiss: 'resourcetype',
  //       meta: { title: 'resourcetype', roles: ['admin', 'resourcetype'] }
  //     },
  //     {
  //       path: 'seriesmanage', //  连续剧名称管理
  //       component: () => import('@/views/resourceManage/seriesManage'),
  //       name: 'seriesmanage',
  //       zhname: '连续剧名称管理',
  //       promiss: 'seriesmanage',
  //       meta: { title: 'seriesmanage', roles: ['admin', 'seriesmanage'] }
  //     }
  //   ]
  // },
  {
    path: '/localresource', // 本地资源管理
    component: Layout,
    zhname: '本地资源管理',
    promiss: 'localresource',
    meta: {
      title: 'localresource', icon: 'star',
      roles: ['admin', 'localresource']
    },
    children: [
      {
        path: 'index', // 本地资源管理
        zhname: '本地资源管理',
        promiss: 'localresourceindex',
        component: () => import('@/views/localresource/resource'),
        name: 'localresource',
        meta: { title: 'localresource', roles: ['admin', 'localresourceindex'] }
      },
      {
        path: 'localresourcetype', //  本地资源类型管理
        component: () => import('@/views/localresource/resourcetype'),
        name: 'localresourcetype',
        zhname: '本地资源类型管理',
        promiss: 'localresourcetype',
        meta: { title: 'localresourcetype', roles: ['admin', 'localresourcetype'] }
      },
      {
        path: 'localseriesmanage', //  连续剧名称管理
        component: () => import('@/views/localresource/seriesManage'),
        name: 'localseriesmanage',
        zhname: '连续剧名称管理',
        promiss: 'localseriesmanage',
        meta: { title: 'seriesmanage', roles: ['admin', 'localseriesmanage'] }
      },
      {
        path: 'bookresource', //  图书资源
        component: () => import('@/views/resourceManage/bookresource'),
        name: 'bookresource',
        zhname: '图书资源',
        promiss: 'bookresource',
        meta: { title: 'bookresource', roles: ['admin', 'bookresource'] }
      }
    ]
  },
  {
    path: '/volunteer', // 志愿者管理
    component: Layout,
    zhname: '志愿者管理',
    promiss: 'volunteer',
    meta: {
      title: 'volunteer', icon: 'form',
      roles: ['admin', 'volunteer'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index', //  文章管理
        component: () => import('@/views/volunteer/volunteerArticle'),
        name: 'volunteerArticle',
        zhname: '文章管理',
        promiss: 'volunteerArticle',
        meta: { title: 'Article', roles: ['admin', 'volunteerArticle'] }
      },
      {
        path: 'volunteerModel', //  模块管理
        component: () => import('@/views/volunteer/volunteerModel'),
        name: 'volunteerModel',
        zhname: '模块管理',
        promiss: 'volunteerModel',
        meta: { title: 'volunteerModel', roles: ['admin', 'volunteerModel'] }
      }
    ]
  },
  {
    path: '/share', // 共享工程管理
    component: Layout,
    zhname: '共享工程管理',
    promiss: 'share',
    meta: {
      title: 'share', icon: 'table',
      roles: ['admin', 'share']
    },
    children: [
      {
        path: 'index', // 资源管理
        zhname: '资源管理',
        promiss: 'resourceShare',
        component: () => import('@/views/shareManage/resource'),
        name: 'resourceShare',
        meta: { title: 'resource', roles: ['admin', 'resourceShare'] }
      },
      {
        path: 'resourcetype', //  资源类型管理
        component: () => import('@/views/shareManage/resourcetype'),
        name: 'resourcetypeShare',
        zhname: '资源类型管理',
        promiss: 'resourcetypeShare',
        meta: { title: 'resourcetype', roles: ['admin', 'resourcetypeShare'] }
      },
      {
        path: 'shareseriesmanage', //  连续剧名称管理
        component: () => import('@/views/shareManage/seriesManage'),
        name: 'shareseriesmanage',
        zhname: '连续剧名称管理',
        promiss: 'shareseriesmanage',
        meta: { title: 'seriesmanage', roles: ['admin', 'shareseriesmanage'] }
      },
      {
        path: 'Article', //  文章管理
        component: () => import('@/views/shareManage/Article'),
        name: 'Article',
        zhname: '文章管理',
        promiss: 'Article',
        meta: { title: 'Article', roles: ['admin', 'Article'] }
      },
      {
        path: 'shareConfigure', //  中间图
        component: () => import('@/views/shareManage/configureManage'),
        name: 'shareConfigure',
        zhname: '中间图',
        promiss: 'shareConfigure',
        meta: { title: 'shareConfigure', roles: ['admin', 'shareConfigure'] }
      },
      {
        path: 'banner', //  轮播图
        component: () => import('@/views/shareManage/banner'),
        name: 'bannerShare',
        zhname: '轮播图',
        promiss: 'bannerShare',
        meta: { title: 'banner', roles: ['admin', 'bannerShare'] }
      },
      {
        path: 'links', //  友情链接
        component: () => import('@/views/shareManage/links'),
        name: 'linksShare',
        zhname: '友情链接',
        promiss: 'linksShare',
        meta: { title: 'link', roles: ['admin', 'linksShare'] }
      }
    ]
  },
  {
    path: '/links', // 链接管理
    component: Layout,
    zhname: '链接管理',
    promiss: 'links',
    meta: { title: 'link', icon: 'link', roles: ['admin', 'links'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/links/links'),
        name: 'links',
        meta: { title: 'link', roles: ['admin', 'links'] }
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  //  componentsRouter,
  //  chartsRouter,
  //  nestedRouter,
  //  tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/errorPage/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/errorPage/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   meta: { roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/errorLog/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/exportExcel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/selectExcel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },

  {
    path: '/clipboard', // 你读书我买单管理
    component: Layout,
    zhname: '你读书我买单',
    redirect: 'noredirect',
    promiss: 'ureadManage',
    meta: { icon: 'clipboard', roles: ['admin', 'ureadManage'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', roles: ['admin', 'ureadManage'] }
      }
    ]
  },
  {
    path: '/wx', // 小程序分类管理
    component: Layout,
    zhname: '公众号管理',
    promiss: 'wx',
    meta: { title: 'wx', icon: 'chart', roles: ['admin', 'wx'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/wx/wx'),
        name: 'wx',
        meta: { title: 'wx', roles: ['admin', 'wx'] }
      }
    ]
  },
  {
    path: '/i18n', // 管理员管理
    component: Layout,
    zhname: '管理员管理',
    promiss: 'adminManage',
    meta: { title: 'i18n', icon: 'international', roles: ['admin', 'adminManage'] },
    children: [
      {
        path: 'addAdmin', // 角色管理
        component: () => import('@/views/i18n-demo/addAdmin'),
        name: 'AddAdmin',
        zhname: '角色管理',
        promiss: 'adminManage-addAdmin',
        meta: { title: 'addAdmin', roles: ['admin', 'adminManage-addAdmin'] }
      },
      {
        path: 'index', // 管理员管理
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        zhname: '管理员管理',
        promiss: 'adminManage-index',
        meta: { title: 'i18n', roles: ['admin', 'adminManage-index'] }
      },
      {
        path: 'adminLog', // 管理员日志
        component: () => import('@/views/i18n-demo/adminLog'),
        name: 'AdminLog',
        promiss: 'adminManage-log',
        zhname: '管理员日志',
        meta: { title: 'adminLog', roles: ['admin', 'adminManage-log'] }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
