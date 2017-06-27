//NOTE  Date.now() simply shows the number of seconds since ~ 01-Jan-1970 ???

let countdown;

//from the HTML
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');  //[] means anything with data-time?

function timer(seconds) {
  //one of last things to fix:
  //clear any existing timer occurances that user would have previously clicked
  clearInterval(countdown);
  //if countdown is true? hasa value? clear it


  //setInterval is a good way to do it,
  //but this can be interupted/paused by browser behavior

  //to avoid the problem, have it feed it's numbers from the real time clock
    const now = Date.now();
    const then = now + (seconds * 1000);
    //now is in miliseconds and seconds is in seconds, so need to * 1000
    //console.log(now, then);

    //see ~10 lines below, to display the first second, run this immediately once
    displayTimeLeft(seconds);

    //here from  ~line 62 function displayEndTime
    displayEndTime(then);

    //this starts the countdown with setInterval, and we set to run every 1000 miliseconds
    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      //need to check if it's done
      if (secondsLeft < 0 ){
        clearInterval(countdown);
        return;
      }
      //because the setInterval does not display until after the first 1000 miliseconds have gone by
      //the first second is missing

      //console.log(secondsLeft);
      //now that we created the function below
      displayTimeLeft(secondsLeft);

    }, 1000);
}

function displayTimeLeft (seconds) {
  const minutes = Math.floor(seconds / 60);  //math.floor for only full minutes
  const remainderSeconds = seconds % 60;
  //console.log(minutes, remainderSeconds);
  //NOTE the BACK ticks!!! ``
  const display = `${minutes}:${remainderSeconds < 10 ? "0" : ''}${remainderSeconds}`;
  //ternary if/else statement to make sure we see a '0' in '1:09' if < 10 seconds

  //neat little trick for extra little style
  //this updates the clock onto the browser's tab as well
  document.title = display;

  //THIS DISPLAYS IT ON THE WEBPAGE
  //textContent means update what is in the HTML for "timerDisplay",
  //see the querySelector on line ~4
  timerDisplay.textContent = display;
}

function displayEndTime (timestamp) {
  //this creates a properly formated date
  const end = new Date(timestamp);
  //console.log(end);
  const hour = end.getHours();
  const minutes = end.getMinutes();

  //see ~line 4 querySelector
  //what exact time on the clock should you be back at?
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' + minutes : minutes}`;
  //converted 24 hour format to 12 hour format
}

function startTimer() {
  //console.log(this);  //this shows which button from the HTML gets clicks on
  //console.log(this.dataset.time)  //this gives us the string that was applied to each button in the HTML,
  //this string is like 900 or 1500, which we set as they are seconds that represent 5 minutes, 15 minutes

  //make it a constant and turn those strings into a useable number with parseInt
  //I would choose a different name that was not used already above
  const seconds =  parseInt(this.dataset.time);
  //console.log(seconds);
  timer(seconds);


}

buttons.forEach(button => button.addEventListener('click', startTimer));

//because te HTML part of the "form" has a "name" attribute, we don't have to querySelector it
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();  //this is to prevent the submit from refreshing the page
  //in the HTML the text box is called "minutes"
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
});
