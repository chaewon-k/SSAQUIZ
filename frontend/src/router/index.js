import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomePage from '@/views/WelcomePage.vue'
import SolvingQuizPage from '@/views/SolvingQuizPage.vue'
import LobbyPageT from '@/views/LobbyPageT.vue'
import Login from '../views/Login.vue'
import UserPage from '../views/UserPage.vue'
import CorrectAnswer from '../views/QuizResultsPage/CorrectAnswer.vue'
import WrongAnswer from '../views/QuizResultsPage/WrongAnswer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'WelcomePage',
    component: WelcomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/solving-quiz',
    name: 'SolvingQuizPage',
    component: SolvingQuizPage
  },
  {
    path: '/lobby/:quizID',
    name: 'LobbyPageT',
    component: LobbyPageT
  },
  {
    path: '/correct-answer',
    name: 'CorrectAnswer',
    component: CorrectAnswer
  },
  {
    path: '/wrong-answer',
    name: 'WrongAnswer',
    component: WrongAnswer
  },
  {
    path: '/user-page',
    name: 'UserPage',
    component: UserPage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
