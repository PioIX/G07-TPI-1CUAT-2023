const container = document.getElementById("timer-container");
const miniContainer = document.getElementById("timer");
let number = 30;

let timer  = setInterval(() => {
    miniContainer.remove()
    container.innerHTML = `
        <div id="timer" class="count-decoration">
            <p>${number}</p>
        </div>      
    `
    number --;
    if (document.getElementById('add-questions').style.display == "block" || document.getElementsByTagName('button')[1].style.backgroundColor != ""){
        clearInterval(timer);
    }
    if (number == -1){
        let buttons = document.getElementsByTagName('button');
        let answer = buttons[0].value
        for (let i = 0; i < buttons.length; i++) {
            if (answer == buttons[i].name){
                var id = i+1;
                break;
            }
        }
        question("", id);
        clearInterval(timer);
    }
}, 1000);

const containerMini = document.getElementById("timer-container-mini");
const miniContainerMini = document.getElementById("timer-mini");
let numberMini = 30;

let timerMini  = setInterval(() => {
    miniContainerMini.remove();
    document.getElementById('count').innerHTML;
    containerMini.innerHTML = `
        <div id="timer-mini" class="count-decoration">
            <p>${numberMini}</p>
        </div>    
        <div id = "count-container" class="count-decoration">
            <p id="count">${document.getElementById('count').innerHTML}</p>
        </div> 
    `
    numberMini --;
    if (document.getElementById('add-questions').style.display == "block" || document.getElementsByTagName('button')[1].style.backgroundColor != ""){
        clearInterval(timerMini);
    }
    if (numberMini == -1){
        clearInterval(timerMini);
    }
}, 1000);