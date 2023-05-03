<template>
  <swiper
    :slides-per-view="1"
    :space-between="8"
    navigation
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000 }"
    effect="fade"
    observer
    observeParents
    class="swiper-container"
  >
    <swiper-wrapper>
      <swiper-slide v-for="imageUrl in imageUrls" :key="imageUrl">
        <img :src="imageUrl" />
      </swiper-slide>
    </swiper-wrapper>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.min.css'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    imageUrls: {
      type: Array,
      required: true
    }
  }
}
</script>
