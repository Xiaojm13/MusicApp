<template>
	<view class="list">
		<view class="fixbg":style="{'background-image':`url(${data.playlist.coverImgUrl})`}"></view>
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<view class="container" v-show="isLoading">
			
				<!--允许纵向滚动-->
				<scroll-view scroll-y="true">
					<view class="list-head">
						<view class="list-head-img">
							<image :src="data.playlist.coverImgUrl" mode=""></image>
							<text class="iconfont icon-yousanjiao">{{data.playlist.playCount | formatCount}}</text>
						</view>
						<view class="list-head-text">
							<view>{{data.playlist.name}}</view>
							<view >
								<image :src="data.playlist.creator.avatarUrl" mode=""></image>
								{{data.playlist.creator.nickname}}
							</view>
							<view >
								{{data.playlist.description}}
							</view>
						</view>
					</view>
					<!-- #ifdef MP-WEIXIN H5  -->
					<button class="list-share" open-type="share">
						<text class="iconfont icon-fenxiang">分享给微信好友</text>
					</button>
					<!-- #endif -->
					<view class="list-music">
						<view class="list-music-head">
							<text class="iconfont icon-bofang"></text>
							<text>部分全部</text>
							<text>(共{{ data.playlist.trackCount }}首)</text>
						</view>
						<view class="list-music-item" v-for="(item,i) in data.playlist.tracks" :key="i" @tap="handleTonDetail(item.id)">
							<view class="list-music-top">{{ i+1 }}</view>
							<view class="list-music-song">
								<view>{{ item.name }}</view>
								<view>
									<!-- <image v-if=" data.privileges[i].flag > 60 && data.privileges[i].flag < 70" src="../../static/aa.png" mode="">
									</image> -->
									<!-- <image v-if=" data.privileges[i].maxbr == 999000" src="../../static/bb.png" mode=""></image> -->
									<text v-if=" data.privileges[i].maxbr == 999000"  class="sq">
										SQ
									</text>
									{{item.ar[0].name }} - {{item.name}}
								</view>
							</view>
							<text class="iconfont icon-bofang_o"></text>
						</view>
					</view>
				</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {list} from '../../common/api.js'
	export default {
		data() {
			return {
				data:{
					playlist : {
						coverImgUrl:'',
						creator:{
							avatarUrl:''
						},
						trackCount:''
					},
					privileges:[]
					
				},
				// 当加载完成后显示页面(v-show )
				isLoading:false,
			}
		},
		
		onLoad(options) {
			// uni.showToast({
			// 	title:'加载中...'
			// })
			uni.showLoading({
				title:'加载中...'
			})
			console.log(options.listId)
			list(options.listId).then((res)=>{
				console.log(res)
				if(res[1].data.code == '200'){
					this.data.playlist = res[1].data.playlist
					this.data.privileges = res[1].data.privileges
					this.$store.commit('INIT_TOPLISTIDS',res[1].data.playlist.trackIds)
					this.isLoading=true
					uni.hideLoading()
				}
			})
		},
		methods: {
			handleTonDetail(songId){
				uni.navigateTo({
					url: '/pages/detail/detail?songId='+songId
				});
			}
		},
		components:{
			musichead
		}
	}
</script>

<style scoped>
	.list-head{display: flex;margin: 30rpx;}
	.list-head-img{
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}
	.list-head-img image{width: 100%;height: 100%;}
	.list-head-img text{
		position: absolute;
		right: 8rpx;
		color: white;
		font-size: 26rpx;
	}
	.list-head-text{flex: 1;color: #f0f2f7;}
	.list-head-text view:nth-child(1){
		color: #fff;
		
		font-size: 34rpx;
	}
	.list-head-text view:nth-child(2){
		display: flex;
		margin: 20rpx 0;
		font-size: 24rpx;
		align-items: center;
	}
	.list-head-text view:nth-child(2) image{
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}
	.list-head-text view:nth-child(3){
		line-height: 34rpx;
		font-size: 22rpx;
	}
	.list-share{
		width: 330rpx;
		height: 74rpx;
		margin: 0 auto;
		background: rgba(0,0,0,0.4);
		border-radius: 37rpx;
		color: #fff;
		text-align: center;
		line-height: 74rpx;
		font-size: 28rpx;
	}
	.list-share text{
		
	}
	.list-music{
		background-color: #fff;
		border-radius:50rpx;
		margin-top: 40rpx;
		overflow: hidden;
		
	}
	.list-music-head{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 50rpx;
		margin: 30rpx 0 70rpx 22rpx;
		
	}
	.list-music-head text:nth-child(1){
		font-size: 50rpx;
		height: 50rpx;
	}
	.list-music-head text:nth-child(2){
		font-size: 30rpx;		
		margin: 0 10rpx 0 26rpx;
	}
	.list-music-head text:nth-child(3){
		font-size: 20rpx;
		color: #b2b2b2;
	}
	.list-music-item{
		display: flex;
		margin: 0 32rpx 62rpx 46rpx;
		align-items: center;
		color:#959595;
	}
	.list-music-top{
		width: 58rpx;
		font-size: 30rpx;
		line-height: 50rpx;
	}
	.list-music-song{
		flex: 1;
	}
	.list-music-song view:nth-child(1){
		font-size: 28rpx;
		color: #000;
		/* 会压缩字体大小 */
		width: 70vw;
		white-space: nowrap;/*不允许折行*/
		overflow: hidden;/*溢出隐藏*/
		text-overflow: ellipsis;/*溢出显示...*/
	}
	.list-music-song view:nth-child(2){
		font-size: 24rpx;
		align-items: center;
		width: 70vw;
		white-space: nowrap;/*不允许折行*/
		overflow: hidden;/*溢出隐藏*/
		text-overflow: ellipsis;/*溢出显示...*/
	
	}
	.list-music-song view:nth-child(2) .sq{
		display: inline-block;
		width: 36rpx;
		height: 22rpx;
		font-size: 24rpx;
		margin:10rpx 10rpx 0 0;
		/* background-color: #ff100f; */
		flex-shrink: 0;
		line-height: 24rpx;
		border-radius: 4rpx;
		color: #ff100f;
		border: 1px #ff100f solid;
		
		/* 解决自动缩放字体 */
		/* flex-shrink: 0; */
	}
	.list-music-item text{
		font-size: 50rpx;
		color: #c7c7c7;
	}
</style>
