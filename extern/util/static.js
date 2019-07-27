'use strict';

/* eslint-disable */
var EntryStatic = {};

EntryStatic.objectTypes = ['sprite', 'textBox'];

EntryStatic.usageList = [
    'usage_sequence',
    'usage_repeat',
    'usage_condition_repeat',
    'usage_condition',
    'usage_parallel',
    'usage_event',
    'usage_signal',
    'usage_random',
    'usage_variable',
    'usage_ask_answer',
    'usage_comp_operation',
    'usage_math_operation',
    'usage_logical_operation',
    'usage_list',
    'usage_function',
    'usage_arrow_move',
    'usage_coordinate',
    'usage_rotation',
    'usage_speak',
    'usage_picture_effect',
    'usage_shape',
    'usage_sound',
    'usage_draw',
    'usage_confirm',
    'usage_timer',
    'usage_textBox',
    'usage_scene',
    'usage_clone',
    'usage_hw',
    'usage_expansion',
];

EntryStatic.conceptList = [
    'concept_resource_analytics',
    'concept_individual',
    'concept_abstractive',
    'concept_procedual',
    'concept_automation',
    'concept_simulation',
    'concept_parallel',
];

EntryStatic.subjectList = [
    'subject_korean',
    'subject_mathmatics',
    'subject_social',
    'subject_science',
    'subject_english',
    'subject_courtesy',
    'subject_music',
    'subject_paint',
    'subject_athletic',
    'subject_progmatic',
];

EntryStatic.lectureLevels = [1, 2, 3];

// EntryStatic.lectureLevels = ['level_high', 'level_mid','level_row'];

EntryStatic.lectureGrades = [
    'e_1',
    'e_2',
    'e_3',
    'e_4',
    'e_5',
    'e_6',
    'm_1',
    'm_2',
    'm_3',
    'general',
];

EntryStatic.categoryList = [
    'category_game',
    'category_animation',
    'category_media_art',
    'category_physical',
    'category_etc',
];

EntryStatic.variableBlockList = [
    'get_variable',
    'change_variable',
    'set_variable',
    'show_variable',
    'hide_variable',
    'value_of_index_from_list',
    'add_value_to_list',
    'remove_value_from_list',
    'insert_value_to_list',
    'change_value_list_index',
    'length_of_list',
    'is_included_in_list',
    'show_list',
    'hide_list',
];

EntryStatic.messageBlockList = ['when_message_cast', 'message_cast', 'message_cast_wait'];

EntryStatic.requiredTimes = [1, 2, 3, 4, 5];

EntryStatic.searchProjectOption = [
    {
        key: 'search_updated',
        lang: 'search_updated',
        value: 'updated',
    },
    {
        key: 'search_recent',
        lang: 'search_recent',
        value: 'recent',
    },
    {
        key: 'search_complexity',
        lang: 'search_complexity',
        value: 'complexity',
    },
    {
        key: 'search_staffPicked',
        lang: 'search_staffPicked',
        value: 'staffPicked',
    },
    {
        key: 'search_childCnt',
        lang: 'search_childCnt',
        value: 'childCnt',
    },
    {
        key: 'search_likeCnt',
        lang: 'search_likeCnt',
        value: 'recentLikeCnt',
    },
];

EntryStatic.categoryProjectOption = [
    {
        key: 'search_genre_all',
        lang: 'search_전체',
        value: '전체',
    },
    {
        key: 'search_genre_game',
        lang: 'search_게임',
        value: '게임',
    },
    {
        key: 'search_genre_animation',
        lang: 'search_애니메이션',
        value: '애니메이션',
    },
    {
        key: 'search_genre_media',
        lang: 'search_미디어아트',
        value: '미디어아트',
    },
    {
        key: 'search_genre_physical',
        lang: 'search_피지컬',
        value: '피지컬',
    },
    {
        key: 'search_genre_etc',
        lang: 'search_기타',
        value: '기타',
    },
];

EntryStatic.speakerMelody = {data:{},list:[]}

EntryStatic.displayImage = {data:{},list:[]}

