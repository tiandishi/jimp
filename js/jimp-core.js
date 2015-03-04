var CV_BORDER_CONSTANT = 1;
var CV_BORDER_REPLICATE = 2;
var CV_BORDER_REFLECT_101 = 4;
var CV_BORDER_REFLECT = 3;
var CV_BORDER_WRAP = 5;
var init_matrix = null;
var gray_matrix = null;
var init_img_src = null;
var buffer = document.createElement("canvas");
// get the canvas context
var c = buffer.getContext('2d');
var imgCanvas = document.getElementById("img_canvas");
var imgCtx = imgCanvas.getContext("2d");

function Mat(__row, __col, __data, __buffer) {
    this.row = __row || 0;
    this.col = __col || 0;
    this.channel = 4;
    this.buffer = __buffer || new ArrayBuffer(__row * __col * 4);
    this.data = new Uint8ClampedArray(this.buffer);
    __data && this.data.set(__data);
    this.bytes = 1;
    this.type = "CV_RGBA";
}


function imread(__image) {
        var width = __image.width,
            height = __image.height;
        iResize(buffer, width, height);

        c.drawImage(__image, 0, 0);
        var imageData = c.getImageData(0, 0, width, height),
            tempMat = new Mat(height, width, imageData.data);
        imageData = null;
        c.clearRect(0, 0, width, height);
        return tempMat;
    }
    //  调用以上方法可以得到图形矩阵

function iResize(Canvas, __width, __height) {
    Canvas.width = __width;
    Canvas.height = __height;
}


function amt_to_gray(img_mat) {
    var newImage = cvtColor(img_mat);

    var width = newImage.col,
        height = newImage.row,
        imageData = this.iCtx.createImageData(width, height);
    imageData.data.set(newImage.data);
    this.iCtx.putImageData(imageData, 0, 0);
}


function get_img_mat(imgsrc) {
    var img = new Image();
    img.onload = function() {
        var myMat = imread(img);
        init_matrix = myMat;
        gray_matrix = null;
    };
    img.src = imgsrc;
}


//彩色转成灰阶
function color2gray(__src, max) {
        var aa = 257 - max;
        if (__src.type && __src.type === "CV_RGBA") {
            var row = __src.row,
                col = __src.col;
            var dst = new Mat(row, col);
            var data = dst.data,
                data2 = __src.data;
            var pix1, pix2, pix = __src.row * __src.col * 4;
            while (pix) {
                pix -= 4;
                pix1 = pix + 1;
                pix2 = pix + 2;
                var bb = (data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) / 1000;
                bb = bb / aa;
                bb = Math.round(bb);
                bb = bb * aa;
                data[pix] = data[pix1] = data[pix2] = bb;
                data[pix + 3] = data2[pix + 3];
            }
        } else {
            return src;
        }
        dst.type = "CV_GRAY";
        if (max == 256)
            gray_matrix = dst;
        return dst;
    }
    //得到二值图矩阵

function gray2bitplane(gray_matrix, value) {
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);

    value = value - 1;
    var row = gray_matrix.row,
        col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
        data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var aa = data2[pix];
        var tmp = 1 << value;
        var bb = aa & tmp;
        if (bb > 0) {
            bb = 255;
        }
        data[pix] = data[pix1] = data[pix2] = bb;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}

function gray2yuzhitu(__src, value) {
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);

    var row = gray_matrix.row,
        col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
        data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var aa = data2[pix];
        var bb = 0;
        if (aa > value) {
            bb = 255;
        }
        data[pix] = data[pix1] = data[pix2] = bb;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}

function mat2imgshow(__imgMat, canvas, ctx) {
    var width = __imgMat.col,
        height = __imgMat.row;
    canvas.width = width;
    canvas.height = height;
    var imageData = ctx.createImageData(width, height);
    imageData.data.set(__imgMat.data);
    ctx.putImageData(imageData, 0, 0);
}

function get_zft_data256(__src) {
    var res = {
        data1: null,
        data2: null
    };
    if (__src.type) {
        var gray_data = Array(256);
        var i = 0;
        for (i = 0; i < 256; i++)
            gray_data[i] = 0;
        var row = __src.row,
            col = __src.col;
        var data2 = __src.data;
        var pix = __src.row * __src.col * 4;

        while (pix) {
            pix -= 4;
            var aa = data2[pix];
            gray_data[aa] ++;
        }
    }

    var tmpdata = new Array(256);
    var i = 0;
    for (i = 0; i < 256; i++) {
        tmpdata[i] = i;
    }
    res.data1 = tmpdata;
    res.data2 = gray_data;
    return res;
}

