/*
 *
 */
'use strict';

import _includes from 'lodash/includes';

Entry.BlockToCParser = class {
    constructor() {
        this._type = 'BlockToCParser';
        this._funcParamMap = new Entry.Map();
        this.funcDefMap = {};

        this.globalCommentList = [];

        this._variableDeclaration = null;
        this._listDeclaration = null;
        this._forIdCharIndex = 0;   
    }

    Code(code, parseMode) {
        this._parseMode = parseMode;
        if (!code) {
            return;
        }
        if (code instanceof Entry.Thread) {
            return this.Thread(code);
        }
        if (code instanceof Entry.Block) {
            return this.Block(code);
        }

        const resultTextCode = [];
        const threads = code.getThreads();

        for (let i = 0; i < threads.length; i++) {
            this._forIdCharIndex = 0;
            const thread = threads[i];

            if (thread) {
                resultTextCode.push(this.Thread(thread));
            }
        }

        return resultTextCode.join('\n').trim();
    }

    Thread(thread) {
        if (thread instanceof Entry.Block) {
            return this.Block(thread);
        }
        const blocks = thread.getBlocks();

        if (blocks.length === 0) {
            return '';
        }

        if (blocks[0] instanceof Entry.Comment) {
            this.Comment(blocks[0]);
        } else if (this._parseMode === Entry.Parser.PARSE_SYNTAX) {
            return blocks.map((block) => `${this.Block(block)}\n`).trim();
        } else if (this._parseMode === Entry.Parser.PARSE_GENERAL) {
            let rootResult = '';
            let contentResult = '';

            // 여기서 에러 - this.Block(block)
            blocks.forEach((block, index) => {
                if (index === 0 && Entry.TextCodingUtil.isEventBlock(block)) {
                    rootResult = `${this.Block(block)}\n`;
                } else {
                    contentResult += `${this.Block(block)}\n`;
                }
            });

            if (rootResult !== '') {
                contentResult = Entry.TextCodingUtil.indent(contentResult);
            }

            return `${(rootResult + contentResult).trim()}\n`;
        }
    }

    Block(block) {
        if (!block || !(block instanceof Entry.Block)) {
            return '';
        }
        !block._schema && block.loadSchema();

        
        const results = [];
        const syntaxObj = this.searchSyntax(block);
        let syntax;

        if (syntaxObj) {
            syntax = syntaxObj.syntax;
        }

        // User Function
        if (this.isFunc(block)) {
            if (!this.funcDefMap[block.data.type]) {
                this._rootFuncId = block.data.type;
                this.funcDefMap[block.data.type] = this.makeFuncDef(block, this._hasRootFunc);
                this._hasRootFunc = false;
            }
            if (this.isRegisteredFunc(block)) {
                syntax = this.makeFuncSyntax(block);
            }
            if (this._parseMode === Entry.Parser.PARSE_SYNTAX) {
                return syntax;
            }
        } else if (this.isFuncStmtParam(block)) {
            results.push(block.data.type);
        }

        // syntax가 undefined
        if (!syntax && !this.isFuncStmtParam(block)) {
            const error = new Error();
            error.block = block;
            throw error;
        }

        const _blockTokens = syntax.split(/[\r\n]/);
        const _blockParamRegex = /%\d/gim;
        const _blockStatementRegex = /\$\d/gim;

        let isFirstCommentToken = true;
        
        _blockTokens.forEach((token) => {
            const paramsTemplate = token.match(_blockParamRegex);
            const statements = token.match(_blockStatementRegex);
            let resultTextCode = '';

            // %1 과 같은 템플릿 값이 있는 경우
            if (paramsTemplate) {
                const paramsValue = [];
                paramsTemplate.forEach((template) => {
                    const [, index] = template.split('%');

                    if (index) {
                        paramsValue[index] = this._getParamsValue(index, block);
                    }
                });

                resultTextCode += token.replace(
                    /%(\d)/gim,
                    (_, groupMatch) => paramsValue[groupMatch]
                );
            }

            // $1 과 같이 statement 를 포함하는 경우
            if (statements) {
                statements.forEach((value) => {
                    const [, index] = value.split('$');
                    resultTextCode += Entry.TextCodingUtil.indent(
                        this.Thread(block.statements[index - 1])
                    );
                    if(!block.statements[0]._data.length){
                        if(syntaxObj.key!=='_if' && syntaxObj.key!=='if_else'){
                            resultTextCode += 'sleep(1);'
                        }
                    }
                });
            }

            // 일반 블록 처리
            if (!statements && !paramsTemplate) {
                resultTextCode += token;
            }

            

            // 특수 블록 처리
            // TODO 이와 같은 처리는 블록에 정보가 있고, 정보에 따라 처리해야 한다.
            if (syntaxObj) {
                switch (syntaxObj.key) {
                    
                    case 'repeat_while_true':

                        resultTextCode = Entry.TextCodingUtil.assembleRepeatWhileTrueBlock(
                            block,
                            resultTextCode
                        );
                        break;
                    case 'repeat_basic': {
                        const forStmtTokens = resultTextCode.split(' ');

                        if (_includes(forStmtTokens, 'for', 'i', 'in')) {
                            forStmtTokens[1] = Entry.TextCodingUtil.generateForStmtIndex(
                                this._forIdCharIndex++
                            );
                            resultTextCode = forStmtTokens.join(' ');
                        }
                        break;
                    }

                    case 'wait_second' : {
                        resultTextCode = Entry.TextCodingUtil.assembleWaitSecondeBlock(
                            block,
                            resultTextCode
                        );
                        break;

                    }
                   
                    // case 'wait_until_true': {
                    //     resultTextCode = Entry.TextCodingUtil.assembleWaitUntilTrueBlock(
                    //         block,
                    //         resultTextCode
                    //     );
                    //     break;
                    //     }

                    case 'boolean_basic_operator' : {
                        resultTextCode = Entry.TextCodingUtil.assembleBasicOperatorBlock(
                            block,
                            resultTextCode
                        );
                        break;
                        
                    }

                    case 'boolean_and_or': {
                        resultTextCode = Entry.TextCodingUtil.assembleBoolenAndOrBlock(
                            block,
                            resultTextCode
                        );
                        break;
                    }

                    case 'HW_BTN_VALUE' : {
                        

                        resultTextCode = Entry.TextCodingUtil.assembleModiButtonValueBlock(
                            block,
                            resultTextCode
                        );

                        break;
                    }

                    case 'modi_button_true' : {
                        

                        resultTextCode = 'TRUE'

                        break;
                    }

                    case 'modi_button_false' : {
                        

                        resultTextCode = 'FALSE'

                        break;
                    }

                    case 'HW_DIAL_VALUE' : {

                        resultTextCode = Entry.TextCodingUtil.assembleModiDialValueBlock(
                            block,
                            resultTextCode
                        );

                        break;
                    }

                   
                    case 'HW_LED_BASIC' : {
                        resultTextCode = Entry.TextCodingUtil.assembleSetLedColoreBlock(
                            block,
                            resultTextCode
                        );

                        break;
                    }

                    case 'HW_MOTOR_BOTH': {
                        resultTextCode = Entry.TextCodingUtil.assembleModiSetMotorValueBlock(
                            block,
                            resultTextCode
                        );

                        break;
                    }
                    
                    // case 'modi_change_motor_upper_value': {
                    //     resultTextCode = Entry.TextCodingUtil.assembleModiChangeMotorUpperValueBlock(
                    //         block,
                    //         resultTextCode
                    //     );
                    //     break;
                    // }

                    // case 'modi_change_motor_bottom_value': {
                    //     resultTextCode = Entry.TextCodingUtil.assembleModiSetChangeMotorBottomValueBlock(
                    //         block,
                    //         resultTextCode
                    //     );
                    //     break;
                    // }

                    case 'HW_SPEAKER_TUNE' : {
                        resultTextCode = Entry.TextCodingUtil.assembleModiSetBasicSpeakerBlock(
                            block,
                            resultTextCode
                        );

                        break;
                        
                    }
                    case 'HW_SPEAKER_MELODY' : {
                        resultTextCode = Entry.TextCodingUtil.assembleModiMelodySpeakerBlock(
                            block,
                            resultTextCode
                        );
                        break;
                    }
                    
                    case 'HW_DISPLAY_TEXT' : {
                        resultTextCode = Entry.TextCodingUtil.assembleModiDisplayBlock(
                            block,
                            resultTextCode
                        );
                        break;
                    }

                    case 'HW_DISPLAY_IMAGE' : {
                        resultTextCode = Entry.TextCodingUtil.assembleModiDisplayImgBlock(
                            block,
                            resultTextCode
                        );
                        break;
                    }

                    case 'HW_DISPLAY_MOVE' : {
                        resultTextCode = Entry.TextCodingUtil.assembleModiDisplayMoveBlock(
                            block,
                            resultTextCode
                        );
                        break;
                    }
                }
            }

            // 코멘트 처리
            const commentValue = block.getCommentValue();
            if (isFirstCommentToken && !statements && commentValue !== undefined) {
                // '' 도 표기한다.
                resultTextCode += ` # ${commentValue}`;
                isFirstCommentToken = !isFirstCommentToken;
            }

            results.push(resultTextCode);
        });

        return results.join('\n');
    }

    Comment(comment) {
        this.globalCommentList.push(`# ${comment.value}`);
    }

    /**
     * 해당 block 의 template parameter 의 실제 값을 가져온다.
     * @param templateIndex index 번호 (%2 라면 2)
     * @param block 추출할 블록
     * @returns {string} 블록의 결과값
     * @private
     */
    _getParamsValue(templateIndex, block) {

        const index = Number(templateIndex) - 1;
        const schemaParams = block._schema.params;
        const dataParams = block.data.params;

        let result = '';
        const syntaxObj = this.searchSyntax(block);
    
        const textParams = syntaxObj.textParams && syntaxObj.textParams;

        if (schemaParams[index]) {
            switch (schemaParams[index].type) {
                case 'Indicator': {
                    break;
                }
                case 'Block': {


                    
                    let param = this.Block(dataParams[index]).trim();

                    const funcParam = this._funcParamMap.get(param);
                    const textParam = textParams && textParams[index];

                    if (funcParam) {
                        param = funcParam;
                    } else {
                        const funcParamTokens = param.split('_');
                        const prefix = funcParamTokens[0];
                        if (funcParamTokens.length === 2) {
                            if (prefix === 'stringParam') {
                                param = 'string_param';
                            } else if (prefix === 'booleanParam') {
                                param = 'boolean_param';
                            }
                        }
                    }

                    if (textParam && textParam.paramType === 'index') {
                        if (Entry.Utils.isNumber(param)) {
                            param = param - 1;
                        } else {
                            const tokens = param.split('+');
                            if (tokens[tokens.length - 1] === ' 1)') {
                                delete tokens[tokens.length - 1];
                                param = tokens.join('+');
                                param = param.substring(1, param.length - 2);
                            } else {
                                param += ' - 1';
                            }
                        }
                    }

                    if (textParam && textParam.paramType === 'integer') {
                        if (Entry.Utils.isNumber(param) && Entry.isFloat(param)) {
                            result = result.replace('randint', 'uniform');
                        }
                    }

                    result += param;
                    break;
                }
                default: {
                   
                    const textParam = textParams && textParams[index];

                    let param;
                    if (textParam && textParam.type) {
                        param = this[`Field${textParam.type}`](dataParams[index], textParam);
                    } else {
                        param = this[`Field${schemaParams[index].type}`](
                            dataParams[index],
                            textParam
                        );
                    }

                    

                    // 필드 블록이 아닌 블록에 내재된 파라미터 처리
                    if (
                        !Entry.Utils.isNumber(param) &&
                        (block.type === 'when_some_key_pressed' ||
                            block.type === 'is_press_some_key')
                    ) {
                        result += `"${param}"`;
                    } 
                    
                    else {
                        result += param;
                    }

                    
                   
                    break;
                }
            }
        }
        return result;
    }

    searchSyntax(datum) {
        let schema;
        let appliedParams;

        if (datum instanceof Entry.BlockView) {

            schema = datum.block._schema;
            appliedParams = datum.block.data.params;
        } else if (datum instanceof Entry.Block) {
            
            schema = datum._schema;
            appliedParams = datum.params;

        } else {
            
            schema = datum;
        }

        if (schema && schema.syntax) {

            const syntaxes = schema.syntax.c.concat();

            while (syntaxes.length) {
                let isFail = false;
                const syntax = syntaxes.shift();
                                
                if (typeof syntax === 'string') {
                    return { syntax, template: syntax };
                }

                if (syntax.params) {
                    for (let i = 0; i < syntax.params.length; i++) {
                        if (syntax.params[i] && syntax.params[i] !== appliedParams[i]) {
                            isFail = true;
                            break;
                        }
                    }
                }
                if (!syntax.template) {
                    syntax.template = syntax.syntax;
                }
                if (isFail) {
                    continue;
                }
                return syntax;
            }
        }
        return null;
    }

    FieldAngle(dataParam, textParam) {
        if (textParam && textParam.converter) {
            dataParam = textParam.converter(dataParam);
        }

        return dataParam;
    }

    FieldColor(dataParam, textParam) {
        if (textParam && textParam.converter) {
            dataParam = textParam.converter(null, dataParam);
        }
        return dataParam;
    }

    FieldDropdown(dataParam, textParam) {
        if (typeof dataParam === 'object') {
            return 'None'.replace(/\"/gm, '');
        }

        if (textParam && textParam.converter && textParam.options) {
            const options = textParam.options;
            for (const i in options) {
                const key = options[i][0];
                const value = options[i][1];
                if (dataParam == value) {
                    return (dataParam = textParam.converter(key, value));
                }
            }
            dataParam = textParam.converter(dataParam, dataParam);
        }

        return dataParam;
    }

    FieldDropdownDynamic(dataParam, textParam) {
        if (typeof dataParam === 'object') {
            return 'None'.replace(/\"/gm, '');
        }

        if (textParam && textParam.converter && textParam.options) {
            const options = textParam.options;
            for (const i in options) {
                let key = options[i][0];
                const value = options[i][1];
                if (dataParam == value) {
                    const name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                        value,
                        textParam.menuName
                    );
                    if (name) {
                        key = name;
                    }
                    return (dataParam = textParam.converter(key, value));
                }
            }
            const value = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                dataParam,
                textParam.menuName
            );
            if (value) {
                dataParam = textParam.converter(value, value);
            } else {
                dataParam = textParam.converter(dataParam, dataParam);
            }

            const reg = /None/;
            if (reg.test(dataParam)) {
                dataParam = dataParam.replace(/\"/gm, '');
            }
        }

        return dataParam;
    }

    FieldImage(dataParam, textParam) {
        if (textParam && textParam.converter) {
            dataParam = textParam.converter(null, dataParam);
        }

        return dataParam;
    }

    FieldIndicator(dataParam, textParam) {
        return dataParam;
    }

    FieldKeyboard(dataParam, textParam) {
        const reg = /None/;
        if (reg.test(dataParam)) {
            return dataParam.replace(/\"/gm, '');
        }

        const map = Entry.KeyboardCode.map;
        for (const key in map) {
            const value = map[key];
            if (value == dataParam) {
                dataParam = key;
                break;
            }
        }

        if (textParam && textParam.converter) {
            dataParam = textParam.converter(dataParam, null);
        }

        dataParam = dataParam.toLowerCase();
        return dataParam;
    }

    FieldOutput(dataParam, textParam) {
        return dataParam;
    }

    FieldText(dataParam, textParam) {
        if (textParam && textParam.converter) {
            dataParam = textParam.converter(null, dataParam);
        }

        return dataParam;
    }

    FieldTextInput(dataParam, textParam) {
        if (typeof dataParam !== 'number') {
            dataParam = dataParam.replace('\t', '    ');
            const spaces = dataParam.split(/ /);

            if (dataParam.length == spaces.length - 1) {
                dataParam = '"()"'.replace('()', dataParam);
            }
        }

        if (textParam && textParam.converter) {
            dataParam = textParam.converter(null, dataParam);
        }

        return dataParam;
    }

    FieldNumber(dataParam, textParam) {
        if (textParam && textParam.converter) {
            dataParam = textParam.converter(null, dataParam);
        }

        return dataParam;
    }

    isFunc(block) {
        if (!block || !block.data || !block.data.type) {
            return false;
        }

        const tokens = block.data.type.split('_');
        const prefix = tokens[0];

        return prefix === 'func';
    }

    /**
     * 워크스페이스에 실제로 등록되어있는 함수인지 확인한다.
     * @param block
     * @returns {boolean}
     */
    isRegisteredFunc(block) {
        const tokens = block.data.type.split('_');
        const funcId = tokens[1];
        return !!Entry.variableContainer.functions_[funcId];
    }

    isFuncStmtParam(block) {
        if (!block || !block.data || !block.data.type) {
            return false;
        }
        const blockType = block.data.type;
        const tokens = blockType.split('_');
        const prefix = tokens[0];

        return prefix === 'stringParam' || prefix === 'booleanParam';
    }

    /**
     * functionTemplate 에서 파이선에서 표기될 함수를 만들어낸다.
     * ex) 함수 %1 %2 %3 + %3 이 Indicator 인 경우 => 함수(%1, %2)
     * @param funcBlock{Block} 함수 블록
     * @return {string} 파이선 함수 호출 syntax
     */
    makeFuncSyntax(funcBlock) {
        let schemaTemplate = '';

        if (funcBlock) {
            if (funcBlock._schema) {
                if (funcBlock._schema.template) {
                    schemaTemplate = funcBlock._schema.template.trim();
                }
            } else if (this._hasRootFunc) {
                const rootFunc = Entry.block[this._rootFuncId];
                schemaTemplate = rootFunc.block.template;
            }
        }

        const templateParams = schemaTemplate.trim().match(/%\d/gim);
        templateParams.pop(); // pop() 이유는 맨 마지막 템플릿은 Indicator 로 판단할 것이기 때문이다.

        return Entry.TextCodingUtil.getFunctionNameFromTemplate(schemaTemplate)
            .trim()
            .concat(`(${templateParams.join(',')})`);
    }

    makeFuncDef(funcBlock, isExpression) {
        if (!this.isRegisteredFunc(funcBlock)) {
            return;
        }

        let result = '';
        const func = this.getFuncInfo(funcBlock);

        if (func) {
            result += func.name;
        } else {
            return;
        }

        let paramResult = '';
        if (func.params && func.params.length !== 0) {
            paramResult = func.params.join(', ').trim();
        }
        result = result
            .concat('(')
            .concat(paramResult)
            .concat(')');

        if (isExpression) {
            // 선언된 함수 사용하는 블록의 경우
            const expBlockComment = funcBlock.getCommentValue();
            if (expBlockComment || expBlockComment === '') {
                result += ` # ${expBlockComment}`;
            }
            return result;
        } else {
            // 함수 선언 중인 경우
            this._hasRootFunc = true;

            result = `def ${result}`;
            result = result.concat(':');
            if (func.comment || func.comment === '') {
                result += ` # ${func.comment}`;
            }
            result += '\n';

            if (func.statements && func.statements.length) {
                let stmtResult = '';
                for (const s in func.statements) {
                    const block = func.statements[s];

                    if (this.getFuncInfo(block)) {
                        stmtResult += this.makeFuncDef(block, true).concat('\n');
                    } else {
                        stmtResult += this.Block(block).concat('\n');
                    }
                }
                result += Entry.TextCodingUtil.indent(stmtResult).concat('\n');
            }

            return result.trim();
        }
    }

    getFuncInfo(funcBlock) {
        const result = {};
        const funcId = funcBlock.getFuncId();

        const func = funcId && Entry.variableContainer.getFunction(funcId);
        if (!func) {
            return null;
        }

        const funcName = Entry.TextCodingUtil.getFunctionNameFromTemplate(func.block.template);

        Entry.TextCodingUtil.initQueue();

        const funcContents = func.content
            .getEventMap('funcDef')[0]
            .getThread()
            .getBlocks();
        const defBlock = funcContents.shift();

        const funcComment = defBlock.getCommentValue();

        Entry.TextCodingUtil.gatherFuncDefParam(defBlock.getParam(0));

        const that = this;
        const funcParams = [];

        if (!this._hasRootFunc) {
            const funcDefParams = [];
            let param;
            while ((param = Entry.TextCodingUtil._funcParamQ.dequeue())) {
                funcDefParams.push(param);
            }

            funcDefParams.forEach((value, index) => {
                if (/(string|boolean)Param/.test(value)) {
                    index += 1;
                    const name = `param${index}`;
                    funcParams.push(name);
                    that._funcParamMap.put(value, name);
                }
            });
        } else {
            funcBlock.params
                .filter((p) => p instanceof Entry.Block)
                .forEach((p) => {
                    let paramText = that.Block(p);
                    if (!paramText) {
                        return;
                    }
                    paramText = that._funcParamMap.get(paramText) || paramText;
                    funcParams.push(paramText);
                });
        }

        Entry.TextCodingUtil.clearQueue();

        if (funcName) {
            result.name = funcName;
        }
        if (funcComment || funcComment === '') {
            result.comment = funcComment;
        }
        if (funcParams.length !== 0) {
            result.params = funcParams;
        }
        if (funcContents.length !== 0) {
            result.statements = funcContents;
        }

        return result;
    }
};
