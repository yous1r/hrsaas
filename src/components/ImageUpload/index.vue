<template>
  <div class="image-upload">
    <!--
      action: 用于控制上传的图片地址，为了不报错，只需要提供给一个空的action即可
    -->
    <el-upload
      list-type="picture-card"
      action=""
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :http-request="handleUpload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :limit="limit"
      :class="{hidden: isHiddenIcon}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="isShowProgress" :percentage="percentage" style="width: 180px" />
    <el-dialog
      title="图片预览"
      width="40%"
      :visible.sync="showDialog"
    >
      <img style="width: 100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import uuid from 'uuid-v4'
const cos = new COS({
  SecretId: 'AKIDvdOzNe2P00qTvGS6IMKC1sc8NQTVuH5i',
  SecretKey: 'DsIWgjrBNOYgMZbU7rgJBXnJgpmX5oTa'
})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }

  },
  data() {
    return {
      fileList: [
        // { url: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1757702845,51708014&fm=26&gp=0.jpg' },
        // { url: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2718853745,1288801299&fm=26&gp=0.jpg' }
      ],
      showDialog: false,
      imgUrl: '',
      percentage: 0,
      isShowProgress: false
    }
  },
  computed: {
    isHiddenIcon() {
      return this.fileList.length >= this.limit
    }
  },
  methods: {
    handlePreview(file) {
      // 处理预览的逻辑
      // console.log('预览', file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    /* file: 删除的那个文件  fileList: 还剩下的文件 */
    handleRemove(file, fileList) {
      // console.log('file', file)
      // console.log('fileList', fileList)
      // this.fileList = this.fileList.filter
      this.fileList = fileList
    },
    handleUpload({ file }) {
      this.isShowProgress = true
      cos.putObject({
        Bucket: 'hrsaas-1256173530', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: uuid() + '-' + file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: (data) => {
          // console.log('当上传的文件的进度发生改变的时候，会执行')
          // console.log(progressData)
          this.percentage = data.percent * 100
        }
      }, (err, data) => {
        if (err) {
          return this.$message.error('上传图片失败')
        }
        if (data.statusCode === 200) {
          // 上传成功了
          const result = this.fileList.find(item => item.uid === file.uid)
          result.status = 'success'
          result.url = 'https://' + data.Location
          this.isShowProgress = false
          this.percentage = 0
        }
      })
    },
    handleChange(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList
    },
    beforeUpload(file) {
      // console.log('file', file)
      // 判断上传的文件的格式
      const accepts = ['image/gif', 'image/png', 'image/jpeg']
      if (!accepts.includes(file.type)) {
        this.$message.warning('上传的图片格式错误')
        return false
      }
      if (file.size >= 1 * 1024 * 1024) {
        this.$message.warning('上传的文件不能超过1MB')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
