<template>
  <div class="file__upload__input__container">
    <div class="file__upload__input">
      <span v-if="!files" class="fileName">No files selected</span>
      <span v-else class="fileName uploaded">{{ files[0].name }}</span>
      <input @change="fileSelected" type="file" id="file_upload" />
      <div>
        <img v-if="!files" src="" alt="" />
        <img v-else src="../icons/img/checkmark.svg" alt="" />
        <label class="upload__btn" for="file_upload">
          <span v-if="!files">Select file</span>
          <span v-else>Reselect file</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { InputStates, InputState } from "./types";
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: {},
  data() {
    return { files: null as FileList | null };
  },
  computed: {},
  methods: {
    fileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
      this.files = e.target.files;
      console.log("this.file", this.files);
    },
  },
});
</script>

<style lang="scss">
@import "../styles/variables";
.file__upload__input__container {
  box-sizing: border-box;
  width: 327px;
  height: 48px;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  background-image: linear-gradient(white, white),
    linear-gradient(to right, #686767, #686767);
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 4px;
  transition: box-shadow 0.1s;

  .file__upload__input {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 12px;
    margin-right: 12px;

    .fileName {
      font-size: 14px;
      line-height: 18px;
      color: #9c9a9a;

      &.uploaded {
        text-decoration-line: underline;
        color: #454344;
      }
    }

    div {
      display: flex;
      .upload__btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 81px;
        height: 32px;
        background: #279ecc;
        box-shadow: inset 1px 1px 4px rgba(39, 158, 204, 0.17);
        border-radius: 2px;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        text-align: center;
        letter-spacing: -0.333333px;
        color: #ffffff;
        transition: 0.2s;
        margin-left: 10px;
        &:hover {
          background: #ecf8fd;
          color: #279ecc;
          box-shadow: none;
          cursor: pointer;
        }
        &:active {
          box-shadow: inset 3px 3px 4px rgba(39, 158, 204, 0.17);
        }
      }
    }

    input {
      display: none;
    }
  }
}
</style>
