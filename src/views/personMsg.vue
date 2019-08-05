<template>
    <section class="personMsg">

        <div class="photo">
            <img :src="avatar" alt="用户头像" class="head_icon">

            <label class="alter" for="xFile">修改头像</label>
            <form>
                <input type="file" id="xFile" style="position:absolute;clip:rect(0 0 0 0);" @change="preview($event)" accept="image/png, image/jpeg, image/gif, image/jpg">
            </form>
        </div>
        <div id="preview" class="clear"></div>
        <div>
            <basicMsg :userInformation="userInformation" :birthday="userInformation.birthday" :userId="userId"></basicMsg>
        </div>
        <div  class="" style="margin-left: 235px;margin-top: -50px;">
            <teachMsg :userInformation="userInformation"></teachMsg>
        </div>
    </section>
</template>
<script>
    import Axios from 'axios'
    import {mapActions,mapGetters} from 'vuex'
    import fetch from './../fetch'
    import basicMsg from "./../components/personMsg/basicMsg.vue"
    import teachMsg from "./../components/personMsg/teachMsg.vue"


    export default{
        data(){
            return {
                userId:'',
                userInformation:{},
                avatar:'',
                imgUrl:''
            };
        },
        components:{
            basicMsg,
            teachMsg
        },
        created(){
            this.$nextTick(() => {
                this.setCrumb('个人资料修改');
                this.userId = this.$route.params.userId;
                this.userInfo();
            })
        },
        watch:{
        },
        methods: {
            ...mapActions([
                'removeCrumb',
                'setCrumb',
                'setUser'
            ]),
            ...mapGetters([
                'getUser'
            ]),
            userInfo(){
                fetch.getDetailedInf({uin:this.userId}).then(res =>{
                    if(!res){
                        return false;
                    }
                    this.userInformation = res.data;

                    console.log("userqqqqqq", this.getUser())
                    this.userInformation.mobile = this.getUser().mobile;
                    this.userInformation.avatar = this.userInformation.avatar || "./static/img/photo.png";
                    this.userInformation.password = this.getUser().password;
                    this.avatar = this.userInformation.avatar;
                      console.log("this.avatar", this.avatar)
                })

            },

            preview(e){
              debugger
                var url = e.currentTarget.value;
                var prevDiv = document.getElementById('preview');
                var file = e.target.files || e.dataTransfer.files;
                if (file[0].size >= 5242880) {
                     return false;
                }
                if (file[0]) {
                    var _this = this;
                    var reader = new FileReader();
                    reader.onload = function(evt){
                        let src = evt.target.result;


                        var image=new Image();
                        image.onload=function(){

                //             var canvas = document.createElement('canvas');
                //             var imageWidth = 100;
                //             var imageHeight = 100;
                //             var offsetX = 100;
                //             var offsetY = 100;
                //
                //             canvas.width = imageWidth;
                //             canvas.height = imageHeight;
                //
                //             var context = canvas.getContext('2d');
                //
                //             context.drawImage(image, offsetX, offsetY, imageWidth, imageHeight);
                            // var data=;
                            _this.save(src)
                        }
                        image.setAttribute('src', src);
                        prevDiv.appendChild(image)
                    }
                    reader.readAsDataURL(file[0]);
                }
            },
            save(imgsrc){
              console.log("imgsrc",imgsrc)
                let headers = {
                    crossDomain: true,
                    xhrFields: {withCredentials: true}
                }
                fetch.upload({file:imgsrc}).then(res =>{

                    if(!res){
                      console.log("!res",res)
                        this.avatar = "./img/logo.png";
                        return false;
                    }
                    let imgUrl = res.data;

                    fetch.getAvatar({avatar:imgUrl}).then(res =>{
                        if(!res){
                            this.avatar = "./img/logo.png";
                            return false;
                        }
                        this.avatar = imgUrl;
                        this.$toast('修改成功！', 'right');

                        let userInfo = this.getUser();
                        userInfo.avatar = this.avatar;
                        this.setUser(userInfo)

                    })
                })
            }
        }
    }
</script>
