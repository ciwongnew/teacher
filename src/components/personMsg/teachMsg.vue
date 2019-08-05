<template>
    <div class="Sec">
        <div class="altSch">
            <span>所在学校&nbsp;:</span>
            <div :title="school">
              <span>{{school}}</span>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data() {
        return {
            school: [],
            layerSch: false,
            ret: []
        }
    },
    props: ['userInformation'],
    watch: {
        userInformation(val) {
            this.schoolList();
        }
    },
    methods: {
        schoolList() {
            let classes = this.userInformation.classes;
            let arr = [];
            for (var i = 0; i < classes.length; i++) {
                arr.push(classes[i].schoolName);
            }
            for (var i = 0, j = arr.length; i < j; i++) {
                if (this.school.indexOf(arr[i]) == -1) {
                    this.school.push(arr[i]);
                }
            }
            this.school = this.school.toString();
        }
    }
}
</script>
