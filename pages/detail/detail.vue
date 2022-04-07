<template>
	<view class="detail" v-show="isLoading">
		<view class="fixbg":style="{'background-image':`url(${songDetail.al.picUrl})`}"></view>
		<!-- 详情{{songId}} -->
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		<view class="container">
				<!--允许纵向滚动-->
				<scroll-view scroll-y="true">
					<view class="detail-play">
						<image :src="songDetail.al.picUrl" :class="{'detail-play-run' : isPlayRotate}" mode=""></image>
						<text @tap="toPlaySong" :class="iconPlay" class="iconfont"></text>
						<view v-if="isPlayRotate" class="yes"></view>
						<view v-else class="no"></view>
						
						<view></view>
					</view>
					<view class="detail-lyric">
						<view class="detail-lyric-wrap"
						 :style="{ 'transform' : 'translateY('+ -(lyricIndex-1)*82 +'rpx)'}">
							<view class="detail-lyric-item" v-for="(item,index) in songLyric" :key="index" :class="{ active : lyricIndex == index}">{{item.lyric}}</view>
						</view>
					</view>
					<view class="detail-like">
						<view class="detail-like-head">喜欢这首歌的人也听</view>
						<!-- 相关音乐 -->
						<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
							<view class="detail-like-img">
								<image :src="item.album.picUrl" mode=""></image>
							</view>
							<view class="detail-like-song">
								<view>{{item.name}}</view>
								<view>
									<!-- 独家 -->
									<!-- <image v-if="item.privilege.flag >60 &&item.privilege.flag <70" src="../../static/bb.png" mode=""></image> -->
									<!-- SQ无损 -->
									<!-- #ifdef MP-WEIXIN -->
									<text style="width: 26rpx;height:20rpx;" v-if="item.privilege.maxbr=='999000'">SQ</text>
									{{item.album.artists[0].name}}-{{item.name}}
									<!-- #endif -->
									<!-- #ifndef MP-WEIXIN -->
									<text v-if="item.privilege.maxbr=='999000'">SQ</text>
									{{item.album.artists[0].name}}-{{item.name}}
									<!-- #endif -->
								</view>
							</view>
							<text class="iconfont icon-bofang_o"></text>
						</view>
					</view>
					<view class="detail-comment">
						<view class="detail-comment-head">
							精彩评论
						</view>
						<!-- ------ -->
						<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
							<view class="detail-comment-img">
								<image :src="item.user.avatarUrl" mode=""></image>
							</view>
							<view class="detail-comment-content">
								<view class="detail-comment-title">
									<view class="detail-comment-name">
										<view>{{item.user.nickname}}</view>
										<view>{{item.time}}</view>
									</view>
									<view class="detail-comment-like">
										{{item.likedCount}} <text class="iconfont icon-dianzan"></text>
									</view>
								</view>
								<view class="detail-comment-text">{{item.content}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
		</view>
		</view>
	</view>
</template>

<script>
		import musichead from '../../components/musichead/musichead.vue'
		import {songDetail,songSimi,songComment,songLyric,songUrl} from '../../common/api.js'
		import '@/common/iconfont.css'
	export default {
		data() {
			return {
				songId:'',
				isLoading:false,
				songDetail:{
					al:{
						picUrl:''
					}
				},
				// 放置类似歌曲
				songSimi:[],
				// 放置评论
				songComment:[],
				// 放置歌词
				songLyric:[],
				// 播放器
				bgAudioMannager:{},
				// 控制歌词的id
				lyricIndex:0,
				// 显示的暂停还是播放
				iconPlay:'icon-zanting_o',
				// 是否旋转，或者是否在播放
				isPlayRotate:true
			}
		},
		methods: {
			toPlaySong(){
				// 如果是暂停播放了
				if(this.bgAudioMannager.paused){
					this.bgAudioMannager.play()
				}
				else{
					this.bgAudioMannager.pause()
				}
			},
			// 歌词滚动
			listenLyricIndex(){
				// console.log(this.songLyric)
				clearInterval(this.timer)
				let s=this.songLyric
				this.timer = setInterval(()=>{
					for (var i = 0; i < s.length; i++) {
						if(this.bgAudioMannager.currentTime > s[s.length-1].time){
							this.lyricIndex = s.length-1;
							console.log('结束')
							break;
						}
						if(this.bgAudioMannager.currentTime > s[i].time&& this.bgAudioMannager.currentTime < s[i+1].time){
							// 显示当前行
							this.lyricIndex = i
							// 性能不行，调快一点歌词
							// this.lyricIndex = i+1
						}
					}
					// console.log(this.lyricIndex)
				},100);
			},
			canceLyricIndex(){
				clearInterval(this.timer)
			},
			handleToSimi(songId){
				this.getMusic(songId)
			},
			getMusic(songId){
				this.$store.commit('NEXT_ID',songId)
				this.isLoading=false
				uni.showLoading({
					title:'加载中...'
				})
				Promise.all([songDetail(songId),songSimi(songId),songComment(songId),songLyric(songId),songUrl(songId)]).then((res)=>{
					if( res[0][1].data.code == '200'){
						this.songDetail = res[0][1].data.songs[0]
					}
					if( res[1][1].data.code == '200'){
						this.songSimi = res[1][1].data.songs
					}
					if( res[2][1].data.code == '200'){
						this.songComment = res[2][1].data.hotComments
					}
					if( res[3][1].data.code == '200'){
						let lyric = res[3][1].data.lrc.lyric;
						// console.log(lyric)
						// 正则处理歌词
						let re=/\[([^\]]+)\]([^\[]+)/g
						// console.log(lyric.match(re))
						var result = [];
						lyric.replace(re,($0,$1,$2)=>{
							result.push({"time" : this.formatTimeToSec($1) , "lyric" : $2})
						})
						this.songLyric=result
					}
					if( res[4][1].data.code == '200' && res[4][1].data.url!==''){
						// #ifdef MP-WEIXIN
						this.bgAudioMannager = uni.getBackgroundAudioManager()
						this.bgAudioMannager.title = this.songDetail.name
						// #endif
						// #ifdef H5
						if(this.bgAudioMannager){
							this.bgAudioMannager = uni.createInnerAudioContext()
						}
						this.iconPlay = 'icon-bofang_o'
						this.isPlayRotate=false
						
						// #endif
						// this.songComment = res[2][1].data.hotComments
						this.bgAudioMannager.src = res[4][1].data.data[0].url || ''
						setTimeout(()=>{
							this.listenLyricIndex()
						},500)
						
						this.bgAudioMannager.onPlay(()=>{
							this.iconPlay='icon-zanting_o'
							this.isPlayRotate=true
							// 暂停歌词滚动
							this.listenLyricIndex()
						})
						this.bgAudioMannager.onPause(()=>{
							this.iconPlay='icon-bofang_o'
							this.isPlayRotate=false
							// 暂停歌词滚动
							this.canceLyricIndex()
						})
						this.bgAudioMannager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId);
						})
					}
					
					this.isLoading=true
					uni.hideLoading()
				})
			},
			formatTimeToSec(val){
				let arr=val.split(':')
				// toFixed保留小数位
				return parseFloat(arr[0])*60+parseFloat(arr[1]).toFixed(1)*1
			}
			
		},
		components:{
			musichead
		},
		// 离开页面
		onUnload() {
			this.canceLyricIndex()
			// #ifdef H5
			this.bgAudioMannager.destroy();
			// #endif
			
		},
		// 去上一级或者下一级，隐藏
		onHide() {
			this.canceLyricIndex()
			// #ifdef H5
			this.bgAudioMannager.destroy();
			// #endif
		},
		onLoad(options) {
			
			this.songId=options
			// console.log(options)
			this.getMusic(options.songId)
			uni.hideLoading()
			// setTimeout(()=>{
			// },1000)

			
		}
	}
