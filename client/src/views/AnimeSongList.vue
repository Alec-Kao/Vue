<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true">
              <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item class="selectText" label="查詢方法，可為空:"></el-form-item>
                  </el-col>
                </el-row>
            </el-form>
            <el-form :inline="true" res="add_data"  label-width="auto"  label-position="left" :model="search_data">
                <!-- 篩選 -->
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
                    <el-form-item label="類型:">
                      <el-input v-model="search_data.category" placeholder="請輸入類型" clearable />
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
                style="width: 100%"
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
                        <div style="display: flex; align-items: center; justify-content: center;">
                        <span style="color:#00d053">{{ scope.row.rating }}</span>
                        </div>
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
                        <a :href="scope.row.songUrl" target="_blank" style="color: #409EFF; text-decoration: none;">Listen</a>
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
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick  } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { Timer } from '@element-plus/icons-vue';
import Dialog from '../components/Dialog.vue';

let resizeObserver = null;
let refreshTimer = null;

onMounted(() => {
  window.addEventListener('resize', forceRecalculateLayout);
  handleSearch();

  // 新增自動刷新定時器（每 60 秒自動執行一次 handleSearch）
  refreshTimer = setInterval(() => {
    handleSearch();
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

</script>

<style scoped>
.fillContainer {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}

.table_container {
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
    margin-top: 10px;
}

::v-deep(.el-form-item__label) {
  font-size: 16px;
}

::v-deep(.selectText .el-form-item__label) {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}



::v-deep(.el-select .el-input__inner) {
  color: #000 !important;
  font-size: 15px;
}

::v-deep(.el-button) {
  font-size: 15px;
}
</style>