export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/production/index',
    'pages/products/index',
    'pages/sales/index',
    'pages/bamboo/index',
    'pages/frame/index',
    'pages/painting/index',
    'pages/oiling/index',
    'pages/product-detail/index',
    'pages/order-detail/index',
    'pages/sales-record/index',
    'pages/orders-list/index',
    'pages/sales-detail/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B4513',
    navigationBarTitleText: '传统油纸伞制作坊',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF8F5',
  },
  tabBar: {
    color: '#8D6E63',
    selectedColor: '#8B4513',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/production/index',
        text: '制伞流程',
      },
      {
        pagePath: 'pages/products/index',
        text: '成品档案',
      },
      {
        pagePath: 'pages/sales/index',
        text: '订单销售',
      },
    ],
  },
})
