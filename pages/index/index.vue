<template>
	<view class="index">
			<musichead title="随云听" :icon="false"></musichead>
			<view class="container">
				<!--允许纵向滚动-->
				<scroll-view scroll-y="true">
					<view class="index-search">
						<text class="iconfont icon-fangdajing"></text>
						<input type="text" placeholder="搜索歌曲" @tap="handleToSearch()" />
					</view>
					<view v-if="isLoading">
						<!-- circular square -->
						<m-for-skeleton
							:avatarSize="200"
							:row="3"
							:loading="loading"
							:isarc="square"
							v-for="(item,key) in 4"
							:titleStyle="{}"
							:title="false"
							:key="key">
						</m-for-skeleton>
					</view>
					<view class="index-list"v-else>
						<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.listId)">
							<view class="index-list-img">
								<image :src="item.coverImgUrl" mode=""></image>
								<text>{{item.updateFrequency}}</text>
							</view>
							<view class="index-list-text">
								<view v-for="(item,index) in item.tracks" :key="index">{{index + 1}}.{{item.first}}-{{item.second}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
	</view>
</template>

<script>
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	import '@/common/iconfont.css'
	import musichead from '../../components/musichead/musichead.vue'
	import { topList } from '../../common/api.js'
	export default {
		data() {
			return {
				topList:[],
				isLoading:true
			}
		},
		components:{
			musichead,
			mForSkeleton
		},
		onLoad() {
			topList().then(res=>{
				console.log(res)
				if(res.length){
					this.topList=res
					setTimeout(()=>{
					this.isLoading=false
					},1000)
				}
				
			})
		},
		methods: {
			handleToList(listId){
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId
				});
			},
			handleToSearch(){
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		}
	}
</script>

<style scoped>
	.index{}
	.index-search{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 10rpx 30rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
	}
	.index-search text{
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.index-search input{
		font-size: 28rpx;
		flex: 1;
		
	}
	.index-list{margin: 0 30rpx;}
	.index-list-item{
		display: flex;
		margin-bottom: 34rpx;
	}
	.index-list-img{
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 22rpx;
	}
	.index-list-img image{
		width:100%;
		height: 100%;
	}
	.index-list-img text{
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: #fff;
		font-size: 20rpx;
	}
	.index-list-text{
		font-size: 24rpx;
		line-height: 66rpx;
		width: 60vw;
		align-items: center;
		white-space: nowrap;/*不允许折行*/
		overflow: hidden;/*溢出隐藏*/
		text-overflow: ellipsis;/*溢出显示...*/
	}
	
</style>
