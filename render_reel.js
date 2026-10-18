const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

const ASSETS_DIR = path.resolve(__dirname, 'assets');
const img1 = path.join(ASSETS_DIR, 'puddle_footstep_1791393925443.jpg').replace(/\\/g, '/');
const img2 = path.join(ASSETS_DIR, 'walking_alone_night_1791393959297.jpg').replace(/\\/g, '/');
const img3 = path.join(ASSETS_DIR, 'streetlight_lookback_1791393982652.jpg').replace(/\\/g, '/');

console.log('Rendering 404 HIM 9:16 Instagram Reel...');
const fontPath = 'C\\:/Windows/Fonts/segoeuib.ttf';

// Scene 1: 3.8s (Upward pan from puddle)
const s1Filter = `scale=1080:1920,zoompan=z='min(max(zoom,pzoom)+0.0008,1.20)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)-min(in*0.45,140)':d=114:s=1080x1920:fps=30,format=yuv420p`;

// Scene 2: 4.0s (Upward tracking shot as he walks away)
const s2Filter = `scale=1080:1920,zoompan=z='min(max(zoom,pzoom)+0.0006,1.16)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+min(in*0.35,100)':d=120:s=1080x1920:fps=30,format=yuv420p`;

// Scene 3: 4.0s (Push-in on silhouette under streetlight looking back)
const s3Filter = `scale=1080:1920,zoompan=z='min(max(zoom,pzoom)+0.0008,1.18)':x='iw/2-(iw/zoom/2)-min(in*0.25,60)':y='ih/2-(ih/zoom/2)':d=120:s=1080x1920:fps=30,format=yuv420p`;

console.log('1. Rendering Shot 1 (Puddle step)...');
execSync(`"${ffmpeg}" -y -loop 1 -i "${img1}" -vf "${s1Filter}" -t 3.8 -c:v libx264 -pix_fmt yuv420p shot1.mp4`, { stdio: 'inherit' });

console.log('2. Rendering Shot 2 (Walking away)...');
execSync(`"${ffmpeg}" -y -loop 1 -i "${img2}" -vf "${s2Filter}" -t 4.0 -c:v libx264 -pix_fmt yuv420p shot2.mp4`, { stdio: 'inherit' });

console.log('3. Rendering Shot 3 (Streetlight lookback)...');
execSync(`"${ffmpeg}" -y -loop 1 -i "${img3}" -vf "${s3Filter}" -t 4.0 -c:v libx264 -pix_fmt yuv420p shot3.mp4`, { stdio: 'inherit' });

console.log('4. Blending shots with smooth crossfades...');
const xfadeFilter = `[0:v][1:v]xfade=transition=fade:duration=0.7:offset=3.1[v12];[v12][2:v]xfade=transition=fade:duration=0.7:offset=6.4,format=yuv420p[vbase]`;
execSync(`"${ffmpeg}" -y -i shot1.mp4 -i shot2.mp4 -i shot3.mp4 -filter_complex "${xfadeFilter}" -map "[vbase]" -c:v libx264 blended.mp4`, { stdio: 'inherit' });

console.log('5. Generating dark atmospheric soundscape (rain + sub-bass drone)...');
execSync(`"${ffmpeg}" -y -f lavfi -i "anoisesrc=d=10.4:c=pink:r=44100,lowpass=f=1200,highpass=f=220,volume=0.22" -f lavfi -i "sine=f=55:d=10.4,volume=0.30,lowpass=f=110" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first,afade=t=in:ss=0:d=0.7,afade=t=out:st=9.6:d=0.8[aout]" -map "[aout]" -c:a aac -b:a 192k reel_audio.m4a`, { stdio: 'inherit' });

console.log('6. Adding typography overlays, film grain, vignette, and final grading...');
// Typography alpha timings:
// Text 1: "YOU'LL MISS HIM…" at 0.4s - 2.8s
const a1 = "if(lt(t\\,0.4)\\,0\\,if(lt(t\\,1.0)\\,(t-0.4)/0.6\\,if(lt(t\\,2.3)\\,1\\,if(lt(t\\,2.8)\\,(2.8-t)/0.5\\,0))))";
// Text 2: "WHEN YOU FINALLY REALIZE" at 3.7s - 6.2s
const a2 = "if(lt(t\\,3.7)\\,0\\,if(lt(t\\,4.3)\\,(t-3.7)/0.6\\,if(lt(t\\,5.7)\\,1\\,if(lt(t\\,6.2)\\,(6.2-t)/0.5\\,0))))";
// Text 3: "HE WAS NEVER TRYING TO BE FOUND." at 7.0s - 9.9s
const a3 = "if(lt(t\\,7.0)\\,0\\,if(lt(t\\,7.7)\\,(t-7.0)/0.7\\,if(lt(t\\,9.3)\\,1\\,if(lt(t\\,9.9)\\,(9.9-t)/0.6\\,0))))";
// Text 4: "4 0 4   H I M ." at 8.0s - 9.9s
const a4 = "if(lt(t\\,8.0)\\,0\\,if(lt(t\\,8.6)\\,(t-8.0)/0.6\\,if(lt(t\\,9.3)\\,1\\,if(lt(t\\,9.9)\\,(9.9-t)/0.6\\,0))))";

const textAndEffects = [
  `eq=contrast=1.05:brightness=-0.02:saturation=0.92`,
  `vignette=angle=PI/5`,
  `noise=alls=10:allf=t+u`,
  `drawtext=fontfile='${fontPath}':text='YOU\\'LL MISS HIM...':fontcolor=white:fontsize=62:x=(w-text_w)/2:y=(h-text_h)/2-80:shadowcolor=black@0.7:shadowx=2:shadowy=3:alpha='${a1}'`,
  `drawtext=fontfile='${fontPath}':text='WHEN YOU FINALLY REALIZE':fontcolor=white:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2-80:shadowcolor=black@0.7:shadowx=2:shadowy=3:alpha='${a2}'`,
  `drawtext=fontfile='${fontPath}':text='HE WAS NEVER TRYING TO BE FOUND.':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2-80:shadowcolor=black@0.7:shadowx=2:shadowy=3:alpha='${a3}'`,
  `drawtext=fontfile='${fontPath}':text='4 0 4   H I M .':fontcolor=white@0.85:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2+20:shadowcolor=black@0.5:shadowx=2:shadowy=2:alpha='${a4}'`
].join(',');

execSync(`"${ffmpeg}" -y -i blended.mp4 -i reel_audio.m4a -vf "${textAndEffects}" -c:v libx264 -preset medium -crf 19 -c:a copy -t 10.4 404_HIM_Reel.mp4`, { stdio: 'inherit' });

console.log('SUCCESS: Rendered 404_HIM_Reel.mp4 successfully!');

// Clean up temporary files
try {
  ['shot1.mp4', 'shot2.mp4', 'shot3.mp4', 'blended.mp4', 'reel_audio.m4a'].forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
} catch (e) {}
