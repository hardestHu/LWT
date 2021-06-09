<template>
  <div>
    <el-form :inline="true" size="small" :model="form">
      <el-form-item label="状态">
        <el-select
          v-model="form.status"
          :clearable="true"
          placeholder="请选择发布状态"
        >
          <el-option
            v-for="item in stateList"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input
          v-model="form.keyword"
          placeholder="查询标题名称等关键词"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="linkToAdd" v-if="user.power == '1' || user.power == '2'">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="info" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="70"> </el-table-column>
      <el-table-column prop="titleChinese" label="标题名称"> </el-table-column>
      <el-table-column prop="urlAddress" label="链接地址" width="180">
      </el-table-column>
      <el-table-column prop="thumbnail" label="缩略图" align="center">
        <template slot-scope="scope">
         <img :src="scope.row.thumbnail" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="readingVolume" label="阅读量">
      </el-table-column>
      <el-table-column prop="status" :formatter="formatter" label="发布状态">
      </el-table-column>
      <el-table-column
        prop="creditTime"
        :formatter="formatter"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column label="操作" width="180" v-if="user.power == '1' || user.power == '2' || user.power == '3'">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="user.power == '3'"
            @click="handleTable(scope.row, 'other')"
            >{{ scope.row.status == 0 ? "显示" : "隐藏" }}</el-button
          >
          <template v-if="user.power == '1' || user.power == '2'">
          <el-button
            type="text"
            size="small"
            @click="handleTable(scope.row, 'top')"
            >置顶</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleTable(scope.row, 'edit')"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleTable(scope.row, 'del')"
            >删除</el-button
          >
          </template>
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
      @size-change="getList"
      @current-change="getList"
    >
    </el-pagination>
  </div>
</template>

<script>
import CONST from "./data";
import { dateFormat } from "@/utils";
import {mapState} from 'vuex'
export default {
  data() {
    return {
      form: {
        status: "",
        keyword: "",
      },
      info: [],
      currentPage: 1,
      offset: 10,
      total: 0,
      pageSizeList: CONST.PAGE_SIZE_LIST,
      stateList: CONST.PUBLISH_STATE,
    };
  },
  computed: {
    ...mapState(["user"])
  },
  mounted() {
    this.getList();
  },
  methods: {
    linkToAdd() {
      const name = this.$route.name;
      const path = `/content/${name}/add`;
      this.$router.push({ path: path });
    },
    getList() {
      let data = {
        levelOneModuleChinese: this.$route.meta.title,
        ...this.form,
        page: this.currentPage,
        pageSize: this.offset,
      };
      this.$http.contentQuery(data).then((res) => {
        this.info = res.data.list;
      });
    },
    async handleTable(row, type) {
      const _this = this;
      const data = { id: row.id, founder: this.user.name };
      switch (type) {
        case "del":
          {
            _this.$http.contentDel(data).then(() => {
              this.$message.success("删除成功");
              this.getList();
            });
          }
          break;
        case "top":
          {
            this.$http.contentTop(data).then(() => {
              this.$message.success("置顶成功");
              this.getList();
            });
          }
          break;
        case "edit":
          {
            const name = this.$route.name;
            const path = `/content/${name}/${row.id}`;
            _this.$router.push({ path: path });
          }
          break;
        default:
          {
            const status = row.status;
            status == 1
              ? await this.$http.contentHidden(data)
              : await this.$http.contentShow(data);
            this.getList();
          }

          break;
      }
    },
    formatter(row, col) {
      if (col.property == "status") {
        return row.status == 1 ? "显示" : "隐藏";
      } else {
        return dateFormat("YYYY-mm-dd HH:MM", row.creditTime);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  td img{
    max-width: 100px;
  }
}
</style>
