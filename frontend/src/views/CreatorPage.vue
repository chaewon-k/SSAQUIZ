<template>
  <div id="creator-page">
    <div id="creator-page__header">
      <button class="creator-page__header__button" @click="checkQuizData">나가기</button>
      <img class="ssaquiz-logo" src="@/assets/images/SSAQUIZ.png" alt="SSAQUIZ">
      <button class="creator-page__header__button" @click="save">저장하기</button>
    </div>
    <div id="creator-page__body">
      <div id="creator-page__preview-wrap">
        <div id="creator-page__preview">
          <template 
            v-for="(slide, index) in quizData.slideList"
          >
            <QuizSlide
              :key="index"
              :number="index+1"
              :slide="slide"
              :isSelected="isSelectedSlide[index]"
              @delete-slide="deleteSlide(index)"
              @click.native="selectSlide(index)"
            />
          </template>
        </div>
        <div id="slide-create-button" @click="openQuizTypeDialog = true">
          <i class="far fa-plus-square"></i>
          <span>슬라이드 추가</span>
        </div>
      </div>
      <div id="creator-page__content">
        <TextDiv message="슬라이드를 추가해보세요!" v-if ="quizDataLength === 0" />
        <ShortAnswerCreator v-else-if="quizData.slideList[selectedSlideIndex].category === '단답형'"/>
        <MultipleChoiceCreator v-else-if="quizData.slideList[selectedSlideIndex].category === '4지선다'" @control-max-length="setAlert(val)"/>
        <OrderingCreator v-else-if="quizData.slideList[selectedSlideIndex].category === '순서맞추기' || quizData.slideList[selectedSlideIndex].category === '순서맞히기'" />
        <TFCreator v-else-if="quizData.slideList[selectedSlideIndex].category === 'TF'"/>
      </div>
      <div id="creator-page__settings">
        <span class="settings__title">문제 설정</span>
        <span class="settings__subtitle">제한 시간</span>
        <SelectBox
          title="time"
          :optionList="timeLimitList"
          />
        <span class="settings__subtitle">점수</span>
        <SelectBox 
          title="scoreFactor"
          :optionList="scoreFactorList"
        />
      </div>
    </div>
    <Confirm 
      emoticon="🤔"
      content="작업한 내용이 저장되지 않습니다.<br>정말로 나가시겠습니까?" 
      @close="openExitConfirm = false" 
      @accept="openExitConfirm = false; exit();"
      v-if="openExitConfirm" 
    />
    <QuizTypeDialog
      v-if="openQuizTypeDialog"
      @close="closeDialog"
      @exit="exitDialog"
    />
    <Alert
      :flag="flag"
      :alertMessage=alertMessage
      :color=color
    />
  </div>
</template>

<script>
import MultipleChoiceCreator from '@/components/QuizCreator/MultipleChoiceCreator.vue';
import ShortAnswerCreator from '@/components/QuizCreator/ShortAnswerCreator.vue';
import OrderingCreator from '@/components/QuizCreator/OrderingCreator.vue';
import TFCreator from '@/components/QuizCreator/TFCreator.vue';
import QuizSlide from '@/components/QuizCreator/QuizSlide.vue';
import QuizTypeDialog from '@/components/Popup/QuizTypeDialog.vue';
import Confirm from '@/components/Popup/Confirm.vue';
import Alert from "@/components/Popup/Alert.vue";
import SelectBox from '@/components/common/SelectBox.vue';
import TextDiv from '@/components/common/TextDiv.vue';

