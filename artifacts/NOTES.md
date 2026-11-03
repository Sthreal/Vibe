# Episode 1 loudness and picture

Full cut: `artifacts/vibe-super-agent-ep1.mp4`  
1080×1920, 30 fps, 12771 frames, 425.700 s.  
Yunyang timeline is unchanged. The picture cuts once per caption on the cream dotted stage.

## ffprobe

```
Duration: 00:07:05.71
Stream #0:0 Video: h264 (High), yuv420p, 1080x1920, 30 fps, 358 kb/s
Stream #0:1 Audio: aac (LC), 48000 Hz, stereo, fltp, 189 kb/s
```

`nb_frames=12771`, audio channel layout stereo.

## volumedetect (full mp4)

```
n_samples: 40867840
mean_volume: -20.2 dB
max_volume: -7.8 dB
```

## loudnorm measurement (full mp4)

`ffmpeg -af loudnorm=print_format=json` reports the file's own integrated loudness in `input_i`. The `output_i` line is that filter retargeting toward its default of -24 LUFS. Do not read `output_i` as the file level.

```
input_i:  -16.31 LUFS
input_tp: -7.65 dBTP
input_lra: 2.00
input_thresh: -26.63
```

Integrated loudness is -16.31 LUFS. Mean volume sits lower because the arithmetic average includes the pauses between sentences. Peak is -7.8 dB, so the track is not clipped and not a quiet file.

Source before this master (`public/voiceover/router-worker-ep1.mp3`): integrated -25.74 LUFS, mean -26.8 dB, true peak -1.08 dB. Peaks were already hot, so a gain-only boost could not reach -16 LUFS. The loud master is the same take after:

```
acompressor=threshold=-30dB:ratio=12:attack=2:release=40:makeup=18:knee=2,
alimiter=limit=0.89:attack=1:release=25:level=false,
loudnorm=I=-16:TP=-1.5:LRA=7
```

Duration stayed 425.712 s → 425.736 s. Remotion muxed that stereo file. The mp4 was not loudnormed again.

## Clips

| File | What | Audio |
| --- | --- | --- |
| `vibe-ep1-preview-55s.mp4` | first 55.07 s, 3.8 MB, stream copy | stereo AAC, mean -20.4 dB, max -8.1 dB |
| `vibe-ep1-audio-proof-18s.mp4` | 18 s from 00:00:06, audio copied | stereo AAC, mean -20.3 dB, max -8.3 dB, integrated -16.40 LUFS |

Stills from the delivered mp4: `still-model.png` (00:24), `still-org.png` (00:33), `still-windows.png` (01:03).
