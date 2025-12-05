// NOTE: This file must only run on the client (Howler depends on window/audio APIs).
let Howl;
let initialized = false;

const DEFAULT_TRACKS = [
  {
    id: "rain",
    name: "Rain",
    src: "/sounds/rain.mp3",
    defaultVolume: 0.6,
    loop: true,
  },
];

class AudioManager {
  constructor() {
    this.howls = {}; // id -> Howl instance
    this.trackMeta = {}; // id -> meta (volume, playing, muted, solo)
    this.availableTracks = DEFAULT_TRACKS;
  }

  async init(tracksConfig = null) {
    if (typeof window === "undefined") return;
    if (!Howl) {
      const mod = await import("howler");
      Howl = mod.Howl;
    }

    const trackList =
      tracksConfig && tracksConfig.length ? tracksConfig : this.availableTracks;

    // initialize howls
    trackList.forEach((t) => {
      const id = t.id;
      if (this.howls[id]) {
        // update src/volume if needed
        this.howls[id].volume(t.volume ?? t.defaultVolume ?? 1);
        return;
      }

      // create Howl instance
      try {
        const h = new Howl({
          src: Array.isArray(t.src) ? t.src : [t.src],
          loop: t.loop ?? true,
          volume: t.volume ?? t.defaultVolume ?? 1,
        });
        this.howls[id] = h;
        this.trackMeta[id] = {
          id,
          name: t.name,
          volume: t.volume ?? t.defaultVolume ?? 1,
          playing: false,
          muted: t.muted ?? false,
          solo: t.solo ?? false,
        };
      } catch (e) {
        console.error("AudioManager init Howl error for", id, e);
      }
    });

    initialized = true;
  }

  // play a track
  play(id) {
    if (!initialized || !this.howls[id]) return;
    const anySolo = Object.values(this.trackMeta).some((m) => m.solo);
    if (anySolo && !this.trackMeta[id].solo) {
      return;
    }
    if (this.trackMeta[id].muted) return;

    try {
      this.howls[id].play();
      this.trackMeta[id].playing = true;
    } catch (e) {
      console.error("play error", id, e);
    }
  }

  pause(id) {
    if (!initialized || !this.howls[id]) return;
    try {
      this.howls[id].pause();
      this.trackMeta[id].playing = false;
    } catch (e) {
      console.error("pause error", id, e);
    }
  }

  stop(id) {
    if (!initialized || !this.howls[id]) return;
    try {
      this.howls[id].stop();
      this.trackMeta[id].playing = false;
    } catch (e) {
      console.error("stop error", id, e);
    }
  }

  setVolume(id, vol) {
    if (!initialized || !this.howls[id]) return;
    vol = Math.max(0, Math.min(1, vol));
    try {
      this.howls[id].volume(vol);
      this.trackMeta[id].volume = vol;
    } catch (e) {
      console.error("setVolume error", id, e);
    }
  }

  mute(id, muted = true) {
    if (!initialized || !this.howls[id]) return;
    try {
      this.howls[id].mute(muted);
      this.trackMeta[id].muted = muted;
      if (muted) {
        this.trackMeta[id].playing = false;
      }
    } catch (e) {
      console.error("mute error", id, e);
    }
  }

  setSolo(id, solo = true) {
    if (!initialized) return;
    Object.keys(this.trackMeta).forEach((tid) => {
      this.trackMeta[tid].solo = tid === id ? !!solo : false;
    });

    const soloActive = Object.values(this.trackMeta).some((m) => m.solo);
    Object.keys(this.trackMeta).forEach((tid) => {
      if (soloActive) {
        if (this.trackMeta[tid].solo) {
          if (!this.trackMeta[tid].muted) this.play(tid);
        } else {
          this.pause(tid);
        }
      } else {
      }
    });
  }

  // get current state snapshot for UI
  getState() {
    return Object.values(this.trackMeta);
  }

  unloadAll() {
    Object.keys(this.howls).forEach((id) => {
      try {
        this.howls[id].unload();
      } catch (e) {
        // ignore
      }
      delete this.howls[id];
      delete this.trackMeta[id];
    });
    initialized = false;
  }
}

// Singleton
const manager = new AudioManager();
export default manager;
