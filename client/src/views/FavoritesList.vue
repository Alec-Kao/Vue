<template>
    <div class="fillContainer">
        <div>         
            <el-form :inline="true" res="add_data" label-width="auto" label-position="left" :model="search_data">
                <!-- 收藏清單標題 -->
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item class="selectText">
                      <h2 style="color: #667eea; margin: 0; font-size: 24px; font-weight: 600;">
                        <el-icon style="margin-right: 8px;"><StarFilled /></el-icon>
                        我的收藏清單
                      </h2>
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <!-- 收藏清單選擇器 -->
                <el-row style="flex-wrap: wrap; align-items: center;">
                  <el-col>
                    <el-form-item label="選擇收藏清單:">
                      <el-select
                        v-model="selectedPlaylistId"
                        placeholder="請選擇收藏清單"
                        style="width: 250px; margin-right: 15px;"
                        @change="handlePlaylistChange"
                      >
                        <el-option
                          v-for="playlist in playlists"
                          :key="playlist._id"
                          :label="`${playlist.name} (${playlist.songs.length} 首歌)`"
                          :value="playlist._id"
                        >
                          <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>{{ playlist.name }}</span>
                            <el-tag size="small" type="info">{{ playlist.songs.length }}</el-tag>
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item>
                      <el-button type="success" @click="showCreatePlaylistDialog = true">
                        <el-icon><Plus /></el-icon>
                        新增收藏清單
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                

            </el-form>
        </div>
        
        <!-- 收藏清單信息 -->
        <div v-if="currentPlaylist" class="playlist-info">
          <el-card shadow="never">
            <div>
              <h3 style="margin: 0; color: #667eea;">{{ currentPlaylist.name }}</h3>
              <p style="margin: 5px 0 15px 0; color: #999;">
                {{ currentPlaylist.description || '暫無描述' }} · 
                {{ currentPlaylist.songs.length }} 首歌 · 
                創建於 {{ formatDate(currentPlaylist.date) }}
              </p>
              <div class="playlist-actions">
                <el-button type="warning" @click="showEditDialog">
                  <el-icon><Edit /></el-icon>
                  編輯
                </el-button>
                <el-button type="danger" @click="handleDeletePlaylist">
                  <el-icon><Delete /></el-icon>
                  刪除清單
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
        
        <!-- 歌曲列表 -->
        <div class="table_container" v-if="selectedPlaylistId">
            <el-table 
                :data="tableData"
                :fit="true" 
                max-height="450" 
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: auto"
            >
                <!-- 自訂空狀態 -->
                <template #empty>
                  <div style="text-align: center; color: #999; font-size: 16px; padding: 40px;">
                    <el-icon style="font-size: 48px; margin-bottom: 16px;"><Star /></el-icon>
                    <div>此收藏清單還沒有歌曲</div>
                    <div style="margin-top: 8px; color: #ccc;">去動漫歌曲列表中添加一些歌曲吧！</div>
                  </div>
                </template>

                <el-table-column 
                    type="index" 
                    label="序號"
                    align='center'
                    min-width="70"
                >
                    <template #default="scope">
                      {{ (paginations.page_index - 1) * paginations.page_size + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="date" 
                    label="建立時間"
                    align='center'
                    min-width="200">
                    <template #default="scope">
                        <div style="display: flex; justify-content: center;">
                            <el-icon><Timer /></el-icon>
                            <span style="margin-left: 10px">{{ scope.row.date }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="describe"
                    label="動漫歌曲名稱"
                    align='center'
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="workName"
                    label="對應動漫作品"
                    align='center'
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="類型"
                    align='center'
                    min-width="120">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="動漫歌曲類型"
                    align='center'
                    min-width="100">
                </el-table-column>
                <el-table-column
                    prop="rating"
                    label="評分"
                    align='center'
                    min-width="80"> 
                    <template #default="scope">
                        <span>{{ scope.row.rating }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="singerOrGroup"
                    label="歌手或者表演團體"
                    align='center'
                    min-width="180">
                </el-table-column>
                <el-table-column
                    label="音樂網址"
                    align='center'
                    min-width="100">
                    <template #default="scope">
                        <a :href="scope.row.songUrl" target="_blank" style="color: #667eea; text-decoration: none;">
                          <el-icon><Link /></el-icon>
                          Listen
                        </a>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="Operations"
                    label="操作"
                    align="center"
                    min-width="120"
                >
                    <template #default="scope">
                        <el-button
                            size="default"
                            type="danger"
                            @click="removeFromPlaylist(scope.row)"
                        >
                            <el-icon><StarFilled /></el-icon>
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分頁 -->
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            v-model:current-page="paginations.page_index"
                            v-model:page-size="paginations.page_size"
                            :page-sizes="paginations.page_sizes"
                            :disabled="disabled"
                            :background="background"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
                </el-col>
            </el-row>
        </div>
        
        <!-- 無收藏清單提示 -->
        <div v-else-if="!loading && playlists.length === 0" class="no-playlists">
          <el-empty description="您還沒有創建任何收藏清單">
            <el-button type="primary" @click="showCreatePlaylistDialog = true">
              <el-icon><Plus /></el-icon>
              創建第一個收藏清單
            </el-button>
          </el-empty>
        </div>
    </div>
    
    <!-- 創建收藏清單對話框 -->
    <el-dialog v-model="showCreatePlaylistDialog" title="創建收藏清單" width="400px">
      <el-form :model="newPlaylistForm" :rules="rules" ref="playlistFormRef" label-width="80px">
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
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreatePlaylistDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreatePlaylist" :loading="creating">
            {{ creating ? '創建中...' : '創建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 編輯收藏清單對話框 -->
    <el-dialog v-model="showEditPlaylistDialog" title="編輯收藏清單" width="400px">
      <el-form :model="editPlaylistForm" :rules="rules" ref="editPlaylistFormRef" label-width="80px">
        <el-form-item label="名稱" prop="name">
          <el-input
            v-model="editPlaylistForm.name"
            placeholder="請輸入收藏清單名稱"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="editPlaylistForm.description"
            type="textarea"
            placeholder="請輸入收藏清單描述（選填）"
            maxlength="200"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showEditPlaylistDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditPlaylist" :loading="creating">
            {{ creating ? '保存中...' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Timer, Star, StarFilled, Link, Plus, Delete, Edit } from '@element-plus/icons-vue';

const store = useStore();
const user = computed(() => store.getters.user);

const loading = ref(false);
const creating = ref(false);
const playlists = ref([]);
const selectedPlaylistId = ref('');
const currentPlaylist = ref(null);
const showCreatePlaylistDialog = ref(false);
const showEditPlaylistDialog = ref(false);
const playlistFormRef = ref(null);
const editPlaylistFormRef = ref(null);

const newPlaylistForm = reactive({
  name: '',
  description: ''
});

const editPlaylistForm = reactive({
  name: '',
  description: ''
});

const rules = {
  name: [
    { required: true, message: '請輸入收藏清單名稱', trigger: 'blur' },
    { min: 1, max: 50, message: '長度在 1 到 50 個字符', trigger: 'blur' }
  ]
};

const tableData = ref([]);
const allTableData = ref([]);

const paginations = reactive({
  page_index: 1,
  total: 0,
  page_size: 10,
  page_sizes: [5, 10, 15, 20],
  layout: "total, sizes, prev, pager, next, jumper",
});

const disabled = ref(false);
const background = ref(true);

onMounted(() => {
  loadPlaylists();
  
  // 確保在組件掛載時正確初始化
  setTimeout(() => {
    if (selectedPlaylistId.value && !currentPlaylist.value) {
      loadPlaylistSongs(selectedPlaylistId.value);
    }
  }, 100);
});

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-TW')
};

// 載入收藏清單
const loadPlaylists = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/users/playlists');
    if (response.data.success) {
      // 按創建時間排序，最先創建的在最上面
      playlists.value = response.data.playlists.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // 如果有收藏清單且沒有選擇，自動選擇第一個
      if (playlists.value.length > 0 && !selectedPlaylistId.value) {
        selectedPlaylistId.value = playlists.value[0]._id;
        await loadPlaylistSongs(selectedPlaylistId.value);
      }
      // 如果當前選擇的收藏清單還存在，重新載入它的歌曲
      else if (selectedPlaylistId.value) {
        const currentPlaylistExists = playlists.value.find(p => p._id === selectedPlaylistId.value);
        if (currentPlaylistExists) {
          await loadPlaylistSongs(selectedPlaylistId.value);
        } else {
          // 如果當前選擇的收藏清單不存在了，選擇第一個
          if (playlists.value.length > 0) {
            selectedPlaylistId.value = playlists.value[0]._id;
            await loadPlaylistSongs(selectedPlaylistId.value);
          } else {
            selectedPlaylistId.value = '';
            currentPlaylist.value = null;
            allTableData.value = [];
            tableData.value = [];
          }
        }
      }
    }
  } catch (error) {
    console.error('載入收藏清單失敗:', error);
    ElMessage.error('載入收藏清單失敗');
  } finally {
    loading.value = false;
  }
};

// 載入收藏清單中的歌曲
const loadPlaylistSongs = async (playlistId) => {
  try {
    const response = await axios.get(`/api/users/playlists/${playlistId}/songs`);
    if (response.data.success) {
      currentPlaylist.value = response.data.playlist;
      allTableData.value = response.data.songs;
      setPaginations();
    }
  } catch (error) {
    console.error('載入收藏清單歌曲失敗:', error);
    ElMessage.error('載入收藏清單歌曲失敗');
  }
};

// 處理收藏清單變化
const handlePlaylistChange = async (playlistId) => {
  if (playlistId) {
    await loadPlaylistSongs(playlistId);
  } else {
    // 如果清空選擇
    currentPlaylist.value = null;
    allTableData.value = [];
    tableData.value = [];
  }
};

// 顯示編輯對話框
const showEditDialog = () => {
  if (currentPlaylist.value) {
    editPlaylistForm.name = currentPlaylist.value.name;
    editPlaylistForm.description = currentPlaylist.value.description || '';
    showEditPlaylistDialog.value = true;
  }
};



// 編輯收藏清單
const handleEditPlaylist = async () => {
  if (!editPlaylistFormRef.value) return;
  
  try {
    const valid = await editPlaylistFormRef.value.validate();
    if (!valid) return;
    
    creating.value = true;
    
    const response = await axios.put(`/api/users/playlists/${selectedPlaylistId.value}`, {
      name: editPlaylistForm.name,
      description: editPlaylistForm.description
    });
    
    if (response.data.success) {
      ElMessage.success('收藏清單編輯成功');
      showEditPlaylistDialog.value = false;
      editPlaylistForm.name = '';
      editPlaylistForm.description = '';
      
      // 重新載入收藏清單
      await loadPlaylists();
      await loadPlaylistSongs(selectedPlaylistId.value);
    }
  } catch (error) {
    console.error('編輯收藏清單失敗:', error);
    ElMessage.error(error.response?.data?.message || '編輯收藏清單失敗');
  } finally {
    creating.value = false;
  }
};

// 創建收藏清單
const handleCreatePlaylist = async () => {
  if (!playlistFormRef.value) return;
  
  try {
    const valid = await playlistFormRef.value.validate();
    if (!valid) return;
    
    creating.value = true;
    const response = await axios.post('/api/users/playlists', {
      name: newPlaylistForm.name,
      description: newPlaylistForm.description
    });
    
    if (response.data.success) {
      ElMessage.success('收藏清單創建成功');
      showCreatePlaylistDialog.value = false;
      newPlaylistForm.name = '';
      newPlaylistForm.description = '';
      
      // 選擇新創建的收藏清單
      selectedPlaylistId.value = response.data.playlist._id;
      
      // 重新載入收藏清單
      await loadPlaylists();
    }
  } catch (error) {
    console.error('創建收藏清單失敗:', error);
    ElMessage.error(error.response?.data?.message || '創建收藏清單失敗');
  } finally {
    creating.value = false;
  }
};

// 刪除收藏清單
const handleDeletePlaylist = async () => {
  if (!selectedPlaylistId.value) return;
  
  try {
    await ElMessageBox.confirm(
      `確定要刪除收藏清單「${currentPlaylist.value.name}」嗎？此操作不可恢復！`,
      '確認刪除',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    const response = await axios.delete(`/api/users/playlists/${selectedPlaylistId.value}`);
    
    if (response.data.success) {
      ElMessage.success('收藏清單已刪除');
      selectedPlaylistId.value = '';
      currentPlaylist.value = null;
      allTableData.value = [];
      tableData.value = [];
      await loadPlaylists();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('刪除收藏清單失敗:', error);
      ElMessage.error(error.response?.data?.message || '刪除收藏清單失敗');
    }
  }
};

// 從收藏清單中移除歌曲
const removeFromPlaylist = async (song) => {
  if (!selectedPlaylistId.value) return;
  
  try {
    await ElMessageBox.confirm(
      `確定要從收藏清單中移除「${song.describe}」嗎？`,
      '確認移除',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    const response = await axios.post(`/api/users/playlists/${selectedPlaylistId.value}/songs/${song._id}`);
    
    if (response.data.success) {
      ElMessage.success('已從收藏清單中移除');
      await loadPlaylistSongs(selectedPlaylistId.value);
      await loadPlaylists(); // 更新收藏清單計數
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除歌曲失敗:', error);
      ElMessage.error(error.response?.data?.message || '移除歌曲失敗');
    }
  }
};

// 設置分頁
const setPaginations = () => {
  paginations.total = allTableData.value.length;
  paginations.page_index = 1;
  tableData.value = allTableData.value.slice(0, paginations.page_size);
};

// 處理每頁大小變化
const handleSizeChange = (page_size) => {
  paginations.page_index = 1;
  paginations.page_size = page_size;
  tableData.value = allTableData.value.slice(0, page_size);
};

// 處理當前頁變化
const handleCurrentChange = (page) => {
  const start = paginations.page_size * (page - 1);
  const end = paginations.page_size * page;
  tableData.value = allTableData.value.slice(start, end);
};

</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.fillContainer {
    width: 100%;
    height: 100%;
    padding: $spacing-lg;
    box-sizing: border-box;
    background: linear-gradient(135deg, $background-base 0%, #c3cfe2 100%);
    min-height: 100vh;
}

.playlist-info {
    margin-bottom: $spacing-lg;
}

.table_container {
    @include card($spacing-lg, 12px);
    margin-top: $spacing-lg;
    overflow-x: auto;
}

.no-playlists {
    margin-top: $spacing-xl + 18px;
    text-align: center;
}

.selectBtn {
    float: left;
    margin-left: $spacing-sm + 2px;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-lg;
}

.dialog-footer {
    @include flex-between;
    justify-content: flex-end;
    gap: $spacing-sm + 2px;
}

/* Element Plus 樣式已移至全域樣式文件 _element-plus-theme.scss */

/* 標題樣式 */
.selectText h2 {
    display: flex;
    align-items: center;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 卡片樣式 */
::v-deep(.el-card) {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

::v-deep(.el-card__body) {
    padding: 20px;
}

/* 對話框美化 */
::v-deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

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

/* Element Plus 組件樣式已移至全域樣式文件 */

/* 操作按鈕樣式 */
::v-deep(.el-form-item .el-button) {
    margin-right: 10px;
}

::v-deep(.el-form-item .el-button:last-child) {
    margin-right: 0;
}

/* 警告按鈕樣式已移至全域主題文件 _element-plus-theme.scss */

/* 鏈接美化 */
::v-deep(a) {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

/* 警告按鈕樣式已移至全域主題文件 _element-plus-theme.scss */

/* 收藏清單信息區域調整 */
.playlist-info ::v-deep(.el-card__body) {
    padding: 20px;
}

.playlist-info h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
}

.playlist-info p {
    font-size: 14px;
    line-height: 1.4;
}

/* 收藏清單操作按鈕 */
.playlist-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.playlist-actions .el-button {
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
}
</style> 