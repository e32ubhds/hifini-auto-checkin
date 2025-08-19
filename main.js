const signPageUrl = "https://www.hifiti.com/sg_sign.htm";
const responseSuccessCode = "0";
const request = require('sync-request'); // 需要安装 sync-request 模块

function checkIn(account) {
  console.log(`【${account.name}】: 开始签到...`);

  try {
    const response = request('POST'， signPageUrl， {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Cookie: account.cookie
      },
    });

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(`网络请求出错 - ${response.statusCode}`);
    }

    const responseJson = JSON.parse(response.getBody('utf8'));
    // 新增：打印服务器完整响应,便于调试
    console.log(`【${account.name}】: 服务器响应:`， JSON.stringify(responseJson));

    // 优化：同时检查code和message,避免成功状态下的登录提示
    if (responseJson.code === responseSuccessCode) {
      if (responseJson.message.includes("请登录")) {
        throw new 错误(`签到状态异常: ${responseJson.message}`);
      }
      console.log(`【${account.name}】: 签到成功.`);
      return responseJson.message;
    } else {
      if (responseJson.message === "今天已经签过啦！") {
        console.log(`【${account.name}】: ${responseJson.message}`);
        return responseJson.message;
      }
      throw new Error(`签到失败: ${responseJson.message}`);
    }
  } catch (error) {
    throw error;
  }
}

// 处理单个账户签到
function processSingleAccount(account) {
  try {
    const checkInResult = checkIn(account);
    return {
      accountName: account.name,
      success: true,
      message: checkInResult
    };
  } catch (error) {
    return {
      accountName: account.name,
      success: false,
      message: error.message
    };
  }
}

// 同步延迟函数
function delay(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // 空循环等待
  }
}

function main() {
  let accounts;

  if (process.env.ACCOUNTS) {
    try {
      accounts = JSON.parse(process.env.ACCOUNTS);
    } catch (error) {
      console.log("❌ 账户信息配置格式错误.");
      process.exit(1);
    }
  } else {
    console.log("❌ 未配置账户信息.");
    process.exit(1);
  }

  const results = [];
  
  // 顺序处理每个账户
  for (let i = 0; i < accounts.length; i++) {
    // 对第二个账号（索引为1）添加3秒延迟
    if (i === 1) {
      console.log("\n⏳ 等待3秒后进行下一个账号签到...");
      delay(3000); // 延迟3秒
    }
    
    const result = processSingleAccount(accounts[i]);
    results.push(result);
  }

  console.log(`\n======== 签到结果 ========\n`);

  results.forEach(result => {
    if (result.success) {
      console.log(`【${result.accountName}】: ✅ ${result.message}`);
    } else {
      console.error(`【${result.accountName}】: ❌ ${result.message}`);
    }
  });
}

main();
