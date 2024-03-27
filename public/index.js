const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");
const settings = { file: "./songs/gnr.gp4" };
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
  return trackItem;
}

const trackList = wrapper.querySelector(".at-track-list");

api.scoreLoaded.on((score) => {
  trackList.innerHTML = "";
  score.tracks.forEach((track) => {
    trackList.appendChild(createTrackItem(track));
  });
});

api.scoreLoaded.on((score)=>{
  wrapper.querySelector('.at-song-title').innerText = score.title;
  wrapper.querySelector('.at-song-artist').innerText = score.artist;
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

const countIn = wrapper.querySelector('.at-controls .at-count-in');
countIn.onclick = () => {
  countIn.classList.toggle('active');
  if (countIn.classList.contains('active')) {
    api.countInVolume = 1;
  } else {
    api.countInVolume = 0;
  }
};

const metronome = wrapper.querySelector('.at-controls .at-metronome');
metronome.onclick = () => {
  metronome.classList.toggle('active');
  if (metronome.classList.contains('active')) {
    api.metronomeVolume = 1;
  } else {
    api.metronomeVolume = 0;
  }
};

const loop = wrapper.querySelector('.at-controls .at-loop');
loop.onclick = () => {
  loop.classList.toggle('active');
  api.isLooping = loop.classList.contains('active');
};

const zoom = wrapper.querySelector('.at-controls .at-zoom select');
zoom.onchange = ()=>{
  const zoomLevel = parseInt(zoom.value) / 100;
  api.settings.display.scale = zoomLevel;
  api.updateSettings();
  api.render();
};

const layout = wrapper.querySelector('.at-controls .at-layout select');
layout.onchange = () => {
  if (layout.value === 'horizontal') {
      api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
  } else if (layout.value === 'page') {
      api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
  }
  api.updateSettings();
  api.render();
};