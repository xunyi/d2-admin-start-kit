<template>
  <d2-container>
    <template slot="header">网站管理</template>
    <el-upload
      class="upload-demo"
      action=""
      :http-request="handleUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </d2-container>
</template>

<script>
import uploader from '@/plugin/uploader'

export default {
  name: 'website-management',
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleUpload (selector) {
      uploader.uploadWithSDK(selector.file, true)
    }
  }
}
</script>

<style lang="scss">
</style>
