<template>
  <div>
    <div class="mx-auto">
      <div class="row">
        <upload class="col-lg-6 mb-3" title="Mặt trước" :enabled="!uploading" v-on:fileAdded="onFileAdded" :index="0" />
        <upload class="col-lg-6 mb-3" title="Mặt sau" :enabled="!uploading" v-on:fileAdded="onFileAdded" :index="1" />
      </div>
      <div class="d-flex justify-content-center align-items-center ">
        <button v-if="!successfullUploaded" v-on:click="uploadFiles" :disabled="uploading">
          Submit
        </button>
        <button v-if="successfullUploaded" v-on:click="clearFileList">
          Clear
        </button>
      </div>
    </div>
    <br />
    <ekyc-result :kycResult="kycResult" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Upload from "@/components/Upload.vue";
import EkycResult from "@/components/EkycResult.vue";

import { KYCDocumentProcessor, KYCRecognizedData } from "@/js/KYCDocumentProccessor";

import { Utils } from "@/js/Utils";

Utils.loadConfig();
Utils.configureLogger();

export default Vue.extend({
  components: { Upload, EkycResult },
  name: "EKYCTab",
  data() {
    return {
      files: [] as string[],
      successfullUploaded: false,
      uploading: false,
      kycResult: {}
    };
  },
  methods: {
    onFileAdded(imageContent: string, position: number) {
      this.files[position] = imageContent;
    },
    clearFileList() {
      this.files = [];
      this.successfullUploaded = false;
    },
    uploadFiles() {
      this.uploading = !this.uploading;
      KYCDocumentProcessor.createKYCDocument(
        this.files,
        (result: KYCRecognizedData) => {
          this.uploading = false;
          this.kycResult = result;
          console.log(result);
        },
        (error: Error) => {
          this.uploading = false;
          console.log(error);
        }
      );
    }
  }
});
</script>

<style scoped>
#app {
  margin: 15px;
}
#ul-upload-files li {
  display: inline-block;
  width: 33%;
}

button {
  font-family: "Roboto medium", sans-serif;
  font-size: 14px;
  height: 36px;
  min-width: 88px;
  padding: 6px 16px;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  width: auto;
  user-select: none;
  border: 0;
  border-radius: 2px;
  background: #42b983;
  color: #fff;
  outline: 0;
  align-self: center;
}
button:disabled {
  background: grey;
}
</style>
