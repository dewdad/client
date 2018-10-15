var API_URL = 'http://rc.csztcloud.cn/';
var FILE_URL = API_URL + '/services-user/file/';
// var ECS_WS_URL =  'wss://' + document.location.hostname + '/ws/ecs'; // http://192.168.1.73:9000
var isHttps = document.location.protocol === 'https:';
var ws_protocol = isHttps ? 'wss' : 'ws';
var ECS_WS_URL = isHttps ? `${ws_protocol}://${document.location.hostname}/ws/ecs` : `${ws_protocol}://${document.location.hostname}:8002/ws/ecs`; // http://192.168.1.73:9000
