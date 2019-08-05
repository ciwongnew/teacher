<template>
	<section class="publish clear">
		<div class="layer">
			<div class="work_title">
				<edit-input :defalutTitle="workName" @changeTitle="changeTitle"></edit-input>
			</div>
			<div class="main">
				<article class="secondBox">
					<div class="grids clear">
						<span class="choose">布置班级:</span>
						<div class="student_details">
							<ul>
								<li  v-for="(item, index) in checkClassArr">
									<span>{{item.className}}</span>
									<i>({{item.selectStudentLength}}/</i>
									<i>{{item.studentCount}})</i>
								</li>
							</ul>
						</div>
					</div>
					<div class=""
							style="color: #00ba8f; margin: 0px 0 40px 104px; font-size: 14px; cursor: pointer;"
							@click="adClass">
						调整班级
					</div>
				</article>

				<article class="secondBox contents" v-show="params_type != 2">
					<div class="grids clear">
						<span class="choose">作业内容&nbsp:</span>
						<div class="work_details">
							<p style="padding-left: 20px; font-size: 14px;background-color: #f4f4f4;color:#666;">共选
								<span style="color: #00ba8f; padding: 0 3px; font-weight: bold;">{{articles.length}}</span>
								条内容，预计
								<span style="color: #00ba8f; padding: 0 3px; font-weight: bold;">{{allTimes}}</span>
							分钟完成作业</p>
							<ul>
								<li  v-for="(item, index) in articles">
									<img src="../../assets/img/read.png" alt="" v-if="item.moduleId === 10 || item.moduleId === 127">
									<img src="../../assets/img/online.png" alt="" v-if="item.moduleId === 124">
                  <img src="../../assets/img/video.png" alt="" v-if="item.moduleId === 126">
									<img src="../../assets/img/listen.png" alt="" v-if="item.moduleId === 15">
									<span>{{item.resourceName}}</span>
									<span v-if="item.moduleId == 10 || item.moduleId == 127">
										<span v-if="item.versionId == 0">({{words_text[JSON.parse(item.requirementContent).speekingtype-1]}}</span>
										<span v-else>({{text_text[JSON.parse(item.requirementContent).speekingtype-1]}}</span>
										<span>/{{JSON.parse(item.requirementContent).readtimes}}次)</span>
									</span>
									<span class="preview" @click="preview(item, index)" v-show="item.moduleId !== 126">预览</span>
								</li>
							</ul>

						</div>
						<div class=""
								style="color: #00ba8f; margin-top: 20px; margin-left: 104px; font-size: 14px; cursor: pointer;"
								onclick="javascript:history.back(-1);">
							调整内容
						</div>
					</div>

				</article>

				<article class="secondBox">
					<div class="grids time clear">
						<span class="choose">发布时间&nbsp:</span>
						<div class="selectTime">
                <p class="radio" @click="modify(1)" :class="{'active': !dateShow}">
									立即发布
                </p>
                <p class="radio"  @click="modify(2)" :class="{'active': dateShow}">
									 定时发布
                </p>
				<div class="" v-show="dateShow" style="display: inline-block;">
					<input id="myIDSecond" v-model="sendDate" class="timing"/>
					<div class="times sel_hours">
						<origin-select :data="23" selectObj="time_hours" @selecter="selecter" :defValue="default_V.defHour"></origin-select>
						<p>时</p>
					</div>
					<div class="times sel_minutes">
						<origin-select :data="59" selectObj="time_minutes" @selecter="selecter" :defValue="default_V.defMinute"></origin-select>
						<p>分</p>
					</div>
				</div>
            </div>
					</div>
				</article>

				<article class="secondBox">
					<div class="grids time">
						<span class="font_14">截止时间&nbsp:</span>
						<input id="myID" v-model="completeDate" class="timing" style="margin-left: 35px;"/>
						<div class="times sel_hours">
							<origin-select :data="23" selectObj="hours" @selecter="selecter" :defValue="default_V.defHour"></origin-select>
							<p>时</p>
						</div>
						<div class="times sel_minutes">
							<origin-select :data="59" selectObj="minutes" @selecter="selecter" :defValue="default_V.defMinute"></origin-select>
							<p>分</p>
						</div>
					</div>
				</article>
				<article class="firstBox">

					<div class="grids clear">
						<span class="font_14">作业留言&nbsp:</span>
						<div class="workMessage">
							<textarea maxlength="100" class="textarea" v-model="workMessage" placeholder="同学们，请按时完成作业哦！"></textarea>
							<i class="smallpro">您最多可以输入<i style="color: #00ba8f;">100</i>个字</i>
						</div>
					</div>
				</article>


				<article class="footerBox">

					<div>
						<input type="button" value="确认发布" id="btn" class="button green" @click="publish">
					</div>
				</article>

			</div>
      <notice :params="noticParams" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
		</div>
	</section>
</template>

<script>
import classcom from "./../checkboxLabel/checkboxLabel.vue";
import notice from "./../../components/notice/notice.vue";
import EditInput from "./../../components/editInput/editInput";
import { clientId, brandId } from "./../../config";
import fetch from "./../../fetch";
import {
  nowDate,
  formatDate,
  aroundDate,
  timeStamp,
  formatDataToMinutes
} from "./../../filter";
import { mapGetters, mapActions } from "vuex";
import OriginSelect from "./../../components/originSelect/originSelect";

export default {
  data() {
    return {
      grads: [],
      selectedClass: [],
      workName: "",
      completeDate: "",
      dateShow: "",
      sendDate: "",
      workMessage: "",
      isNotice: false,
      noticParams: {},
      publishType: "",
      examinationID: "",
      examinationTitle: "",
      paperScore: "",
      clickIndex: 1,
      paperSubjectId: Number,
      allTimes: 0,
      articles: [],
      words_text: ["跟读", "朗读"],
      text_text: ["跟读", "朗读", "背诵"],
      allCheckClassArr: [],
      partCheckClassArr: [],
      checkClassArr: [],
      check: "",
      params_type: 0,
      defalutTitle: "选择",
		  seltime: {},
		  default_V: {}
    };
  },
  components: {
    classcom,
    notice,
    EditInput,
    OriginSelect
  },
  created() {
    this.$nextTick(() => {
	  this.default_V.defHour = formatDate(timeStamp(), "hh")
	  this.default_V.defMinute = formatDate(timeStamp(), "mm")
      this.setCrumb("布置作业");
      this.initData();
    });
  },
  methods: {
    ...mapActions(["setCrumb", "setWorks", 'cleanCatalog', 'removeWorks', 'removeSubject']),
    ...mapGetters(["getWorks"]),
    changeTitle(val) {
      this.workName = val;
    },
    selLi(item) {
      item.setQuestionId = !item.setQuestionId;
    },
    initData() {
			if (!this.getWorks().contents) {
				this.$router.push({ path: "/" });
				return
			}
      let params = this.$route.query;
      this.params_type = params.type;
      if (params.type == 2) {
        this.publishType = params.type;
        this.examinationID = params.paper.examinationID;
        this.paperSubjectId = params.paper.subjectID;
        this.paperScore = params.paper.refScore;
        this.examinationTitle = params.paper.examinationTitle;
        // this.workName = formatDate(timeStamp(), 'y年M月dd日')+this.examinationTitle;
        this.workName = this.examinationTitle;
      } else {
        let selectedWorkName = params.selectedWorkName.substr(
          0,
          params.selectedWorkName.length - 1
        );
        // this.workName = formatDate(timeStamp(), 'y-M-dd')+'作业';
        this.workName = selectedWorkName;
        this.articles = this.getWorks().contents;
        this.articles.map(item => {
          if (item.refLong) {
            this.allTimes += item.refLong;
          }
        });
      }
      this.completeDate = formatDate(aroundDate("", 1) / 1000, "yyyy-MM-dd");

      this.getClass();
      this.initPage();
    },
    initPage() {
      document.getElementById("myID").flatpickr({
        dateFormat: "Y-m-d",
        minDate: "today",
        time_24hr: false,
        shorthandCurrentMonth: true,
        enableTime: false
      });
      let _this = this;
      document.getElementById("myIDSecond").flatpickr({
        dateFormat: "Y-m-d",
        minDate: "today",
        time_24hr: false,
        shorthandCurrentMonth: true,
        enableTime: false,
        onChange: function(selectedDates) {
          _this.completeDate = formatDate(
            aroundDate(selectedDates, 1) / 1000,
            "yyyy-MM-dd"
          );
        }
      });
    },
    getClass() {
      this.checkClassArr = this.getWorks().classList;
    },
    modify(type) {
      this.check = !this.check;
      if (type == 2) {
        this.dateShow = true;
        this.sendDate = formatDate(timeStamp(), "yyyy-MM-dd");
      } else {
        this.dateShow = false;
        this.sendDate = 0;
      }
    },
    selClass(obj) {
      if (obj.checked) {
        this.selectedClass.push(obj.id);
      } else {
        let index = this.selectedClass.indexOf(obj.id);
        this.selectedClass.splice(index, 1);
      }
    },
    adClass() {
      this.isNotice = !this.isNotice;
      this.noticParams = {
        type: 1,
        noticeText: "调整班级后，已添加的作业内容将会被删除，确定调整班级？",
        noticeTitle: "系统提示"
      };
    },
    preview(item, index) {
      let query = {
				resourceName: item.resourceName,
        parentVersionId: item.parentVersionId,
        versionId: item.versionId,
        moduleId: item.moduleId,
        checkedResource: item.checkedResource,
				readTime:item.refLong,
        resourceType: item.resourceType,
        selectFlag:false
        // cId: item.cId
      };
      if (item.moduleId == 10 || item.moduleId == 127) {
        //同步跟读
        if (item.resourceType == "a7527f97-14e6-44ef-bf73-3039033f128e") {
          this.$router.push({ path: "readWords", query });
        } else if (
          item.resourceType == "992a5055-e9d0-453f-ab40-666b4d7030bb"
        ) {
          this.$router.push({ path: "selectText", query });
        }
      } else if (item.moduleId == 15) {
        //听说模考
        this.$router.push({ path: "selectListenSpeak", query });
      } else if (item.moduleId == 124) {
        //线上作答
        this.$router.push({ path: "selectOnlinePaper", query });
      }
    },
    selecter(obj) {
      if (obj.key === "hours") {
        this.seltime.selhours = obj.value;
      } else if (obj.key === "minutes") {
        this.seltime.selminutes = obj.value;
      } else if (obj.key === "time_hours") {
        this.seltime.time_hours = obj.value;
      } else if (obj.key === "time_minutes") {
        this.seltime.time_minutes = obj.value;
      }
      console.log("seltime", this.seltime);
    },
    publish() {
      document.getElementById("btn").disabled=true;

      let time_hours = this.seltime.time_hours ? this.seltime.time_hours : this.default_V.defHour;
      let time_minutes = this.seltime.time_minutes
        ? this.seltime.time_minutes
		: this.default_V.defMinute;

      let selhours = this.seltime.selhours ? this.seltime.selhours : this.default_V.defHour;
      let selminutes = this.seltime.selminutes ? this.seltime.selminutes : this.default_V.defMinute;

      let sendDate = this.sendDate + " " + time_hours + ":" + time_minutes;
      let completeDate = this.completeDate + " " + selhours + ":" + selminutes;

      let obj = {
        // workName: this.workName || formatDate(timeStamp(), 'y年M月dd日')+this.selectedWorkName,
        workName: this.workName,
        workMessage: this.workMessage || "同学们请按时完成作业",
        completeDate: timeStamp(completeDate), //
        sendDate: this.sendDate ? timeStamp(sendDate) : 0
        // classList: gradsList
      };

      if (obj.completeDate < obj.sendDate) {
        this.$toast("作业发送时间不能大于作业截止时间！", "error");
        return false;
      }
      if (this.publishType == 2) {
        obj = Object.assign({}, obj, {
          workMessageType: 1,
          publishType: 1,
          sourceType: clientId,
          workType: 0,
          userList: this.getWorks().userList,
          bookId: 0,
          bookName: "",
          subjectId: this.paperSubjectId
        });
        let contents = [
          {
            workTag: 2,
            moduleId: 124,
            versionId: this.examinationID,
            packageId: "0",
            cId: "0",
            parentVersionId: "0",
            resourceName: this.examinationTitle,
            resourceType: "1f693f76-02f5-4a40-861d-a8503df5183f",
            checkedResource: "",
            requirementContent: {
              readtimes: 1,
              speekingtype: 1
            },
            workScore: this.paperScore
          }
        ];
        this.setWorks({ contents: [] });
        this.setWorks({ contents: contents });
      }
      this.setWorks(obj);
      let workData = this.getWorks();
      fetch.publish(workData).then(res => {
        if (!res) {
          return false;
        }

				this.cleanCatalog()
				this.removeWorks()
				this.removeSubject()
        window.sessionStorage.setItem("pageIndex", 1);
        // this.noticParams = {type:2, noticeText:"发布作业成功!",noticeTitle:"操作提示"}
        this.$toast("发布作业成功", "right");
        var _this = this;
        var t = setTimeout(function() {
          _this.$router.push({ path: "/" });
        }, 3000);
      });
    },
    isConfirm() {
      let query = {
        bookType: 1
      };
      this.$router.push({ path: "selectObject", query });
    }
  }
};
</script>
