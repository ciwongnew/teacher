<template>
	<div class="sendMsg">
		<div class="" v-show="greenBtn">
			<button class="button green sendBtn" @click="sendBtn">发送通知</button>
			<div class="MsgContent">
				<!-- <div class="msg" v-for="item in pageList" @click="showMsg(item)"> -->
				<div class="msg" v-for="(item, index) in pageList">
					<div class="message">
						<img src="./../../assets/img/msg.png" alt="消息">
						<pre ref="msgshow" class="main_contents">{{item.content.content}}</pre>
						<i @click="showMsg(item, index)" v-if="item.show_details == 'false'">展开</i>
						<i v-if="item.show_details == 'true'" @click="showMsg(item, index)">收起</i>
					</div>
					<div class="receiveMsg clearfix">

							<span class="receiveClass fl" :title="item.classNames">发送班级 : {{item.classNames}}</span>
							<span class="receiveTime fr">{{item.publishDate | formatDate('yyyy-MM-dd hh:mm')}}</span>
					</div>
				</div>
				<div class="loading_books" v-if="loading && pageIndex!==pageCount">
					<div class="load_line"></div>
					<p>正在加载中...</p>
				</div>
			</div>

			<notice :params="noticParams" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
			<!-- <paging :PagenumId="pageIndex" :PageCount="pageCount" @mypagenum="pageNum" v-show="pageList.length != 0"></paging> -->
		</div>
		<send v-show="!greenBtn" @backMsg="backMsg"></send>
		<div class="" style="text-align: center;margin-top: 100px;" v-if="pageList.length == 0">
			<img src="./../../assets/img/noMessage.png" alt="">
			<p style="color: #A6A6A6; margin-top: 10px;">您暂时还没发送校讯通知哦~</p>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { clientId, brandId } from "./../../config";
import fetch from "./../../fetch";
import paging from "./../paging/paging.vue";
import send from "./send.vue";
import notice from "./../notice/notice.vue";
import { nowDate, formatDate, aroundDate, timeStamp } from "./../../filter";

export default {
  data() {
    return {
      pageIndex: 1,
      pageCount: 2,
      greenBtn: true,
      params: {},
      pageList: [],
      isDone: true,
      isNotice: false,
      noticParams: {}
    };
  },
  props: ["loadData"],
  components: {
    paging,
    send,
    notice
  },
  created() {
    this.loading = false;
    this.$nextTick(() => {
      this.initData();
    });
  },
  watch: {
    loadData(val) {
      if (
        val.loadMore &&
        val.currentName.indexOf("schoolMsg") &&
        this.pageIndex < this.pageCount
      ) {
        this.loading = true;
        this.pull_work();
      }
    },
    pageList(val) {
      this.pageList = val;
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    ...mapGetters(["getUser"]),
    setParams() {
      let userInfo = this.getUser();
      this.params = {
        senderId: userInfo.userId,
        page: this.pageIndex,
        pageSize: 5,
        userType: 1
      };
    },
    initData() {
      this.setParams();
      fetch.getClassMsg(this.params).then(res => {
        if (!res) {
          return false;
        }
        if (res) {
          res.data.pageList.map((item, index) => {
            item.content = JSON.parse(item.content);
            // debugger
            if (item.content.content.length > 20) {
              item.show_details = "false";
            }
          });

          this.pageCount = Math.ceil(
            res.data.totalCount / this.params.pageSize
          );
          this.pageList = this.pageList.concat(res.data.pageList);
        }
      });
    },
    pageNum(val) {
      this.pageIndex = val;
      this.initData();
    },
    sendBtn() {
      this.greenBtn = false;
    },
    backMsg() {
      this.greenBtn = true;
      this.initData();
    },
    showMsg(item, index) {
      // this.isNotice = !this.isNotice;
      // this.noticParams = {type:4,
      // 					noticeText:item.content.content,
      // 					noticeTitle:"查看消息",
      // 					sender: item.classNames,
      // 					time: formatDate(item.publishDate, 'yyyy-MM-dd hh:mm'),
      // 					sendType: 1
      // 				}
      let reg = new RegExp("(^|\\s)" + "show_contents" + "(\\s|$)");
      let dom = this.$refs.msgshow[index];
      let newClass = dom.className.split(" ");

      if (reg.test(dom.className)) {
        dom.className = newClass.slice(0, newClass.length - 1).join(" ");
      } else {
        newClass.push("show_contents");
        dom.className = newClass.join(" ");
      }
      if (item.show_details == "true") {
        item.show_details = "false";
      } else {
        item.show_details = "true";
      }
    },
    isConfirm(val) {},
    pull_work() {
      this.pageIndex++;
      this.initData();
    }
  }
};
</script>
