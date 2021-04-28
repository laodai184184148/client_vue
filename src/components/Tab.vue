<template>
  <div v-if="isActive"><br /><slot></slot></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Tab",
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      isActive: this.selected
    };
  },
  computed: {
    href() {
      return "#" + this.id.toLowerCase().replace(/ /g, "-");
    }
  }
});
</script>

<style scoped></style>
