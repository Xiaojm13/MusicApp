<template>
	<view class="music-head" :style="{color}">
		<view v-if="icon" class="music-head-icon" :class="{'music-head-iconBlack':iconBlack}">
			<text class="iconfont icon-houtuijiantou" @tap="handleToBack"></text>|
			<text class="iconfont icon-shouye" @tap="handleToHome"></text>
		</view>
		<text style="color: #fff;">{{title}}</text>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	export default {
		data() {
			return {
				
			};
		},
		props:['title',"icon","color","iconBlack"],
		methods:{
			handleToBack(){
				uni.navigateBack()
			},
			handleToHome(){
				uni.navigateTo({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	.music-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: #fff;
		position: relative;
		
	}
	.music-head-icon{
		position: absolute;
		top:24px;
		left:8px;
		width: 90px;
		height: 30px;
		// 不设置行高的话，会继承行高
		line-height: 31px;
		background: rgba(0,0,0,0.4);
		border-radius: 15px;
		display: flex;
		justify-content: space-around;
	}
	.music-head-iconBlack{color: black;border: 1px #eaeaea solid; background: white;}
</style>
