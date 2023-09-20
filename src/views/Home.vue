<template>
  <div>
    <el-container>
    <el-header style="display:flex">
        <div style="flex:1;" class="leftHeader">
            <span style="float: left;color:blue;font-size: 40px;">知乎</span>
            <span>首页</span>
            <span>会员</span>
            <span>发现</span>
            <span>等你来答</span>
        </div>
        <div style="flex:1">
          <input type="text" style="height: 30px;width: 400px;margin-top: 20px;" v-model="searchInfo" @input="search"/>
          <el-button type="primary" icon="el-icon-search" style="height: 40px;margin-top: 18px;width: 80px;" @click="searchInfoByKeyword">搜索</el-button>
          <ul style="list-style-type: none;float:left;">
            <li v-for="info in infolist" :key="info.index" style="margin: -20px;"><el-button style="width: 400px;">{{ info }}</el-button></li>
          </ul>
        </div>
        <div style="flex:1">
            <span><i class="el-icon-success"></i>无障碍</span>
            <el-button style="margin-left: 40px;">{{text}}</el-button>
        </div>
    </el-header>
    <el-main>
      <!-- 评论区 -->
      <div ref="comment" style="display:none;position: fixed;margin-left: 20%;background-color:aliceblue;height: 500px;width: 1000px;">
        <el-button style="float: right;background-color: aliceblue;" icon="el-icon-close" @click="closeComments"></el-button>
        <ul style="margin-top: 5%;">
          <li v-for="comment in commentList" :key="comment.id">
            <div>
              <div>
                <span>用户</span><span>{{ comment.userName }} </span><span>发表评论：</span><span>{{ comment.content }}</span>
                <el-button style="  margin-left: 100px;" size="mini" @click="reply(comment.userName,comment.id)">回复</el-button>
              </div>
                <child-comment @placeholder="getplaceHolder" :childComments="comment.child" :parentComment="comment"  v-if="comment.child != null" />
            </div>
          </li>
        </ul>
        <!-- 回复评论区 -->
        <div style="display:flex;position:absolute;bottom: 0;width: 100%">
          <el-input  :placeholder="placeholder" style="flex:20" v-model="replyContent"></el-input>
          <el-button style="flex:1" @click="sendComment()">发送</el-button>
        </div>
        <!-- 文章区 -->
      </div>
        <div v-for="blog in bloglist" :key="blog.id" style="display:flex;flex-direction:column;height: 300px;margin-bottom: -150px;margin-left: 200px;">
          <div style="display: flex;flex-direction: column;">
            <p style="float: left;font-weight: bold;font-size:25px;margin-right: 1200px;flex: 1;">{{blog.title}}</p>
            <p style="float: left;flex:1;">{{ blog.content }}</p>
          </div>
          <div>
            <el-button type="primary" round size="small" icon="el-icon-caret-top" @click="likeComment(blog.id)" v-if="!likeDetailList.includes(blog.id)">赞同 <span>{{ blog.likeNum }}</span></el-button>
            <el-button type="primary" round size="small" icon="el-icon-caret-top" @click="removeLikeComment(blog.id)" v-if="likeDetailList.includes(blog.id)">已赞同 <span>{{ blog.likeNum }}</span></el-button>
            <el-button type="primary" round size="mini" icon="el-icon-caret-bottom"></el-button>
            <el-button class="el-icon-chat-round" style="margin-left: 50px;" @click="getCommentList(blog.id);showComments(blog.id)">评论</el-button>
            <span style="margin-left: 100px;">{{ blog.time }}</span>
          </div>
        </div>
    </el-main>
</el-container>
  </div>
</template>

<script>
import request  from '@/utils/request';
import ChildComment from '../components/childComment.vue';
  export default {
    name:"Home_",
    components:{
      'child-comment': ChildComment,
    },
    data() {
      return {
        text:"",
        bloglist:"",
        commentList:[],
        currentUser:"",
        likeDetailList:"",
        searchInfo:"",
        infolist:"",
        childComments:[],
        placeholder:"",
        replyContent:"",
        blogId:"",
        parentId:null
      };
    },
    methods: {
      sendComment(){
        request.post('/comment/replyComment', {
          content: this.replyContent,
          userId: this.currentUser.id,
          userName: this.currentUser.username,
          blogId: this.blogId,
          parentId: this.parentId
        }, {
          headers: {
        'Content-Type': 'application/json'
       }})
       this.parentId = null
       this.replyContent = ""
      },
      getplaceHolder(message,commentId){
        this.placeholder = message
        this.parentId = commentId
      },
      reply(userName,commentId){
        this.placeholder = "回复" + userName
        this.parentId = commentId
        console.log(commentId)
      },
      closeComments(){
        this.$refs["comment"].style.display = "none"
      },
      search(){
        const _this = this
        if(this.searchInfo == ""){
          this.infolist = ""
        }else{
          request.get("/blog/search",{params:{
          searchInfo:this.searchInfo
        }}).then(res=>{
          _this.infolist = res.data
          console.log(_this.infolist)
        })
        }
       
      },
      getCommentList(blogId){
        this.$axios.get("/comment/getComment",{params:{blogId:blogId}}).then(res=>{
          console.log(res.data)
          this.commentList = res.data.data
        })
      },
      showComments(blogId){
          this.$refs["comment"].style.display = "block"
          this.blogId = blogId
        },
      likeComment(blogId){
        const _this = this
        if(this.currentUser == ""){
          this.$router.push("/login")
        }else{
          this.currentUser = eval('('+ localStorage.getItem("user") +')')
          request.get("/blog/like",{params:{
          userId:this.currentUser.id,
          blogId:blogId,
        }}).then(
          _this.bloglist.find(blog => blog.id === blogId).likeNum++
        )
        _this.likeDetailList.push(blogId)
      }
      },
      removeLikeComment(blogId){
        const _this = this
        request.get("/blog/removeLike",{params:{
          userId:this.currentUser.id,
          blogId:blogId,
        }}).then(
          _this.bloglist.find(blog => blog.id === blogId).likeNum--
        )
        var index = _this.likeDetailList.indexOf(blogId)
        _this.likeDetailList.splice(index,1)
      },
      searchInfoByKeyword(){
        const _this = this
        request.get("/blog/searchByKeyword",{params:{
          keyword:this.searchInfo
        }}).then(res=>{
          console.log(res)
          _this.bloglist = res.data 
        })
      }
    },
    created(){
      const _this = this
      request.get("/blog/list").then(res=>{
          _this.bloglist = res.data
        })  
      var user = localStorage.getItem("user")
        
        if(user == null){
            this.text = "登录"
        }else{
          this.currentUser = eval('('+ localStorage.getItem("user") +')')
            this.text = "退出登录"
            request.get("/blog/getLikeDetail",{params:{
              userId:this.currentUser.id
            }}).then(res=>{
              console.log(res)
              _this.likeDetailList = res.data
              console.log(_this.likeDetailList)
            })
        }
    }
  };
</script>

<style>
  .el-header, .el-footer {
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .leftHeader > span{
    margin-left: 20px;
    float:left;
  }
</style>