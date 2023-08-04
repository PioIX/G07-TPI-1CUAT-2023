window.addEventListener('load', girar);
let categoria = ""; 
function girar(){
    const ruleta = document.querySelector('#roulette');
    let rand = Math.random() * (7200 - 3000) + 3000;
    calcular(rand);
    function calcular(rand) {
        valor = rand / 360;
        valor = (valor - parseInt(valor.toString().split(".")[0]))* 360;
        ruleta.style.transform = "rotate("+rand+"deg)";
        setTimeout(() => {
        switch (true) {
            case valor > 0 && valor <= 90:
                categoria = 1;
                categoryUpload(categoria);
                break;
            case valor > 90 && valor <= 180:
                categoria = 2;
                categoryUpload(categoria);
                break; 
            case valor > 180 && valor <= 270:
                categoria = 3;
                categoryUpload(categoria);
                break;
            case valor > 270 && valor <= 360:
                categoria = 4;
                categoryUpload(categoria);
                break;
        }}, 6000);
    }
}