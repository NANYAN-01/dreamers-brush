@echo off
echo ====================================
echo Dreamer's Brush 快速启动脚本
echo ====================================
echo.

echo [1/3] 检查依赖...
if not exist node_modules (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
)
echo ✓ 依赖已安装
echo.

echo [2/3] 检查数据库...
echo 请确保 MySQL 服务已启动
echo.
set /p mysql_running="MySQL 服务是否已启动? (y/n): "
if /i not "%mysql_running%"=="y" (
    echo 请先启动 MySQL 服务，然后重新运行此脚本
    pause
    exit /b 1
)

set /p db_initialized="数据库是否已初始化? (y/n): "
if /i not "%db_initialized%"=="y" (
    echo.
    echo 正在初始化数据库...
    call npm run db:init
    if errorlevel 1 (
        echo 数据库初始化失败！
        pause
        exit /b 1
    )
)
echo ✓ 数据库已就绪
echo.

echo [3/3] 启动服务...
echo.
echo 正在启动后端服务器...
start cmd /k "title Dreamer's Brush - Backend && npm run server"

timeout /t 3 /nobreak >nul

echo 正在启动前端服务器...
start cmd /k "title Dreamer's Brush - Frontend && npm run dev"

echo.
echo ====================================
echo 启动完成！
echo ====================================
echo.
echo 前端: http://localhost:3266
echo 后端: http://localhost:3001
echo API 健康检查: http://localhost:3001/api/health
echo.
echo 按任意键退出此窗口（服务将继续在后台运行）
pause >nul
