<template>
  <div id="login-form">
    <InputBox placeholder="ID를 입력해주세요." type="text" @change-input="setEmail" />
    <InputBox placeholder="PW를 입력해주세요." type="password" @change-input="setPassword" />
    <InputButton @click.native="login" text="로그인 하기" />
    <GoogleLoginButton  @click.native="googleLogin"/>
    <br />
    <router-link class="hyper-link" to="/">퀴즈를 풀러 오셨어요?</router-link>
    <br />
    <a class="hyper-link" @click="moveToSignup">아직 저희 회원이 아니신가요?</a>
  </div>
</template>

<script>
import axios from 'axios';
import { GOOGLE_AUTH_URL } from "@/config/index.js";

import InputBox from "@/components/common/InputBox.vue";
import InputButton from "@/components/common/InputButton.vue";
import GoogleLoginButton from '@/components/common/GoogleLoginButton.vue';

export default {
  name: "LoginForm",
  components: {
    InputBox,
    InputButton,
    GoogleLoginButton
  },
  data: function () {
    return {
      email: "",
      PW: "",
    };
  },
  methods: {
    moveToSignup: function () {
      this.email = "";
      this.PW = "";
      this.$emit("move-to-signup");
    },
    setEmail: function (data) {
      this.email = data;
    },
    setPassword: function (data) {
      this.PW = data;
    },
    login: function () {
      const data = {"email": this.email, "password": this.PW}
      axios.post("https://k4a304.p.ssafy.io/api-auth/auth/login", data)
        .then(res => {
          console.log(res)
          if (res.data.status === true) {     //로그인 성공시
            localStorage.setItem('token',res.data.object.accessToken);
            localStorage.setItem('nickname', res.data.object.nickname);
            localStorage.setItem('email', this.email);
            localStorage.setItem('googleLogin', false);
            localStorage.setItem('imageUrl', res.data.object.imageUrl);
            localStorage.setItem('id', res.data.object.id);

            this.$router.push({ name: "UserPage" });
          } else if (res.data.status === false && res.data.data === 'login Fail (loginRequest is null)') {
            this.$emit("login-fail", "loginRequest is null");
          } else if (res.data.status === false && res.data.data === 'login Fail (email does not exist)') {
            this.$emit("login-fail", "email does not exist");
          } else if (res.data.status === false && res.data.data === 'login Fail (password mismatch)'){
            this.$emit("login-fail", "password mismatch");
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // google login
    googleLogin: function () {
      window.location.href = GOOGLE_AUTH_URL;
    },
  },
};
</script>

<style scoped>
#login-form {
  text-align: center;
  margin-top: 55px;
  height: 300px;
}

#login-form .hyper-link {
  font-family: "Jua", sans-serif;
  color: grey;
  margin: 5px 0 0 0;
  text-decoration: underline;
}
</style>