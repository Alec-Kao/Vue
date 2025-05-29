<template>
    <div class="dialog">
        <el-dialog 
            v-model="dialog.show"
            :title="dialog.title"
            :close-on-click-modal = "false"
            :close-on-press-escape = "false"
            :append-to-body = "false"
        >
            <!-- <span>添加資金訊息</span> -->
            <div class="form">
              <el-form
                ref="form"
                :model="formData"
                :rules="form_rules"
                label-width="120px"
                style="margin: 10px; width: auto;"
              >
                <el-form-item label="收支項目:">
                  <el-select v-model="formData.type" placeholder="收支項目">
                    <el-option 
                      v-for="(formtype, index) in format_type_list" 
                      :key="index" 
                      :label="formtype"
                      :value="formtype">

                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop='describe' label="收支描述">
                    <el-input type="describe" v-model="formData.describe"></el-input>
                </el-form-item>

                <el-form-item prop='income'  label="收入:">
                  <el-input type="income" v-model="formData.income"></el-input>
                </el-form-item>

                <el-form-item prop='expend' label="支出:">
                  <el-input type="expend" v-model="formData.expend"></el-input>
                </el-form-item>

                <el-form-item prop='cash' label="帳戶現金:">
                  <el-input type="cash" v-model="formData.cash"></el-input>
                </el-form-item>

                <el-form-item label="備註:">
                  <el-input type="textarea" v-model="formData.remark"></el-input>
                </el-form-item>

                <el-form-item  class="text_right">
                  <el-button @click="dialog.show = false">取消</el-button>
                  <el-button type="primary" @click='onSubmit("form")'>提交</el-button>
                </el-form-item>
                
              </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dialog",
  data() {
    return {
      // 移動至FundList.vue
      // formData: {
      //   type: "",
      //   describe: "",
      //   income: "",
      //   expend: "",
      //   cash: "",
      //   remark: "",
      //   id: ""
      // },
      format_type_list: [
        "提領",
        "提領手續費",
        "儲值",
        "優惠券",
        "儲值禮券",
        "轉帳"
      ],
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能為空" }
        ],
        income: [
          { required: true, message: "收入不能為空!", trigger: "blur" }
        ],
        expend: [
          { required: true, message: "支出不能為空!", trigger: "blur" }
        ],
        cash: [{ required: true, message: "帳戶不能為空!", trigger: "blur" }]
      }
    }
  },
  props: {
    // modelValue: {
    //   type: Boolean,
    //   required: true,
    // },
    dialog: Object,
    formData: Object
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const url = this.dialog.option == "add" ? "add" : `edit/${this.formData.id}`;
          // console.log(this.formData);
          axios.post(`/api/profiles/${url}`, this.formData)
          .then(res => {
            // 新增成功
            this.$message({
              message: "新增數據成功",
              type: "success"
            })
          });
          // 隱藏 dialog
          // this.visible = false;
          this.dialog.show = false;
          this.$emit("update");
        }
      })
    }
  }
};
</script>

<style scoped>

</style>