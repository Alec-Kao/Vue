<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" res="add_data" :model="search_data">
                <!-- 篩選 -->
                <el-form-item label="按照時間篩選:">
                    <!-- <span class="demonstration">With default time</span> -->
                    <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="選擇開始時間"
                        :default-time="defaultTime"
                    /> 
                    --
                    <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="選擇結束時間"
                        :default-time="defaultTime"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleSearch()">篩選</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary" 
                        size="small" 
                        v-if = "user.identity == 'manager'" 
                        @click="handleAdd()"
                    >
                        新增
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table 
                v-if="tableData.length > 0" 
                :data="tableData"
                :fit="true" 
                max-height="450" 
                border
                        :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: 100%">
                <el-table-column 
                    type="index" 
                    label="序號"
                    align='center'
                    min-width="70">
                </el-table-column>
                <el-table-column 
                    prop="date" 
                    label="創建時間"
                    align='center'
                    min-width="250">
                    <template #default="scope">
                        <div style="display: flex; align-items: center;">
                            <el-icon><timer /></el-icon>
                            <span style="margin-left: 10px">{{ scope.row.date }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="收支項目"
                    align='center'
                    min-width="150">
                </el-table-column>
                <el-table-column
                    prop="describe"
                    label="收支描述"
                    align='center'
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="income"
                    label="收入"
                    align='center'
                    min-width="170"> 
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
                    min-width="170"> 
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
                    min-width="170"> 
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
                    min-width="220">
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
                        size="small" 
                        type="warning"
                        @click="handleEdit(scope.$index, scope.row)">
                        編輯
                        </el-button>
                        <el-button
                        size="small"
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
                            v-model:page-size="pageSize4"
                            :page-sizes="paginations.page_sizes"
                            :size="paginations.page_size"
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
         <Dialog :dialog="dialog"  :formData="formData" @update="getProfile"></Dialog>
    </div>
</template>

<script>
import axios from "axios"; // vue 3
import { Timer } from '@element-plus/icons-vue';
import Dialog from "../components/Dialog";
import { messageConfig } from "element-plus";

export default {
    name: "fundList",
    components: {
        Timer,
        Dialog
    },
    data() {
        return {
            search_data: {
                startTime: "",
                endTime: "",
                filterTableData: []
            },
            paginations: {
              page_index: 1, // 當前位於哪頁
              total: 0, // 總數
              page_size: 5, // 一頁顯示多少條
              page_sizes: [5, 10, 15, 20], // 每頁顯示多少條
              layout: "total, sizes, prev, pager, next, jumper" // 翻頁屬性
            },
            tableData: [],
            allTableData: [],
            dialog: {
                show: false,
                title: "",
                option: "edit"
            },
            formData: {
                type: "",
                describe: "",
                income: "",
                expend: "",
                cash: "",
                remark: "",
                id: ""
            },
        };
    },
    computed: {
        user() {
            return this.$store.getters.user;
        }
    },
    created() {
        this.getProfile();
    },
    methods: {
        getProfile() {
        axios.get("/api/profiles")
            .then(res => {
                // this.tableData = res.data;
                // console.log(this.tableData);
                this.allTableData = res.data;
                this.filterTableData = res.data;
                // 設置分頁數據
                this.setPaginations();
            })
            .catch(err => {
                console.error("資料取得失敗", err);
            });
        },
        setPaginations() {
            // 分頁屬性設置
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_sizes = 5;
            // 設置預設的分頁數據
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        handleEdit(index, row) {
            // console.log(this.dialog);
            this.dialog = {
                show: true,
                title: "修改資金訊息",
                option: "edit"
            },
            
            this.formData = {
                type: row.type,
                describe: row.describe,
                income: row.income,
                expend: row.expend,
                cash: row.cash,
                remark: row.remark,
                id: row._id
            }
        },
        handleDelete(index, row) {
            axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
                this.$message("刪除成功!");
                this.getProfile();
            });
            // console.log(456);
        },
        handleAdd() {
            // this.dialogVisible = true;
            this.dialog = {
                show: true,
                title: "新增資金訊息",
                option: "add"
            },

            this.formData = {
                type: "",
                describe: "",
                income: "",
                expend: "",
                cash: "",
                remark: "",
                id: ""
            };
            // console.log(789);
        },
        handleSizeChange(page_size) {
            // 切換 size 
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            // 設置分頁數據
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        handleCurrentChange(page) {
            // 獲取當前頁
            let index = this.paginations.page_size * (page - 1);
            // 數據的總數
            let nums = this.paginations.page_size * page;
            // 容器
            let tables = [];

            for(let i = index; i < nums; i++) {
                if(this.allTableData[i]) {
                    tables.push(this.allTableData[i]);
                }

                this.tableData = tables;
            }
        },
        handleSearch() {
            // 篩選
            if(!this.search_data.startTime || !this.search_data.endTime) {
                this.$message({
                    type: "warning",
                    message: "請選擇時間區間"
                });
                this.getProfile();
                return;
            }

            const sTime = this.search_data.startTime.getTime();
            const eTime = this.search_data.endTime.getTime();

            this.allTableData = this.filterTableData.filter(item => {
                // console.log(item);
                let date = new Date(item.date);
                let time = date.getTime();
                return time >= sTime && time <= eTime;
            });

            // 分頁數據
            this.setPaginations();
        }
    }
};

// const getProfile = () => {
//     axios.get("/api/profiles")
//           .then(res => {
//               this.tableData = res.data;
//           }).catch(err => console.log(err));
// }
</script>

<style scoped>
.fillContainer {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}

.btnRight {
    float: right;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
</style>