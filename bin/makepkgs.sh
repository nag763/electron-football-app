#!usr/bin/sh

electron-packager ../ --icon=../icons/icon.png --platform=linux --overwrite
electron-packager ../ --icon=../icons/icon.ico --platform=win32 --overwrite
electron-packager ../ --icon=../icons/icon.icns --platform=darwin --overwrite

zip -r UnFootballv${1}-win32-x64.zip UnFootball-win32-x64/*
zip -r UnFootballv${1}-linux-x64.zip UnFootball-linux-x64/*
zip -r UnFootballv${1}-darwin-x64.zip UnFootball-darwin-x64/*
