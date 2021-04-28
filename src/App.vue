<template>
  <div id="app">
    <tabs>
      <tab name="Thẻ căn cước & CMND" id="id-card">
        <ekyc-tab />
      </tab>
      <tab name="Liveness" id="liveness">
        <liveness-challenge />
      </tab>
    </tabs>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import EKYCTab from "@/pages/EKYCTab.vue";

import { KYCDocumentProcessor, KYCRecognizedData } from "@/js/KYCDocumentProccessor";

import LivenessChallenge from "./pages/LivenessChallenge.vue";

export default Vue.extend({
  components: { Tab, Tabs, "ekyc-tab": EKYCTab, LivenessChallenge },
  name: "App",
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

<style scoped></style>