function TraceEdge ( y, x, nThrLow, pResult, pMag, sz) {
    var xNum = [1,1,0,-1,-1,-1,0,1];  
    var yNum = [0,1,1,1,0,-1,-1,-1];  
    var yy,xx,k;  
    for(k=0;k<8;k++)  
    {  
        yy = y+yNum[k];  
        xx = x+xNum[k];  
        if(pResult[yy*sz.cx+xx]==128 && pMag[yy*sz.cx+xx]>=nThrLow )  
        {  
            //该点设为边界点  
            pResult[yy*sz.cx+xx] = 255;  
            //以该点为中心再进行跟踪  
            TraceEdge(yy,xx,nThrLow,pResult,pMag,sz);  
        }  
    }  
}
function canny_edge(__src,high,low){
    //高斯平滑一下
    __src=color2gray(init_matrix,256);
    //code from http://blog.csdn.net/likezhaobin/article/details/6892629
      var nSigma = 0.4,                            //定义高斯函数的标准差  
          nWidowSize = 1+2*Math.ceil(3*nSigma),         //定义滤波窗口的大小  
          nCenter = parseInt(nWidowSize/2),                //定义滤波窗口中心的索引  
          nWidth = __src.col,                             //获取图像的像素宽度  
          nHeight = __src.row,                           //获取图像的像素高度  
          nImageData = [],   //暂时保存图像中的数据  
          pCanny = [],        //为平滑后的图像数据分配内存  
          nData = [],          //两次平滑的中间数据  
          j = 0,
          i = 0;
    for(i=0;i<__src.row;i++){
        for(j=0;j<__src.col;j++){
            var r=convertCoordinates(j,i,nWidth) << 2;
            nImageData[i*nWidth+j]=__src.data[r];
        }
    }    
      var pdKernal_1 = [];    //定义一维高斯核数组  
      var dSum_1 = 0.0;                           //求和，用于进行归一化   
      var nDis;
      for(i=0; i<nWidowSize; i++)  
      {  
          nDis = i-nCenter;  
          pdKernal_1[i] = Math.exp(-(0.5)*nDis*nDis/(nSigma*nSigma))/(Math.sqrt(2*3.14159)*nSigma);  
          dSum_1 += pdKernal_1[i];  
      }  
      for(i=0; i<nWidowSize; i++)  
      {  
          pdKernal_1[i] /= dSum_1;                 //进行归一化  
      }
      var dSum, dFilter, nLimit;
      var nData = [];
      for(i=0; i<nHeight; i++)                               //进行x向的高斯滤波(加权平均)  
      {  
          for(j=0; j<nWidth; j++)  
          {  
              dSum = 0;  
              dFilter=0;                                       //滤波中间值  
              for(nLimit=Math.floor(-nCenter); nLimit<=nCenter; nLimit++)  
              {  
                  if((j+nLimit)>=0 && (j+nLimit) < nWidth )       //图像不能超出边界  
                  {

                      dFilter += nImageData[i*nWidth+j+nLimit] * pdKernal_1[nCenter+nLimit]; 
                      dSum += pdKernal_1[nCenter+nLimit];  
                  }  
              }  
              nData[i*nWidth+j] = dFilter/dSum;  
          }  
      }  

      for(i=0; i<nWidth; i++)                                //进行y向的高斯滤波(加权平均)  
      {  
          for(j=0; j<nHeight; j++)  
          {  
              dSum = 0.0;  
              dFilter=0;  
              for(nLimit=(-nCenter); nLimit<=nCenter; nLimit++)  
              {  
                  if((j+nLimit)>=0 && (j+nLimit) < nHeight)       //图像不能超出边界  
                  {  
                      dFilter += nData[(j+nLimit)*nWidth+i] * pdKernal_1[nCenter+nLimit];  
                      dSum += pdKernal_1[nCenter+nLimit];  
                  }  
              }  
              pCanny[j*nWidth+i] = parseInt(dFilter/dSum);  
          }  
      }  
      var P = [],                 //x向偏导数  
          Q = [],                 //y向偏导数  
          M = [],                       //梯度幅值  
          Theta = [];  
      for(i=0; i<nHeight-1; i++)  
      {  
              for(j=0; j<nWidth-1; j++)  
              {  
                    P[i*nWidth+j] = (pCanny[i*nWidth + Math.min(j+1, nWidth-1)] - pCanny[i*nWidth+j] + pCanny[Math.min(i+1, nHeight-1)*nWidth+Math.min(j+1, nWidth-1)] - pCanny[Math.min(i+1, nHeight-1)*nWidth+j])/2;  
                    Q[i*nWidth+j] = (pCanny[i*nWidth+j] - pCanny[Math.min(i+1, nHeight-1)*nWidth+j] + pCanny[i*nWidth+Math.min(j+1, nWidth-1)] - pCanny[Math.min(i+1, nHeight-1)*nWidth+Math.min(j+1, nWidth-1)])/2;  
          }  
      }
      //计算梯度幅值和梯度的方向  
      for(i=0; i<nHeight; i++)  
      {  
              for(j=0; j<nWidth; j++)  
              {  
                    M[i*nWidth+j] = parseInt(Math.sqrt(P[i*nWidth+j]*P[i*nWidth+j] + Q[i*nWidth+j]*Q[i*nWidth+j])+0.5);  
                    Theta[i*nWidth+j] = Math.atan2(Q[i*nWidth+j], P[i*nWidth+j]) * 57.3;  
                    if(Theta[i*nWidth+j] < 0)  
                          Theta[i*nWidth+j] += 360;              //将这个角度转换到0~360范围  
          }  
      }

      var N = [],  //非极大值抑制结果  
          g1=0, g2=0, g3=0, g4=0;                            //用于进行插值，得到亚像素点坐标值  
      var dTmp1=0.0, dTmp2=0.0;                           //保存两个亚像素点插值得到的灰度数据  
      var dWeight=0.0;    
      for(i=0; i<nWidth; i++)  
      {  
              N[i] = 0;  
              N[(nHeight-1)*nWidth+i] = 0;  
      }  
      for(j=0; j<nHeight; j++)  
      {  
              N[j*nWidth] = 0;  
              N[j*nWidth+(nWidth-1)] = 0;  
      } 
      var nPointIdx = 0;
      for(i=1; i<nWidth-1; i++)  
      {
        for(j=1; j<nHeight-1; j++)  
        {  
          nPointIdx = i+j*nWidth;       //当前点在图像数组中的索引值  
          if(M[nPointIdx] == 0)  {N[nPointIdx] = 0;}         //如果当前梯度幅值为0，则不是局部最大对该点赋为0  
          else {  
            if(((Theta[nPointIdx]>=90)&&(Theta[nPointIdx]<135)) || ((Theta[nPointIdx]>=270)&&(Theta[nPointIdx]<315)))  
            {  
                //////根据斜率和四个中间值进行插值求解  
                g1 = M[nPointIdx-nWidth-1];  
                g2 = M[nPointIdx-nWidth];  
                g3 = M[nPointIdx+nWidth];  
                g4 = M[nPointIdx+nWidth+1];  
                dWeight = Math.abs(P[nPointIdx])/Math.abs(Q[nPointIdx]);   //反正切  
                dTmp1 = g1*dWeight+g2*(1-dWeight);  
                dTmp2 = g4*dWeight+g3*(1-dWeight);  
            } else if(((Theta[nPointIdx]>=135)&&(Theta[nPointIdx]<180)) || ((Theta[nPointIdx]>=315)&&(Theta[nPointIdx]<360)))  
            {  
                g1 = M[nPointIdx-nWidth-1];  
                g2 = M[nPointIdx-1];  
                g3 = M[nPointIdx+1];  
                g4 = M[nPointIdx+nWidth+1];  
                dWeight = Math.abs(Q[nPointIdx])/Math.abs(P[nPointIdx]);   //正切  
                dTmp1 = g2*dWeight+g1*(1-dWeight);  
                dTmp2 = g4*dWeight+g3*(1-dWeight);  
            } else if(((Theta[nPointIdx]>=45)&&(Theta[nPointIdx]<90)) || ((Theta[nPointIdx]>=225)&&(Theta[nPointIdx]<270)))  
            {  
                g1 = M[nPointIdx-nWidth];  
                g2 = M[nPointIdx-nWidth+1];  
                g3 = M[nPointIdx+nWidth];  
                g4 = M[nPointIdx+nWidth-1];  
                dWeight = Math.abs(P[nPointIdx])/Math.abs(Q[nPointIdx]);   //反正切  
                dTmp1 = g2*dWeight+g1*(1-dWeight);  
                dTmp2 = g3*dWeight+g4*(1-dWeight);  
            } else if(((Theta[nPointIdx]>=0)&&(Theta[nPointIdx]<45)) || ((Theta[nPointIdx]>=180)&&(Theta[nPointIdx]<225)))  
            {  
                g1 = M[nPointIdx-nWidth+1];  
                g2 = M[nPointIdx+1];  
                g3 = M[nPointIdx+nWidth-1];  
                g4 = M[nPointIdx-1];  
                dWeight = Math.abs(Q[nPointIdx])/Math.abs(P[nPointIdx]);   //正切  
                dTmp1 = g1*dWeight+g2*(1-dWeight);  
                dTmp2 = g3*dWeight+g4*(1-dWeight);  
            }  
          }
          if((M[nPointIdx]>=dTmp1) && (M[nPointIdx]>=dTmp2)) {
              N[nPointIdx] = 128;             
          } else  {
              N[nPointIdx] = 0;  
          }  
        }                
      }
      var nHist = [],   
          nEdgeNum = 0,             //可能边界数  
          nMaxMag = 0,          //最大梯度数  
          nHighCount; 
      for(i=0;i<1024;i++) {
        nHist[i] = 0;  
      }
      for(i=0; i<nHeight; i++)  
      {  
        for(j=0; j<nWidth; j++)  
        {  
          if(N[i*nWidth+j]==128) { 
            nHist[M[i*nWidth+j]]++;
          }
        }  
      }  
      var nEdgeNum = nHist[0];  
      var nMaxMag = 0;                    //获取最大的梯度值        
      for(i=1; i<1024; i++)           //统计经过“非最大值抑制”后有多少像素  
      {  
          if(nHist[i] != 0)       //梯度为0的点是不可能为边界点的  
          {  
              nMaxMag = i;  
          }     
          nEdgeNum += nHist[i];   //经过non-maximum suppression后有多少像素  
      } 
      var dRatHigh = high, 
          dThrHigh, dThrLow, dRatLow = low;
      nHighCount = parseInt(dRatHigh * nEdgeNum + 0.5);  
      j=1;  
      nEdgeNum = nHist[1];  
      while((j<(nMaxMag-1)) && (nEdgeNum < nHighCount))  
      {  
             j++;  
             nEdgeNum += nHist[j];  
      }  
      dThrHigh = j;                                   //高阈值  
      dThrLow = parseInt((dThrHigh) * dRatLow + 0.5);    //低阈值  
          
      var sz = {};
      sz.cx = nWidth;  
      sz.cy = nHeight;  
      for(i=0; i<nHeight; i++)  
      {  
          for(j=0; j<nWidth; j++)  
          {  
              if((N[i*nWidth+j]==128) && (M[i*nWidth+j] >= dThrHigh))  
              {  
                  N[i*nWidth+j] = 255;  
                  TraceEdge(i, j, dThrLow, N, M, sz);  
              }  
          }  
      }
      
      for(i=0; i<nHeight; i++)  
      {  
          for(j=0; j<nWidth; j++)  
          {  
              if(N[i*nWidth+j] != 255)  
              {  
                  N[i*nWidth+j]  = 0 ;   // 设置为非边界点  
              }  
          }  
      }  

      var dst = new Mat(nHeight,nWidth);
      var d = dst.data,
          w = __src.col,
          h = __src.row,
          l = w * h;
      for (i = 0; i < l; i++) {
        dst.data[i * 4] = N[i];
        dst.data[i * 4 + 1] = N[i];
        dst.data[i * 4 + 2] = N[i];
        dst.data[i * 4 + 3] =255;
      }
      return dst;
}

