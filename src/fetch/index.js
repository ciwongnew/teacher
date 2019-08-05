import $http from './http'
import { http } from './../config'
let HTTP = http + '/gateway'


// (url, data, method, options)
export default {
	//上传
	upload: (data) => $http('http://wimg2.ciwong.net/avatar/upload', data, 'post', true, true),
	getAreas: (data) => $http(HTTP + '/v5/areas/{code}', data, 'get'),
	login: (data) => $http(http + '/oauth/v1/login', data, 'post'),
	logout: (data) => $http(http + '/oauth/v1/logout', data, 'get'),
	service: (data) => $http(HTTP + '/v5/user/v2/get_epage_Service', data, 'get'),
	// serviceProducts  : (data) => $http(HTTP+'/v5/service/v2/get_service_products_by_id', data, 'get'),
	serviceProducts: (data) => $http(HTTP + '/v5/service/v2/get_service_products_by_id_classids', data, 'get'),
	catalogues: (data) => $http(HTTP + '/v1/usedpackage/v1/getlatest', data, 'get'),
	resources: (data) => $http(HTTP + '/v1/package/book_resources_v2', data, 'get'),
	grads: (data) => $http(HTTP + '/v4/relation/class/get_my_classes', data, 'get'),
	publish: (data) => $http(HTTP + '/v6/epaperwork/publishWork', data, 'post'),
	// homework  : (data) => $http(HTTP+'/v5/epaperwork/v2/getPublishWorkRecordsForWeiXin', data, 'get'),
	homework: (data) => $http(HTTP + '/v6/epaperwork/v2/getPublishWorkRecords', data, 'get'),

	updaterecord: (data) => $http(HTTP + '/v1/usedpackage/updaterecord', data, 'post'),
	finishier: (data) => $http(HTTP + '/v6/epaperwork/v2/getWorkContenSubmitRecords', data, 'get'),
	triggler: (data) => $http(HTTP + '/v5/epaperwork/workEventTriggler', data, 'post'),
	//获取排行榜
	rankContent  : (data) => $http(HTTP+'/v6/epaperwork/getEworkContentScoreStatistics',data,'get'),
	rankWork  : (data) => $http(HTTP+'/v6/epaperwork/v2/getEworkScoreStatistics',data,'get'),
	//获取作业统计
	rankStatistics: (data) => $http(HTTP + '/v6/epaperwork/v2/workAnswerStatistics', data, 'get'),
	//获取单个题目的信息
	getSingleWork: (data) => $http(HTTP + "/v1/question/GetQuestionByVersions", data, 'get'),
	// 获取听说模考试卷
	getExamination: (data) => $http(HTTP + '/v1/tools/listen_speak_examination', data, 'get'),
	// 获取在线作答试卷
	getOnlineExamination: (data) => $http(HTTP + '/h5/v1/package/examinationdata', data, 'get'),
	//获取最近书本
	getLast: (data) => $http(HTTP + '/v5/user/v2/get_userbook_top', data, 'get'),
	//撤回指定作业
	delWork: (data) => $http(HTTP + '/v6/epaperwork/v3/del_work', data, 'get'),
	// 获取答案	@param : doWorkId
	getWorkAnswers: (data) => $http(HTTP + '/v6/epaperwork/v2/getWorkAnswers', data, 'get'),
	//获取作业内容详情
	getDoWork: (data) => $http(HTTP + '/v6/epaperwork/getDoWorkInfo', data, 'get'),
	//获取用户信息
	getInfo: (data) => $http(HTTP + '/v1/user/get_info', data, 'get'),
	//获取课文跟读段落
	getClassText: (data) => $http(HTTP + '/v1/tools/followread_text_paragraph', data, 'get'),
	//获取单词
	getWords: (data) => $http(HTTP + '/v1/tools/followread_words', data, 'get'),
	//获取用户详细信息
	getUserInformation: (data) => $http(HTTP + '/v1/user/get_info_base', data, 'get'),
	//获取老师布置作业题号
	getTeacherQuerstion: (data) => $http(HTTP + '/v6/epaperwork/getDoWorkInfo', data, 'get'),
	//获取系统消息接口
	getSystemMessages: (data) => $http(HTTP + '/v5/message/getMsgsByType', data, 'get'),
	//获取教育顾问信息接口
	getConsultant: (data) => $http(HTTP + '/v5/service/v2/get_epage_advisor', data, 'get'),
	//获取老师班级详情接口
	getClass: (data) => $http(HTTP + '/v4/relation/class/get_my_classes', data, 'get'),
	//获取老师详细信息学校ID接口:
	getDetailedInf: (data) => $http(HTTP + '/v5/user/getUserInfo', data, 'get'),

	//修改老师头像
	getAvatar: (data) => $http(HTTP + '/v1/user/update_avatar', data, 'get'),
	//修改密码
	getPassWord: (data) => $http(HTTP + '/v5/user/new/updatePwd', data, 'get'),
	//发送手机验证码:
	getsendVerifyCode: (data) => $http(HTTP + '/v5/user/sendVerifyCode', data, 'get'),
	//验证手机验证码:
	getcheckVerifyCode: (data) => $http(HTTP + '/h5/v5/user/checkVerifyCode', data, 'get'),
	//修改/绑定手机号
	getMobile: (data) => $http(HTTP + '/v5/user/bindMobile', data, 'get'),
	//获取班级成员列表
	getClassStudent: (data) => $http(HTTP + '/v5/relation/getclassmembers', data, 'get'),
	//删除本班学生
	deleteStudent: (data) => $http(HTTP + '/v4/relation/class/kick_out_class', data, 'get'),
	//获取班级所有服务开通情况
	getAllservice: (data) => $http(HTTP + '/v5/user/v2/get_service_state2', data, 'get'),
	//查询学校列表
	getSchool: (data) => $http(HTTP + '/v4/relation/school/search', data, 'get'),
	//修改班级信息
	modifyClassInformation: (data) => $http(HTTP + '/v5/class/update_classInfo_byId', data, 'get'),
	//创建班级接口
	createClass: (data) => $http(HTTP + '/v4/relation/class/create', data, 'post', false, true),
	//统计作业次数
	getHomeworkStatistics: (data) => $http(HTTP + '/v6/epaperwork/v2/getEworkRecordsStatistics', data, 'get'),
	//设置已读消息
	setRead: (data) => $http(HTTP + '/v5/message/setRead', data, 'get'),
	//修改性别
	modifySex: (data) => $http(HTTP + '/v5/user/update', data, 'post'),
	//未读消息数量
	unreadMessage: (data) => $http(HTTP + '/v5/message/getNoReadMsgCountByType', data, 'get'),
	//校讯通
	getSchoolMsg: (data) => $http(HTTP + '/h5/v5/message/agentEventTriggler', data, 'post'),

	modifyPwd: (data) => $http(HTTP + '/v5/user/setPassword', data, 'get'),
	//置顶
	setBookTop: (data) => $http(HTTP + '/v5/user/v2/set_userbook_top', data, 'get'),
	//分享
	toShare: (data) => $http(HTTP + '/v1/comm/url/longToShort', data, 'post'),
	searchStudent: (data) => $http(HTTP + '/v5/user/getUserByMobile', data, 'get'),
	//添加单个学生进入班级
	addOneStudent: (data) => $http(HTTP + '/v4/relation/class/apply', data, 'get'),
	//批量创建学生账号
	createStudent: (data) => $http(HTTP + '/v5/relation/createAndAddStudentMembers', data, 'post'),
	//一键催交
	urgeWorks: (data) => $http(HTTP + '/v5/epaperwork/workEventTriggler', data, 'post'),
	//在线批改作业
	correctWork: (data) => $http(HTTP + '/v6/epaperwork/saveCorrectAnswer', data, 'post'),
	//听说批改作业
	correctListenWork: (data) => $http(HTTP + '/v1/epaperwork/examination/correct_listenspeak', data, 'post'),
	//获取试卷http://192.168.2.164:8069/BooksAuthor/GetList?userID=155014&keyWord=&periodId=0&SubjectID=0&pageIndex=1&pageSize=20
	getPaper: (data) => $http(HTTP + '/v1/Package/GetList', data, 'get'),
	//ExaminationID
	delPaper: (data) => $http(HTTP + '/v1/Package/DeleteExamination', data, 'post'),
	//http://100.114.31.171:8895/message/agentEventTriggler
	setClassMsg: (data) => $http(HTTP + '/v5/message/agentEventTriggler', data, 'post'),
	//http://192.168.1.48:8895/message/getSendMessages
	getClassMsg: (data) => $http(HTTP + '/v5/message/getSendMessages', data, 'get'),
	//注册
	signup: (data) => $http(HTTP + '/h5/v5/user/signin', data, 'get'),
	// getAllCount: (data) => $http(HTTP+ '/v2/package/resource_statistics_web', data, 'get'),
	getAllCount: (data) => $http(HTTP + '/v1/package/resource_statistics_web', data, 'get'),
	//预览筛选
	filterListen: (data) => $http(HTTP + '/v1/Package/resource_data_web', data, 'get'),
	// 获取班级交集服务
	getClassService: (data) => $http(HTTP + '/v5/user/v2/get_epage_Service_classids', data, 'get'),
	//最近布置过
	getRecentPublishBokk: (data) => $http(HTTP + '/v6/epaperwork/getpublishbook', data, 'get')
}
