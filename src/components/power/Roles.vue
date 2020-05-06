<template>
  <div>
    <Bread :paths="dataPaths"></Bread>

    <el-card shadow="hover">
      <el-button type="primary" @click="showDialog('01')">添加角色</el-button>

      <el-table :data="rolesLst" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeRightsByRoleId(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsByRoleId(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsByRoleId(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog('02', scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增|修改窗口 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="40%"
        @close="dialogClosed"
      >
        <el-form
          :model="formData"
          ref="formDataRef"
          label-width="80px"
          :rules="formDataRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="formData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close="setRightsDialogClosed"
      >
        <el-tree
          :data="rightsLst"
          default-expand-all
          show-checkbox
          node-key="id"
          :props="treeProps"
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureSetRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "权限管理" }, { pathName: "角色列表" }],
      rolesLst: [],
      dialogTitle: "",
      dialogVisible: false,
      setRightsDialogVisible: false,
      formData: {
        roleName: "",
        roleDesc: ""
      },
      formDataRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 所有权限
      rightsLst: [],
      // 树状列表的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //角色拥有的权限数组
      defKeys: [],
      //记录选中的角色Id
      roleId: ""
    };
  },
  mounted() {
    this.getRolesLst();
  },
  methods: {
    async getRolesLst() {
      const { data: res } = await this.$axios.get("roles");
      console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesLst = res.data;
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$axios.delete(`roles/` + id);
      if (res.meta.status !== 200) return this.$message.error("删除角色失败");
      this.$message.success("删除角色成功");
      this.getRolesLst();
    },
    dialogClosed() {
      this.$refs.formDataRef.resetFields();
    },
    // '01'为添加角色，'02'为修改角色
    async showDialog(index, id) {
      this.dialogTitle = index === "01" ? "添加角色" : "修改角色";
      if (index === "02") {
        const { data: res } = await this.$axios.get("roles/" + id);
        if (res.meta.status !== 200)
          return this.$message.error("获取该角色信息失败！");
        this.formData = res.data;
      } else {
        this.formData = {};
      }
      this.dialogVisible = true;
      console.log(this.formData);
    },
    // 确定新增或修改
    sureRole() {
      this.$refs.formDataRef.validate(async valid => {
        if (!valid) return;
        if (this.dialogTitle === "添加角色") {
          const { data: res } = await this.$axios.post("roles", this.formData);
          if (res.meta.status !== 201)
            return this.$message.error("添加角色失败");
        } else {
          console.log(this.formData);

          const { data: res } = await this.$axios.put(
            "roles/" + this.formData.roleId,
            {
              roleName: this.formData.roleName,
              roleDesc: this.formData.roleDesc
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("更新用户信息失败！");
          }
        }
        this.$message.success("操作成功");
        this.dialogVisible = false;
        this.getRolesLst();
      });
    },
    // 按角色id删除权限
    async removeRightsByRoleId(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该条权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除!");
      }

      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      role.children = res.data;
    },
    //以树状列表形式获取到所有层级的权限以及被点击的条目已有的权限数组
    async showSetRightsDialog(role) {
      console.log(role);
      this.roleId = role.id;
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      this.rightsLst = res.data;

      this.getDefKeys(role, this.defKeys);
      this.setRightsDialogVisible = true;
    },
    //递归获得该角色拥有的三级权限存至defKeys数组
    getDefKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getDefKeys(item, arr));
    },
    //监听分配窗口关闭
    setRightsDialogClosed() {
      this.defKeys = [];
    },
    //确认设置权限
    async sureSetRights() {
      const checkedKeys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ].join(",");
      console.log(checkedKeys);
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: checkedKeys
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功!");
      this.getRolesLst();
      this.setRightsDialogVisible = false;
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
