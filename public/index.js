const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");
const settings = {
  file: "./songs/gnr.gp4",
  player: {
    enablePlayer: true,
    soundFont:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
    scrollElement: wrapper.querySelector(".at-viewport"),
  },
};
const api = new alphaTab.AlphaTabApi(main, settings);

function createTrackItem(track) {
  const trackItem = document
    .querySelector("#at-track-template")
    .content.cloneNode(true).firstElementChild;
  trackItem.querySelector(".at-track-name").innerText = track.name;
  trackItem.track = track;
  trackItem.onclick = (e) => {
    e.stopPropagation();
    api.renderTracks([track]);
  };

  const mute = trackItem.querySelector(".at-track-controls .mute");
  mute.onclick = (e) => {
    e.stopPropagation();
    if (mute.classList.contains("active")) {
      api.changeTrackMute([track], false);
      mute.classList.remove("active");
    } else {
      api.changeTrackMute([track], true);
      mute.classList.add("active");
    }
  };

  const solo = trackItem.querySelector(".at-track-controls .solo");
  solo.onclick = (e) => {
    e.stopPropagation();
    if (solo.classList.contains("active")) {
      api.changeTrackSolo([track], false);
      solo.classList.remove("active");
    } else {
      api.changeTrackSolo([track], true);
      solo.classList.add("active");
    }
  };

  const trackVolume = trackItem.querySelector(".at-track-volume");
  trackVolume.onchange = (e) => {
    e.stopPropagation();
    const volume = e.target.value;
    api.changeTrackVolume([track], volume);
  };

  return trackItem;
}

const trackList = wrapper.querySelector(".at-track-list");

api.scoreLoaded.on((score) => {
  trackList.innerHTML = "";
  score.tracks.forEach((track) => {
    trackList.appendChild(createTrackItem(track));
  });
});

api.scoreLoaded.on((score) => {
  wrapper.querySelector(".at-song-title").innerText = score.title;
});

api.renderStarted.on(() => {
  const tracks = new Map();
  api.tracks.forEach((t) => {
    tracks.set(t.index, t);
  });

  const trackItems = trackList.querySelectorAll(".at-track");
  trackItems.forEach((trackItem) => {
    if (tracks.has(trackItem.track.index)) {
      trackItem.classList.add("active");
    } else {
      trackItem.classList.remove("active");
    }
  });
});

const countIn = wrapper.querySelector(".at-controls .at-count-in");
countIn.onclick = () => {
  countIn.classList.toggle("active");
  if (countIn.classList.contains("active")) {
    api.countInVolume = 1;
  } else {
    api.countInVolume = 0;
  }
};

const metronome = wrapper.querySelector(".at-controls .at-metronome");
metronome.onclick = () => {
  metronome.classList.toggle("active");
  if (metronome.classList.contains("active")) {
    api.metronomeVolume = 1;
  } else {
    api.metronomeVolume = 0;
  }
};

const loop = wrapper.querySelector(".at-controls .at-loop");
loop.onclick = () => {
  loop.classList.toggle("active");
  api.isLooping = loop.classList.contains("active");
};

const zoom = wrapper.querySelector(".at-controls .at-zoom select");
zoom.onchange = () => {
  const zoomLevel = parseInt(zoom.value) / 100;
  api.settings.display.scale = zoomLevel;
  api.updateSettings();
  api.render();
};

const layout = wrapper.querySelector(".at-controls .at-layout select");
layout.onchange = () => {
  if (layout.value === "horizontal") {
    api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
  } else if (layout.value === "page") {
    api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
  }
  api.updateSettings();
  api.render();
};

const playPause = wrapper.querySelector(".at-controls .at-player-play-pause");
playPause.onclick = (e) => {
  if (e.target.classList.contains("disabled")) {
    return;
  }
  api.playPause();
};

const stop = wrapper.querySelector(".at-controls .at-player-stop");
stop.onclick = (e) => {
  if (e.target.classList.contains("disabled")) {
    return;
  }
  api.stop();
};

api.playerReady.on(() => {
  playPause.classList.remove("disabled");
  stop.classList.remove("disabled");
});

api.playerStateChanged.on((e) => {
  const icon = playPause.querySelector("i.fas");
  if (e.state === alphaTab.synth.PlayerState.Playing) {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  } else {
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }
});

const speed = wrapper.querySelector(".at-controls .at-speed select");
speed.onchange = () => {
  api.playbackSpeed = speed.value;
  console.log(speed.value);
};

const openFile = wrapper.querySelector(".at-controls .at-open-file");
openFile.onclick = (e) => {
  inputFile.click();
};

const inputFile = wrapper.querySelector(".at-controls .at-open-file input");
inputFile.onchange = (e) => {
  const file = event.target.files[0];
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      api.load(e.target.result, [0]);
    };
    fileReader.readAsArrayBuffer(file);
  }
};
