/*
###########################################################################
# Copyright Glyfo Company. 2023. All Rights Reserved.                     #
# module  : Webworker Handler                                             #
# website : glyfo.com                                                     #
###########################################################################
*/
'use strict';
class WebWorkerHandler extends Util {

    constructor() {   
     super();   
     this.worker    = null;     
    }

    init() {
     super.init();
     this.worker0    = new Worker("mvc-core-module.js");
     this.worker.addEventListener('message', e => this.onMessage(e));
    }

    config(scanner) { 
     this.worker.postMessage({ eventType: "CONFIG",frame: frame });
    }

    capture(imageData) {
     this.worker.postMessage({ eventType : "CAPTUREDECODE" , imageData : imageData.data },[imageData.data.buffer]);
    }

    onMessage(e) {
      let evt = e.data.eventType;
      switch (evt) 
        {
        case 'CONFIG':
            document.dispatchEvent(new CustomEvent('webWorkerReadyConfig',{ detail: { status : e.data.isOK } }));
          break;
        case 'CAPTURE':
            document.dispatchEvent(new CustomEvent('nocodecapture'));
            break;
        case 'LOG':
            this.console("gworker:LOG:"+JSON.stringify(e.data.payload));
            break;
        case 'ERROR':
            this.console("gworker:ERROR:"+JSON.stringify(e.data));
            break;
        default:
            break;
        }

    }

}

export default WebWorkerHandler;