import { mapState, mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: "CreatorPage",
  components: {
    MultipleChoiceCreator,
    ShortAnswerCreator,
    OrderingCreator,
    TFCreator,
    QuizSlide,
    QuizTypeDialog,
    Confirm,
    Alert,
    SelectBox,
    TextDiv
  },
  data: function () {
    return {
      openQuizTypeDialog: false,
      openExitConfirm: false,

      isSelectedSlide: [],
      
      timeLimitList: [
        {"name" :"10초", "value": 10},
        {"name" :"15초", "value": 15},
        {"name" :"20초", "value": 20},
      ],
      scoreFactorList: [
        {"name" :"x1", "value": 1},
        {"name" :"x1.5", "value": 1.5},
        {"name" :"x2", "value": 2},
      ],
      flag: false,
      alertMessage: '',
      color: '',
    }
  },
  computed: {
    ...mapState("CreateQuizStore", ['quizData', 'selectedSlideIndex', 'preQuizData']),
    quizDataLength: function () {
      if (this.quizData.slideList === undefined) {
        return 0;
      }
      else {
        this.selectSlide(this.selectedSlideIndex);
        return this.quizData.slideList.length;
      }
    }
  },
  mounted: function () {
    this.setSelectedSlideIndex(0);
    this.setIsStudent(false);
  },
  methods: {
    ...mapActions("CommonStore", ["setIsStudent"]),
    ...mapActions("CreateQuizStore", [
      "addQuiz", "getQuizData", "resetQuizData", "setSelectedSlideIndex", "removeSlide", "setPreQuizData"
    ]),
    selectSlide: function (idx) {
      this.isSelectedSlide = 
        Array.from({length: this.quizData.slideList.length}, () => false);
      this.isSelectedSlide[idx] = true;
      if (idx == this.quizData.slideList.length && idx != 0) idx--;
      this.setSelectedSlideIndex(idx);
    },
    deleteSlide: function (idx) {
      this.removeSlide(idx);
    },
    exit: function () {
      this.$router.push({ name: "UserPage" });
    },
    save: function () {
      axios.post("https://k4a304.p.ssafy.io/api-quiz/slide-all", this.quizData)
        .then(() => {
          this.setPreQuizData(this.quizData);
          this.alertMessage = "퀴즈를 저장했습니다!";
          this.color = "#454995";
          this.flag = !this.flag;
        })
        .catch(err => {
          console.log(err);
          this.alertMessage = "퀴즈 저장에 실패했습니다. 다시 시도해주세요.";
          this.color = "red";
          this.flag = !this.flag;
        })
    },
    closeDialog: function () {
      this.openQuizTypeDialog = false;
      this.setSelectedSlideIndex(this.isSelectedSlide.length);
    },
    exitDialog: function () {
      this.openQuizTypeDialog = false;
    }, 
    checkQuizData: function () {
      if (JSON.stringify(this.preQuizData) !== JSON.stringify(this.quizData)) {
        this.openExitConfirm = true;
      }
      else {
        this.exit();
      }
    }
  }
}
</script>

<style scoped>
#creator-page {
  height: 100vh;
  width: 100vw;
  background-color: #f2f2f2;
  padding: 0 1vw 0 1vw;
}

#creator-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 13vh;
}

#creator-page__header .ssaquiz-logo {
  height: 100%;
  width: auto;
  margin-bottom: 0;
}

#creator-page__header .creator-page__header__button {
  font-family: 'Jua';
  font-size: 1.5rem;
  width: 8%;
  height: 70%;
  border-radius: 15vmax;
}

#creator-page__header .creator-page__header__button:nth-child(1) {
  background-color: #D0A9E1;
}

#creator-page__header .creator-page__header__button:nth-child(1):hover {
  background-color: #a361bd;
}

#creator-page__header .creator-page__header__button:nth-child(3) {
  background-color: #F1DD83;
}

#creator-page__header .creator-page__header__button:nth-child(3):hover {
  background-color: #c4b15d;
}

#creator-page__body {
  display: flex;
  flex-direction: row;
  height: 85vh;
}

#creator-page__preview-wrap {
  margin: 1vh 0 1vh 0;
  padding: 1vh 0 0 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #9B9797;
  box-sizing: border-box;
  border-radius: 15px;
}

#creator-page__preview {
  overflow: auto;
  width: 100%;
  height: 90%;
}

#slide-create-button {
  width: 70%;
  height: 10%;
  margin: 4%;
  background-color: #989DED;
  border-radius: 15px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Jua';
  font-size: 1.5rem;
  cursor: pointer;
}

#slide-create-button:hover {
  background-color: #6067c9;
}

#slide-create-button span {
  margin-left: 10px;
}

#creator-page__content {
  flex: 4;
  margin: 1vh 1vw 1vh 1vw;
}

#creator-page__settings {
  margin: 1vh 0 1vh 0;
  padding: 5px 0 0 10px;
  flex: 1;
  border: 4px solid #9B9797;
  box-sizing: border-box;
  border-radius: 15px;
}

.settings__title {
  display: block;
  font-family: 'Jua';
  font-size: 38px;
  padding-bottom: 10px;
}

.settings__subtitle {
  display: block;
  font-family: 'Jua';
  font-size: 25px;
}

.settings__option {
  font-family: 'Jua';
  font-size: 20px;
  display: flex;
  align-items: center;
}

.settings__option label {
  margin-left: 10px;
}

.settings__option input[type="radio"], .settings__option input[type="radio"]:checked {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 100%;
}

.settings__option input[type="radio"] {
  background-color: #ffffff;
  border: 2px solid #c4c4c4;
}

.settings__option input[type="radio"]:checked {
  background-color: #c4c4c4;
  outline: none;
}

select {
  width: 200px;
  padding: 5px 10px;
  background-color: #c4c4c4;
  font-family: 'Jua';
  font-size: 25px;
  border-radius: 15px;
  background: url('~@/assets/images/caret-down.png') #c4c4c4 no-repeat 95% 50%;
  background-size: 8%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
}

select::-ms-expand {
    display: none;
}
</style>