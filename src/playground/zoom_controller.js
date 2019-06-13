import Toast from './toast';
import Interpreter from './interpreter'
// import Filbert from '../../extern/util/filbert.js'
// import { threadId } from 'worker_threads';

'use strict';

goog.provide('Blockly.Workspace');
goog.provide('Blockly.Xml');



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

    ZOOM_LEVEL = 2;

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
            href: `${Entry.mediaFilePath}custom/modi_com_btn_refresh.png`,
            x: 0,
            y: 3,
            width: 32,
            height: 32,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
        zoomGroup.export = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_com_btn_export.png`,
            x: 40,
            y: 3,
            width: 32,
            height: 32,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
        zoomGroup.plus = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_com_btn_plus.png`,
            x: 80,
            y: 3,
            width: 32,
            height: 32,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
        zoomGroup.next = zoomGroup.svgZoom.elem('image', {
            href: `${Entry.mediaFilePath}custom/modi_com_btn_next.png`,
            x: 120,
            y: 3,
            width: 32,
            height: 32,
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
                this.doAction('REFRESH');
            });
            $(zoomGroup.export).bind('mousedown touchstart', (e) => {
                this.doAction('EXPORT');
            });
            $(zoomGroup.plus).bind('mousedown touchstart', (e) => {
                this.doAction('PLUS');
            });
            $(zoomGroup.next).bind('mousedown touchstart', (e) => {
                this.doAction('NEXT');
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
            case 'REFRESH':
                var mainWS = Entry.getMainWS();
                console.log(Entry);
                var genBlocks = new Entry.Block(null, null);
                console.log(genBlocks.getBlockList());
                
                var rtl = (document.location.search == '?rtl');
                Blockly.inject(document.getElementById('inject')
                            , {rtl: rtl, path: '../../extern/blockly/tests', toolbox: toolbox});

                console.log(genBlocks);
            
                            
                Blockly.mainWorkspace.topBlocks_ = genBlocks;
                // for(const block of Blockly.mainWorkspace.svgGroup_.children) {   
                //     Blockly.mainWorkspace
                // }    
                // console.log(Entry);
                // Blockly.mainWorkspace = new Blockly.Workspace;
                // console.log(Blockly.mainWorkspace);
                // var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
                // var width = Blockly.svgSize().width;
                var xmlDom = goog.dom.createDom('xml');
                // var blocks = Blockly.mainWorkspace.svgGroup_.childNodes;
                var blocks = Blockly.mainWorkspace.getTopBlocks(true);

                console.log(blocks);

                // for (var i = 0, block; block = blocks[i]; i++) {
                for(const block of blocks) {
                    console.log(block);      
                    var element = Blockly.Xml.blockToDom_(block);
                    // var xy = block.getRelativeToSurfaceXY();
                    // element.setAttribute('x', Blockly.RTL ? width - xy.x : xy.x);
                    // element.setAttribute('y', xy.y);
                    xmlDom.appendChild(element);

                    console.log(element);  
                }
                
                console.log(xmlDom);
                var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

                console.log(xmlText);
                
                break;
            case 'EXPORT':
                var yn = confirm('코딩한 내용을 모디 블록으로 내보낼까요?');
                if(yn) {
                    // c code로 내보낸다.
                   
                    var workspace = Entry.getMainWS();
            
                    const blockMap = this.nowBoard.code._blockMap;

                    const keys = Object.keys(blockMap) || [];
                    keys.forEach((id) => {
                        var block = blockMap[id];
                        // console.log(block);

                        var parser = new Entry.Parser(Entry.Vim.WORKSPACE_MODE);
                        var syntax = parser.mappingSyntax(Entry.Vim.WORKSPACE_MODE);
                        // var blockToPyParser = new Entry.BlockToPyParser(syntax);
                        var blockToCParser = new Entry.BlockToCParser(syntax);
                        // var pyToBlockParser = new Entry.PyToBlockParser(syntax);
    
                        blockToCParser._parseMode = Entry.Parser.PARSE_GENERAL;
                        var options = { locations: true, ranges: true };
                        var code = {
                            registerEvent: function() {},
                            registerBlock: function() {}
                        };
    
                        var blockSchema = Entry.block[block.type];
                        var cOutput = blockToCParser.Thread(new Entry.Thread([blockSchema.def], code));
        
                        console.log(cOutput);
    
                        // blockToPyParser = new Entry.BlockToPyParser(syntax);
                        // blockToPyParser._parseMode = Entry.Parser.PARSE_GENERAL;

                        // var secondPythonOutput = blockToPyParser.Thread(new Entry.Thread(blockOutput[0], code));
                        // console.log(secondPythonOutput);
                    
                    });
                }
                break;
            case 'PLUS':
                alert('PLUS');

                var workspace = Entry.getMainWS();

                console.log(workspace.vimBoard);
               

                break;
            case 'NEXT':
                var yn = confirm('발명품 사진 찍기로 이동할까요?');
                if(yn) {
                    // 사진 찍기로 이동.
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
        this.x = svgDom.width() - (this.CONTROLLER_WIDTH + 122.5);
        this.y = svgDom.height() - 80;
        // const svgDom = this.board.svgDom;
        
        this.align();
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
