import React from 'react';
import { X, HelpCircle, Keyboard, Play, Compass, Lightbulb, Sparkles } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                《LAB》（推牌）實驗室操作指南
              </h3>
              <p className="text-xs text-slate-400">
                經典 MS-DOS 晶片合成推盤益智遊戲
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
          {/* Section 1: Core Story & Objective */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>遊戲核心機制與目標</span>
            </h4>
            <p className="text-slate-300 leading-relaxed mb-2">
              你扮演留著招牌狂野白髮與八字鬍的<strong className="text-white">愛因斯坦博士</strong>。在實驗室的防靜電地板上，散布著許多不同世代的 IC 積體電路晶片。
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                <strong className="text-emerald-400">推動滑行：</strong>
                博士走到晶片身邊向其推動，晶片會一路滑動直到撞上障礙物或另一顆晶片。
              </li>
              <li>
                <strong className="text-amber-400">相同等級碰撞合成：</strong>
                當兩顆<strong>同等級</strong>的晶片相撞時，它們會融合成更高一階的全新晶片（例如 2× 7400 閘 ➔ 1× 64K SRAM）。
              </li>
              <li>
                <strong className="text-sky-400">終極目標：</strong>
                將整個畫面上的晶片逐步推動合成，直到整個實驗室<strong>只剩下唯一一個最高等級晶片</strong>（最終目標是誕生「超級電腦」）！
              </li>
            </ul>
          </div>

          {/* Section 2: Controls */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2.5 text-sm">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              <span>操作方式與快捷鍵</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">移動科學家 / 推晶片</span>
                <span className="text-emerald-400 font-bold">方向鍵 / W A S D</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">點擊地板自動尋路</span>
                <span className="text-emerald-400 font-bold">滑鼠左鍵 / 觸控點擊</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">復原上一步</span>
                <span className="text-amber-400 font-bold">U 或 Z 鍵</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">重新開始此關</span>
                <span className="text-rose-400 font-bold">R 鍵</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">查看關卡提示</span>
                <span className="text-yellow-400 font-bold">H 鍵</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">靜音 / 開啟音效</span>
                <span className="text-sky-400 font-bold">M 鍵</span>
              </div>
            </div>
          </div>

          {/* Section 3: Puzzle Strategy Tips */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2 text-sm">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>益智解謎通關技巧</span>
            </h4>
            <div className="space-y-1.5 text-slate-300">
              <p>
                <strong>1. 避免死角陷阱：</strong> 若把一顆晶片推到了平坦長牆邊，且兩側沒有可以撞擊的對應同級晶片，這顆晶片可能就永遠無法被移開。
              </p>
              <p>
                <strong>2. 逆向推演：</strong> 每一關晶片的能量總和都是精準計算的！先看最終目標晶片由哪兩顆組成，再看這兩顆由哪些基礎晶片組成。
              </p>
              <p>
                <strong>3. 雷射軌跡輔助：</strong> 當愛因斯坦面對晶片時，地面會出現綠色雷射虛線，直接為你預告晶片推出去後的停靠點或碰撞爆發！
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            開始挑戰實驗室
          </button>
        </div>
      </div>
    </div>
  );
};
