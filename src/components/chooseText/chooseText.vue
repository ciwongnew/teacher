<template>
	<div class="footer">
		<p>
			<span  v-html="textNum"></span>
			<span  v-if="item.resourceType === ResType_Zaixianzuoda" style="padding-right: 10px;">
        已选&nbsp;&nbsp;<i style="color:#01B98F; padding-right: 3px;">{{item.bigItemCount}}</i>个大题
      </span>
			<span v-if="item.resourceType === ResType_DanCiGenDu || item.resourceType === ResType_Xuanzeduanluo || moduleId == 15 || item.resourceType === ResType_Zaixianzuoda">
				&nbsp;&nbsp;&nbsp;预计<i style="color: #00ba8f; padding: 0px 3px;">{{readTime}}</i>分钟
			</span>
		</p>
		<div class="choice clear">
			<span type="button" class="button write" @click="link">{{item.chooseText}}</span>
			<div class="selectSpeek" v-if="moduleId==10 || moduleId==127">
				<origin-select
					:data="speektypes"
					selectObj="types"
					@selecter="selecter"
					:defValue="speek_text"></origin-select>
			</div>
			<div class="selectRead" v-if="moduleId==10 || moduleId==127">
				<origin-select
					:data="readTimes"
					selectObj="times"
					@selecter="selecter"
					:defValue="time_text"></origin-select>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import selecter from "./../selecter/selecter.vue";
import { formatDataToMinutes } from "./../../filter";
import OriginSelect from "./../../components/originSelect/originSelect";

export default {
	  props: [
	    "moduleId",
	    "item",
	    "serviceId",
	    "packageId",
	    "cId",
	    "index",
	    "readTime"
	  	],

  data() {
    return {
      ResType_DanCiGenDu: "a7527f97-14e6-44ef-bf73-3039033f128e",
      ResType_Xuanzeduanluo: "992a5055-e9d0-453f-ab40-666b4d7030bb",
      ResType_Zaixianzuoda: "c458a8d4-e3ca-403c-b6b2-ae166e955590",
      chooseTotal: "",
      speektypes: [],
      readTimes: [
        { id: 1, name: "1次" },
        { id: 2, name: "2次" },
        { id: 3, name: "3次" }
      ],
      textNum: "",
      speek_text: "",
      time_text: "1次",
      timesId: 1,
      typesId: 1
    };
  },
  components: {
    selecter,
    OriginSelect
  },
  created() {
    this.chooseSpeek();
    this.$nextTick(() => {
      let resourceType = this.item.resourceType;
      if (
        resourceType == this.ResType_DanCiGenDu ||
        resourceType == this.ResType_Xuanzeduanluo
      ) {
        this.keep();
      }
    });
  },
  methods: {
    ...mapGetters(["getWorks"]),
    chooseSpeek() {
      if (this.item.resourceType == this.ResType_DanCiGenDu) {
        this.speek_text = "跟读";
        this.item.chooseText = "选择单词";
        this.speektypes = [{ id: 1, name: "跟读" }, { id: 2, name: "朗读" }];
        this.textNum = this.item.count
          ? "已选 &nbsp;" +
            '<i style="color:#01B98F">' +
            this.item.count +
            "&nbsp;</i>" +
            "个单词"
          : "全选";
      } else if (this.item.resourceType == this.ResType_Xuanzeduanluo) {
        this.speek_text = "跟读";
        this.item.chooseText = "选择段落";
        this.speektypes = [
          { id: 1, name: "跟读" },
          { id: 2, name: "朗读" },
          { id: 3, name: "背诵" }
        ];
        this.textNum = this.item.count
          ? "已选 &nbsp;" +
            '<i style="color:#01B98F">' +
            this.item.count +
            "&nbsp;</i>" +
            "</i>个段落"
          : "全选";
      } else if (this.moduleId == 15) {
        this.item.chooseText = "选择大题";
        this.textNum = this.item.count
          ? "已选 &nbsp;" +
            '<i style="color:#01B98F">' +
            this.item.count +
            "&nbsp;</i>" +
            "个大题"
          : "全选";
      } else if (this.item.resourceType == this.ResType_Zaixianzuoda) {
        this.textNum = "";
        this.item.chooseText = "预览";
      } else {
        this.item.chooseText = "预览";
      }
    },
    keep() {
      let works = this.getWorks();
      if (!works.contents || !works.contents.length) {
        return;
      }
      let contents = works.contents;
      for (var i = 0; i < contents.length; i++) {
        if (
          contents[i].parentVersionId == this.item.parentVersionId &&
          contents[i].versionId == this.item.versionId && contents[i].moduleId == this.moduleId
        ) {
          let requirementContent = JSON.parse(contents[i].requirementContent);
          this.timesId = requirementContent.readtimes;
          this.typesId = requirementContent.speekingtype;
          break;
        }
      }

      this.speek_text = this.speektypes[this.typesId-1].name
      this.time_text = this.readTimes[this.timesId-1].name
    //   this.speek_text = this.speektypes[this.typesId].name;
    //   this.time_text = this.readTimes[this.timesId].name;
    },
    link() {
      let item = this.item;
      let query = {
				moduleId: this.moduleId,
        parentVersionId: item.parentVersionId,
        versionId: item.versionId,
        resourceName: item.resourceName,
        timesId: this.timesId,
        readTime: this.readTime,
        resourceType: item.resourceType,
				selectFlag: true
        // serviceId: this.serviceId,
        // packageId: this.packageId,
        // cId: this.cId  //从vuex 重新取
      };
      if (this.moduleId == 10 || this.moduleId == 127) {
        //同步跟读
        if (this.item.resourceType == this.ResType_DanCiGenDu) {
          this.$router.push({ path: "readWords", query });
        } else if (item.resourceType == this.ResType_Xuanzeduanluo) {
          this.$router.push({ path: "selectText", query });
        }
      } else if (this.moduleId == 15) {
        //听说模考
        this.$router.push({ path: "selectListenSpeak", query });
      } else if (this.moduleId == 124) {
        //线上作答
        this.$router.push({ path: "selectOnlinePaper", query });
      }
    },
    // changeParams() {
    // 	let item = this.item;
    // 	let params = {
    // 		versionId: item.versionId,
    // 		parentVersionId: item.parentVersionId,
    // 		requirementContent: {
    // 			readtimes: this.my_readtimes,
    // 			speekingtype: this.my_speekingtype
    // 		},
    // 		index: this.index
    // 	}
    // 	this.$emit('changeParams', params);
    // },
    selecter(obj) {
      // if(obj.key == 'types') {
      // 	this.typesId = obj.value;
      // 	this.speek_text = obj.text;
      // } else if(obj.key == 'times') {
      // 	this.timesId = obj.value;
      // 	this.time_text = obj.text;
      // }
      if (obj.key == "types") {
        this.typesId = obj.index + 1;
        this.speek_text = obj.value;
      } else if (obj.key == "times") {
        this.timesId = obj.index + 1;
        this.time_text = obj.value;
      }

      let item = this.item;
      let params = {
        versionId: item.versionId,
        parentVersionId: item.parentVersionId,
        resourceType: item.resourceType,
        requirementContent: {
          readtimes: this.timesId,
          speekingtype: this.typesId
        },
        index: this.index
      };
      this.$emit("changeParams", params);
    }
  }
};
</script>
