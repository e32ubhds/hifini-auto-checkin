## HIFINI 音乐磁场 定时自动签到

本项目拉取自 ewigl / hifini-auto-checkin 感谢大佬的贡献

利用 Github Actions 定时任务实现自动签到，支持多账号同时签到。

[![HIFINI-Auto-Checkin](https://github.com/ewigl/hifini-auto-checkin/actions/workflows/Checkin.yml/badge.svg)](https://github.com/ewigl/hifini-auto-checkin/actions/workflows/Checkin.yml)

### 仓库变量

- **ACCOUNTS**：账户信息。推荐使用 [JSON 格式化工具](https://jsoneditoronline.org/) 进行编辑以及格式化以避免格式出错。

  登陆 HIFITI (hifiti.com) 后，打开浏览器控制台，输入 `document.cookie`，回车，在字符串上右键，“复制字符串内容”即可得到 Cookie。
  **使用网站右上角的“退出”按钮退出登录会使 Cookie 失效。**

  配置示例如下。

  ```json
  [
    {
      "name": "这里填写账户备注",
      "cookie": "这里填写 Cookie"
    },
    {
      "name": "这里填写账户备注,只有一个账号可以删除这一条{}记录",
      "cookie": "这里填写 Cookie，有两个以上账号自行在下方添加新的{}记录。"
    }
  ]
  ```

### 使用方法

1. Fork 此仓库。
2. 在 fork 后的仓库中启用 Actions。
3. 配置仓库变量。

详细文档: https://ewigl.github.io/notes/posts/programming/github-actions/

### 注意事项

根据 [GitHub 的政策](https://docs.github.com/zh/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow?tool=webui)，当 60 天内未发生仓库活动时，GitHub 会自动禁用 Actions 定时任务。需要再次手动启用。

### 相关推荐

- [HIFITI 音乐磁场 增强](https://github.com/ewigl/hifiti-enhanced)：一键自动回帖，汇总网盘链接，自动填充网盘提取码。
