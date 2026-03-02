# 🧩 Word Connect Game (連字遊戲)

這是一個以 React 構建的現代化連字/填詞遊戲，擁有精美的 UI 與流暢的動畫體驗。玩家可以透過滑動或點擊字母圈（Letter Circle）中的字母來組成單字，並填入上方的網格（Word Grid）中挑戰過關。

這款遊戲同時也整合了**教師管理後台 (Teacher Admin Panel)**，允許自定義關卡、指定可用字母、目標單字以及干擾詞，讓遊戲同時具備高度的教育與客製化價值。

## ✨ 遊戲特色 (Features)

*   **直覺的操作體驗**：支援滑鼠與觸控操作，可透過拖曳連線或是依序點擊的方式來選擇字母。
*   **流暢的動畫回饋**：使用 `framer-motion` 打造精緻的過場動畫、連線繪製軌跡、及正確/錯誤提示的彈跳與震動效果。
*   **多樣化的關卡動態**：根據預設的單字與字母，自動生成填字網格。
*   **教師管理系統**：專屬的 Admin Panel 讓教師能自由建立新關卡、自訂可用字母與學習目標詞彙。
*   **現代化與響應式設計**：採用純粹的扁平化設計與柔和漸層背景 (Soft Gradient)，適配手機到桌機的各種螢幕尺寸。

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **外觀與樣式**: [Tailwind CSS](https://tailwindcss.com/)
*   **動畫套件**: [Framer Motion](https://www.framer.com/motion/)
*   **圖示庫**: [Lucide React](https://lucide.dev/)
*   **開發語言**: JavaScript (ES6+)

## 🚀 快速開始 (Getting Started)

請確保你的開發環境已經安裝了 [Node.js](https://nodejs.org/)。

### 1. 安裝依賴 (Install Dependencies)

```bash
npm install
```

### 2. 啟動開發伺服器 (Start Development Server)

```bash
npm run dev
```

成功啟動後，瀏覽器將自動開啟 `http://localhost:5173`。

### 3. 編譯正式版本 (Build for Production)

```bash
npm run build
```

## 🎮 遊戲玩法簡介

1.  **觀察網格**：畫面上方會顯示此關卡需要拼出的單字長度與數量。
2.  **連接字母**：在下方的圓形字母盤中，按照順序點擊或滑動連接字母。
3.  **送出答案**：放開滑鼠/手指後，系統會自動驗證你的答案是否正確。
4.  **過關提示**：如果卡住了，可以點擊提示（Hint）或打亂字母順序（Shuffle）來獲得靈感。

## 👨‍🏫 教師後台 (Admin Panel)

本專案內建的教師管理模組可允許：
- 新增與儲存自訂關卡資料 (JSON 格式匯入/匯出)。
- 即時預覽設定網格，確保目標單字與干擾詞的難度平衡。

---

**Author**: Max / Game Developer & Educator
