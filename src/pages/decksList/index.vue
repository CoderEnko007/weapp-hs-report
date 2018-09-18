<template>
  <div class="container">
    <div class="panel">
      <div class="panel-block">
        <ul class="factions">
          <li :class="{'factions-item': true, 'factions-item-action': selectedFaction.id===item.id}"
              v-for="(item, index) in factionIcons"
              :key="index"
              @click="handleIconsClick(item)">
            <div class="icon">
              <img :src="item.image" alt="item.id" mode="aspectFit">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>
<script>
import utils from '@/utils'
export default {
  data() {
    return {
      selectedFaction: '',
      factionIcons: null,
    }
  },
  methods: {
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image1})
        }
      }
    },
    handleIconsClick(item) {
      this.selectedFaction = item.id
      console.log(this.selectedFaction)
    }
  },
  mounted() {
    this.selectedFaction = this.$root.$mp.query.id
    this.genFactionIcons()
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.container {
  position: relative;
  width: 100%;
  ul.factions {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    .factions-item {
      position: relative;
      width: 8%;
      height: 120rpx;
      .icon {
        position: absolute;
        width: 70rpx;
        height: 70rpx;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
          box-sizing: border-box;
          border: 2px solid transparent;
        }
      }
    }
    .factions-item img {
      border: 2px solid $palette-orange!important;
    }
  }
}
</style>