EntryStatic.getImgDataFromImageUrl = function (source) {
    const {url, name} = source
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, 64, 48);
        let imgData = ctx.getImageData(0, 0, 64, 48)

        let gray_data = [];
        for (let i = 0; i < imgData.data.length; i += 4) {
        let gray = imgData.data[i + 3];
        gray_data.push(gray)
        }

        let binary_data = [];
        for (let i = 0; i < gray_data.length; i++) {
        let bin = gray_data[i] > 90 ? 1 : 0;
        binary_data.push(bin);
        }

        let modi_display_data = [];
        for (let i = 0; i < binary_data.length; i += 8) {
            let byte = 0x00;
            for (let j = 0; j < 8; j++) {
                byte = (byte << 1) | binary_data[i + j];
            }
            modi_display_data.push(byte);
        }
        EntryStatic.displayImage.data[name] = modi_display_data
    };

    img.src = url;
}

EntryStatic.getMelodyDataFromUrl = function(source) {
    const {url, name} = source
    $.ajax({
        url: url,
        type: "GET",
    })
    .done(function(json) {
        EntryStatic.speakerMelody.data[name]=json
    })
    .fail(function(xhr, status, errorThrown) {
        console.log('fail', xhr, status, errorThrown)
        //TODO: 멜로디 다운 안될 경우 처리
    })
}

// JYJ - 사이드 메뉴 항목 설정
EntryStatic.getAllBlocks = function() {
    let blocks = EntryStatic.defaultModiBlocks

    if (Entry.modiData != null ) {
        console.log('getAllBlocks if', Entry.modiData)
        blocks = Entry.modiData
    }
    console.log('getAllBlocks blocks : ', blocks)
    
    let melodyBlock = blocks.filter( el => (el.category === "CONTENTS_MELODY_BASIC"))[0]
    let imgBlock = blocks.filter( el => (el.category === "CONTENTS_IMG_BASIC"))[0]
    let modiBlocks = blocks
                    .filter( el => (el.category !== "CONTENTS_MELODY_BASIC" && el.category !== "CONTENTS_IMG_BASIC"))
                    .map( el => {
                        if(el.category === "HW"){
                            el.category = 'arduino'
                        } 
                        return el
                    })

    if(melodyBlock && melodyBlock.blocks){
        melodyBlock = melodyBlock.blocks
        EntryStatic.speakerMelody.list = melodyBlock.map(el=>{
            EntryStatic.getMelodyDataFromUrl(el)
            return [el.name,el.name]
        })
    }

    if(imgBlock && imgBlock.blocks){
        imgBlock = imgBlock.blocks
        EntryStatic.displayImage.list = imgBlock.map(el=>{
            EntryStatic.getImgDataFromImageUrl(el)
            return [el.name,el.name]
        })
    }

    return modiBlocks
};