</script>

<style>
.detail-play{width: 580rpx;height: 580rpx;background-color: #000000;background-size: cover;border-radius: 50%;
margin: 214rpx auto 0 auto;position: relative;}
.detail-play image{width: 370rpx;height: 370rpx;border-radius: 50%;position: absolute;left:0;right: 0;bottom: 0;top:0;margin: auto;animation: 10s linear move infinite;animation-play-state: paused;}
.detail-play .detail-play-run{
	animation-play-state: running;
}
@keyframes move{
	from{transform: rotate(0deg);}
	to{transform: rotate(360deg);}
}

.detail-play text{width: 150rpx;height: 150rpx;font-size: 150rpx;color: white;position: absolute;top:0;left:0;right: 0;bottom: 0;margin: auto;}
.detail-play .yes{
	width: 40rpx;
	height: 360rpx;
	border-radius: 20rpx;
	background-color: #959595;
	position: absolute;
	top: -80rpx;
	left: 196rpx;
	transform: rotateZ(-45deg);
	right: 0;
	margin: 0 auto;
	background: cover;
}
.detail-play .no{
	width: 40rpx;
	height: 360rpx;
	border-radius: 20rpx;
	background-color: #959595;
	position: absolute;
	left: 256rpx;
	top: -110rpx;
	transform: rotateZ(-60deg);
	right: 0;
	margin: 0 auto;
	background: cover;
}
.detail-lyric{
	font-size: 32rpx;
	line-height: 82rpx;
	height: 246rpx;
	text-align: center;
	overflow: hidden;
	color: #8b8b8b;
}
.detail-lyric-wrap{
	transition: .5s;
}
.detail-lyric-item{
	height: 82rpx;
}
.detail-lyric-item.active{
	color: #fff;
}
.detail-like{margin: 0 30rpx;}
.detail-like-head{font-size: 32rpx;color: #fff;margin: 50rpx 0;}
.detail-like-item{display: flex;align-items: center;margin-bottom: 28rpx;}
.detail-like-img{width: 82rpx;height: 82rpx;border-radius: 20rpx;overflow: hidden;margin-right: 20rpx;}
.detail-like-img image{width: 100%;height:100%}
.detail-like-song{flex: 1;color: #c6c2bf;}
.detail-like-song view:nth-child(1){font-size: 28rpx;color: #fff;margin-bottom: 12rpx;}
.detail-like-song view:nth-child(2){font-size: 22rpx;color: #fff;margin-bottom: 12rpx;}
.detail-like-song view:nth-child(2) text{
		display: inline-block;
		width: 30rpx;
		height: 22rpx;
		/* #ifdef */
		font-size: 18rpx;
		margin:10rpx 10rpx 0 0;
		/* background-color: #ff100f; */
		flex-shrink: 0;
		line-height: 22rpx;
		border-radius: 4rpx;
		color: #ff100f;
		border: 1px #ff100f solid;
}
.detail-like-item text{font-size: 50rpx;color: #c6c2bf;}


.detail-comment{margin: 0 30rpx;} 
.detail-comment-head{font-size: 36rpx;color: #fff;margin: 50rpx 0;}
.detail-comment-item{margin-bottom: 28rpx;display: flex;}
.detail-comment-img{width: 64rpx;height: 64rpx;overflow: hidden;border-radius: 50%;margin-right: 18rpx;}
.detail-comment-img image{width: 100%;height: 100%;}
.detail-comment-content{flex: 1;color: #cbcacf;}
.detail-comment-title{display: flex;justify-content: space-between;}
.detail-comment-name{}
.detail-comment-name view:nth-child(1){font-size: 26rpx;}
.detail-comment-name view:nth-child(2){font-size: 20rpx;}
.detail-comment-like{font-size: 28rpx;}
.detail-comment-text{font-size: 28rpx;line-height: 40rpx;color: #fff;margin-top: 20rpx;border-bottom: 2rpx #e0e0e0 solid;padding-bottom: 40rpx;}

</style>