function gray2line_change(gray_matrix, aa, bb) {
    if (gray_matrix == null)
        gray_matrix = color2gray(gray_matrix, 256);
    var row = gray_matrix.row,
        col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
        data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var X = data2[pix];
        var Y = aa * X + bb;
        Y = check(Y);
        data[pix] = data[pix1] = data[pix2] = Y;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}

function noline_change1(gray_matrix, vv) {
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);
    var row = gray_matrix.row,
        col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
        data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var X = data2[pix];
        var Y = 0;
        if (vv == 1)
            Y = X + 0.8 * X * (255 - X) / 255;
        else if (vv == 2)
            Y = X * X / 255;
        Y = check(Y);
        data[pix] = data[pix1] = data[pix2] = Y;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}

function check(x) {
    if (x > 255)
        return 255;
    else if (x < 0)
        return 0;
    else
        return x;
}

function get_zft_data2(__src) {
    var res = {
        data1: null,
        data2: null
    };
    if (__src.type && __src.type === "CV_RGBA") {
        var row = __src.row,
            col = __src.col;
        var data2 = __src.data;
        var pix1, pix2, pix = __src.row * __src.col * 4;
    } else if (__src.type && __src.type === "CV_GRAY") {
        var gray_data = Array(256);
        var i = 0;
        for (i = 0; i < 256; i++)
            gray_data[i] = 0;
        var row = __src.row,
            col = __src.col;
        var data2 = __src.data;
        var pix = __src.row * __src.col * 4;

        while (pix) {
            pix -= 4;
            var aa = data2[pix];
            gray_data[aa] ++;
        }
    }

    var tmpdata1 = new Array();
    var tmpdata2 = new Array();
    var i = 0;
    for (i = 0; i < 256; i++) {
        if (gray_data[i] > 0) {
            tmpdata1.push(i);
            tmpdata2.push(gray_data[i]);
        }
    }
    res.data1 = tmpdata1;
    res.data2 = tmpdata2;
    return res;
}


