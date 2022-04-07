import { baseUrl } from "./config.js"
export function topList(){
			// uni.request({
			// 	url: `${baseUrl}/toplist/detail`,
			// 	method: 'GET',
			// 	data: {},
			// 	success: res => {
			// 		for (var i = 0; i < res.length; i++) {
			// 		console.log(res[i].name,res[i].id)
			// 		}
			// 		console.log(res)
			// 	}
			// });
	let listIds = ['19723756','3779629','2884035','3778678']
	return new Promise((reslove,reject)=>{
			uni.request({
				// http://localhost:3000/toplist/detail
				url: `${baseUrl}/toplist/detail`,
				method: 'GET',
				data: {},
				success: res => {
					let result = res.data.list
					result.length=4
					for(let i=0;i<listIds.length;i++){
						result[i].listId=listIds[i]
					}
					reslove(result)
					console.log(res)
				},
				fail: () => {},
				complete: () => {}
			});
	})
	
}
				// http://localhost:3000/playlist/detail?id=?
export function list(listId){
	return uni.request({
			url: `${baseUrl}/playlist/detail?id=${listId}`,
			method: 'GET'
		});
	
}
				// http://localhost:3000/song/detail?ids=?
export function songDetail(songId){
	return uni.request({
			url: `${baseUrl}/song/detail?ids=${songId}`,
			method: 'GET'
		});
	
}
				// 类似 http://localhost:3000/simi/song?id=?
export function songSimi(songId){
	return uni.request({
			url: `${baseUrl}/simi/song?id=${songId}`,
			method: 'GET'
		});
	
}
				//评论 http://localhost:3000/comment/music?id=?
export function songComment(songId){
	return uni.request({
			url: `${baseUrl}/comment/music?id=${songId}`,
			method: 'GET'
		});
	
}
				// http://localhost:3000/lyric?id=?
export function songLyric(songId){
	return uni.request({
			url: `${baseUrl}/lyric?id=${songId}`,
			method: 'GET'
		});
	
}
				//评论 http://localhost:3000/song/url?id=?
export function songUrl(songId){
	return uni.request({
			url: `${baseUrl}/song/url?id=${songId}`,
			// url: `${baseUrl}/song/url?idx=${listId}`,
			method: 'GET'
		});
	
}
				//评论 http://localhost:3000/?
export function searchHotApi(){
	return uni.request({
			url: `${baseUrl}/search/hot/detail`,
			method: 'GET'
		});
}
				//评论 http://124.222.161.252:9003/search?keywords=队长
export function searchWordApi(word){
	return uni.request({
			url: `${baseUrl}/search?keywords=${word}`,
			method: 'GET'
		});
}
				//下拉提示 http://localhost:3000/?
export function searchSuggestApi(word){
	return uni.request({
			url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
			method: 'GET'
		});
}