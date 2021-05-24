<template>
  <div>
    <el-form label-width="80px" :model="form">
      <el-form-item label="链接地址" prop="newsLink">
        <el-input v-model="form.newsLink" placeholder="当输入链接时，优先展示链接内容"></el-input>
      </el-form-item>
      <el-form-item label="标题名称" prop="newsTitle">
        <el-input v-model="form.newsTitle"></el-input>
      </el-form-item>
      <el-form-item>
        <TinymceEditor @input="debounce" :value="form.newsText"></TinymceEditor>
      </el-form-item>
      <el-form-item label="缩略图" prop="image">
        <el-upload
          class="upload-demo"
          action="/hy/medical/help/uploadPictures"
          :file-list="fileList"
          list-type="picture-card"
          :limit="1"
          name="files"
          accept="image/jpg, image/jpeg, image/png"
          :on-success="handleImageSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { _debounce } from "@/utils";
import TinymceEditor from "@/components/tEditor";
export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      form: {
        medicalNewsId: "",
        newsType: this.$route.name == "newsAdd" ? "0" : "1",
        newsTitle: "",
        newsLink: "",
        newsText: "",
        newsPic: "",
      },
      fileList: [],
      debounce: _debounce(this.editorInput, 300),
    };
  },
  created() {
    this.form.medicalNewsId = this.$route.params.id || ''
    this.queryNewsData()
  },
  methods: {
    async updateOrInsertNews() {
      let res = await this.$http.updateOrInsertNews({
        ...this.form
      });
      if (res && res.result && res.result.success) {
        let path =
          this.$route.name == "newsAdd" ? "/content/news" : "/content/banner";
        this.$router.push({ path: path });
      }
    },
    async queryNewsData() {
      if(!this.form.medicalNewsId) return
      let res = await this.$http.queryNewsData({medicalNewsId: this.form.medicalNewsId})
      if(res && res.medicalNew) {
        res = res.medicalNew
        this.form.newsTitle = res.newsTitle
        this.form.newsLink = res.newsLink
        this.form.newsText = res.newsText
        this.form.newsPic = res.newsPic
        res.newsPic ? this.fileList.push({name:'', url:res.newsPic}) : ''
      }
    },
    editorInput(v) {
      this.form.newsText = v;
    },
    handleImageSuccess(response) {
      if(response?.picIds) {
        this.form.newsPic = response.picIds[0]
      }
    },
    onSubmit() {
      this.updateOrInsertNews();
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
