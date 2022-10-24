// scales the image by (float) scale < 1
// returns a canvas containing the scaled image.
const downScaleImage = (img, scale) => {
  const imgCV = document.createElement("canvas");
  imgCV.width = img.width;
  imgCV.height = img.height;
  var imgCtx = imgCV.getContext("2d");
  imgCtx.drawImage(img, 0, 0);
  return downScaleCanvas(imgCV, scale);
};

// scales the canvas by (float) scale < 1
// returns a new canvas containing the scaled image.
const downScaleCanvas = (cv, scale) => {
  if (!(scale < 1) || !(scale > 0)) throw "scale must be a positive number <1 ";
  scale = normaliseScale(scale);
  let sqScale = scale * scale; // square scale =  area of a source pixel within target
  let sw = cv.width; // source image width
  let sh = cv.height; // source image height
  let tw = Math.floor(sw * scale); // target image width
  let th = Math.floor(sh * scale); // target image height
  let sIndex = 0; // source x,y, index within source array
  let tx = 0;
  let ty = 0;
  let yIndex = 0;
  let tIndex = 0; // target x,y, x,y index within target array
  let tX = 0;
  let tY = 0; // rounded tx, ty
  let w = 0;
  let nw = 0;
  let wx = 0;
  let nwx = 0;
  let wy = 0;
  let nwy = 0; // weight / next weight x / y
  // weight is weight of current source point within target.
  // next weight is weight of current source point within next target's point.
  let crossX = false; // does scaled px cross its current px right border ?
  let crossY = false; // does scaled px cross its current px bottom border ?
  let sBuffer = cv.getContext("2d").getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
  let tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
  let sR = 0;
  let sG = 0;
  let sB = 0; // source's current point r,g,b

  for (let sy = 0; sy < sh; sy++) {
    ty = sy * scale; // y src position within target
    tY = 0 | ty; // rounded : target pixel's y
    yIndex = 3 * tY * tw; // line index within target array
    crossY = tY !== (0 | (ty + scale));
    if (crossY) {
      // if pixel is crossing botton target pixel
      wy = tY + 1 - ty; // weight of point within target pixel
      nwy = ty + scale - tY - 1; // ... within y+1 target pixel
    }
    for (let sx = 0; sx < sw; sx++, sIndex += 4) {
      tx = sx * scale; // x src position within target
      tX = 0 | tx; // rounded : target pixel's x
      tIndex = yIndex + tX * 3; // target pixel index within target array
      crossX = tX !== (0 | (tx + scale));
      if (crossX) {
        // if pixel is crossing target pixel's right
        wx = tX + 1 - tx; // weight of point within target pixel
        nwx = tx + scale - tX - 1; // ... within x+1 target pixel
      }
      sR = sBuffer[sIndex]; // retrieving r,g,b for curr src px.
      sG = sBuffer[sIndex + 1];
      sB = sBuffer[sIndex + 2];
      if (!crossX && !crossY) {
        // pixel does not cross
        // just add components weighted by squared scale.
        tBuffer[tIndex] += sR * sqScale;
        tBuffer[tIndex + 1] += sG * sqScale;
        tBuffer[tIndex + 2] += sB * sqScale;
      } else if (crossX && !crossY) {
        // cross on X only
        w = wx * scale;
        // add weighted component for current px
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // add weighted component for next (tX+1) px
        nw = nwx * scale;
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
      } else if (!crossX && crossY) {
        // cross on Y only
        w = wy * scale;
        // add weighted component for current px
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // add weighted component for next (tY+1) px
        nw = nwy * scale;
        tBuffer[tIndex + 3 * tw] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
      } else {
        // crosses both x and y : four target points involved
        // add weighted component for current px
        w = wx * wy;
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // for tX + 1; tY px
        nw = nwx * wy;
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
        // for tX ; tY + 1 px
        nw = wx * nwy;
        tBuffer[tIndex + 3 * tw] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
        // for tX + 1 ; tY +1 px
        nw = nwx * nwy;
        tBuffer[tIndex + 3 * tw + 3] += sR * nw;
        tBuffer[tIndex + 3 * tw + 4] += sG * nw;
        tBuffer[tIndex + 3 * tw + 5] += sB * nw;
      }
    } // end for sx
  } // end for sy

  // create result canvas
  let resCV = document.createElement("canvas");
  resCV.width = tw;
  resCV.height = th;
  let resCtx = resCV.getContext("2d");
  let imgRes = resCtx.getImageData(0, 0, tw, th);
  let tByteBuffer = imgRes.data;
  // convert float32 array into a UInt8Clamped Array
  let pxIndex = 0; //
  for (
    sIndex = 0, tIndex = 0;
    pxIndex < tw * th;
    sIndex += 3, tIndex += 4, pxIndex++
  ) {
    tByteBuffer[tIndex] = 0 | tBuffer[sIndex];
    tByteBuffer[tIndex + 1] = 0 | tBuffer[sIndex + 1];
    tByteBuffer[tIndex + 2] = 0 | tBuffer[sIndex + 2];
    tByteBuffer[tIndex + 3] = 255;
  }
  // writing result to canvas.
  resCtx.putImageData(imgRes, 0, 0);
  return resCV;
};

function log2(v) {
  // taken from http://graphics.stanford.edu/~seander/bithacks.html
  let b = [0x2, 0xc, 0xf0, 0xff00, 0xffff0000];
  let S = [1, 2, 4, 8, 16];
  let r = 0;
  for (let i = 4; i >= 0; i--) {
    if (v & b[i]) {
      v >>= S[i];
      r |= S[i];
    }
  }
  return r;
}

// normalize a scale <1 to avoid some rounding issue with js numbers
function normaliseScale(s) {
  if (s > 1) throw "s must be <1";
  s = 0 | (1 / s);
  let l = log2(s);
  let mask = 1 << l;
  let accuracy = 4;
  while (accuracy && l) {
    l--;
    mask |= 1 << l;
    accuracy--;
  }
  return 1 / (s & mask);
}

export { downScaleImage };
