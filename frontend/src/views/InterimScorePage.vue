<template>
  <div id="interim-page">
    <BubbleBG/>
    <Logo />
    <div id="content">
      <h1 id="title">퀴즈결과</h1>
      <!-- 점수판 -->
      <InterimScoreBoard/>
      <NextStepButton @click.native="clickNextButton" />
      <!-- <h1 class="mention">문어님이 현재까지 3번 연속이나 답을 맞추셨어요!</h1> -->
      <!-- 배경의 고래 이미지 -->
      <img class="whale-img-1" src="@/assets/images/pinkWhale.png">
      <img class="whale-img-2" src="@/assets/images/purpleWhale.png">
      <img class="whale-img-3" src="@/assets/images/greenWhale.png">
    </div>
    <Alert
      :flag="flag"
      :alertMessage=alertMessage
      :color=color    
    />
  </div>
</template>

<script>
import Logo from '@/components/common/Logo.vue';
import NextStepButton from '@/components/common/NextStepButton.vue';
import BubbleBG from '@/components/effects/BubbleBG.vue';
import InterimScoreBoard from '@/components/Form/InterimScoreBoard.vue';
import Alert from '@/components/Popup/Alert.vue';
import { mapActions, mapState } from 'vuex';
export default {
  name: "InterimScore",
  components: {
    Logo,
    NextStepButton,
    InterimScoreBoard,
    BubbleBG,
    Alert
  },
  data: function () {
    return {
      flag: false,
      alertMessage: '',
      color: ''
    }
  },
  watch: {
    isEnd: function (newVal) {
      if (newVal === true) {
        this.$router.push({name: "ResultPage"});
      }
    },
    isNext: function (newVal) {
      if (newVal === true) {
        this.setIsInterim(false);
        this.setIsNext(false);
        this.setIsFin(false);
        this.$router.push({name: "LoadingPage"});
      }
    },
    teacherDisconnected: function (newVal) {
      if (newVal === true) {
        this.alertMessage = "퀴즈가 종료되었습니다. 잠시 후 메인페이지로 이동합니다.";
        this.color = "red";
        this.flag = !this.flag;
        setTimeout (() =>   {
          this.disconnectWS(); 
          this.$router.push({name: "WelcomePage"});
        }, 2500);
      }
    },
  },
  computed: {
    ...mapState("CreateQuizRoomStore", ["isNext", "teacherDisconnected", "quizIndex", "isEnd", "quizData"])
  },
  methods: {
    ...mapActions("CreateQuizRoomStore", ["nextQuiz", "setIsInterim", "setIsNext", "setIsFin", "disconnectWS", "sendEndMessage"]),
    clickNextButton: function () {
      if (this.quizData.slideList.length === this.quizIndex) {
        this.sendEndMessage();
      } else {
        this.nextQuiz();
      }
    },
  },
}
</script>

<style scoped>
/* 전체 영역 */

#interim-page {
  width: 100%;
  height: 100%;
  background-color: #4f37de;
}

/* 로고를 제외한 나머지 영역 */

#interim-page #content  {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-flow: column;
}

#content #title {
  color: white;
  font-size: 4.5vw;
  font-family: 'Jua';
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#content .mention {
  color: white;
  font-size: 3vw;
  font-family: 'Jua';
  width: 90%;
  display: flex;
  justify-content: center;
  margin-top: 3%;
}

/* 배경의 고래 이미지 */

#content .whale-img-1 {
  position: absolute;
  z-index: 2;
  width: 30%;
  left: 0%;
  top: 20%;
  transform: rotate( 35deg );
}

#content .whale-img-2 {
  position: absolute;
  z-index: 2;
  width: 12%;
  right: 7%;
  top: 8%;
  transform: scaleX(-1) rotate( 15deg );
}

#content .whale-img-3 {
  position: absolute;
  z-index: 2;
  width: 20%;
  right: 5%;
  top: 50%;
  transform: scaleX(-1) rotate( -15deg );
}


</style>