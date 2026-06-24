@echo off
chcp 65001 >nul
title 停止服务 - Dreamer's Brush

echo.
echo  正在停止童梦画笔服务...
echo.

:: 停止端口 3266 (前端)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3266.*LISTEN" 2^>nul') do (
    echo  停止前端服务 (PID: %%a, 端口 3266)...
    taskkill /F /PID %%a >nul 2>&1
)

:: 停止端口 3001 (后端)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001.*LISTEN" 2^>nul') do (
    echo  停止后端服务 (PID: %%a, 端口 3001)...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo  所有服务已停止
echo.
timeout /t 2 /nobreak >nul