function sczft(data1, data2) {
    require.config({
        paths: {
            echarts: 'js'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/bar',
            'echarts/chart/line'
        ],
        function(ec) {
            //--- 折柱 ---
            var myChart = ec.init(document.getElementById('zhifangtu'));
            myChart.setOption({
                title: {
                    text: '变换后直方图',
                    subtext: '图片'

                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['像素个数']
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: data1,
                    axisLabel: {
                        show: true,
                        rotate: 45,
                        interval: 'auto', // {number}
                        textStyle: {
                            color: 'white',
                            fontFamily: 'sans-serif',
                            fontSize: 10
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        show: true,
                        interval: 'auto', // {number}
                        textStyle: {
                            color: 'white',
                            fontFamily: 'sans-serif',
                            fontSize: 10
                        }
                    }
                }],
                series: [{
                    name: '像素个数',
                    type: 'bar',
                    data: data2,
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: '平均值'
                        }]
                    }
                }]
            });
        }
    );
}


function applyMatrix(__src, matrix) {
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var row = __src.row,
        col = __src.col;
    var bufferedData=__src.data;
    var dst = new Mat(row,col);
    var matrixSize = Math.sqrt(matrix.length);
    var by=Math.floor(matrixSize/2);
    for (var i = by; i < col - by; i++) {
        for (var j = by; j < row - by; j++) {

            // temporary holders for matrix results
            var sumR = sumG = sumB = 0;

            // loop through the matrix itself
            for (var h = 0; h < matrixSize; h++) {
                for (var w = 0; w < matrixSize; w++) {

                    // get a refence to a pixel position in the matrix
                    var r = convertCoordinates(i + h - by, j + w - by, col) << 2;

                    // find RGB values for that pixel
                    var currentPixel = {
                        r: bufferedData[r],
                        g: bufferedData[r + 1],
                        b: bufferedData[r + 2]
                    };

                    // apply the value from the current matrix position
                    sumR += currentPixel.r * matrix[w + h * matrixSize];
                    sumG += currentPixel.g * matrix[w + h * matrixSize];
                    sumB += currentPixel.b * matrix[w + h * matrixSize];
                }
            }

            // get a reference for the final pixel
            var ref = convertCoordinates(i, j, col) << 2;

            dst.data[ref]=sumR;
            dst.data[ref+1]=sumG;
            dst.data[ref+2]=sumB;
            dst.data[ref+3]=255;
        }
    }
    return dst;
}


