var orthanc = (function () {
    "use strict";
    var orthanc = {},
        server = {host: '', port: ''},
        credentials = {username: '', password: ''},
        getStudy = function (studyId, callback) {
            var xmlHttp = new XMLHttpRequest(),
                url = "http://" + server.host + ":" + server.port + "/studies/" + studyId;
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    var studies = [];
                    studies.push(JSON.parse(xmlHttp.responseText));
                    callback(studies);
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        },
        getStudiesOfPatient = function (patientId, callback) {
            var xmlHttp = new XMLHttpRequest(),
                url = "http://" + server.host + ":" + server.port + "/patients/" + patientId + "/studies/";
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    callback(JSON.parse(xmlHttp.responseText));
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        },
        isInstanceDisplayable = function (instance) {
            var tags, url = "http://" + server.host + ":" + server.port + "/instances/" + instance + "/content",
                request = new XMLHttpRequest(),
                PixelData = '7fe0-0010';
            request.open('GET', url, false);  // `false` makes the request synchronous
            request.send(null);

            if (request.status === 200) {
                tags = JSON.parse(request.responseText);
                return tags.indexOf(PixelData) >= 0;
            }
            return false;
        },
        isSeriesDisplayable = function (series) {
            return 0 < series.Instances.length;
        },
        getInstance = function (instanceId) {
            var instance, url = "http://" + server.host + ":" + server.port + "/instances/" + instanceId,
                request = new XMLHttpRequest();
            request.open('GET', url, false);  // `false` makes the request synchronous
            request.send(null);

            if (request.status === 200) {
                instance = JSON.parse(request.responseText);
                return instance;
            }
            return null;
        },
        convertMultiFrameImageToSeries = function(series) {
            var convertedSeries = [];
            series.forEach(function(s) {
                var nonMultiFrameInstances = [];
                s.Instances.forEach(function(instanceId) {
                    var instance = getInstance(instanceId);
                    if (orthanc.isMultiFrameInstance(instance)) {
                        var newSeries = Object.assign({}, s);
                        newSeries.Instances = [instanceId];
//                        newSeries.MainDicomTags.NumberOfFrames = instance.MainDicomTags.NumberOfFrames;
                        convertedSeries.push(newSeries);
                    } else {
                        nonMultiFrameInstances.push(instanceId);
                    }
                });
                if (nonMultiFrameInstances.length > 0) {
                    var newSeries = Object.assign({}, s);
                    newSeries.Instances = nonMultiFrameInstances;
                    convertedSeries.push(newSeries);
                }
            });
            return convertedSeries;
        };

    orthanc.setServer = function (host, port) {
        server.host = host;
        server.port = port;
    };
    orthanc.setCredentials = function (user, pwd) {
        credentials.username = user;
        credentials.password = pwd;
    };
    orthanc.setServer(window.location.hostname, window.location.port);
    orthanc.setCredentials("orthanc", "orthanc");

    orthanc.getCredentialsString = function () {
        return credentials.username + ":" + credentials.password;
    };
    
    orthanc.getFrames = function (instanceId) {
        var frames, url = "http://" + server.host + ":" + server.port + "/instances/" + instanceId + "/frames",
            request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            frames = JSON.parse(request.responseText);
            return frames;
        }
        return [];
    };
    
    orthanc.getInstances = function (seriesId) {
        var instances, url = "http://" + server.host + ":" + server.port + "/series/" + seriesId + "/instances",
            request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            instances = JSON.parse(request.responseText);
            return instances;
        }
        return [];
    };
    
    orthanc.getInstanceTags = function (instanceId) {
        var instance, url = "http://" + server.host + ":" + server.port + "/instances/" + instanceId + "/simplified-tags",
            request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            instance = JSON.parse(request.responseText);
            return instance;
        }
        return null;
    };

    orthanc.getInstanceFileUrl = function (instanceId) {
        return "dicomweb://" + server.host + ":" + server.port + "/instances/" + instanceId + "/file";
    };
    
    orthanc.getFrameFileUrl = function (instanceId, frameId) {
        return "dicomweb://" + server.host + ":" + server.port + "/instances/" + instanceId + "/file?frame=" + frameId;
    };

    orthanc.getStudies = function (QueryString, callback) {
        if (QueryString.patient) {
            getStudiesOfPatient(QueryString.patient, callback);
        } else if (QueryString.study) {
            getStudy(QueryString.study, callback);
        } else {
            callback([]);
        }
    };

    orthanc.getSeriesOfStudy = function (studyId, callback) {
        var xmlHttp = new XMLHttpRequest(),
            url = "http://" + server.host + ":" + server.port + "/studies/" + studyId + "/series/";
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                var i, series = JSON.parse(xmlHttp.responseText);
                for (i = 0; i < series.length; i = i + 1) {
                    series[i].Instances = series[i].Instances.filter(isInstanceDisplayable);
                }
                series = series.filter(isSeriesDisplayable);
                // HACK: convert multiframe images to new series because Orthanc does not do so
                series = convertMultiFrameImageToSeries(series);
                callback(series);
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    };
    
    orthanc.isMultiFrameInstance = function (instance) {
        return instance && instance.MainDicomTags && 
            instance.MainDicomTags.NumberOfFrames && 
            instance.MainDicomTags.NumberOfFrames > 1;
    };

    return orthanc;
}());