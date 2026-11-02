@echo off
chcp 65001 > nul
title Gestor de Sesiones RRSS
cd /d "%~dp0"
echo ===================================================================
echo   GESTOR DE SESIONES PERSISTENTES
echo ===================================================================
npm run login
pause
