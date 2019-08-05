<template>
	<div class="rank mt-120">
		<div class="tabContent viewport">
           <h3 class="tabConTitle" :title='currentTitle'>{{currentTitle}}</h3>
            <!-- <p class="tabConTip">布置对象：{{currentObj}}</p> -->
            <button class="button btn-size" :class='{green:stateGreen==true,gray:stateGray==true,orange:stateOrange==true}'>{{stateText}}</button>
              <div v-if='stateOrange' class="unPublish">
                <p class="unPublishTime"></p>
                <p class="tabConTip">距离发布时间还有：{{endTime}}</p>
              </div>
              <div v-else>
                <p class="tabConTip" v-if='stateBtn'>距离截止时间还剩：{{endTime}}</p>
                <ul class="tabConCount clearfix">
                  <li>
                    <b class="tabScore">{{rankStatistics.max>=0?rankStatistics.max:'-'}}</b>
                    <span class="tabScoreTip">最高分</span>
                  </li>
                  <li>
                    <b class="tabScore">{{rankStatistics.min>=0?rankStatistics.min:'-'}}</b>
                    <span class="tabScoreTip">最低分</span>
                  </li>
                  <li>
                    <b class="tabScore">{{rankStatistics.average>=0?rankStatistics.average:'-'}}</b>
                    <span class="tabScoreTip">平均分</span>
                  </li>
                </ul>
              </div>
		</div>
		<div class="socreRank viewport">
			<ul class="socreRankTitle">
				<li class="active">
					成绩排名
				</li>
				<!-- <li>
					错题统计
				</li> -->
			</ul>
			<div class="rankWorkTable">
				<rankWorkTable :list="rankRecords" :unlist="unRecords" :hList="rankcontentList"></rankWorkTable>
			</div>
		</div>
	</div>
</template>
<script>
import fetch from "./../../fetch";
import { mapGetters, mapActions } from "vuex";
import Temporalitaet from "./../../unit/Temporalitaet";
import rankWorkTable from "../rankWorkTable/rankWorkTable";

export default {
  components: {
    rankWorkTable
  },
  data() {
    return {
      rankcontentList: [], //tab栏内容
      rankStatistics: [], //分数
      unRecords: [], //学生记录（有成绩或者班级信息）
      rankRecords: [],
      allWorkId: "", //记录总成绩ID
      currentTitle: "", //当前tab栏对应的title
      endTime: "", //作业结束时间
      stateOrange: false, //未发布
      stateGreen: false, //进行中
      stateGray: false, //已结束
      arrShow: false, //箭头显示与隐藏
      stateText: "进行中", //作业状态
      stateBtn: true,
      arrShow: false, //tab栏箭头状态
      allData: new Array() //存储所有数据
    };
  },
  created() {
    this.$nextTick(() => {
      this.setCrumb("成绩汇总");
      this.rankData();
      alert(11);
    });
  },
  watch: {
    $route: "rankData"
  },
  methods: {
    ...mapGetters(["getWorks"]),
    ...mapActions(["setWorks", "setCrumb"]),
    rankData() {
      let params = this.$route.params;
      alert(params);
      this.allWorkId = params.workId;
      const differenceTimePub =
        params.sendDate - parseInt(new Date().getTime() / 1000);
      if (differenceTimePub > 0) {
        this.stateText = "未发布";
        this.stateOrange = true;
        this.endTime = Temporalitaet.timeStamp(differenceTimePub);
      } else {
        const differenceTimeEff =
          params.effectiveDate - parseInt(new Date().getTime() / 1000);
        if (differenceTimeEff < 0) {
          this.stateText = "已结束";
          this.stateGray = true;
        } else {
          this.endTime = Temporalitaet.timeStamp(differenceTimeEff);
          this.stateGreen = true;
        }
      }
      this.toFetchWorkId(params);
    },
    toFetchWorkId(params) {
      fetch.rankWork(params).then(res => {
        if (!res) {
          return false;
        }
        let rankHeader = res.data.header;
        // this.rankcontentList=res.data.header;
        this.currentTitle = res.data.work.workName;
        if (!res.data.records) {
          let allStudents = res.data.classInfo.members;
          for (let i = 0, len = allStudents.length; i < len; i++) {
            let item = allStudents[i];
            item.isShow = 0;
            item.tabDatas = new Array(rankHeader[2].length);
            this.unRecords.push(item);
            this.rankRecords = [];
          }
        } else {
          this.rankStatistics = res.data.statistics;
          this.rankStatistics.max = this.toMathTwo(res.data.statistics.max);
          this.rankStatistics.min = this.toMathTwo(res.data.statistics.min);
          this.rankStatistics.average = this.toMathTwo(
            res.data.statistics.average
          );
          this.rankStatistics.passRate = this.toPercent(
            this.rankStatistics.passRate
          );
          this.rankStatistics.excellentRate = this.toPercent(
            this.rankStatistics.excellentRate
          );
          //学生信息合并
          let allStudents = res.data.receivers;
          let rankRecords = res.data.records;
          let unreceivers = res.data.unreceivers;

          for (let i = 0, len = allStudents.length; i < len; i++) {
            let item = allStudents[i];
            item.isShow = 0;
            item.tabDatas = new Array(rankHeader[2].length);

            for (let j = 0, rLen = rankRecords.length; j < rLen; j++) {
              if (rankRecords[j].userId == item.userId) {
                Object.assign(item, rankRecords[j]);
                item.isShow = 1;
                this.rankRecords.push(item);
              }
            }
            if (item.isShow == 0) {
              this.unRecords.push(item);
            }
          }
          for (let k = 0, kLen = unreceivers.length; k < kLen; k++) {
            let item = unreceivers[k];
            item.isShow = -1;
            item.tabDatas = new Array(rankHeader[2].length);
            this.unRecords.push(item);
          }
        }
      });
    },
    toMathTwo(num) {
      let str = (str = parseFloat(parseFloat(num).toFixed(2)));
      return str;
    },
    toPercent(point) {
      let str = Number(point * 100).toFixed(0);
      str += "%";
      return str;
    }
  }
};
</script>
