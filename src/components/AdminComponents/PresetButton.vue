<template>
  <button class="btn-76" @click="Preset">
    活动新开
    <span class="top"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <span class="left"></span>
  </button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'PresetButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // TODO: 这个还没写完
    Preset() {
      this.$router.push('/home/admin/presetForm')
    }
  }
}
</script>

<style scoped>
.btn-76,
.btn-76 *,
.btn-76 :after,
.btn-76 :before,
.btn-76:after,
.btn-76:before {
  border: 0 solid;
  box-sizing: border-box;
}

.btn-76 {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  position: relative;
  top: 50px;
  background-color: #31d1bd;
  background-image: none;
  color: #ffffff;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
    Noto Color Emoji;
  font-size: 25px;
  line-height: 1.5;
  margin: 0;
  /*-webkit-mask-image: -webkit-radial-gradient(#000, #fff);*/
  padding: 0;
}

.btn-76:disabled {
  cursor: default;
}

.btn-76:-moz-focusring {
  outline: auto;
}

.btn-76 svg {
  display: block;
  vertical-align: middle;
}

.btn-76 [hidden] {
  display: none;
}

.btn-76 {
  --neon: #1bedca;
  box-sizing: border-box;
  border-radius: 20px;
  display: block;
  font-weight: 900;
  -webkit-mask-image: none;
  outline: 4px solid #31d1bd;
  outline-offset: -4px;
  overflow: hidden;
  padding: 1.2rem 3rem;
  position: relative;
  text-transform: uppercase;
  transition: 0.2s linear 0.1s;
  margin: 20px auto; /* 20px是示例值，可以根据需要进行调整 */
}

.btn-76:hover {
  background: var(--neon);
  box-shadow: 0 0 5px var(--neon), 0 0 15px var(--neon), 0 0 25px var(--neon), 0 0 35px var(--neon);
  color: #fff;
  outline-color: transparent;
  transition: 0.2s linear 0.1s;
}

.btn-76 span {
  display: block;
  inset: 0;
  position: absolute;
}

/*.btn-76 .top {*/
/*    border-top: 4px solid var(--neon);*/
/*    opacity: 0;*/
/*    transform: translateX(calc(-100% + var(--progress, 0%)));*/
/*    transition: none;*/
/*}*/

/*.btn-76:hover .top {*/
/*    --progress: 100%;*/
/*    opacity: 1;*/
/*    transition: transform 0.2s linear;*/
/*}*/

/*.btn-76 .right {*/
/*    border-right: 4px solid var(--neon);*/
/*    opacity: 0;*/
/*    transform: translateY(calc(-100% + var(--progress, 0%)));*/
/*    transition: none;*/
/*}*/

/*.btn-76:hover .right {*/
/*    --progress: 100%;*/
/*    opacity: 1;*/
/*    transition: transform 0.2s linear 0.2s;*/
/*}*/

/*.btn-76 .bottom {*/
/*    border-bottom: 4px solid var(--neon);*/
/*    opacity: 0;*/
/*    transform: translateX(calc(100% - var(--progress, 0%)));*/
/*    transition: none;*/
/*}*/

/*.btn-76:hover .bottom {*/
/*    --progress: 100%;*/
/*    opacity: 1;*/
/*    transition: transform 0.2s linear 0.4s;*/
/*}*/

/*.btn-76 .left {*/
/*    border-left: 4px solid var(--neon);*/
/*    opacity: 0;*/
/*    transform: translateY(calc(100% - var(--progress, 0%)));*/
/*    transition: none;*/
/*}*/

/*.btn-76:hover .left {*/
/*    --progress: 100%;*/
/*    opacity: 1;*/
/*    transition: transform 0.2s linear 0.6s;*/
/*}*/
</style>
