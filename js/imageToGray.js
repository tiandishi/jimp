(function () {
    function imageToGray(iCanvas, url) {
        this.canvas = iCanvas;
        this.iCtx = this.canvas.getContext("2d");
        this.url = url;
    }

    imageToGray.prototype = {
        imread: function (_image) {
            var width = _image.width,
                height = _image.height;
            this.iResize(width, height);
            this.iCtx.drawImage(_image, 0, 0);
            var imageData = this.iCtx.getImageData(0, 0, width, height),
                tempMat = new Mat(height, width, imageData.data);
            imageData = null;
            this.iCtx.clearRect(0, 0, width, height);
            return tempMat;
        },
        iResize: function (_width, _height) {
            this.canvas.width = _width;
            this.canvas.height = _height;
        },
        RGBA2ImageData: function (_imgMat) {
            var width = _imgMat.col,
                height = _imgMat.row,
                imageData = this.iCtx.createImageData(width, height);
            imageData.data.set(_imgMat.data);
            return imageData;
        },
        render: function () {
            var img = new Image();
            var _this = this;
            img.onload = function () {
                var myMat = _this.imread(img);
                var newImage = cvtColor(myMat);
                var newIamgeData = _this.RGBA2ImageData(newImage);
                _this.iCtx.putImageData(newIamgeData, 0, 0);
            };
            img.src = this.url;
        }
    };

    function Mat(_row, _col, _data, _buffer){
        this.row = _row || 0;
        this.col = _col || 0;
        this.channel = 4;
        this.buffer = _buffer || new ArrayBuffer(_row * _col * 4);
        this.data = new Uint8ClampedArray(this.buffer);
        _data && this.data.set(_data);
        this.bytes = 1;
        this.type = "CV_RGBA";
    }

    function cvtColor(_src) {
        if (_src.type && _src.type === "CV_RGBA") {
            var row = _src.row,
                col = _src.col;
            var dst = new Mat(row, col);
            data = dst.data,
            data2 = _src.data;
            var pix1, pix2, pix = _src.row * _src.col * 4;
            while (pix) {
                data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) / 1000;
                data[pix + 3] = data2[pix + 3];
            }
        } else {
            return src;
        }
        return dst;
    }

    window.imageToGray = imageToGray;
})();