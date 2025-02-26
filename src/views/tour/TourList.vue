<template>
  <div class="app-container">
    <div style="margin-bottom: 16px;">合伙人列表</div>
    <div class="table-container">
      <!-- 日期选择器 -->
      <el-date-picker
        v-model="selectedDate"
        type="date"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="pickerOptions"
        @change="handleDateChange"
        style="margin-bottom: 16px;"
      ></el-date-picker>
    
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="200">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="公司">
          <template slot-scope="scope">{{ scope.row.companyName }}</template>
        </el-table-column>
        <el-table-column label="预约">
          <template slot-scope="scope">
            <el-button @click="selectTime(scope.row.id)">选择时间</el-button>
          </template>
        </el-table-column>
        <el-table-column label="取消预约">
          <template slot-scope="scope">
            <el-button @click="selectCancelTime(scope.row.id)">选择预约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      />
    </div>

    <!-- 选择时间的弹出框 -->
    <el-dialog
      title="选择预约时间"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-select v-model="selectedTime" placeholder="请选择时间">
        <el-option
          v-for="(item, index) in availableTimes"
          :key="index"
          :label="item.time"
          :value="item.timestamp"
        ></el-option>
      </el-select>
      <div style="margin-bottom: 16px;"></div>
      <div>
        <el-select v-model="selectedEntrepreneurs" placeholder="请选择创始人">
          <el-option
            v-for="(item, index) in entrepreneurs"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="选择要取消的预约"
      :visible.sync="cancelDialogVisible"
      width="50%"
      @close="handleCancelClose"
    >
    <el-select v-model="selectedCancelId" placeholder="选择要取消的预约">
      <el-option
        v-for="(item, index) in tourTimes"
        :key="'cancel-' + index"
        :label="item.time + ' - ' + item.entrepreneurName"
        :value="item.id"
      ></el-option>
    </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="cancelConfirmSelection">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPartersList, getAvailableTimes,getEntrepreneurs,
  createAppointment,getAllTour,cancelAppointment } from "@/api/tour"; // 假设接口存在
import { formatDate } from "@/utils/date";

const defaultQuery = {
  pageNum: 1,
  pageSize: 10,
  selectedDate: "", // Default to empty string for no date selected
};

export default {
  name: "tourList",
  data() {
    return {
      listQuery: Object.assign({}, defaultQuery),
      list: null,
      total: null,
      listLoading: true,
      dialogVisible: false,    // 控制弹窗显示
      cancelDialogVisible:false,
      selectedTime: '',        // 用户选择的时间
      selectedCancelId:'',
      selectedEntrepreneurs: '',
      entrepreneurs:[],
      availableTimes: [],      // 存储可用时间段
      tourTimes:[],
      selectedPartnerId: null, // 存储当前选择的合伙人 ID
      selectedDate: "",        // 用户选择的日期
      pickerOptions: {
        disabledDate(time) {
          const today = new Date();
          const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return time.getTime() < today.getTime()-24 * 60 * 60 * 1000 || time.getTime() > oneWeekLater.getTime();
        }
      }
    };
  },
  created() {
    this.listLoading = false;
  },
  methods: {
    // 获取合伙人列表
    getList() {
      this.listLoading = true;
      const listQuery = { ...this.listQuery };

      fetchPartersList(listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },

    // 获取合伙人可预约的时间
    fetchAvailableTimes(partnerId) {
      getAvailableTimes(partnerId,this.selectedDate).then((response) => {
        this.availableTimes = response.data; // 假设返回数据是时间段数组
      });
    },

    fetchEntrepreneurs() {
      getEntrepreneurs().then((response) => {
        this.entrepreneurs = response.data; // 假设返回数据是时间段数组
      });
    },

    // 弹出选择时间的弹窗
    selectTime(partnerId) {
      this.selectedPartnerId = partnerId;  // 记录当前选择的合伙人 ID
      this.fetchAvailableTimes(partnerId);  // 获取该合伙人的可用时间
      this.fetchEntrepreneurs(); 
      this.dialogVisible = true;  // 显示弹窗
    },

    selectCancelTime(partnerId) {
      this.selectedPartnerId = partnerId;  // 记录当前选择的合伙人 ID
      const toursData = {
        partnerId,
        date: this.selectedDate,
      };
      getAllTour(toursData).then((response) => {
        this.tourTimes = response.data; // 假设返回数据是时间段数组
      });
      this.cancelDialogVisible = true;  // 显示弹窗
    },

    // 确认选择的时间
    confirmSelection() {
      if (!this.selectedTime) {
        this.$message.error('请选择时间');
        return;
      }
      if (!this.selectedEntrepreneurs) {
        this.$message.error('请选择创始人');
        return;
      }
      // 提交预约数据
      this.createTour(this.selectedPartnerId, this.selectedEntrepreneurs, this.selectedTime);
      this.dialogVisible = false;  // 关闭弹窗
    },

    cancelConfirmSelection() {
      if (!this.selectedCancelId) {
        this.$message.error('请选择时间');
        return;
      }
      const cancelData = {
        id: this.selectedCancelId,
      };
      cancelAppointment(cancelData)  // 提交预约请求
        .then((response) => {
          this.selectedCancelId = '';
          this.$message.success('取消预约成功');
        })
        .catch((error) => {
          this.$message.error('取消预约失败');
        });
      this.cancelDialogVisible = false;  // 关闭弹窗
    },

    // 创建预约
    createTour(partnerId, entrepreneurId, timestamp) {
      const appointmentData = {
        partnerId,
        timestamp,
        entrepreneurId
      };
      createAppointment(appointmentData)  // 提交预约请求
        .then((response) => {
          this.selectedTime = '';
          this.selectedEntrepreneurs='';
          this.$message.success('预约成功');
        })
        .catch((error) => {
          this.selectedTime = '';
          this.selectedEntrepreneurs='';
          //this.$message.error('预约失败1');
        });
    },

    // 处理分页大小变化
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },

    // 处理当前页变化
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    // 日期选择变化时更新列表数据
    handleDateChange(date) {
      console.log("date-",date);
      this.listQuery.selectedDate = date;
      this.getList();
    },

    handleClose() {
      this.dialogVisible = false;
    },
    handleCancelClose() {
      this.cancelDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>