function convertCoordinates(x, y, w) {
    return x + (y * w);
}


//灰度矩阵转数组
function mat2array(__src) {
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var res = {
        data: null,
        width: 0,
        height: 0,
        type: 2
    };

    res.height = __src.row;
    res.width = __src.col;
    res.data = [];
    var data2 = __src.data;
    var count = __src.row * __src.col * 4;
    var pix = 0;

    while (pix < count) {
        var aa = data2[pix];
        res.data.push(aa);
        pix += 4;
    }
    return res;
}


function mat2flyarray(__src) {
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var width = __src.col;
    var height = __src.row;
    var r = 1;
    var i = 1;
    while (i * 2 < width) {
        i *= 2;
        r++;
    }
    var width2 = 1 << r;
    var r = 1;
    var i = 1;
    while (i * 2 < height) {
        i *= 2;
        r++;
    }
    var data2 = __src.data;
    var height2 = 1 << r;
    var dataArrayTemp = [];
    for (var i = 0; i < height2; i++) {
        for (var j = 0; j < width2; j++) {
            if (i >= height || j >= width) {
                dataArrayTemp.push(0);
            } else {
                dataArrayTemp.push(data2[i * width + j]);
            }
        }
    }
    return dataArrayTemp;
}

function array2mat(arraydata, width, height) {
    var tempMat = new Mat(height, width, imageData.data);
    var tmpdata = new ArrayBuffer(width * height * 4);

    for (var i = 0; i < arraydata.data.length; i++) {
        tmpdata[i * 4 + 0] = arraydata[i];
        tmpdata[i * 4 + 1] = arraydata[i];
        tmpdata[i * 4 + 2] = arraydata[i];
        tmpdata[i * 4 + 3] = 255;
    }

    var data = new Uint8ClampedArray(buffer);

    tempMat.data = data;
    tempMat.type = "CV_GRAY";
    return tempMat;
}

function sct() {
    var h_hats = [];
    FFT(h_hats, gray_array);
    h_hats = shiftFFT(h_hats);
    var maxMagnitude = 0;
    for (var ai = 0; ai < h_hats.length; ai++) {
        var mag = h_hats[ai].magnitude();
        if (mag > maxMagnitude) {
            maxMagnitude = mag;
        }
    }

    var lpr = parseInt($s('#low-freq-radius').value); //low pass radius
    var hpr = parseInt($s('#high-freq-radius').value); //high " "
    var N = dims[1],
        M = dims[0];
    for (var k = 0; k < N; k++) {
        for (var l = 0; l < M; l++) {
            var idx = k * M + l;
            var dist = Math.pow(k - M / 2, 2) + Math.pow(l - N / 2, 2);
            if (dist > lpr * lpr && isNaN(hpr) ||
                dist < hpr * hpr && isNaN(lpr) ||
                dist < lpr * lpr && !isNaN(lpr) && !isNaN(hpr) ||
                dist > hpr * hpr && !isNaN(lpr) && !isNaN(hpr)) {
                h_hats[idx] = new Complex(0, 0);
            }
        }
    }
    var $h = function(k, l) {
        if (arguments.length === 0) return h_hats;

        var idx = k * dims[0] + l;
        return h_hats[idx];
    };

}

function sharpen_sobel(__src){
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var row = __src.row,
        col = __src.col;
    var dst=new Mat(row,col);
    var matrix1=new Array(-1,0,1,-2,0,2,-1,0,1);
    var matrix2=new Array(-1,-2,-1,0,0,0,1,2,1);
    var tmp1 = applyMatrix(init_matrix,matrix1);
    var tmp2 = applyMatrix(init_matrix,matrix2);

    for (var i = 1; i < col - 1; i++) {
        for (var j = 1; j < row - 1; j++) {
            var r = convertCoordinates(i, j, col) << 2;
            dst.data[r]=Math.sqrt(tmp1.data[r]*tmp1.data[r]+tmp2.data[r]*tmp2.data[r]);
            dst.data[r+1]=Math.sqrt(tmp1.data[r+1]*tmp1.data[r+1]+tmp2.data[r+1]*tmp2.data[r+1]);
            dst.data[r+2]=Math.sqrt(tmp1.data[r+2]*tmp1.data[r+2]+tmp2.data[r+2]*tmp2.data[r+2]);
            dst.data[r+3]=255;
        }
    }
    return dst;
}

