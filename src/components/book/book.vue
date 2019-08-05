<template>
     <section class="book" >
        <div class="images" v-if="type == 1" style="">
            <router-link :to="{path: 'publishHomeWork', query:{bookId: booksData.productId,bookName: booksData.productName,serviceId: booksData.serviceId, packageId:booksData.packageId,subject: booksData.subject,isFirst: 1}}">
                <img :src="booksData.cover" alt="" v-if="booksData.cover">
                <img src="../../assets/img/default.png" alt="" v-else-if="!booksData.cover">
            </router-link>
            <i @click="setTop" :class="{isTop: booksData.istop == 1}"></i>
        </div>
        <div class="images" v-else>

              <router-link :to="{path: 'publishBooks', query:{paper:booksData, type:2}}">
                  <img src="../../assets/img/defaultPaper.png" alt="">
                  <span class="paper_title" :title="booksData.examinationTitle">{{booksData.examinationTitle}}</span>
              </router-link>
            <span class="view_btn" @click="view">预览</span>
        </div>
        <div class="bookMsg" v-if="type == 1">
            <h4 :title="booksData.bookName">{{booksData.productName}}</h4>
            <p :title="booksData.serviceName">{{booksData.serviceName}}</p>
        </div>
    </section>
</template>
<script>
import { clientId, brandId } from './../../config'
import { mapGetters, mapActions } from 'vuex'
import fetch from './../../fetch'


    export default{
        // props: ['cover','bookName','serviceId','serviceName','packageId', 'subject'],
        props: ['booksData','type'],
        data(){
            return {
              paper: this.booksData,
              defaultBook: '../../assets/img/default.png'
            }
        },
        created() {
            this.getRecengBook()
        },
        methods:{
            ...mapGetters([
              'getUser'
            ]),
            setTop(){
              this.$emit('setTop',{top: 1, productId: this.booksData.productId, serviceId: this.booksData.serviceId});
            },
            view(){

              // if(window.localStorage.user && window.localStorage.user != "underfined"){
  						// 	const userInfo = JSON.parse(window.localStorage.getItem("user"));
  		        // }

              let userInfo = this.getUser();
              let query = {
        				versionId: this.booksData.examinationID,
        				brandId: brandId,
                clientId: clientId,
                userId: userInfo.userId
        			}
              this.$router.push({ path: 'selectOnlinePaper', query })
            },
            getRecengBook() {
                // let params = {
                //     bookId: this.booksData.packageId,
                //     userId: this.getUser().userId
                // }
                // fetch.getRecentPublishBokk(params).then(res=>{
                //     if (!res) {
                //         return false
                //     }
                // })
            }
        }
    }
</script>
