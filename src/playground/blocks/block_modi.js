'use strict';
Entry.MODI = {
    id: '16.1',
    name: 'modi',
    url: 'http://www.luxrobo.com/',
    imageName: 'modi.png',
    title: {
        ko: '모디',
        en: 'MODI',
    },
    setZero: function() {
        Entry.hw.sendQueue.moduleValue = {
            led: [],
            motor: [],
            speaker: [],
            display: [],
        };
        Entry.hw.sendQueue['getProperty'] = {};
        Entry.hw.getModule = {
            id: 0,
            property: 0,
        };
        Entry.hw.update();
    },
    initSend: function() {
        Entry.hw.sendQueue.moduleValue = {
            led: [],
            motor: [],
            speaker: [],
            display: [],
        };
        Entry.hw.sendQueue['getProperty'] = {};
        Entry.hw.getModule = {
            id: 0,
            property: 0,
        };
        Entry.hw.update();
    },
    getModule: {
        id: 0,
        property: 0,
    },
    microphoneList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['mic'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['mic'].length; i++) {
            if (moduleData['mic'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    environmentList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['environment'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['environment'].length; i++) {
            if (moduleData['environment'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    dialList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['dial'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['dial'].length; i++) {
            if (moduleData['dial'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    gyroscopeList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['gyro'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['gyro'].length; i++) {
            if (moduleData['gyro'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    buttonList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['button'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['button'].length; i++) {
            if (moduleData['button'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    infraredList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['ir'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['ir'].length; i++) {
            if (moduleData['ir'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    ultrasonicList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['ultrasonic'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['ultrasonic'].length; i++) {
            if (moduleData['ultrasonic'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    motorList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['motor'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }
        list = [];
        for (var i = 0; i < moduleData['motor'].length; i++) {
            if (moduleData['motor'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    ledList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['led'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['led'].length; i++) {
            if (moduleData['led'][i]) list.push([i, i]);
        }
        return list;
    },
    speakerList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['speaker'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['speaker'].length; i++) {
            if (moduleData['speaker'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    displayList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['display'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['display'].length; i++) {
            if (moduleData['display'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    displayImageList: function() {
        let list = EntryStatic.displayImage.list;
        return list;
    },
    speakerMelodyList: function() {
        let list = EntryStatic.speakerMelody.list;
        return list;
    }
};
Entry.MODI.blockMenuBlocks = [];
//region modi 모디
Entry.MODI.getBlocks = function() {
    return {
        modi_microphone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '마이크의 볼륨',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.microphoneList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'modi_microphone_value',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'microphone',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['mic'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                return pd.value[2];
            },

            syntax: { js: [], py: [''],
            
                c: [
                    {
                        syntax: 'microphone0.setReset();',
                        template: 'microphone0.setReset();',
                    },
                ],
            },
        },
        modi_environment_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '환경센서의 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.environmentList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_enviroment_temperature, 6],
                        [Lang.Blocks.modi_enviroment_humidity, 7],
                        [Lang.Blocks.modi_enviroment_illuminance, 2],
                        [Lang.Blocks.modi_enviroment_red, 3],
                        [Lang.Blocks.modi_enviroment_bule, 5],
                        [Lang.Blocks.modi_enviroment_green, 4],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 6],
                type: 'modi_environment_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'environment',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');
                var property = script.getNumberField('property');

                var pd = JSON.parse(Entry.hw.portData.module['environment'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[property]) {
                    pd.value[property] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Entry.MODI.getModule.property != property || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: property, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
                Entry.MODI.getModule.property = property;
            }*/
                }

                return pd.value[property];
            },

            
        },
        HW_DIAL_VALUE: {
            color: EntryStatic.colorSet.block.modi.INPUT,
            outerLine: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%1 다이얼의 위치  ',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/dial2.svg',
                    size: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['위치', 2]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 2],
                type: 'HW_DIAL_VALUE',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'dial',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['dial'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                var moduleID = JSON.parse(Entry.hw.portData.module['dial'][key]).id;
                var pd = JSON.parse(Entry.hw.portData.module['button'][key]);
                
                return pd.value[2];
            },

            syntax: {
                c: [
                    {
                        syntax: 'dial0.%2',
                        template: 'dial0.%2',
                    },
                ],
            },
        },
        // modi_gyroscope_value: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic_string_field',
        //     template: '자이로센서 %1번의 %2',
        //     params: [
        //         {
        //             type: 'DropdownDynamic',
        //             value: null,
        //             fontSize: 11,
        //             menuName: Entry.MODI.gyroscopeList,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Dropdown',
        //             options: [
        //                 ['Roll', 2],
        //                 ['Pitch', 3],
        //                 ['Yaw', 4],
        //                 [Lang.Blocks.modi_gyroscope_xAcceleratior, 8],
        //                 [Lang.Blocks.modi_gyroscope_yAcceleratior, 9],
        //                 [Lang.Blocks.modi_gyroscope_zAcceleratior, 10],
        //             ],
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //     ],
        //     def: {
        //         params: [null, 2],
        //         type: 'modi_gyroscope_value',
        //     },
        //     paramsKeyMap: {
        //         name: 0,
        //         property: 1,
        //     },
        //     class: 'gyroscope',
        //     isNotFor: ['modi'],
        //     func: function(sprite, script) {
        //         var key = script.getStringField('name');
        //         var property = script.getNumberField('property');

        //         var pd = JSON.parse(Entry.hw.portData.module['gyro'][key]);
        //         var moduleID = pd.id;

        //         if (!Entry.hw.sendQueue['getProperty']) {
        //             Entry.MODI.initSend();
        //         }
        //         if (!pd.value[property]) {
        //             pd.value[property] = 0;

        //             // send GETPROPERTY
        //             /*if(Entry.MODI.getModule.id != moduleID || Entry.MODI.getModule.property != property || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
        //         Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: property, id: moduleID});
        //         Entry.MODI.getModule.id = moduleID;
        //         Entry.MODI.getModule.property = property;
        //     }*/
        //         }

        //         return pd.value[property];
        //     },
        // },
        HW_BTN_VALUE: {
            color: EntryStatic.colorSet.block.modi.INPUT,
            outerLine: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%1 버튼의 %2',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/button2.svg',
                    size: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['클릭', '2'],
                        ['두 번 클릭', '3'],
                        ['누른 상태', '4'],
                        ['스위치', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, '2'],
                type: 'HW_BTN_VALUE',
            },
            paramsKeyMap: {
            
                property: 0,
            },
            class: 'button',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue || !Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                // var key = script.getStringField('name');
                var property = script.getNumberField('property');
                // var moduleID = JSON.parse(Entry.hw.portData.module['button'][key]).id;
                // var pd = JSON.parse(Entry.hw.portData.module['button'][key]);

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[property]) {
                    pd.value[property] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Entry.MODI.getModule.property != property || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: property, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
                Entry.MODI.getModule.property = property;
            }*/
                    return 0;
                }

                return pd.value[property];
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'button0.%2',
                        template: 'button0.%2',
                    },
                ],
            },
        },
        HW_BTN_MENU : {
            color: EntryStatic.colorSet.block.modi.INPUT,
            outerLine: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: ' %1 %2',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/button2.svg',
                    size: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['눌림', 'TRUE'],
                        ['안 눌림', 'FALSE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 'TRUE'],
                type: 'HW_BTN_MENU',
            },
            class: 'button',
            isNotFor: ['modi'],
            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '%2',
                        template: '%2',
                    },
                ],
            },
        },
        modi_button_true: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '눌림',
            def: {
                params: [null],
                type: 'modi_button_true',
            },
            class: 'button',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 100;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'TRUE',
                        template: 'TRUE',
                    },
                ],
            },
        },
        modi_button_false: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '안 눌림',
            def: {
                params: [null],
                type: 'modi_button_false',
            },
            class: 'button',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 0;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'FALSE',
                        template: 'FALSE',
                    },
                ],
            },
        },
        HW_IR_VALUE: {
            // color: EntryStatic.colorSet.block.default.HARDWARE,
            // outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            color: EntryStatic.colorSet.block.modi.INPUT,
            outerLine: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,

            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%1 적외선의 빛 반사량  ',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/ir2.svg',
                    size: 11,
                },
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.infraredList,
                    bgColor: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'HW_IR_VALUE',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'infrared',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['ir'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                return pd.value[2];
            },

            syntax: {
                c: [
                    {
                        syntax: 'ir0.getProximity()',
                        template: 'ir0.getProximity()',
                    },
                ],
            },
        },
        // modi_ultrasonic_value: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic_string_field',
        //     template: '초음파 %1번 센서의 거리(%)',
        //     params: [
        //         {
        //             type: 'DropdownDynamic',
        //             value: null,
        //             fontSize: 11,
        //             menuName: Entry.MODI.ultrasonicList,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //     ],
        //     def: {
        //         params: [null],
        //         type: 'modi_ultrasonic_value',
        //     },
        //     paramsKeyMap: {
        //         name: 0,
        //     },
        //     class: 'ultrasonic',
        //     isNotFor: ['modi'],
        //     func: function(sprite, script) {
        //         var key = script.getStringField('name');

        //         var pd = JSON.parse(Entry.hw.portData.module['ultrasonic'][key]);
        //         var moduleID = pd.id;

        //         if (!Entry.hw.sendQueue['getProperty']) {
        //             Entry.MODI.initSend();
        //         }

        //         if (!pd.value[2]) {
        //             pd.value[2] = 0;

        //             // send GETPROPERTY
        //             /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
        //         Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
        //         Entry.MODI.getModule.id = moduleID;
        //     }*/
        //         }

        //         return pd.value[2];
        //     },
        // },
        HW_MOTOR_BOTH: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '%5 모터 %2의 1번은 %3 2번은 %4 (으)로 정하기    ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.motorList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_motor_angle, 'MOTOR_ANGLE'],
                        [Lang.Blocks.modi_motor_speed, 'MOTOR_SPEED'],
                        // [Lang.Blocks.modi_motor_torque, 'MOTOR_TORQUE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/motor1.svg',
                    size: 11,
                },
            ],
            def: {
                params: [
                    null,
                    'MOTOR_ANGLE',
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'HW_MOTOR_BOTH',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
                upper: 2,
                bottom: 3,
            },
            class: 'motor',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    property = script.getStringField('property'),
                    upper = script.getNumberValue('upper'),
                    bottom = script.getNumberValue('bottom');
                var moduleID = JSON.parse(Entry.hw.portData.module['motor'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['motor'][key] = JSON.stringify({
                    module: property,
                    id: moduleID,
                    value1: upper,
                    value2: bottom,
                });

                return script.callReturn();
            },

            syntax: { js: [], py: [''],
            
                c: [
                    {
                        syntax: 'motor0.?%2?%3?%4',
                        template: 'motor0.?%2?%3?%4',
                    },
                ],
            },
        },
        modi_change_motor_upper_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '모터 %2의 1번을 %3으로 정하기 %4   ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.motorList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_motor_angle, 'MOTOR_ANGLE'],
                        [Lang.Blocks.modi_motor_speed, 'MOTOR_SPEED'],
                        // [Lang.Blocks.modi_motor_torque, 'MOTOR_TORQUE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/motor1.svg',
                    size: 11,
                },
            ],
            def: {
                params: [
                    null,
                    'MOTOR_ANGLE',
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'modi_change_motor_upper_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
                value: 2,
            },
            class: 'motor',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name'),
                    value = script.getNumberValue('value'),
                    property = script.getStringField('property');

                var pd = JSON.parse(Entry.hw.portData.module['motor'][key]);
                var moduleID = pd.id;

                var sq = Entry.hw.sendQueue.moduleValue;
                var upper = value,
                    bottom = 0;

                if (upper > 100) upper = 100;
                else if (upper < 0 && property == 'MOTOR_ANGLE') upper = 0;
                else if (upper < -100 && property != 'MOTOR_ANGLE') upper = -100;

                sq['motor'][key] = JSON.stringify({
                    module: property,
                    id: moduleID,
                    value1: upper,
                    value2: bottom,
                });

                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'motor0.?%2?%3',
                        template: 'motor0.?%2?%3',
                    },
                ],
            },
        },
        modi_change_motor_bottom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '모터 %2의 2번을 %3으로 정하기 %4   ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.motorList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_motor_angle, 'MOTOR_ANGLE'],
                        [Lang.Blocks.modi_motor_speed, 'MOTOR_SPEED'],
                        // [Lang.Blocks.modi_motor_torque, 'MOTOR_TORQUE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/motor1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    'MOTOR_ANGLE',
                    {
                        type: 'text',
                        params: ['100'],
                    },
                ],
                type: 'modi_change_motor_bottom_value',
            },
            class: 'motor',
            isNotFor: ['modi'],
            paramsKeyMap: {
                name: 0,
                property: 1,
                value: 2,
            },
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name'),
                    value = script.getNumberValue('value'),
                    property = script.getStringField('property');

                var pd = JSON.parse(Entry.hw.portData.module['motor'][key]);
                var moduleID = pd.id;

                var sq = Entry.hw.sendQueue.moduleValue;
                var upper = 0,
                    bottom = value;

                if (bottom > 100) bottom = 100;
                else if (bottom < 0 && property == 'MOTOR_ANGLE') bottom = 0;
                else if (bottom < -100 && property != 'MOTOR_ANGLE') bottom = -100;

                sq['motor'][key] = JSON.stringify({
                    module: property,
                    id: moduleID,
                    value1: upper,
                    value2: bottom,
                });

                return script.callReturn();
            },
            syntax : {
                c: [
                    {
                        syntax: 'motor0.?%2?%3',
                        template: 'motor0.?%2?%3',
                    },
                ],
            }
        },
        HW_LED_OFF: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%2 불빛 끄기    ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.ledList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/led1.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null],
                type: 'HW_LED_OFF',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'led',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name');
                var moduleID = JSON.parse(Entry.hw.portData.module['led'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['led'][key] = JSON.stringify({
                    module: 'LED_RGB',
                    id: moduleID,
                    value1: 0,
                    value2: 0,
                    value3: 0,
                });

                return script.callReturn();
            },

            syntax: {
                c: [
                    {
                        syntax: 'led0.setRgb(0,0,0);',
                        template: 'led0.setRgb(0,0,0);',
                    },
                ],
            },
        },
        HW_LED_CUSTOM: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%5 불빛을 빨간빛 %2 초록빛 %3 파란빛 %4 으로 정하기   ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.ledList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/led1.svg',
                    size: 11,
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'HW_LED_CUSTOM',
            },
            paramsKeyMap: {
                name: 0,
                rValue: 1,
                gValue: 2,
                bValue: 3,
            },
            class: 'led',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name');
                var red = script.getNumberValue('rValue');
                var green = script.getNumberValue('gValue');
                var blue = script.getNumberValue('bValue');

                var moduleID = JSON.parse(Entry.hw.portData.module['led'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['led'][key] = JSON.stringify({
                    module: 'LED_RGB',
                    id: moduleID,
                    value1: red,
                    value2: green,
                    value3: blue,
                });

                return script.callReturn();
            },

            syntax: {
                c: [
                    {
                        syntax: 'led0.setRgb(%2,%3,%4);',
                        template: 'led0.setRgb(%2,%3,%4);',
                    },
                ],
            },
        },
        HW_LED_BASIC: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%2 불빛을 %1 빛으로 정하기    ',
            params: [
                // {
                //     type: 'DropdownDynamic',
                //     value: null,
                //     fontSize: 11,
                //     menuName: Entry.MODI.ledList,
                //     bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                //     arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                // },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/led1.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null],
                type: 'HW_LED_BASIC',
            },
            paramsKeyMap: {
                // name: 0,
                color: 0,
            },
            class: 'led',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name');
                var color = script.getStringField('color');

                color = color.substring(1, 7);
                var bigint = parseInt(color, 16);
                var red = Math.round(((bigint >> 16) & 255) / 255 * 100);
                var green = Math.round(((bigint >> 8) & 255) / 255 * 100);
                var blue = Math.round((bigint & 255) / 255 * 100);
                var moduleID = JSON.parse(Entry.hw.portData.module['led'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['led'][key] = JSON.stringify({
                    module: 'LED_RGB',
                    id: moduleID,
                    value1: red,
                    value2: green,
                    value3: blue,
                });

                return script.callReturn();
            },

            syntax: {
                c: [
                    {
                        syntax: 'led0.%1',
                        template: 'led0.%1',
                    },
                ],
            },
        },
        HW_SPEAKER_OFF: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%2 스피커 끄기    ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.speakerList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/speaker1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'HW_SPEAKER_OFF',
            },
            paramsKeyMap: {
                name: 0,
                frequence: 1,
                volume: 2,
            },
            class: 'speaker',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    frequence = script.getStringField('frequence'),
                    volume = script.getNumberValue('volume', script);
                var moduleID = JSON.parse(Entry.hw.portData.module['speaker'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['speaker'][key] = JSON.stringify({
                    module: 'SPEAKER_BUZZER',
                    id: moduleID,
                    value1: frequence,
                    value2: volume,
                });

                return script.callReturn();
            },

            syntax: {
                c: [
                    {
                        syntax: 'speaker0.setTune(0,0);',
                        template: 'speaker0.setTune(0,0);',
                    },
                ],
            },
        },
        HW_SPEAKER_TUNE: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%4 스피커의 음을 %2 크기는 %3(으)로 정하기   ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.speakerList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        // [Lang.Blocks.modi_speaker_F_PA_5, 'F_PA_5'],
                        // [Lang.Blocks.modi_speaker_F_SOL_5, 'F_SOL_5'],
                        // [Lang.Blocks.modi_speaker_F_RA_5, 'F_RA_5'],
                        // [Lang.Blocks.modi_speaker_F_SO_5, 'F_SO_5'],
                        // [Lang.Blocks.modi_speaker_F_PA_S_5, 'F_PA_S_5'],
                        // [Lang.Blocks.modi_speaker_F_SOL_S_5, 'F_SOL_S_5'],
                        // [Lang.Blocks.modi_speaker_F_RA_S_5, 'F_RA_S_5'],
                        [Lang.Blocks.modi_speaker_F_DO_6, 'F_DO_6'],
                        [Lang.Blocks.modi_speaker_F_RE_6, 'F_RE_6'],
                        [Lang.Blocks.modi_speaker_F_MI_6, 'F_MI_6'],
                        [Lang.Blocks.modi_speaker_F_PA_6, 'F_PA_6'],
                        [Lang.Blocks.modi_speaker_F_SOL_6, 'F_SOL_6'],
                        [Lang.Blocks.modi_speaker_F_RA_6, 'F_RA_6'],
                        [Lang.Blocks.modi_speaker_F_SO_6, 'F_SO_6'],
                        // [Lang.Blocks.modi_speaker_F_DO_S_6, 'F_DO_S_6'],
                        // [Lang.Blocks.modi_speaker_F_RE_S_6, 'F_RE_S_6'],
                        // [Lang.Blocks.modi_speaker_F_PA_S_6, 'F_PA_S_6'],
                        // [Lang.Blocks.modi_speaker_F_SOL_S_6, 'F_SOL_S_6'],
                        // [Lang.Blocks.modi_speaker_F_RA_S_6, 'F_RA_S_6'],
                        [Lang.Blocks.modi_speaker_F_DO_7, 'F_DO_7'],
                        // [Lang.Blocks.modi_speaker_F_RE_7, 'F_RE_7'],
                        // [Lang.Blocks.modi_speaker_F_MI_7, 'F_MI_7'],
                        // [Lang.Blocks.modi_speaker_F_DO_S_7, 'F_DO_S_7'],
                        // [Lang.Blocks.modi_speaker_F_RE_S_7, 'F_RE_S_7'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/speaker1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    'F_DO_6',
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'HW_SPEAKER_TUNE',
            },
            paramsKeyMap: {
                name: 0,
                frequence: 1,
                volume: 2,
            },
            class: 'speaker',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    frequence = script.getStringField('frequence'),
                    volume = script.getNumberValue('volume', script);
                var moduleID = JSON.parse(Entry.hw.portData.module['speaker'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['speaker'][key] = JSON.stringify({
                    module: 'SPEAKER_BUZZER',
                    id: moduleID,
                    value1: frequence,
                    value2: volume,
                });

                return script.callReturn();
            },

            syntax: {
                c: [
                    {
                        syntax: 'speaker0.?%2?%3',
                        template: 'speaker0.?%2?%3',
                    },
                ],
            },
        },
        HW_SPEAKER_MELODY: {
            // melodyBlock: ['송어', '은파'],
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%4 스피커의 멜로디는 %1 크기는 %3 (으)로 재생하기     ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.speakerMelodyList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['송어', '송어'],
                        ['은파', '은파'],
                        ['엘리제를 위하여', '엘리제를 위하여'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/speaker1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    '송어',
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'HW_SPEAKER_MELODY',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'speaker',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    frequence = script.getStringField('frequence'),
                    volume = script.getNumberValue('volume', script);
                var moduleID = JSON.parse(Entry.hw.portData.module['speaker'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['speaker'][key] = JSON.stringify({
                    module: 'SPEAKER_BUZZER',
                    id: moduleID,
                    value1: frequence,
                    value2: volume,
                });

                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'speacker0.?%1?%3',
                        template: 'speacker0.?%1?%3',
                    },
                ],
            },
          
        },
        HW_DISPLAY_TEXT: {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%3 화면에 글자 %2 보이기    ',
            params: [
                {
                    type: 'Dropdown',
                    options: [['첫째 줄', 0], ['둘째 줄', 15], ['샛째 줄', 30]],
                    value: 0,
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/display1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['안녕!'],
                    },
                ],
                type: 'HW_DISPLAY_TEXT',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'display',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name'),
                    text = script.getStringValue('text');

                if (text.length > 27) {
                    return script.callReturn();
                }

                var moduleID = JSON.parse(Entry.hw.portData.module['display'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['display'][key] = JSON.stringify({
                    module: 'DISPLAY_TEXT',
                    id: moduleID,
                    value1: text,
                });
                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'display0.?%1?%2',
                        template: 'display0.?%1?%2',
                    },
                ],
            }
        },
        HW_DISPLAY_DATA : {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%3 화면의 %1 에 변수 %2 보이기    ',
            params: [
                {
                    type: 'Dropdown',
                    options: [['첫째 줄', 0], ['둘째 줄', 15], ['셋째 줄', 30]],
                    value: 0,
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/display1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['10'],
                    },
                ],
                type: 'HW_DISPLAY_DATA',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'display',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'display0.setVariable(2,%1,%2);',
                        template: 'display0.setVariable(2,%1,%2);',
                    },
                ],
            }
        },
        HW_DISPLAY_IMAGE : {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%2 화면에 %1 그림 보이기    ',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.displayImageList,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/display1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'HW_DISPLAY_IMAGE',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'display',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'display0.drawPicture?%1',
                        template: 'display0.drawPicture?%1',
                    },
                ],
            }
        },
        HW_DISPLAY_RESET : {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%1 화면 전체 지우기    ',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/display1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'HW_DISPLAY_RESET',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'display',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'display0.setReset();',
                        template: 'display0.setReset();',
                    },
                ],
            }
        },
        HW_DISPLAY_MOVE : {
            color: EntryStatic.colorSet.block.modi.OUTPUT,
            outerLine: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
            skeleton: 'basic',
            template: '%3 화면을 %1 (으)로 %2 만큼 이동하기    ',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['오른쪽', 'Horizontal?1'],
                        ['왼쪽', 'Horizontal?-1'],
                        ['아래', 'Vertical?1'],
                        ['위', 'Vertical?-1'],
                    ],
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.modi.OUTPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/display1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    'Horizontal?1',
                    {
                        type: 'text',
                        params: ['10'],
                    }
                ],
                type: 'HW_DISPLAY_MOVE',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'display',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return script.callReturn();
            },
            syntax: {
                c: [
                    {
                        syntax: 'display0.set?%1?%2',
                        template: 'display0.set?%1?%2',
                    },
                ],
            }
        },
        HW_NETWORK_BELL: {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            skeleton: 'basic',
            template: '%2 네트워크 벨 소리를 %1 으로 정하기   ',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['울림', 'BUZZER_ON'],
                        ['안 울림', 'BUZZER_OFF'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network1.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    'BUZZER_ON'
                ],
                type: 'HW_NETWORK_BELL',
            },

            class: 'network',
            isNotFor: ['modi'],

            syntax: {
                c: [
                    {
                        syntax: 'network0.setBuzzer(%1);',
                        template: 'network0.setBuzzer(%1);',
                    },
                ],
            }
        },
        HW_BTN_JUDGEMENT : {
            color: EntryStatic.colorSet.block.modi.INPUT,
            outerLine: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            template: '%1 버튼의 %2이(가) %3 ',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/button2.svg',
                    size: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['클릭', 'getClick'],
                        ['두 번 클릭', 'getDoubleClick'],
                        ['누른 상태', 'getPressStatus'],
                        ['스위치', 'getToggle'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['눌림', 'TRUE'],
                        ['안 눌림', 'FALSE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.INPUT_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 'getClick', 'TRUE'],
                type: 'HW_BTN_JUDGEMENT',
            },
            paramsKeyMap: {
                property: 0,
            },
            class: 'button',
            isNotFor: ['modi'],

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '(button0.%2() == %3)',
                        template: '(button0.%2() == %3)',
                    },
                ],
            },
        },
        HW_NETWORK_BTN : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%3 네트워크 버튼의 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.buttonList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['클릭', 'getButtonClick'],
                        ['두 번 클릭', 'getButtonDoubleClick'],
                        ['누른 상태', 'getButtonPressed'],
                        ['스위치', 'getButtonToggle']
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null, 'getButtonClick'],
                type: 'HW_NETWORK_BTN',
            },
            paramsKeyMap: {
                property: 0,
            },
            class: 'network',
            isNotFor: ['modi'],

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'network0.%2()',
                        template: 'network0.%2()',
                    },
                ],
            },
        },
        HW_NETWORK_BTN_JUDGEMENT : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            template: '%4 네트워크 버튼의 %2이(가) %3',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.buttonList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['클릭', 'getButtonClick'],
                        ['두 번 클릭', 'getButtonDoubleClick'],
                        ['누른 상태', 'getButtonPressed'],
                        ['스위치', 'getButtonToggle'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['눌림', 'TRUE'],
                        ['안 눌림', 'FALSE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null, 'getButtonClick', 'TRUE'],
                type: 'HW_NETWORK_BTN_JUDGEMENT',
            },
            paramsKeyMap: {
                property: 0,
            },
            class: 'network',
            isNotFor: ['modi'],

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '(network0.%2() == %3)',
                        template: '(network0.%2() == %3)',
                    },
                ],
            },
        },
        HW_NETWORK_BTN_MENU : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%2 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['눌림', 'TRUE'],
                        ['안 눌림', 'FALSE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: ['TRUE'],
                type: 'HW_NETWORK_BTN_MENU',
            },
            class: 'network',
            isNotFor: ['modi'],
            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '%1',
                        template: '%1',
                    },
                ],
            },
        },
        // modi_network_button_true : {},
        // modi_network_button_false : {},
        HW_NETWORK_JOYSTICK_JUDGEMENT : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            template: '%3 네트워크 조이스틱 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.buttonList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['위', 'JOYSTICK_UP'],
                        ['아래', 'JOYSTICK_DOWN'],
                        ['왼쪽', 'JOYSTICK_LEFT'],
                        ['오른쪽', 'JOYSTICK_RIGHT'],
                        ['안 눌림', 'FALSE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null, 'JOYSTICK_UP'],
                type: 'HW_NETWORK_JOYSTICK_JUDGEMENT',
            },
            paramsKeyMap: {
                property: 0,
            },
            class: 'network',
            isNotFor: ['modi'],

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '(network0.getJoystickDirection() == %2)',
                        template: '(network0.getJoystickDirection() == %2)',
                    },
                ],
            },
        },
        HW_NETWORK_JOYSTICK : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%2 네트워크 조이스틱',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.buttonList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null],
                type: 'HW_NETWORK_JOYSTICK',
            },
            paramsKeyMap: {
                property: 0,
            },
            class: 'network',
            isNotFor: ['modi'],

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'network0.getJoystickDirection()',
                        template: 'network0.getJoystickDirection()',
                    },
                ],
            },
        },
        HW_NETWORK_JOYSTICK_MENU : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%2 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['위', 'JOYSTICK_UP'],
                        ['아래', 'JOYSTICK_DOWN'],
                        ['왼쪽', 'JOYSTICK_LEFT'],
                        ['오른쪽', 'JOYSTICK_RIGHT'],
                        ['안 눌림', 'FALSE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: ['JOYSTICK_UP'],
                type: 'HW_NETWORK_JOYSTICK_MENU',
            },
            class: 'network',
            isNotFor: ['modi'],
            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '%1',
                        template: '%1',
                    },
                ],
            },
        },
        modi_network_joystick_unpressed : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '안눌림',
            def: {
                params: [null],
                type: 'modi_network_joystick_unpressed',
            },
            class: 'network',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 0;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'JOYSTICK_UNPRESSED',
                        template: 'JOYSTICK_UNPRESSED',
                    },
                ],
            },
        },
        modi_network_joystick_up : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '위',
            def: {
                params: [null],
                type: 'modi_network_joystick_up',
            },
            class: 'network',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 20;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'JOYSTICK_UP',
                        template: 'JOYSTICK_UP',
                    },
                ],
            },
        },
        modi_network_joystick_down : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '아래',
            def: {
                params: [null],
                type: 'modi_network_joystick_down',
            },
            class: 'network',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 30;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'JOYSTICK_DOWN',
                        template: 'JOYSTICK_DOWN',
                    },
                ],
            },
        },
        modi_network_joystick_left : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '왼쪽',
            def: {
                params: [null],
                type: 'modi_network_joystick_left',
            },
            class: 'network',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 40;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'JOYSTICK_LEFT',
                        template: 'JOYSTICK_LEFT',
                    },
                ],
            },
        },
        modi_network_joystick_right : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '오른쪽',
            def: {
                params: [null],
                type: 'modi_network_joystick_right',
            },
            class: 'network',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 50;
            },

            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: 'JOYSTICK_RIGHT',
                        template: 'JOYSTICK_RIGHT',
                    },
                ],
            },
        },
        modi_network_slider_left : {},
        modi_network_slider_right : {},
        HW_NETWORK_SLIDER: {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%3 네트워크 %2 슬라이더',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.dialList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 'Left'],
                        ['오른쪽', 'Right']
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null, 'Left'],
                type: 'HW_NETWORK_SLIDER',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'network',
            isNotFor: ['modi'],
            
            syntax: {
                c: [
                    {
                        syntax: 'network0.get%2SliderPosition()',
                        template: 'network0.get%2SliderPosition()',
                    },
                ],
            },
        },
        HW_NETWORK_DIAL : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%3 네트워크 다이얼의 위치',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.dialList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['위치', 2]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null, 2],
                type: 'HW_NETWORK_DIAL',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'network',
            isNotFor: ['modi'],
            
            syntax: {
                c: [
                    {
                        syntax: 'network0.getDialTurn()',
                        template: 'network0.getDialTurn()',
                    },
                ],
            },
        },

        HW_NETWORK_TIMER_JUDGEMENT : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            template: '%3 네트워크 타이머 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.dialList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['진행 중', '100'],
                        ['종료', '0'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null, '0'],
                type: 'HW_NETWORK_TIMER_JUDGEMENT',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'network',
            isNotFor: ['modi'],
            
            syntax: {
                c: [
                    {
                        syntax: '(network0.getTimerReached()  == %2)',
                        template: '(network0.getTimerReached()  == %2)',
                    },
                ],
            },
        },
        HW_NETWORK_TIMER : {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%2 네트워크 타이머',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.dialList,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: [null],
                type: 'HW_NETWORK_TIMER',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'network',
            isNotFor: ['modi'],
            
            syntax: {
                c: [
                    {
                        syntax: 'network0.getTimerReached()',
                        template: 'network0.getTimerReached()',
                    },
                ],
            },
        },
        HW_NETWORK_TIMER_MENU: {
            color: EntryStatic.colorSet.block.modi.SETUP,
            outerLine: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '%2 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['진행 중', 'TIMER_UNREACHED'],
                        ['종료', 'TIMER_REACHED'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.modi.SETUP_OUTLINE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/modi_icon/network2.svg',
                    size: 11,
                },
            ],
            def: {
                params: ['TIMER_UNREACHED'],
                type: 'HW_NETWORK_TIMER_MENU',
            },
            class: 'network',
            isNotFor: ['modi'],
            syntax: {
                js: [],
                py: [],
                c: [
                    {
                        syntax: '%1',
                        template: '%1',
                    },
                ],
            },
        },
        modi_network_timer_unreached : {},
        modi_network_timer_reached : {},
    };
};
//endregion modi 모디

module.exports = Entry.MODI;
