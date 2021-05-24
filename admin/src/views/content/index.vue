<template>
  <div>
    <el-form :inline="true" size="small" :model="form">
      <el-form-item label="状态">
        <el-select
          v-model="form.publishStatus"
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
          v-model="form.param"
          placeholder="查询标题名称等关键词"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button @click="linkToAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="info" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="70"> </el-table-column>
      <el-table-column prop="newsTitle" label="标题名称"> </el-table-column>
      <el-table-column prop="newsLink" label="链接地址" width="180">
      </el-table-column>
      <el-table-column prop="image" label="缩略图">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="previewImage(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="newsStatus"
        :formatter="formatter"
        label="发布状态"
      >
      </el-table-column>
      <el-table-column
        prop="publishTime"
        :formatter="formatter"
        label="发布时间"
      >
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small">{{
            scope.row.newsStatus == 0 ? "显示" : "隐藏"
          }}</el-button>
          <el-button type="text" size="small">置顶</el-button>
          <el-button type="text" size="small">修改</el-button>
          <el-button type="text" size="small">删除</el-button>
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
  </div>
</template>

<script>
import CONST from "./data";
export default {
  data() {
    return {
      form: {},
      info: [{}],
      currentPage: 1,
      offset: 10,
      total: 0,
      pageSizeList: CONST.PAGE_SIZE_LIST,
      stateList: CONST.PUBLISH_STATE,
    };
  },
  methods: {
    linkToAdd() {
      const name = this.$route.name
      const path = `/content/${name}/add`
      this.$router.push({path: path})
    },
    formatter() {
      
    }
  }
};
</script>

<style>
</style>
