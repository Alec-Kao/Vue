<template>
  <div>
    <el-dialog
      v-model="localVisible"
      :title="isEditMode ? '編輯收藏清單' : '添加到收藏清單'"
      width="500px"
      @close="handleClose"
    >
      <div v-if="loading" style="text-align: center; padding: 20px;">
        <el-icon class="is-loading" style="font-size: 24px;"><Loading /></el-icon>
        <p>載入中...</p>
      </div>
      
      <div v-else>
        <!-- 選擇現有收藏清單 -->
        <div v-if="playlists.length > 0" style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px; color: #667eea;">
            {{ isEditMode ? '編輯收藏清單：' : '選擇現有收藏清單：' }}
          </h4>
          <div style="width: 100%;">
            <div v-for="playlist in playlists" :key="playlist._id" style="margin-bottom: 8px;">
              <el-checkbox 
                :model-value="selectedPlaylistIds.includes(playlist._id)"
                @change="handlePlaylistSelection(playlist._id, $event)"
                style="width: 100%;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <div>
                    <strong>{{ playlist.name }}</strong>
                    <span style="color: #999; margin-left: 8px;">({{ playlist.songs.length }} 首歌)</span>
                  </div>
                  <el-tag size="small" type="info">{{ formatDate(playlist.date) }}</el-tag>
                </div>
              </el-checkbox>
            </div>
          </div>
        </div>
        
        <!-- 分隔線 -->
        <el-divider v-if="playlists.length > 0">或者</el-divider>
        
        <!-- 創建新收藏清單 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #667eea;">創建新收藏清單：</h4>
          <el-form :model="newPlaylistForm" :rules="rules" ref="formRef" label-width="80px">
            <el-form-item label="名稱" prop="name">
              <el-input
                v-model="newPlaylistForm.name"
                placeholder="請輸入收藏清單名稱"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="newPlaylistForm.description"
                type="textarea"
                placeholder="請輸入收藏清單描述（選填）"
                maxlength="200"
                show-word-limit
                :rows="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
                     <el-button 
             type="primary" 
             @click="handleConfirm"
             :loading="submitting"
             :disabled="!canSubmit"
           >
             {{ submitting ? (isEditMode ? '更新中...' : '添加中...') : (isEditMode ? '確定更新' : '確定添加') }}
           </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import axios from 'axios'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  song: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'added'])

const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const loading = ref(false)
const submitting = ref(false)
const playlists = ref([])
const selectedPlaylistIds = ref([])
const formRef = ref(null)

const newPlaylistForm = reactive({
  name: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '請輸入收藏清單名稱', trigger: 'blur' },
    { min: 1, max: 50, message: '長度在 1 到 50 個字符', trigger: 'blur' }
  ]
}

const canSubmit = computed(() => {
  // 如果是編輯模式，即使沒有選擇任何收藏清單也可以提交（等於移除）
  if (isEditMode.value) {
    return true
  }
  // 如果不是編輯模式，需要至少選擇一個收藏清單或創建新的收藏清單
  return selectedPlaylistIds.value.length > 0 || newPlaylistForm.name.trim()
})

// 檢查是否為編輯模式（歌曲已被收藏）
const isEditMode = computed(() => {
  if (!props.song._id || !playlists.value.length) {
    return false
  }
  
  return playlists.value.some(playlist => 
    playlist.songs.some(song => 
      typeof song === 'string' ? song === props.song._id : song._id === props.song._id
    )
  )
})

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-TW')
}

// 處理收藏清單選擇
const handlePlaylistSelection = (playlistId, checked) => {
  if (checked) {
    if (!selectedPlaylistIds.value.includes(playlistId)) {
      selectedPlaylistIds.value.push(playlistId)
    }
  } else {
    const index = selectedPlaylistIds.value.indexOf(playlistId)
    if (index > -1) {
      selectedPlaylistIds.value.splice(index, 1)
    }
  }
}

// 載入收藏清單
const loadPlaylists = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/users/playlists')
    if (response.data.success) {
      // 按創建時間排序，最先創建的在最上面
      playlists.value = response.data.playlists.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      // 如果是編輯模式，設置當前歌曲已收藏的清單
      if (props.song._id) {
        selectedPlaylistIds.value = playlists.value
          .filter(playlist => 
            playlist.songs.some(song => 
              typeof song === 'string' ? song === props.song._id : song._id === props.song._id
            )
          )
          .map(playlist => playlist._id)
      }
    }
  } catch (error) {
    console.error('載入收藏清單失敗:', error)
    ElMessage.error('載入收藏清單失敗')
  } finally {
    loading.value = false
  }
}

