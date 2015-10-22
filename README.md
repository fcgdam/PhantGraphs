# PhantGraphs
AngularJS SPA for graphing Phant data streams and a simple front-end for IoT device provisioning.

Allows to create a simple Dashboard for graphing data stored in Phant data streams and show it in graphs that can be configured in type and which fields are shown.
It uses AngularJS for a Single Page Application and Angular-chartJS for generating the graphs.

It can graph data.sparkfun.com stream fields and your own data streams hosted on your servers.

Example:
![Phant Dashboard](https://primalcortex.files.wordpress.com/2015/10/selection_242.png)

The graphs will auto update with the most recent data as it arrives to the streams, allowing for live updating of the graphs.

More info here -> https://primalcortex.wordpress.com/2015/10/15/sparkfun-phant-server-data-stream-graphing/

Please comments and feedback on the above link. Thanks!

# How to use it
Clone this repository and just put the app folder under the docroot of some web-server changing it's name to phantgraphs for example. Access it by **http://mywebserver/phantgraphs**.

**IMPORTANT**
The application for working needs the PG-RestServer application available here: https://github.com/fcgdam/PG-RestServer.git to be running.

Without this server running the application won't work.

After installing the PG-RestServer and starting it, on this aplication edit the file **restapi.js** under the folder **scripts** and change the REST API end point:

**Before**
angular.module('phantGraph')
    .constant('RESTENDPOINT_URI','http://localhost:3000/api/') 

**After**
angular.module('phantGraph')
    .constant('RESTENDPOINT_URI',**'http://serveraddress.domain:3000/api/'**)
    

# MQTT
The application also allows to monitor MQTT messages for topics that have been subscrided. The MQTT broker must allow WebSockets connections and be reachable.

# IoT Device Provisioning
The application also permits some simple IoT device provisioning, namely registration, status monitoring and allows configuration data to be saved and fed to the IoT devices.

![Device Provisioning](https://primalcortex.files.wordpress.com/2015/10/selection_239.png)


