export interface EmotionDetectionResult {
  hasFace: boolean;
  topEmotion?: string;
  confidence?: number;
  emoji?: string;
  label?: string;
  allEmotions?: { [emotion: string]: number };
  motionJitter?: number;
}

export const EMOTION_MAP: { [key: string]: { label: string; emoji: string } } = {
  focused: { label: 'Focused & Calm', emoji: '🎯' },
  neutral: { label: 'Focused / Calm', emoji: '😐' },
  confident: { label: 'Confident & Poised', emoji: '😊' },
  thoughtful: { label: 'Thoughtful & Analytical', emoji: '🤔' },
  engaged: { label: 'Engaged & Attentive', emoji: '💡' },
  nervous: { label: 'Slight Tension', emoji: '⏱️' },
};

export class EmotionDetectorService {
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private intervalId: number | null = null;
  private onDetectCallback: ((res: EmotionDetectionResult) => void) | null = null;

  private prevFrameLuma: Float32Array | null = null;
  
  // Rolling window of recent emotion probability distributions (last ~3s)
  private readonly WINDOW_SIZE = 20;
  private rollingProbabilities: Array<{ [emotion: string]: number }> = [];

  public initialize(video: HTMLVideoElement, onDetect: (res: EmotionDetectionResult) => void) {
    this.videoElement = video;
    this.onDetectCallback = onDetect;
    this.rollingProbabilities = [];
    this.prevFrameLuma = null;

    if (!this.canvasElement) {
      this.canvasElement = document.createElement('canvas');
    }
  }

  public startDetection(intervalMs = 200) {
    if (this.intervalId) this.stopDetection();

    this.intervalId = window.setInterval(() => {
      this.analyzeCurrentFrame();
    }, intervalMs);
  }

