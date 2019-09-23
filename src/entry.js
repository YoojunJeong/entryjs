__webpack_public_path__ = global.PUBLIC_PATH_FOR_ENTRYJS || 'dist/';
import 'simplebar/dist/simplebar.css';

const Entry = {};

module.exports = Entry;
global.Entry = Entry;
// var module = 'Network network0(0x40201371B0D8);\nLed led0(0x40201371B0D8);\nButton button0(0x2030D92B254A);\n';
// var module = '';
global.Entry.module = '';
global.Entry.project = '';
global.Entry.binaryOutput = '';
global.Entry.volume = '';
global.Entry.guideList = undefined;
global.Entry.modiList = [];
global.Entry.mode = '';
global.Entry.melodyList = {};

global.Entry.videoNum = 0;
global.Entry.isPlayVideo = false;
global.Entry.currentTime = 0;


require('core-js/fn/object/values');
require('./graphicEngine/FakePIXI');
require('./css/entry.less');
require('./class/time_wait');
require('./class/container');
require('./class/dialog');
require('./class/doneProject');
require('./class/engine');
require('./class/entity');
require('./class/function');
require('./class/helper');
require('./class/hw');
require('./class/hw_monitor');
require('./class/intro');
require('./class/object');
require('./class/painter');
require('./class/pdf');
require('./class/playground');
require('./class/popup');
require('./class/popup_helper');
require('./class/popup_list');
require('./class/project');
require('./class/property_panel');
require('./class/reporter');
require('./class/scene');
require('./class/stage');
require('./class/stamp_entity');
require('./class/toast');
require('./class/variable');
require('./class/variable_container');
require('./command/command');
require('./command/commander');
require('./core/collection');
require('./core/db');
require('./core/dom');
require('./core/event');
require('./core/model');
require('./core/observer');
require('./core/svg');
require('./extensions/extension');
require('./extensions/target_checker');
require('./log/activity');
require('./log/activityReporter');
require('./log/recorder');
require('./log/state');
require('./log/state_manager');
require('./model/block_model');
require('./model/block_render_model');
require('./model/box_model');
require('./model/drag_instance');
require('./model/thread_model');
require('./parser-no/block');
require('./parser-no/js');
require('./parser-no/parser');
require('./playground/block');
require('./playground/block_entry');
require('./playground/block_menu');
require('./playground/block_menu_scroll');
require('./playground/block_view');
require('./playground/comment');
require('./playground/board');
require('./playground/code');
require('./playground/code_view');
require('./playground/connection_ripple');
require('./playground/executors');
require('./playground/scope');
require('./playground/globalSvg');
require('./playground/mutator');
require('./playground/renderView');
require('./playground/scroll');
require('./playground/skeleton');
require('./playground/skinner');
require('./playground/thread');
require('./playground/thread_view');
require('./playground/trashcan');
require('./playground/zoom_controller');
require('./playground/vim');
require('./playground/workspace');
require('./textcoding/parser');
require('./util/block_driver');
require('./util/contextmenu');
require('./util/curtain');
require('./util/fuzzy');
require('./util/init');
require('./util/loader');
require('./util/popup');
require('./util/restrictor');
require('./util/static');
require('./util/toast');
require('./util/tooltip');
require('./util/tvCast');
require('./util/virtualScroll');
require('./util/utils');
require('./util/youtube');
require('./util/weather_forecast');
require('./command/commands/block');
require('./command/commands/comment');
require('./command/commands/container');
require('./command/commands/engine');
require('./command/commands/function');
require('./command/commands/object');
require('./command/commands/painter');
require('./command/commands/playground');
require('./command/commands/textbox');
require('./command/commands/variableContainer');
require('./command/commands/scene');
require('./playground/extension/extension');
require('./playground/extension/guide');
require('./playground/extension/side_tag');
require('./playground/field/field');
require('./playground/field/angle');
require('./playground/field/block');
require('./playground/field/color');
require('./playground/field/dropdown');
require('./playground/field/dropdownDynamic');
require('./playground/field/image');
require('./playground/field/indicator');
require('./playground/field/keyboardInput');
require('./playground/field/lineBreak');
require('./playground/field/output');
require('./playground/field/statement');
require('./playground/field/text');
require('./playground/field/textInput');
require('./textcoding/ast/jsAstGenerator');
require('./textcoding/ast/pyAstGenerator');
require('./textcoding/data_processing/map');
require('./textcoding/data_processing/queue');
require('./textcoding/error/textCodingError');
require('./textcoding/hint/python');
require('./textcoding/static/codeMap');
require('./textcoding/static/keyboardCode');
require('./textcoding/util/console');
require('./textcoding/util/textCodingUtil');

window.Entry = Entry;
