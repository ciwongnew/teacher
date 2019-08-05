<template>
    <div class="bigBox">
        <div class="box">
            <div class="boxTitle">
                班级服务使用情况
            </div>
            <div class="boxContent">
                <table cellspacing="0" border="1" id="tb">
                    <tr class="thead">
                        <td style="width: 140px;">姓名</td>
                        <td style="width: 240px;">服务名称</td>
                        <td style="width: 190px;">开通时间</td>
                        <td style="width: 190px;">到期时间</td>
                    </tr>
                    <tbody class="tddd" v-if="params.serviceArr.length>0" v-for="item in serviceArr">
                        <tr v-for="(service, index) in item.serviceArr">
                            <td  :rowSpan="index == 0?item.serviceArr.length: 1" v-if="index == 0">{{item.userName}}</td>
                            <td>
                                <div>{{service.ServiceTypeName}}</div>
                                <div class="buy" :class="{noBuy:!service.IsBuy}"></div>
                            </td>
                            <td>{{service.StartTime}}</td>
                            <td>{{service.ExpireTime}}</td>
                        </tr>
                    </tbody>
                    <tr class="tddd" v-if="params.serviceArr.length==0">
                        <td>——</td>
                        <td>——</td>
                        <td>——</td>
                        <td>——</td>
                    </tr>
                </table>
            </div>
            <div class="noticeClose" @click="closeNotice"></div>
            <div class="noticeBottom serviceBottom" @click="serviceExcel">
                <button class="serviceExcel"><a :href='url'>导出服务详情</a></button>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
    import {clientId, brandId, http} from './../../config'
    export default{
        data(){
            return {
                isConfirm:false,
                serviceArr: [],
                url:''
            };
        },
        props:['params'],
        created(){
            this.$nextTick(() => {
                if (this.params && this.params.serviceArr){
                    this.serviceArr = this.params.serviceArr
                    for(let i=0,lenI=this.serviceArr.length;i<lenI;i++){
                        let itemArr=this.serviceArr[i];
                        itemArr.serviceArr = itemArr.IsBuyArr;
                        itemArr.serviceArr=itemArr.serviceArr.concat(itemArr.IsTryArr);

                    }
                    // const tb = document.querySelector("#tb")
                    // this.autoRowSpan(tb,0,0);
                }
            })
        },
        methods: {
            abolish(){
                this.$emit('isConfirm', this.isConfirm);
                document.body.style.overflow="auto";
            },
            ensure(){
                this.isConfirm = true;
                this.$emit('isConfirm', this.isConfirm);
                this.isConfirm = false;
                document.body.style.overflow="auto";
            },
            closeNotice(){
                this.$emit('isConfirm', this.isConfirm);
            },
            //表格合并相同值方法
            autoRowSpan(tb, row, col){
                var lastValue = "";
                var value = "";
                var pos = 1;
                for (var i = row; i < tb.rows.length; i++) {
                    value = tb.rows[i].cells[col].innerText;
                    if (lastValue == value) {
                        tb.rows[i].deleteCell(col);
                        tb.rows[i - pos].cells[col].rowSpan = tb.rows[i - pos].cells[col].rowSpan + 1;
                        pos++;
                    } else {
                        lastValue = value;
                        pos = 1;
                    }
                }
            },
            serviceExcel(){
                let classId = this.params.classId;
                let urlStr = http + "/gateway/v1/student/exportClassServicesByExcel?classId="+classId+"&brandId="+brandId+"&clientId="+clientId;
                this.url = urlStr;
            }
        }
    }
</script>
