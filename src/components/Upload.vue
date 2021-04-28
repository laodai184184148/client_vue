<template>
  <div>
    <h5>{{ title }}</h5>
    <div
      class="dropzone"
      v-on:click="openFileSelection"
      v-on:drage="onDragEnter"
      v-on:dragover="onDragOver"
      v-on:dragleave="onDragOver"
      v-on:drop="onDrop"
      v-bind:class="{ hightlight: hightlight, disabled: !enabled }"
    >
      <lottie v-on:animCreated="handleAnimation" :options="lottieOptions" :height="50" />
      <br />
      <p>
        Click hoặc Kéo thả ảnh vào đây để upload
      </p>
      <canvas :id="`overlayCanvas-${index}`" width="0" height="0" />
      <input ref="fileInput" class="file-input" type="file" v-on:change="onFileChanged" accept="image/*" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Lottie from "vue-lottie/src/lottie.vue";
import * as upload from "@/assets/lottie/upload.json";

const IMAGE_HEIGHT = 140;

export default Vue.extend({
  name: "Upload",
  components: {
    Lottie
  },
  props: {
    title: String,
    index: {
      type: Number,
      default: () => 1
    },
    enabled: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {},
  data() {
    return {
      lottieOptions: {
        // @ts-ignore
        animationData: upload.default,
        autoplay: false
      },
      hightlight: false,
      anim: null as any,
      url: "",
      fileUpload: undefined as File | undefined,
      ro: null
    };
  },
  methods: {
    handleAnimation(anim: any): void {
      this.anim = anim;
    },
    openFileSelection(): void {
      if (!this.enabled) {
        return;
      }
      (this.$refs.fileInput as HTMLElement).click();
    },
    onDragEnter(event: DragEvent): void {
      event.preventDefault();
      this.hightlight = true;
    },
    onDragOver(event: DragEvent): void {
      if (!this.enabled) return;
      event.preventDefault();
      this.hightlight = false;
    },
    onDrop(event: DragEvent): void {
      if (!this.enabled) return;
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) {
        return;
      }
      this.fileUpload = files.item(0) as File;
      this.url = URL.createObjectURL(files.item(0));
    },
    onFileChanged(event: any) {
      const files: FileList = event.target.files;
      if (files.item(0)) {
        this.fileUpload = files.item(0) as File;
        this.url = URL.createObjectURL(files.item(0));
        this.emitFiledAdded(files.item(0) as File);
      }
    },
    emitFiledAdded(file: File) {
      const canvasElement = document.getElementById(`overlayCanvas-${this.index}`) as HTMLCanvasElement;
      if (!canvasElement) {
        throw "Canvas element not found";
      }
      const ctx = canvasElement.getContext("2d");
      const baseImage = new Image();
      baseImage.src = this.url;
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          const ratio = img.naturalWidth / img.naturalHeight;
          canvasElement.height = IMAGE_HEIGHT;
          canvasElement.width = IMAGE_HEIGHT * ratio;
          ctx?.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      const self = this;
      reader.onloadend = function() {
        const dataUrl = reader.result as string;

        self.$emit("fileAdded", dataUrl.substr(dataUrl.indexOf(",") + 1), self.index);
      };
    }
  },
  watch: {
    enabled: function(newVal: boolean) {
      if (!newVal) {
        this.anim.play();
      } else {
        this.anim.stop();
      }
    }
  }
});
</script>

<style scoped>
#app {
  margin: 15px;
}
[id^="overlayCanvas-"] {
  display: block;
  margin: 12px auto;
}
.dropzone {
  position: relative;
  padding: 10px 15px 10px 15px;
  border: 3px dashed #42b983;
  color: #42b983;
  font: bold 16px arial;
  /* min-height: 175px; */
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}

.hightlight {
  background-color: #b3dbc9;
}

.disabled {
  border: 3px dashed grey;
  color: grey;
}

.file-input {
  display: none;
}
</style>
