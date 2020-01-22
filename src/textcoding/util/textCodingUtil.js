'use strict';

function getMelodyCode(name, vol) {

    const melodyLibrary = EntryStatic.speakerMelody.data
    const melodyRaw = melodyLibrary[name].replace(/__melodyVolume/g, `${vol}`)
    const mainRegex = /(?<=while\s*\(\s*true\s*\)\s*\n*{\n*)[\n\t\s\w\d\;\=\*\+\-\/\_\.\,\(\)]*/g
    const tempoVariablesRegex = /[\n\t\s\w\d\;\=\*\/\_\.\,\(\)]*(?=while\s*\(\s*true\s*\)\s*\n*{\n*)/g
    const melodyMain = melodyRaw.match(mainRegex)[0].replace(/\t/g, "")
    const melodytempoVariables = melodyRaw.match(tempoVariablesRegex)[0]

    return { melodyMain, melodytempoVariables }
}


class txtToImg {
    constructor(txt, size, options) {
        this.txt = txt
        this.options = options || { des: '', render: false }
        this.width = size || 64;
        this.height = this.width * 3 / 4;
        console.log(`${this.options.des} : w ${this.width} h ${this.height}`)
        this.fontSize;
        this.font = 'sans-serif'
        this.fonttype = 'bold'
        this.ctx;
        this.canvas;
        this.init()
    }

    setFontSize() {
        if (this.width === 64) {
            this.fontSize = Math.trunc(this.width / 6)
        } else {
            this.fontSize = Math.trunc(this.width / 6)
        }
    }

    createCanvas(options) {
        this.canvas = document.createElement('CANVAS');
        this.canvas.width = `${this.width}`;
        this.canvas.height = `${this.height}`;
        const ctx = this.canvas.getContext('2d');
        console.log('  font', `${this.fontSize}pt ${this.font}`)
        ctx.textBaseline = "top";
        ctx.font = `${this.fonttype} ${this.fontSize}pt ${this.font}`;

        const { render } = options
        if (render) {
            document.body.appendChild(this.canvas);
            this.description()
        }

        return ctx
    }

    fillTextMultiLine(ctx, text, x, y) {
        const lineHeight = ctx.measureText("M").width * 1.2;
        const textWidth = ctx.measureText(text).width + 5
        let line = "";
        let lines = [];
        const words = text.split("")
        if (textWidth > this.width) {
            for (let word of words) {
                if (word === "\n") {
                    lines.push({
                        text: line,
                        x: x,
                        y: y
                    });
                    y += lineHeight;
                    lines.push({
                        text: word,
                        x: x,
                        y: y
                    });
                    line = "";
                } else {
                    let linePlus = line + word + "";
                    if (ctx.measureText(linePlus).width + 5 > this.width) {
                        lines.push({
                            text: line,
                            x: x,
                            y: y
                        });
                        line = word;
                        y += lineHeight;
                    } else {
                        line = linePlus;
                    }
                }
            }
            lines.push({
                text: line,
                x: x,
                y: y
            });
            for (let line of lines) {
                ctx.fillText(line.text, line.x, line.y);
            }
        } else {
            let oneLine = text.split("\n");
            for (var i = 0; i < oneLine.length; ++i) {
                ctx.fillText(oneLine[i], x, y);
                y += lineHeight;
            }
        }
    }

    convertToBin(threshold = 130, max = 1) {
        let isFirst = true

        let imgData = this.ctx.getImageData(0, 0, this.width, this.height);
        for (let i = 0; i < imgData.data.length; i++) {
            let bin = imgData.data[i] > threshold ? max : 0;
            if (bin && isFirst) {
                console.log('  before', i, imgData.data[i])
            }
            imgData.data[i] = bin
            if (bin && isFirst) {
                console.log('  after', i, imgData.data[i])
                isFirst = false
            }
        }
        this.putImg(imgData);
    }

    copy(ctx) {
        let imgData = ctx.getImageData(0, 0, this.width, this.height);
        this.putImg(imgData);
    }

    ivect(ix, iy, w) {
        // byte array, r,g,b,a
        return ((ix + w * iy) * 4);
    }

    bilinear(scale) {
        let srcImg = this.ctx.getImageData(0, 0, this.width, this.height);
        // c.f.: wikipedia english article on bilinear interpolation
        // taking the unit square, the inner loop looks like this
        // note: there's a function call inside the double loop to this one
        // maybe a performance killer, optimize this whole code as you need
        function inner(f00, f10, f01, f11, x, y) {
            var un_x = 1.0 - x; var un_y = 1.0 - y;
            return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
        }

        var i, j;
        var iyv, iy0, iy1, ixv, ix0, ix1;
        var idxD, idxS00, idxS10, idxS01, idxS11;
        var dx, dy;
        var r, g, b, a;
        for (i = 0; i < srcImg.height * scale; ++i) {
            iyv = i / scale;
            iy0 = Math.floor(iyv);
            // Math.ceil can go over bounds
            iy1 = (Math.ceil(iyv) > (srcImg.height - 1) ? (srcImg.height - 1) : Math.ceil(iyv));
            for (j = 0; j < srcImg.width * scale; ++j) {
                ixv = j / scale;
                ix0 = Math.floor(ixv);
                // Math.ceil can go over bounds
                ix1 = (Math.ceil(ixv) > (srcImg.width - 1) ? (srcImg.width - 1) : Math.ceil(ixv));
                idxD = this.ivect(j, i, srcImg.width);
                // matrix to vector indices
                idxS00 = this.ivect(ix0, iy0, srcImg.width);
                idxS10 = this.ivect(ix1, iy0, srcImg.width);
                idxS01 = this.ivect(ix0, iy1, srcImg.width);
                idxS11 = this.ivect(ix1, iy1, srcImg.width);
                // overall coordinates to unit square
                dx = ixv - ix0; dy = iyv - iy0;
                // I let the r, g, b, a on purpose for debugging
                r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
                    srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
                srcImg.data[idxD] = r;

                g = inner(srcImg.data[idxS00 + 1], srcImg.data[idxS10 + 1],
                    srcImg.data[idxS01 + 1], srcImg.data[idxS11 + 1], dx, dy);
                srcImg.data[idxD + 1] = g;

                b = inner(srcImg.data[idxS00 + 2], srcImg.data[idxS10 + 2],
                    srcImg.data[idxS01 + 2], srcImg.data[idxS11 + 2], dx, dy);
                srcImg.data[idxD + 2] = b;

                a = inner(srcImg.data[idxS00 + 3], srcImg.data[idxS10 + 3],
                    srcImg.data[idxS01 + 3], srcImg.data[idxS11 + 3], dx, dy);
                srcImg.data[idxD + 3] = a;
            }
        }

        this.applyScale(scale, srcImg)
    }

    bicubic(scale) {
        let srcImg = this.ctx.getImageData(0, 0, this.width, this.height);

        let BicubicInterpolation = (function () {
            return function (x, y, values) {
                var i0, i1, i2, i3;

                i0 = TERP(x, values[0][0], values[1][0], values[2][0], values[3][0]);
                i1 = TERP(x, values[0][1], values[1][1], values[2][1], values[3][1]);
                i2 = TERP(x, values[0][2], values[1][2], values[2][2], values[3][2]);
                i3 = TERP(x, values[0][3], values[1][3], values[2][3], values[3][3]);
                return TERP(y, i0, i1, i2, i3);
            };
            /* Yay, hoisting! */
            function TERP(t, a, b, c, d) {
                return 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * t) * t) * t + b;
            }
        })();

        var i, j;
        var dx, dy;
        var repeatX, repeatY;
        var offset_row0, offset_row1, offset_row2, offset_row3;
        var offset_col0, offset_col1, offset_col2, offset_col3;
        var red_pixels, green_pixels, blue_pixels, alpha_pixels;
        for (i = 0; i < srcImg.height * scale; ++i) {
            let iyv = i / scale;
            let iy0 = Math.floor(iyv);

            // We have to special-case the pixels along the border and repeat their values if neccessary
            repeatY = 0;
            if (iy0 < 1) repeatY = -1;
            else if (iy0 > srcImg.height - 3) repeatY = iy0 - (srcImg.height - 3);

            for (j = 0; j < srcImg.width * scale; ++j) {
                let ixv = j / scale;
                let ix0 = Math.floor(ixv);

                // We have to special-case the pixels along the border and repeat their values if neccessary
                repeatX = 0;
                if (ix0 < 1) repeatX = -1;
                else if (ix0 > srcImg.width - 3) repeatX = ix0 - (srcImg.width - 3);

                offset_row1 = ((iy0) * srcImg.width + ix0) * 4;
                offset_row0 = repeatY < 0 ? offset_row1 : ((iy0 - 1) * srcImg.width + ix0) * 4;
                offset_row2 = repeatY > 1 ? offset_row1 : ((iy0 + 1) * srcImg.width + ix0) * 4;
                offset_row3 = repeatY > 0 ? offset_row2 : ((iy0 + 2) * srcImg.width + ix0) * 4;

                offset_col1 = 0;
                offset_col0 = repeatX < 0 ? offset_col1 : -4;
                offset_col2 = repeatX > 1 ? offset_col1 : 4;
                offset_col3 = repeatX > 0 ? offset_col2 : 8;

                //Each offset is for the start of a row's red pixels
                red_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];
                offset_row0++;
                offset_row1++;
                offset_row2++;
                offset_row3++;
                //Each offset is for the start of a row's green pixels
                green_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];
                offset_row0++;
                offset_row1++;
                offset_row2++;
                offset_row3++;
                //Each offset is for the start of a row's blue pixels
                blue_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];
                offset_row0++;
                offset_row1++;
                offset_row2++;
                offset_row3++;
                //Each offset is for the start of a row's alpha pixels
                alpha_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];

                // overall coordinates to unit square
                dx = ixv - ix0; dy = iyv - iy0;

                let idxD = this.ivect(j, i, srcImg.width);

                srcImg.data[idxD] = BicubicInterpolation(dx, dy, red_pixels);

                srcImg.data[idxD + 1] = BicubicInterpolation(dx, dy, green_pixels);

                srcImg.data[idxD + 2] = BicubicInterpolation(dx, dy, blue_pixels);

                srcImg.data[idxD + 3] = BicubicInterpolation(dx, dy, alpha_pixels);
            }
        }

        this.applyScale(scale, srcImg)
    }

    applyScale(scale, srcImg) {
        this.width = this.width * scale;
        this.height = this.height * scale;
        this.canvas.width = `${this.width}`;
        this.canvas.height = `${this.height}`;
        this.putImg(srcImg);
    }

    description() {
        let element = document.createElement('span')
        let description = this.options.des || ''
        element.innerText = description
        // element.style.width = '100px'
        document.body.appendChild(element)
        let br = document.createElement('br')
        document.body.appendChild(br)

    }

    getGrayData() {
        let ctxImgData = this.ctx.getImageData(0, 0, this.width, this.height);
        let gray_data = [];
        for (let i = 0; i < ctxImgData.data.length; i += 4) {
            let gray = ctxImgData.data[i + 3];
            gray_data.push(gray)
        }
        return gray_data;
    }

    getModuleData() {
        let gray_data = this.getGrayData()
        let modiDisplayData = [];
        for (let i = 0; i < gray_data.length; i += 8) {
            let byte = 0x00;
            for (let j = 0; j < 8; j++) {
                byte = (byte << 1) | gray_data[i + j];
            }
            modiDisplayData.push(byte);
        }
        console.log("getModuleData", JSON.stringify(modiDisplayData))
        return modiDisplayData
    }

    createImageData(w, h) {
        let canvas = this.getCanvas(w, h);
        let ctx = canvas.getContext('2d');
        return ctx.createImageData(w, h);
    };

    getCanvas(w, h) {
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    };

    scale(ctx, x, y) {
        ctx.scale(x, y)
    }

    convolute(weights, opaque) {
        let pixels = this.ctx.getImageData(0, 0, this.width, this.height);

        console.log(pixels, weights, opaque)
        // console.log(this.ctx.getImageData())

        let side = Math.round(Math.sqrt(weights.length));
        let halfSide = Math.floor(side / 2);
        let src = pixels.data;
        let sw = pixels.width;
        let sh = pixels.height;
        // pad output by the convolution matrix
        let w = sw;
        let h = sh;

        let imgData = this.createImageData(w, h);
        let dst = imgData.data;
        // go through the destination image pixels
        let alphaFac = opaque ? 1 : 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let sy = y;
                let sx = x;
                let dstOff = (y * w + x) * 4;
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                let r = 0, g = 0, b = 0, a = 0;
                for (let cy = 0; cy < side; cy++) {
                    for (let cx = 0; cx < side; cx++) {
                        let scy = sy + cy - halfSide;
                        let scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            let srcOff = (scy * sw + scx) * 4;
                            let wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a + alphaFac * (255 - a);
            }
        }

        this.putImg(imgData);
    };

    putImg(imgData, x = 0, y = 0) {
        this.ctx.putImageData(imgData, x, y);
    }

    init() {
        this.setFontSize();
        this.ctx = this.createCanvas(this.options);
        if (this.options.scale) {
            if (this.options.scale === 1) {
                this.scale(this.ctx, 0.2, 0.2)
            } else if (this.options.scale === 2) {
                this.canvas.width = 64
                this.canvas.height = 48
                console.log(this.canvas)
            }
        }
        this.fillTextMultiLine(this.ctx, this.txt, 0, 13);

    }
}


