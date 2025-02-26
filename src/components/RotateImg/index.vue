<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="visible"
      width="580"
      top="5vh"
      :close-on-click-modal="false"
      :before-close="onClose"
    >
      <div style="height: 500px; overflow: auto">
        <img
          v-if="data"
          id="itm-img"
          crossorigin="anonymous"
          :src="data"
          :style="{
            'object-fit': 'scale-down',
            width: '100%',
            transform: `scale(1) rotate(${imgRotate}deg)`,
          }"
        />
        <canvas id="itm-edit-canvas" style="opacity: 0; position: absolute"></canvas>
      </div>
      <div class="itm-edit-actions">
        <i class="el-icon-refresh-left" @click="doImgRotate(-90)"></i>
        <i class="el-icon-refresh-right" @click="doImgRotate(90)"></i>
      </div>
      <div class="itm-edit-footer">
        <el-button @click="onClose" :disabled="editLoading">取 消</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          :disabled="(imgRotate / 90) % 4 == 0"
          @click="doSubmitItmEdit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import dct from "@/api/dct";

export default {
  name: "goods2Img",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
      default: "",
    },
  },
  components: {},
  data() {
    return {
      editLoading: false,
      imgRotate: 0,
    };
  },
  methods: {
    onClose() {
      this.loading = false;
      this.imgRotate = 0;
      this.$emit("close");
    },
    async onConfirm(file, fileList) {
      var i = 0;
      this.loading = true;
      var documents = document.getElementsByClassName("goods-item");
      for (var doc of documents) {
        await this.exportImg(doc, this.data[i++]);
      }
      this.loading = false;
      this.onClose();
    },
    // 图片编辑旋转
    doImgRotate(num) {
      var imgRotate = this.imgRotate + num;
      if (imgRotate < 0) {
        imgRotate = 270;
      }
      this.imgRotate = imgRotate;
    },
    // 图片编辑确认
    async doSubmitItmEdit() {
      this.editLoading = true;
      try {
        const data = await this.getItmImgData();
        this.$emit("confirm", data);
      } catch (error) {}
      this.editLoading = false;
    },
    // 图片转数据
    getItmImgData(cb) {
      var imgRotate = this.imgRotate;
      var image = document.getElementById("itm-img");
      const canvas = document.getElementById("itm-edit-canvas");
      var ctx = canvas.getContext("2d");
      const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 };
      const quadrant = (imgRotate / 90) % 4;
      const imgW = image.naturalWidth;
      const imgH = image.naturalHeight;
      const size = imgW > imgH ? imgW : imgH;
      canvas.width = size * 2;
      canvas.height = size * 2;
      switch (quadrant) {
        case 0:
          cutCoor.sx = size;
          cutCoor.sy = size;
          cutCoor.ex = size + imgW;
          cutCoor.ey = size + imgH;
          break;
        case 1:
          cutCoor.sx = size - imgH;
          cutCoor.sy = size;
          cutCoor.ex = size;
          cutCoor.ey = size + imgW;
          break;
        case 2:
          cutCoor.sx = size - imgW;
          cutCoor.sy = size - imgH;
          cutCoor.ex = size;
          cutCoor.ey = size;
          break;
        case 3:
          cutCoor.sx = size;
          cutCoor.sy = size - imgW;
          cutCoor.ex = size + imgH;
          cutCoor.ey = size + imgW;
          break;
      }
      ctx.translate(size, size);
      ctx.rotate((imgRotate * Math.PI) / 180);
      ctx.drawImage(image, 0, 0);
      var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
      if (quadrant % 2 == 0) {
        canvas.width = imgW;
        canvas.height = imgH;
      } else {
        canvas.width = imgH;
        canvas.height = imgW;
      }
      ctx.putImageData(imgData, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob(function (blob) {
          // saveAs(blob, `123.png`);
          const fd = new FormData();
          fd.append("file", new File([blob], "test.jpeg", { type: blob.type }));
          dct.fileUploadAWS4Nodejs(fd).then((res) => {
            if (res.code == 200) {
              resolve({
                size: res.data.sourceSize,
                url: res.data.sourceUrl,
              });
            } else {
              reject();
            }
          });
        });
      });
    },
  },
};
</script>
<style>
.itm-edit-actions {
  font-size: 23px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 5px;
  position: relative;
  z-index: 10;
}

.itm-edit-actions i {
  margin-right: 10px;
  cursor: pointer;
}

.itm-edit-footer {
  text-align: right;
  margin-top: 5px;
}
</style>