function sharpen_roberts(__src){
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var row = __src.row,
        col = __src.col;
    var bufferedData=__src.data;
    var dst = new Mat(row, col);
    for (var i = 1; i < col - 1; i++) {
        for (var j = 1; j < row - 1; j++) {

            // temporary holders for matrix results
            var sumR = sumG = sumB = 0;


            var r = convertCoordinates(i, j, col) << 2;
            var r_right=convertCoordinates(i+1, j, col) << 2;
            var r_down=convertCoordinates(i, j+1, col) << 2;
            var r_down_right=convertCoordinates(i+1, j+1, col) << 2;



                    // find RGB values for that pixel
                    var currentPixel = {
                        r: bufferedData[r],
                        g: bufferedData[r + 1],
                        b: bufferedData[r + 2]
                    };

                    var currentPixel_right = {
                        r: bufferedData[r_right],
                        g: bufferedData[r_right + 1],
                        b: bufferedData[r_right + 2]
                    };

                    var currentPixel_down = {
                        r: bufferedData[r_down],
                        g: bufferedData[r_down + 1],
                        b: bufferedData[r_down + 2]
                    };

                    var currentPixel_down_right = {
                        r: bufferedData[r_down_right],
                        g: bufferedData[r_down_right + 1],
                        b: bufferedData[r_down_right + 2]
                    };

                    var tmp1=pixel_minus(currentPixel,currentPixel_down_right);
                    var tmp2=pixel_minus(currentPixel_right,currentPixel_down);

           
            dst.data[r]=tmp1[0]+tmp2[0];
            dst.data[r+1]=tmp1[1]+tmp2[1];
            dst.data[r+2]=tmp1[2]+tmp2[2];
            dst.data[r+3]=255;

        }
    }
    return dst;
}

function pixel_add(a,b){
    var res=new Array(4);
    res[0]=a.r+b.r;
    res[1]=a.g+b.g;
    res[2]=a.b+b.b;
    res[3]=255;
    return res;
}

function pixel_minus(a,b){
    var res=new Array(4);
    res[0]=Math.abs(a.r-b.r);
    res[1]=Math.abs(a.g-b.g);
    res[2]=Math.abs(a.b-b.b);
    res[3]=255;
    return res;
}


function junzhi_blur(__src, __size1, __size2, __borderType) {
    if (__src.type) {
        var height = __src.row,
            width = __src.col,
            dst = new Mat(height, width),
            dstData = dst.data;
        var size1 = __size1 || 3,
            size2 = __size2 || size1,
            size = size1 * size2;
        if (size1 % 2 !== 1 || size2 % 2 !== 1) {
            console.error("size大小必须是奇数");
            return __src;
        }
        var startX = Math.floor(size1 / 2),
            startY = Math.floor(size2 / 2);
        var withBorderMat = copyMakeBorder(__src, startY, startX, 0, 0, __borderType),
            mData = withBorderMat.data,
            mWidth = withBorderMat.col;

        var newValue, nowX, offsetY, offsetI;
        var i, j, c, y, x;

        for (i = height; i--;) {
            offsetI = i * width;
            for (j = width; j--;) {
                for (c = 3; c--;) {
                    newValue = 0;
                    for (y = size2; y--;) {
                        offsetY = (y + i) * mWidth * 4;
                        for (x = size1; x--;) {
                            nowX = (x + j) * 4 + c;
                            newValue += mData[offsetY + nowX];
                        }
                    }
                    dstData[(j + offsetI) * 4 + c] = newValue / size;
                }
                dstData[(j + offsetI) * 4 + 3] = mData[offsetY + startY * mWidth * 4 + (j + startX) * 4 + 3];
            }
        }

    } else {
        console.error("不支持类型。");
    }
    return dst;
}


function copyMakeBorder(__src, __top, __left, __bottom, __right, __borderType, __value) {

    if (__borderType === CV_BORDER_CONSTANT) {
        return copyMakeConstBorder_8U(__src, __top, __left, __bottom, __right, __value);
    } else {
        return copyMakeBorder_8U(__src, __top, __left, __bottom, __right, __borderType);
    }
};

function copyMakeBorder(__src, __top, __left, __bottom, __right, __borderType, __value) {
    if (__src.type != "CV_RGBA") {
        console.error("不支持类型！");
    }
    if (__borderType === CV_BORDER_CONSTANT) {
        return copyMakeConstBorder_8U(__src, __top, __left, __bottom, __right, __value);
    } else {
        return copyMakeBorder_8U(__src, __top, __left, __bottom, __right, __borderType);
    }
};


