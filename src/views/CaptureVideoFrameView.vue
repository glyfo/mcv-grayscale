<template> 
    <div class="h-screen bg-transparent" >
       <video id="video"  ref="video" ></video> 
       <canvas id="capture" ref="capture" ></canvas> 
       <transition name="fade">
           <div  v-show="show" class="absolute top-0 left-0 w-full h-full bg-white z-40" ></div>
       </transition>
      <div class="absolute text-center bg-black bg-opacity-25 top-0 h-1/4 w-full z-30 ">
      </div>

      <!-- status  -->
       <div class="absolute top-10 left-5 z-30">
                    <a 
                       class="w-full text-white flex items-center">
                        <span class="pt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                        <span class="text-sm font-semibold pt-2 pl-2">{{status}}</span>                        
                    </a>
        </div>
      <!-- info icon  -->
      <div class="absolute top-10 right-5 z-30">
                    <a @click="$router.push('/debug')"
                       class="w-full text-white flex items-center">
                        <span class="pt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                    </a>
        </div>
      <!-- indications  -->
       <div class="absolute text-center bg-black bg-opacity-25 top-3/4 h-1/4 w-full z-30 ">
          <span class="text-sm text-white font-semibold pt-2 pl-2">Rethiking Scan from Mobile using Glyfo.com</span>                         
        </div>

    </div>
</template>

<script>
import WebWorkerHandler from '@/webworker/WebWorkerHandler.js'