EntryStatic.defaultModiBlocks = [
    {
        category: 'start',
        blocks: [
            'when_run_button_click',
        ],
    },
    {
        category: 'flow',
        blocks: [
            'wait_second',
            'repeat_basic',
            'repeat_inf',
            'repeat_while_true',
            'stop_repeat',
            '_if',
            'if_else',
        ],
    },
    {
        category: 'judgement',
        blocks: [
            'boolean_basic_operator',
            'boolean_and_or',
        ],
    },
    {
        category: 'calc',
        blocks: [
            'calc_basic',
            'calc_rand',
        ],
    },
    {
        category: 'variable',
        blocks: [
            'variableAddButton',
            'get_variable',
            'change_variable',
            'set_variable',
        ],
    },
    // {
    //     category: 'text',
    //     blocks: ['text_read', 'text_write', 'text_append', 'text_prepend', 'text_flush'],
    // },
    {
        category: 'arduino',
        blocks: [
            'HW_DIAL_VALUE',
            'HW_BTN_VALUE',
            'HW_BTN_MENU',
            'HW_BTN_JUDGEMENT',
            'HW_IR_VALUE',
            'HW_MOTOR_BOTH',
            'HW_LED_OFF',
            'HW_LED_CUSTOM',
            'HW_LED_BASIC',
            'HW_SPEAKER_OFF',
            'HW_SPEAKER_TUNE',
            'HW_SPEAKER_MELODY',
            'HW_DISPLAY_TEXT',
            'HW_DISPLAY_DATA',
            'HW_DISPLAY_IMAGE',
            'HW_DISPLAY_RESET',
            'HW_DISPLAY_MOVE',
            'HW_NETWORK_BTN',
            'HW_NETWORK_BTN_MENU',
            'HW_NETWORK_BTN_JUDGEMENT',
            'HW_NETWORK_JOYSTICK',
            'HW_NETWORK_JOYSTICK_MENU',
            'HW_NETWORK_JOYSTICK_JUDGEMENT',
            'HW_NETWORK_SLIDER',
            'HW_NETWORK_DIAL',
            'HW_NETWORK_TIMER',
            'HW_NETWORK_TIMER_MENU',
            'HW_NETWORK_TIMER_JUDGEMENT',
            'HW_NETWORK_BELL',
        ]
    }, 
    {
        "category" : "CONTENTS_MELODY_BASIC",
        "blocks" : [ {
          "name" : "반짝반짝 작은별",
          "url" : "https://kyowon-modi.s3.ap-northeast-2.amazonaws.com/melody/%ED%95%98/%EB%B0%98%EC%A7%9D%EB%B0%98%EC%A7%9D+%EC%9E%91%EC%9D%80%EB%B3%84.cpp"
        }, {
          "name" : "징글벨",
          "url" : "https://kyowon-modi.s3.ap-northeast-2.amazonaws.com/melody/%ED%95%98/%EC%A7%95%EA%B8%80%EB%B2%A8.cpp"
        } ]
    },
    {
        "category" : "CONTENTS_IMG_BASIC",
        "blocks" : [ {
          "name" : "Welcome",
          "url" : "https://kyowon-modi.s3.ap-northeast-2.amazonaws.com/img/elementry/welcome_1.png"
        }, {
          "name" : "REDPEN",
          "url" : "https://kyowon-modi.s3.ap-northeast-2.amazonaws.com/img/elementry/redpen_2.png"
        },{
            "name" : "Coding",
            "url" : "https://kyowon-modi.s3.ap-northeast-2.amazonaws.com/img/elementry/coding_3.png"
          } ]
    },
];

EntryStatic.discussCategories = [
    // 'notice',
    'qna',
    'tips',
    'free',
    'report',
    'notice',
];

EntryStatic.artCategories = [
    {
        key: 'art_category_',
        lang: 'art_category_all',
        value: '',
    },
    {
        key: 'art_category_게임',
        lang: 'art_category_game',
        value: '게임',
    },
    {
        key: 'art_category_애니메이션',
        lang: 'art_category_animation',
        value: '애니메이션',
    },
    {
        key: 'art_category_미디어아트',
        lang: 'art_category_media',
        value: '미디어아트',
    },
    {
        key: 'art_category_피지컬',
        lang: 'art_category_physical',
        value: '피지컬',
    },
    {
        key: 'art_category_기타',
        lang: 'art_category_etc',
        value: '기타',
    },
];

EntryStatic.artSortOptions = [
    {
        key: 'art_sort_updated',
        lang: 'art_sort_updated',
        value: 'updated',
    },
    {
        key: 'art_sort_visit',
        lang: 'art_sort_visit',
        value: 'visit',
    },
    {
        key: 'art_sort_likeCnt',
        lang: 'art_sort_likeCnt',
        value: 'likeCnt',
    },
    {
        key: 'art_sort_comment',
        lang: 'art_sort_comment',
        value: 'comment',
    },
];

EntryStatic.discussSortOptions = [
    {
        lang: 'discuss_sort_created',
        value: 'created',
    },
    {
        lang: 'discuss_sort_visit',
        value: 'visit',
    },
    {
        lang: 'discuss_sort_likesLength',
        value: 'likesLength',
    },
    {
        lang: 'discuss_sort_commentsLength',
        value: 'commentsLength',
    },
];
EntryStatic.discussPeriodOptions = [
    {
        key: 'discuss_period_',
        lang: 'discuss_period_all',
        value: '',
    },
    {
        key: 'discuss_period_1',
        lang: 'discuss_period_day',
        value: '1',
    },
    {
        key: 'discuss_period_7',
        lang: 'discuss_period_week',
        value: '7',
    },
    {
        key: 'discuss_period_30',
        lang: 'discuss_period_month',
        value: '30',
    },
    {
        key: 'discuss_period_90',
        lang: 'discuss_period_three_month',
        value: '90',
    },
];

