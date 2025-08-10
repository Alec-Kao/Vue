<template>
    <div class="fillContainer">
        <div>         
            <el-form :inline="true" res="add_data"  label-width="auto"  label-position="left" :model="search_data">
                <!-- 篩選 -->
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item class="selectText" label="查詢方法，可為空:"></el-form-item>
                  </el-col>
                </el-row>
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item label="時間:" class="selectTime">
                      <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="開始時間"
                        :default-time="defaultTime"
                      />
                      --
                      <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="結束時間"
                        :default-time="defaultTime"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item label="動漫歌曲名稱:">
                      <el-input v-model="search_data.describe" placeholder="請輸入動漫歌曲名稱" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item label="對應動漫作品:">
                      <el-input v-model="search_data.workName" placeholder="請輸入對應動漫作品" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <!-- <el-form-item label="類型:">
                      <el-input v-model="search_data.category" placeholder="請輸入類型" clearable />
                    </el-form-item> -->
                    <el-form-item label="類型:" class="selectItem">
                      <el-select v-model="search_data.category" 
                        placeholder="請選擇類型" 
                        clearable
                        style="width: 170px"
                      >
                        <el-option label="動畫" :value="'動畫'" />
                        <el-option label="遊戲" :value="'遊戲'" />
                        <el-option label="電影" :value="'電影'" />
                        <el-option label="其它" :value="'其它'" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item label="評分:">
                      <el-input v-model="search_data.rating" placeholder="請輸入評分" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item label="動漫歌曲類型:" class="selectItem">
                      <el-select v-model="search_data.type" 
                        placeholder="請選擇動漫歌曲類型" 
                        clearable
                        style="width: 170px"
                      >
                        <el-option label="全部" :value="'全部'" />
                        <el-option label="J-POP" :value="'J-POP'" />
                        <el-option label="搖滾" :value="'搖滾'" />
                        <el-option label="抒情" :value="'抒情'" />
                        <el-option label="古典" :value="'古典'" />
                        <el-option label="電子" :value="'電子'" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item class="selectBtn">
                      <el-button type="primary" @click="handleSearch()">篩選</el-button>
                      <el-button type="primary" @click="handleReset()">顯示全部</el-button>
                    </el-form-item>

                    <el-form-item class="btnAdd">
                      <el-button
                        v-if="user.identity === 'manager'"
                        type="primary" 
                        @click="handleAdd()"
                      >
                        新增
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table_container">
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
                  <div style="text-align: center; color: #999; font-size: 16px;">
                    目前無資料
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
                            <el-icon><timer /></el-icon>
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
                        <a :href="scope.row.songUrl" target="_blank">Listen</a>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="Operations"
                    label="收藏"
                    align="center"
                    min-width="80"
                    v-if="user.identity"
                >
                    <template #default="scope">
                        <el-button
                            size="default"
                            :type="isFavorited(scope.row._id) ? 'warning' : 'primary'"
                            :icon="isFavorited(scope.row._id) ? StarFilled : Star"
                            circle
                            @click="handleFavoriteClick(scope.row)"
                            :title="isFavorited(scope.row._id) ? '取消收藏' : '添加收藏'"
                        />
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="Operations"
                    label="操作"
                    align="center"
                    style="margin-left: auto;"
                    min-width="180"
                    v-if = "user.identity == 'manager'"
                >
                    <template #default="scope">
                        <el-button 
                        size="default" 
                        type="warning"
                        @click="handleEdit(scope.$index, scope.row)">
                        編輯
                        </el-button>
                        <el-button
                        size="default"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                        >
                        刪除
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

        <Dialog :dialog="dialog"  :formData="formData" @update="handleSearch"></Dialog>
        <PlaylistDialog 
            v-model:visible="showPlaylistDialog" 
            :song="selectedSong" 
            @added="handleSongAdded"
        />
        

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick  } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Timer, Star, StarFilled } from '@element-plus/icons-vue';
import Dialog from '../components/Dialog.vue';
import PlaylistDialog from '../components/PlaylistDialog.vue';

