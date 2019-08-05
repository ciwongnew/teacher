let user = JSON.parse(window.localStorage.getItem('user'))
/*




	不许改动这个文件








*/
export let clientId = user? user.clientId: 100143
export let brandId = user? user.brandId: 524726977
export let schoolId = user? user.schoolId: ''
export let logo = user? user.logo: ''
export let accessToken = user? user.accessToken: ''
export let http = user?user.host: 'http://eapi.my.ciwong.com' //http://eapi.my.ciwong.com, http://eapi.my.jiaofucloud.cn

// export let http = 'http://eapi.my.jiaofucloud.cn'
