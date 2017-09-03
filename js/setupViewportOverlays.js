function setupViewportOverlays(element, data) {
    var parent = $(element).parent();
    
    var progressList = {};

    // Get the overlays
    var childDivs = $(parent).find('.overlay');
    var topLeft = $(childDivs[0]).find('div');
    var topRight = $(childDivs[1]).find('div');
    var bottomLeft = $(childDivs[2]).find('div');
    var bottomRight = $(childDivs[3]).find('div');
    var progressBar = $(childDivs[4]).find('div');

    // Set the overlay text
    $(topLeft[0]).text(data.PatientMainDicomTags.PatientName);
    $(topLeft[1]).text(data.PatientMainDicomTags.PatientID);
    $(topRight[0]).text(data.MainDicomTags.StudyDescription);
    $(topRight[1]).text(data.MainDicomTags.StudyDate);


    // On new image (displayed?)
    function onNewImage(e, eventData) {
        // If we are currently playing a clip then update the FPS
        // Get the state of the 'playClip tool'
        var playClipToolData = cornerstoneTools.getToolState(element, 'playClip');

        // If playing a clip ...
        if (playClipToolData !== undefined && playClipToolData.data.length > 0 && playClipToolData.data[0].intervalId !== undefined && eventData.frameRate !== undefined) {

            // Update FPS
            $(bottomLeft[0]).text("FPS: " + Math.round(eventData.frameRate));
            console.log('frameRate: ' + e.frameRate);

        } else {
            // Set FPS empty if not playing a clip
            if ($(bottomLeft[0]).text().length > 0) {
                $(bottomLeft[0]).text("");
            }
        }

        var toolData = cornerstoneTools.getToolState(element, 'stack');
        if(toolData === undefined || toolData.data === undefined || toolData.data.length === 0) {
            return;
        }
        var stack = toolData.data[0];

        // Update Image number overlay
        $(bottomLeft[2]).text("Image # " + (stack.currentImageIdIndex + 1) + "/" + stack.imageIds.length);
    }
    // Add a CornerstoneNewImage event listener on the 'element' (viewer) (?)
    $(element).on("CornerstoneNewImage", onNewImage);


    // On image rendered
    function onImageRendered(e, eventData) {
        // Set zoom overlay text
        $(bottomRight[0]).text("Zoom:" + eventData.viewport.scale.toFixed(2));
        // Set WW/WL overlay text
        $(bottomRight[1]).text("WW/WL:" + Math.round(eventData.viewport.voi.windowWidth) + "/" + Math.round(eventData.viewport.voi.windowCenter));
        // Set render time overlay text
        $(bottomLeft[1]).text("Render Time:" + eventData.renderTimeInMs + " ms");
    }
    // Add a CornerstoneImageRendered event listener on the 'element' (viewer) (?)
    $(element).on("CornerstoneImageRendered", onImageRendered);


    // On image load progress
    function onImageLoadProgress(e, eventData) {
        clearTimeout(timeOut);
        progressList[eventData.imageId]=eventData.percentComplete;
    }
    // Add a CornerstoneImageLoadProgress event listener on cornerstone
    $(cornerstone).on("CornerstoneImageLoadProgress", onImageLoadProgress);
    
    
    // On image loaded
    function onImageLoaded(e, eventData) {
        clearTimeout(timeOut);
        // Set image load progress overlay text
        var loadedImageList = Object.keys(progressList).reduce(function(p, c) {    
              if (progressList[c] == 100) p[c] = progressList[c];
              return p;
            }, {});
            imageNumber = Object.keys(progressList).length,
            loadedImageNumber = Object.keys(loadedImageList).length;
        // Set image load progress overlay text
        $(progressBar[0]).text("Loading images: " + imageNumber + "/" + loadedImageNumber);
        if (imageNumber == loadedImageNumber) {
            timeOut = setTimeout(hideProgress, 3000);
        }
    }
    // Add a CornerstoneImageLoaded event listener on cornerstone
    $(cornerstone).on("CornerstoneImageLoaded", onImageLoaded);
    
    var timeOut;
    var hideProgress = function() {
        $(progressBar[0]).text("");
        progressList = {};
    }
    
}