class TextCodingUtil {
    constructor() {
        this.imgData = []
        this.melodyTempo = []
    }

    // Entry 에서 사용 중
    canUsePythonVariables(variables) {
        return variables.every((variable) => {
            const target = variable.variableType === 'variable' ? 'v' : 'l';
            return !Entry.TextCodingUtil.validateName(variable.name, target);
        });
    }

    // Entry 에서 사용 중
    canUsePythonFunctions(functions) {
        return functions.every(({ content }) => {
            const code = new Entry.Code(content);
            let paramBlock = code.getEventMap('funcDef')[0];
            paramBlock = paramBlock && paramBlock.params[0];

            if (!paramBlock) {
                return true;
            }

            if (paramBlock.type !== 'function_field_label') {
                return false;
            }

            const params = paramBlock.params;

            if (!params[1]) {
                if (test(params[0])) {
                    return false;
                }
            } else if (this.hasFunctionFieldLabel(params[1])) {
                return false;
            }

            return true;
        });

        function test(name) {
            return / /.test(name);
        }
    }

    initQueue() {
        this._funcParamQ = new Entry.Queue();
        this._funcNameQ = new Entry.Queue();
    }

    clearQueue() {
        this._funcParamQ.clear();
        this._funcNameQ.clear();
    }

    indent(textCode) {
        let result = '\t';
        const indentedCodeArr = textCode.split('\n');
        indentedCodeArr.pop();
        result += indentedCodeArr.join('\n\t');
        result = `\t${result.trim()}`; //.concat('\n');

        return result;
    }

