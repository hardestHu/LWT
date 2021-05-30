<template>
  <div>
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="名称">
        <el-input v-model="form.levelTwoModuleChinese"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.msgChinese"></el-input>
      </el-form-item>
      <el-form-item label="跳转方式">
        <el-select v-model="form.skipType" :clearable="true">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="linkToAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column
        prop="levelTwoModuleChinese"
        label="名称"
      ></el-table-column>
      <el-table-column prop="msgChinese" label="描述"> </el-table-column>
      <el-table-column prop="icon" label="图标"> </el-table-column>
      <el-table-column
        prop="skipType"
        :formatter="formatter"
        label="跳转方式"
      ></el-table-column>
      <el-table-column
        prop="creditTime"
        :formatter="formatter"
        label="创建时间"
      ></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleTable('del', scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleTable('edit', scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleTable('top', scope.row)"
            >置顶</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleTable('other', scope.row)"
            >{{ scope.row.status == 1 ? "隐藏" : "显示" }}</el-button
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
      @size-change="getList"
      @current-change="getList"
    >
    </el-pagination>
  </div>
</template>

<script>
import CONST from "./data";
import { dateFormat } from "@/utils";
import { findIndex } from "loadsh";
export default {
  data() {
    return {
      form: {
        levelTwoModuleChinese: "",
        msgChinese: "",
        skipType: "",
      },
      tableData: [{}],
      typeList: CONST.HREF_TYPE_LIST,
      currentPage: 1,
      offset: 10,
      total: 0,
      pageSizeList: CONST.PAGE_SIZE_LIST,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    linkToAdd() {
      const name = this.$route.name;
      const path = `/menu/${name}/add`;
      this.$router.push({ path: path });
    },
    async getList() {
      let data = {
        ...this.form,
        levelOneModuleChinese: this.$route.meta.title,
        page: this.currentPage,
        pageSize: this.offset,
      };
      let res = await this.$http.entryQuery(data);
      if (res?.data?.list) {
        this.tableData = res.data.list;
      }
    },
    async handleTable(type, row) {
      const _this = this;
      const data = {id: row.id}
      switch (type) {
        case "del":
          {
            _this.$http.entryDel(data).then(() => {
              this.$message.success("删除成功");
              this.getList();
            });
          }
          break;
        case "top":
          {
            this.$http.entryTop(data).then(() => {
              this.$message.success("置顶成功");
              this.getList();
            });
          }
          break;
        case "edit":
          {
            const name = this.$route.name;
            const path = `/menu/${name}/${row.id}`;
            _this.$router.push({ path: path });
          }
          break;

        default:
          {
            const status = row.status;
            status == 1
              ? await this.$http.entryHidden(data)
              : await this.$http.entryShow(data);
            this.getList();
          }

          break;
      }
    },
    formatter(row, col) {
      if (col.property == "creditTime") {
        return dateFormat("YYYY-mm-dd HH:MM", row.creditTime);
      } else {
        let index = findIndex(CONST.HREF_TYPE_LIST, ["value", row.skipType]);
        return CONST.HREF_TYPE_LIST[index] && CONST.HREF_TYPE_LIST[index].name;
      }
    },
  },
};
</script>

<style>
</style>
