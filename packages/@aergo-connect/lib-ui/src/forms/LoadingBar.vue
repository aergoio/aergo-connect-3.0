<template>
  <!--  <div class="lds-facebook" v-if="loading">
-->
  <div class="loading_backdrop">
    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.loading_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}
.lds-facebook {
  display: inline-block;
  position: absolute;
  width: 64px;
  height: 64px;
  bottom: 50%;
  left: 40%;
}

.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 13px;
  background: #279ecc;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.lds-facebook div:nth-child(1) {
  left: 6px;
  animation-delay: -0.24s;
}

.lds-facebook div:nth-child(2) {
  left: 26px;
  animation-delay: -0.12s;
}

.lds-facebook div:nth-child(3) {
  left: 45px;
  animation-delay: 0;
}

@keyframes lds-facebook {
  0% {
    top: 6px;
    height: 51px;
  }

  50%,
  100% {
    top: 19px;
    height: 26px;
  }
}
</style>
