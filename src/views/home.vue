<template>
    <div ref="scorll">
        <div class="Home">
            <div class="oldHome"  v-if="totalCount>0">
                <div class="Setting-homework">
                    <div class="HomeworkTitle">
                        <span>我布置的作业</span>
                        <div class="TosetHomework">
                            <button class="button publishBtn" @click="TosetHomework">
                                布置作业
                            </button>
                        </div>

                    </div>
                </div>

                <div class="historyHomework" v-if="historyHomework.length">
                  <div class="" v-for="(item,index) in historyHomework">

                      <history :content="item" :delIndex="index" :key="index" @removeWork="removeWork" :PageIndex="PageIndex"></history>
                  </div>
                    <!-- <paging :PagenumId="PageIndex" :PageCount="PageCount" @mypagenum="pageNum" v-if="pull_data"></paging>
                    <div class="pull" @click="pull_work" v-else>
                      加载更多
                    </div> -->
                  <div class="loading_books" v-if="loading">
          					<div class="load_line"></div>
          					<p>正在加载中...</p>
          				</div>
                </div>
            </div>

            <div class="newHome"  v-if="totalCount == 0">
                <div class="noWorkBox">
                    <img src="./../assets/img/noGrade.png" class="noGrade">
                    <span>您还没有布置作业哦~赶紧布置吧！</span>
                    <div class="create">
                        <button class="button green" @click="TosetHomework">布置作业</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex'
    import history from "./../components/history/history.vue"
    import paging from "./../components/paging/paging.vue"
    import progressBar from "./../components/progressBar/progressBar.vue"
    import fetch from './../fetch'
    import DrawCanvas from './../unit/progressBar.js'
    import {nowDate, formatDate, aroundDate, timeStamp, formatDataToMinutes, closeDateState, closeDate} from './../filter'

    export default{
        data(){
            return {
                showPage: false,
                historyHomework: [],
                isShow: false,
                PageIndex: 1,
                PageCount: 0,
                LastBookArr: [],
                totalCount:0,
                BookText:'',
                pull_data: true
            };
        },
        created(){
            // alert("home")
            this.loading = false
            this.$nextTick(() => {
                this.cleanCatalog();
                this.removeWorks();
                if(window.localStorage.user && window.localStorage.user != "underfined"){
                    let user = JSON.parse(window.localStorage.getItem("user"));
                    this.setUser(user)
    	        }
                this.removeCrumb();
                this.setCrumb('首页');
                this.getHomework();
//                this.getLatBook();
                window.addEventListener('load', ()=>{
                    this.windowOnLoad()
                   // this.renderCanvas();
                });

            })
        },
        mounted() {
            this.$nextTick(function () {
            })
          },
        watch: {
          '$attrs'(val) {
              if(val.loadMore && val.currentName) {
                console.log('home is ok loadData')
                this.loading = true
                this.pull_work()
              }

         }
        },
        methods: {
          ...mapGetters([
              'getUser'
          ]),
            ...mapActions([
                'setUser',
                'removeCrumb',
                'setCrumb',
                'cleanCatalog',
                'removeWorks'
            ]),
            //监听刷新事件，刷新页码变为1
            windowOnLoad(){
                this.PageIndex = 1;
               let path = this.$route.path;
               if(path.indexOf("/api") > -1){
                 this.pull_data = false;
               }

            },
            //重新开始布置作业
            TosetHomework(){
              const user = this.getUser();

              fetch.getDetailedInf({uin:user.userId}).then(res =>{
                  if(!res) {
                      return false;
                  }
                  let classRes = '';
                  this.teacherId = res.data.userId;
                  for(var i = res.data.classes.length-1,len = 0;i>=len;i--){
                      if(res.data.classes[i].userRole != 2){
                          res.data.classes.splice(i,1)
                      }
                  }
                  if(res.data.classes.length == 0) {
                      this.$toast("您还没有创建班级呢！", 'error')
                  }else{
                    this.$router.push({path:'selectObject', query:{bookType: 1}})
                  }
              })

            },
            //收回作业事件
            collectHomework(){
                this.homework();
                this.$toast("收取作业成功",'right')
            },
            //从最近布置的作业入口布置作业
//            setLastHomework(serviceId,packageId,bookName,bookId){
//                this.$router.push({path: 'publishHomeWork', query:{serviceId: serviceId, packageId:packageId, isFirst:1, bookName:bookName, bookId:bookId}});
//            },
            ToSethomeWork(){
              this.$router.push({path:'setHomework', query:{bookType: 1}})
            },
            arrowShow(){
                if(this.LastBookArr.length<=2){
                    return;
                }
                this.isShow = true;
                if(this.$refs.swider.style.left == 0){
                    this.$refs.arrowRight.style.display = "block";
                    this.$refs.arrowLeft.style.display = "none";
                }
            },
            arrowHide(){
                this.isShow = false;
            },
            toright(){
                //最多4本书，滑动一次就可以，距离写死了
                this.$refs.swider.style.left = "-940px";
                if(this.$refs.swider.style.left == "-940px"){
                    this.$refs.arrowLeft.style.display = "block";
                    this.$refs.arrowRight.style.display = "none";
                }
            },
            toleft(){
                this.$refs.swider.style.left = "0px";
                if(this.$refs.swider.style.left == "0px"){
                    this.$refs.arrowRight.style.display = "block";
                    this.$refs.arrowLeft.style.display = "none";
                }
            },
            //拿到分页组件返回的页数
            pageNum(val){
                this.PageIndex = val;
                // let canvas = document.querySelectorAll('canvas');
                // canvas.forEach(item=>{
                //   item.remove();
                // })
                this.getHomework();
            },
            pull_work(){
                this.PageIndex++;
                this.getHomework();
            },
            //设置请求参数
            setParams(){
                this.params = {
                    page: this.PageIndex,
                    pageSize: 5
                }
            },
            //先获取到需要参数，再发请求
            getHomework(){
                this.setParams();
                this.homework();
            },
            //发送请求拿布置作业数据
            homework(){

                fetch.homework(this.params).then(res => {
                    if(!res) {
                        return false;
                    }
                    this.showPage = true;
                    let homeworkData = [];
                    // let currentTime = res.data.currentTime
                    const currentTime = timeStamp(nowDate())
                    let homeworks = []


                    // this.historyHomework = res.data.pageList;
                    res.data.pageList.map(item=>{
                        item.state = closeDateState(currentTime, item.sendDate, item.effectiveDate);
                        item.stateText = closeDate(currentTime, item.sendDate, item.effectiveDate);
                        item.isShow_recall = false;
                        item.currentTime = currentTime



                        item.workList.forEach((item2) => {
                          item2.rush_state = 1;
                          item2.rush_result = false
                          item2.currentTime = currentTime
                          item2.effectiveDate = item.effectiveDate
                          item2.sendDate = item.sendDate
                            let submitTotal = 0
                            item2.workContents.forEach((item3) => {
                               submitTotal += item3.submitCount
                            })

                            if(submitTotal === 0) {
                              item2.complete_rate = 0
                              item2.decimals_rate = 0
                            } else {
                              item2.decimals_rate = (submitTotal/(item2.totalNum*item2.workContents.length)).toFixed(2)
                              item2.complete_rate = (item2.decimals_rate*100).toFixed(0).toString() + '%'
                            }
                        })
                        homeworks.push(item)
                    })
                    this.totalCount = res.data.totalCount;
                    this.PageCount = Math.ceil(res.data.totalCount/this.params.pageSize);

                    // if(this.PageIndex > 1 && !this.pull_data) {
                    //   this.historyHomework = this.historyHomework.concat(homeworks);
                    // }else{
                    //   this.historyHomework = homeworks;
                    // }
                    this.historyHomework = this.historyHomework.concat(homeworks);
          					this.loading = false
                })


            },
            renderCanvas(){
              let cavnasDoms = document.querySelectorAll('canvas');

              let objName = "canvasThree" + this.index_id;

               cavnasDoms.forEach(dom=>{
                // console.log('dom',dom.id)
                 let canvasObj = new DrawCanvas(dom.id, this.decimalsRate)
                  canvasObj.runCircle()

               })
            },
            removeWork(index,delIndex){
                this.historyHomework[delIndex].workList.splice(index,1);
                if( this.historyHomework[delIndex].workList.length<=0){
                    this.historyHomework.splice(delIndex,1);
                    if(this.historyHomework.length<=0){
                        this.getHomework()
                    }
                }
            }
        },
        components: {
            history,
            paging,
            progressBar
        }
    }
</script>
