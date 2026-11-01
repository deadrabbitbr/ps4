function getNode(id) { return document.getElementById(id); }
function showNotice(message) {
    var notify = getNode('notify');
    var log = getNode('log');
    if (!notify || !log) return;
    notify.style.display = '';
    notify.className = 'notification';
    log.innerHTML = '<h1 style="color:#c5c7ff">' + message + '</h1>';
}
function ani2() {
    var notify = getNode('notify');
    if (!notify) return;
    notify.className = 'notification2';
    setTimeout(hide, 400);
}
function hide() {
    var notify = getNode('notify');
    if (notify) notify.style.display = 'none';
}
function awaitpl() {
    showNotice('Carregando Payload...');
    setTimeout(function () { showNotice(typeof LoadedMSG === 'string' ? LoadedMSG : 'Payload Carregado!'); }, 800);
    setTimeout(ani2, 4000);
}
function load_exploit() { setTimeout(function () { showNotice('Carregando Jailbreak... Por favor aguarde !!!'); }, 50); }
function load_exploit_already() {
    setTimeout(function () { showNotice('O Jailbreak já está Carregado !!!'); }, 50);
    setTimeout(ani2, 4000);
}
function goldhen_already() {
    setTimeout(function () { showNotice('O BinLoader do GoldHEN já está em execução.'); }, 50);
    setTimeout(ani2, 4000);
}
function load_exploit_done() {
    setTimeout(function () { showNotice('Jailbreak realizado com sucesso !!! GoldHEN v2.4b18.12 Carregado !!!'); }, 50);
    setTimeout(ani2, 4000);
}
function LoadFromGHBLS(PLfile) {
    var statusReq = new XMLHttpRequest();
    statusReq.open('GET', 'http://127.0.0.1:9090/status', true);
    statusReq.timeout = 1800;
    statusReq.onload = function () {
        var response;
        try { response = JSON.parse(statusReq.responseText || '{}'); }
        catch (e) { alert('O BinLoader do GoldHEN retornou uma resposta inválida.'); return; }
        if ((statusReq.status !== 200 && statusReq.status !== 304) || response.status !== 'ready') {
            alert(response.status === 'busy' ? 'Não é possível carregar o payload porque o servidor BinLoader está ocupado.' : 'Não é possível carregar o payload porque o servidor BinLoader não está pronto.');
            return;
        }
        getPayload(PLfile, function (payloadReq) {
            if ((payloadReq.status === 200 || payloadReq.status === 304) && payloadReq.response) {
                sendPayload('http://127.0.0.1:9090', payloadReq.response, function (sendReq) {
                    if (sendReq.status === 200 || sendReq.status === 304 || sendReq.status === 0) awaitpl();
                    else alert('Falha no envio do payload. Por favor, tente novamente.');
                });
            } else alert('O arquivo do payload não pôde ser carregado.');
        });
    };
    statusReq.onerror = function () { alert('Não é possível carregar o payload porque o servidor BinLoader não está em execução.'); };
    statusReq.ontimeout = statusReq.onerror;
    statusReq.send();
}
function CalcTime(dur) {
    hrs = Math.floor(dur / 1000 / 60 / 60);
    min = Math.floor(dur / 1000 / 60 - hrs * 60);
    sec = Math.floor(dur / 1000 - min * 60);
    mil = dur.toString().slice(-3);
    if (min !== 0) ShowDuration = ' - WK Explorado em: ' + min + ' minuto' + (min === 1 ? '' : 's') + ', ' + sec + ' segundo' + (sec === 1 ? '' : 's');
    else ShowDuration = ' - Explorado em: ' + sec + ' segundo' + (sec === 1 ? '' : 's');
}
function StartTimer() { StartTime = Date.now(); }
function EndTimer() { EndTime = Date.now(); CalcTime(EndTime - StartTime); document.title += ShowDuration; }