function borderInterpolate(__p, __len, __borderType) {
    if (__p < 0 || __p >= __len) {
        switch (__borderType) {
            case CV_BORDER_REPLICATE:
                __p = __p < 0 ? 0 : __len - 1;
                break;
            case CV_BORDER_REFLECT:
            case CV_BORDER_REFLECT_101:
                var delta = __borderType == CV_BORDER_REFLECT_101;
                if (__len == 1)
                    return 0;
                do {
                    if (__p < 0)
                        __p = -__p - 1 + delta;
                    else
                        __p = __len - 1 - (__p - __len) - delta;
                } while (__p < 0 || __p >= __len)
                break;
            case CV_BORDER_WRAP:
                if (__p < 0)
                    __p -= (((__p - __len + 1) / __len) | 0) * __len;
                if (__p >= __len)
                    __p %= __len;
                break;
            case CV_BORDER_CONSTANT:
                __p = -1;
            default:
                error(arguments.callee, UNSPPORT_BORDER_TYPE /* {line} */ );
        }
    }
    return __p;
};

function copyMakeBorder_8U(__src, __top, __left, __bottom, __right, __borderType) {
    var i, j;
    var width = __src.col,
        height = __src.row;
    var top = __top,
        left = __left || __top,
        right = __right || left,
        bottom = __bottom || top,
        dstWidth = width + left + right,
        dstHeight = height + top + bottom,
        borderType = borderType || CV_BORDER_REFLECT;
    var buffer = new ArrayBuffer(dstHeight * dstWidth * 4),
        tab = new Uint32Array(left + right);

    for (i = 0; i < left; i++) {
        tab[i] = borderInterpolate(i - left, width, __borderType);
    }
    for (i = 0; i < right; i++) {
        tab[i + left] = borderInterpolate(width + i, width, __borderType);
    }

    var tempArray, data;

    for (i = 0; i < height; i++) {
        tempArray = new Uint32Array(buffer, (i + top) * dstWidth * 4, dstWidth);
        data = new Uint32Array(__src.buffer, i * width * 4, width);
        for (j = 0; j < left; j++)
            tempArray[j] = data[tab[j]];
        for (j = 0; j < right; j++)
            tempArray[j + width + left] = data[tab[j + left]];
        tempArray.set(data, left);
    }

    var allArray = new Uint32Array(buffer);
    for (i = 0; i < top; i++) {
        j = borderInterpolate(i - top, height, __borderType);
        tempArray = new Uint32Array(buffer, i * dstWidth * 4, dstWidth);
        tempArray.set(allArray.subarray((j + top) * dstWidth, (j + top + 1) * dstWidth));
    }
    for (i = 0; i < bottom; i++) {
        j = borderInterpolate(i + height, height, __borderType);
        tempArray = new Uint32Array(buffer, (i + top + height) * dstWidth * 4, dstWidth);
        tempArray.set(allArray.subarray((j + top) * dstWidth, (j + top + 1) * dstWidth));
    }

    return new Mat(dstHeight, dstWidth, new Uint8ClampedArray(buffer));
}

function copyMakeConstBorder_8U(__src, __top, __left, __bottom, __right, __value) {
    var i, j;
    var width = __src.col,
        height = __src.row;
    var top = __top,
        left = __left || __top,
        right = __right || left,
        bottom = __bottom || top,
        dstWidth = width + left + right,
        dstHeight = height + top + bottom,
        value = __value || [0, 0, 0, 255];
    var constBuf = new ArrayBuffer(dstWidth * 4),
        constArray = new Uint8ClampedArray(constBuf);
    buffer = new ArrayBuffer(dstHeight * dstWidth * 4);

    for (i = 0; i < dstWidth; i++) {
        for (j = 0; j < 4; j++) {
            constArray[i * 4 + j] = value[j];
        }
    }

    constArray = new Uint32Array(constBuf);
    var tempArray;

    for (i = 0; i < height; i++) {
        tempArray = new Uint32Array(buffer, (i + top) * dstWidth * 4, left);
        tempArray.set(constArray.subarray(0, left));
        tempArray = new Uint32Array(buffer, ((i + top + 1) * dstWidth - right) * 4, right);
        tempArray.set(constArray.subarray(0, right));
        tempArray = new Uint32Array(buffer, ((i + top) * dstWidth + left) * 4, width);
        tempArray.set(new Uint32Array(__src.buffer, i * width * 4, width));
    }

    for (i = 0; i < top; i++) {
        tempArray = new Uint32Array(buffer, i * dstWidth * 4, dstWidth);
        tempArray.set(constArray);
    }

    for (i = 0; i < bottom; i++) {
        tempArray = new Uint32Array(buffer, (i + top + height) * dstWidth * 4, dstWidth);
        tempArray.set(constArray);
    }

    return new Mat(dstHeight, dstWidth, new Uint8ClampedArray(buffer));
}


