import React from 'react';

interface GameIdFeatureProps {
  product: {
    isApiProduct?: boolean;
    apiRequiredField?: string;
  };
  playerId: string;
  setPlayerId: (id: string) => void;
  inputError: string;
  setInputError: (e: string) => void;
}

export const GameIdFeature: React.FC<GameIdFeatureProps> = ({
  product,
  playerId,
  setPlayerId,
  inputError,
  setInputError,
}) => {
  if (!product.isApiProduct) return null;

  return (
    <div className="space-y-1.5 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 p-3 rounded-2xl border border-yellow-500/15 animate-fade-in" id="game-id-charger-container">
      <label className="block text-[10px] font-bold text-yellow-500 flex items-center gap-1.5 justify-between">
        <span>🎮 {product.apiRequiredField || "معرف اللاعب (Player ID):"}</span>
        <span className="text-red-500 font-bold">*</span>
      </label>
      <input
        type="text"
        required
        placeholder="أدخل المعرّف هنا (مثال: 54682012)..."
        value={playerId}
        onChange={(e) => {
          setPlayerId(e.target.value);
          if (e.target.value.trim()) setInputError('');
        }}
        className="w-full px-3 py-2 bg-[#060b18] border border-yellow-500/30 rounded-xl text-xs text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 outline-none font-mono text-center tracking-wider transition-all"
        id="game-player-id-input"
      />
      {inputError && (
        <span className="block text-[9px] text-red-400 font-bold animate-pulse text-right">
          ⚠️ {inputError}
        </span>
      )}
    </div>
  );
};
