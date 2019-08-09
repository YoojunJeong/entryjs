'use strict';

function getMelodyCode(name, vol) {

    const melodyLibrary = EntryStatic.speakerMelody.data
    const melodyRaw = melodyLibrary[name].replace(/__melodyVolume/g, `${vol}`)
    const mainRegex = /(?<=while\s*\(\s*true\s*\)\s*\n*{\n*)[\n\t\s\w\d\;\=\*\+\-\/\_\.\,\(\)]*/g
    const tempoVariablesRegex = /[\n\t\s\w\d\;\=\*\/\_\.\,\(\)]*(?=while\s*\(\s*true\s*\)\s*\n*{\n*)/g
    const melodyMain = melodyRaw.match(mainRegex)[0].replace(/\t/g, "")
    const melodytempoVariables = melodyRaw.match(tempoVariablesRegex)[0]

    return {melodyMain,melodytempoVariables}
}




class TextCodingUtil {
    constructor(){
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
            
                if(blockToken[i] == 'until' || blockToken[i]=='while') {
                    option = blockToken[i];
                    optIndex = i;
                }
            }

            console.log("repeat_while_true blockToken : ", blockToken);
            console.log("repeat_while_true option : ", option);

            if (option == 'until') {
                const condition = '!';
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

        let result = '';
        if (block.data.type === 'wait_second') {

          var second = syntax * 1000;

          result = 'sleep('+second+');'
        } 
        
        
        else {
            result = syntax;
        }

    
        return result;
    }

    assembleBasicOperatorBlock(block, syntax) {

        let result = '';

        result = syntax.replace(/(\s*)/g,"");
        console.log("boolean_and_or result : ", result);

        return result;
    }


    assembleBoolenAndOrBlock(block, syntax) {

        let result = '';
        let option = '';
        let optIndex = 0;

        const blockToken = syntax.split(/(?=:)|[ ]/gi); // space 로 split 하되, : 도 자르지만 토큰에 포함
        
    
        for (var i = 0; i < blockToken.length; i++) {
            
            if(blockToken[i] == 'and' || blockToken[i]=='or') {
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

            else if (option == '3') {
              
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

        let hex = option.replace( "#", "" ); 
        let value = hex.match( /[a-f\d]/gi ); 

        // 헥사값이 세자리일 경우, 여섯자리로. 
        if ( value.length == 3 ) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2]; 
        value = hex.match( /[a-f\d]{2}/gi ); 

        let transferedValue = value.map(el => {
            return Math.round((parseInt( el, 16 ) / 255) * 100)
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
                result = 'motor0.setAngle(' + option1 + ',' + option2+');';
            } else if (option == 'MOTOR_SPEED') {
                result = 'motor0.setSpeed(' + option1 + ',' + option2+');';
            } else if  (option == 'MOTOR_TORQUE') {
                result = 'motor0.setTorque(' + option1 + ',' + option2+');';
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

    

        result = 'speaker0.setTune(' + option1 + ', ' + option2+');';
        
    
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
        const melodyCode = getMelodyCode(melodyName,melodyVolume)
        this.melodyTempo.push(melodyCode.melodytempoVariables)
        return melodyCode.melodyMain
    }

    assembleModiDisplayBlock(block, syntax) {
        // 영문, (영+수), |  숫자, 변수, 인풋, | 한글, (한글+수), (영+한글)
        const blockToken = syntax.split('?'); 
        const positionY = Number(blockToken[1]) || 0 ;
        const contents = blockToken[2];
        let result = `display0.setText(${contents});`; // 영문이 포함된 경우 줄선택 불가
        console.log("assembleModiDisplayBlock : ", blockToken);

        function isNotInASCII(str) {
            for(let i=0;i<str.length;i++){
                if(str.charCodeAt(i) > 127){
                    return true
                }
            }
            return false
        }

        function fillTextMultiLine(ctx, text, x, y) {
            const lineHeight = 15 // ctx.measureText("M").width * 1.2;
            const textWidth = ctx.measureText(text).width + 5
            let line = "";
            let lines = [];
            const words = text.split("")
            if (textWidth > 64) {
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
                        if (ctx.measureText(linePlus).width + 5 > 64) {
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

        function convertToImg(str) {
            // canvas 에서 text를 img bin으로 전환함
            let x = document.createElement("CANVAS");
            let ctx = x.getContext("2d");
            ctx.font = 'bold 9pt lighter sans-serif';
            ctx.textBaseline="top"; 
            fillTextMultiLine(ctx, str, 2, positionY);
            let ctxImgData = ctx.getImageData(0,0,64,48)

            // ctxImgData을 gray data 로 변환
            let gray_data = [];
            for (let i = 0; i < ctxImgData.data.length; i += 4) {
                let gray = ctxImgData.data[i + 3];
                gray_data.push(gray)
            }

            // TODO: gyay to binary의 변홤 품질이 좋지않음. 다른 알고리즘으로 대체
            let binary_data = [];
            for (let i = 0; i < gray_data.length; i++) {
                let bin = gray_data[i] > 90 ? 1 : 0;
                binary_data.push(bin);
            }
            
            let modiDisplayData = [];
            for (let i = 0; i < binary_data.length; i += 8) {
                let byte = 0x00;
                for (let j = 0; j < 8; j++) {
                    byte = (byte << 1) | binary_data[i + j];
                }
                modiDisplayData.push(byte);
            }

            return modiDisplayData;
        }

        if(isNotInASCII(contents)){ // 한글이 포함된 경우 이미지로 출력
            console.log('isNotInASCII, make this str to img')
            const textImgVariable = `image${this.imgData.length}`;
            const imgData = convertToImg(contents.replace(/"/g,""));
            this.imgData.push(imgData.toString())
            result = `display0.drawPicture("${textImgVariable}");`;
        }

        if(contents[0] !== '"' && isNaN(Number(contents)) === true){ // 인풋, (변수?)
            result = ``;
            // result = `display0.setVariable(2,${positionY},${contents});`; 
        }

        return result;
    }

    assembleModiDisplayImgBlock(block, syntax) {
        const blockToken = syntax.split('?'); 
        const contents = blockToken[1];

        const imgLibrary = EntryStatic.displayImage.data

        console.log('DisplayImgBlock EntryStatic.displayImage.data : ',EntryStatic.displayImage.data )
        console.log('DisplayImgBlock imgLibrar : ',imgLibrary )
        

        
        this.imgData.push(imgLibrary[contents].toString())
        
        const result = `display0.drawPicture("${contents}");`;
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
