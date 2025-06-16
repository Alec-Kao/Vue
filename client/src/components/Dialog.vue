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
                ref="formRef"
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

                <el-form-item prop='describe' label="收支說明">
                    <el-input type="text" v-model="formData.describe"></el-input>
                </el-form-item>

                <el-form-item prop='income' label="收入:">
                  <el-input type="number" v-model="formData.income"></el-input>
                </el-form-item>

                <el-form-item prop='expend' label="支出:">
                  <el-input type="number" v-model="formData.expend"></el-input>
                </el-form-item>

                <el-form-item prop='cash' label="帳戶餘額:">
                  <el-input type="number" v-model="formData.cash"></el-input>
                </el-form-item>

                <el-form-item label="備註:">
                  <el-input type="text" v-model="formData.remark"></el-input>
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

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'


// Props
const { dialog, formData } = defineProps({
  dialog: Object,
  formData: Object,
})

// Emits
const emit = defineEmits(['update'])

// 表單 Ref
const formRef = ref(null)

// 資料與驗證規則
const format_type_list = [
  '提領',
  '提領手續費',
  '儲值',
  '優惠券',
  '儲值禮券',
  '轉帳'
]

const form_rules = {
  describe: [
    { required: true, message: '收支描述不能為空' }
  ],
  income: [
    { required: true, message: '收入不能為空!', trigger: 'blur' }
  ],
  expend: [
    { required: true, message: '支出不能為空!', trigger: 'blur' }
  ],
  cash: [
    { required: true, message: '帳戶不能為空!', trigger: 'blur' }
  ]
}

// 提交函數
const onSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let url = ''
      if (dialog.option === 'add')
        url = 'add'
      else
        url = `edit/${formData.id}`
  
      axios.post(`/api/profiles/${url}`, formData)
        .then(() => {
          ElMessage.success('新增數據成功')
          dialog.show = false
          emit('update')
        })
    }
  })
}

watch(
  () => dialog.show,
  (newVal) => {
    if (newVal) {
      // 如果使用者沒有指定，預設選擇第一項
      if (!formData.type) {
        formData.type = format_type_list[0]
      }
    }
  }
)
</script>

<style scoped>

</style>