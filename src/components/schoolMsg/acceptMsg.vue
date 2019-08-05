<template>
    <div class="acceptMsg">
        <div class="systemMessagesBGC" v-if="arr.length>0">
            <div class="MsgContent">
                <!-- <div class="msg" v-for="(item, index) in arr"  @click="messages(item)"> -->
                <div class="msg" v-for="(item, index) in arr">
                    <div class="message">
                        <p>
                          <i v-if="item.content.imgUrl" style="vertical-align: top;">【有图】</i>

                          <span style="float: left;">{{item.title}}</span>
                          <pre style="padding-left: 10px;" ref="msgshow" class="main_contents">{{item.content.content}}</pre>
                          <!-- <pre style="padding-left: 10px;">{{item.content.content}}</pre> -->
                          <i @click="showMsg(index, item)" v-if="item.show_details == 'false'">展开</i>
              						<i v-if="item.show_details == 'true'" @click="showMsg(index, item)">收起</i>
                        </p>
                        <img :src="item.content.imgUrl" alt="" v-show="item.show_details == 'true'">
                    </div>
                    <div class="senderInfo">
                      <p class="sender">发送人：{{item.senderName}}</p>
                      <p class="TimeBox">
                          {{item.publishDate | formatDate('yyyy-MM-dd hh:mm')}}
                      </p>
                    </div>
                </div>
                <div class="loading_books" v-if="loading && PageIndex!==PageCount">
        					<div class="load_line"></div>
        					<p>正在加载中...</p>
        				</div>
            </div>
            <!-- <paging :PagenumId="PageIndex" :PageCount="PageCount" @mypagenum="pageNum" v-show="isDone"></paging> -->
            <notice :params="params" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
        </div>
        <div style="text-align: center; margin-top: 200px;" v-if="!isDone">
    			<img src="./../../assets/img/noMessage.png" alt="">
    			<p style="color: #A6A6A6; margin-top: 10px;">放心吧，有消息我们会马上通知您的~</p>
    		</div>
    </div>
</template>

<style scoped>

</style>

<script>
import { mapActions, mapGetters } from "vuex";
import fetch from "./../../fetch";
import filter from "./../../filter";
import paging from "./../paging/paging.vue";
import notice from "./../notice/notice.vue";
import { nowDate, formatDate, aroundDate, timeStamp } from "./../../filter";

export default {
  data() {
    return {
      PageIndex: 1,
      PageCount: 2,
      arr: [],
      isNotice: false,
      params: {},
      isDone: true,
      activeMsg: false
    };
  },
  props: ["loadData"],
  components: {
    paging,
    notice
  },
  created() {
    this.loading = false;
    this.$nextTick(() => {
      this.getMessages();
    });
  },
  watch: {
    loadData(val) {
      // debugger
      if (
        val.loadMore &&
        val.currentName.indexOf("schoolMsg") &&
        this.PageIndex < this.PageCount
      ) {
        this.loading = true;
        this.pull_work();
      }
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    ...mapGetters(["getUser"]),
    messages(item) {
      item.msgStatus = 1;
      fetch.setRead({ msgIds: item.msgId }).then(res => {});
      //   this.isNotice = !this.isNotice;
      //   this.params = {
      //       type:4,
      //       noticeText:item.content.content,
      //       noticeTitle:"查看消息",
      //       noticeSrc:item.content.imgUrl,
      //       sender: item.senderName,
      //       time: formatDate(item.publishDate, 'yyyy-MM-dd hh:mm'),
      //       sendType: 2
      // }
    },
    isConfirm(val) {},
    showMsg(index, item) {
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
    setParams() {
      this.param = {
        msgType: 30,
        page: this.PageIndex,
        pageSize: 6
      };
    },
    getMessages() {
      this.setParams();
      this.getData();
    },
    getData() {
      fetch.getSystemMessages(this.param).then(res => {
        if (!res) {
          this.isDone = false;
          return false;
        }
        res.data.pageList.map(item => {
          if (item.content.content.length > 60 || item.content.imgUrl) {
            item.show_details = "false";
          }
          this.messages(item);
        });
        // this.arr = res.data.pageList;

        this.PageCount = Math.ceil(res.data.totalCount / this.param.pageSize);
        this.arr = this.arr.concat(res.data.pageList);
        if (this.arr.length == 0) {
          this.isDone = false;
        }
      });
    },
    pageNum(val) {
      this.PageIndex = val;
      this.getMessages();
    },
    pull_work() {
      this.PageIndex++;
      this.getMessages();
    }
  }
};
</script>
