//dependancies
// from moduleInformation.js
const defineValue = {
    TRUE: 100,
    FALSE: 0,
    JOYSTICK_UP: 20,
    JOYSTICK_DOWN: 30,
    JOYSTICK_LEFT: 40,
    JOYSTICK_RIGHT: 50,
    JOYSTICK_UNPRESSED: 0,
    TIMER_REACHED: 100,
    TIMER_UNREACHED: 0,
    BUZZER_ON: 100,
    BUZZER_OFF: 0,
    CAMERA_PICTURE: 100,
    F_DO_1: 32,
    F_RE_1: 36,
    F_MI_1: 41,
    F_PA_1: 43,
    F_SOL_1: 48,
    F_RA_1: 55,
    F_SI_1: 61,
    F_DO_S_1: 34,
    F_RE_S_1: 39,
    F_PA_S_1: 46,
    F_SOL_S_1: 52,
    F_RA_S_1: 58,
    F_DO_2: 65,
    F_RE_2: 73,
    F_MI_2: 82,
    F_PA_2: 87,
    F_SOL_2: 97,
    F_RA_2: 110,
    F_SI_2: 123,
    F_DO_S_2: 69,
    F_RE_S_2: 77,
    F_PA_S_2: 92,
    F_SOL_S_2: 103,
    F_RA_S_2: 116,
    F_DO_3: 130,
    F_RE_3: 146,
    F_MI_3: 165,
    F_PA_3: 174,
    F_SOL_3: 196,
    F_RA_3: 220,
    F_SI_3: 247,
    F_DO_S_3: 138,
    F_RE_S_3: 155,
    F_PA_S_3: 185,
    F_SOL_S_3: 207,
    F_RA_S_3: 233,
    F_DO_4: 261,
    F_RE_4: 293,
    F_MI_4: 329,
    F_PA_4: 349,
    F_SOL_4: 392,
    F_RA_4: 440,
    F_SI_4: 493,
    F_DO_S_4: 277,
    F_RE_S_4: 311,
    F_PA_S_4: 369,
    F_SOL_S_4: 415,
    F_RA_S_4: 466,
    F_DO_5: 523,
    F_RE_5: 587,
    F_MI_5: 659,
    F_PA_5: 698,
    F_SOL_5: 783,
    F_RA_5: 880,
    F_SI_5: 988,
    F_DO_S_5: 554,
    F_RE_S_5: 622,
    F_PA_S_5: 739,
    F_SOL_S_5: 830,
    F_RA_S_5: 932,
    F_DO_6: 1046,
    F_RE_6: 1174,
    F_MI_6: 1318,
    F_PA_6: 1397,
    F_SOL_6: 1567,
    F_RA_6: 1760,
    F_SI_6: 1975,
    F_DO_S_6: 1108,
    F_RE_S_6: 1244,
    F_PA_S_6: 1479,
    F_SOL_S_6: 1661,
    F_RA_S_6: 1864,
    F_DO_7: 2093,
    F_RE_7: 2349,
    F_MI_7: 2637,
    F_PA_7: 2793,
    F_SOL_7: 3135,
    F_RA_7: 3520,
    F_SI_7: 3951,
    F_DO_S_7: 2217,
    F_RE_S_7: 2489,
    F_PA_S_7: 2959,
    F_SOL_S_7: 3322,
    F_RA_S_7: 3729
};