//高斯内核
function getGaussianKernel(__n, __sigma) {
    var SMALL_GAUSSIAN_SIZE = 7,
        smallGaussianTab = [
            [1],
            [0.25, 0.5, 0.25],
            [0.0625, 0.25, 0.375, 0.25, 0.0625],
            [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125]
        ];

    var fixedKernel = __n & 2 == 1 && __n <= SMALL_GAUSSIAN_SIZE && __sigma <= 0 ? smallGaussianTab[__n >> 1] : 0;

    var sigmaX = __sigma > 0 ? __sigma : ((__n - 1) * 0.5 - 1) * 0.3 + 0.8,
        scale2X = -0.5 / (sigmaX * sigmaX),
        sum = 0;

    var i, x, t, kernel = [];

    for (i = 0; i < __n; i++) {
        x = i - (__n - 1) * 0.5;
        t = fixedKernel ? fixedKernel[i] : Math.exp(scale2X * x * x);
        kernel[i] = t;
        sum += t;
    }

    sum = 1 / sum;

    for (i = __n; i--;) {
        kernel[i] *= sum;
    }

    return kernel;
};

//高斯平滑

function GaussianBlur(__src, __size1, __size2, __sigma1, __sigma2, __borderType, __dst) {
    if (__src.type && __src.type == "CV_RGBA") {
        var height = __src.row,
            width = __src.col,
            dst = __dst || new Mat(height, width),
            dstData = dst.data;
        var sigma1 = __sigma1 || 0,
            sigma2 = __sigma2 || __sigma1;
        var size1 = __size1 || Math.round(sigma1 * 6 + 1) | 1,
            size2 = __size2 || Math.round(sigma2 * 6 + 1) | 1,
            size = size1 * size2;
        if (size1 % 2 !== 1 || size2 % 2 !== 1) {
            console.error("size必须是奇数。");
            return __src;
        }
        var startX = Math.floor(size1 / 2),
            startY = Math.floor(size2 / 2);
        var withBorderMat = copyMakeBorder(__src, startY, startX, 0, 0, __borderType),
            mData = withBorderMat.data,
            mWidth = withBorderMat.col;

        var kernel1 = getGaussianKernel(size1, sigma1),
            kernel2,
            kernel = new Array(size1 * size2);

        if (size1 === size2 && sigma1 === sigma2)
            kernel2 = kernel1;
        else
            kernel2 = getGaussianKernel(size2, sigma2);

        var i, j, c, y, x;

        for (i = kernel2.length; i--;) {
            for (j = kernel1.length; j--;) {
                kernel[i * size1 + j] = kernel2[i] * kernel1[j];
            }
        }

        var newValue, nowX, offsetY, offsetI;

        for (i = height; i--;) {
            offsetI = i * width;
            for (j = width; j--;) {
                for (c = 3; c--;) {
                    newValue = 0;
                    for (y = size2; y--;) {
                        offsetY = (y + i) * mWidth * 4;
                        for (x = size1; x--;) {
                            nowX = (x + j) * 4 + c;
                            newValue += (mData[offsetY + nowX] * kernel[y * size1 + x]);
                        }
                    }
                    dstData[(j + offsetI) * 4 + c] = newValue;
                }
                dstData[(j + offsetI) * 4 + 3] = mData[offsetY + startY * mWidth * 4 + (j + startX) * 4 + 3];
            }
        }

    } else {
        console.error("不支持的类型");
    }
    return dst;
}


//中值平滑

function medianBlur(__src, __size1, __size2, __borderType, __dst) {
    if (__src.type && __src.type == "CV_RGBA") {
        var height = __src.row,
            width = __src.col,
            dst = __dst || new Mat(height, width),
            dstData = dst.data;
        var size1 = __size1 || 3,
            size2 = __size2 || size1,
            size = size1 * size2;
        if (size1 % 2 !== 1 || size2 % 2 !== 1) {
            console.error("size必须是奇数");
            return __src;
        }
        var startX = Math.floor(size1 / 2),
            startY = Math.floor(size2 / 2);
        var withBorderMat = copyMakeBorder(__src, startY, startX, 0, 0, __borderType),
            mData = withBorderMat.data,
            mWidth = withBorderMat.col;

        var newValue = [],
            nowX, offsetY, offsetI;
        var i, j, c, y, x;

        for (i = height; i--;) {
            offsetI = i * width;
            for (j = width; j--;) {
                for (c = 3; c--;) {
                    for (y = size2; y--;) {
                        offsetY = (y + i) * mWidth * 4;
                        for (x = size1; x--;) {
                            nowX = (x + j) * 4 + c;
                            newValue[y * size1 + x] = mData[offsetY + nowX];
                        }
                    }
                    newValue.sort(function(a, b) {
                        return a - b;
                    });
                    dstData[(j + offsetI) * 4 + c] = newValue[Math.round(size / 2)];
                }
                dstData[(j + offsetI) * 4 + 3] = mData[offsetY + startY * mWidth * 4 + (j + startX) * 4 + 3];
            }
        }
    } else {
        console.error("类型不支持");
    }
    return dst;
};

function init_img_show(img_src){
     var img = new Image();
        img.onload = function () {
            imgCanvas.height = img.height;
            imgCanvas.width = img.width;
            dims[0] = img.width;
            dims[1] = img.height;
            imgCtx.drawImage(img, 0, 0);
            var imgdata = imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
            var data = imgdata.data;
            imgCtx.putImageData(imgdata, 0, 0);
            get_img_mat(img_src);
        };
        img.src = img_src;
        init_img_src = img_src;
}