let resizeObserver = null;
let refreshTimer = null;

onMounted(() => {
  window.addEventListener('resize', forceRecalculateLayout);
  handleSearch();
  loadUserData(); // 載入用戶資料
  
  // 確保在頁面載入時也載入收藏清單
  if (store.getters.isAuthenticated) {
    loadUserPlaylists();
  }

  // 新增自動刷新定時器（每 60 秒自動執行一次 handleSearch）
  refreshTimer = setInterval(() => {
    handleSearch();
    loadUserPlaylists(); // 也刷新收藏清單
    console.log('✅ 自動刷新動漫歌曲資料');
  }, 60000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', forceRecalculateLayout);

  // 清除定時器，避免記憶體洩漏
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});

const forceRecalculateLayout = () => {
  nextTick(() => {
    const tables = document.querySelectorAll('.el-table');
    tables.forEach(table => {
      table.__vueParentComponent?.exposed?.doLayout?.();
    });
    console.log('已重新計算 el-table 欄位寬度');
  });
};

const user = computed(() => store.getters.user);

const search_data = reactive({
  startTime: '',
  endTime: '',
  type: '',
  describe: '',
  workName: '',
  category: '',
  rating: '',
});
const tableData = ref([]);
const allTableData = ref([]);
const filterTableData = ref([]);

const paginations = reactive({
  page_index: 1, // 當前位於哪頁
  total: 0, // 總數
  page_size: 5, // 一頁顯示幾筆
  page_sizes: [5, 10, 15, 20], // 每頁顯示幾筆
  layout: "total, sizes, prev, pager, next, jumper", // 分頁屬性
});

const dialog = reactive({
  show: false,
  title: '',
  option: 'edit',
});

const formData = reactive({
  type: '',
  workName: '',
  describe: '',
  rating: '',
  category: '',
  singerOrGroup: '',
  songUrl: '',
  id: '',
});

const handleSearch = () => {
  const params = {};
  if (search_data.startTime) params.startTime = search_data.startTime;
  if (search_data.endTime) params.endTime = search_data.endTime;
  if (search_data.type && search_data.type !== '全部') params.type = search_data.type;
  if (search_data.describe) params.describe = search_data.describe;
  if (search_data.workName) params.workName = search_data.workName;
  if (search_data.category) params.category = search_data.category;
  if (search_data.rating) params.rating = search_data.rating;
  
  axios.get('/api/animesongs/search', { params })
    .then(res => {
      allTableData.value = res.data;
      filterTableData.value = res.data;
      setPaginations();
      
      // 如果用戶已登入，更新收藏清單狀態
      if (user.value && user.value.id) {
        loadUserPlaylists();
      }
    })
    .catch(err => console.log(err));
};

const handleReset = () => {
  search_data.startTime = '';
  search_data.endTime = '';
  search_data.type = '';
  search_data.describe = '';
  search_data.workName = '';
  search_data.category = '';
  search_data.rating = '';
  handleSearch();
};

const handleEdit = (index, row) => {
  dialog.show = true;
  dialog.title = '編輯動漫歌曲資訊';
  dialog.option = 'edit';
  Object.assign(formData, {
    type: row.type || '',
    workName: row.workName || '',
    describe: row.describe || '',
    rating: row.rating || '',
    category: row.category || '',
    singerOrGroup: row.singerOrGroup || '',
    songUrl: row.songUrl || '',
    id: row._id,
  });
};

const handleAdd = () => {
  dialog.show = true;
  dialog.title = '新增動漫歌曲資訊';
  dialog.option = 'add';
  Object.assign(formData, {
    type: '',
    workName: '',
    describe: '',
    rating: '',
    category: '',
    singerOrGroup: '',
    songUrl: '',
    id: '',
  });
};

const handleDelete = (index, row) => {
  axios.delete(`/api/animesongs/delete/${row._id}`)
    .then(res => {
      ElMessage.success('刪除成功');
      handleSearch();
    });
};

const setPaginations = () => {
    paginations.total = allTableData.value.length;
    paginations.page_index = 1;
    paginations.page_size = 5;
    tableData.value = allTableData.value.filter((item, index) => {
        return index < paginations.page_size;
    })
}

const handleSizeChange = (page_size) => {
    paginations.page_index = 1;
    paginations.page_size = page_size;
    tableData.value = allTableData.value.filter((item, index) => {
        return index < page_size;
    })
}

const handleCurrentChange = (page) => {
    let index = paginations.page_size * (page - 1);
    let nums = paginations.page_size * page;
    let tables = [];
    for (let i = index; i < nums; i++) {
        if (allTableData.value[i]) {
            tables.push(allTableData.value[i]);
        }
        tableData.value = tables;
    }
}

const defaultTime = new Date(2000, 1, 1, 12, 0, 0);

const store = useStore();

// 收藏清單相關變數
const showPlaylistDialog = ref(false);
const selectedSong = ref({});
const userPlaylists = ref([]);


// 載入用戶資料
const loadUserData = async () => {
  if (store.getters.isAuthenticated) {
    try {
      const response = await axios.get('/api/users/current');
      store.dispatch('setUser', response.data);
      
      // 載入用戶的收藏清單
      await loadUserPlaylists();
    } catch (error) {
      console.error('載入用戶資料失敗', error);
    }
  }
};

// 載入用戶的收藏清單
const loadUserPlaylists = async () => {
  if (!user.value || !user.value.id) {
    userPlaylists.value = [];
    return;
  }
  
  try {
    const response = await axios.get('/api/users/playlists');
    if (response.data.success) {
      // 按創建時間排序，最先創建的在最上面
      userPlaylists.value = response.data.playlists.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  } catch (error) {
    console.error('載入收藏清單失敗:', error);
    userPlaylists.value = [];
  }
};

// 檢查歌曲是否已被收藏
const isFavorited = (songId) => {
  if (!user.value || !user.value.id || !userPlaylists.value.length) {
    return false;
  }
  
  return userPlaylists.value.some(playlist => 
    playlist.songs.some(song => 
      typeof song === 'string' ? song === songId : song._id === songId
    )
  );
};

// 獲取包含某首歌曲的收藏清單
const getPlaylistsContainingSong = (songId) => {
  if (!songId || !userPlaylists.value.length) {
    return [];
  }
  
  return userPlaylists.value.filter(playlist => 
    playlist.songs && playlist.songs.some(song => 
      typeof song === 'string' ? song === songId : song._id === songId
    )
  );
};

// 處理收藏按鈕點擊
const handleFavoriteClick = (song) => {
  if (!user.value || !user.value.id) {
    ElMessage.error('請先登入');
    return;
  }
  
  // 無論是否已收藏，都打開收藏清單對話框
  selectedSong.value = song;
  showPlaylistDialog.value = true;
};

// 添加到收藏清單
const addToPlaylist = (song) => {
  selectedSong.value = song;
  showPlaylistDialog.value = true;
};



// 處理歌曲添加成功
const handleSongAdded = () => {
  // 重新載入收藏清單以更新按鈕狀態
  loadUserPlaylists();
  console.log('歌曲已添加到收藏清單');
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

.table_container {
    @include card($spacing-lg, 12px);
    margin-top: $spacing-lg;
    overflow-x: auto;
}

.selectTime, .selectItem{
    float: left;
}

.selectBtn {
    float: left;
}

.btnAdd {
    float: right;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-lg;
}

/* Element Plus 樣式已移至全域樣式文件 _element-plus-theme.scss */

/* 鏈接美化 */
::v-deep(a) {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

/* 對話框頁面特定樣式 */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>