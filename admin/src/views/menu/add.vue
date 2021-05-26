<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <div class="form-add">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="image">
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
        <el-form-item label="跳转方式">
          <el-select v-model="form.linkType" placeholder="请选择活动区域">
            <el-option
              v-for="item in linkType"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接" v-if="form.linkType == 1">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="App" v-if="form.linkType == 2">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="资讯列表" v-if="form.linkType == 3">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
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
      <template v-if="form.linkType == 4">
        <el-form-item label="须知">
          <TinymceEditor
            @input="debounce"
            :value="form.newsText"
          ></TinymceEditor>
        </el-form-item>
        <el-form-item label="机构列表">
          <el-form :inline="true" :model="formInline">
            <div v-for="(item, index) in formInline.list" class="org-item" :key="item.id">
              <el-form-item label="机构名称">
                <el-input v-model="item.name"></el-input>
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="机构地址">
                <el-input v-model="item.address"></el-input>
                <el-input v-model="item.address"></el-input>
              </el-form-item>
              <el-form-item>
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
    </el-form>
  </div>
</template>

<script>
import { _debounce } from "@/utils";
import CONST from "./data";
import TinymceEditor from "@/components/tEditor";
export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      form: {
        linkType: 1,
      },
      formInline: {
          list: [{
              name: '',
              addres: ''
          }]
      },

      linkType: CONST.HREF_TYPE_LIST,
      tableData: [],
      currentPage: 1,
      offset: 10,
      total: 0,
      pageSizeList: CONST.PAGE_SIZE_LIST,
      debounce: _debounce(this.editorInput, 300),
    };
  },
  methods: {
      addOrgList() {
          this.formInline.list.push({
              name: '',
              value: '',
          })
      },
      removeOrgList(index) {
          this.formInline.list.splice(index, 1)
      }
  }
};
</script>

<style lang='scss' scoped>
.form-add {
  width: 600px;
}
.org-item {
    margin-bottom: 10px;
}
</style>