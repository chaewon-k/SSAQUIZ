<template>
  <button class="step-button">
    <img v-if="dark" src="@/assets/images/arrow-black.png">
    <img v-else src="@/assets/images/arrow.png">
  </button>
</template>

<script>
export default {
  name: "NextStepButton",
  props: ["dark"]
}
</script>

<style scoped>
.step-button {
  position: absolute;
  top: 50%;
  right: 3%;
  z-index: 99;
}

.step-button:hover {
  transition: all 0.25s linear;
  transform: scale(1.2);
}

img {
  width: 80px;
  height: 80px;
}

@media(max-width: 1200px) {
  img {
    width: 70px;
    height: 70px;
  }
}
</style>