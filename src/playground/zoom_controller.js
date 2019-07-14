import Toast from './toast';
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
    
        zoomGroup.toast = new Toast(this.nowBoard);
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
        zoomGroup.next = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_com_btn_next.png`,
            x: 269,
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
            $(zoomGroup.next).bind('mousedown touchstart', (e) => {
                this.doAction('PICTURE');
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
                var yn = confirm('블록을 초기화 할까요?');
                if(yn) {
                    window.android.callFuntion('RESET');
                }
                
                
                break;
            case 'EXPORT':

                    var yn = confirm('코딩한 내용을 모디 블록으로 내보낼까요?');
                    if(yn) {
                        // c code로 내보낸다
                    
                        try {

                            var startBtnCount = 0;
                            const blockMap = this.nowBoard.code._blockMap;

                            console.log(blockMap);
    
                            const keys = Object.keys(blockMap) || [];

                            console.log('key', keys);

                            keys.forEach((id) => {
                                var block = blockMap[id];

                                console.log('block ',block);

                                if(block.data.type == 'when_run_button_click') {
                                    startBtnCount++;

                                    if(startBtnCount > 1) {
                                        window.android.failUpload('시작버튼은 1개만 사용할 수 있어요.');
                                        throw new Error('시작버튼이 2개 입니다.');
                                    }
                                    // console.log(block.data.type);

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
            
                            // Entry.module = 'Network network0(0x07B4573);\nIr ir0(0x206080B18920);\nDisplay display0(0x4000323AEE9C);\n';
    
                            // console.log('Entry.module', Entry.module);
                            var binary = '"#include "user.hpp"\n\nusing namespace math;\n\nvoid doUserTask()\n{\n';
                            binary += Entry.module;
                            binary += '\n';
                            binary += cOutput;
                            binary += '\nsleep(1);\n}\n}'
                            
                            
                                const binaryOutput= Interpreter.makeFrame(binary);
                            
                                // alert(binary);
                                // alert(Entry.module);
                                // alert(JSON.stringify(binaryOutput.block));
                                // console.log('binary',binary);
                                // console.log('binaryOutput',binaryOutput);
                                // console.log('binaryOutput',JSON.stringify(binaryOutput.block));
                                window.android.uploadCode(binaryOutput.block);
                        }

                        catch (e) {

                            // console.log('error',e.message);
                            window.android.failUpload(e.message);
                        }
                        
                    }
                

             
                
                break;
            case 'REMOTE':
                window.android.callFuntion('REMOTE');

                break;
            case 'PICTURE':
                var yn = confirm('발명품 사진 찍기로 이동할까요?');
                if(yn) {
                    window.android.callFuntion('PICTURE');
                }
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
        zoomGroup.toast.show(`${scale * 100}%`);
        const { scroller } = this.nowBoard;
        scroller.resizeScrollBar && scroller.resizeScrollBar.call(scroller);
    }

    setPosition() {
        if (!this.nowBoard) {
            return;
        }
        var svgDom = this.nowBoard.svgDom;
        this.x = svgDom.width() - (this.CONTROLLER_WIDTH + 250);
        this.y = svgDom.height() - 100;
        // const svgDom = this.board.svgDom;
        
        this.align();

        this.setScale(1.5);
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
        this.boardMap.forEach((zoomGroup) => {
            if (zoomGroup.toast) {
                zoomGroup.toast.destroy();
            }
        });
        delete this.nowBoard;
        delete this.boardMap;
    }
};