EntryStatic.artPeriodOptions = [
    {
        key: 'art_period_',
        lang: 'art_period_all',
        value: '',
    },
    {
        key: 'art_period_1',
        lang: 'art_period_day',
        value: '1',
    },
    {
        key: 'art_period_7',
        lang: 'art_period_week',
        value: '7',
    },
    {
        key: 'art_period_30',
        lang: 'art_period_month',
        value: '30',
    },
    {
        key: 'art_period_90',
        lang: 'art_period_three_month',
        value: '90',
    },
];

EntryStatic.getCategoryByBlock = function(blockName) {
    if (!blockName) {
        return false;
    }
    const allBlocks = EntryStatic.getAllBlocks();
    for (let i = 0, len = allBlocks.length; i < len; i++) {
        const blocks = allBlocks[i].blocks;
        if (blocks.indexOf(blockName) > -1) {
            return allBlocks[i].category;
        }
    }
    return false;
};

EntryStatic.objectMainCategories = [
    'entrybot_friends',
    'people',
    'animal',
    'plant',
    'vehicles',
    'architect',
    'food',
    'environment',
    'stuff',
    'fantasy',
    'interface',
    'background',
];

EntryStatic.objectSubCategories = {
    entrybot_friends: [],
    people: [],
    animal: ['animal_flying', 'animal_land', 'animal_water', 'animal_others'],
    plant: ['plant_flower', 'plant_grass', 'plant_tree', 'plant_others'],
    vehicles: ['vehicles_flying', 'vehicles_land', 'vehicles_water', 'vehicles_others'],
    architect: ['architect_building', 'architect_monument', 'architect_others'],
    food: ['food_vegetables', 'food_meat', 'food_drink', 'food_others'],
    environment: ['environment_nature', 'environment_space', 'environment_others'],
    stuff: ['stuff_living', 'stuff_hobby', 'stuff_others'],
    fantasy: [],
    interface: [],
    background: [
        'background_outdoor',
        'background_indoor',
        'background_nature',
        'background_others',
    ],
};

Object.defineProperty(EntryStatic, 'fonts', {
    get: function() {
        return [
            {
                name: Lang.Fonts.batang,
                family: 'KoPub Batang',
                url: '/css/kopubbatang.css',
                visible: false,
            },
            {
                name: Lang.Fonts.jeju_hallasan,
                family: 'Jeju Hallasan',
                url: '/css/jejuhallasan.css',
                visible: false,
            },
            {
                name: Lang.Fonts.gothic,
                family: 'Nanum Gothic',
                url: '/css/nanumgothic.css',
                visible: true,
            },
            {
                name: Lang.Fonts.myeongjo,
                family: 'Nanum Myeongjo',
                url: '/css/nanummyeongjo.css',
                visible: true,
            },
            {
                name: Lang.Fonts.pen_script,
                family: 'Nanum Pen Script',
                url: '/css/nanumpenscript.css',
                visible: true,
            },
            {
                name: Lang.Fonts.square_round,
                family: 'NanumSquareRound',
                url: '/css/square_round.css',
                visible: true,
            },
            {
                name: Lang.Fonts.gothic_coding,
                family: 'Nanum Gothic Coding',
                url: '/css/nanumgothiccoding.css',
                visible: true,
            },
            {
                name: Lang.Fonts.jalnan,
                family: 'yg-jalnan',
                url: '/css/jalnan.css',
                visible: true,
            },
            {
                name: Lang.Fonts.designhouse,
                family: 'designhouseOTFLight00',
                url: '/css/designhouse.css',
                visible: true,
            },
            {
                name: Lang.Fonts.dunggeunmo,
                family: 'DungGeunMo',
                url: '/css/dunggeunmo.css',
                visible: true,
            },
            {
                name: Lang.Fonts.uhbeemysen,
                family: 'UhBeemysen',
                url: '/css/uhbeemysen.css',
                visible: true,
            }
        ];
    },
});

