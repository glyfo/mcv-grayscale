<template>
    <canvas ref="canvasElement" ></canvas>  
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'QRCode',
  components: {
  },
  props: ['ctx','code']
  ,
  mounted: function () {  
   try {
    let url = "https://"+location.host + "/" + this.ctx + this.code  
    QRCode.toCanvas( this.$refs["canvasElement"],url,{ width: 80 }, function (error) {
    if (error) throw error})
   }  catch (e) {
      console.log(e);
   }       
  },
  computed: {
  }
}


</script>
