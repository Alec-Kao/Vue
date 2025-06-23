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
                label-width="150px"
                style="margin: 10px; width: auto;"
              >
                <el-form-item prop='describe' label="動漫歌曲名稱:">
                    <el-input type="text" v-model="formData.describe"></el-input>
                </el-form-item>

                <el-form-item prop='workName' label="對應動漫作品:">
                  <el-input type="text" v-model="formData.workName"></el-input>
                </el-form-item>

                <el-form-item prop='type' label="動漫歌曲類型:">
                  <el-select v-model="formData.type" placeholder="請選擇動漫歌曲類型">
                    <el-option 
                      v-for="(formtype, index) in format_type_list" 
                      :key="index" 
                      :label="formtype"
                      :value="formtype">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop='category' label="類型:">
                  <el-select v-model="formData.category" placeholder="請選擇類型">
                    <el-option label="動畫" value="動畫"></el-option>
                    <el-option label="遊戲" value="遊戲"></el-option>
                    <el-option label="其他" value="其他"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop='rating' label="評分:">
                  <el-input type="number" v-model="formData.rating"></el-input>
                </el-form-item>

                <el-form-item label="歌手或者表演團體:">
                  <el-input type="text" v-model="formData.singerOrGroup"></el-input>
                </el-form-item>

                <el-form-item prop='songUrl' label="音樂網址:">
                  <el-input type="text" v-model="formData.songUrl"></el-input>
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

// 驗證函式
const validateRating = (rule, value, callback) => {
  if (value !== '' && value !== null && Number(value) > 10) {
    callback(new Error('評分滿分為10分'));
  } else if (value !== '' && value !== null && Number(value) < 0) {
    callback(new Error('評分不能為負數'));
  } else {
    callback();
  }
};

// 資料與驗證規則
const format_type_list = [
  'J-POP',
  '搖滾',
  '抒情',
  '古典',
  '電子'
]

const form_rules = {
  describe: [
    { required: true, message: '動漫歌曲名稱不能為空' }
  ],
  rating: [
    { required: true, message: '評分不能為空!', trigger: 'blur' },
    { validator: validateRating, trigger: 'blur' }
  ],
  workName: [
    { required: true, message: '對應動漫作品不能為空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '動漫歌曲類型不能為空', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '類型不能為空', trigger: 'blur' }
  ],
  songUrl: [
    { required: true, message: '音樂網址不能為空', trigger: 'blur' }
  ]
}

// 提交函數
const onSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const isEdit = dialog.option === 'edit';
      const url = isEdit ? `edit/${formData.id}` : 'add';
  
      axios.post(`/api/animesongs/${url}`, formData)
        .then(() => {
          ElMessage.success(isEdit ? '數據更新成功' : '新增數據成功');
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
      if (!formData.type) {
        formData.type = format_type_list[0]
      }
      if (dialog.option === 'add' && !formData.category) {
        formData.category = '動畫';
      }
    }
  }
)
</script>

<style scoped>

</style>