<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
-->

<template>

  <div class="videoContainer mx-auto" :style="cssVars">
    
    <video
      id="webcamVideo"
      :class="{ rotate: shouldRotate }"
      :width="videoWidth"
      :height="videoHeight"
      autoplay
      muted
      playsinline
    ></video>
    <canvas id="overlayCanvas" :class="{ rotate: shouldRotate }" :width="videoWidth" :height="videoHeight" />
    <div class="helpContainer clearfix">
      <div class="float-left messageContainer">
        <div class="message">
          <h5>{{ message }}</h5>
        </div>
      </div>
      <div class="float-right">
        <lottie v-show="animation === 1" :options="lottieOptions1" :height="100" :width="100" />
        <lottie v-show="animation === 2" :options="lottieOptions2" :height="100" :width="100" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Lottie from "vue-lottie/src/lottie.vue";
import * as help1 from "@/assets/lottie/help1.json";
import * as help2 from "@/assets/lottie/help2.json";
import { ChallengeDetails } from "@/js/RemoteStarter";
import { ChallengeProcessor } from "@/js/ChallengeProcessor";
import { RemoteVerifier } from "@/js/RemoteVerifier";
import { Utils } from "@/js/Utils";
import Logger from "node_modules/js-logger/src/logger";

export default Vue.extend({
  name: "Challenge",
  components: {
    Lottie,
  },
  props: {
    challengeDetails: Object,
    challengeCounter: Number,
  },

  data() {
    return {
      count: 0,
      challengeTask: "turn-face-left",
      message: "Loading...",
      animation: -1,
      // @ts-ignore
      lottieOptions1: { animationData: help1.default },
      // @ts-ignore
      lottieOptions2: { animationData: help2.default },

      videoWidth: Utils.getMediaStreamInfo().actualWidth,
      videoHeight: Utils.getMediaStreamInfo().actualHeight,
      shouldRotate: Utils.getConfigBooleanValue("FLIP_VIDEO"),
      // Ugly hack to pass variables to CSS
      cssVars: {
        "--video-width": Utils.getMediaStreamInfo().actualWidth + "px",
        "--video-height": Utils.getMediaStreamInfo().actualHeight + "px",
        "--help-container-padding-top": Utils.getMediaStreamInfo().actualHeight + 5 + "px",
      },
    };
  },
  methods: {
    onLocalEnd(success: boolean, challengeDetails: ChallengeDetails): void {
      if (success) {
        this.$emit("local-success", challengeDetails as ChallengeDetails);
        //this.$emit("challenge-next");
      } else {
        this.$emit("local-fail");
      }
    },
    onVerifyEnd(success: boolean, remoteVerifier: RemoteVerifier | undefined): void {
      if (success) {
        this.$emit("verify-success", remoteVerifier as RemoteVerifier);
      } else {
        this.$emit("local-fail");
      }
    },
    onHelpMessage(message: string | undefined): void {
      this.message = message || "";
    },
    onHelpAnimation(animationNumber: number | undefined): void {
      this.animation = animationNumber || -1;
    },
  },
  watch: {
    challengeCounter() {
      console.log("Challenge counter");
      
      if (this.challengeCounter <3) {
        console.log("CHANGE ", this.challengeCounter);
        if (this.challengeTask === "turn-face-left") {
          this.challengeTask = "turn-face-right";
        } else if (this.challengeTask === "turn-face-right") {
          this.challengeTask = "keep-face-ahead";
        }
        
        new ChallengeProcessor(
          this.challengeTask,
          this.challengeDetails,
          "webcamVideo",
          "overlayCanvas",
          this.onVerifyEnd,
          this.onLocalEnd,
          this.onHelpMessage,
          this.onHelpAnimation
        );
      }
    },
  },
  mounted: function () {
    console.time('Execution Time');
    const self: any = this;
    // if (self.challengeDetails)
    // }
    const challangeProcessor = new ChallengeProcessor(
      this.challengeTask,
      this.challengeDetails,
      "webcamVideo",
      "overlayCanvas",
      self.onVerifyEnd,
      self.onLocalEnd,
      self.onHelpMessage,
      self.onHelpAnimation
    );
    self.$nextTick(() => {
      //with this we skip the first change
      self.dataLoaded = true;
    });
  },
});
</script>

<style scoped>
#webcamVideo {
  width: var(--video-width);
  height: var(--video-height);
}
#webcamVideo,
#overlayCanvas {
  border-radius: 250px;
  position: absolute;
}
.rotate {
  transform: rotateY(180deg);
}
.videoContainer {
  
  position: relative;
  width: var(--video-width);
}
.helpContainer {
  padding-top: var(--help-container-padding-top);
}
.messageContainer {
  height: 100px;
  display: table;
}
.message {
  display: table-cell;
  vertical-align: middle;
}
</style>