export default {
  name: 'CaptureVideoFrameView',
  components: {
  },
  data () {
    return {
      gworker          : new WebWorkerHandler(this.$store), 
      status           : 'Loading Scanner Configuration ...',
      isScanConfigDone : false,
      isScanCodeFound  : false,
      buttoncapture    : false,
      scanningOn       : false,
      show             : true,
      state            : 'off',
      scanner          : null,
      stream           : null,
      stdw             : null,
      stdh             : null,
      maxw             : null,
      mah              : null,
      ctxCapture       : null,
      ctxSnapshot      : null,
      constraints      : {    video: { facingMode: 'environment', 
                            width:  { min: 640, ideal: 1280, max: 3840 },
                            height: { min:480, ideal: 720, max: 2160 }
                          }
                        } 
      }
      
  },
  computed: {
  },
  mounted: function () { 
  window.addEventListener('scroll', this.handleScroll);
  this.debug('scan: mounted start')
  this.$nextTick(function () {
    try {
        
    (navigator.mediaDevices.getUserMedia(this.constraints))
         .then(stream => {
            this.stream = stream
            this.attachVideo()
            this.configVideo()
            this.$refs["video"].addEventListener(
               'loadedmetadata', e => this.reConfigVideo(e));  

          }).catch(e => {
            this.debug("error:"+e.message)
          }); 

    }catch(e) {
      this.debug('error:'+e)
    }
  })
  },
  activated: function() {    
  try{  
       // Is mandatory to call to play when component is activated   
      if(this.isScanConfigDone){
       this.$refs["video"].play()
       this.$store.dispatch("setScanLabel",'Scanning')
       setTimeout(this.onActivated.bind(this),500);
       
      }

    }catch(e) {
      this.debug(e)
    }     
  }, 
  deactivated: function() {    
  try{  
       // Play stop mandatory  
       this.scanningOn = false
       this.status = "Scanning Off"

    }catch(e) {
      this.debug(e)
    }     
  }, 
  methods: {
    handleScroll: function(){
     // window.scrollTo(0, 0);
     // e.preventDefault()
    },
    configVideo: function(){
      let track = this.stream.getVideoTracks()[0]

      // Attach Event Handler
      document.addEventListener('eventHandler', e => this.onEventHandler(e))

      if(typeof track.getCapabilities === 'function'){
          let capabilities = track.getCapabilities();
          let settings     = track.getSettings();
          
           this.stdw = settings.width
           this.stdh = settings.height
           this.maxw = capabilities.width.max
           this.maxh = capabilities.height.max
       }
    }, // end configVideo()
    reConfigVideo: function(){
        switch(this.state) {
        case "off":
              this.state = 'reset'
              this.resetVideo() 
        break;
        case "reset":
             this.state = 'done'
        break;
        } 
    }, 
    resetVideo: function() {

      (navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', 
                advanced  : [{ 
                   width  :  this.maxw,
                   height :  this.maxh
                   }]
          } }
      ))
         .then(stream => {
            this.stream = stream;
            this.attachVideo()
            let track   = this.stream.getVideoTracks()[0]; 
            let settings = track.getSettings();  
            this.setw = settings.width
            this.seth = settings.height
            // Fix Iphone Bug 
            this.setw = this.maxh
            this.seth = this.maxw

            this.configCtxCanvas()
            this.configScan()
            this.gworker.init()
            this.debug("scanner: "+JSON.stringify(this.scanner))
            this.gworker.config(this.scanner)
            this.$refs["video"].play()
            this.show  = false
          }).catch(e => {
            this.debug("error reset video:"+e.message);
          }); 
          
      this.attachVideo()
    },
    attachVideo: function(){
      // Needed for iOS 11
      this.$refs["video"].setAttribute('muted', 'true')
      this.$refs["video"].setAttribute('playsinline', 'true')
      try {
          // @note Throws Exception if interrupted by a new loaded request
           this.$refs["video"].srcObject = this.stream 
        } catch (err) {
          // @note Avoid using this in new browsers, as it is going away.
          this.$refs["video"].src = URL.createObjectURL(this.stream);
        }
    },
    unattachVideo: function(){
      try {
            // @note Throws Exception if interrupted by a new loaded request
            this.$refs["video"].srcObject = null;
      } catch (err) {
            // @note Avoid using this in new browsers, as it is going away.
            this.$refs["video"].src  = null;
      }
    },
    configScan: function(){

      this.$refs["video"].width  = this.setw;
      this.$refs["video"].height = this.seth;

      let w_scanner = Math.round(this.setw*(W_SCANNER/100));
      let h_scanner = Math.round(this.seth*(H_SCANNER/100));

      let x_scanner = Math.round(this.setw*MIDDLE) - Math.round(w_scanner*MIDDLE);
      let y_scanner = Math.round(this.seth*OFFSET_Y_SCANNER);

      this.scanner =  { 
               dftlw  : this.stdw,
               dflth  : this.stdh,
               maxw   : this.maxw, 
               maxh   : this.maxh,
               setw   : this.setw, 
               seth   : this.seth ,
               x      : x_scanner , 
               y      : y_scanner , 
               sw     : w_scanner , 
               sh     : h_scanner ,
               ssetw  : Math.ceil(w_scanner*SCALE),
               sseth  : Math.ceil(h_scanner*SCALE)
              }
      },
    configCtxCanvas: function() {
      let cv = document.createElement('canvas')
      // reset size canvas
      cv.width                     = this.setw
      cv.height                    = this.seth
      this.$refs["capture"].width  = this.setw
      this.$refs["capture"].height = this.seth
      this.ctxCapture              = cv.getContext('2d')
      this.ctxSnapshot             = this.$refs["capture"].getContext('2d')
      },
    onActivated: function() {
      this.debug("scan:onActivated:") 
      this.isScanCodeFound = false
      this.scanningOn      = true
      this.status          = "Scanning On"
      this.gworker.scan(this.capture())
    },
    capture: function() {
    let imageData

     try {
          this.ctxCapture.drawImage(this.$refs["video"], 
                                   this.scanner.x, 
                                   this.scanner.y, 
                                   this.scanner.sw, 
                                   this.scanner.sh,
                                   0,
                                   0,
                                   this.scanner.ssetw,
                                   this.scanner.sseth)

          imageData = this.ctxCapture.getImageData(
                          0,
                          0,
                          this.scanner.ssetw,
                          this.scanner.sseth) 

        return imageData                
          //this.ctxSnapshot.putImageData(imageData,0,0);                                  
       }catch(e){
          this.debug("scan: capture error:"+e.message); 
       }
    },
    onEventHandler: function(e) {
      let evt = e.detail.event;
      //this.debug("WebWorker Event:"+JSON.stringify(e.detail)) 
      switch (evt) 
        {
        case 'config':
             this.scanningOn       = true
             this.isScanConfigDone = true
             this.status = "Scanning On"
             this.$store.dispatch("setScanLabel",'Scanning')
             this.gworker.scan(this.capture())
          break;
        case 'scanning':
            if(this.scanningOn && !this.isScanCodeFound ){
               this.gworker.scan(this.capture())
            }
            break;
        case 'code':
          if(this.scanningOn && !this.isScanCodeFound ){
            this.scanningOn      = false
            this.isScanCodeFound = true
            this.status = "Scanning Code - Searching Information ..."
            this.searchInfo(e.detail.code)
          }
            break;
        case 'codecapture':
            this.debug('codecapture')
            break;
        case 'nocodecapture':
            this.debug('codecapture')
            break;
        default:
            this.debug("WebWorker Default:"+JSON.stringify(e.detail)) 
            break;
        }

    },
    searchInfo: function(code) {
      this.$store.dispatch("setCode",code);
      this.$router.push({ name: "ProductDetail" })
    },
    debug: function(msg) {
      this.$store.dispatch("setItemCatalog",{ catalog : 'debug', item : { msg : msg }})
    }

  }

}

</script>

<style>

</style>