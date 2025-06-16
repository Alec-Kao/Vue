<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" res="add_data" :model="search_data">
                <!-- 篩選 -->
                <el-row style="flex-wrap: wrap;">
                  <el-col>
                    <el-form-item label="查詢方法，可為空:"></el-form-item>
                  </el-col>
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

                    <el-form-item label="收支項目:" class="selectItem">
                      <el-select v-model="search_data.type" 
                        placeholder="請選擇收支項目" 
                        clearable
                        style="width: 150px"
                      >
                        <el-option label="全部" :value="'全部'" />
                        <el-option label="提領手續費" :value="'提領手續費'" />
                        <el-option label="儲值" :value="'儲值'" />
                        <el-option label="優惠券" :value="'優惠券'" />
                        <el-option label="儲值禮券" :value="'儲值禮券'" />
                        <el-option label="轉帳" :value="'轉帳'" />
                      </el-select>
                    </el-form-item>

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
                    min-width="250">
                    <template #default="scope">
                        <div style="display: flex; justify-content: center;">
                            <el-icon><timer /></el-icon>
                            <span style="margin-left: 10px">{{ scope.row.date }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="收支項目"
                    align='center'
                    min-width="120">
                </el-table-column>
                <el-table-column
                    prop="describe"
                    label="收支說明"
                    align='center'
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="income"
                    label="收入"
                    align='center'
                    min-width="120"> 
                    <template #default="scope">
                        <div style="display: flex; align-items: center; justify-content: center;">
                        <span style="color:#00d053">{{ scope.row.income }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expend"
                    label="支出"
                    align='center'
                    min-width="120"> 
                    <template #default="scope">
                        <div style="display: flex; align-items: center; justify-content: center;">
                        <span style="color:#f56767">{{ scope.row.expend }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cash"
                    label="帳戶餘額"
                    align='center'
                    min-width="120"> 
                    <template #default="scope">
                        <div style="display: flex; align-items: center; justify-content: center;">
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="備註"
                    align='center'
                    min-width="100">
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

        <!-- <Dialog :dialog="dialog"></Dialog> -->
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
    console.log('✅ 自動刷新帳務資料');
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

// Vuex store
const store = useStore();

// 登入使用者資料 (取自 Vuex getter)
const user = computed(() => store.getters.user);

// 篩選時間與快取資料
const search_data = reactive({
  startTime: '',
  endTime: '',
  type: '',
  filterTableData: [],
});

// 分頁設定
const paginations = reactive({
  page_index: 1,
  total: 0,
  page_size: 5,
  page_sizes: [5, 10, 15, 20],
  layout: 'total, sizes, prev, pager, next, jumper',
});

// 資料表格
const tableData = ref([]);
const allTableData = ref([]);

// 彈窗控制與表單資料
const dialog = reactive({
  show: false,
  title: '',
  option: 'edit',
});

const formData = reactive({
  type: '',
  describe: '',
  income: '',
  expend: '',
  cash: '',
  remark: '',
  id: '',
});

// 取得後端資料
const getProfile = () => {
  axios.get('/api/profiles')
    .then(res => {
      allTableData.value = res.data;
      search_data.filterTableData = res.data;
      setPaginations();
    })
    .catch(err => {
      console.error('資料取得失敗', err);
    });
};

// 設定分頁初始資料
const setPaginations = () => {
  paginations.total = allTableData.value.length;
  paginations.page_index = 1;
  paginations.page_size = 5;
  tableData.value = allTableData.value.slice(0, paginations.page_size);
};

// 編輯資料
const handleEdit = (index, row) => {
  dialog.show = true;
  dialog.title = '修改資金訊息';
  dialog.option = 'edit';

  Object.assign(formData, {
    type: row.type,
    describe: row.describe,
    income: row.income,
    expend: row.expend,
    cash: row.cash,
    remark: row.remark,
    id: row._id,
  });
};

// 刪除資料
const handleDelete = (index, row) => {
  axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
    ElMessage.success('刪除成功!');
    handleSearch();
  });
};

// 新增資料
const handleAdd = () => {
  dialog.show = true;
  dialog.title = '新增資金訊息';
  dialog.option = 'add';

  Object.assign(formData, {
    type: '',
    describe: '',
    income: '',
    expend: '',
    cash: '',
    remark: '',
    id: '',
  });
};

// 每頁筆數變更
const handleSizeChange = (page_size) => {
  paginations.page_index = 1;
  paginations.page_size = page_size;
  tableData.value = allTableData.value.slice(0, page_size);
};

// 換頁
const handleCurrentChange = (page) => {
  const start = paginations.page_size * (page - 1);
  const end = start + paginations.page_size;
  tableData.value = allTableData.value.slice(start, end);
};

// 篩選功能
const handleSearch = () => {
  // const hasTimeRange = search_data.startTime && search_data.endTime;
  // const sTime = hasTimeRange ? new Date(search_data.startTime).getTime() : null;
  // const eTime = hasTimeRange ? new Date(search_data.endTime).getTime() : null;

  // allTableData.value = search_data.filterTableData.filter(item => {
  //   const itemTime = new Date(item.date).getTime();
  //   const matchTime = hasTimeRange ? (itemTime >= sTime && itemTime <= eTime) : true;
  //   const matchType = search_data.type ? item.type === search_data.type : true;
  //   return matchTime && matchType;
  // });
  const params = {};

  if (search_data.startTime) {
    params.startTime = search_data.startTime;
  }
  if (search_data.endTime) {
    params.endTime = search_data.endTime;
  }
  if (search_data.type && search_data.type !== '全部') {
    params.type = search_data.type;
  }

  axios.get('/api/profiles/search', { params })
    .then(res => {
      allTableData.value = res.data;
      search_data.filterTableData = res.data;
      setPaginations();
    })
    .catch(err => {
      console.error('查詢失敗', err);
    });

  setPaginations();
};

// 還原全部
const handleReset = () => {
  search_data.startTime = '';
  search_data.endTime = '';
  search_data.type = '';
  // allTableData.value = search_data.filterTableData;
  handleSearch();
};
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
  font-weight: bold;
  color: #333;
}

::v-deep(.el-select .el-input__inner) {
  color: #000 !important;
  font-size: 15px;
}

::v-deep(.el-form-item__label) {
  font-size: 15px;
}

::v-deep(.el-button) {
  font-size: 15px;
}
</style>