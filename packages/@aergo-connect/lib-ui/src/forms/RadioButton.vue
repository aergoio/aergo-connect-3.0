<template>
  <label class="container ">
    <input type="checkbox" />
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss">
@import "../styles/variables";

/* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  cursor: pointer;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  border: 1px solid #c9c9c9;
  border-radius: 50%;
}

/* On mouse-over */
.container:hover input ~ .checkmark {
  background-color: #ffffff;
  border: 1px solid $Blue01;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: $Blue01;
  border: 1px solid $Blue01;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 4.5px;
  left: 4.5px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: white;
}

//variant
.type-secondary input:checked ~ .checkmark {
  background-color: $Pink01;
  border: 1px solid $Pink01;
}

.type-secondary:hover input ~ .checkmark {
  border: 1px solid $Pink01;
}
</style>
