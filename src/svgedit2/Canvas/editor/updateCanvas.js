import config from './config';

// code derived from svg-editor.js
const updateCanvas = (svgCanvas, center, event, newCtr = {}) => {
  // workarea node is the parent of the svg canvas
  const cnvs = document.getElementById('svgcanvas');
  const workarea = cnvs.parentNode;
  //  let w = workarea.width(), h = workarea.height();
  let w = parseFloat(getComputedStyle(workarea, null).width.replace('px', ''));
  let h = parseFloat(getComputedStyle(workarea, null).height.replace('px', ''));
  const wOrig = w;
  const hOrig = h;
  const oldCtr = {
    x: workarea.scrollLeft + wOrig / 2,
    y: workarea.scrollTop + hOrig / 2,
  };
  const multi = config.canvas_expansion;
  const zoom = svgCanvas.getZoom();
  w = Math.max(wOrig, svgCanvas.contentW * zoom * multi);
  h = Math.max(hOrig, svgCanvas.contentH * zoom * multi);

  if (w === wOrig && h === hOrig) {
    workarea.style.overflow = 'hidden';
  } else {
    workarea.style.overflow = 'scroll';
  }

  const oldCanY =
    parseFloat(getComputedStyle(cnvs, null).height.replace('px', '')) / 2;
  const oldCanX =
    parseFloat(getComputedStyle(cnvs, null).width.replace('px', '')) / 2;

  cnvs.style.width = w + 'px';
  cnvs.style.height = h + 'px';
  const newCanY = h / 2;
  const newCanX = w / 2;
  const offset = svgCanvas.updateCanvas(w, h);

  const ratio = newCanX / oldCanX;

  const scrollX = w / 2 - wOrig / 2;
  const scrollY = h / 2 - hOrig / 2;

  if (!newCtr.x) {
    const oldDistX = oldCtr.x - oldCanX;
    const newX = newCanX + oldDistX * ratio;

    const oldDistY = oldCtr.y - oldCanY;
    const newY = newCanY + oldDistY * ratio;

    newCtr = {
      x: newX,
      y: newY,
    };
  } else {
    newCtr.x += offset.x;
    newCtr.y += offset.y;
  }

  let mouseX = 0,
    mouseY = 0;

  if (event) {
    // Позиция курсора относительно элемента
    mouseX = event.clientX;
    mouseY = event.clientY;

    console.log(mouseX, mouseY);
  }

  if (center) {
    // Go to top-left for larger documents
    if (svgCanvas.contentW > workarea.getBoundingClientRect().width) {
      //Top-left
      // workarea[0].scrollLeft = offset.x - 10
      // workarea[0].scrollTop = offset.y - 10
      workarea.scrollLeft = offset.x - 10;
      workarea.scrollTop = offset.y - 10;
    } else {
      // Center
      // wArea[0].scrollLeft = scrollX
      // wArea[0].scrollTop = scrollY
      workarea.scrollLeft = scrollX;
      workarea.scrollTop = scrollY;
    }
  } else {
    workarea.scrollLeft = newCtr.x - wOrig / 2;
    workarea.scrollTop = newCtr.y - hOrig / 2;
  }
};

export default updateCanvas;
