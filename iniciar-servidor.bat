@echo off
chcp 65001 > nul
title Servidor de Publicación RRSS (Puerto 4000)
cd /d "%~dp0"
echo ===================================================================
echo   INICIANDO SERVIDOR DE PUBLICACIÓN RRSS (PLAYWRIGHT ENGINE)
echo ===================================================================
npm start
pause
