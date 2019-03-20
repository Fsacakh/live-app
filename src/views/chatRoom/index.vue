<template>
 <div class="mainF">
 	<PageHeader ref="header">
 	</PageHeader>
 	<iframe :src="Href" width="100%"  :height="height" frameborder="0" id="main">
	  <p>您的浏览器不支持  iframe 标签。</p>
	</iframe>
 </div>
</template>
<script>
  import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
import PageHeader from "components/header/PageHeader"
export default{
    components: {
        PageHeader,
    },
	data(){
		return{
			loginData: '',
			Href: '',
			height: 0,
			chatUrl: ''
		}
	},
  	created() {
        this.getLoginInfo()
        this.height = this.calcPageHeight(document)-44
    },
    computed:{
    	...mapState('homepage', [
                'loginInfo'
            ]),
    },
	methods:{
		calcPageHeight(doc){
	        let cHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
	        let sHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)
	        let height  = Math.max(cHeight, sHeight)
	        return height
	   },
	  	getLoginInfo: function() {
            const $this = this
            this.$store.dispatch('homepage/getLoginInfo', () => {
				this.loginData = this.loginInfo
				this.Href = this.$route.query.chatUrl
                //this.Href =`http://xycs.scrm.bzmaster.cn/chat?id=${this.loginData.empVo.empCode}`
            })
        },
	}
}
</script>

<style>

	#main{
		/*height: calc(100% - 0.44rem);*/
	}
</style>
