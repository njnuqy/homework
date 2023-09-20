<template>
  <div>
	<ul>
		<li v-for="childComment  in childComments" :key="childComment.index">
			<span>用户{{ childComment .userName }} 回复 {{ parentComment.userName }} : {{ childComment .content }}</span>
			<el-button style="  margin-left: 100px;" size="mini" @click="reply(childComment.userName,childComment.id)">回复</el-button>
			
		</li>
	</ul>
  </div>
</template>

<script>
export default {
	props:['childComments','parentComment'],
	methods:{
		reply(userName,commentId){
		this.$emit('placeholder',"回复" + userName,commentId)
      }
	}
}
</script>

<style>

</style>