<template>
  <div class="app">
    <app-header></app-header>
    <div class="contain">
      <app-navbar></app-navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";
export default {
  data() {
    return {};
  },

  components: {
    AppHeader,
    AppNavbar,
    AppMain
  },

  methods: {}
};
</script>

<style scoped>
.app {
  top: 0;
  height: 100%;
  width: 100%;
}
.header {
  z-index: 99;
  width: 100%;
  height: 53px;
  line-height: 53px;
  background: #2d3a4b;
  color: white;
}
.contain {
  box-sizing: border-box;
  position: relative;
  display: flex;
  height: 93%;
}
.navbar {
  width: 15%;
  background: #545c64;
  height: 100%;
  overflow-y: auto;
}
.main {
  flex: 1;
  height: 100%;
  padding: 10px;
  box-sizing: border-box
}
</style>