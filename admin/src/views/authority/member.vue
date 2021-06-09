<template>
  <div>
    <el-form :model="form" :inline="true">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-select v-model="form.power" :clearable="true">
          <el-option
            v-for="item in ROLE_LIST"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="addDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="power" label="角色权限" :formatter="formatter"> </el-table-column>
      <el-table-column
        prop="creditTime"
        :formatter="formatter"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column prop="address" label="操作" v-if="user.power == 0">
        <template v-if="scope.row.power != 0" slot-scope="scope">
          <el-button type="text" size="small" @click="editUser(scope.row)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="delUser(scope.row)"
            >删除</el-button
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

    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form ref="Form" :model="EditForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="EditForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="EditForm.phone"
            autocomplete="off"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-select v-model="EditForm.power">
            <el-option
              v-for="item in ROLE_LIST"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CONST from "./data";
import { dateFormat } from "@/utils";
import { findIndex } from "loadsh";
export default {
  name: "member",
  data() {
    return {
      form: {
        name: "",
        phone: "",
        power: "",
      },
      tableData: [],
      EditForm: {
        name: "",
        phone: "",
        power: 1,
      },
      dialogFormVisible: false,
      ROLE_LIST: CONST.ROLE_LIST,
      currentPage: 1,
      offset: 10,
      total: 0,
      pageSizeList: CONST.PAGE_SIZE_LIST,
      isEdit: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      let data = {
        ...this.form,
        page: this.currentPage,
        pageSize: this.offset,
      };
      let res = await this.$http.powerQuery(data);
      if (res?.data?.list) {
        const { list, total } = res.data;
        this.tableData = list;
        this.total = total;
      }
    },
    addDialog() {
      this.EditForm = {
        name: "",
        phone: "",
        power: 1,
      };
      this.dialogFormVisible = true;
      this.isEdit = false;
    },
    async addUser() {
      let { name } = this.user;
      let data = {
        ...this.EditForm,
        founder: name,
      };
      let res = this.isEdit
        ? this.$http.powerUpdate(data)
        : this.$http.powerAdd(data);
      res.then(() => {
        this.dialogFormVisible = false;
        this.getList();
      });
    },
    delUser(row) {
      this.$http.powerDel({ id: row.id }).then(() => {
        this.$message.success("删除成功！");
        this.getList();
      });
    },
    editUser(row) {
      this.dialogFormVisible = true;
      this.isEdit = true;
      this.EditForm = {
        id: row.id,
        name: row.name,
        phone: row.phone,
        power: row.power,
      };
    },
    initData() {
      this.form = {
        name: "",
        phone: "",
        power: "",
      };
      this.currentPage = 1;
      this.offset = 10;
    },
    formatter(row, col) {
      if (col.property == "creditTime") {
        return dateFormat("YYYY-mm-dd HH:MM", row.creditTime);
      } else {
        let index = findIndex(CONST.ROLE_LIST, ["value", row.power]);
        return row.power == 0 ? '超级管理员' : CONST.ROLE_LIST[index] && CONST.ROLE_LIST[index].name;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
