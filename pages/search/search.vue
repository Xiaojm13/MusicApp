<template>
	<view>
		<musichead title="搜索" :icon="true" :iconBlack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
					<view class="search-head">
						<text @tap="handleToSearch(searchWord)" class="iconfont icon-fangdajing"></text>
						<input type="text" @focus="handleText" @input="handleText" v-model="searchWord" placeholder="搜索歌曲" @confirm="handleToSearch(searchWord)" />
						<!-- <textarea value="text" placeholder="请输入" ></textarea> -->
						<text v-show="searchClear" @tap="searchWordClear" class="iconfont icon-guanbi wordClear"></text>
					</view>
				<block v-if="searchType == 1">
					<view class="search-title">
						<view class="search-title-head">
							历史记录
						<text @tap="handleClear" class="iconfont icon-lajitong"></text>
						</view>
						<view class="search-title-item">
							<view v-for="(item,index) in searchHistory" :key="index" @tap="handleToWord(item)" @longtap="longRemove">{{item}}
						</view>
							
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index" @tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{index+1}}</view>
							<view class="search-hot-word">
								<view>
									<text>{{item.searchWord}}</text>
									<!-- aspectFit 保持横纵比 -->
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{item.content}}</view>
							</view>
							<text class="search-hot-count">{{item.score}}</text>
						</view>
					</view>
				</block>
				<block v-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.artists[0].name}} - {{item.album.name}}</view>
							</view>
							<text class="iconfont icon-bofang_o"></text>
						</view>
					</view>
				</block>
				<block v-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{searchWord}}”</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" @tap="handleToSearch(item.keyword)">
							<text class="iconfont icon-fangdajing"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
		import musichead from '../../components/musichead/musichead.vue'
		import '@/common/iconfont.css'
		import { searchHotApi,searchWordApi,searchSuggestApi } from "../../common/api.js"
	export default {
		data() {
			return {
				isHot:true,
				// 1为搜索热搜，2为搜索输入提示
				searchType:1,
				searchHot:[],
				searchList:[],
				searchHistory:[],
				searchSuggest:[],
				searchWord:'',
				searchClear:false
			}
		},
		methods: {
			// 搜索框内容x清理
			searchWordClear(){
				this.searchWord=''
				this.searchClear=false
				this.searchType=1
			},
			// 当搜索框内容发生改变时触发，判断x是否显示
			handleText(e){
				let val=e.detail.value
				this.searchType=!val?1:3
				searchSuggestApi(val).then(res=>{
					if(res[1].data.code == '200'){
						this.searchSuggest=res[1].data.result.allMatch
					}
				})
				// X小图标显示状态
				this.searchClear=this.searchWord==''?false:true
				
			},
			// 一键清除搜索的历史记录
			handleClear(){
				uni.removeStorage({
					key:'searchHistory',
					success:res=>{
						// 清除本地数据成功后还要把项目的数组清空
						this.searchHistory=[]
					}
				})
				
			},
			// 点击热搜条时把字段显示到搜索框中
			handleToWord(word){
				this.searchWord=word;
				this.handleToSearch(word);
			},
			
			// 搜索输入框回车时保存字段到本地Storage
			handleToSearch(word){
				// 头部添加
				this.searchHistory.unshift(word)
				this.searchHistory=[...new Set(this.searchHistory)]
				if(this.searchHistory.length>10){
					this.searchHistory.length=10
				}
				uni.setStorage({
					key:'searchHistory',
					data:this.searchHistory
				})
				// 搜索
				this.getSearchList(word)
			},
			// 回车时发送请求，获取结果
			getSearchList(word){
				searchWordApi(word).then(res=>{
					if(res[1].data.code=='200'){
						this.searchList = res[1].data.result.songs
						this.searchType=2
					}
				
				})
			},
			handleDetail(songId){
				uni.navigateTo({
					url:'../detail/detail?songId='+songId
				})
			}
		},
		onLoad() {
			// 获取搜索历史--本地Storage数据
			uni.getStorage({
				key:'searchHistory',
				success:res=>{
					this.searchHistory=res.data
				}
			})
			searchHotApi().then(res=>{
				if(res[1].data.code == '200'){
					this.searchHot =res[1].data.data
					console.log(res)
				}
			})
		},
		components:{
			musichead
		}
	}
</script>

<style>
	.container{
		margin-top: 20rpx;
	}
	.search-head{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 10rpx 30rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
	}
	.search-head text{
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.search-head input{
		font-size: 28rpx;
		flex: 1;
	}
	
	.search-title{
		margin: 0 30rpx;
		font-size: 26rpx;
		display: flex;
		flex-direction: column;
		margin-bottom: 60rpx;
	}
	.search-title-head{
		margin: 30rpx 0;
		display: flex;
		justify-content: space-between;
	}
	.search-title-item{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-left: 20rpx;
	}
	.search-title-item view{
		border-radius: 30rpx;
		background: rgba(110,110,110,.1);
		padding: 6rpx 20rpx;
		margin: 30rpx 0 0 20rpx;
		
	}
	
	.search-hot{
		margin: 0 30rpx;
		font-size: 26rpx;
	}
	.search-hot-head{
		margin-bottom: 36rpx;
	}
	.search-hot-item{
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}
	.search-hot-top{
		color: #fb2222;
		width: 60rpx;
		margin-left: 8rpx;
	}
	.search-hot-word{
		flex: 1;
		/* font-size: 30rpx; */
	}
	.search-hot-word view:nth-child(1){
		font-size: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.search-hot-word view:nth-child(2){
		font-size: 20rpx;
		color: #878787;
	}
	.search-hot-word image{
		width: 50rpx;height: 20rpx;
	}
	
	.search-hot-count{
		color: #878787;
	}
	.search-result{
		border-top: 2rpx #e4e4e4 solid;
		padding: 30rpx;
	}
	.search-result-item{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx #e4e4e4 solid;
	}
	.search-result-word{
		
	}
	.search-result-word view:nth-child(1){
		font-size: 28rpx;
		color: #235790;
	}
	.search-result-word view:nth-child(2){
		font-size: 22rpx;
		color: #898989;
	}
	.search-result-item text{
		font-size: 50rpx;
	}
	.wordClear{
		border-radius: 50%;
		background: rgba(0,0,0,.2);
		padding: 10rpx;
	}
	
	
	
	
	
	
	
	.search-suggest{
		border-top: 2rpx #e4e4e4 solid;
		padding: 30rpx;
		font-size: 26rpx;
	}
	.search-suggest-head{
		margin-bottom: 74rpx;
		color: #4574a5;
	}
	.search-suggest-item{
		margin-bottom: 74rpx;
		color: #5d5d5d;
		
	}
	.search-suggest-item text{
		margin-right: 28rpx;
		color: #bdbdbd;
		position: relative;
		top: 2rpx;
		
	}
</style>
