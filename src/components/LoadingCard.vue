<template>
  <div class="loading_card">
    <div class="spinner-wrapper" v-show="showFlag">
      <span class="spinner"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['showFlag'],
}
</script>

<style lang="scss" scoped>
  .loading_card {
    animation:fadein 2s;
  }
  @keyframes fadein {
    from {opacity:0}
    to {opacity:1}
  }

  .spinner-wrapper {
    min-width:100%;
    min-height:100%;
    height:100%;
    top:0;
    left:0;
    background:rgba(255,255,255,0.93);
    position:absolute;
    z-index:300;
  }

  .spinner {
    margin:0;
    display:block;
    position:absolute;
    left:45%;
    top:40%;
    border:25px solid rgba(100,100,100,0.2);
    width:1px;
    height:1px;
    border-left-color:transparent;
    border-right-color:transparent;
    border-radius:50px;
    animation:spin 1.5s infinite;
  }

  @keyframes spin  {
    0%,100% {transform:rotate(0deg) scale(1)}
    50%     {transform:rotate(720deg) scale(0.6)}
  }
</style>
