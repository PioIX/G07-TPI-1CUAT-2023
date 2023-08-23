

async function fetchLogin(data) {
  try {
    const response = await fetch("/login", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.validar == false) {
      alert(result.msg  );
    } else {
      if (result.admin == true){
        document.getElementById("formadmin").submit();
      } else{
        document.getElementById("formlogin").submit();
      }        
    };
  } catch (error) {
    console.error("Error:", error);
  };
}

function login() {
  let user = document.getElementById("userId").value;
  let password = document.getElementById("passwordId").value;
  let data = {
      user : user,
      password : password
  };
  fetchLogin(data); 
}

async function fetchRegister(data) {
  try {
    const response = await fetch("/register", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.validar == false) {
      alert(result.mensaje);
    } else {
      document.getElementById("formregister").submit();
    };
  } catch (error) {
    console.error("Error:", error);
  };
}

function register() {
  let name = document.getElementById("nameId").value;  
  let surname = document.getElementById("surnameId").value;  
  let user = document.getElementById("userId").value;
  let password = document.getElementById("passwordId").value;
  let passwordConfirm = document.getElementById("passwordConfirmId").value;
  let data = {
      name : name,
      surname : surname,
      user : user,
      password : password,
      passwordConfirm : passwordConfirm
  };
  fetchRegister(data); 
}

