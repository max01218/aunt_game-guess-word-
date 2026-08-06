# 英文連字學習遊戲

我使用 React 製作這個連字遊戲。玩家從圓形字母盤依序選取字母，組成指定單字並填入上方網格；系統也提供教師用的關卡編輯功能，可依教學內容建立不同題目。

## 主要功能

- 支援滑鼠與觸控選取字母。
- 自動檢查答案是否符合目標單字。
- 根據關卡資料產生填字網格。
- 提供提示與重新排列字母功能。
- 使用動畫回饋正確及錯誤操作。
- 配合手機、平板與桌面瀏覽器調整版面。
- 教師可建立、預覽、匯入與匯出關卡資料。

## 使用技術

- React 19、Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React

## 本機執行

```bash
npm install
npm run dev
```

使用 `npm run build` 可產生 production build。

## 設計方式

我將遊戲狀態、關卡資料與畫面 components 分開，讓教師可以替換題目而不必修改主要互動邏輯。Framer Motion 負責轉場與操作回饋，responsive layout 則讓相同流程能在觸控與滑鼠裝置上使用。
