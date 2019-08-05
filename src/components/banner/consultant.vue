<template>
    <div class="consultant"  v-if="loginState == 2">
        <div class="consultantText">教育顾问</div>
        <div class="consultantBox box-shadow2">
            <div class="consultantLeft">
                <span>{{cousultants.userName}}</span>
                <div class="consultantP">
                    <table>
                        <tr>
                            <td><i>手机号:</i></td>
                            <td>{{cousultants.mobile}}</td>
                        </tr>
                        <tr>
                            <td><i>QQ号:</i></td>
                            <td>{{cousultants.qq}}</td>
                        </tr>
                        <tr>
                            <td><i>备注:</i></td>
                            <td>{{cousultants.desc}}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="consultantRight">
                <img :src="cousultants.qrcode" alt="">
                <p>扫码加微信</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {};
        },
        props:['loginState','cousultants']
    }
</script>