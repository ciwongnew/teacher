<template>
	<div class="watchStuHead">
		<div class="watContent">
			<div class="watConTitle">
				<img :src="useInfo.avatar" style="display: inline-block;" v-if="useInfo.avatar&&useInfo.avatar.length>0">
				<img src="./../../assets/img/photo.png" style="display: inline-block;" v-else>
				<div class="realName">
				   <p class="studenName">
				     <span>{{useInfo.realName}}</span>
				     <!-- <img :src="this.toSex(useInfo.sex)"> -->
				   </p>
                   <p class="studenNum"><span style="color: #999;">学生号 : </span><span>{{useInfo.userId}}</span></p>
				</div>
			</div>
<!-- 			<span class="spaceline"></span> -->
			<ul class="stuConCount">
				<li>
					<b class="tabScore">{{userScore | toMath(2, '-')}}</b>
					<span class="tabScoreTip">分数</span>
				</li>
				<li>
					<b class="tabScore">{{userRank}}</b>
					<span class="tabScoreTip">名次</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return {
          src:''
			}
		},
		props:['useInfo','userScore', 'userRank'],
		created(){
          
        },
        methods:{
          toSex(sex){
            return sex==1?"../../../assets/img/boy.png":"../../../assets/img/girl.png";
          }
        }
    }
</script>