// from util.js
Number.prototype.toUint8Array = function () {
    var result = [];
    var hexString = this.toString(16);
    while (hexString.length >= 1) {
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    return result.reverse();
};


function Stack() {
    //스택의 요소가 저장되는 배열
    this.dataStore = [];

    //스택의 위치
    this.top = -1;

    //스택에 요소를 추가
    this.push = function (element) {
        this.top = this.top + 1;
        this.dataStore[this.top] = element;
    };

    //스택의 꼭대기의 요소를 반환한다.
    //단 top이 감소하는것은 아니다.
    this.peek = function () {
        return this.dataStore[this.top];
    };

    //스택 최상층의 요소를 반환한다.
    this.pop = function () {
        //Stack underflow
        if (this.top <= -1) {
            console.log("Stack underflow!!!");
            return;
        } else {
            var popped = this.dataStore[this.top];
            //top을 1 감소시킨다.
            this.top = this.top - 1;
            return popped;
        }
    };

    //스택의 전체 요소를 삭제한다.
    this.clear = function () {
        this.top = -1;
    };

    //스택에 저장된 데이터 수
    this.length = function () {
        return this.top + 1;
    };
}

// dependancies end




/**
 * Stack을 구현한 class
 * @class Stack
 */
function Stack() {
    //스택의 요소가 저장되는 배열
    this.dataStore = [];

    //스택의 위치
    this.top = -1;

    //스택에 요소를 추가
    this.push = function (element) {
        this.top = this.top + 1;
        this.dataStore[this.top] = element;
    };

    //스택의 꼭대기의 요소를 반환한다.
    //단 top이 감소하는것은 아니다.
    this.peek = function () {
        return this.dataStore[this.top];
    };

    //스택 최상층의 요소를 반환한다.
    this.pop = function () {
        //Stack underflow
        if (this.top <= -1) {
            console.log("Stack underflow!!!");
            return;
        } else {
            var popped = this.dataStore[this.top];
            //top을 1 감소시킨다.
            this.top = this.top - 1;
            return popped;
        }
    };

    //스택의 전체 요소를 삭제한다.
    this.clear = function () {
        this.top = -1;
    };

    //스택에 저장된 데이터 수
    this.length = function () {
        return this.top + 1;
    };
}


/**
 * interpreter 관리하는 모듈
 * @module interpreter
 */


const FrameType = {
    NONE: -1,

    // document
    DOCUMENT: 0,
    SETUP: 1,
    CODE: 2,

    // variable
    VALUE: 10,
    OPERATOR: 11,
    VARIABLE: 12,

    // module / sleep
    FUNCTION_GET_VALUE: 20,
    FUNCTION_SET_VALUE: 21,

    VARIABLE_GET_VALUE: 25,
    VARIABLE_SET_VALUE: 26,

    DELAY: 30,

    // logic
    IF: 50,
    WHILE: 51,
    LOOP: 52,
    CONDITION: 55,
    CHILD: 56,

    BREAK: 60,
    CONTINUE: 61
};

const ValueType = {
    NONE: -1,

    NUMBER: 1,
    STRING: 2,
    PICTURE: 3
};

const OperatorType = {
    NONE: -1,

    PREFIX_INCREMENT: 0, // ++a
    PREFIX_DECREMENT: 1, // ––a
    POSTFIX_INCREMENT: 2, // a++
    POSTFIX_DECREMENT: 3, // a--

    ASSIGNMENT: 10, // =
    ADDITION: 11, // a + b
    SUBTRACTION: 12, // a - b
    MULTIPLICATION: 13, // a * b
    DIVISION: 14, // a / b
    MODULUS: 15, // a % b

    LESS_THAN: 20, // a < b
    GREATER_THAN: 21, // a > b
    LESS_THAN_OR_EQUAL_TO: 22, // a <= b
    GREATER_THAN_OR_EQUAL_TO: 23, // a >= b
    EQUALITY: 24, // a == b
    INEQUALITY: 25, // a != b

    LOGICAL_NOT: 30, // !a
    LOGICAL_AND: 31, // a && b
    LOGICAL_OR: 32, // a || b

    BITWISE_NOT: 40, // ~a
    BITWISE_AND: 41, // a & b
    BITWISE_OR: 42, // a | b
    BITWISE_XOR: 43, // a ^ b
    BITWISE_LEFT_SHIFT: 44, // a << b
    BITWISE_RIGHT_SHIFT: 45 // a >> b
};

const IfType = {
    if: 0,
    elseIf: 1,
    else: 2
};

function stringToOperatorType(type) {
    var result = -1;

    switch (type) {
        case "<":
            result = OperatorType.LESS_THAN;
            break;
        case ">":
            result = OperatorType.GREATER_THAN;
            break;
        case "<=":
            result = OperatorType.LESS_THAN_OR_EQUAL_TO;
            break;
        case ">=":
            result = OperatorType.GREATER_THAN_OR_EQUAL_TO;
            break;
        case "==":
            result = OperatorType.EQUALITY;
            break;
        case "!=":
            result = OperatorType.INEQUALITY;
            break;
        case "&&":
            result = OperatorType.LOGICAL_AND;
            break;
        case "||":
            result = OperatorType.LOGICAL_OR;
            break;
    }

    return result;
}

const Property = {
    // input
    button: {
        getClick: 2,
        getDoubleClick: 3,
        getPressStatus: 4,
        getToggle: 5
    },

    dial: {
        getTurn: 2,
        getTurnSpeed: 3
    },

    ir: {
        getProximity: 2
    },

    ultrasonic: {
        getDistance: 2
    },

    environment: {
        getTemperature: 6,
        getHumidity: 7,
        getIlluminance: 2,
        getRed: 3,
        getGreen: 4,
        getBlue: 5
    },

    gyro: {
        getRoll: 2,
        getPitch: 3,
        getYaw: 4,
        getAcclerationX: 8,
        getAcclerationY: 9,
        getAcclerationZ: 10,
        getAugularVelocityX: 5,
        getAugularVelocityY: 6,
        getAugularVelocityZ: 7,
        getVibration: 11
    },

    mic: {
        getVolume: 2,
        getFrequency: 3
    },

    // output
    motor: {
        getAngleUpper: 4,
        getSpeedUpper: 3,
        getTorqueUpper: 2,
        getAngleBottom: 12,
        getSpeedBottom: 11,
        getTorqueBottom: 10,

        setAngleUpper: 4,
        setSpeedUpper: 3,
        setTorqueUpper: 2,
        setAngleBottom: 12,
        setSpeedBottom: 11,
        setTorqueBottom: 10,

        setAngle: 18,
        setSpeed: 17,
        setTorque: 16
    },

    led: {
        getRed: 2,
        getGreen: 3,
        getBlue: 4,
        setRgb: 16
    },

    speaker: {
        getVolume: 2,
        getFrequency: 3,
        setTune: 16
    },

    display: {
        addPicture: 27,
        drawPicture: 19,
        setVariable: 22,
        setText: 17,
        setHorizontal: 25,
        setVertical: 26,
        setReset: 21
    },

    // setup
    network: {
        getReceiveData: 2,
        getMobileEvent: 3,
        getButtonPressed: 3,
        getJoystickDirection: 3,
        getLeftSliderPosition: 5,
        getRightSliderPosition: 6,
        getDialTurn: 4,
        getTimerReached: 7,
        sendData: 2,
        setCamera: 0x100,
        setBuzzer: 0x101
    }
};


const define = defineValue;
let newObj = {}
const regex = {
    userTask: /void\s*doUserTask\s*\([\x20-\x7E\s]*?\)\s*\{([\x20-\x7E\s]*)\}/, // void doUserTask() {...}

    setup: {
        modules: /([\w]*)\s([\w]+)\(([\w]+)\);/g, // Network network0(0x123456);
        variables: /([\w]+)\s([\w]+)\s\=\s([\w.]+);/g, // float number0 = 0.0;
        pictures: /const\schar\s(\w*)\[385\]\s=\s\{([\w,\s]*)\};/g // const char picture0[385] = {0x00, 0x12, 0x34};
    },

    block: {
        comment: /\/\/([\x20-\x7E\s]*)/,

        module: /([\w]+)\s([\w]+)\(([\w]+)\);/, // Network network0(0x123456);

        if: /^if\s*\(([\x20-\x7E]*)\)/,
        elseIf: /^else if\s*\(([\x20-\x7E]*)\)/, // else if(motor0.getUpperSpeed() < 30)
        while: /^while\s*\(([\x20-\x7E]*)\)/, // while(number0)
        for: /^for\s*\(([\x20-\x7E]*);([\x20-\x7E]*);([\x20-\x7E]*)\)/, // for(int i=0; i<gyro0.getRoll(); i++)
        condition: /([\x20-\x7E]*)(==|>=|<=|!=|>|<)([\x20-\x7E]*)/, // button0.getClick()==40

        setProperty: /^([\w]*)\.([\w]*)\s*\(([\x20-\x7E]+)?\);/, // led0.setRgb(0, 50, 100)
        getProperty: /([\w]*)\.([\w]*)\s\(\)/, // button.getClick()
        sleep: /^sleep\s*\(([\x20-\x7E]*)\);/, // sleep(50),
        break: /^break;/, // break
        continue: /^continue;/, // continue
        setVariable: /^([\w]*) = ([\x20-\x7E]*);/, // number0 = 50 + 12
        variable: /^\(char\*\)([\w]*)|([\w]*)/, // picture0, (char*)picture0
        string: /^"([\x20-\x7E]*)"/, // "MODI"
        number: /^(\s*[-0-9.]+)/ // 8421
    }
};

function makeFrame(luxc) {
    var setup = getSetupBlock(luxc);
    var code = getCodeBlock(luxc);
    var result = {
        block: [],
        errorCode: ""
    };

    if (code.errorCode === 0) {
        var document = new DocumentBlock(setup, code.block);
        result.block = document.serialize();
        result.errorCode = false;
    } else {
        result.errorCode = code.errorCode;
    }

    return result;
}

function getSetupBlock(luxc) {
    var setupList = [];
    var match;

    while ((match = regex.setup.variables.exec(luxc))) {
        var name = match[2];
        var data = Number(match[3]);
        setupList.push(new Variable(new StringValue(name), new NumberValue(data)));
    }

    while ((match = regex.setup.pictures.exec(luxc))) {
        var name = match[1];
        var data = [];
        match[2].split(",").forEach(function (pixel) {
            data.push(Number(pixel));
        });
        setupList.push(new Variable(new StringValue(name), new PictureValue(data)));
    }

    return new SetupBlock(setupList);
}

function getCodeBlock(luxc) {
    var userTask = regex.userTask.exec(luxc);
    var errorCode = 0;
    var modules = {};

    try {
        if (userTask) {
            var codeLines = userTask[1]
                .replace(/\t/g, "")
                .split("\n")
                .filter(Boolean);

            var logicStack = new Stack(); //new util.Stack();
            var blocks = [];

            codeLines.forEach(function (code) {
                code = code.replace(/^\s*/, "")
                try {
                    var match = null;
                    if ((match = regex.block.comment.exec(luxc))) {
                        return true;
                    }

                    if ((match = regex.block.module.exec(code))) {
                        var type = match[1].toLowerCase();
                        var name = match[2];
                        var uuid = Number(match[3]);
                        modules[name] = {
                            type: type,
                            name: name,
                            uuid: uuid
                        };
                    } else if ((match = regex.block.if.exec(code))) {
                        var conditions = convertArgumentToConditionBlocks(match[1]);
                        var block = new IfBlock(IfType.if, conditions);
                        logicStack.push(block);
                    } else if ((match = regex.block.elseIf.exec(code))) {
                        var conditions = convertArgumentToConditionBlocks(match[1]);
                        var block = new IfBlock(IfType.elseIf, conditions);
                        logicStack.push(block);
                    } else if (code === "else") {
                        var block = new IfBlock(IfType.else);
                        logicStack.push(block);
                    } else if ((match = regex.block.while.exec(code))) {
                        var conditions = convertArgumentToConditionBlocks(match[1]);
                        var block = new WhileBlock(conditions);
                        logicStack.push(block);
                    } else if ((match = regex.block.for.exec(code))) {
                        var conditions = convertArgumentToConditionBlocks(match[2]);
                        var block = new LoopBlock(conditions);
                        logicStack.push(block);
                    } else if ((match = regex.block.setVariable.exec(code))) {
                        var variableName = match[1];
                        var polynomial = convertPolynomial(match[2], modules);
                        var block = new VariableSetValue(
                            new StringValue(variableName),
                            new StringValue(polynomial)
                        );
                        if (logicStack.length()) {
                            var logic = logicStack.peek();
                            logic.addChild(block);
                        } else {
                            blocks.push(block);
                        }
                    } else if ((match = regex.block.setProperty.exec(code))) {
                        var name = match[1];
                        if (modules[name]) {
                            var type = modules[name].type;
                            var uuid = modules[name].uuid;
                            var property = Property[type][match[2]];
                            var argumentsBlocks = [];
                            if (match.length > 3) {
                                if (match[3]) {
                                    argumentsBlocks = convertArgumentToBlocks(match[3]);
                                }
                            }

                            var block = new FunctionSetValue(uuid, property, argumentsBlocks);
                            if (logicStack.length()) {
                                var logic = logicStack.peek();
                                logic.addChild(block);
                            } else {
                                blocks.push(block);
                            }
                        } else {
                            throw "'" + name + "' was not declared in this scope";
                        }
                    } else if ((match = regex.block.sleep.exec(code))) {
                        var argumentsBlock = convertValueToBlock(match[1]);
                        var block = new SleepBlock(argumentsBlock);
                        if (logicStack.length()) {
                            var logic = logicStack.peek();
                            logic.addChild(block);
                        } else {
                            blocks.push(block);
                        }
                    } else if (regex.block.break.test(code)) {
                        var block = new BreakBlock();
                        if (logicStack.length()) {
                            var logic = logicStack.peek();
                            logic.addChild(block);
                        } else {
                            blocks.push(block);
                        }
                    } else if (regex.block.continue.test(code)) {
                        var block = new ContinueBlock();
                        if (logicStack.length()) {
                            var logic = logicStack.peek();
                            logic.addChild(block);
                        } else {
                            blocks.push(block);
                        }
                    } else if (code == "{") {
                    } else if (code == "}") {
                        var block = logicStack.pop();
                        if (logicStack.length()) {
                            var peek = logicStack.peek();
                            peek.addChild(block);
                        } else {
                            blocks.push(block);
                        }
                    }
                } catch (e) {
                    throw code;
                }
            });
        }
    } catch (e) {
        errorCode = e;
    }

    console.log(blocks);

    return {
        block: new CodeBlock(blocks),
        errorCode: errorCode
    };
}

function convertPolynomial(src, modules) {
    var reg = new RegExp(regex.block.getProperty, "g");
    var result = src.replace(reg, function (word) {
        var match = regex.block.getProperty.exec(word);

        if (match) {
            var type = modules[match[1]].type;
            var uuid = modules[match[1]].uuid;
            var property = Property[type][match[2]];
            var id = uuid & 0xfff;
            return "getProperty(" + id + "," + property + ")";
        } else {
            return word;
        }
    });

    return result;
}

function convertArgumentToConditionBlocks(args) {
    var conditions = [];
    var splited = args.split(/&&|\|\|/);
    var logicsRegex = /(\&\&|\|\|)/g;
    var nexts = logicsRegex.exec(args);

    splited.forEach(function (conditionString, index) {
        var value1;
        var operator;
        var value2;
        if (conditionString.indexOf("true") !== -1) {
            value1 = new NumberValue(1);
            operator = new Operator("==");
            value2 = new NumberValue(1);
        } else {
            var match = regex.block.condition.exec(conditionString);
            value1 = convertValueToBlock(match[1]);
            operator = new Operator(match[2]);
            value2 = convertValueToBlock(match[3]);
        }
        if (nexts) {
            var next = new Operator(nexts[index]);
            conditions.push(new ConditionBlock(value1, operator, value2, next));
        } else {
            conditions.push(new ConditionBlock(value1, operator, value2));
        }
    });

    return conditions;
}

function convertArgumentToBlocks(args) {
    var blocks = [];
    var datas = args.split(",");
    datas.forEach(function (data) {
        blocks.push(convertValueToBlock(data));
    });
    return blocks;
}

function convertValueToBlock(arg) {
    var block = null;
    var match = null;

    if (!arg) {
        throw "arguments error";
    } else {
        for (let [key, value] of Object.entries(define)) {
            var reg = new RegExp(key, "g");
            arg = arg.replace(reg, value);
        }

        if ((match = regex.block.getProperty.exec(arg))) {
            var uuid = Number(map.getUuid(match[1]));
            var type = map.getType(uuid);
            var property = Property[type][match[2]];
            block = new FunctionGetValue(uuid, property);
        } else if ((match = regex.block.number.exec(arg))) {
            var number = Number(match[1]);
            block = new NumberValue(number);
        } else if ((match = regex.block.string.exec(arg))) {
            var string = match[1].toString();
            block = new StringValue(string);
        } else if ((match = regex.block.variable.exec(arg))) {
            var variableName;
            if (arg.indexOf("(char*)") !== -1) {
                variableName = match[1].replace(/\(char\*\)/, "");
            } else {
                variableName = match[2];
            }
            block = new VariableGetValue(new StringValue(variableName));
        }
    }
    return block;
}

class Block {
    constructor(type, uuid) {
        this.type = type;
        this.uuid = uuid;
        this.childs = [];
        this.frames = [];
    }

    setType(type) {
        this.type = type;
    }
    getType() {
        return this.type;
    }

    setUuid(uuid) {
        this.uuid = uuid;
    }
    getUuid() {
        return this.uuid;
    }

    setFrames(frames) {
        this.frames = frames;
    }
    appendFrame(frame) {
        this.frames.push(frame);
    }
    appendFrames(frames) {
        this.frames = this.frames.concat(frames);
    }
    getFrames() {
        return this.frames;
    }
    clearFrames() {
        this.frames.clear();
    }

    addChild(child) {
        this.childs.push(child);
        return this;
    }

    getChilds() {
        return this.childs;
    }

    makeFrames() {
        var result = [];
        var childsResult = [];
        var blockSize = 0;

        this.frames.forEach(function (frame) {
            blockSize += frame.length;
            result.push(frame);
        });

        if (this.childs.length !== 0) {
            var childsSize = 0;

            this.childs.forEach(function (child) {
                var frames = child.makeFrames();
                frames.forEach(function (frame) {
                    childsSize += frame.length;
                    childsResult.push(frame);
                });
            });

            childsResult.unshift([
                FrameType.CHILD,
                0x01,
                childsSize & 0xff,
                (childsSize >> 8) & 0xff
            ]);

            childsResult.push([FrameType.CHILD, 0x00]);

            blockSize += childsSize + 6;
            result = result.concat(childsResult);
        }

        result.unshift([this.type, 0x01, blockSize & 0xff, (blockSize >> 8) & 0xff]);

        result.push([this.type, 0x00]);

        return result;
    }

    serialize() {
        var frames = this.makeFrames();
        var serialized = [];
        frames.forEach(function (data) {
            serialized = serialized.concat(data);
        });
        return serialized;
    }
}

class DocumentBlock extends Block {
    constructor(setup, code) {
        super(FrameType.DOCUMENT, 0);
        this.appendFrame(setup.serialize());
        this.appendFrame(code.serialize());
    }
}

class SetupBlock extends Block {
    constructor(variables) {
        super(FrameType.SETUP, 0);
        for (var i = 0; i < variables.length; i++) {
            this.appendFrame(variables[i].serialize());
        }
    }
}

class CodeBlock extends Block {
    constructor(blocks) {
        super(FrameType.CODE, 0);
        for (var i = 0; i < blocks.length; i++) {
            this.appendFrame(blocks[i].serialize());
        }
    }
}

class NumberValue extends Block {
    constructor(value) {
        super(FrameType.VALUE, 0);
        var frame = [];
        var dataView = new DataView(new ArrayBuffer(4));
        dataView.setFloat32(0, value);
        frame.push(ValueType.NUMBER);
        for (var i = 0; i < 4; i++) {
            frame.push(dataView.getUint8(3 - i));
        }
        this.value = value;
        this.appendFrame(frame);
    }
}

class StringValue extends Block {
    constructor(value) {
        super(FrameType.VALUE, 0);
        var frame = [];
        frame.push(ValueType.STRING);
        for (var i = 0; i < value.length; i++) {
            frame.push(value.charCodeAt(i));
        }
        this.value = value;
        this.appendFrame(frame);
    }
}

class PictureValue extends Block {
    constructor(value) {
        super(FrameType.VALUE, 0);
        var frame = [];
        frame.push(ValueType.PICTURE);
        for (var i = 0; i < value.length; i++) {
            frame.push(value[i]);
        }
        this.value = value;
        this.appendFrame(frame);
    }
}

class Variable extends Block {
    constructor(name, value) {
        super(FrameType.VARIABLE, 0);
        this.appendFrame(name.serialize());
        this.appendFrame(value.serialize());
    }
}

class FunctionGetValue extends Block {
    constructor(uuid, property) {
        super(FrameType.FUNCTION_GET_VALUE, uuid);
        var uuidArray = uuid.toUint8Array();
        var propertyArray = property.toUint8Array();
        var frame = [];
        for (var i = 0; i < 6; i++) {
            var data = uuidArray[i] ? uuidArray[i] : 0x00;
            frame.push(data);
        }
        for (var i = 0; i < 2; i++) {
            var data = propertyArray[i] ? propertyArray[i] : 0x00;
            frame.push(data);
        }
        this.property = property;
        this.appendFrame(frame);
    }
}

class FunctionSetValue extends Block {
    constructor(uuid, property, values) {
        super(FrameType.FUNCTION_SET_VALUE, uuid);
        this.property = property;
        this.values = values;
        var uuidArray = uuid.toUint8Array();
        var propertyArray = property.toUint8Array();
        var frame = [];
        for (var i = 0; i < 6; i++) {
            var data = uuidArray[i] ? uuidArray[i] : 0x00;
            frame.push(data);
        }
        for (var i = 0; i < 2; i++) {
            var data = propertyArray[i] ? propertyArray[i] : 0x00;
            frame.push(data);
        }

        frame.push(values.length);
        this.appendFrame(frame);
        for (var i = 0; i < values.length; i++) {
            this.appendFrame(values[i].serialize());
        }
    }
}

class VariableGetValue extends Block {
    constructor(name) {
        super(FrameType.VARIABLE_GET_VALUE, 0);
        this.appendFrame(name.serialize());
    }
}

class VariableSetValue extends Block {
    constructor(name, args) {
        super(FrameType.VARIABLE_SET_VALUE, 0);
        this.appendFrame(name.serialize());

        for (var i = 0; i < args.length; i++) {
            this.appendFrame(args[i].serialize());
        }
    }
}

class SleepBlock extends Block {
    constructor(value) {
        super(FrameType.DELAY, 0);
        this.appendFrame(value.serialize());
    }
}

class ConditionBlock extends Block {
    constructor(value, operator, match, next) {
        super(FrameType.CONDITION, 0);
        this.value = value;
        this.operator = operator;
        this.match = match;
        this.appendFrame(value.serialize());
        this.appendFrame(operator.serialize());
        this.appendFrame(match.serialize());
        if (next) {
            this.next = next;
            this.appendFrame(next.serialize());
        }
    }
}

class Operator extends Block {
    constructor(type) {
        super(FrameType.OPERATOR, 0);
        if (typeof type === "string") {
            type = stringToOperatorType(type);
        }
        this.operatorType = type;
        this.appendFrame([type]);
    }
}

class IfBlock extends Block {
    constructor(type, conditions) {
        super(FrameType.IF, 0);
        this.appendFrame([type]);
        if (type !== IfType.else) {
            this.conditions = conditions;
            for (var i = 0; i < conditions.length; i++) {
                this.appendFrame(conditions[i].serialize());
            }
        }
    }
}

class WhileBlock extends Block {
    constructor(conditions) {
        super(FrameType.WHILE, 0);
        this.conditions = conditions;
        for (var i = 0; i < conditions.length; i++) {
            this.appendFrame(conditions[i].serialize());
        }
    }
}

class LoopBlock extends Block {
    constructor(conditions) {
        super(FrameType.LOOP, 0);
        this.conditions = conditions;
        for (var i = 0; i < conditions.length; i++) {
            this.appendFrame(conditions[i].serialize());
        }
    }
}

class BreakBlock extends Block {
    constructor() {
        super(FrameType.BREAK, 0);
    }
}

class ContinueBlock extends Block {
    constructor() {
        super(FrameType.CONTINUE, 0);
    }
}

module.exports = {
    makeFrame
}