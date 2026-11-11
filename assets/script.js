// NNN site-wide effects and radio player.
(() => {
  const layer = document.querySelector('.paper-layer');
  if (layer) {
    const colors = ['#ffb547', '#f04438', '#8acaff', '#b99aff', '#f4f6fb'];
    const makePaper = () => {
      if (document.hidden || layer.childElementCount > 34) return;
      const piece = document.createElement('span');
      piece.className = 'paper';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--drift', (Math.random() * 150 - 75) + 'px');
      piece.style.setProperty('--spin', (Math.random() * 700 + 200) + 'deg');
      const duration = Math.random() * 5 + 6;
      piece.style.animationDuration = duration + 's';
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), duration * 1000);
    };
    for (let i = 0; i < 18; i++) window.setTimeout(makePaper, i * 180);
    window.setInterval(makePaper, 420);
  }

  const wishButton = document.getElementById('wishButton');
  const wishMessage = document.getElementById('wishMessage');
  if (wishButton && wishMessage) {
    wishButton.addEventListener('click', () => {
      wishMessage.hidden = false;
      wishButton.textContent = 'WISH UNLOCKED ✨';
      wishButton.disabled = true;
      wishButton.style.opacity = '.7';
      wishMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      for (let i = 0; i < 35; i++) {
        window.setTimeout(() => {
          if (!layer) return;
          const p = document.createElement('span');
          p.className = 'paper';
          p.style.left = (35 + Math.random() * 30) + 'vw';
          p.style.top = '35vh';
          p.style.background = ['#ffb547','#f04438','#8acaff','#b99aff'][i % 4];
          p.style.setProperty('--drift', (Math.random() * 260 - 130) + 'px');
          p.style.setProperty('--spin', (Math.random() * 900) + 'deg');
          p.style.animationDuration = (Math.random() * 2 + 2) + 's';
          layer.appendChild(p);
          window.setTimeout(() => p.remove(), 4500);
        }, i * 22);
      }
    });
  }

  // A single shared MP3 source is used on all pages. Playback position and
  // play state are stored per tab so navigation resumes the broadcast.
  const audio = new Audio('assets/niharika-song.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.38;
  const positionKey = 'nnnRadioPosition';
  const playingKey = 'nnnRadioPlaying';
  const savedPosition = Number(sessionStorage.getItem(positionKey) || 0);
  const shouldResume = sessionStorage.getItem(playingKey) === 'yes';
  const radio = document.createElement('button');
  radio.type = 'button';
  radio.className = 'global-radio';
  radio.setAttribute('aria-label', 'Play NNN Radio background music');
  radio.innerHTML = '<span class="global-radio-icon">▶</span><span class="global-radio-label"><span>NNN RADIO</span><small>TAP TO PLAY</small></span>';
  document.body.appendChild(radio);

  const icon = radio.querySelector('.global-radio-icon');
  const label = radio.querySelector('.global-radio-label small');
  const updateRadio = (playing) => {
    radio.classList.toggle('playing', playing);
    icon.textContent = playing ? 'Ⅱ' : '▶';
    label.textContent = playing ? 'NOW PLAYING' : 'TAP TO PLAY';
    radio.setAttribute('aria-label', playing ? 'Pause NNN Radio background music' : 'Play NNN Radio background music');
  };
  const savePosition = () => {
    if (Number.isFinite(audio.currentTime)) sessionStorage.setItem(positionKey, String(audio.currentTime));
  };
  audio.addEventListener('timeupdate', savePosition);
  audio.addEventListener('play', () => { sessionStorage.setItem(playingKey, 'yes'); updateRadio(true); });
  audio.addEventListener('pause', () => updateRadio(false));
  audio.addEventListener('ended', () => { sessionStorage.setItem(positionKey, '0'); });
  window.addEventListener('pagehide', savePosition);
  radio.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        if (audio.currentTime === 0 && Number.isFinite(savedPosition) && savedPosition > 0) {
          audio.currentTime = savedPosition;
        }
        await audio.play();
        sessionStorage.setItem(playingKey, 'yes');
      } catch (error) {
        label.textContent = 'ADD MP3 TO ASSETS';
        sessionStorage.setItem(playingKey, 'no');
      }
    } else {
      audio.pause();
      savePosition();
      sessionStorage.setItem(playingKey, 'no');
    }
  });
  if (shouldResume) {
    audio.addEventListener('loadedmetadata', async () => {
      try {
        if (savedPosition > 0 && savedPosition < audio.duration) audio.currentTime = savedPosition;
        await audio.play();
      } catch (error) {
        updateRadio(false);
        label.textContent = 'TAP TO RESUME';
      }
    }, { once: true });
  }
})();
