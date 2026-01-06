import React, { useState } from 'react';
import { Camera, User, Globe, Sparkles } from 'lucide-react';
import { Client } from "@gradio/client";

const CELEBS = [
  { name: "Virat Kohli", icon: "🏏" },
  { name: "Shah Rukh Khan", icon: "🎬" },
  { name: "Narendra Modi", icon: "🇮🇳" },
  { name: "Elon Musk", icon: "🚀" },
  { name: "Taylor Swift", icon: "🎤" }
];

export default function App() {
  const [selectedCeleb, setSelectedCeleb] = useState(CELEBS[0].name);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    try {
      // This connects to the open-source "Flux" model on Hugging Face
      const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
      const result = await client.predict("/predict", { 
        prompt: `High-end DSLR candid photo of a person shaking hands with ${selectedCeleb}, 8k resolution, shot on 35mm lens, natural lighting, realistic skin textures, cinematic background, luxury setting.`
      });
      setResult(result.data[0]);
    } catch (e) { alert("Error generating. Try again!"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-xl mx-auto space-y-8 pt-10">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tighter italic uppercase">The Power Shake</h1>
          <p className="text-zinc-500">Create a realistic moment with your icons.</p>
        </header>

        <main className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2">
              <Camera size={14} /> 1. Upload Your Clear Face
            </label>
            <div className="h-32 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center hover:border-white transition cursor-pointer">
              <span className="text-zinc-500 text-sm">Tap to select photo</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2">
              <Globe size={14} /> 2. Choose Your Icon
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CELEBS.map((c) => (
                <button 
                  key={c.name}
                  onClick={() => setSelectedCeleb(c.name)}
                  className={`p-4 rounded-xl text-left border transition ${selectedCeleb === c.name ? 'bg-white text-black border-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  <span className="mr-3">{c.icon}</span> {c.name}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={generateImage}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {loading ? "BREATHING LIFE INTO PHOTO..." : <><Sparkles /> GENERATE REAL PHOTO</>}
          </button>
        </main>

        {result && (
          <div className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
            <img src={result} alt="Handshake result" className="w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