EntryStatic.colorSet = {
    arrow: {
        default: {
            DEFAULT: '#FFFFFF',
            START: '#FFFFFF',
            FLOW: '#3A71BC',
            MOVING: '#8641B6',
            LOOKS: '#D8234E',
            TEXT: '#DC9C32',
            SOUND: '#83A617',
            JUDGE: '#89A1F7',
            CALC: '#E8B349',
            VARIABLE: '#CE38CE',
            HARDWARE: '#FFFFFF',
            EXPANSION: '#FF8888',
            HIDDEN: '#FFFFFF',
        },
    },
    block: {
        default: {
            START: '#00b400',
            FLOW: '#17a6d1',
            MOVING: '#ad3efb',
            LOOKS: '#ff3a61',
            BRUSH: '#fc7e01',
            TEXT: '#e43500',
            SOUND: '#67b100',
            JUDGE: '#4562f5',
            CALC: '#f4af18',
            VARIABLE: '#dd47d8',
            FUNC: '#de5c04',
            HARDWARE: '#00b6b1',
            EXPANSION: '#ef6d6d',
            HIDDEN: '#8aa3b2',
        },
        lighten: {
            START: '#3bce3b',
            FLOW: '#3bce3b',
            MOVING: '#bd65fb',
            LOOKS: '#ff5577',
            BRUSH: '#ff9831',
            TEXT: '#ff6739',
            SOUND: '#7ecc12',
            JUDGE: '#99adff',
            CALC: '#ffde82',
            VARIABLE: '#f778f3',
            FUNC: '#ff7b22',
            HARDWARE: '#78d5d3',
            EXPANSION: '#ffaeae',
            HIDDEN: '#ffaeae',
        },
        darken: {
            START: '#009400',
            FLOW: '#007ca2',
            MOVING: '#8b19db',
            LOOKS: '#c72042',
            BRUSH: '#c72042',
            TEXT: '#ad2800',
            SOUND: '#508a00',
            JUDGE: '#1b3ad8',
            CALC: '#ff7f00',
            VARIABLE: '#b819b3',
            FUNC: '#a14100',
            HARDWARE: '#008380',
            EXPANSION: '#c63f3f',
            HIDDEN: '#728997',
        },
        emphasize: {
            '#00b400': '#5BC982', //START
            '#17a6d1': '#62A5F4', //FLOW
            '#ad3efb': '#C08FF7', //MOVING
            '#ff3a61': '#F46487', //LOOKS
            '#fc7e01': '#FFB05A', //BRUSH
            '#e43500': '#F2C670', //TEXT
            '#67b100': '#C4DD31', //SOUND
            '#4562f5': '#C0CBFF', //JUDGE
            '#f4af18': '#FCDA90', //CALC
            '#dd47d8': '#F279F2', //VARIABLE
            '#de5c04': '#DD884E', //FUNC
            '#00b6b1': '#09BAB5', //HARDWARE
            //Not guided emphasize color for EXPANSION
        },
    },
    common: {
        WHITE: '#FFFFFF',
        DARK: '#000000',
    },
};

EntryStatic.COMMAND_TYPES = {
    addThread: 101,
    destroyThread: 102,
    destroyBlock: 103,
    recoverBlock: 104,
    insertBlock: 105,
    separateBlock: 106,
    moveBlock: 107,
    cloneBlock: 108,
    uncloneBlock: 109,
    scrollBoard: 110,
    setFieldValue: 111,

    selectObject: 201,

    do: 301,
    undo: 302,
    redo: 303,
};

EntryStatic.getQuestionCategoryData = function() {
    return {
        category: 'dummy',
        blocks: [
            'hidden_event',
            'hidden_loop2',
            'hidden_if_else2',
            'hidden',
            'hidden_string',
            'hidden_boolean',
        ],
    };
};

// for server node js code
if (typeof exports === 'object') {
    exports.blockInfo = EntryStatic.blockInfo;
    exports.getAllBlocks = EntryStatic.getAllBlocks;
    exports.getCategoryByBlock = EntryStatic.getCategoryByBlock;
    exports.EntryStatic = EntryStatic;
}
