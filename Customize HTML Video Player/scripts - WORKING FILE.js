// Get all the Elements

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled'); //has two underscores?
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]'); //this one is [] because it's a button?
const ranges = player.querySelectorAll('.player__slider'); //has two underscores?
//NOTE!!! THE TWO ABOVE NEED TO BE querySelectorAll, ALL !!! or will not work!!!

// Build out functions

function togglePlay(){
  //long version:
  // if (video.paused) {    //MAKE SHORTER!!!
  //   video.play();
  // }
  // else {
  //   video.pause();
  // }

  //optional shorthand ternary:  (But this is not intuitive to read)
  //const method = video.paused ? 'play' : 'pause';
  //video[method]();

  //or another way:
  // video[video.paused ? 'play' : 'pause']();

  //my preferred shorthand:
  if (video.paused ? video.play() : video.pause());
}

//this changes the symbol for play/pause whenever the video is paused or played for whatever reason from whatever source
function updateButton(){
  toggle.textContent = video.paused ? '►' : '❚❚';//this.pause is basically video.pause
}

//skip buttons
function skip() {
  //console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip); // this.dataset.skip is a string so needs to be converted to a number with praseFloat
}

function handleRangeUpdate() {
  video[this.name] = this .value; //this.name is either going to be 'volume' or 'playbackRate'
  //console.log(this.value);
  //console.log(this.name);
}

//for the progressBar to be updated as the video plays
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

//to move to a specific point in the video when clicking on the progressBar
function scrub(e){
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; // this gives % of the width of the progressBar
  video.currentTime = scrubTime;
  //console.log(e);
}


//Hook up the event listeners

video.addEventListener('click', togglePlay); //makes for when clicking on the video  it pauses or plays

//To update the play/pause symbol:
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

//for the progressBar to be updated as the video plays
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay); //makes the play button work

//skip buttons, SOMETHING WRONG HERE!!!
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

//when clicking somewhere on the progressBar
progress.addEventListener('click', scrub);


let mousedown = false; //this is needed so that the mouse needs to be clicked down for proper function
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); //if mousedown is true, it will run the scrub
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
