var Toast = {};
Toast.install = function (Vue, options) {
    let opt = {
        defaultType:'right',   // 默认显示颜色
        duration:'3000'         // 持续时间
    }
    for(let property in options){
        opt[property] = options[property];  // 使用 options 的配置
    }
    Vue.prototype.$toast = (tips,type) => {
        if(type){
            opt.defaultType = type;         // 如果有传type，位置则设为该type
        }
        if(document.getElementsByClassName('vue-toast').length){
            // 如果toast还在，则不再执行
            return;
        }
        let template = '<div class="vue-toast toast-'+opt.defaultType+'">'
        let imgUrl
        if(opt.defaultType == 'right') {
          imgUrl = './static/toast-right.png'
        }else {
          imgUrl = './static/toast-error.png'
        }
        template+="<img src=" + imgUrl + " /><p>" + tips + '</p></div>'

        let toastTpl = Vue.extend({
            // template: '<div class="vue-toast toast-'+opt.defaultType+'"><p>' + tips + '</p></div>'
            template: template

        });
        let tpl = new toastTpl().$mount().$el;
        document.body.appendChild(tpl);
        setTimeout(function () {
            document.body.removeChild(tpl);
        }, opt.duration)
    }
}
module.exports = Toast;