    isNumeric(value) {
        const stringValue = String(Math.abs(value));
        return !!(stringValue.match(/^-?\d+$|^-\d+$/) || stringValue.match(/^-?\d+\.\d+$/));
    }

    isBinaryOperator(value) {
        return ['==', '>', '<', '>=', '>=', '<=', '+', '-', '*', '/'].indexOf(value) > -1;
    }

    logicalExpressionConvert(operator) {
        let result;
        switch (operator) {
            case '&&': {
                result = null;
                break;
            }
            case '||': {
                result = null;
                break;
            }
            default: {
                result = operator;
            }
        }
        return result;
    }

    dropdownDynamicIdToNameConvertor(id, menuName) {
        let result;

        switch (menuName) {
            case 'variables': {
                const entryVariables = Entry.variableContainer.variables_;
                for (const varKey in entryVariables) {
                    const entryVariable = entryVariables[varKey];
                    if (entryVariable.id_ === id) {
                        if (entryVariable.object_) {
                            result = `self.${entryVariable.name_}`;
                        } else {
                            result = entryVariable.name_;
                        }
                        break;
                    }
                }
                break;
            }
            case 'lists': {
                const entryLists = Entry.variableContainer.lists_;
                for (const listKey in entryLists) {
                    const entryList = entryLists[listKey];
                    if (entryList.id_ === id) {
                        if (entryList.object_) {
                            result = `self.${entryList.name_}`;
                        } else {
                            result = entryList.name_;
                        }
                        break;
                    }
                }
                break;
            }
            case 'messages': {
                const entryMessages = Entry.variableContainer.messages_;
                for (const messageKey in entryMessages) {
                    const entryList = entryMessages[messageKey];
                    if (entryList.id === id) {
                        result = entryList.name;
                        break;
                    }
                }
                break;
            }
            case 'pictures': {
                const objects = Entry.container.getAllObjects();
                for (const objKey in objects) {
                    const object = objects[objKey];
                    const pictures = object.pictures;
                    for (const picKey in pictures) {
                        const picture = pictures[picKey];
                        if (picture.id === id) {
                            result = picture.name;
                            return result;
                        }
                    }
                }
                break;
            }
            case 'sounds': {
                const objects = Entry.container.getAllObjects();
                for (const objKey in objects) {
                    const object = objects[objKey];
                    const sounds = object.sounds;
                    for (const soundKey in sounds) {
                        const sound = sounds[soundKey];
                        if (sound.id === id) {
                            result = sound.name;
                            return result;
                        }
                    }
                }
                break;
            }
            case 'scenes': {
                const scenes = Entry.scene.getScenes();
                for (const sceneKey in scenes) {
                    const scene = scenes[sceneKey];
                    if (scene.id === id) {
                        result = scene.name;
                        break;
                    }
                }
                break;
            }
            case 'clone':
            case 'textBoxWithSelf': {
                if (id === 'self') {
                    result = id;
                } else {
                    const objects = Entry.container.objects_.filter((obj) => obj.id === id);
                    result = objects[0] ? objects[0].name : null;
                }
                break;
            }
        }

        return result;
    }
    isEventBlock(block) {
        const blockType = block.data.type;
        return (
            blockType == 'when_run_button_click' ||
            blockType == 'when_some_key_pressed' ||
            blockType == 'mouse_clicked' ||
            blockType == 'mouse_click_cancled' ||
            blockType == 'when_object_click' ||
            blockType == 'when_object_click_canceled' ||
            blockType == 'when_message_cast' ||
            blockType == 'when_scene_start' ||
            blockType == 'when_clone_start'
        );
    }

