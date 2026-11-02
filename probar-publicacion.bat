@echo off
chcp 65001 > nul
title Probar Publicación RRSS
cd /d "%~dp0"
echo ===================================================================
echo   TEST DE PUBLICACIÓN
echo ===================================================================
npm run test-post
pause
