# 🪄 DeepSeek Prompt Assistant (Chrome 插件)

这是一个帮你在 Gemini/网页端自动优化提示词的 Chrome 插件。
它能把简短的指令（如“写个贪吃蛇”）自动转化为结构清晰、逻辑严密的专家级提示词。

## 📦 安装方法

1. 下载本仓库的代码（点击 Code -> Download ZIP），并解压。
2. 打开 Chrome 浏览器，进入扩展管理页：`chrome://extensions/`
3. 打开右上角的 **“开发者模式”**。
4. 点击左上角的 **“加载已解压的扩展程序”**，选择解压后的文件夹。

## 🔑 配置 API Key (必读！)

为了保护隐私和安全，本项目未内置 API Key。你需要使用自己的 DeepSeek Key。

1. 在文件夹中找到 `background.js` 文件。
2. 用记事本或代码编辑器打开它。
3. 找到第一行代码：
   ```javascript
   const API_KEY = '在这里填入你的DeepSeek_API_Key';
