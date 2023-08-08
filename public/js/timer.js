const container = document.getElementById("timer-container");
const miniContainer = document.getElementById("timer");
let number = 30;


let timer  = setInterval(() => {
    miniContainer.remove()
    container.innerHTML = `
        <div id="timer">
            <p>${number}</p>
        </div>      
    `
    number --;
    if (number == -1){
        clearInterval(timer);
        fetchTimer();
    }
}, 1000);