async function fetchUserRemove(data){
  try {
      await fetch("/userremove", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      alert("Se ha eliminado con Éxito");
      location.reload()
    } catch (error) {
      console.error("Error:", error);
    };
}

function userRemove(id) {
  let data = {
    idUser : id,
  };
  fetchUserRemove(data); 
}

async function fetchQuestionAdd(data){
    try {
        await fetch("/questionadd", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        alert("Agregado con Éxito");
        location.reload()
      } catch (error) {
        console.error("Error:", error);
      };
}

function questionAdd() {
  let question = document.getElementById("questionId").value;  
  let answer_1 = document.getElementById("answer_1Id").value;  
  let answer_2 = document.getElementById("answer_2Id").value;
  let answer_correct = document.getElementById("answer_correctId").value;
  let category = document.getElementById("categoryId").value;
  let data = {
      question : question,
      answer_1 : answer_1,
      answer_2 : answer_2,
      answer_correct : answer_correct,
      category: category
  };
  fetchQuestionAdd(data); 
}

async function fetchQuestionRemove(data){
  try {
      await fetch("/questionremove", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      alert("Se ha eliminado con Éxito");
      location.reload()
    } catch (error) {
      console.error("Error:", error);
    };
}

function questionRemove(id) {
  let data = {
    idQuestion : id,
  };
  fetchQuestionRemove(data); 
}


async function fetchQuestionModify(data){
  try {
      await fetch("/questionmodify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      alert("Se ha modificado con Éxito");
      location.reload()
    } catch (error) {
      console.error("Error:", error);
    };
}

function questionModify() {
  let question = document.getElementById("questionId2").value;  
  let answer_1 = document.getElementById("answer_1Id2").value;  
  let answer_2 = document.getElementById("answer_2Id2").value;
  let answer_correct = document.getElementById("answer_correctId2").value;
  let category = document.getElementById("categoryId2").value;
  let idQuestion = document.getElementById("back").name;
  let data = {
    idQuestion: idQuestion,
    question: question,
    answer_1: answer_1, 
    answer_2: answer_2,
    answer_correct: answer_correct,
    category: category
  };
  fetchQuestionModify(data); 
}

function showAddQuestion(){
  const container = document.getElementById('add-questions');
  const container_form = document.getElementById('add-questions-form');
  if (container.style.display === "none") {
    container_form.style.display = "block";
    container.style.display = "flex";
  } else {
    container.style.display = "none";
    container_form.style.display = "none";
  }
}

function showModifyQuestion(idQuestion, question, answer_1, answer_2, answer_correct, category){
  const container = document.getElementById('add-questions');
  const container_form = document.getElementById('modify-questions-form');
  document.getElementById("questionId2").value = question;  
  document.getElementById("answer_1Id2").value = answer_1;  
  document.getElementById("answer_2Id2").value = answer_2;
  document.getElementById("answer_correctId2").value = answer_correct;
  document.getElementById("categoryId2").value = category;
  document.getElementById("back").name = idQuestion;
  if (container.style.display === "none") {
    container_form.style.display = "block";
    container.style.display = "flex";
  } else {
    container.style.display = "none";
    container_form.style.display = "none";
  } 
}



async function fetchProfileModify(data){
  try {
        const response = await fetch("/profilemodify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.validar == true){
        alert("Se cambio la información");
        document.getElementById("imageform").submit();
      } else {
        alert("El usuario ya existe. Pruebe con otro"); 
        location.reload();
      }
      
    } catch (error) {
      console.error("Error:", error);
    };
}

function profile(){
  let name = document.getElementById("nameId").value;
  let surname = document.getElementById("surnameId").value;
  let user = document.getElementById("usersId").value;
  let description = document.getElementById("description").value;
  let id = document.getElementById("IdUser").name; 
  let data = {
    name: name,
    surname: surname,
    user: user,
    description: description,
    id: id
  }
  fetchProfileModify(data);
}

async function fetchCategoryUpload(data){
  try {
    await fetch("/categoryreceive", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setTimeout(() => {
      document.getElementById("formgame").submit();
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  };
}

function categoryUpload(cat){
  let data = {
    category: cat
  };
  fetchCategoryUpload(data);
}

async function questionFetch(data){
  try {
    const response = await fetch("/randomQuestion", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    let buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].name == data.answer_correct){
        document.getElementsByTagName('button')[i].style.backgroundColor="green";
        document.getElementsByTagName('button')[i].style.pointerEvents= "none";
      } else {
        document.getElementsByTagName('button')[i].style.backgroundColor="red";
        document.getElementsByTagName('button')[i].style.pointerEvents= "none";
      }
    }
    document.getElementById(`question${data.id}`).style.border = "solid rgb(15, 0, 96) 4px"
    if ((result.incorrects + result.corrects) == 4){
      setTimeout(() => {
        showEndGame(result.corrects, result.incorrects, ((result.corrects*100)/(result.corrects + result.incorrects).toFixed(2)));
      },3000)
    } else {
      setTimeout(() => {
        location.reload()
      },3000)
    }

  } catch (error) {
    console.error("Error:", error);
  };
}

function showEndGame(corrects, incorrects){
  const container = document.getElementById('add-questions');
  const container_form = document.getElementById('pop-up');
  container.style.display = "flex"; 
  container_form.style.display = "block";
  document.getElementById("count").remove()
  document.getElementById("count-container").innerHTML = `
       <p id="count">${corrects}</p>   
   `
  document.getElementById("rights").innerHTML=`
    <p class="title-numbers-temp">ACIERTOS</p>
    <p class="number-numbers-temp">${corrects}</p>
  `
  document.getElementById("wrongs").innerHTML=`
    <p class="title-numbers-temp">ERRORES</p>
    <p class="number-numbers-temp">${incorrects}</p>
  `
  if (corrects <= 1){
    document.getElementById("message").innerHTML=`
    <img src="img/triste.jpg" width="400" height="400">
    <p>“Para algunos seré malo, pero soy Riquelme gracias a Boca"</p>`
  } else if (corrects == 2 || corrects == 3){
    document.getElementById("message").innerHTML=`
    <img src="img/medio.jpg" width="400" height="400">
    <p>"A veces se gana, a vece se pierde"</p>`
  } else {
    document.getElementById("message").innerHTML=`
    <img src="img/feliz.gif" width="400" height="400">
    <p>"Román esta feliz!"</p>`
  }
}


function question(answer, id){
  let right = 0;
  let answer_correct = document.getElementById("question1").value;
  if (answer_correct == answer){
    right = 1;
  }
  let data = {
    right: right,
    answer_correct: answer_correct,
    id: id
    };
  questionFetch(data);
}


