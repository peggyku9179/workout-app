# 運動好習慣 · 週打卡 App

奶茶色系運動打卡 App，支援 Google 登入，每個帳號資料獨立。

---

## 部署步驟（約 15 分鐘）

### 第一步：建立 Supabase 資料庫（免費）

1. 前往 [https://supabase.com](https://supabase.com)，用 Google 登入
2. 點「New Project」，填入名稱（例如 `workout-app`），選區域選 **Singapore**（最近台灣）
3. 等待建立完成（約 1 分鐘）
4. 進入專案後，點左側 **SQL Editor**，貼上以下 SQL 建立資料表：

```sql
create table workout_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date text not null,
  workout_id text not null,
  label text not null,
  icon text not null,
  color text not null,
  duration integer not null,
  created_at timestamptz default now()
);

-- 每個人只能讀寫自己的資料
alter table workout_logs enable row level security;

create policy "Users can manage own logs"
  on workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

5. 點「Run」執行
6. 點左側 **Authentication > Providers**，開啟 **Google**
   - 你需要一組 Google OAuth 憑證（見下方說明）

#### 設定 Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 建立新專案 > **API 與服務 > OAuth 同意畫面** 設定
3. **憑證 > 建立 OAuth 2.0 用戶端 ID**，類型選「Web 應用程式」
4. 授權重新導向 URI 填入：`https://你的專案ID.supabase.co/auth/v1/callback`
5. 將 Client ID 和 Client Secret 貼回 Supabase 的 Google Provider 設定

7. 回到 Supabase **Settings > API**，複製：
   - Project URL（格式：`https://xxxx.supabase.co`）
   - anon public key

---

### 第二步：設定專案

```bash
# 複製環境變數範本
cp .env.example .env.local

# 編輯 .env.local，填入你的 Supabase 資訊
REACT_APP_SUPABASE_URL=https://你的專案ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=你的anon_key
```

---

### 第三步：部署到 Vercel（免費）

1. 把整個資料夾上傳到 [GitHub](https://github.com)（建立新 repo，把檔案拖進去）
2. 前往 [https://vercel.com](https://vercel.com)，用 GitHub 登入
3. 點「New Project」，選你剛建的 repo
4. 在 **Environment Variables** 填入：
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. 點「Deploy」，等約 1 分鐘就有網址了！

---

### 第四步：加入手機主畫面

部署完成後你會拿到一個網址（例如 `https://workout-app-xxx.vercel.app`）

**iPhone：**
Safari 開啟網址 → 下方分享按鈕 → 「加入主畫面」

**Android：**
Chrome 開啟網址 → 右上角選單 → 「新增至主畫面」

---

## 分享給家人

直接把網址傳給爸爸，他用自己的 Google 帳號登入，就有獨立的打卡紀錄！

---

## 功能說明

- ✅ Google 帳號登入，各自資料獨立
- 💪 8 種運動類型可選（重訓、團課、跑步、公路車、羽球、瑜珈、游泳、其他）
- ⏱ 可記錄運動時間（預設或自訂分鐘數）
- 📅 日曆視圖查看歷史紀錄
- 📊 統計總打卡次數、活躍天數、運動時數
- 🎉 打卡成功慶祝動畫