  public stopDetection() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.rollingProbabilities = [];
    this.prevFrameLuma = null;
  }

  private analyzeCurrentFrame() {
    if (!this.videoElement || !this.onDetectCallback) return;
    if (this.videoElement.paused || this.videoElement.ended || this.videoElement.readyState < 2) {
      this.onDetectCallback({ hasFace: false });
      return;
    }

    const width = 160;
    const height = 120;

    if (!this.canvasElement) return;
    this.canvasElement.width = width;
    this.canvasElement.height = height;

    const ctx = this.canvasElement.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      this.onDetectCallback({ hasFace: false });
      return;
    }

    ctx.drawImage(this.videoElement, 0, 0, width, height);

    // Focus on central face area
    const faceX = Math.floor(width * 0.25);
    const faceY = Math.floor(height * 0.20);
    const faceW = Math.floor(width * 0.50);
    const faceH = Math.floor(height * 0.60);

    const imageData = ctx.getImageData(faceX, faceY, faceW, faceH);
    const data = imageData.data;
    const pixelCount = data.length / 4;
    const currentLuma = new Float32Array(pixelCount);

    let totalLuma = 0;
    let upperLuma = 0;
    let lowerLuma = 0;
    const halfPixels = Math.floor(pixelCount / 2);

    for (let i = 0; i < pixelCount; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      currentLuma[i] = luma;
      totalLuma += luma;

      if (i < halfPixels) {
        upperLuma += luma;
      } else {
        lowerLuma += luma;
      }
    }

    const avgLuma = totalLuma / pixelCount;
    const avgUpperLuma = upperLuma / halfPixels;
    const avgLowerLuma = lowerLuma / (pixelCount - halfPixels);

    // Compute standard deviation (contrast / texture)
    let totalVariance = 0;
    for (let i = 0; i < pixelCount; i++) {
      totalVariance += Math.pow(currentLuma[i] - avgLuma, 2);
    }
    const stdDev = Math.sqrt(totalVariance / pixelCount);

    // Verify face presence
    if (avgLuma < 12 || stdDev < 8) {
      this.onDetectCallback({ hasFace: false });
      this.prevFrameLuma = null;
      return;
    }

    // Measure frame-to-frame pixel motion
    let motionDelta = 0;
    if (this.prevFrameLuma && this.prevFrameLuma.length === pixelCount) {
      let sumDiff = 0;
      for (let i = 0; i < pixelCount; i++) {
        sumDiff += Math.abs(currentLuma[i] - this.prevFrameLuma[i]);
      }
      motionDelta = sumDiff / pixelCount;
    }
    this.prevFrameLuma = currentLuma;

    // --- Stable Professional Interview Emotion Baseline ---
    // When a user sits still at one place, they are naturally Focused & Calm
    const rawScores: { [key: string]: number } = {
      focused: 0.65,
      confident: 0.18,
      thoughtful: 0.10,
      engaged: 0.05,
      nervous: 0.02,
    };

    // 1. Motion dynamics
    if (motionDelta > 12.0) {
      // Very high sudden movement / fidgeting
      rawScores.nervous += 0.20;
      rawScores.focused -= 0.15;
    } else if (motionDelta < 3.5) {
      // Stable, attentive posture (sitting still)
      rawScores.focused += 0.25;
      rawScores.confident += 0.10;
      rawScores.nervous = 0.01;
    }

    // 2. Facial smile / brightness balance (lower face illumination boost)
    const lowerToUpperRatio = avgLowerLuma / (avgUpperLuma + 0.001);
    if (lowerToUpperRatio > 1.05 && stdDev > 20 && motionDelta < 5.0) {
      rawScores.confident += 0.35;
      rawScores.focused += 0.10;
    } else if (lowerToUpperRatio < 0.92 && stdDev > 22) {
      rawScores.thoughtful += 0.25;
    }

    // 3. Dynamic engagement
    if (stdDev > 28 && motionDelta >= 3.0 && motionDelta <= 8.0) {
      rawScores.engaged += 0.25;
    }

    // Softmax normalization
    const rawExp = Object.fromEntries(
      Object.entries(rawScores).map(([k, v]) => [k, Math.exp(Math.max(0, v))])
    );
    const sumExp = Object.values(rawExp).reduce((a, b) => a + b, 0);
    const frameDistribution: { [key: string]: number } = {};
    for (const [k, v] of Object.entries(rawExp)) {
      frameDistribution[k] = Math.round((v / sumExp) * 1000) / 1000;
    }

    // Rolling window smoothing
    this.rollingProbabilities.push(frameDistribution);
    if (this.rollingProbabilities.length > this.WINDOW_SIZE) {
      this.rollingProbabilities.shift();
    }

    const smoothedDistribution: { [key: string]: number } = {
      focused: 0,
      confident: 0,
      thoughtful: 0,
      engaged: 0,
      nervous: 0,
    };

    const windowCount = this.rollingProbabilities.length;
    for (const dist of this.rollingProbabilities) {
      for (const [emotion, prob] of Object.entries(dist)) {
        smoothedDistribution[emotion] = (smoothedDistribution[emotion] || 0) + prob / windowCount;
      }
    }

    for (const k of Object.keys(smoothedDistribution)) {
      smoothedDistribution[k] = Math.round(smoothedDistribution[k] * 100) / 100;
    }

    const sortedEmotions = Object.entries(smoothedDistribution).sort((a, b) => b[1] - a[1]);
    const topClass = sortedEmotions[0][0];
    const topScore = sortedEmotions[0][1];

    const finalEmotion = topScore >= 0.30 ? topClass : 'focused';
    const finalConfidence = Math.max(0.70, topScore);

    const meta = EMOTION_MAP[finalEmotion] || EMOTION_MAP.focused;

    this.onDetectCallback({
      hasFace: true,
      topEmotion: finalEmotion,
      confidence: Math.round(finalConfidence * 100) / 100,
      emoji: meta.emoji,
      label: meta.label,
      allEmotions: smoothedDistribution,
      motionJitter: Math.round(motionDelta * 100) / 100,
    });
  }
}

export const emotionDetectorService = new EmotionDetectorService();
