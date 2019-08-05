let routerObj = [
    {
    	path: 'selectText',
    	name: 'selectText',
    	title: '选择课文',
    	component: require('./views/selectText.vue')
    },
    {
        path: '',
        name: 'home',
        title: '首页',
        component: require('./views/home.vue')
    },
    {
        path: 'ranks',
        name: 'ranks',
        title: '单个作业排名',
        component: require('./views/rank.vue')
    },
    {
        path: 'selectListenSpeak',
        name: 'selectListenSpeak',
        title: '选择听说模考大题',
        component: require('./views/selectListenSpeak.vue')
    },
    {
        path: 'checkTSMK',
        name: 'checkTSMK',
        title: '听说模考详情',
        component: require('./views/checkTSMK.vue')
    },
    {
        path: 'selectOnlinePaper',
        name: 'selectOnlinePaper',
        title: '在线作答预览',
        component: require('./views/selectOnlinePaper.vue')
    },
    {
        path: 'checkOnlinePaper',
        name: 'checkOnlinePaper',
        title: '在线作答详情',
        component: require('./views/checkOnlinePaper.vue')
    },
    {
        path: 'watchSinglePaper',
        name: 'watchSinglePaper',
        title: '错题统计',
        component: require('./views/watchSinglePaper.vue')
    },
     {/*:workId/:content/:effectiveDate/:sendDate/:reviceObject/:workName'*/
        path: 'rankWork',
        name: 'rankWork',
        title: '总排名',
        component: require('./views/rankWork')
    },
    {
        path: 'watchStukw',
        name: 'watchStukw',
        title: '查看作业',
        component: require('./views/watchStukw.vue')
    },
     {
        path: 'watchStudc',
        name: 'watchStudc',
        title: '查看作业',
        component: require('./views/watchStudc.vue')
    },
	{
        path: 'setHomework',
        name: 'setHomework',
        title: '选择习题册',
        component: require('./views/setHomework.vue')
    },
	{
        path: 'publishHomeWork',
        name: 'publishHomeWork',
        title: '书本目录',
        component: require('./components/publishHomeWork/publishHomeWork.vue')
    },
	{
        path: 'readWords',
        name: 'readWords',
        title: '单词跟读',
        component: require('./views/readWords.vue')
    },
    {
        path: 'ForgotPwd',
        name: 'ForgotPwd',
        title: '忘记密码',
        component: require('./views/ForgotPwd.vue')
    },
    {
        path: 'login',
        name: 'login',
        title: '登录',
        component: require('./views/login.vue')
    },
    {

        path: 'personMsg/:userId',
        name: 'personMsg',
        title: '个人中心',
        component: require('./views/personMsg.vue')
    },
    {
        path: 'class',
        name: 'class',
        title: '班级',
        component: require('./views/class.vue')
    },
    {
        path: 'schoolMsg',
        name: 'schoolMsg',
        title: '校讯通',
        component: require('./components/schoolMsg/schoolMsg.vue')
    },
		{
        path: 'register',
        name: 'register',
        title: '注册',
        component: require('./views/register.vue')
    },
		{
		path: 'publishBooks',
    	name: 'publishBooks',
        title: '作业',
        component: require('./components/publishBooks/publishBooks.vue')
    },
		{
		path: 'managePaper',
    	name: 'managePaper',
        title: '管理试卷',
        component: require('./views/managePaper.vue')
    },
		{
		path: 'setPaper',
    	name: 'setPaper',
        title: '试卷列表',
        component: require('./components/setWork/setPaper.vue')
    },
    {
      path: 'selectObject',
      name: 'selectObject',
      title: '选择布置对象',
      component: require('./views/selectObject.vue')
    }
]


export default [
    {
        path: '/web',
        name: 'page',
        component: require('./views/page/web.vue'),
        children: routerObj
    },
    {
        path: '/api',
        name: 'api',
        component: require('./views/page/api.vue'),
        children: routerObj
    },
    {
        path: '/ranks',
        component: require('./views/rank.vue'),
        children: routerObj
    },
    {
        path: '/',
        redirect: '/web/'
    },
    {
        path: '*',
        component: require('./views/notfond.vue')
    }
]