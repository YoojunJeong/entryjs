module.exports = {
    getBlocks() {
        return {
            wait_second: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],  // JYJ - 기다리는 시간 default
                        },
                        null,
                    ],
                    type: 'wait_second',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'wait_second',
                },
                paramsKeyMap: {
                    SECOND: 0,
                },
                class: 'delay',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isStart) {
                        script.isStart = true;
                        script.timeFlag = 1;
                        let timeValue = script.getNumberValue('SECOND', script);
                        const fps = Entry.FPS || 60;
                        timeValue = 60 / fps * timeValue;

                        const blockId = script.block.id;
                        Entry.TimeWaitManager.add(
                            blockId,
                            function() {
                                script.timeFlag = 0;
                            },
                            timeValue
                        );

                        return script;
                    } else if (script.timeFlag == 1) {
                        return script;
                    } else {
                        delete script.timeFlag;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.wait_for_sec(%1)',
                        },
                    ],

                    c: [
                        {
                            syntax:'%1'
                        },
                    ],
                },
            },
            repeat_basic: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic_loop',
                statements: [
                    {
                        accept: 'basic',
                    },
                ],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'repeat_basic',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'repeat_basic',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                statementsKeyMap: {
                    DO: 0,
                },
                class: 'repeat',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isLooped) {
                        const iterNumber = script.getNumberValue('VALUE', script);
                        script.isLooped = true;
                        if (iterNumber < 0) {
                            throw new Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);
                        }
                        script.iterCount = Math.floor(iterNumber);
                    }
                    if (script.iterCount !== 0 && !(script.iterCount < 0)) {
                        script.iterCount--;
                        return script.getStatement('DO', script);
                    } else {
                        delete script.isLooped;
                        delete script.iterCount;
                        return script.callReturn();
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'for i in range(%1):\n$1',
                            template: 'for i in range(%1):',
                            idChar: ['i', 'j', 'k'],
                        },
                    ],

                    c: [
                        {
                            syntax:'for(int i = 0; i < %1; i++)\n{\n$1\n}\nsleep(3);\n',
                            template: 'for(int i = 0; i < %1; i++)\n{\n}\nsleep(3);\n',
                            idChar: ['i', 'j', 'k'],
                           
                        },
                    ],
                },
            },
            repeat_inf: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic_loop',
                statements: [
                    {
                        accept: 'basic',
                    },
                ],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                    {
                        type: 'Block',
                        accept: 'Boolean',
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'repeat_inf',
                },
                pyHelpDef: {
                    params: [
                        null,
                        {
                            type: 'boolean_shell',
                            params: ['A'],
                        },
                    ],
                    type: 'repeat_inf',
                },
                statementsKeyMap: {
                    DO: 0,
                },
                class: 'repeat',
                isNotFor: [],
                func(sprite, script) {
                    script.isLooped = true;
                    return script.getStatement('DO');
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'while True:\n$1',
                            template: 'while %2\n:',
                            textParams: [
                                undefined,
                                {
                                    type: 'Block',
                                    accept: 'boolean',
                                },
                            ],
                        },
                    ],

                    c: [ {
                        syntax: 'while(true)\n{\n$1\n}\nsleep(3);\n',
                        template: 'while(%2)\n{\n}\nsleep(3);\n',
                        textParams: [
                            undefined,
                            {
                                type: 'Block',
                                accept: 'boolean',
                            },
                        ],
                    },],
                },
            },
            repeat_while_true: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic_loop',
                statements: [
                    {
                        accept: 'basic',
                    },
                ],
                params: [
                    {
                        type: 'Block',
                        accept: 'boolean',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.FLOW_repeat_while_true_until, 'until'],
                            [Lang.Blocks.FLOW_repeat_while_true_while, 'while'],
                        ],
                        value: 'while',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.FLOW,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'True',
                        },
                        null,
                        null,
                    ],
                    type: 'repeat_while_true',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'boolean_shell',
                            params: ['A'],
                        },
                        null,
                        null,
                    ],
                    type: 'repeat_while_true',
                },
                paramsKeyMap: {
                    BOOL: 0,
                    OPTION: 1,
                },
                statementsKeyMap: {
                    DO: 0,
                },
                class: 'repeat',
                isNotFor: [],
                func(sprite, script) {
                    let value = script.getBooleanValue('BOOL', script);

                    if (script.getField('OPTION', script) === 'until') {
                        value = !value;
                    }
                    script.isLooped = value;

                    return value ? script.getStatement('DO', script) : script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'while %1 %2:\n$1',
                            template: 'while not %1:',
                        },
                    ],
                    c: [
                        {
                            syntax: 'while( %1 %2 )\n{\n$1\n}\nsleep(3);\n',
                            template: 'while( %1 %2 )\n{\n}\nsleep(3);\n',
                        },
                    ],
                },
            },
            stop_repeat: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'stop_repeat',
                },
                class: 'repeat',
                isNotFor: [],
                func(sprite, script) {
                    return this.executor.breakLoop();
                },
                syntax: { 
                    js: [], 
                    py: ['break'] ,
                    c: ['break;'],},
            },
            _if: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic_loop',
                statements: [
                    {
                        accept: 'basic',
                    },
                ],
                params: [
                    {
                        type: 'Block',
                        accept: 'boolean',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'True',
                        },
                        null,
                    ],
                    type: '_if',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'boolean_shell',
                            params: ['A'],
                        },
                        null,
                    ],
                    type: '_if',
                },
                paramsKeyMap: {
                    BOOL: 0,
                },
                statementsKeyMap: {
                    STACK: 0,
                },
                class: 'condition',
                isNotFor: [],
                func(sprite, script) {
                    if (script.isCondition) {
                        delete script.isCondition;
                        return script.callReturn();
                    }
                    const value = script.getBooleanValue('BOOL', script);
                    if (value) {
                        script.isCondition = true;
                        return script.getStatement('STACK', script);
                    } else {
                        return script.callReturn();
                    }
                },
                syntax: {
                    js: [],
                    py: [{ syntax: 'if %1:\n$1', template: 'if %1:' }],
                    c: [{ syntax: 'if(%1)\n{\n$1\n}', template: 'if\n(%1){\n}' }],
                },
            },
            if_else: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic_double_loop',
                statements: [
                    {
                        accept: 'basic',
                    },
                    {
                        accept: 'basic',
                    },
                ],
                params: [
                    {
                        type: 'Block',
                        accept: 'boolean',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                    {
                        type: 'LineBreak',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'True',
                        },
                        null,
                    ],
                    type: 'if_else',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'boolean_shell',
                            params: ['A'],
                        },
                        null,
                    ],
                    type: 'if_else',
                },
                paramsKeyMap: {
                    BOOL: 0,
                },
                statementsKeyMap: {
                    STACK_IF: 0,
                    STACK_ELSE: 1,
                },
                class: 'condition',
                isNotFor: [],
                func(sprite, script) {
                    if (script.isCondition) {
                        delete script.isCondition;
                        return script.callReturn();
                    }
                    const value = script.getBooleanValue('BOOL', script);
                    script.isCondition = true;
                    if (value) {
                        return script.getStatement('STACK_IF', script);
                    } else {
                        return script.getStatement('STACK_ELSE', script);
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'if %1:\n$1\nelse:\n$2',
                            template: 'if %1: %3 else:',
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'boolean',
                                },
                                undefined,
                                {
                                    type: 'LineBreak',
                                },
                            ],
                        },
                    ],

                    c: [
                        {
                            syntax: 'if(%1)\n{\n$1\n}\nelse\n{\n$2\n}',
                            template: 'if(%1)\n{\n}\nelse\n{\n\n}',
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'boolean',
                                },
                                undefined,
                                {
                                    type: 'LineBreak',
                                },
                            ],
                        },
                    ],
                },
            },
            wait_until_true: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'boolean',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'True',
                        },
                        null,
                    ],
                    type: 'wait_until_true',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'boolean_shell',
                            params: ['A'],
                        },
                        null,
                    ],
                    type: 'wait_until_true',
                },
                paramsKeyMap: {
                    BOOL: 0,
                },
                class: 'wait',
                isNotFor: [],
                func(sprite, script) {
                    const value = script.getBooleanValue('BOOL', script);
                    if (value) {
                        return script.callReturn();
                    } else {
                        return script;
                    }
                },
                syntax: { 
                    js: [], 
                    py: ['Entry.wait_until(%1)'], 
                    c: [
                        {
                            syntax: 'while(%1 == 0)\n{\n}\nsleep(3);\n',
                            template: 'while(%1 == 0)\n{\n}s\nleep(3);\n',
                        },
                    ], 
                },
            },
            restart_project: {
                color: EntryStatic.colorSet.block.default.FLOW,
                outerLine: EntryStatic.colorSet.block.darken.FLOW,
                skeleton: 'basic_without_next',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/flow_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'restart_project',
                },
                class: 'terminate',
                isNotFor: [],
                func(sprite, script) {
                    Entry.engine.toggleStop();
                    Entry.engine.toggleRun();
                },
                syntax: { js: [], c: [],py: ['Entry.start_again()'] },
            }
        }
    },
};
