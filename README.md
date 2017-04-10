Cornerstone Demo
================

Demonstration application that shows how to use the various cornerstone components together to build a complete application.

Currently displays a list of studies and displayes them upon selection with series thumbnails and various tools

Cornerstone modules used:

- [Cornerstone (core)](https://github.com/chafey/cornerstone)
- [Cornerstone Tools](https://github.com/chafey/cornerstoneTools)
- [Cornerstone Math](https://github.com/chafey/cornerstoneMath)
- [Cornerstone WADO image loader](https://github.com/chafey/cornerstoneWADOImageLoader)
- [Cornerstone Web image loader](https://github.com/chafey/cornerstoneWebImageLoader)


**[View a live demo here](http://chafey.github.io/cornerstoneDemo)**


Orthanc integration
-------------------
This cornerstone demo viewer is integrated with orthanc DICOM server.

Install
-------

- Clone the repo and switch to it's directory

- Execute **start_cornerstone.sh** to build cornerstone in a docker container.
```
./start_cornerstone.sh
```
Note: If cornerstone was built successfully you can see something like this
```
Done, without errors.
```
