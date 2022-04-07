<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style>
	/*每个页面公共css */
	.fixbg{
		width: 100%;
		height: 100vh;
		/* 固定模式 */
		position: fixed;
		left: 0;
		top: 0;
		/* background-image: url(static/logo.png); */
		background-size: cover;/*可视 覆盖全部*/
		background-position:center 0 ;/* 定位 */
		/* 模糊 */
		filter: blur(14rpx);
		/* 去除白边 */
		transform: scale(1.2);
	}
</style>
