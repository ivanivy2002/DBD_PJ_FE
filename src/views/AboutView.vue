<template>
  <div class="about">
    <div class="intro-section">
      <img src="../assets/images/photo_intro/yty.jpg" alt="yty" class="intro-photo" />
      <h1 class="intro-name">叶天逸 21302010040</h1>
      <p class="intro-text">
        来自浙江台州，台州是一个小城市，市区有三个部分。热爱语言，2022年秋季开始学习一些日语，俄语。有小部分语言学知识，语音学方面尤其喜欢。ENFP，虽然觉得这还不够定义我。还喜欢一点运动，音乐，BeatBox等，最近在参加
        A Capella,哲学，最近不太运动。
      </p>
    </div>
    <div class="intro-section">
      <img src="../assets/images/photo_intro/zy.jpg" alt="zy" class="intro-photo" />
      <h1 class="intro-name">邹懿 21302010073</h1>
      <p class="intro-text">
        大家好，我是邹懿，来自四川省达州市。喜欢吃辣却在上海已经退化，不爱熬夜却在学校三教久留，不愿敲代码却在上软工(bushi)
      </p>
    </div>
    <div class="intro-section">
      <img src="../assets/images/photo_intro/cpy.jpg" alt="cpy" class="intro-photo" />
      <h1 class="intro-name">陈沛仪 21307130470</h1>
      <p class="intro-text">
        大家好，我是陈沛仪，来自贵州省贵阳市。喜欢吃辣且在上海继续保持，退化程度远没有上面那位严重；喜欢熬夜且经常三教久留，但和上面那位一样爱长痘；喜欢敲代码且也来了软工，但和上面那位一样好像都不太聪明的样子。
      </p>
    </div>
    <div class="intro-section">
      <img src="../assets/images/photo_intro/hcy.jpg" alt="hcy" class="intro-photo" />
      <h1 class="intro-name">洪淳宇 21302010035</h1>
      <p class="intro-text">
        我是2021级软件工程的洪淳宇，来自浙江金华；稳定的ISFJ型人格，善于比大拇指，担任班级信息委员以及参与学校的PCS服务队；平时比较喜欢羽毛球、网球等球类运动以及围棋等智力游戏。
      </p>
    </div>
    <!--      <Avatar/>-->
  </div>
</template>
<style>
.about {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 2rem;
}

.intro-section {
  flex-basis: calc(25% - 1rem);
  margin-bottom: 2rem;
  text-align: center;
}

.intro-photo {
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.intro-name {
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.intro-text {
  margin-top: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
}
</style>
<script>
import axios from 'axios'
import Avatar from '@/components/PicUpLoad/Avatar.vue'
import PicUpLoad from '@/components/PicUpLoad/PicUpLoad.vue'
export default {
  name: 'AboutView',
  created() {
    this.load()
  },
  methods: {
    load() {
      // axios.get('localhost:9000/user')
    }
  }
}
</script>

<!-- 在这个解决方案中，我使用了Flexbox来创建一个适应不同屏幕尺寸的响应式布局。
  每个团队成员的介绍都放在一个类为"intro-section"的div中，该div具有固定宽度为25%和下边距2rem。
  团队成员的照片被设计为居中、圆形，大小为200px x 200px。名字和文本都被赋予了不同的字体大小和边距值，
  以使它们突出显示。 -->
