<template>
  <div id="lobby-page--teacher">
    <div id="lobby-page--teacher__header">
      <img class="ssaquiz-logo" src="@/assets/images/SSAQUIZ.png" alt="SSAQUIZ">
    </div>
    <div id="lobby-page--teacher__body">
      <div id="lobby-page--teacher__info">
        <button class="PIN-button">{{ PIN }}</button>
        <img class="QR-code" src="@/assets/images/QRcode.png" alt="QRcode">
        <div id="lobby-page--teacher__number">
          <span>현재 <span style="color: #545DE3;">{{ students.length }}명</span> 참여 중</span>
        </div>
      </div>
      <div id="lobby-page--teacher__nickname">
        <template
          v-for="(student, index) in students"
        ><NicknameButton :key="index" :student=student :index=index @click.native="clickNickname(student)" /></template>
      </div>
      <NextStepButton @click.native="clickStartButton"/>
    </div>
    <Confirm 
      v-if="confirmFlag===true"
      :content="content"
      :emoticon="emoticon"
      @close="confirmFlag=false"
      @accept="forcedExit"
    />
    <Alert
      :flag="flag"
      :alertMessage=alertMessage
      :color=color
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NicknameButton from '@/components/common/NicknameButton.vue';
import NextStepButton from '@/components/common/NextStepButton.vue';
import Confirm from "@/components/Popup/Confirm.vue";
import Alert from "@/components/Popup/Alert.vue";
import axios from 'axios';

export default {
  name: "LobbyPageT",
  components: {
    NicknameButton,
    NextStepButton,
    Confirm,
    Alert,
  },
  data: function () {
    return {
      PIN: this.$route.params.PIN,
      quizId: this.$route.params.quizId,

      //banStudent
      confirmFlag: false,
      content: '',
      emoticon: '',
      banStudentNickname: '',

      // Alert Message parameters
      flag: false,
      alertMessage: '',
      color: '',
    }
  },
  created: function () {
    this.defaultIsStart();
  },
  computed: {
    ...mapState("CreateQuizRoomStore", ["students", "isStart"])
  },
  watch: {
    isStart: function (val) {
      if (val === true) {
        this.$router.push({name: "LoadingPage"})
      }
    }
  },
  methods: {
    ...mapActions("CreateQuizRoomStore", ["sendStartMessage", "defaultIsStart", "startQuiz", "setQuizData", "sendTotalNum", "banStudent"]),
    clickStartButton: function () {
      axios.get(`https://k4a304.p.ssafy.io/api-quiz/workbook/${this.quizId}`)
        .then(res => {
          this.setQuizData(res.data.object);
          let answerList = [];
          let scoreFactorList = [];
          let originalScoreFactorList = [1, 1.5, 2];
          res.data.object.slideList.forEach(slide => answerList.push(slide.answer));
          res.data.object.slideList.forEach(slide => scoreFactorList.push(originalScoreFactorList[slide.scoreFactor]));
          this.sendStartMessage([answerList, scoreFactorList]);
          this.sendTotalNum(res.data.object.slideList.length);
          this.startQuiz();
        })
        .catch(err => console.log(err))
    },
    clickNickname: function (student) {
      this.content = "강제퇴장 시키겠습니까?";
      this.emoticon = "😯";
      this.banStudentNickname = student.n;
      this.confirmFlag = true;
    },
    forcedExit: function () {
      this.banStudent(this.banStudentNickname);
      this.confirmFlag = false;

      this.alertMessage = "강제퇴장 완료!";
      this.color = "blue";
      this.flag = !this.flag;
    }
  },
}
</script>

<style scoped>
#lobby-page--teacher {
  height: 100vh;
  width: 100vw;
  background-color: #CFE1F6;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#lobby-page--teacher__header {
  height: 30%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.ssaquiz-logo {
  width: 30%;
  height: auto;
  object-fit: contain;
	justify-content: center;
	margin: 0 0 15px 0;
}

#lobby-page--teacher__body {
  height: 70%;
  width: 100%;
  padding: 0 10% 1% 10%;
  display: flex;
  justify-content: center;
}

#lobby-page--teacher__info {
  margin-right: 30px;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.PIN-button {
  font-family: 'Jua';
	padding-top: 0.1rem;
  font-size: 2rem;
	color: #FFFFFF;
	width: 50%;
	height: 10%;
	background-color: #545DE3;
	border-radius: 20px;
}

.QR-code {
  width: 50%;
  margin-top: 5%;
  margin-bottom: 5%;
}

#lobby-page--teacher__nickname {
  width: 50%;
  height: 80%;
  border-width: 10px 0 10px 10px;
  border-style: solid;
  border-color: #FFFFFF;
  border-radius: 20px;
  background-color: #FFFFFF;
  overflow: auto;
  display: table-cell;
  text-align: center;
}

#lobby-page--teacher__number {
  width: 100%;
  font-family: "Jua";
  font-size: 2rem;
  display: flex;
  justify-content: center;
}

::-webkit-scrollbar { width: 30px; }

::-webkit-scrollbar-track { 
  background-color: #F2F2F2;
  border-radius: 0px 15px 15px 0px; 
}

::-webkit-scrollbar-thumb { 
  background: #c4c4c4; 
  border-radius: 15px;
  background-clip: padding-box;
  border : 8px solid transparent;
}

/* @media(max-width: 1500px) {
  #lobby-page--teacher__nickname {
    width: 350px;
    height: 350px;
  }
  #lobby-page--teacher__info {
    width: 300px;
  }
} */
</style>