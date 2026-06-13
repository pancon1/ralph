export type JobStage =
  | "queued"
  | "downloading"
  | "transcribing"
  | "analyzing"
  | "cutting"
  | "done"
  | "error";

export type TranscriptWord = {
  word: string;
  start: number; // seconds
  end: number;
};

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type Transcript = {
  text: string;
  language?: string;
  duration?: number;
  segments: TranscriptSegment[];
  words: TranscriptWord[];
};

/** A viral moment chosen by Claude. */
export type Moment = {
  start: number; // seconds in the source video
  end: number;
  title: string;
  caption: string; // hook line shown on the clip
  score: number; // 0-100 virality
  hashtags: string[];
};

/** A produced clip (after ffmpeg). */
export type RenderedClip = Moment & {
  id: string;
  url: string; // public path, e.g. /clips/<job>/clip-1.mp4
  duration: string; // mm:ss
  startLabel: string; // mm:ss of source start
};

export type Job = {
  id: string;
  stage: JobStage;
  progress: number; // 0-100
  source: string; // url or filename
  message?: string;
  error?: string;
  storage?: string; // diagnostic: "cloud ✓", "local (non configuré)", or "échec: ..."
  clips: RenderedClip[];
  createdAt: number;
};
