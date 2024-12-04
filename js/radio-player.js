class KirtanRadioPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.repeatMode = 'none'; // none, one, all
    this.volume = 1;
    this.isMuted = false;
    this.previousVolume = 1;
    this.playbackSpeed = 1;
    this.isPlaylistVisible = false;
    
    // Initialize audio event listeners
    this.audio.addEventListener('ended', () => this.handleTrackEnd());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
    this.audio.addEventListener('error', () => this.handleError());
    
    // Store DOM elements
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.currentTrackSpan = document.getElementById('currentTrack');
    this.progressBar = document.querySelector('.progress-bar');
    this.currentTimeSpan = document.getElementById('currentTime');
    this.totalTimeSpan = document.getElementById('totalTime');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.muteBtn = document.getElementById('muteBtn');
    this.speedBtn = document.getElementById('speedBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
    this.repeatBtn = document.getElementById('repeatBtn');
    this.playlistPanel = document.getElementById('playlistPanel');
    this.playlistContent = document.getElementById('playlistContent');
  }

  initialize() {
    this.buildPlaylist();
    this.updatePlaylistUI();
    if (this.playlist.length > 0) {
      this.loadTrack(0);
    }
  }

  buildPlaylist() {
    const links = document.querySelectorAll('a[href$=".mp3"]');
    this.playlist = Array.from(links).map(link => ({
      url: link.href,
      title: link.textContent || this.getFileNameFromUrl(link.href)
    }));
  }

  updatePlaylistUI() {
    this.playlistContent.innerHTML = '';
    this.playlist.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item' + (index === this.currentTrackIndex ? ' active' : '');
      item.textContent = track.title;
      item.onclick = () => this.playTrack(index);
      this.playlistContent.appendChild(item);
    });
  }

  loadTrack(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentTrackIndex = index;
      this.audio.src = this.playlist[index].url;
      this.currentTrackSpan.textContent = this.playlist[index].title;
      this.updatePlaylistUI();
    }
  }

  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    this.playPauseBtn.querySelector('i').className = 'fa fa-pause';
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playPauseBtn.querySelector('i').className = 'fa fa-play';
  }

  playNext() {
    let nextIndex;
    if (this.isShuffle) {
      nextIndex = this.getRandomTrackIndex();
    } else {
      nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    }
    this.loadTrack(nextIndex);
    if (this.isPlaying) this.play();
  }

  playPrevious() {
    let prevIndex;
    if (this.isShuffle) {
      prevIndex = this.getRandomTrackIndex();
    } else {
      prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    }
    this.loadTrack(prevIndex);
    if (this.isPlaying) this.play();
  }

  playTrack(index) {
    this.loadTrack(index);
    this.play();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.shuffleBtn.classList.toggle('active');
  }

  toggleRepeat() {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(currentIndex + 1) % modes.length];
    
    // Update UI
    const icon = this.repeatBtn.querySelector('i');
    this.repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
    if (this.repeatMode === 'one') {
      icon.className = 'fa fa-repeat';
      this.repeatBtn.setAttribute('title', 'Repeat One');
    } else if (this.repeatMode === 'all') {
      icon.className = 'fa fa-refresh';
      this.repeatBtn.setAttribute('title', 'Repeat All');
    } else {
      icon.className = 'fa fa-repeat';
      this.repeatBtn.setAttribute('title', 'Repeat');
    }
  }

  handleTrackEnd() {
    if (this.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.play();
    } else if (this.repeatMode === 'all' || this.currentTrackIndex < this.playlist.length - 1) {
      this.playNext();
    }
  }

  setVolume(value) {
    this.volume = value / 100;
    this.audio.volume = this.volume;
    this.updateVolumeUI();
  }

  toggleMute() {
    if (this.isMuted) {
      this.audio.volume = this.previousVolume;
      this.isMuted = false;
      this.muteBtn.querySelector('i').className = 'fa fa-volume-up';
    } else {
      this.previousVolume = this.audio.volume;
      this.audio.volume = 0;
      this.isMuted = true;
      this.muteBtn.querySelector('i').className = 'fa fa-volume-off';
    }
    this.updateVolumeUI();
  }

  updateVolumeUI() {
    this.volumeSlider.value = this.audio.volume * 100;
    const icon = this.muteBtn.querySelector('i');
    if (this.audio.volume === 0) {
      icon.className = 'fa fa-volume-off';
    } else if (this.audio.volume < 0.5) {
      icon.className = 'fa fa-volume-down';
    } else {
      icon.className = 'fa fa-volume-up';
    }
  }

  cyclePlaybackSpeed() {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const currentIndex = speeds.indexOf(this.playbackSpeed);
    this.playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
    this.audio.playbackRate = this.playbackSpeed;
    this.speedBtn.querySelector('span').textContent = this.playbackSpeed + 'x';
  }

  togglePlaylist() {
    this.isPlaylistVisible = !this.isPlaylistVisible;
    this.playlistPanel.classList.toggle('active', this.isPlaylistVisible);
  }

  rewind10() {
    this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
  }

  forward10() {
    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
  }

  updateProgress() {
    if (!isNaN(this.audio.duration)) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressBar.style.width = progress + '%';
      this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  updateTotalTime() {
    this.totalTimeSpan.textContent = this.formatTime(this.audio.duration);
  }

  seekToPosition(event) {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    this.audio.currentTime = position * this.audio.duration;
  }

  toggleFavorite() {
    const btn = document.getElementById('favoriteBtn');
    const icon = btn.querySelector('i');
    const isFavorite = icon.classList.contains('fa-heart');
    
    if (isFavorite) {
      icon.className = 'fa fa-heart-o';
      // Remove from favorites logic here
    } else {
      icon.className = 'fa fa-heart';
      // Add to favorites logic here
    }
  }

  shareTrack() {
    if (navigator.share) {
      navigator.share({
        title: this.playlist[this.currentTrackIndex].title,
        text: 'Listen to this beautiful kirtan!',
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback - copy link to clipboard
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      alert('Link copied to clipboard!');
    }
  }

  getRandomTrackIndex() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.playlist.length);
    } while (newIndex === this.currentTrackIndex && this.playlist.length > 1);
    return newIndex;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  getFileNameFromUrl(url) {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return decodeURIComponent(fileName.replace('.mp3', ''));
  }

  handleError() {
    console.error('Error loading track:', this.playlist[this.currentTrackIndex].url);
    this.currentTrackSpan.textContent = 'Error loading track';
    if (this.isPlaying) {
      this.playNext();
    }
  }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kirtanPlayer = new KirtanRadioPlayer();
  window.kirtanPlayer.initialize();
});
