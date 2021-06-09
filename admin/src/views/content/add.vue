<template>
  <div>
    <el-form label-width="80px" :model="form">
      <el-form-item label="链接地址" prop="urlAddress">
        <el-input
          v-model="form.urlAddress"
          placeholder="当输入链接时，优先展示链接内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="标题名称" prop="titleChinese">
        <el-input v-model="form.titleChinese" placeholder="中文"></el-input>
        <el-input v-model="form.titleEnglish" placeholder="English"></el-input>
      </el-form-item>
      <el-form-item>
        <TinymceEditor
          @input="debounce"
          :value="form.contentChinese"
        ></TinymceEditor>
      </el-form-item>
      <el-form-item>
        <TinymceEditor
          @input="debounceEN"
          id="TinymceEditor-EN"
          :value="form.contentEnglish"
        ></TinymceEditor>
      </el-form-item>
      <el-form-item label="缩略图" prop="image">
        <el-upload
          class="upload-demo"
          action="/laowaitong/help/uploadPictures"
          :file-list="fileList"
          :on-remove="onRemove"
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
import CONST from "./data";
import { mapState } from "vuex";
export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      id: this.$route.params.id == "add" ? "" : this.$route.params.id,
      levelOneModuleChinese:
        this.$route.name == "bannerAdd"
          ? "banner"
          : this.$route.name == "noticeAdd"
          ? "通知公告"
          : "新区资讯",
      form: {
        urlAddress: "",
        titleChinese: "",
        titleEnglish: "",
        thumbnail: "",
        contentChinese: "",
        contentEnglish: "",
      },
      fileList: [],
      debounce: _debounce(this.editorInput, 300),
      debounceEN: _debounce(this.editorInputEN, 300),
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.queryNewsData();
  },
  methods: {
    async updateOrInsertNews() {
      let data = {
        id: this.id || '',
        levelOneModuleChinese: this.levelOneModuleChinese,
        founder: this.user.name,
        ...this.form,
      };
      let res = this.id ? this.$http.contentUpdate(data) : this.$http.contentAdd(data);
      res.then(() => {
        this.$message.success('操作成功')
        this.$route.path.replace(/\/([^/]*)$/g, (...args) => {
          const path = args && args[2] && this.$route.path.slice(0, args[2])
          this.$router.push({path: path})
        })
      })
    },
    queryNewsData() {
      if (!this.id) return;
      this.$http.contentDetail({ id: this.id }).then((res) => {
        const {
          titleChinese,
          titleEnglish,
          urlAddress,
          contentChinese,
          contentEnglish,
          thumbnail,
        } = res.data;
        this.form = {
          urlAddress: urlAddress,
          titleChinese: titleChinese,
          titleEnglish: titleEnglish,
          thumbnail: thumbnail,
          contentChinese: contentChinese,
          contentEnglish: contentEnglish,
        };
        thumbnail ? this.fileList.push({name:'', url:thumbnail}) : ''
      });
    },
    editorInput(v) {
      this.form.contentChinese = v;
    },
    editorInputEN(v) {
      this.form.contentEnglish = v;
    },
    handleImageSuccess(response) {
      if (response?.picIds) {
        this.form.thumbnail = CONST.HOST + response.picIds[0];
      }
    },
    onSubmit() {
      this.updateOrInsertNews();
    },
    onRemove() {
      this.fileList = []
      this.form.thumbnail = ''
    }
  },
};
</script>
<style lang='scss' scoped>
.el-input {
  width: 400px;
  & + .el-input {
    margin-left: 10px;
  }
}
</style>
