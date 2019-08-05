<template>
    <div class="menuBanner">
        <!-- <div class="menuContent" v-if="lens != 1">
            <ul>
                <li v-for="(item, index) in navData">
                    <span v-if="index == lens" :class="{current:index == lens}">{{item[0]}}</span>
                    <a v-else :href="item[1]"><span>{{item[0]}}</span><span style="color: #b8b8b8">&nbsp;&gt;&nbsp;</span></a>
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default{
        data(){
            return {
                navData: [],
                lens: Number
            };
        },
        watch:{
            navData(){
                this.lens = this.navData.length - 1;
                console.log("lens",this.lens)
            }
        },
        created () {
           this.$nextTick(() => {
                this.navData = this.getCrumb();

           })
        },
        methods:{
            ...mapGetters([
                'getCrumb'
            ])
        }
    }
</script>
