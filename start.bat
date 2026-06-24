@echo off
chcp 65001 >nul
title 童梦画笔 - Dreamer's Brush
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║      童梦画笔 - Dreamer's Brush          ║
echo  ║      AI 绘本插画生成器                    ║
echo  ╚══════════════════════════════════════════╝
echo.

:: 检查依赖
echo [1/2] 检查依赖...
if not exist node_modules (
    echo       正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败！
        pause
        exit /b 1
    )
)
echo       依赖已就绪
echo.

:: 启动服务
echo [2/2] 启动服务...
echo.

:: 检查端口是否被占用
netstat -ano | findstr ":3266.*LISTEN" >nul 2>&1
if not errorlevel 1 (
    echo [警告] 端口 3266 已被占用，前端可能已在运行
) else (
    echo       启动前端服务器 (端口 3266)...
    start "童梦画笔 - 前端" cmd /k "cd /d "%~dp0" && npm run dev"
)

netstat -ano | findstr ":3001.*LISTEN" >nul 2>&1
if not errorlevel 1 (
    echo [警告] 端口 3001 已被占用，后端可能已在运行
) else (
    echo       启动后端服务器 (端口 3001)...
    start "童梦画笔 - 后端" cmd /k "cd /d "%~dp0" && npm run server"
)

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║            服务启动完成！                  ║
echo  ╠══════════════════════════════════════════╣
echo  ║                                          ║
echo  ║   前端: http://localhost:3266            ║
echo  ║   后端: http://localhost:3001            ║
echo  ║                                          ║
echo  ║   提示:                                  ║
echo  ║   - 确保 MySQL 服务已启动                ║
echo  ║   - 首次使用请运行 npm run db:init       ║
echo  ║   - 关闭此窗口不影响服务运行             ║
echo  ║                                          ║
echo  ╚══════════════════════════════════════════╝
echo.

:: 延迟后自动打开浏览器
timeout /t 5 /nobreak >nul
start http://localhost:3266

exit