    isEntryEventFuncByFullText(text) {
        const index = text.indexOf('(');
        const name = text.substring(0, index);

        return (
            name == 'def when_start' ||
            name == 'def when_press_key' ||
            name == 'def when_click_mouse_on' ||
            name == 'def when_click_mouse_off' ||
            name == 'def when_click_object_on' ||
            name == 'def when_click_object_off' ||
            name == 'def when_get_signal' ||
            name == 'def when_start_scene' ||
            name == 'def when_make_clone' ||
            name == 'def entry_event_start' ||
            name == 'def entry_event_key' ||
            name == 'def entry_event_mouse_down' ||
            name == 'def entry_event_mouse_up' ||
            name == 'def entry_event_object_down' ||
            name == 'def entry_event_object_up' ||
            name == 'def entry_event_signal' ||
            name == 'def entry_event_scene_start' ||
            name == 'def entry_event_clone_create'
        );
    }

    searchFuncDefParam(block) {
        if (block.data.type == 'function_field_label') {
            const name = block.data.params[0];
            this._funcNameQ.enqueue(name);
        }

        if (block && block.data && block.data.params && block.data.params[1]) {
            if (
                block.data.type == 'function_field_string' ||
                block.data.type == 'function_field_boolean'
            ) {
                const param = block.data.params[0].data.type;
                this._funcParamQ.enqueue(param);
            }

            return this.searchFuncDefParam(block.data.params[1]);
        } else {
            return block;
        }
    }

    gatherFuncDefParam(block) {
        let result;
        if (block && block.data) {
            if (block.data.params[0]) {
                if (block.data.params[0].data) {
                    const param = block.data.params[0].data.type;
                    if (
                        block.data.type == 'function_field_string' ||
                        block.data.type == 'function_field_boolean'
                    ) {
                        this._funcParamQ.enqueue(param);
                    }
                } else if (block.data.type == 'function_field_label') {
                    const name = block.data.params[0];
                    this._funcNameQ.enqueue(name);
                }
            }
            if (block.data.params[1]) {
                result = this.searchFuncDefParam(block.data.params[1]);

                if (result.data.params[0].data) {
                    const param = result.data.params[0].data.type;

                    if (
                        result.data.type == 'function_field_string' ||
                        result.data.type == 'function_field_boolean'
                    ) {
                        this._funcParamQ.enqueue(param);
                    }
                }

                if (result.data.params[1]) {
                    if (result.data.params[1].data.params[0].data) {
                        const param = result.data.params[1].data.params[0].data.type;

                        if (
                            result.data.params[1].data.type == 'function_field_string' ||
                            result.data.params[1].data.type == 'function_field_boolean'
                        ) {
                            this._funcParamQ.enqueue(param);
                        }
                    }
                }
            }
        }

        return result;
    }

    isParamBlock(block) {
        const type = block.type;
        return (
            type == 'ai_boolean_distance' ||
            type == 'ai_distance_value' ||
            type == 'ai_boolean_object' ||
            type == 'ai_boolean_and'
        );
    }

    hasBlockInfo(data, blockInfo) {
        let result = false;
        for (const key in blockInfo) {
            const info = blockInfo[key];
            if (key == data.type) {
                for (const j in info) {
                    const loc = info[j];
                    if (loc.start == data.start && loc.end == data.end) {
                        result = true;
                        break;
                    }
                }
            }
        }

        return result;
    }

    updateBlockInfo(data, blockInfo) {
        const infoArr = blockInfo[data.type];
        if (infoArr && Array.isArray(infoArr) && infoArr.legnth != 0) {
            for (const i in infoArr) {
                const info = infoArr[i];
                if (info.start == data.start && info.end == data.end) {
                    break;
                } else {
                    var loc = {};
                    loc.start = data.start;
                    loc.end = data.end;

                    infoArr.push(loc);
                }
            }
        } else {
            blockInfo[data.type] = [];

            var loc = {};
            loc.start = data.start;
            loc.end = data.end;

            blockInfo[data.type].push(loc);
        }
    }

    assembleRepeatWhileTrueBlock(block, syntax) {
        let result = '';
        if (block.data.type === 'repeat_while_true') {

            const blockToken = syntax.split(/(?=:)|[ ]/gi); // space 로 split 하되, : 도 자르지만 토큰에 포함
            let option = '';
            let optIndex = 0;

            for (var i = 0; i < blockToken.length; i++) {

                if (blockToken[i] == 'until' || blockToken[i] == 'while') {
                    option = blockToken[i];
                    optIndex = i;
                }
            }

            console.log("repeat_while_true blockToken : ", blockToken);
            console.log("repeat_while_true option : ", option);

            if (option == 'until') {
                const condition = 'true !=';
                blockToken.splice(1, 0, condition);
                optIndex += 1;
                blockToken.splice(optIndex, 1);
                result = blockToken.join(' ').replace(' ! ', '!');
                result = result.replace(' )', ')');

            } else if (option == 'while') {
                blockToken.splice(optIndex, 1);
                result = blockToken.join(' ').replace(' while ', '');
                result = result.replace('( ', '(');
                result = result.replace(' )', ')');
            } else {
                result = syntax;
            }
        } else {
            result = syntax;
        }

        return result;
    }

    assembleWaitUntilTrueBlock(block, syntax) {

        let result = '';
        if (block.data.type === 'wait_until_true') {

            const blockToken = syntax.split(/(?=:)|[ ]/gi); // space 로 split 하되, : 도 자르지만 토큰에 포함
            let lastIndex = blockToken.length - 3;
            const option = blockToken[lastIndex];

            result = blockToken.join(' ').replace(' ! ', '!');
            result = result.replace(' )', ')');

        }


        else {
            result = syntax;
        }


        return result;
    }

    assembleWaitSecondeBlock(block, syntax) {

        return `sleep(${syntax} * 1000);`;
    }

    assembleBasicOperatorBlock(block, syntax) {

        let result = '';

        result = syntax.replace(/(\s*)/g, "");
        console.log("boolean_and_or result : ", result);

        return result;
    }


