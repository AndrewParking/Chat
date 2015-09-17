'use strict';

function getBaseUrl() {
    var prev = window.location.hostname;
    if (prev == 'localhost') {
        return 'http://' + prev + ':8888';
    } else {
        return prev;
    }
}

function getWsUrl() {
    var prev = window.location.hostname;
    if (prev == 'localhost') {
        return 'ws://' + prev + ':8888';
    } else {
        return prev;
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

module.exports = {

    baseUrl: getBaseUrl(),
    wsUrl: getWsUrl(),
    authCookie: getCookie('current_user_id')

};