const day = document.querySelector('.day');
const month = document.querySelector('.month');

day.innerText = getDate({ day: 'numeric' });
month.innerText = getDate({ month: 'short' });

function getDate(options) {
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
}