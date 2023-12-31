import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

document.addEventListener('DOMContentLoaded', () => {
  const datetimePicker = document.getElementById('datetime-picker');
  const startButton = document.querySelector('[data-start]');
  const resetButton = document.querySelector('[data-reset]');
  const daysValue = document.querySelector('[data-days]');
  const hoursValue = document.querySelector('[data-hours]');
  const minutesValue = document.querySelector('[data-minutes]');
  const secondsValue = document.querySelector('[data-seconds]');

  let countdownInterval;

  const resetTimer = () => {
    clearInterval(countdownInterval);
    daysValue.textContent = '00';
    hoursValue.textContent = '00';
    minutesValue.textContent = '00';
    secondsValue.textContent = '00';
    startButton.disabled = false;
    resetButton.disabled = true;
    datetimePicker.disabled = false;
  };

  startButton.disabled = true;
  resetButton.disabled = true;

  const updateTimer = targetDate => {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
      resetTimer();
      window.alert('Please choose a date in the future');
      return;
    }

    const timeValues = convertMs(timeRemaining);

    daysValue.textContent = addLeadingZero(timeValues.days);
    hoursValue.textContent = addLeadingZero(timeValues.hours);
    minutesValue.textContent = addLeadingZero(timeValues.minutes);
    secondsValue.textContent = addLeadingZero(timeValues.seconds);
  };

  datetimePicker.addEventListener('change', () => {
    const selectedDate = new Date(datetimePicker.value);
    const now = new Date();

    if (selectedDate <= now) {
      window.alert('Please choose a date in the future');
      startButton.disabled = true;
      resetButton.disabled = true;
    } else {
      startButton.disabled = false;
      resetButton.disabled = true;
      datetimePicker.disabled = false;

      startButton.addEventListener('click', () => {
        clearInterval(countdownInterval);
        const selectedDate = new Date(datetimePicker.value);
        updateTimer(selectedDate);
        countdownInterval = setInterval(() => updateTimer(selectedDate), 1000);
        startButton.disabled = true;
        resetButton.disabled = false;
        datetimePicker.disabled = true;
      });

      resetButton.addEventListener('click', () => {
        resetTimer();
      });
    }
  });

  flatpickr(datetimePicker, {
    noCalendar: false,
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      datetimePicker.value = selectedDate.toISOString();
    },
  });
});
