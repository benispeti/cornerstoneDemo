"use strict";

var orthanc = (function () {
    var orthanc = {},
        server = {host: '', port: ''},
        credentials = {username: '', password: ''};

    orthanc.setServer = function (host, port) {
        server.host = host;
        server.port = port;
    };
    orthanc.setCredentials = function (user, pwd) {
        credentials.username = user;
        credentials.password = pwd;
    };
    //TODO: move to somewhere else and read from config
    orthanc.setServer("localhost", 8042);
    orthanc.setCredentials("orthanc", "orthanc");
    
    orthanc.getCredentialsString = function () {
        return credentials.username + ":" + credentials.password;
    };

    orthanc.getInstanceFileUrl = function (instanceId) {
        return "dicomweb://" + server.host + ":" + server.port + "/instances/" + instanceId + "/file";
    };

    orthanc.getStudiesOfPatient = function (patientId, callback) {
        var xmlHttp = new XMLHttpRequest(),
            url = "http://" + server.host + ":" + server.port + "/patients/" + patientId + "/studies/";
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(JSON.parse(xmlHttp.responseText));
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    };
    
    orthanc.getSeriesOfStudy = function (studyId, callback) {
        var xmlHttp = new XMLHttpRequest(),
            url = "http://" + server.host + ":" + server.port + "/studies/" + studyId + "/series/";
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(JSON.parse(xmlHttp.responseText));
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    };

    return orthanc;
}());