    assembleBoolenAndOrBlock(block, syntax) {

        let result = '';
        let option = '';
        let optIndex = 0;

        const blockToken = syntax.split(/(?=:)|[ ]/gi); // space 로 split 하되, : 도 자르지만 토큰에 포함


        for (var i = 0; i < blockToken.length; i++) {

            if (blockToken[i] == 'and' || blockToken[i] == 'or') {
                option = blockToken[i];
                optIndex = i;
            }
        }


        console.log("boolean_and_or blockToken : ", blockToken);
        console.log("boolean_and_or option : ", option);

        if (block.data.type === 'boolean_and_or') {

            if (option == 'and') {

                const condition = '&&';
                blockToken.splice(optIndex, 0, condition);
                optIndex += 1;
                blockToken.splice(optIndex, 1);

                result = blockToken.join(' ').replace(' ( ', '(');
                result = result.replace('( ', '(');
                result = result.replace(' )', ')');

                console.log("boolean_and_or result3 : ", result);

            } else if (option == 'or') {

                const condition = '||';
                blockToken.splice(optIndex, 0, condition);
                optIndex += 1;
                blockToken.splice(optIndex, 1);

                result = blockToken.join(' ').replace(' ( ', '(');
                result = result.replace('( ', '(');
                result = result.replace(' )', ')');
            } else {
                result = syntax;
            }

        } else {
            result = syntax;
        }



        return result;
    }

    assembleBoolenNot(block, syntax) {

        let result = '';
        let option = '';
        let optIndex = 0;

        const blockToken = syntax.split(/(?=:)|[ ]/gi); // space 로 split 하되, : 도 자르지만 토큰에 포함


        for (var i = 0; i < blockToken.length; i++) {

            if (blockToken[i] == 'and' || blockToken[i] == 'or') {
                option = blockToken[i];
                optIndex = i;
            }
        }


        console.log("boolean_not blockToken : ", blockToken);
        console.log("boolean_not option : ", option);

        if (block.data.type === 'boolean_not') {

            if (option == 'and') {

                const condition = '&&';
                blockToken.splice(optIndex, 0, condition);
                optIndex += 1;
                blockToken.splice(optIndex, 1);

                result = blockToken.join(' ').replace(' ( ', '(');
                result = result.replace('( ', '(');
                result = result.replace(' )', ')');

                console.log("boolean_not result3 : ", result);

            } else if (option == 'or') {

                const condition = '||';
                blockToken.splice(optIndex, 0, condition);
                optIndex += 1;
                blockToken.splice(optIndex, 1);

                result = blockToken.join(' ').replace(' ( ', '(');
                result = result.replace('( ', '(');
                result = result.replace(' )', ')');
            } else {
                result = syntax;
            }

        } else {
            result = syntax;
        }

        return result;

    }

    assembleModiButtonValueBlock(block, syntax) {

        let result = '';

        const blockToken = syntax.split('.'); // space 로 split 하되, : 도 자르지만 토큰에 포함
        let lastIndex = blockToken.length - 1;
        const option = blockToken[lastIndex];

        console.log("HW_BTN_VALUE blockToken : ", blockToken);
        console.log("HW_BTN_VALUE option : ", option);

        if (block.data.type === 'HW_BTN_VALUE') {

            if (option == '2') {

                const condition = 'getClick()';
                blockToken.splice(lastIndex, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);

                result = blockToken.join('.').replace('2', condition);

            } else if (option == '3') {

                const condition = 'getDoubleClick()';
                blockToken.splice(lastIndex, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);

                result = blockToken.join('.').replace('3', condition);

            }

            else if (option == '4') {

                const condition = 'getPressStatus()';
                blockToken.splice(lastIndex, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);

                result = blockToken.join('.').replace('4', condition);

            }

            else {
                const condition = 'getToggle()';
                blockToken.splice(lastIndex, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);

                result = blockToken.join('.').replace('5', condition);
            }

        } else {
            result = syntax;
        }



        return result;

    }

    assembleModiDialValueBlock(block, syntax) {

        let result = '';

        const blockToken = syntax.split('.'); // space 로 split 하되, : 도 자르지만 토큰에 포함
        let lastIndex = blockToken.length - 1;
        const option = blockToken[lastIndex];

        console.log("HW_DIAL_VALUE blockToken : ", blockToken);
        console.log("HW_DIAL_VALUE option : ", option);


        if (block.data.type === 'HW_DIAL_VALUE') {

            if (option == '2') {

                const condition = 'getTurn()';
                blockToken.splice(lastIndex, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);

                result = blockToken.join('.').replace('2', condition);

            } else if (option == '3') {

                const condition = 'getTurnSpeed()';
                blockToken.splice(lastIndex, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);

                result = blockToken.join('.').replace('3', condition);

            }


        } else {
            result = syntax;
        }

        console.log("HW_DIAL_VALUE option : ", result);

        return result;

    }

    assembleSetLedColoreBlock(blcok, syntax) {

        const blockToken = syntax.split('.'); // space 로 split 하되, : 도 자르지만 토큰에 포함
        const option = blockToken[blockToken.length - 1];

        let hex = option.replace("#", "");
        let value = hex.match(/[a-f\d]/gi);

        // 헥사값이 세자리일 경우, 여섯자리로. 
        if (value.length == 3) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
        value = hex.match(/[a-f\d]{2}/gi);

        let transferedValue = value.map(el => {
            return Math.round((parseInt(el, 16) / 255) * 100)
        })

        let rgbType = `led0.setRgb(${transferedValue[0]},${transferedValue[1]},${transferedValue[2]});`;
        return rgbType;
    }

    assembleModiSetMotorValueBlock(block, syntax) {
        let result = '';
        const blockToken = syntax.split('?'); // space 로 split 하되, : 도 자르지만 토큰에 포함
        const option = blockToken[1];
        const option1 = blockToken[2];
        const option2 = blockToken[3];

        if (block.data.type === 'HW_MOTOR_BOTH') {
            if (option == 'MOTOR_ANGLE') {
                result = 'motor0.setAngle(' + option1 + ',' + option2 + ');';
            } else if (option == 'MOTOR_SPEED') {
                result = 'motor0.setSpeed(' + option1 + ',' + option2 + ');';
            } else if (option == 'MOTOR_TORQUE') {
                result = 'motor0.setTorque(' + option1 + ',' + option2 + ');';
            }
        } else {
            result = syntax;
        }

        return result;
    }

    // assembleModiChangeMotorUpperValueBlock(block, syntax) {
    //     let result = '';
    //     const blockToken = syntax.split('?'); // space 로 split 하되, : 도 자르지만 토큰에 포함
    //     const option = blockToken[1];
    //     const option1 = blockToken[2];

    //     if (option == 'MOTOR_ANGLE') {
    //         result = 'motor0.setAngleUpper(' + option1 + ');';
    //     } else if (option == 'MOTOR_SPEED') {
    //         result = 'motor0.setSpeedUpper(' + option1 + ');';
    //     } 
    //     else if  (option == 'MOTOR_TORQUE') {
    //         result = 'motor0.setTorqueUpper(' + option1 + ');';
    //     } 
    //     return result;
    // }

