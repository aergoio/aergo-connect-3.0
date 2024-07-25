<template>
  <div class="inputContainer" :class="[`state-${state}`]">
       <textarea v-if="readonly" class="textarea" readonly :placeholder="placeholder">
       </textarea>
       <textarea v-else class="textarea" :placeholder="placeholder" @input="handleInput"
          @change="handleFileInput"
          @blur="handleBlur"
          @keyup.enter="handleEnter">
       </textarea>
     </div>
   </label>
 </template>
 
 <script lang="ts">
 import {
   InputStates,
   InputState,
 } from "./types";
 import Vue, { PropType } from "vue";
 export default Vue.extend({
   props: {
     state: {
       type: String as PropType<InputState>,
       default: InputStates[0] as InputState,
     }, 
     placeholder: {
      type: String,
      default: ""
     },
     readonly: {
      type: Boolean,
      default: false,
    },
   },
   computed: {},
   methods: {handleInput(event: InputEvent): void {
      this.$emit("input", (event.target as HTMLFormElement).value);
    },
    handleBlur(event: FocusEvent): void {
      this.$emit("blur", (event.target as HTMLFormElement).value);
    },
    handleEnter(event: KeyboardEvent): void {
      this.$emit("submit", (event.target as HTMLFormElement).value);
    },
    handleFileInput(): void {
      const $elem = this.$refs.inputElement as HTMLInputElement;
      if (!$elem || !$elem.files || $elem.files.length === 0) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.$emit("file", e.target.result);
        }
      };
      reader.readAsText($elem.files[0]);
    },},
 });
 </script>
 
 <style lang="scss">
 @import "../styles/variables";
 .inputContainer {
   box-sizing: border-box;
   height: 117px;
   width: 303px;
   display: flex;
   align-items: center;
   border: 2px solid transparent;
   background-image: linear-gradient(white, white),
     linear-gradient(to right, #686767, #686767);
   background-origin: border-box;
   background-clip: content-box, border-box;
   border-radius: 4px;
   margin-bottom: 1em;
   transition: box-shadow 0.1s;
   margin: 4px;
 
   &.state-invalid {
     background-image: linear-gradient(white, white),
       linear-gradient(to right, #9a449c, #e30a7d);
     background-origin: border-box;
     background-clip: content-box, border-box;
     box-shadow: none;
   }
 
   &.state-valid {
     background-image: linear-gradient(white, white),
       linear-gradient(to right, #279ecc, #a13e99);
     background-origin: border-box;
     background-clip: content-box, border-box;
     box-shadow: none;
   }
 }
 
 .textarea {
   box-sizing: border-box;
   flex: 1;
   height: 100%;
   border: 0;
   outline: none;
   resize: none;
   background-color: transparent;
   
   padding: 10px;
   font-weight: 500;
   font-size: 16px;
   line-height: 25px;
   letter-spacing: -0.333333px;

   &::placeholder {
    color: blue;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.333333px;
    color: #9C9A9A;
    }
 }
 
 </style>
 
