<template>
  <div>
    <div class="tabs">
      <ul class="nav nav-tabs" role="tablist">
        <li v-for="tab in tabs" :key="tab.id" class="nav-item">
          <a class="nav-link" :class="{ active: tab.isActive }" :href="tab.href" @click="selectTab(tab)">{{
            tab.name
          }}</a>
        </li>
      </ul>
      <div class="tab-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Tabs",
  data() {
    return {
      firstTabId: window.location.hash.replace("#", ""),
      tabs: [] as Vue[]
    };
  },
  created() {
    // @ts-ignore
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab: Vue[]) {
      this.tabs.forEach(tab => {
        // @ts-ignore
        tab.isActive = tab.id === selectedTab.id;
      });
    }
  },
  mounted() {
    if (!this.firstTabId) {
      // @ts-ignore
      this.tabs[0].isActive = true;
    } else {
      this.tabs.forEach(tab => {
        // @ts-ignore
        tab.isActive = tab.id === this.firstTabId;
      });
    }
  }
});
</script>

<style scoped></style>
