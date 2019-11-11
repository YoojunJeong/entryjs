
import Interpreter from './interpreter'

// const interpreter = require('./playground/interpreter');
// import Filbert from '../../extern/util/filbert.js'
// import { threadId } from 'worker_threads';

'use strict';

Entry.ZoomController = class ZoomController {
    constructor(board) {
        this.boardMap = new Map();
        this.firstZoom = false;
        this.retryCount = 0;
        this.keyBlock = {};
        if (board) {
            this.setBoard(board);
        }
        if (Entry.windowResized) {
            Entry.windowResized.attach(this, this.setPosition);
        }
        
    }

    get CONTROLLER_WIDTH() {
        return 128;
    }

    get CONTROLLER_HEIGHT() {
        return 38;
    }

    get ZOOM_RANGE() {
        return [0.6, 0.8, 1, 1.3, 1.6, 2];
    }

    get ZOOM_MODE() {
        return {
            RESET: 0,
            OUT: 1,
            IN: 2,
        };
    }

    get view() {
        return this.svgGroup;
    }

    ZOOM_LEVEL = 10;

    generateView() {
        const zoomGroup = {
            svgZoom: this.nowBoard.svg.elem('g'),
        };
        this.renderStart(zoomGroup);
        this.addControl(zoomGroup);
    
    
        return zoomGroup;
    }

    renderStart(zoomGroup) {
        zoomGroup.svgZoom.elem('image', {
            href: ``,
            width: this.CONTROLLER_WIDTH,
            height: this.CONTROLLER_HEIGHT,
        });
        zoomGroup.refresh = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_btn_refresh.png`,
            x: 0,
            y: 3,
            width: 83,
            height: 91,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
        zoomGroup.export = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_btn_export.png`,
            x: 93,
            y: 3,
            width: 83,
            height: 91,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
            onClick :`window.android.uploadCode(${Entry.binaryOutput})`
        });
        zoomGroup.plus = zoomGroup.svgZoom.elem('image', {
            id:'remote',
            href: `${Entry.mediaFilePath}custom/modi_btn_remote_dis.png`,
            x: 181,
            y: 3,
            width: 83,
            height: 91,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
       
        // zoomGroup.svgZoom.elem('image', {
        //     href: `${Entry.mediaFilePath}btn_zoom_bg.svg`,
        //     width: this.CONTROLLER_WIDTH,
        //     height: this.CONTROLLER_HEIGHT,
        // });
        // zoomGroup.zoomOut = zoomGroup.svgZoom.elem('image', {
        //     href: `${Entry.mediaFilePath}btn_zoom_out.svg`,
        //     x: 4,
        //     y: 3,
        //     width: 32,
        //     height: 32,
        //     filter: 'url(#entryButtonShadowFilter)',
        //     style: 'cursor: zoom-out;',
        // });
        // zoomGroup.zoomReset = zoomGroup.svgZoom.elem('image', {
        //     id: 'zoom_reset',
        //     href: `${Entry.mediaFilePath}btn_zoom_reset.svg`,
        //     x: 44,
        //     y: 3,
        //     width: 40,
        //     height: 32,
        //     filter: 'url(#entryButtonShadowFilter)',
        //     style: 'cursor: pointer;',
        // });
        // zoomGroup.zoomIn = zoomGroup.svgZoom.elem('image', {
        //     href: `${Entry.mediaFilePath}btn_zoom_in.svg`,
        //     x: 92,
        //     y: 3,
        //     width: 32,
        //     height: 32,
        //     filter: 'url(#entryButtonShadowFilter)',
        //     style: 'cursor: zoom-in;',
        // });
    }

    addControl(zoomGroup) {
        if (this.nowBoard) {
            $(zoomGroup.refresh).bind('mousedown touchstart', (e) => {
                this.doAction('RESET');
            });
            $(zoomGroup.export).bind('mousedown touchstart', (e) => {
                this.doAction('EXPORT');
            });
            $(zoomGroup.plus).bind('mousedown touchstart', (e) => {
                this.doAction('REMOTE');
            });
        
            // $(zoomGroup.svgZoom).bind('mousedown touchstart', (e) => {
            //     e.stopImmediatePropagation();
            // });
            // $(zoomGroup.zoomOut).bind('mousedown touchstart', (e) => {
            //     this.zoomChange(this.ZOOM_MODE.OUT);
            // });
            // $(zoomGroup.zoomReset).bind('mousedown touchstart', (e) => {
            //     this.zoomChange(this.ZOOM_MODE.RESET);
            // });
            // $(zoomGroup.zoomIn).bind('mousedown touchstart', (e) => {
            //     this.zoomChange(this.ZOOM_MODE.IN);
            // });
        }
    }

    doAction(mode) {
        switch(mode) {
            case 'RESET':
                    createjs.Sound.play('entryMenuClick');
                    window.android.callFuntion('RESET');
                break;
            case 'EXPORT':

                    try { 

                    createjs.Sound.play('entryMenuClick');
                    let startBtnCount = 0;
                     
                    
                    const blockMap = this.nowBoard.code._blockMap;
                    // console.log('blockMap', blockMap);
                    // window.android.log('blockMap : '+JSON.stringify(blockMap));
                    // window.android.entryRefresh();
                    // return;

                    const keys = Object.keys(blockMap) || [];
                    keys.forEach((id) => {
                        let block = blockMap[id];
                        if(block.data.type == 'when_run_button_click') {
                            this.keyBlock = block;
                            startBtnCount++;
                            if(startBtnCount > 1) {

                                // console.log('failUpload1');
                                window.android.failUpload('<내보내기 버튼을 클릭했을 때>\n코드 블록이 2개 이상이에요.\n1개만 남기고 삭제한 뒤\n내보내기를 다시 시도해 주세요.');
                                throw new Error('코드 블록이 2개 이상이에요.\n1개만 남기고 삭제한 뒤 내보내기를 다시 시도해 주세요.');
                            }
                        }         
                       
                        if(keys.length == 1 && blockMap[keys[0]].data.type == 'when_run_button_click') {
                            // console.log('failUpload4');
                            window.android.failUpload('DEFAULT_CODE');
                            throw new Error('기본 코딩입니다.');
                        }

                        // console.log('block thread = ', block.getThread().getBlocks);

                    });

                    if(startBtnCount == 0) {
                        // console.log('failUpload3');
                        window.android.failUpload('<내보내기 버튼을 클릭했을 때>\n블록 없이는 내보내기를 할 수 없어요.\n다시 코딩을 한 뒤 내보내기를 시도해 주세요.');
                        throw new Error('기본 코딩입니다.');
                    }

    
                        const block = this.keyBlock;

                        // console.log('block : ',block);
                        // window.android.log('block : ' + JSON.stringify(block));

                        var parser = new Entry.Parser(Entry.Vim.WORKSPACE_MODE);
                        var syntax = parser.mappingSyntax(Entry.Vim.WORKSPACE_MODE);
        
                        // console.log('block : ',block.getThread);
                        // window.android.log('block getThread: '+JSON.stringify(block.getThread()));
                        // console.log('block getThread: ', typeof block.getThread());
                       
        
                        // var blockToPyParser = new Entry.BlockToPyParser(syntax);
                        var blockToCParser = new Entry.BlockToCParser(syntax);
                        // var pyToBlockParser = new Entry.PyToBlockParser(syntax);
        
                        blockToCParser._parseMode = Entry.Parser.PARSE_GENERAL;

                        var cOutput = blockToCParser.Thread(block.getThread());

                        if(blockToCParser._blockCount == 2 && blockToCParser._secondBlock.data.type =='repeat_inf') {
                            console.log('failUpload2');
                            window.android.failUpload('DEFAULT_CODE');
                            throw new Error('기본 코딩입니다.');
                        }
        
                        let binary = '#include "user.hpp"\n\nusing namespace math;\n\n';
        
                        // 이미지 데이터
                        let images = cOutput.match(/(?<=drawPicture\().*(?=\))/g)||[]
                        let imgData = Entry.TextCodingUtil.imgData
                        for(let i =0 ; i < images.length ; i++){
                            binary += `const char picture${i}[${imgData[i].split(',').length + 1}] = {\n${imgData[i]}\n};\n\n`
                        }
                        binary += 'void doUserTask()\n';
        
                        let moduleList = ''
                        const variables = Entry.variableContainer.variables_
                        variables.forEach((el)=>{
                            moduleList += `float ${el.getId()} = 0.0;\n`
                        })
        
                        // 멜로디 템포 변수 선언
                        if(Entry.TextCodingUtil.melodyTempo.length){
                            let melodyTempoVariable = ''
                            Entry.TextCodingUtil.melodyTempo.forEach(el =>{
                                melodyTempoVariable += el 
                            })
                            let melArr = melodyTempoVariable
                            .replace(/[\n\t]*/g,"")
                            .replace(/\s*(?=float)/g,"")
                            .split(';')
                            .reduce((accArr,el)=>{
                                if(!accArr.includes(el)){
                                    accArr.push(el)
                                }
                                return accArr
                            },[])
                            .join(';\n')
                            moduleList += melArr
                        }
        
                        // 모듈 블럭 선언
                        moduleList += `\n${Entry.module}\n`;
        
                        // 이미지 변수 선언
                        for(let i =0 ; i < images.length ; i++){
                            moduleList += `\ndisplay0.addPicture(${images[i]},picture${i});\n`;
                        }
        
                        // moduleList += `Network network0(0x0000E07B45C3);
                        // Button button0(0x2030D92B254A);\n
                        // Led led0(0x4020A3A5DB73);\n
                        // display0(0x4020A3A5DB74)\n
                        // ir0(0x4020A3A5DB75)\n
                        // motor0(0x4020A3A5DB76)\n`
                        // 코드
                        // console.log("cOutput",cOutput)
                        binary += `${cOutput}\n`;
                        binary += '}\n'
                        binary = binary.replace(/temp__/g, moduleList)
                        binary = binary.replace(/\t/g, "    ")
        
                        // 모듈 연결 상태를 체크
                        const designatedModules = cOutput.match(/[a-z]*(?=0\.)\d/g) || []
                        const connectedModules = Entry.module.match(/[a-z]*(?=0\()\d/g) || []
                        const unconnectedModules = 
                        designatedModules
                        .filter(module => {
                            return !connectedModules.includes(module)
                        }) // designatedModules에 포함된 모듈이 connectedModules에 없으면 unconnectedModules에 추가
                        .reduce((accArr,el)=>{
                            if(!accArr.includes(el)){
                                accArr.push(el)
                            }
                            return accArr
                        },[]) // 중복 모듈 정리
        
                        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/
                        const emojiMatch = binary.match(emojiRegex)
                        
                        if(emojiMatch){
                            Entry.toast.warning(
                                '사용할 수 없는 문자열',
                                `${emojiMatch[0]}이모티콘은 사용할 수 없어요!`
                            );
                            throw new Error(emojiMatch[0])
                        }
        
                        console.log("binary",binary)

                        let binaryOutput = Interpreter.makeFrame(binary);

                        if(unconnectedModules.length){
                            // console.log('unconnectedModules')
                            // console.log(unconnectedModules)
        
                            if(unconnectedModules.length == 1 && unconnectedModules[0] == '0') {
                                // console.log('unconnectedModules == 0')
                                this.retryCount = 0;

                                if (binaryOutput.errorCode != 0)
                                {
                                    console.log("interpreter generate error : " + binaryOutput.errorCode);
                                    // window.android.failUpload("코드를 만들 수 없어요.");
                                    // throw binaryOutput.errorCode;
                                }

                                window.android.uploadCode(binaryOutput.block);
                            }
                                
                            else {
                                window.android.checkModules(JSON.stringify(unconnectedModules)) // app에 리스트를 전달
                            }
                        } else {
                            this.retryCount = 0;
                            window.android.uploadCode(binaryOutput.block);
                    
                        }

                        Entry.binaryOutput = binaryOutput.block
        
                        // data 초기화
                        Entry.TextCodingUtil.imgData = []
                        Entry.TextCodingUtil.melodyTempo = []
        
                        // 프로젝트 저장
                        console.log('exportProject')
                        let project = Entry.exportProject();
                        Entry.project = project
                  
                    }

                    catch(e) {
                        
                        console.log('export error', e);
                        window.android.log(e);
        
                        if(e == 'thread') {
                            this.retryCount++;
                        }

                        if(this.retryCount >= 3) {
                            this.retryCount = 0;
                            window.android.entryRefresh();
                        }
                       
                    }
               
                
                break;
            case 'REMOTE':
                createjs.Sound.play('entryMenuClick');
                window.android.callFuntion('REMOTE');

                break;
           
            default:
                break;
        }
    }

    

    zoomChange(mode) {
        switch (mode) {
            case this.ZOOM_MODE.OUT:
                if (this.ZOOM_LEVEL > 0) {
                    this.ZOOM_LEVEL -= 1;
                    this.setScale(this.ZOOM_RANGE[this.ZOOM_LEVEL]);
                }
                break;
            case this.ZOOM_MODE.IN:
                if (this.ZOOM_LEVEL < this.ZOOM_RANGE.length - 1) {
                    this.ZOOM_LEVEL += 1;
                    this.setScale(this.ZOOM_RANGE[this.ZOOM_LEVEL]);
                }
                break;
            case this.ZOOM_MODE.RESET:
            default:
                const resetIndex = this.ZOOM_RANGE.indexOf(1);
                if (this.ZOOM_LEVEL !== resetIndex) {
                    this.ZOOM_LEVEL = 2;
                    this.setScale(this.ZOOM_RANGE[this.ZOOM_LEVEL]);
                }
                break;
        }
    }

    setScale(scale = 1) {
        const zoomGroup = this.boardMap.get(this.nowBoard);
        const { workspace } = this.nowBoard;
        workspace.setScale(scale);
    
        const { scroller } = this.nowBoard;
        scroller.resizeScrollBar && scroller.resizeScrollBar.call(scroller);
    }

    setPosition() {
        if (!this.nowBoard) {
            return;
        }
        var svgDom = this.nowBoard.svgDom;
        this.x = svgDom.width() - (this.CONTROLLER_WIDTH + 170);
        this.y = svgDom.height() - 100;
        // const svgDom = this.board.svgDom;
        
        this.align();

        // TODO: 임시 코드 (생성자 firstZoom)
        if (!this.firstZoom) {
            this.setScale(1.2);
            this.firstZoom = true;
        }
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    align() {
        var position = this.getPosition();
        this.boardMap.forEach((zoomGroup) => {
            zoomGroup.svgZoom.attr({
                transform: `translate(${position.x}, ${position.y})`,
            });
        });
    }

    setBoard(board) {
        this.nowBoard = board;
        const zoomGroup = this.boardMap.get(board);
        if (!zoomGroup) {
            this.boardMap.set(board, this.generateView());
        }
        this.setPosition();
    }

    destroy() {
       
        delete this.nowBoard;
        delete this.boardMap;
    }
};
