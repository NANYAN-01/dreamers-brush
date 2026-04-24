@echo off
chcp 65001 >nul
echo ========================================
echo   GitHub 上传助手
echo ========================================
echo.

REM 检查是否已配置 Git
git config --global user.email >nul 2>&1
if errorlevel 1 (
    echo [!] 请先配置 Git 用户信息
    echo.
    set /p EMAIL="请输入您的邮箱: "
    set /p NAME="请输入您的姓名: "
    git config --global user.email "%EMAIL%"
    git config --global user.name "%NAME%"
    echo [√] Git 配置完成
    echo.
)

REM 显示当前状态
echo [i] 当前 Git 状态:
git status --short
echo.

REM 询问远程仓库地址
echo [?] 请选择操作:
echo     1. 添加新的远程仓库
echo     2. 查看现有远程仓库
echo     3. 推送到 GitHub
echo     4. 退出
echo.
set /p CHOICE="请输入选项 (1-4): "

if "%CHOICE%"=="1" goto ADD_REMOTE
if "%CHOICE%"=="2" goto SHOW_REMOTE
if "%CHOICE%"=="3" goto PUSH
if "%CHOICE%"=="4" goto END
goto END

:ADD_REMOTE
echo.
set /p REMOTE_URL="请输入 GitHub 仓库地址 (例如: https://github.com/username/repo.git): "
git remote add origin %REMOTE_URL%
if errorlevel 1 (
    echo [!] 添加远程仓库失败，可能已存在
    set /p UPDATE="是否更新远程仓库地址? (y/n): "
    if "%UPDATE%"=="y" (
        git remote set-url origin %REMOTE_URL%
        echo [√] 远程仓库地址已更新
    )
) else (
    echo [√] 远程仓库添加成功
)
echo.
goto MENU

:SHOW_REMOTE
echo.
echo [i] 当前远程仓库:
git remote -v
echo.
pause
goto MENU

:PUSH
echo.
echo [i] 准备推送到 GitHub...
echo.

REM 检查是否有未提交的更改
git diff --quiet
if not errorlevel 1 (
    echo [i] 没有未提交的更改
) else (
    set /p COMMIT_MSG="请输入提交信息 (直接回车使用默认信息): "
    if "%COMMIT_MSG%"=="" (
        git add .
        git commit -m "chore: update project files"
    ) else (
        git add .
        git commit -m "%COMMIT_MSG%"
    )
)

echo.
echo [i] 推送中...
git push -u origin main
if errorlevel 1 (
    echo.
    echo [!] 推送失败，尝试推送 master 分支...
    git push -u origin master
    if errorlevel 1 (
        echo.
        echo [×] 推送失败！请检查:
        echo     1. 网络连接
        echo     2. GitHub 认证信息
        echo     3. 远程仓库地址是否正确
        echo.
        pause
        goto END
    )
)

echo.
echo ========================================
echo   [√] 推送成功！
echo ========================================
echo.
echo 请访问您的 GitHub 仓库查看代码
echo.
pause
goto END

:MENU
echo.
echo [?] 继续操作:
echo     1. 添加新的远程仓库
echo     2. 查看现有远程仓库
echo     3. 推送到 GitHub
echo     4. 退出
echo.
set /p CHOICE="请输入选项 (1-4): "

if "%CHOICE%"=="1" goto ADD_REMOTE
if "%CHOICE%"=="2" goto SHOW_REMOTE
if "%CHOICE%"=="3" goto PUSH
if "%CHOICE%"=="4" goto END
goto END

:END
echo.
echo 感谢使用！再见！
pause
