import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

var ws;
var pin;

var colorList = [
  "#FFE059",
  "#FF89B4",
  "#ABD0F2",
  "#D98EF8",
  "#A1DBF3",
  "#B9BDFD",
  "#B6F1A1",
  "#FFC178",
];

const CreateQuizRoomStore = {
  namespaced: true,
  state: {
    stompClient: ws,
    PIN: pin,
    students: [],
    isStart: false,
    quizData: Object,
    quizIndex: 0,
    solvedNum: 0,
    isFin: false,
    isInterim: false,
    isNext: false,
    category: '',
    isEnd: false,
    scoreBoardData: [],
    resultData: [],
  },
  getters: {},
  mutations: {
    SET_DEFAULT_DATA: function (state) {
      pin = "";
      state.students = [];
      state.isStart = false;
      state.quizData = Object;
      state.quizIndex = 0;
      state.solvedNum = 0;
      state.isFin = false;
      state.isInterim = false;
      state.isNext = false;
      state.category = '';
      state.isEnd = false;
      state.scoreBoardData = [];
      state.resultData = [];
    },
    SET_PINWS: function (state, value) {
      state.PIN = value;
    },
    SET_STOMP_CLIENT: function (state, value) {
      state.stompClient = value;
    },
    SUBSCRIBE_QUIZ_ROOM: function (state, value) {
      state.stompClient = value;
    },
    SET_STUDENTS: function (state, value) {
      let randomColor = Math.floor(Math.random() * colorList.length);
      state.students.push({n: value, c: randomColor});
      // let UserListMessage = {
      //   type: "USERLIST",
      //   content: state.students
      // };
      // ws.send(`/quiz/room/sendUserList/${pin}`, {}, JSON.stringify(UserListMessage));
    },
    DELETE_STUDENTS: function (state, value) {
      if (state.isStart === false) {
        let newStudents = state.students.filter(student => student.n !== value);
        state.students = newStudents;
        // let UserListMessage = {
        //   type: "USERLIST",
        //   content: state.students
        // };
        // ws.send(`/quiz/room/sendUserList/${pin}`, {}, JSON.stringify(UserListMessage));
      }
    },
    // ADD_STUDENTS: function (state, value) {
    //   let randomColor = colorList[Math.floor(Math.random() * colorList.length)];
    //   state.students.push({nickname: value, color: randomColor});
    //   let UserListMessage = {
    //     type: "ADDUSER",
    //     content: {nickname: value, color: randomColor},
    //   };
    //   ws.send(`/quiz/room/sendUserList/${pin}`, {}, JSON.stringify(UserListMessage));
    // },
    // DELETE_STUDENTS: function (state, value) {
    //   let newStudents = state.students.filter(student => student.nickname !== value);
    //   state.students = newStudents;
    //   let UserListMessage = {
    //     type: "DELETEUSER",
    //     content: value,
    //   };
    //   ws.send(`/quiz/room/sendUserList/${pin}`, {}, JSON.stringify(UserListMessage));
    // },
    SEND_ANSWERLIST: function (state, value) {
      state.stompClient = value;
    },
    SET_ISSTART: function (state, value) {
      state.isStart = value;
    },
    SET_QUIZDATA: function (state, value) {
      state.quizData = value;
    },
    SET_QUIZINDEX: function (state) {
      state.quizIndex++;
    },
    SET_CATEGORY: function (state, value) {
      state.category = value;
    },
    SEND_CATEGORY: function (state, value) {
      state.stompClient = value;
    },
    SEND_TOTALNUM: function (state, value) {
      state.stompClient = value;
    },
    ADD_SOLVEDNUM: function (state) {
      state.solvedNum++;
    },
    DEFAULT_SOLVEDNUM: function (state) {
      state.solvedNum = 0;
    },
    NEXT_QUIZ: function (state, value) {
      state.stompClient = value;
    },
    SET_ISFIN: function (state, value) {
      state.isFin = value;
    },
    SET_ISINTERIM: function (state, value) {
      state.isInterim = value;
    },
    SET_ISNEXT: function (state, value) {
      state.isNext = value;
    },
    SET_ISEND: function (state, value) {
      state.isEnd = value;
    },
    SET_SCOREBOARDDATA: function (state, value) {
      state.scoreBoardData = value;
    },
    SET_RESULTDATA: function (state, value) {
      state.resultData = value;
    },
    DISCONNECT_WS: function (state, value) {
      state.stompClient = value;
    },
  },
  actions: {
    setDefaultData: function ({ commit }) {
      commit('SET_DEFAULT_DATA');
    },
    disconnectTeacherWS: function ({ commit }) {
      if (ws !== undefined && ws.connected === true) {
        ws.disconnect(() => {}, {});
        commit("DISCONNECT_WS", ws);
      }
    },
    sendExitTeacherMessage({ commit }) {
      let sendExitTeacherMessage = {
        type: "LEAVE",
      };
      ws.send(`/quiz/room/exitTeacher/${pin}`, {}, JSON.stringify(sendExitTeacherMessage));
      commit('SET_STOMP_CLIENT', ws);
    },
    sendEndMessage: function ({ commit }) {
      let sendEndMessage = {
        type: "END"
      };
      ws.send(`/quiz/room/endQuiz/${pin}`, {}, JSON.stringify(sendEndMessage));
      commit("SET_STOMP_CLIENT", ws);
    },
    sendFinMessage: function ({ commit }, value) {
      let sendFinMessage = {
        type: "FINISH",
        quizNum: value,
      };
      ws.send(`/quiz/room/finishQuiz/${pin}`, {}, JSON.stringify(sendFinMessage));
      commit("SET_STOMP_CLIENT", ws);
    },
    setIsInterim: function ({ commit }, value) {
      commit("SET_ISINTERIM", value);
    },
    setIsNext: function ({ commit }, value) {
      commit("SET_ISNEXT", value);
    },
    setIsFin: function ({ commit }, value) {
      commit("SET_ISFIN", value);
    },
    setScoreBoardData: function ({ commit }, value) {
      commit("SET_SCOREBOARDDATA", value);
    },
    nextQuiz: function ({ commit }) {
      let nextQuizMessage = {
        type: "NEXT"
      };
      ws.send(`/quiz/room/nextQuiz/${pin}`, {}, JSON.stringify(nextQuizMessage));
      commit("SET_STOMP_CLIENT", ws);
    },
    sendTotalNum: function ({ commit }, value) {
      let sendTotalNumMessage = {
        type: "TOTALNUM",
        content: value
      };
      ws.send(`/quiz/room/sendTotalNum/${pin}`, {}, JSON.stringify(sendTotalNumMessage));
      commit('SEND_TOTALNUM', ws);
    },
    sendCategory: function ({ commit }, value) {
      let sendCategoryMessage = {
        type: "CATEGORY",
        content: value
      };
      ws.send(`/quiz/room/sendCategory/${pin}`, {}, JSON.stringify(sendCategoryMessage));
      commit('SET_CATEGORY', value);
      commit('SEND_CATEGORY', ws);
    },
    setQuizIndex: function ({ commit }) {
      commit('SET_QUIZINDEX');
    },
    setQuizData: function ({ commit }, value) {
      commit('SET_QUIZDATA', value);
    },
    defaultIsStart: function ({ commit }) {
      commit('SET_ISSTART', false);
    },
    startQuiz: function ({ commit }) {
      commit('SET_ISSTART', true);
    },
    setPINWS: async function ({ commit }) {
      await axios.post("https://k4a304.p.ssafy.io/api-play/pin")
        .then(res => {
          pin = res.data.object;
          commit('SET_PINWS', pin);
          ws = Stomp.over(new SockJS("https://k4a304.p.ssafy.io/api-play/connect"));
          ws.debug = () => {};
          ws.connect({}, () => {
            ws.subscribe(`/pin/${pin}`, (msg) => {
              let type = JSON.parse(msg.body).type
              let content = JSON.parse(msg.body).content
              if (type === "JOIN" && content === "join success") {
                commit('SET_STUDENTS', JSON.parse(msg.body).sender);
              } else if (type === "START") {
                commit('SET_ISSTART', true);
              } else if (type === "SUBMIT") {
                commit('ADD_SOLVEDNUM');
              } else if (type === "NEXT") {
                commit('DEFAULT_SOLVEDNUM');
                commit('SET_ISNEXT', true);
              } else if (type === "FINISH") {
                commit('SET_SCOREBOARDDATA', JSON.parse(msg.body).content);
                commit('SET_ISFIN', true);
              } else if (type === "END") {
                commit("SET_RESULTDATA", JSON.parse(msg.body).content);
                commit("SET_ISEND", true);
              } else if (type === "LEAVE" && content === "teacher disconnecting") {
                ws.disconnect(() => {}, {});
                commit("DISCONNECT_WS", ws);
              } else if (type === "LEAVE" && content === "student disconnected") {
                commit('DELETE_STUDENTS', JSON.parse(msg.body).sender);
              }
            })
            let sendEnterTeacherMessage = {
              type: "TEACHER",
            };
            ws.send(`/quiz/room/enterTeacher/${pin}`, {}, JSON.stringify(sendEnterTeacherMessage));
            commit('SUBSCRIBE_QUIZ_ROOM', ws);
          })
          commit('SET_STOMP_CLIENT', ws);
        })
        .catch(err => console.log(err))
    },
    sendStartMessage: function ({ commit }, value) {
      const sendStartMessage = {
        type: 'START',
        content: value, // [[정답리스트], [scoreFactor]]
      };
      ws.send(`/quiz/room/startQuiz/${pin}`, {}, JSON.stringify(sendStartMessage))
      commit('SEND_ANSWERLIST', ws);
    },
    banStudent: function ({ commit }, value) {
      commit('DELETE_STUDENTS', value)
      const sendBanStudentMessage = {
        type: "BAN",
        content: value
      };
      ws.send(`/quiz/room/banUser/${pin}`, {}, JSON.stringify(sendBanStudentMessage));
      commit('SET_STOMP_CLIENT', ws);
    },
  }
};

export default CreateQuizRoomStore;