
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/login/login","pages/index/index","pages/contacts/contact","pages/user/userpage","pages/sign/sign","pages/contacts/friendInform","pages/test","pages/search/search","pages/user/userdetail","pages/message/message","pages/group/group","pages/groupDatail/groupDatail"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#ffffff","backgroundColor":"#ffffff"},"tabBar":{"backgroundColor":"#ffffff","selectedColor":"#9370DB","height":"100rpx","list":[{"pagePath":"pages/index/index","text":"聊天","iconPath":"static/images/index/toke.png","selectedIconPath":"static/images/index/tokenone.png"},{"pagePath":"pages/contacts/contact","text":"联系人","iconPath":"static/images/index/tongxv.png","selectedIconPath":"static/images/index/tokenone.png"}]},"darkmode":false,"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"IM-liangan","compilerVersion":"3.7.11","entryPagePath":"pages/login/login","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/login/login","meta":{"isQuit":true},"window":{"navigationBarTitleText":"登录","navigationStyle":"custom"}},{"path":"/pages/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"聊天","navigationStyle":"custom","enablePullDownRefresh":true}},{"path":"/pages/contacts/contact","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"联系人","navigationStyle":"custom","enablePullDownRefresh":true}},{"path":"/pages/user/userpage","meta":{},"window":{"navigationBarTitleText":"用户页面","navigationStyle":"custom"}},{"path":"/pages/sign/sign","meta":{},"window":{"navigationBarTitleText":"注册","navigationStyle":"custom"}},{"path":"/pages/contacts/friendInform","meta":{},"window":{"navigationBarTitleText":"新朋友","navigationStyle":"custom"}},{"path":"/pages/test","meta":{},"window":{"navigationBarTitleText":"测试","navigationStyle":"custom"}},{"path":"/pages/search/search","meta":{},"window":{"navigationBarTitleText":"搜索","navigationStyle":"custom"}},{"path":"/pages/user/userdetail","meta":{},"window":{"navigationBarTitleText":"用户详情","navigationStyle":"custom"}},{"path":"/pages/message/message","meta":{},"window":{"navigationBarTitleText":"聊天页面","navigationStyle":"custom"}},{"path":"/pages/group/group","meta":{},"window":{"navigationBarTitleText":"建群","navigationStyle":"custom"}},{"path":"/pages/groupDatail/groupDatail","meta":{},"window":{"navigationBarTitleText":"群详情","navigationStyle":"custom"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});