    // assembleModiSetChangeMotorBottomValueBlock(block, syntax) {
    //     let result = '';
    //     const blockToken = syntax.split('?'); // space 로 split 하되, : 도 자르지만 토큰에 포함
    //     const option = blockToken[1];
    //     const option1 = blockToken[2];

    //     if (option == 'MOTOR_ANGLE') {
    //         result = 'motor0.setAngleBottom(' + option1 + ');';
    //     } else if (option == 'MOTOR_SPEED') {
    //         result = 'motor0.setSpeedBottom(' + option1 + ');';
    //     } 
    //     else if  (option == 'MOTOR_TORQUE') {
    //         result = 'motor0.setTorqueBottom(' + option1 + ');';
    //     }

    //     return result;
    // }

    assembleModiSetBasicSpeakerBlock(block, syntax) {

        let result = '';

        const blockToken = syntax.split('?');

        const option1 = blockToken[1];
        const option2 = blockToken[2];



        result = 'speaker0.setTune(' + option1 + ', ' + option2 + ');';


        console.log("HW_SPEAKER_TUNE option1 : ", option1);
        console.log("HW_SPEAKER_TUNE option2 : ", option2);
        console.log("HW_SPEAKER_TUNE result : ", result);



        return result;

    }

    assembleModiMelodySpeakerBlock(block, syntax) {
        const blockToken = syntax.split('?');
        const melodyName = blockToken[1]
        const melodyVolume = blockToken[2] || 50;
        console.log("assembleModiMelodySpeakerBlock", blockToken)
        const melodyCode = getMelodyCode(melodyName, melodyVolume)
        this.melodyTempo.push(melodyCode.melodytempoVariables)
        return melodyCode.melodyMain
    }


