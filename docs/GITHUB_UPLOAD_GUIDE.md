# 🚀 GitHub 上传指南

## ✅ 已完成的准备工作

1. ✅ 创建了 `.gitignore` 文件，保护敏感信息
2. ✅ 创建了 `.env.example` 模板文件
3. ✅ 初始化了 Git 仓库
4. ✅ 完成了首次提交

## 🔒 隐私保护说明

以下文件**不会**被上传到 GitHub（已在 `.gitignore` 中排除）：

- ❌ `.env` - 包含真实的 API Key 和数据库密码
- ❌ `.env.local` - 前端环境变量
- ❌ `node_modules/` - 依赖包
- ❌ `uploads/` - 用户上传的文件
- ❌ `*.log` - 日志文件
- ❌ IDE 配置文件

## 📝 上传步骤

### 方法一：使用 GitHub Desktop（推荐新手）

1. **下载 GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 安装并登录您的 GitHub 账户

2. **添加本地仓库**
   - 点击 "Add an Existing Repository"
   - 选择项目目录：`E:\Dreamer's Brush`
   - 点击 "Add Repository"

3. **发布到 GitHub**
   - 点击 "Publish repository"
   - 填写仓库名称：`dreamers-brush`
   - 可选：添加描述 "AI-powered children's book illustration generator"
   - 保持 "Keep this code private" 未勾选（如果要公开）
   - 点击 "Publish Repository"

### 方法二：使用命令行

1. **在 GitHub 上创建新仓库**
   - 访问：https://github.com/new
   - 仓库名称：`dreamers-brush`
   - 描述：`AI-powered children's book illustration generator`
   - 保持 "Initialize this repository with a README" **未勾选**
   - 点击 "Create repository"

2. **关联远程仓库**
   
   复制 GitHub 提供的命令并执行：
   
   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/dreamers-brush.git
   
   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

3. **验证推送**
   ```bash
   git remote -v
   git status
   ```

### 方法三：使用 SSH（更安全）

1. **生成 SSH Key**（如果还没有）
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **添加 SSH Key 到 GitHub**
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

3. **使用 SSH 地址推送**
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/dreamers-brush.git
   git branch -M main
   git push -u origin main
   ```

## ⚠️ 重要提示

### 1. 确保敏感信息不被泄露

在推送前，再次确认：

```bash
# 检查是否有 .env 文件被跟踪
git ls-files | grep ".env"

# 应该只看到 .env.example，不应该看到 .env
```

如果意外提交了 `.env` 文件：

```bash
# 从 Git 历史中移除
git rm --cached .env
git commit -m "chore: remove .env from tracking"
git push
```

### 2. 更新 .gitignore（如果需要）

如果发现有需要忽略的新文件类型，编辑 `.gitignore` 后：

```bash
git add .gitignore
git commit -m "chore: update gitignore"
git push
```

### 3. 协作者配置

如果要与他人协作：

1. 在 GitHub 仓库页面
2. 点击 "Settings" → "Collaborators"
3. 添加协作者的 GitHub 用户名
4. 设置权限级别（Read/Write/Admin）

## 📋 上传后的操作

### 1. 创建 Release（可选）

```bash
# 打标签
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

然后在 GitHub 上创建 Release：
- 访问：https://github.com/YOUR_USERNAME/dreamers-brush/releases
- 点击 "Create a new release"
- 选择标签 v1.0.0
- 添加发布说明
- 点击 "Publish release"

### 2. 启用 GitHub Pages（可选）

如果要部署前端：

1. 在 GitHub 仓库页面
2. 点击 "Settings" → "Pages"
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"，文件夹选择 "/ (root)"
5. 点击 "Save"

注意：需要先构建项目并配置正确的路径。

### 3. 添加 CI/CD（可选）

创建 `.github/workflows/deploy.yml` 实现自动部署。

## 🔐 安全最佳实践

### 1. 定期轮换 API Key

- 每 3-6 个月更换一次 API Key
- 在阿里云控制台生成新的 Key
- 更新本地的 `.env` 文件

### 2. 使用 GitHub Secrets（用于 CI/CD）

如果在 GitHub Actions 中使用 API Key：

1. 在仓库 Settings → Secrets and variables → Actions
2. 添加新的 secret：`DASHSCOPE_API_KEY`
3. 在 workflow 中使用：`${{ secrets.DASHSCOPE_API_KEY }}`

### 3. 代码审查

- 启用 Branch Protection Rules
- 要求 Pull Request 审查
- 启用 Status Checks

## 📊 验证清单

上传前请确认：

- [ ] `.env` 文件没有被提交
- [ ] `.gitignore` 包含所有需要忽略的文件
- [ ] `.env.example` 存在且格式正确
- [ ] README.md 完整且准确
- [ ] 代码可以正常运行
- [ ] 没有硬编码的敏感信息
- [ ] 许可证文件存在（如需要）

## 🆘 常见问题

### Q1: 推送时提示认证失败？
**A**: 检查 GitHub 用户名和密码是否正确，或使用 Personal Access Token。

### Q2: 不小心提交了 `.env` 文件怎么办？
**A**: 
```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: remove .env and update gitignore"
git push
```

### Q3: 如何查看哪些文件会被上传？
**A**: 
```bash
git ls-files
```

### Q4: 如何撤销最后一次提交？
**A**: 
```bash
git reset --soft HEAD~1
```

## 📞 需要帮助？

如果在上传过程中遇到问题：

1. 检查 Git 状态：`git status`
2. 查看远程仓库：`git remote -v`
3. 查看提交历史：`git log --oneline`
4. 参考 GitHub 官方文档：https://docs.github.com/

---

✅ **现在您可以安全地将项目上传到 GitHub 了！**
