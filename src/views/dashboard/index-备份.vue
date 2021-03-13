<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 上传图片 -->
      <input type="file" @change="upload">
    </div>
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
  methods: {
    upload(e) {
      const file = e.target.files[0]
      cos.putObject({
        // 存储桶名称
        Bucket: 'hrsaas-1256173530',
        /* 存储桶所在地域，必须字段 */
        Region: 'ap-shanghai',
        /* 必须 */
        Key: uuid() + '-' + file.name,
        StorageClass: 'STANDARD',
        // 上传文件对象
        Body: file,
        onProgress: function(progressData) {
          // 上传的进度
          console.log(JSON.stringify(progressData))
        }
      }, function(err, data) {
        console.log(err || data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
