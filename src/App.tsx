import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { buildPrompt, generateImage, extractImageUrl } from './services/imageGen';

function App() {
  const [character, setCharacter] = useState('');
  const [action, setAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!character.trim() || !action.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const prompt = buildPrompt(character.trim(), action.trim());
      const response = await generateImage(prompt, 'qwen-image-2.0', '1024*1536');
      const imageUrl = extractImageUrl(response);

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError('图片生成失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFBF3] flex flex-col items-center justify-center px-4 py-12">
      <div
        className="text-center mb-10 animate-fade-in"
        style={{ animation: 'fadeInDown 0.6s ease-out' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#8B7355] mb-2 tracking-wide">
          童梦画笔
        </h1>
        <p className="text-[#A89080] text-sm md:text-base">
          Dreamer's Brush
        </p>
      </div>

      <div
        className="w-full max-w-md space-y-6"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
      >
        <div className="space-y-2">
          <label className="block text-[#8B7355] text-sm font-medium ml-1">
            故事的主角是...
          </label>
          <input
            type="text"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder="一只穿着蓝色小背心的小熊"
            className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-[#DAB8C3] 
                       text-[#5A4A3A] placeholder-[#C8B8A8] outline-none
                       focus:border-[#A8D8C9] focus:ring-2 focus:ring-[#A8D8C9]/30
                       transition-all duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[#8B7355] text-sm font-medium ml-1">
            他/她正在...
          </label>
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="在云朵上钓星星"
            className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-[#A8D8C9] 
                       text-[#5A4A3A] placeholder-[#C8B8A8] outline-none
                       focus:border-[#DAB8C3] focus:ring-2 focus:ring-[#DAB8C3]/30
                       transition-all duration-300"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !character.trim() || !action.trim()}
          className="w-full py-4 px-8 bg-gradient-to-r from-[#DAB8C3] to-[#A8D8C9] 
                     rounded-full text-white font-semibold text-lg shadow-lg
                     shadow-[#DAB8C3]/30 hover:shadow-xl hover:shadow-[#DAB8C3]/40
                     hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
                     disabled:hover:scale-100 disabled:active:scale-100
                     transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>正在绘制...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>画出我的故事</span>
            </>
          )}
        </button>

        {error && (
          <div
            className="text-center text-red-500 text-sm py-2"
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            {error}
          </div>
        )}
      </div>

      {generatedImage && (
        <div
          className="mt-10 w-full max-w-lg"
          style={{ animation: 'fadeInScale 0.5s ease-out' }}
        >
          <div className="bg-white rounded-3xl p-4 shadow-xl shadow-[#DAB8C3]/20">
            <img
              src={generatedImage}
              alt="生成的插画"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
