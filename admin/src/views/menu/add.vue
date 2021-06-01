<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <div class="form-add">
        <el-form-item label="名称">
          <el-input
            v-model="form.levelTwoModuleChinese"
            placeholder="中文"
          ></el-input>
          <el-input
            v-model="form.levelTwoModuleEnglish"
            placeholder="English"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.msgChinese" placeholder="中文"></el-input>
          <el-input v-model="form.msgEnglish" placeholder="English"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="image">
          <el-upload
            class="upload-demo"
            action="/laowaitong/help/uploadPictures"
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
        <el-form-item label="跳转方式">
          <el-select v-model="form.skipType" placeholder="请选择活动区域">
            <el-option
              v-for="item in skipType"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接" v-if="form.skipType == 1">
          <el-input v-model="form.contentChinese"></el-input>
        </el-form-item>
        <el-form-item label="小程序" v-if="form.skipType == 2">
          <el-input v-model="form.contentChinese"></el-input>
        </el-form-item>
        <el-form-item label="公众号" v-if="form.skipType == 3">
          <el-input v-model="form.contentChinese"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="资讯列表" v-if="form.skipType == 4">
        <el-input v-model="newsNameList" disabled></el-input>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="55"> </el-table-column>
          <el-table-column prop="titleChinese" label="标题名称">
          </el-table-column>
          <el-table-column prop="urlAddress" label="链接地址">
          </el-table-column>
          <el-table-column prop="thumbnail" label="缩略图" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.thumbnail" alt="" />
            </template>
          </el-table-column>
          <el-table-column
            prop="creditTime"
            :formatter="formatter"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleTable(scope.row)"
                >{{
                  newsIdList.includes(scope.row.id) ? "移除" : "添加"
                }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page.sync="currentPage"
          :page-sizes="pageSizeList"
          :page-size.sync="offset"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleListChange"
          @current-change="handleListChange"
        >
        </el-pagination>
      </el-form-item>
      <template v-if="form.skipType == 5">
        <el-form-item label="须知">
          <TinymceEditor
            @input="debounce"
            :value="form.contentChinese"
          ></TinymceEditor>
          <TinymceEditor
            @input="debounceEN"
            id="TinymceEditor-EN"
            :value="form.contentEnglish"
          ></TinymceEditor>
        </el-form-item>
        <el-form-item label="机构列表">
          <el-form :inline="true" :model="formInline">
            <div
              v-for="(item, index) in formInline.list"
              class="org-item"
              :key="item.id"
            >
              <el-form-item label="机构名称">
                <el-input v-model="item.name" placeholder="中文"></el-input>
                <el-input v-model="item.nameEN" placeholder="EN"></el-input>
              </el-form-item>
              <el-form-item label="机构地址">
                <el-input v-model="item.address" placeholder="中文"></el-input>
                <el-input v-model="item.addressEN" placeholder="EN"></el-input>
              </el-form-item>
              <el-form-item class="add-btn">
                <el-button
                  v-if="index == formInline.list.length - 1"
                  type="primary"
                  class="el-icon-plus"
                  @click="addOrgList"
                  size="small"
                ></el-button>
                <el-button
                  v-if="index"
                  type="primary"
                  class="el-icon-minus"
                  @click="removeOrgList(index)"
                  size="small"
                ></el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { _debounce, dateFormat } from "@/utils";
import CONST from "./data";
import TinymceEditor from "@/components/tEditor";
import { findIndex } from "loadsh";
export default {
  components: {
    TinymceEditor,
  },
  computed: {
    ...mapGetters(["token"]),
    newsNameList() {
      let msg = [];
      this.tableDataChecked.forEach((element) => {
        msg.push(element.titleChinese);
      });
      return msg.join(",");
    },
    newsIdList() {
      let msg = [];
      this.tableDataChecked.forEach((element) => {
        msg.push(element.id);
      });
      return msg;
    },
  },
  data() {
    return {
      id: this.$route.params.id == "add" ? "" : this.$route.params.id,
      levelOneModuleChinese:
        this.$route.name == "policyAdd"
          ? 1
          : this.$route.name == "credential"
          ? 2
          : 3,
      form: {
        levelTwoModuleChinese: "",
        levelTwoModuleEnglish: "",
        msgChinese: "",
        msgEnglish: "",
        icon: "",
        skipType: 1,
      },
      formInline: {
        list: [
          {
            name: "",
            nameEN: "",
            address: "",
            addressEN: "",
          },
        ],
      },
      newsList: [],
      fileList: [],
      skipType: CONST.HREF_TYPE_LIST,
      tableData: [],
      tableDataChecked: [],
      currentPage: 1,
      offset: 10,
      total: 0,
      pageSizeList: CONST.PAGE_SIZE_LIST,
      debounce: _debounce(this.editorInput, 300),
      debounceEN: _debounce(this.editorInput, 300),
    };
  },
  mounted() {
    this.getNewsList();
    this.queryMenuDetail();
  },
  methods: {
    handleTable(scope) {
      const index = findIndex(this.tableDataChecked, ["id", scope.id]);
      if (index > -1) {
        this.tableDataChecked.splice(index, 1);
      } else {
        this.tableDataChecked.push({
          titleChinese: scope.titleChinese,
          id: scope.id,
        });
      }
    },
    handleListChange() {
      this.getNewsList();
    },
    getNewsList() {
      let data = {
        levelOneModuleChinese: "新区资讯",
        status: 1,
        keyword: "",
        page: this.currentPage,
        pageSize: this.offset,
      };
      this.$http.contentQuery(data).then((res) => {
        let list = res.data.list;
        this.tableData = list;
        this.total = res.data.total;
      });
    },
    queryMenuDetail() {
      if (!this.id) return;
      this.$http.entryDetail({ id: this.id }).then((res) => {
        const {
          levelTwoModuleChinese,
          levelTwoModuleEnglish,
          contentChinese,
          contentEnglish,
          msgChinese,
          msgEnglish,
          icon,
          skipType,
          orgManagementList,
        } = res.data;
        this.form = {
          levelTwoModuleChinese,
          levelTwoModuleEnglish,
          msgChinese,
          msgEnglish,
          icon,
          skipType,
          contentChinese,
          contentEnglish,
        };
        this.formInline.list = orgManagementList || [];
        if (skipType == 4) {
          const arr = (contentChinese && contentChinese.split(",")) || [];
          arr.length ? this.contentQueryBatch(arr) : "";
        }
        icon ? this.fileList.push({ name: "", url: icon }) : "";
      });
    },
    addOrgList() {
      this.formInline.list.push({
        name: "",
        nameEN: "",
        adress: "",
        adressEN: "",
      });
    },
    removeOrgList(index) {
      this.formInline.list.splice(index, 1);
    },
    contentQueryBatch(arr) {
      let data = {
        id: arr,
      };
      this.$http.contentQueryBatch(data).then((res) => {
        const list = res.data;
        list.forEach((item) => {
          this.tableDataChecked.push({
            titleChinese: item.titleChinese,
            id: item.id,
          });
        });
      });
    },
    entryAdd() {
      let data = {
        id: this.id || "",
        founder: this.token,
        levelOneModuleChinese: this.$route.meta.title,
        ...this.form,
      };
      if (this.form.skipType == 5) {
        data.orgManagementList = this.formInline.list;
      }
      this.form.skipType == 4
        ? (data.contentChinese = this.newsIdList.join(","))
        : "";
      let res = this.id
        ? this.$http.entryUpdate(data)
        : this.$http.entryAdd(data);
      res.then(() => {
        this.$message.success("操作成功");
        this.$route.path.replace(/\/([^/]*)$/g, (...args) => {
          const path = args && args[2] && this.$route.path.slice(0, args[2]);
          this.$router.push({ path: path });
        });
      });
    },
    formatter(row, col) {
      if (col.property == "status") {
        return row.status == 1 ? "显示" : "隐藏";
      } else {
        return dateFormat("YYYY-mm-dd HH:MM", row.creditTime);
      }
    },
    handleImageSuccess(response) {
      if (response?.picIds) {
        this.form.icon = CONST.HOST + response.picIds[0];
      }
    },
    editorInput(v) {
      this.form.contentChinese = v;
    },
    editorInputEN(v) {
      this.form.contentEnglish = v;
    },
    submitForm() {
      this.entryAdd();
    },
  },
};
</script>

<style lang='scss' scoped>
.form-add {
  width: 600px;
}
.org-item {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.el-input {
  & + .el-input {
    margin-top: 10px;
  }
}
.add-btn {
  vertical-align: bottom;
}
.el-table {
  margin-top: 10px;
  img {
    width: 100%;
  }
}
</style>