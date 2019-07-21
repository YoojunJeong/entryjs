
import Interpreter from './interpreter'

// const interpreter = require('./playground/interpreter');
// import Filbert from '../../extern/util/filbert.js'
// import { threadId } from 'worker_threads';

'use strict';

Entry.ZoomController = class ZoomController {
    constructor(board) {
        this.boardMap = new Map();
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
            height: 85,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
        zoomGroup.export = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_btn_export.png`,
            x: 93,
            y: 3,
            width: 83,
            height: 85,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
            onClick :`window.android.uploadCode(${Entry.binaryOutput})`
        });
        zoomGroup.plus = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_btn_remote_dis.png`,
            x: 181,
            y: 3,
            width: 83,
            height: 85,
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
                    window.android.callFuntion('RESET');
                break;
            case 'EXPORT':


                var startBtnCount = 0;
                const blockMap = this.nowBoard.code._blockMap;

                console.log(blockMap);

                const keys = Object.keys(blockMap) || [];
                keys.forEach((id) => {
                    var block = blockMap[id];
                    if(block.data.type == 'when_run_button_click') {
                        startBtnCount++;
                        if(startBtnCount > 1) {
                            window.android.failUpload('시작버튼은 1개만 사용할 수 있어요.');
                            throw new Error('시작버튼이 2개 입니다.');
                        }
                    }                                
                });

                const block = blockMap[keys[0]];
                var parser = new Entry.Parser(Entry.Vim.WORKSPACE_MODE);
                var syntax = parser.mappingSyntax(Entry.Vim.WORKSPACE_MODE);
                // var blockToPyParser = new Entry.BlockToPyParser(syntax);
                var blockToCParser = new Entry.BlockToCParser(syntax);
                // var pyToBlockParser = new Entry.PyToBlockParser(syntax);

                blockToCParser._parseMode = Entry.Parser.PARSE_GENERAL;
                var cOutput = blockToCParser.Thread(block.getThread());

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
                    moduleList += `float ${el.id_} = 0.0\n`
                })

                // 모듈 블럭 선언
                moduleList = `\n${Entry.module}\n`;

                // 이미지 변수 선언
                for(let i =0 ; i < images.length ; i++){
                    moduleList += `\ndisplay0.addPicture(${images[i]},picture${i});\n`;
                }

                // 코드
                binary += `${cOutput}\n`;
                binary += '    sleep(1);\n}\n'
                binary = binary.replace(/temp/g, moduleList)
                binary = binary.replace(/\t/g, "    ")

                console.log(Entry.module)
                console.log("binary")
                console.log(binary)

                let binaryOutput = Interpreter.makeFrame(binary);

                // data 초기화
                Entry.TextCodingUtil.imgData = []

                let project = Entry.exportProject();

                Entry.binaryOutput = binaryOutput.block
                Entry.project = project
                window.android.uploadCode(binaryOutput.block);
                
                break;
            case 'REMOTE':
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

        this.setScale(1.2);
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
