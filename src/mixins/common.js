import wepy from 'wepy'

export default class Common extends wepy.mixin {
  data = {
      currentIndex: 0
  }

  props = {
       vipPhoneticList: {
          type: Array,
          default: []
       },
       canUseNumber: {
          type: Number,
          default: 9
       },
       item: {
          type: Object,
          default: {}
       }
  }

  methods = {
    playVideo(index, e){
        this.$parent.playVideo(index)
    },
    touchStart(e){
        this.$parent.touchStart(e)
    },
    touchMove(e){
        this.$parent.touchMove(e)
    }
  }

  //非会员切换swiper之后退回上一个
  back(){
      this.$invoke("main", "back")
  }
}
