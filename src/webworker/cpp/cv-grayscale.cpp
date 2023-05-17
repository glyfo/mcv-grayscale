/*
###########################################################################
# Copyright Glyfo Company. 2023. All Rights Reserved.                     #
# module  : Scanner Component                                             #
# website : glyfo.com                                                     #
###########################################################################
*/

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include <opencv2/imgproc/imgproc.hpp>

#include <emscripten/bind.h>

uint8_t                               *buffer;
int                                   gsw,gsh;
cv::Mat                               frame_in,frame_out;

extern "C" {

  uint8_t* config(int sw,int sh) {
    lframew = framew;
    lframeh = frameh;
    
    buffer = (uint8_t*)malloc(lframew*lframeh*4*sizeof(uint8_t));

    return buffer;
  }
  

}
