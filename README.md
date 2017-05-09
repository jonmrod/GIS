# Geographical Information System/RDash Admin 

## Setting Up
Make sure you have **ionic, pm2 and npm** installed on your machine before anything

Name of Package | Command
------------ | -------------
npm | brew install npm
ionic | npm install -g ionic
gulp | npm install -g gulp


## Before Running
Before you run the app the first time, make sure all packages are installed.

```npm install```
```bower install```

## Ready to Run
Open two terminals windows:

On first window, start the gulp local server:
```cd rdash```
```gulp build```
```gulp```

On second window, start the ionic server (app):
```cd GIS```
```ionic serve```

## Using PM2 - installed on yoda
**We already have gulp/node server running on admin account**
<br>
<i>We're using PM2 to keep the gulp/node server process alive 24/7</i>

while being admin
```su```

To see current processes:
```pm2 list```

To add/delete process:
```pm2 add [FILENAME]```
```pm2 delete [FILENAME]```

## Testing/installing ionic App
Follow the guide - [How to test/install app](http://ionicframework.com/docs/v1/guide/testing.html)
**Must have a Apple computer to install iOS app**

## MongoDB
Right now, the mongo database is on a mLab instance with 500mb space. Database should be migrated to vader.kean.edu in the future.

Notes on the mongoDB document are located on: ```GIS/server/server.js```

App should be opening on your browser :)