// 創建新收藏清單
const createPlaylist = async () => {
  try {
    const response = await axios.post('/api/users/playlists', {
      name: newPlaylistForm.name,
      description: newPlaylistForm.description
    })
    
    if (response.data.success) {
      return response.data.playlist
    } else {
      throw new Error(response.data.message || '創建失敗')
    }
  } catch (error) {
    console.error('創建收藏清單失敗:', error)
    ElMessage.error(error.response?.data?.message || '創建收藏清單失敗')
    throw error
  }
}

// 添加歌曲到收藏清單
const addSongToPlaylist = async (playlistId) => {
  try {
    const response = await axios.post(`/api/users/playlists/${playlistId}/songs/${props.song._id}`)
    
    if (response.data.success) {
      ElMessage.success(response.data.message)
      return true
    } else {
      throw new Error(response.data.message || '添加失敗')
    }
  } catch (error) {
    console.error('添加歌曲失敗:', error)
    ElMessage.error(error.response?.data?.message || '添加歌曲失敗')
    return false
  }
}

// 確認添加/編輯
const handleConfirm = async () => {
  if (!canSubmit.value) return
  
  submitting.value = true
  
  try {
    // 處理創建新收藏清單的情況
    if (newPlaylistForm.name.trim()) {
      if (formRef.value) {
        const valid = await formRef.value.validate()
        if (!valid) {
          submitting.value = false
          return
        }
      }
      
      const newPlaylist = await createPlaylist()
      selectedPlaylistIds.value.push(newPlaylist._id)
    }
    
    // 獲取原本歌曲在哪些收藏清單中
    const originalPlaylistIds = playlists.value
      .filter(playlist => 
        playlist.songs.some(song => 
          typeof song === 'string' ? song === props.song._id : song._id === props.song._id
        )
      )
      .map(playlist => playlist._id)
    
    // 計算需要添加和移除的收藏清單
    const toAdd = selectedPlaylistIds.value.filter(id => !originalPlaylistIds.includes(id))
    const toRemove = originalPlaylistIds.filter(id => !selectedPlaylistIds.value.includes(id))
    
    // 添加到新的收藏清單
    for (const playlistId of toAdd) {
      await addSongToPlaylist(playlistId)
    }
    
    // 從取消選中的收藏清單中移除
    for (const playlistId of toRemove) {
      await addSongToPlaylist(playlistId) // 這個API會自動切換添加/移除
    }
    
    if (toAdd.length > 0 || toRemove.length > 0) {
      ElMessage.success('收藏清單已更新')
      emit('added')
      handleClose()
    } else {
      ElMessage.info('沒有變更')
      handleClose()
    }
  } catch (error) {
    // 錯誤已在各自的函數中處理
  } finally {
    submitting.value = false
  }
}

// 關閉對話框
const handleClose = () => {
  localVisible.value = false
  selectedPlaylistIds.value = []
  newPlaylistForm.name = ''
  newPlaylistForm.description = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 監聽對話框打開
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      loadPlaylists()
    }
  }
)

onMounted(() => {
  if (props.visible) {
    loadPlaylists()
  }
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

::v-deep(.el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
  width: 100%;
}

::v-deep(.el-checkbox__label) {
  width: 100%;
  padding-left: 10px;
}

::v-deep(.el-checkbox__input) {
  margin-right: 10px;
}

::v-deep(.el-dialog__body) {
  padding: 20px;
}

h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.el-divider {
  margin: 20px 0;
}

.el-tag {
  font-size: 12px;
}

// 對話框關閉按鈕樣式優化
::v-deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
}

::v-deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

::v-deep(.el-dialog__headerbtn) {
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.6);
    transform: scale(1.1);
  }
}

::v-deep(.el-dialog__close) {
  color: white !important;
  font-size: 18px !important;
  font-weight: bold;
  
  &:hover {
    color: #ff6b6b !important;
  }
}

::v-deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style> 