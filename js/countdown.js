const timer = document.querySelector(".countdown-timer");

if (timer) {
  const targetDate = new Date(timer.dataset.date).getTime();
  const unitMap = {
    days: 24 * 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    minutes: 60 * 1000,
    seconds: 1000,
  };

  const updateTimer = () => {
    const now = Date.now();
    const diff = Math.max(targetDate - now, 0);

    const days = Math.floor(diff / unitMap.days);
    const hours = Math.floor((diff % unitMap.days) / unitMap.hours);
    const minutes = Math.floor((diff % unitMap.hours) / unitMap.minutes);
    const seconds = Math.floor((diff % unitMap.minutes) / unitMap.seconds);

    timer.querySelector('[data-unit="days"]').textContent = String(days);
    timer.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, "0");
    timer.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, "0");
    timer.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, "0");
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}
