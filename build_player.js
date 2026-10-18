const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/dell/.gemini/antigravity/brain/bd8134d6-e25c-4ef5-8df9-46f5a483be25';
const workspaceDir = 'C:/Users/dell/Desktop/Helping Hands';

const img1 = fs.readFileSync(path.join(workspaceDir, 'assets/puddle_footstep_1791393925443.jpg')).toString('base64');
const img2 = fs.readFileSync(path.join(workspaceDir, 'assets/walking_alone_night_1791393959297.jpg')).toString('base64');
const img3 = fs.readFileSync(path.join(workspaceDir, 'assets/streetlight_lookback_1791393982652.jpg')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 HIM • Cinematic Instagram Reel</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.4; }
    }
    @keyframes soundWave {
      0%, 100% { height: 4px; }
      50% { height: 16px; }
    }
    .wave-bar:nth-child(1) { animation: soundWave 0.8s infinite ease-in-out; }
    .wave-bar:nth-child(2) { animation: soundWave 1.1s infinite ease-in-out 0.2s; }
    .wave-bar:nth-child(3) { animation: soundWave 0.7s infinite ease-in-out 0.4s; }
    .wave-bar:nth-child(4) { animation: soundWave 1.0s infinite ease-in-out 0.1s; }
  </style>
</head>
<body class="bg-[#080b11] text-[#e2e8f0] font-sans antialiased min-h-screen p-4 md:p-8">
  <div class="max-w-6xl mx-auto space-y-8">
    
    <!-- Top Header Banner -->
    <header class="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1e293b] pb-6 gap-4">
      <div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
            9:16 VERTICAL REEL • 10.4 SEC
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-zinc-900 text-zinc-400 border border-zinc-700">
            1080 × 1920 • 30 FPS • SEAMLESS LOOP
          </span>
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-2">
          404 HIM <span class="text-zinc-500 font-light text-2xl md:text-3xl">/ Faceless Cinematic Identity</span>
        </h1>
        <p class="text-zinc-400 text-sm mt-1">
          Dark moody aesthetic, lonely rainy city atmosphere, volumetric street lighting, minimal typography.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-3">
        <a href="404_HIM_Reel_IG.mp4" download="404_HIM_Reel.mp4" 
           class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition shadow-lg shadow-white/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download Master MP4
        </a>
      </div>
    </header>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Instagram Reel Phone Simulation Frame -->
      <div class="lg:col-span-5 flex justify-center">
        <div class="relative w-full max-w-[360px] aspect-[9/16] rounded-[42px] p-3 bg-[#12161f] border-4 border-[#2d3748] shadow-2xl shadow-cyan-950/20 overflow-hidden select-none">
          
          <!-- Phone Speaker & Notch -->
          <div class="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
            <div class="w-10 h-1 bg-zinc-800 rounded-full"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 ml-3"></div>
          </div>

          <!-- Video Canvas / Player Container -->
          <div class="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex items-center justify-center">
            
            <!-- Native Video Element -->
            <video id="reelVideo" playsinline loop preload="auto" class="absolute inset-0 w-full h-full object-cover z-10">
              <source src="404_HIM_Reel_IG.mp4" type="video/mp4">
              <source src="404_HIM_Reel.mp4" type="video/mp4">
            </video>

            <!-- Canvas Fallback / Interactive Overlay Engine -->
            <canvas id="reelCanvas" width="1080" height="1920" class="absolute inset-0 w-full h-full object-cover z-0"></canvas>

            <!-- Instagram Reel UI Overlay -->
            <div class="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 bg-gradient-to-b from-black/60 via-transparent to-black/80">
              
              <!-- Top Reels Header -->
              <div class="flex items-center justify-between text-white pt-6 px-1">
                <span class="text-sm font-semibold tracking-wide drop-shadow">Reels</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-end gap-0.5 h-4 px-1" id="audioWave">
                    <div class="w-0.5 bg-white wave-bar"></div>
                    <div class="w-0.5 bg-white wave-bar"></div>
                    <div class="w-0.5 bg-white wave-bar"></div>
                    <div class="w-0.5 bg-white wave-bar"></div>
                  </div>
                  <svg class="w-5 h-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
              </div>

              <!-- Right Vertical Action Icons -->
              <div class="self-end flex flex-col items-center gap-4 text-white drop-shadow mb-6">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <span class="text-xs font-semibold mt-1">404K</span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  </div>
                  <span class="text-xs font-semibold mt-1">4,404</span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  </div>
                  <span class="text-xs font-semibold mt-1">Share</span>
                </div>

                <div class="w-8 h-8 rounded-full border-2 border-white/80 overflow-hidden bg-zinc-900 mt-2">
                  <div class="w-full h-full bg-zinc-950 flex items-center justify-center font-mono text-[9px] font-bold text-white">404</div>
                </div>
              </div>

              <!-- Bottom Profile and Caption Information -->
              <div class="space-y-2 text-white pb-1">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold font-mono">
                    404
                  </div>
                  <span class="font-bold text-sm tracking-wide">404him</span>
                  <span class="text-xs px-2 py-0.5 rounded border border-white/40 font-medium">Follow</span>
                </div>
                <p class="text-xs text-zinc-200 line-clamp-2">
                  He was never trying to be found. 🌧️ #404him #cinematic #night #noir #reels
                </p>
                <div class="flex items-center gap-2 text-[11px] text-zinc-300">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                  <span class="truncate">404 HIM • Original Ambient Audio</span>
                </div>
              </div>

            </div>

            <!-- Play / Pause Center Click Overlay -->
            <button id="playOverlayBtn" class="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition opacity-0 hover:opacity-100 focus:opacity-100">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xl">
                <svg id="playIcon" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </button>

          </div>

          <!-- Bottom Timecode & Scrub Bar -->
          <div class="mt-3 px-1">
            <div class="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1">
              <span id="currentTime">00:00.0</span>
              <div class="flex items-center gap-2">
                <button id="muteBtn" class="hover:text-white transition">
                  <span id="muteLabel">🔊 Mute</span>
                </button>
                <span>•</span>
                <span id="durationTime">00:10.4</span>
              </div>
            </div>
            <div class="relative w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer" id="progressBarContainer">
              <div id="progressBar" class="absolute top-0 left-0 h-full bg-cyan-400 w-0 transition-all duration-75"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- Right Column: Storyboard, Typography Timings, and Production Prompts -->
      <div class="lg:col-span-7 space-y-6">

        <!-- Scene Storyboard Progression -->
        <div class="bg-[#12161f] border border-[#1e293b] rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>
              Reel Storyboard & Sequence Architecture
            </h2>
            <span class="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              3 Cinematic Shots
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Shot 1 Card -->
            <div class="bg-[#0b0e14] border border-[#1e293b] rounded-xl p-3 flex flex-col space-y-2 hover:border-zinc-700 transition">
              <div class="relative aspect-[9/16] rounded-lg overflow-hidden bg-black group">
                <img src="assets/puddle_footstep_1791393925443.jpg" alt="Puddle step" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span class="text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">0.0s – 3.8s</span>
                </div>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white uppercase tracking-wider">Shot 1 • Macro Puddle</h3>
                <p class="text-[11px] text-zinc-400 leading-snug mt-0.5">
                  Black shoe stepping into shallow rain puddle with cold street lamp reflections.
                </p>
                <div class="mt-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/50">
                  “YOU’LL MISS HIM…”
                </div>
              </div>
            </div>

            <!-- Shot 2 Card -->
            <div class="bg-[#0b0e14] border border-[#1e293b] rounded-xl p-3 flex flex-col space-y-2 hover:border-zinc-700 transition">
              <div class="relative aspect-[9/16] rounded-lg overflow-hidden bg-black group">
                <img src="assets/walking_alone_night_1791393959297.jpg" alt="Walking alone" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span class="text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">3.1s – 7.1s</span>
                </div>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white uppercase tracking-wider">Shot 2 • Deserted Avenue</h3>
                <p class="text-[11px] text-zinc-400 leading-snug mt-0.5">
                  Camera tracking upward from behind as he walks down the center of an empty wet avenue.
                </p>
                <div class="mt-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/50">
                  “WHEN YOU FINALLY REALIZE”
                </div>
              </div>
            </div>

            <!-- Shot 3 Card -->
            <div class="bg-[#0b0e14] border border-[#1e293b] rounded-xl p-3 flex flex-col space-y-2 hover:border-zinc-700 transition">
              <div class="relative aspect-[9/16] rounded-lg overflow-hidden bg-black group">
                <img src="assets/streetlight_lookback_1791393982652.jpg" alt="Streetlight lookback" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span class="text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">6.4s – 10.4s</span>
                </div>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white uppercase tracking-wider">Shot 3 • Faceless Halt</h3>
                <p class="text-[11px] text-zinc-400 leading-snug mt-0.5">
                  Stops under streetlight, turns slightly back. Hood completely conceals face in shadow.
                </p>
                <div class="mt-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/50">
                  “HE WAS NEVER TRYING TO BE FOUND.”
                </div>
              </div>
            </div>

          </div>

          <!-- Seamless Loop Explanation -->
          <div class="mt-4 p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl flex items-start gap-3">
            <svg class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <div class="text-xs">
              <span class="font-bold text-white">Seamless Loop Design:</span>
              <span class="text-zinc-300">
                At 10.4s, the silhouette pauses on the wet pavement with the back foot stepping into position. The camera tilts downward into the glistening asphalt, cross-dissolving seamlessly back into the puddle footstep of Shot 1. The Reel loops infinitely without any visual hitch.
              </span>
            </div>
          </div>
        </div>

        <!-- Typography & Text Overlay Breakdown -->
        <div class="bg-[#12161f] border border-[#1e293b] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Typography & Timing Specifications
          </h2>
          
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <div class="flex items-center gap-3">
                <span class="font-mono text-cyan-400 font-bold">0.4s – 2.8s</span>
                <span class="font-bold text-white tracking-widest text-sm">“YOU’LL MISS HIM…”</span>
              </div>
              <span class="text-zinc-400 font-mono">Center • Fade 0.5s</span>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <div class="flex items-center gap-3">
                <span class="font-mono text-cyan-400 font-bold">3.7s – 6.2s</span>
                <span class="font-bold text-white tracking-widest text-sm">“WHEN YOU FINALLY REALIZE”</span>
              </div>
              <span class="text-zinc-400 font-mono">Center • Fade 0.6s</span>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <div class="flex items-center gap-3">
                <span class="font-mono text-cyan-400 font-bold">7.0s – 9.9s</span>
                <span class="font-bold text-white tracking-widest text-sm">“HE WAS NEVER TRYING TO BE FOUND.”</span>
              </div>
              <span class="text-zinc-400 font-mono">Center • Fade 0.7s</span>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
              <div class="flex items-center gap-3">
                <span class="font-mono text-cyan-400 font-bold">8.0s – 9.9s</span>
                <span class="font-bold text-cyan-200 tracking-[0.3em] text-xs">“4 0 4   H I M .”</span>
              </div>
              <span class="text-cyan-400 font-mono">Lower Third • Spaced Minimal</span>
            </div>
          </div>
        </div>

        <!-- AI Video Generation Prompts (Runway, Kling, Luma) -->
        <div class="bg-[#12161f] border border-[#1e293b] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            Ready-To-Use Prompts for Video Gen AI
          </h2>
          <p class="text-xs text-zinc-400">
            If you want to render additional continuous video shots in Runway Gen-3, Kling 1.5, or Luma Dream Machine, copy these optimized camera-directed prompts:
          </p>

          <div class="space-y-3">
            <div class="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-300">Runway Gen-3 / Kling 1.5 Video Prompt (Full Continuous Shot)</span>
                <button onclick="copyPrompt('prompt1')" class="text-xs text-cyan-400 hover:text-cyan-300 font-mono">Copy Prompt</button>
              </div>
              <p id="prompt1" class="text-xs text-zinc-300 font-mono bg-black/50 p-2.5 rounded border border-zinc-800 leading-relaxed select-all">
                Cinematic 9:16 vertical video. Slow camera movement starting low-angle close-up on black shoes stepping through a shallow rain puddle on dark asphalt, rippling reflections of streetlights. Camera slowly tilts upward and tracks from behind a lone young man wearing an oversized black hoodie walking down the center of an empty wet city street at night. Light fog, subtle rain, cinematic volumetric lighting, shallow depth of field. At the end, he stops under a vintage streetlamp and slightly looks back over his shoulder, his face completely concealed in deep shadow under the hood. No face reveal, moody 4K cinematography, seamless loop back to pavement.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>

  <script>
    // Elements
    const video = document.getElementById('reelVideo');
    const canvas = document.getElementById('reelCanvas');
    const ctx = canvas.getContext('2d');
    const playOverlayBtn = document.getElementById('playOverlayBtn');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const muteBtn = document.getElementById('muteBtn');
    const muteLabel = document.getElementById('muteLabel');
    const audioWave = document.getElementById('audioWave');

    // Images Base64 for Instant Canvas Rendering
    const images = [];
    const srcList = [
      'data:image/jpeg;base64,${img1}',
      'data:image/jpeg;base64,${img2}',
      'data:image/jpeg;base64,${img3}'
    ];

    let imagesLoaded = 0;
    srcList.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === srcList.length) {
          drawCanvasFrame(0);
        }
      };
      img.src = src;
      images[idx] = img;
    });

    let isPlaying = false;
    let duration = 10.4;
    let canvasAnimTime = 0;
    let lastTimestamp = 0;
    let animFrameId = null;

    // Web Audio Synthesizer for Fallback Ambient Sound
    let audioCtx = null;
    let isMuted = false;

    function initAudio() {
      if (audioCtx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      } catch (e) {}
    }

    // Video Playback Listeners
    video.addEventListener('loadedmetadata', () => {
      duration = video.duration || 10.4;
      durationTimeEl.textContent = formatTime(duration);
    });

    video.addEventListener('timeupdate', () => {
      const current = video.currentTime;
      updateUI(current);
    });

    video.addEventListener('play', () => {
      isPlaying = true;
      playOverlayBtn.classList.add('opacity-0');
      audioWave.style.opacity = '1';
    });

    video.addEventListener('pause', () => {
      isPlaying = false;
      playOverlayBtn.classList.remove('opacity-0');
      audioWave.style.opacity = '0.3';
    });

    // Toggle Play/Pause
    function togglePlay() {
      initAudio();
      if (video.paused) {
        video.play().catch(() => {
          // Fallback to Canvas Animation Player if browser blocks file video autoplay
          startCanvasPlayback();
        });
      } else {
        video.pause();
        stopCanvasPlayback();
      }
    }

    playOverlayBtn.addEventListener('click', togglePlay);

    // Mute Button
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      video.muted = isMuted;
      muteLabel.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
    });

    // Progress Bar Click
    progressBarContainer.addEventListener('click', (e) => {
      const rect = progressBarContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const targetTime = pos * duration;
      if (!video.paused || video.currentTime > 0) {
        video.currentTime = targetTime;
      }
      canvasAnimTime = targetTime;
      updateUI(targetTime);
      drawCanvasFrame(targetTime);
    });

    function updateUI(t) {
      currentTimeEl.textContent = formatTime(t);
      const pct = Math.min((t / duration) * 100, 100);
      progressBar.style.width = pct + '%';
    }

    function formatTime(s) {
      const mins = Math.floor(s / 60);
      const secs = (s % 60).toFixed(1);
      return String(mins).padStart(2, '0') + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Canvas Rendering Engine (Precision Keyframe & Motion Synthesis)
    function drawCanvasFrame(t) {
      if (imagesLoaded < 3) return;
      ctx.clearRect(0, 0, 1080, 1920);

      // Determine active scene
      // Shot 1: 0.0 - 3.8s
      // Shot 2: 3.1 - 7.1s (crossfade 3.1 - 3.8s)
      // Shot 3: 6.4 - 10.4s (crossfade 6.4 - 7.1s)
      if (t < 3.8) {
        // Shot 1
        const progress = t / 3.8;
        const zoom = 1.0 + progress * 0.12;
        const panY = progress * 60;
        drawImageZoom(images[0], zoom, 0, -panY, 1.0);

        if (t >= 3.1) {
          const alpha = (t - 3.1) / 0.7;
          drawImageZoom(images[1], 1.0, 0, 0, alpha);
        }
      } else if (t < 7.1) {
        // Shot 2
        const progress = (t - 3.1) / 4.0;
        const zoom = 1.0 + progress * 0.10;
        const panY = progress * 40;
        drawImageZoom(images[1], zoom, 0, panY, 1.0);

        if (t >= 6.4) {
          const alpha = (t - 6.4) / 0.7;
          drawImageZoom(images[2], 1.0, 0, 0, alpha);
        }
      } else {
        // Shot 3
        const progress = (t - 6.4) / 4.0;
        const zoom = 1.0 + progress * 0.12;
        drawImageZoom(images[2], zoom, 0, 0, 1.0);
      }

      // Vignette
      const grad = ctx.createRadialGradient(540, 960, 400, 540, 960, 1000);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Typography
      drawTypography(t);
    }

    function drawImageZoom(img, zoom, offX, offY, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const w = 1080 * zoom;
      const h = 1920 * zoom;
      const x = (1080 - w) / 2 + offX;
      const y = (1920 - h) / 2 + offY;
      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
    }

    function drawTypography(t) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';

      // Text 1: 0.4s - 2.8s
      if (t >= 0.4 && t <= 2.8) {
        let alpha = 1;
        if (t < 1.0) alpha = (t - 0.4) / 0.6;
        else if (t > 2.3) alpha = (2.8 - t) / 0.5;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText('YOU’LL MISS HIM…', 540, 880);
      }

      // Text 2: 3.7s - 6.2s
      if (t >= 3.7 && t <= 6.2) {
        let alpha = 1;
        if (t < 4.3) alpha = (t - 3.7) / 0.6;
        else if (t > 5.7) alpha = (6.2 - t) / 0.5;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText('WHEN YOU FINALLY REALIZE', 540, 880);
      }

      // Text 3: 7.0s - 9.9s
      if (t >= 7.0 && t <= 9.9) {
        let alpha = 1;
        if (t < 7.7) alpha = (t - 7.0) / 0.7;
        else if (t > 9.3) alpha = (9.9 - t) / 0.6;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 46px system-ui, -apple-system, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText('HE WAS NEVER TRYING TO BE FOUND.', 540, 880);
      }

      // Text 4: 8.0s - 9.9s ("404 HIM.")
      if (t >= 8.0 && t <= 9.9) {
        let alpha = 1;
        if (t < 8.6) alpha = (t - 8.0) / 0.6;
        else if (t > 9.3) alpha = (9.9 - t) / 0.6;
        ctx.globalAlpha = alpha * 0.9;
        ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
        ctx.fillText('4 0 4   H I M .', 540, 960);
      }

      ctx.restore();
    }

    function startCanvasPlayback() {
      isPlaying = true;
      playOverlayBtn.classList.add('opacity-0');
      audioWave.style.opacity = '1';
      lastTimestamp = performance.now();

      function step(now) {
        const dt = (now - lastTimestamp) / 1000;
        lastTimestamp = now;
        canvasAnimTime = (canvasAnimTime + dt) % duration;
        updateUI(canvasAnimTime);
        drawCanvasFrame(canvasAnimTime);
        if (isPlaying) {
          animFrameId = requestAnimationFrame(step);
        }
      }
      animFrameId = requestAnimationFrame(step);
    }

    function stopCanvasPlayback() {
      isPlaying = false;
      playOverlayBtn.classList.remove('opacity-0');
      audioWave.style.opacity = '0.3';
      if (animFrameId) cancelAnimationFrame(animFrameId);
    }

    function copyPrompt(id) {
      const text = document.getElementById(id).textContent.trim();
      navigator.clipboard.writeText(text);
      alert('Prompt copied to clipboard!');
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(workspaceDir, 'reel_player.html'), htmlContent);
fs.writeFileSync(path.join(brainDir, 'reel_player.html'), htmlContent);
console.log('Successfully generated reel_player.html in workspace and artifact directory!');
