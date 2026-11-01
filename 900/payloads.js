// Auxiliares de entrega de payload para o host SERMANOVICZ 9.xx.
// Mantenha este arquivo compatível com ES5 para o navegador do PS4.

var LoadedMSG = "Payload Carregado!";
var payloadRequestInFlight = false;

function xhrSucceeded(req) {
    return req.status === 200 || req.status === 304 || (req.status === 0 && req.response);
}

function getPayload(payload, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', payload, true);
    req.responseType = 'arraybuffer';
    req.timeout = 15000;
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.onerror = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.ontimeout = req.onerror;
    req.send();
}

function sendPayload(url, data, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.timeout = 15000;
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.onerror = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.ontimeout = req.onerror;
    req.send(data);
}

function setPayloadStatus(message) {
    var status = document.getElementById('msgs2');
    if (status) status.innerHTML = message;
}

function finishPayloadRequest() {
    payloadRequestInFlight = false;
}

function Loadpayloadonline(PLfile) {
    window.payload_path = PLfile;
    if (typeof window.toogle_payload === 'function') {
        window.toogle_payload(PLfile);
    } else {
        setPayloadStatus('Execute o jailbreak primeiro, depois selecione este payload novamente.');
    }
}

function fallbackToExploitLoader(PLfile) {
    finishPayloadRequest();
    Loadpayloadonline(PLfile);
}

function Loadpayloadlocal(PLfile) {
    if (payloadRequestInFlight) {
        alert('Outra solicitação de payload já está em andamento.');
        return;
    }

    payloadRequestInFlight = true;
    setPayloadStatus('Verificando BinLoader do GoldHEN...');

    var statusReq = new XMLHttpRequest();
    statusReq.open('GET', 'http://127.0.0.1:9090/status', true);
    statusReq.timeout = 1800;
    statusReq.onload = function () {
        var responseJson;
        try {
            responseJson = JSON.parse(statusReq.responseText || '{}');
        } catch (e) {
            fallbackToExploitLoader(PLfile);
            return;
        }

        if (!xhrSucceeded(statusReq) || responseJson.status !== 'ready') {
            if (responseJson.status === 'busy') {
                finishPayloadRequest();
                alert('Não é possível carregar o payload porque o servidor BinLoader está ocupado.');
            } else {
                fallbackToExploitLoader(PLfile);
            }
            return;
        }

        setPayloadStatus('Carregando arquivo de payload...');
        getPayload(PLfile, function (payloadReq) {
            if (!xhrSucceeded(payloadReq) || !payloadReq.response) {
                fallbackToExploitLoader(PLfile);
                return;
            }

            setPayloadStatus('Enviando payload para o GoldHEN...');
            sendPayload('http://127.0.0.1:9090', payloadReq.response, function (sendReq) {
                finishPayloadRequest();
                if (xhrSucceeded(sendReq)) {
                    if (typeof window.awaitpl === 'function') window.awaitpl();
                } else {
                    setPayloadStatus('Falha no envio do payload. Por favor, tente novamente.');
                }
            });
        });
    };
    statusReq.onerror = function () { fallbackToExploitLoader(PLfile); };
    statusReq.ontimeout = statusReq.onerror;
    statusReq.send();
}

function loadPayloadWithConfirmation(file, label, question) {
    if (!confirm(question)) return;
    LoadedMSG = 'Payload ' + label + ' Carregado!';
    Loadpayloadlocal(file);
}

function load_PSFreeFix() {
    loadPayloadWithConfirmation('./payloads/ps4-psfree-fix.bin', 'Correção PSFree', 'Tem certeza de que deseja carregar o payload de Correção PSFree?');
}
function load_app2usb() {
    loadPayloadWithConfirmation('./payloads/app2usb.bin', 'App2USB', 'Carregar payload App2USB? Isso permite transferir aplicativos para o armazenamento USB.');
}
function load_appcache_install() {
    loadPayloadWithConfirmation('./payloads/appcache-install.bin', 'Instalar AppCache', 'Carregar payload Instalar AppCache?');
}
function load_backup() {
    loadPayloadWithConfirmation('./payloads/backup.bin', 'Backup', 'Carregar payload Backup? Isso fará backup dos dados do seu sistema.');
}
function load_disable_updates() {
    loadPayloadWithConfirmation('./payloads/disable-updates.bin', 'Desativar Atualizações', 'Carregar payload Desativar Atualizações? Isso bloqueará as atualizações do sistema.');
}
function load_enable_updates() {
    loadPayloadWithConfirmation('./payloads/enable-updates.bin', 'Ativar Atualizações', 'Carregar payload Ativar Atualizações? Isso permitirá as atualizações do sistema.');
}
function load_ftp() {
    loadPayloadWithConfirmation('./payloads/ftp.bin', 'Servidor FTP', 'Carregar payload Servidor FTP? Isso iniciará um servidor FTP no seu PS4.');
}
function load_history_blocker() {
    loadPayloadWithConfirmation('./payloads/history-blocker.bin', 'Bloqueador de Histórico', 'Carregar payload Bloqueador de Histórico? Isso bloqueará o rastreamento do histórico do navegador.');
}
function load_ps4debug() {
    loadPayloadWithConfirmation('./payloads/ps4debug.bin', 'PS4Debug', 'Carregar payload PS4Debug? Isso ativa os recursos de depuração.');
}
function load_pup_decrypt() {
    loadPayloadWithConfirmation('./payloads/pup-decrypt.bin', 'Descriptografar PUP', 'Carregar payload Descriptografar PUP? Isso permite descriptografar arquivos de atualização do PS4.');
}
function load_restore() {
    loadPayloadWithConfirmation('./payloads/restore.bin', 'Restaurar', 'Carregar payload Restaurar? Isso restaurará os dados do seu sistema.');
}
function load_rif_renamer() {
    loadPayloadWithConfirmation('./payloads/rif-renamer.bin', 'Renomeador RIF', 'Carregar payload Renomeador RIF? Esta ferramenta gerencia arquivos de licença.');
}
function load_webrte() {
    loadPayloadWithConfirmation('./payloads/WebRTE_900.bin', 'WebRTE', 'Carregar payload WebRTE? Isso ativa recursos de edição em tempo real.');
}

window.getPayload = getPayload;
window.sendPayload = sendPayload;
window.Loadpayloadlocal = Loadpayloadlocal;
window.Loadpayloadonline = Loadpayloadonline;
window.load_PSFreeFix = load_PSFreeFix;
window.load_app2usb = load_app2usb;
window.load_appcache_install = load_appcache_install;
window.load_backup = load_backup;
window.load_disable_updates = load_disable_updates;
window.load_enable_updates = load_enable_updates;
window.load_ftp = load_ftp;
window.load_history_blocker = load_history_blocker;
window.load_ps4debug = load_ps4debug;
window.load_pup_decrypt = load_pup_decrypt;
window.load_restore = load_restore;
window.load_rif_renamer = load_rif_renamer;
window.load_webrte = load_webrte;