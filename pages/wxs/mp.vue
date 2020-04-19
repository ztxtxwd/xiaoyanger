<template>
    <view>
        <view class="area">
            <view @touchstart="test.touchstart" @touchmove="test.touchmove" class="movable" @tap="slide" style="">{{test.msg}}</view>
        </view>
    </view>
</template>
<script module="test" lang="wxs">
    var startX = 0
    var startY = 0
    var lastLeft = 50; var lastTop = 50
    function touchstart(event, ins) {
        console.log("touchstart")
      var touch = event.touches[0] || event.changedTouches[0]
      // startX = touch.pageX
      startY = touch.pageY
    }
	function touch(event, ins) {
	    console.log("touchstart")
	  var touch = event.touches[0] || event.changedTouches[0]
	  // startX = touch.pageX
	  startY = touch.pageY
	}
    function touchmove(event, ins) {
      var touch = event.touches[0] || event.changedTouches[0]
      // var pageX = touch.pageX
      var pageY = touch.pageY
      // var left = pageX - startX + lastLeft
      var top = pageY - startY + lastTop
      // startX = pageX
      startY = pageY
      // lastLeft = left
      lastTop = top
      ins.selectComponent('.movable').setStyle({
        // left: left + 'px',
        top: top + 'px'
      })
        return false
    }
    module.exports = {
        msg: 'Hello',
      touchstart: touchstart,
      touchmove: touchmove
    }
</script>

<script>
    export default {
        data() {
            return {
				top:0
            }
        },
        methods: {
			slide:function(){
				
			}
        }
    }
</script>

<style>
.area{
    position: absolute;
    width: 100%;
    height: 100%;
}
.movable{
    position: absolute;
    width: 750rpx;
    height: 100px;
    left: 0px;
    top: 50px;
    color: white;
    text-align: center;
    line-height: 100px;
    background-color: red;
}
</style>