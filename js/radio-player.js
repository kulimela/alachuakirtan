class KirtanRadioPlayer {
  constructor() {
    // Audio element
    this.audio = new Audio();
    
    // Player state
    this.state = {
      playlist: [],
      currentTrackIndex: 0,
      isPlaying: false,
      isShuffle: false,
      shuffledPlaylist: [], // Add shuffled playlist array
      repeatMode: 'none', // none, one, all
      volume: 1,
      isMuted: false,
      previousVolume: 1,
      duration: 0,
      currentTime: 0
    };

    // Bind event listeners
    this.audio.addEventListener('ended', () => this.handleTrackEnd());
    this.audio.addEventListener('timeupdate', () => this.handleTimeUpdate());
    this.audio.addEventListener('loadedmetadata', () => this.handleMetadataLoaded());
    this.audio.addEventListener('error', () => this.handleError());
    this.audio.addEventListener('play', () => this.handlePlay());
    this.audio.addEventListener('pause', () => this.handlePause());

    // Initialize after DOM is loaded
    document.addEventListener('DOMContentLoaded', () => this.initialize());
  }

  initialize() {
    try {
      // Cache DOM elements
      this.elements = {
        playPauseBtn: document.querySelector('.btn-play'),
        currentTrackSpan: document.querySelector('.track-title'),
        progressBar: document.querySelector('.progress-bar'),
        progressContainer: document.querySelector('.progress-container'),
        currentTimeSpan: document.querySelector('.current-time'),
        totalTimeSpan: document.querySelector('.total-time'),
        volumeSlider: document.querySelector('.volume-slider input'),
        muteBtn: document.querySelector('.btn-mute'),
        shuffleBtn: document.getElementById('shuffleBtn'),
        repeatBtn: document.getElementById('repeatBtn'),
        playlistPanel: document.querySelector('.playlist-panel'),
        playlistContent: document.querySelector('.playlist-content')
      };

      // Verify critical elements
      if (!this.elements.currentTrackSpan || !this.elements.progressBar) {
        throw new Error('Critical player elements not found');
      }

      // Build playlist and initialize player
      this.buildPlaylist();
      this.setupEventListeners();
      
      if (this.state.playlist.length > 0) {
        this.loadTrack(0);
      }

      console.log('Player initialized successfully');
    } catch (error) {
      console.error('Failed to initialize player:', error);
    }
  }

  buildPlaylist() {
    const links = document.querySelectorAll('a[href$=".mp3"]');
    this.state.playlist = Array.from(links).map(link => ({
      url: link.href,
      title: link.textContent || this.getFileNameFromUrl(link.href),
      artist: link.textContent.split('-')[0]?.trim() || 'Unknown Artist'
    }));
  }

  setupEventListeners() {
    // Progress bar click and drag handling
    if (this.elements.progressContainer) {
      let isDragging = false;

      this.elements.progressContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        this.updateProgressFromEvent(e);
        document.body.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          this.updateProgressFromEvent(e);
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.cursor = '';
        }
      });

      // Touch events for mobile
      this.elements.progressContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        this.updateProgressFromEvent(e.touches[0]);
      });

      document.addEventListener('touchmove', (e) => {
        if (isDragging) {
          e.preventDefault();
          this.updateProgressFromEvent(e.touches[0]);
        }
      });

      document.addEventListener('touchend', () => {
        isDragging = false;
      });
    }

    // Volume control
    this.elements.volumeSlider?.addEventListener('input', (e) => {
      this.setVolume(e.target.value);
    });

    // Next/Previous buttons
    document.querySelector('.btn-prev')?.addEventListener('click', () => this.playPrevious());
    document.querySelector('.btn-next')?.addEventListener('click', () => this.playNext());

    // Shuffle and Repeat buttons
    this.elements.shuffleBtn?.addEventListener('click', () => this.toggleShuffle());
    this.elements.repeatBtn?.addEventListener('click', () => this.toggleRepeat());
  }

  loadTrack(index) {
    try {
      if (index >= 0 && index < this.state.playlist.length) {
        this.state.currentTrackIndex = index;
        const track = this.state.playlist[index];
        
        // Update audio source
        this.audio.src = track.url;
        this.audio.load();

        // Update UI
        this.updateTrackInfo(track);
        
        // Auto-play if was playing or if track ended naturally
        if (this.state.isPlaying) {
          this.play();
        }
      }
    } catch (error) {
      console.error('Error loading track:', error);
      this.handleError();
    }
  }

  updateTrackInfo(track) {
    if (this.elements.currentTrackSpan) {
      this.elements.currentTrackSpan.textContent = track.title;
    }
  }

  play() {
    try {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback error:', error);
          // If there's an error, try playing the next track
          this.playNext();
        });
      }
      this.state.isPlaying = true;
    } catch (error) {
      console.error('Error playing track:', error);
      this.playNext();
    }
  }

  pause() {
    try {
      this.audio.pause();
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }

  togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  handlePlay() {
    this.state.isPlaying = true;
    this.elements.playPauseBtn?.querySelector('i')?.classList.replace('fa-play', 'fa-pause');
  }

  handlePause() {
    this.state.isPlaying = false;
    this.elements.playPauseBtn?.querySelector('i')?.classList.replace('fa-pause', 'fa-play');
  }

  handleTimeUpdate() {
    if (!isNaN(this.audio.duration)) {
      this.state.currentTime = this.audio.currentTime;
      this.state.duration = this.audio.duration;
      
      // Update progress bar
      const progress = (this.state.currentTime / this.state.duration) * 100;
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = `${progress}%`;
      }
      
      // Update time display
      if (this.elements.currentTimeSpan) {
        this.elements.currentTimeSpan.textContent = this.formatTime(this.state.currentTime);
      }
    }
  }

  handleMetadataLoaded() {
    if (this.elements.totalTimeSpan) {
      this.elements.totalTimeSpan.textContent = this.formatTime(this.audio.duration);
    }
  }

  handleTrackEnd() {
    if (this.state.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.play();
    } else if (this.state.repeatMode === 'none' && 
               this.state.currentTrackIndex === this.state.playlist.length - 1) {
      // Stop at the end if repeat is off and we're at the last track
      this.pause();
      this.state.isPlaying = false;
    } else {
      // Otherwise continue to next track (handles both normal play and repeat-all)
      this.playNext();
    }
  }

  handleError() {
    console.error('Audio error:', this.audio.error);
    const currentTrack = this.state.playlist[this.state.currentTrackIndex];
    this.updateTrackInfo({ 
      title: currentTrack ? `${currentTrack.title}` : 'Error loading track'
    });
    // If there's an error, try the next track
    if (this.state.isPlaying) {
      setTimeout(() => this.playNext(), 1000); // Small delay before trying next track
    }
  }

  seekToPosition(position) {
    const newTime = position * this.state.duration;
    if (!isNaN(newTime)) {
      this.audio.currentTime = newTime;
    }
  }

  setVolume(value) {
    const newVolume = value / 100;
    this.state.volume = newVolume;
    this.audio.volume = newVolume;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getFileNameFromUrl(url) {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return decodeURIComponent(fileName.replace('.mp3', ''));
  }

  toggleShuffle() {
    this.state.isShuffle = !this.state.isShuffle;
    console.log('Shuffle state:', this.state.isShuffle); // Debug log
    
    if (this.state.isShuffle) {
      // Create shuffled playlist when shuffle is turned on
      this.state.shuffledPlaylist = [...this.state.playlist]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
        
      // Find current track in shuffled playlist and move it to current position
      const currentTrack = this.state.playlist[this.state.currentTrackIndex];
      const shuffledIndex = this.state.shuffledPlaylist.findIndex(track => track.url === currentTrack.url);
      if (shuffledIndex !== -1) {
        this.state.shuffledPlaylist.splice(shuffledIndex, 1);
        this.state.shuffledPlaylist.splice(this.state.currentTrackIndex, 0, currentTrack);
      }
    }

    // Update shuffle button appearance
    const shuffleBtn = document.querySelector('#shuffleBtn');
    const shuffleIcon = shuffleBtn ? shuffleBtn.querySelector('i') : null;
    console.log('Shuffle button found:', !!shuffleBtn, 'Icon found:', !!shuffleIcon); // Debug log

    if (shuffleBtn && shuffleIcon) {
      if (this.state.isShuffle) {
        shuffleBtn.classList.add('active');
        shuffleIcon.style.color = '#e75113';
      } else {
        shuffleBtn.classList.remove('active');
        shuffleIcon.style.color = '';
      }
    }
  }

  toggleRepeat() {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.state.repeatMode);
    this.state.repeatMode = modes[(currentIndex + 1) % modes.length];
    console.log('Repeat mode:', this.state.repeatMode); // Debug log
    
    // Update repeat button appearance
    const repeatBtn = document.querySelector('#repeatBtn');
    const repeatIcon = repeatBtn ? repeatBtn.querySelector('i') : null;
    console.log('Repeat button found:', !!repeatBtn, 'Icon found:', !!repeatIcon); // Debug log

    if (repeatBtn && repeatIcon) {
      if (this.state.repeatMode === 'none') {
        repeatBtn.classList.remove('active');
        repeatIcon.style.color = '';
        repeatIcon.classList.remove('fa-repeat-1');
        repeatIcon.classList.add('fa-repeat');
      } else {
        repeatBtn.classList.add('active');
        repeatIcon.style.color = '#e75113';
        if (this.state.repeatMode === 'one') {
          repeatIcon.classList.remove('fa-repeat');
          repeatIcon.classList.add('fa-repeat-1');
        } else {
          repeatIcon.classList.remove('fa-repeat-1');
          repeatIcon.classList.add('fa-repeat');
        }
      }
    }
  }

  playNext() {
    let nextIndex;
    if (this.state.isShuffle) {
      nextIndex = (this.state.currentTrackIndex + 1) % this.state.playlist.length;
      // Use the shuffled playlist order
      const nextTrack = this.state.shuffledPlaylist[nextIndex];
      nextIndex = this.state.playlist.findIndex(track => track.url === nextTrack.url);
    } else {
      nextIndex = (this.state.currentTrackIndex + 1) % this.state.playlist.length;
    }
    this.loadTrack(nextIndex);
  }

  playPrevious() {
    let prevIndex;
    if (this.state.isShuffle) {
      prevIndex = this.state.currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = this.state.playlist.length - 1;
      // Use the shuffled playlist order
      const prevTrack = this.state.shuffledPlaylist[prevIndex];
      prevIndex = this.state.playlist.findIndex(track => track.url === prevTrack.url);
    } else {
      prevIndex = this.state.currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = this.state.playlist.length - 1;
    }
    this.loadTrack(prevIndex);
  }

  updateProgressFromEvent(e) {
    const rect = this.elements.progressContainer.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos)); // Clamp between 0 and 1
    this.seekToPosition(pos);
  }
}

// Create player instance
window.kirtanPlayer = new KirtanRadioPlayer();
