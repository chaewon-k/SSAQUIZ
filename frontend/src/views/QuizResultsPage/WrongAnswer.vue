<template>
  <div id="quiz-results-container--red">
    <Header mode="userInfo" :nickname="username" :score="score" />
    <div id="quiz-results-content">
    <p id="title">아쉬워요...</p>
    <p id="emoticon">😭</p>
    <p>토닥토닥💦</p>
    </div>
    <Alert
      :flag="flag"
      :alertMessage=alertMessage
      :color=color    
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Header from '@/components/common/Header.vue';
import Alert from '@/components/Popup/Alert.vue';

export default {
  name: 'WrongAnswer',
  components: {
    Header,
		Alert
  },
	data: function () {
		return {
      flag: false,
      alertMessage: '',
      color: '',
		}
	},
	watch: {
		isNext: function (newVal) {
			if (newVal === true) {
				this.setIsFin(false);
				this.setIsSolved(false);
				this.setIsCorrect(false);
				this.setIsNext(false);
				this.$router.push({ name: "LoadingPage" });
			}
		},
		isEnd: function (newVal) {
			if (newVal === true) {
				this.$router.push({ name: "ResultPage" });
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
	methods: {
		...mapActions("PlayQuizStore", ["setIsFin", "setIsSolved", "setIsCorrect", "setIsNext"])
	},
	computed: {
		...mapState("PlayQuizStore", ["isNext", "isEnd", "username", "score", "teacherDisconnected"])
	}
}
</script>

<style scoped>
#quiz-results-container--red {
	background-color: #FF85B1;
  height: 100vh;
  padding: 0 10% 1% 10%;
}

@media (max-width: 480px) {
  #quiz-results-container--red {
    padding: 0 3% 1% 3%;
  }
}

#quiz-results-content {
	height: 85%;
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
	font-size: 4rem;
	font-family: 'Jua';
}

#quiz-results-content > #title {
	font-size: 7.5rem;
}

#quiz-results-content > #emoticon {
	font-size: 16rem;
}

@media (max-width: 700px) {
	#quiz-results-content {
		font-size: 2rem;
	}

	#quiz-results-content > #title {
		font-size: 4rem;
	}

	#quiz-results-content > #emoticon {
	font-size: 10rem;
	}
}
</style>