    assembleModiDisplayBlock(block, syntax) {
        // 영문, (영+수), |  숫자, 변수, 인풋, | 한글, (한글+수), (영+한글)
        const blockToken = syntax.split('(?lXrObo8m_1#?)');
        const positionY = Number(blockToken[1]) || 0;
        const contents = `${blockToken[2].substr(0, blockToken[2].length - 1)} "`;
        let result = `display0.setText(${contents});`; // 영문이 포함된 경우 줄선택 불가
        console.log("assembleModiDisplayBlock : ", blockToken);

        function isNotInASCII(str) {
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127) {
                    return true
                }
            }
            return false
        }

        const commaRegex = /,/g
        const commaMatch = contents.match(commaRegex)
        
        if(commaMatch){
            window.android.failUpload(`${commaMatch[0]}는 사용할 수 없어요!`);
            throw new Error(commaMatch[0])
        }

        if (isNotInASCII(contents)) { // 한글이 포함된 경우 이미지로 출력
            console.log('isNotInASCII, make this str to img')
            const textImgVariable = `image${this.imgData.length}`;

            // get image data from text (which is enhanced by bilinear algorithm)
            let imgData = new txtToImg(contents.replace(/"/g, ""), 320);
            imgData.bilinear(0.2);
            imgData.convertToBin(150, 1);
            imgData = imgData.getModuleData();

            this.imgData.push(imgData.toString())
            result = `display0.drawPicture("${textImgVariable}");`;
        }

        if (contents[0] !== '"' && isNaN(Number(contents)) === true) { // 인풋, (변수?)
            window.android.failUpload('글자를 입력해 주세요.');
            throw new Error('글자를 입력해 주세요.');
            // result = `display0.setVariable(2,${positionY},${contents});`; 
        }

        return result;
    }

    assembleModiDisplayImgBlock(block, syntax) {
        const blockToken = syntax.split('?');
        const contents = blockToken[1];

        const imgLibrary = EntryStatic.displayImage.data

        console.log('DisplayImgBlock EntryStatic.displayImage.data : ', EntryStatic.displayImage.data)
        console.log('DisplayImgBlock imgLibrar : ', imgLibrary)



        this.imgData.push(imgLibrary[contents].toString())


        const result = `display0.drawPicture("${encodeURI(contents)}");`;
        return result
    }

    assembleModiDisplayMoveBlock(block, syntax) {
        const blockToken = syntax.split('?');
        const direction = blockToken[1];
        const sign = blockToken[2];
        const distance = blockToken[3];
        const result = `display0.set${direction}(${sign}*${distance});`;
        return result
    }

    jsAdjustSyntax(block, syntax) {
        let result = '';
        if (block.data.type == 'ai_boolean_distance') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length - 1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            secondParam = this.bTojBinaryOperatorConvertor(secondParam);
            var thirdParam = tokens[2];

            result = `${firstParam} ${secondParam} ${thirdParam}`;
        } else if (block.data.type == 'ai_boolean_object') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length - 1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            var thirdParam = tokens[2];

            result = `${firstParam} ${secondParam} ${thirdParam}`;
        } else if (block.data.type == 'ai_distance_value') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length - 1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');

            result = firstParam;
        } else {
            result = syntax;
        }

        return result;
    }

    bTojBinaryOperatorConvertor(operator) {
        let result;
        switch (operator) {
            case "'BIGGER'":
                result = '>';
                break;
            case "'BIGGER_EQUAL'":
                result = '>=';
                break;
            case "'EQUAL'":
                result = '==';
                break;
            case "'SMALLER'":
                result = '<';
                break;
            case "'SMALLER_EQUAL'":
                result = '<=';
                break;
        }

        return result;
    }

    jTobBinaryOperatorConvertor(operator) {
        let result;
        switch (operator) {
            case '>':
                result = 'BIGGER';
                break;
            case '>=':
                result = 'BIGGER_EQUAL';
                break;
            case '==':
                result = 'EQUAL';
                break;
            case '<':
                result = 'SMALLER';
                break;
            case '<=':
                result = 'SMALLER_EQUAL';
                break;
        }

        return result;
    }

    radarVariableConvertor(variable) {
        const items = variable.split('_');
        return items[1].toUpperCase();
    }

    tTobDropdownValueConvertor(value) {
        let result;
        if (value == 'stone') {
            result = 'OBSTACLE';
        } else if (value == 'wall') {
            result = value.toUpperCase();
        } else if (value == 'item') {
            result = value.toUpperCase();
        } else {
            result = value;
        }

        return result;
    }

    canConvertTextModeForOverlayMode(convertingMode) {
        let message;
        const oldMode = Entry.getMainWS().oldMode;

        if (
            oldMode == Entry.Workspace.MODE_OVERLAYBOARD &&
            convertingMode == Entry.Workspace.MODE_VIMBOARD
        ) {
            message = Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_EDITOR];
            return message;
        }

        return message;
    }

    /**
     * TODO 18년 9월자 배포(10/4) 일 임시 코드입니다. 차후 수정 필수입니다.
     * https://oss.navercorp.com/entry/Entry/issues/9155 링크 참조
     * @returns {{message: string, type: string} || undefined}
     */
    hasExpansionBlocks() {
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        const activatedExpansionBlocks = Entry.expansionBlocks;

        if (activatedExpansionBlocks.length > 0) {
            return {
                message: Lang.TextCoding[Entry.TextCodingError.ALERT_API_NO_SUPPORT],
                type: 'error',
            };
        }
    }

    /**
     * 현재 코드 내 변수, 리스트에 대해 공백/특수문자/예약어/숫자시작 여부를 검사한다.
     * @return {Object} 에러오브젝트
     */
    validateVariableAndListToPython() {
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }
        return (
            this.validateNameList(vc.variables_ || [], 'v') ||
            this.validateNameList(vc.lists_ || [], 'l')
        );
    }

    validateNameList(targets, errorSuffix) {
        for (let i = 0; i < targets.length; i++) {
            const errorMessage = this.validateName(targets[i].name_, errorSuffix);
            if (errorMessage) {
                return errorMessage;
            }
        }
    }

    /**
     * 현재 코드 내 함수에 대해 공백/특수문자/예약어/숫자시작 여부 외에,
     * 함수명 필드 시작여부 / 함수명 다중 사용여부 / boolean 타입 필드 사용여부를 검사한다.
     * boolean 은 구조상 파이선으로 변환하면 일반필드가 되어버린다.
     * @return {Object} 에러 / 경고 오브젝트
     */
    validateFunctionToPython() {
        const returnErrorResult = (errorMessage) =>
            this._generateErrorObject(errorMessage, 'error');
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        const {
            ALERT_FUNCTION_NAME_DISORDER,
            ALERT_FUNCTION_NAME_FIELD_MULTI,
            ALERT_FUNCTION_HAS_BOOLEAN,
        } = Entry.TextCodingError;
        const DISORDER = Lang.TextCoding[ALERT_FUNCTION_NAME_DISORDER];
        const FIELD_MULTI = Lang.TextCoding[ALERT_FUNCTION_NAME_FIELD_MULTI];
        const HAS_BOOLEAN = Lang.TextCoding[ALERT_FUNCTION_HAS_BOOLEAN];

        const targets = vc.functions_ || {};

        for (const targetKey in targets) {
            const funcSchemaBlock = targets[targetKey].content.getEventMap('funcDef')[0];
            const functionBlock = funcSchemaBlock && funcSchemaBlock.params[0];
            const { params } = functionBlock;
            const [functionName, parameterBlock] = params;

            if (!functionBlock) {
                continue;
            }

            // 함수의 첫 값이 함수명필드여야 한다.
            if (functionBlock.type !== 'function_field_label') {
                return returnErrorResult(DISORDER);
            }

            // 함수명의 특수문자, 예약어, 숫자로 시작됨 여부 검사
            // 공백검사는 하지 않는다. 공백은 __ 로 치환되기 때문이다.
            const errorMessageObject =
                this.validateNameNotStartWithNumber(functionName, 'f') ||
                this.validateNameNotStartWithSpecials(functionName, 'f') ||
                this.validateNameIsReservedKeyword(functionName, 'f');

            if (errorMessageObject) {
                return errorMessageObject;
            }

            // 함수명 필드는 여러개 등장할 수 없다.
            if (this.hasFunctionFieldLabel(parameterBlock)) {
                return returnErrorResult(FIELD_MULTI);
            }

            // 'warning' 함수인자에 boolean 타입이 있는 경우 변환시 일반 필드화가 된다.
            if (this.hasFunctionBooleanField(parameterBlock)) {
                return this._generateErrorObject(HAS_BOOLEAN, 'warning');
            }
        }
    }

    hasFunctionFieldLabel(fBlock) {
        if (!fBlock || !fBlock.data) {
            return;
        }
        if (fBlock.data.type == 'function_field_label') {
            return true;
        }

        const params = fBlock.data.params;
        if (params[0]) {
            var type = params[0].data.type;
            if (type == 'function_field_label') {
                return true;
            }
            if (params[0].data.params) {
                if (this.hasFunctionFieldLabel(params[0])) {
                    return true;
                }
            }
        }

        if (params[1]) {
            var type = params[1].data.type;
            if (type == 'function_field_label') {
                return true;
            }
            if (params[1].data.params) {
                if (this.hasFunctionFieldLabel(params[1])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 함수 인자에 판단형 파라미터가 존재하는지 찾는다.
     * 이 함수는 재귀로 동작한다.
     * @param fBlock 함수명이 포함되지 않은 functionBlock 목록
     * @returns {Boolean} 판단형 파라미터가 존재하는 경우 true, 존재하지 않는 경우 false
     */
    hasFunctionBooleanField(fBlock) {
        if (!fBlock || !fBlock.data) {
            return false;
        }
        const { data } = fBlock;
        return (
            data.type === 'function_field_boolean' || this.hasFunctionBooleanField(data.params[1])
        );
    }

    /**
     * 예약어 사용여부, 공백 사용여부, 숫자로 시작여부, 특수문자 사용 여부를 검사한다.
     * @param target{string} 검사할 name
     * @param errorSuffix{string} l = 리스트, v = 변수, f = 함수
     * @return {Object || undefined} 에러메세지를 반환하거나 아무것도 반환하지 않는다
     * @property message{string} 에러메세지
     * @property type{string} 'error' 고정. 타입이 에러인 메세지 반환
     */
    validateName(target, errorSuffix) {
        //이름엔 공백이 포함될 수 없다.
        //이름 맨앞에 _ 를 제외한 특수문자가 올 수 없다.
        //변수명은 예약어가 될 수 없다.
        const errorMessage = this.validateNameIncludeSpace(target, errorSuffix);
        if (errorMessage) {
            return this._generateErrorObject(errorMessage, 'error');
        }

        //이름 맨앞에 숫자가 올 수 없다.
        const errorObject =
            this.validateNameNotStartWithNumber(target, errorSuffix) ||
            this.validateNameNotStartWithSpecials(target, errorSuffix) ||
            this.validateNameIsReservedKeyword(target, errorSuffix);

        if (errorObject) {
            return errorObject;
        }
    }

    /**
     * 공백이 들었는지 검사한다. 외부에서 사용하고 있어서 리턴타입을 변경하지 않았다.
     * @param name 타겟
     * @param type variable|v|list|l|function|f 이에 맞춰서 에러메세지가 변경된다.
     * @return {string|undefined} 에러메세지
     */
    validateNameIncludeSpace(name, type) {
        if (!/ /.test(name)) {
            return;
        }

        if (type === 'variable' || type === 'v') {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_VARIABLE_EMPTY_TEXT_ADD_CHANGE];
        } else if (type === 'list' || type === 'l') {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_LIST_EMPTY_TEXT_ADD_CHANGE];
        } else if (type === 'function' || type === 'f') {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_EMPTY_TEXT_ADD_CHANGE];
        }
    }

    /**
     * 이름이 숫자로 시작하는지 검사. 숫자로 시작하는 경우 에러 메세지를 반환한다.
     * @param name 타겟
     * @param errorSuffix v|l|f 이에 맞춰서 에러메세지가 변경된다.
     * @return {{message: string, type: string} | undefined} 에러메세지
     */
    validateNameNotStartWithNumber(name, errorSuffix) {
        //이름 맨앞에 숫자가 올 수 없다.
        const regExp = /^[0-9]$/g;
        if (regExp.test(name[0])) {
            return this._generateErrorObject(
                Lang.Menus[`textcoding_numberError_${errorSuffix}`],
                'error'
            );
        }
    }

    /**
     * 이름이 _ 를 제외한 특수문자로 시작하는지 검사. 해당하는 경우 에러 메세지를 반환한다.
     * @param name 타겟
     * @param errorSuffix v|l|f 이에 맞춰서 에러메세지가 변경된다.
     * @return {{message: string, type: string} | undefined} 에러메세지
     */
    validateNameNotStartWithSpecials(name, errorSuffix) {
        const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
        if (regExp.test(name)) {
            return this._generateErrorObject(
                Lang.Menus[`textcoding_specialCharError_${errorSuffix}`],
                'error'
            );
        }
    }

    validateNameIsReservedKeyword(name, errorSuffix) {
        const keywords = [
            'and',
            'assert',
            'break',
            'class',
            'continue',
            'def',
            'del',
            'elif',
            'else',
            'except',
            'exec',
            'finally',
            'for',
            'from',
            'global',
            'if',
            'import',
            'in',
            'is',
            'lambda',
            'not',
            'or',
            'pass',
            'print',
            'raise',
            'return',
            'try',
            'while',
            'with',
            'yield',
            'None',
        ];

        //변수명은 예약어가 될 수 없다.
        if (keywords.includes(name)) {
            return this._generateErrorObject(
                Lang.Menus[`textcoding_bookedError_1${errorSuffix}`] +
                name +
                Lang.Menus[`textcoding_bookedError_2${errorSuffix}`],
                'error'
            );
        }
    }

    /**
     * 에러메세지를 만든다. 단순히 오브젝트를 지정하는 것 말고는 하지 않는다.
     * @param message{string} 에러메세지
     * @param type{string} error | warning warning 인 경우는 변환은 성공하나, 알림이 발생한다.
     * @return {{message: string, type: string}}
     * @private
     */
    _generateErrorObject(message, type) {
        return {
            message,
            type,
        };
    }

    generateVariablesDeclaration() {
        let result = '';
        const currentObject = Entry.playground.object;
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }
        //inspect variables
        const targets = vc.variables_ || [];

        for (let i = targets.length - 1; i >= 0; i--) {
            const v = targets[i];
            let name = v.name_;
            let value = v.value_;

            if (v.object_) {
                if (v.object_ == currentObject.id) {
                    name = `self.${name}`;
                } else {
                    continue;
                }
            }

            if (typeof value === 'string') {
                value = '"()"'.replace('()', value);
            }

            result += `${name} = ${value}\n`;
        }

        return result;
    }

    generateListsDeclaration() {
        let result = '';
        const currentObject = Entry.playground.object;
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        //inspect lists
        const targets = vc.lists_ || [];

        for (let i = targets.length - 1; i >= 0; i--) {
            const l = targets[i];
            let name = l.name_;
            let value = '';
            const lArray = l.array_;
            if (l.object_) {
                if (l.object_ == currentObject.id) {
                    name = `self.${name}`;
                } else {
                    continue;
                }
            }

            for (const va in lArray) {
                const vItem = lArray[va];
                let data = vItem.data;

                if (isNaN(data) || (data.length > 1 && String(data)[0] === '0')) {
                    data = `"${data.replace(/"/gi, '\\"')}"`;
                }

                if (typeof data === 'number' || data.trim().length > 0) {
                    value += data;
                }

                if (va != lArray.length - 1) {
                    value += ', ';
                }
            }

            result += `${name} = [${value}]` + `\n`;
        }

        return result;
    }
    generateForStmtIndex(index, str) {
        str = str || '';
        const ref = ['i', 'j', 'k'];
        const quotient = Math.floor(index / 3);
        const remainder = index % 3;

        str = ref[remainder] + str;

        if (quotient) {
            return this.generateForStmtIndex(quotient - 1, str);
        } else {
            return str;
        }
    }

    /**
     * 함수명 템플릿에서 함수명을 추출한다.
     * 함수명은 아래의 규칙을 따른다.
     * - 공백은 __로 치환된다.
     * - 함수명이 '' 인 경우는 '함수' 로 대체된다.
     * @param template{string} 함수명 템플릿
     * @return {string} 치환된 함수
     */
    getFunctionNameFromTemplate(template) {
        if (!template) {
            return Lang.Workspace.func;
        }

        const trimmedFunctionName = template.split(/%\d/)[0].trim();
        if (trimmedFunctionName === '') {
            return Lang.Workspace.func;
        }

        return trimmedFunctionName.replace(/ /gi, '__');
    }
}

Entry.TextCodingUtil = {};
Entry.TextCodingUtil = new TextCodingUtil();
