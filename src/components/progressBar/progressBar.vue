<template lang="html">
    <div class="progressBar clear">
      <div class="surePass" >
        <div class="anyield">
            <p>完成率</p>
            <p>{{completeRate}}</p>
            <!-- <p>{{decimalsRate}}</p> -->
          </div>
        <canvas class="circleRun" data-run="0" :id="'canvasThree'+index_id"  :decimalsRate="decimalsRate"  amout="1000" nowData="1000" ref="canvasDom"></canvas>
      </div>
    </div>
</template>

<script>
import DrawCanvas from "./../../unit/progressBar.js"

export default {
  data() {
    return {
      canvasC: "",
      option: "",
      imageAir: "",
      startA: "",
      rotataRadians: "",
      context: "",
      x: "",
      y: "",
      R1: "",
      outerColorStart: "",
      outerColorMid: "",
      outerColorEnd: "",
      innerColorStart: "",
      innerColorEnd: "",
      circleBottomColor: "",
      lineW0: "",
      R0: "",
      lineW1: "",
      startAa: "",
      ra: "",
      imgX: "",
      imgY: "",
      imgWidth: "",
      imgHeight: "",
      Timer: ""
    };
  },
  props: ["index_id", "decimalsRate", "completeRate", "PageIndex"],
  created() {
    this.$nextTick(() => {
      this.initData();
    });
  },

  methods: {
    initData() {
      let objName = "canvasThree" + this.index_id;
      this.runCircle({ obj: objName, percent: this.decimalsRate });
    },
    runCircle(settings) {
      var defaultSetting = {
        url: "./static/green_point.png", //飞机小图地址
        obj: "", //场景添加的canvas id 名
        percent: 0, //圆环转动的百分比  0-1
        circleBottomColor: "#e3f1ee", //圆环底色
        outerColorStart: "#fff", //外部圆环 渐变色
        outerColorMid: "#fff",
        outerColorEnd: "#fff",
        innerColorStart: "#88dbc8", //内部圆环 渐变色
        innerColorEnd: "#88dbc8"
      };

      Object.extend = function(destination, source) {
        for (var property in source) {
          destination[property] = source[property];
        }
        return destination;
      };
      this.option = Object.extend(defaultSetting, settings);

      var obj = this.option.obj;

      var percent = this.option.percent;
      this.outerColorStart = this.option.outerColorStart;
      this.outerColorMid = this.option.outerColorMid;
      this.outerColorEnd = this.option.outerColorEnd;
      this.innerColorStart = this.option.innerColorStart;
      this.innerColorEnd = this.option.innerColorEnd;
      this.circleBottomColor = this.option.circleBottomColor;

      var preA = Math.PI / 180;

      this.canvasC = document.getElementById(obj);  //this.$refs.canvasDom
      // this.canvasC = this.$refs.canvasDom;
      // console.log('ById',this.canvasC)
      // console.log('refs',this.$refs.canvasDom)


      // if(!this.canvasC) return

      /*控制运动*/
      this.context = this.canvasC.getContext("2d");

      var windowW = parseInt(this.canvasC.parentNode.offsetWidth); //parentNode

      this.lineW1 = 13;
      this.lineW0 = 10;

      if (windowW > 500) {
        this.lineW1 = 36;
        this.lineW0 = 10;
      }
      var canvasW = windowW * 0.6;
      var R = parseInt(canvasW / 2 - 2 * this.lineW1 - 2 * this.lineW0 - 10);
      this.R0 = parseInt(canvasW / 2 - this.lineW0 - 4);
      this.R1 = parseInt(canvasW / 2 - this.lineW1 - this.lineW0 - 10);
      this.ra = parseInt(canvasW / 2 - this.lineW0 / 2 - 25); //改这里
      var canvasH = canvasW;
      var rotateAngle = percent * 360;
      var anotherA = 0;
      if (percent > 0.5) {
        anotherA = (percent - 0.5) * 360 * preA;
      }
      this.rotataRadians = preA * rotateAngle;
      this.canvasC.width = canvasW;
      this.canvasC.height = canvasH;

      this.x = this.canvasC.width / 2;
      this.y = this.canvasC.height / 2;
      this.startAa = -Math.PI / 2;
      this.startA = 0;

      var preSceond = 100 / (Math.PI * 2);
      this.CanvasApp();
      this.context.fillStyle = '#ff0'
      this.context.fillText(percent, 20, 20)
    },
    CanvasApp() {
      var loading = 0;
      let _this = this;
      var imageUrl = this.option.url;
      this.canvasC.setAttribute("data-run", "1");


      this.imageAir = new Image();
      this.imageAir.onload = function() {
        _this.imgWidth = _this.option.imgWidth || _this.imageAir.width;
        var imgHeight = _this.option.imgHeight || _this.imageAir.height;
        _this.imgX = -_this.imgWidth/2 -3;
        _this.imgY = -_this.imgHeight/2 -8;
        _this.drawScreen();
      };
      this.imageAir.src = imageUrl;
    },
    drawScreen() {
      let _this = this;

      if (this.startA < this.rotataRadians) {
        this.startA += 0.1;
      }


      this.context.fillStyle = "#fff";
      this.context.fillRect(0, 0, this.canvasC.width, this.canvasC.height);

      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.fillRect(0, 0, this.canvasC.width, this.canvasC.height);
      this.context.translate(this.x, this.y);
      this.context.rotate(-Math.PI / 2);

      // //中环
      this.context.beginPath();
      this.context.strokeStyle = this.circleBottomColor;
      this.context.lineWidth = this.lineW1;
      this.context.arc(0, 0, this.R1, 0, Math.PI * 2, false);
      this.context.stroke();
      this.context.closePath();
      //
      // // Linear gradients
      this.context.beginPath();
      var gradient2 = this.context.createLinearGradient(this.R1, 0, -this.R1, 0);
      gradient2.addColorStop(0, this.innerColorStart);
      gradient2.addColorStop(1, this.innerColorEnd);
      this.context.lineCap = "round";
      // this.context.strokeStyle = "#88dbc8";
      this.context.strokeStyle = gradient2;

      this.context.lineWidth = this.lineW1;
      this.context.arc(0, 0, this.R1, 0, this.startA, false);
      this.context.stroke();
      this.context.closePath();
      //
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      var ax = this.ra * Math.cos(this.startAa);
      var ay = this.ra * Math.sin(this.startAa);
      this.context.translate(this.x + ax, this.y + ay);
      this.context.rotate(this.startAa);
      this.context.drawImage(_this.imageAir, _this.imgX, _this.imgY, 12, 12);
      this.context.restore();
      // //画图
      if (this.startAa < this.rotataRadians - Math.PI / 2) {
        this.startAa += 0.1;
        this.canvasC.setAttribute("data-run", "1");
        clearInterval(this.Timer);
      } else {
        clearInterval(this.Timer);
        this.canvasC.setAttribute("data-run", "0");
        return false
      }

      this.Timer = setInterval(this.drawScreen, 20);
    }
  }
};
</script>

<style lang="css">

</style>
