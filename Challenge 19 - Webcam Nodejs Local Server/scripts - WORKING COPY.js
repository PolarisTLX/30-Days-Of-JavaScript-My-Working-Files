const video = document.querySelector('.player'); //this is the live video from the webcam?
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');  //context? this is where the work happens?
const strip = document.querySelector('.strip');  //where the final images are stored?
const snap = document.querySelector('.snap');  //this is just the audio "picture sound effect"

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})  //this is to get the video the webcame, this returns a promise
  .then(localMediaStream => {
    console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream)  //we are setting our video source to be our localMediaStream
    //for odd reason this needs to be in a URL format for this video player to be able to understand it/use it
    video.play();  //if this is skipped, you get a static image as the video as opposed to continuous live refresh
  })
  .catch(err => {
    console.error("AN ERROR HAS OCCURED WITH THE VIDEO / no access to webcam", err);
  })
}

function paintToConvas(){  //transfer image from the video to the canvas
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;


//return is not needed, it is used to be able to stop it from "painting"
  return setInterval(() => {
    //this basically repeats the video from the webcame into the braoder window of the webpage
    ctx.drawImage(video, 0, 0, width, height);  //start a 0,0 which is top right hand corner of the canvas

    //take the pixels out

    //this is the part where you mess with the video filters etc
    let pixels = ctx.getImageData (0, 0, width, height);
    //mess with the pixels
    //pixels = redEffect(pixels);   //see around line 67 below
    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.1;  //this is awesome ghost effect!
    //it causes a delay the photo by 10 more frames

    pixels = greenScreen(pixels);

    //put the modified pixels back
    ctx.putImageData(pixels, 0, 0);

  }, 16);  //16 milisecond refresh/canvas rate
}

function takePhoto() {
  //this is the sound effect
  snap.currentTime = 0;  //not sure why this line is needed
  snap.play();

  //take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg')
  // console.log(data);  this data is called base64 which is a text representation of a photo
  // we will take this data and save it as a photo
  const link = document.createElement('a'); //we create an anchor link, a
  link.href = data;
  link.setAttribute('download', 'handsome');
//nevermind this just names the file that gets downloaded as "handsome.jpeg" for example
  //the handsome is so that when you click the download photo link that pops up (see below), it will download to your HDD?
  link.textContent = "Download Image";
  //this is the text of the link that will pop up when you tell the console to run the takePhoto() func
  link.innerHTML = `<img scr="${data}" alt = "Handsome Man" />`;
  //the one above will display a thumbnail of screenshorts each time you run the function, instead of a link like above
  strip.insertBefore(link, strip.firstChild);

  //now when you type takePhoto() in the browser's console, it runs that function which captures a photo
  //a link will pop up to "download photo", can open in new tab,
  //the photo is actually a really long link made up of the text repressenation of the image which gets displayed
  //can also do this by just clicking on the "Take Photo" button on the screen, see HTML line 12
}

//some of the effects to the images
function redEffect(pixels) {
  for(let i=0; i < pixels.data.length; i += 4) {  //must be pixels.data.length or nothing will happen, because that is the array
    pixels[i] = pixels.data[i] + 100;     //is the red
    pixels[i+1] = pixels.data[i+1] - 50;  //is the green
    pixels[i+2] = pixels.data[i+2] * 0.5;  //is the blue
  }
  return pixels;  //then have to go back to line ~36 above
}

//another fun effect
function rgbSplit (pixels) {
  for(let i=0; i < pixels.data.length; i += 4) {  //must be pixels.data.length or nothing will happen, because that is the array
    pixels[i - 150] = pixels.data[i] + 100;     //is the red
    pixels[i + 100] = pixels.data[i+1] - 50;  //is the green
    pixels[i - 150] = pixels.data[i+2] * 0.5;  //is the blue
  }
  return pixels;  //then have to go back to line ~36 above
}

function greenScreen(pixels) {
  const levels = {};
  //this holds the minimum and maximum range of greens

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
      //the 4th point (i + 3), is the alpha and if you set it to 0, that pixel is totally transparent
    }
}


getVideo();


//when the video is playing, it emits an event called 'canplay',
//when this is detected, run the function paintToCanvas
video.addEventLister('canplay', paintToCanvas)
