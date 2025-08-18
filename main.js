const signPageUrl = "https://www.hifiti.com/sg_sign.htm";
const responseSuccessCode = "0";

async function checkIn(account) {
  console.log(`【${account.name}】: 开始签到...`);

  const response = await fetch(signPageUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      Cookie: account.cookie,
    },
  });

  if (!response.ok) {
    throw new Error(`网络请求出错 - ${response.status}`);
  }

  const responseJson = await response.json();

  if (responseJson.code === responseSuccessCode) {
    console.log(`【${account.name}】: 签到成功.`);
    return responseJson.message;
  } else {
    if (responseJson.message === "今天已经签过啦！") {
      console.log(`【${account.name}】: ${responseJson.message}`);
      return responseJson.message;
    }
    throw new Error(`签到失败: ${responseJson.message}`);
  }
}

// 处理单个账户签到
async function processSingleAccount(account) {
  try {
    const checkInResult = await checkIn(account);
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

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
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
      await delay(3000); // 延迟3秒
    }
    
    const result = await processSingleAccount(accounts[i]);
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
