<template>
  <div>
    <div class="select-box">
      <el-select
        v-model="currentYear"
        size="small"
        style="margin-right: 10px"
        @change="changeDate"
      >
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        @change="changeDate"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <el-calendar v-model="currentDate">
      <template #dateCell="{date}">
        <div class="date-content">
          <!-- {{ data }} -->
          <!-- <span class="text" :style="{background: data.isSelected ? $store.state.settings.theme: ''}">{{ date.getDate() }}</span> -->
          <span class="text">{{ date.getDate() }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      // 如果props的默认值是对象或者数组，不是简单类型，需要使用函数去返回
      default() {
        return new Date()
      }
    }
  },
  data() {
    return {
      currentYear: null,
      currentMonth: null,
      // 可选的年份
      yearList: [],
      currentDate: null
    }
  },
  watch: {
    currentDate: {
      deep: true,
      handler(value) {
        this.currentYear = value.getFullYear()
        this.currentMonth = value.getMonth() + 1
      }
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    // for (let i = this.currentYear - 5; i <= this.currentYear + 5; i++) {
    //   this.yearList.push(i)
    // }
    // console.log(this.yearList)
    this.yearList = Array.from(new Array(11), (item, index) => this.currentYear + index - 5)
    this.currentDate = new Date(this.currentYear, this.currentMonth - 1)
  },
  methods: {
    changeDate() {
      // console.log(this.currentYear, this.currentMonth)
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1)
    },
    isWeek(date) {
      return date.getDay() === 0 || date.getDay() === 6
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-calendar-day {
  // height:  50px;
  height:  auto;
 }
::v-deep .el-calendar-table__row td::v-deep .el-calendar-table tr td:first-child, ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected .text{
   background: #409EFF;
   color: #fff;
   border-radius: 50%;
 }
::v-deep .el-calendar__header {
   display: none
 }
</style>
