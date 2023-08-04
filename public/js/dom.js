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

function showModifyQuestion(idQuestion, question, answer_1, answer_2, answer_correct){
  const container = document.getElementById('add-questions');
  const container_form = document.getElementById('modify-questions-form');
  document.getElementById("questionId2").value = question;  
  document.getElementById("answer_1Id2").value = answer_1;  
  document.getElementById("answer_2Id2").value = answer_2;
  document.getElementById("answer_correctId2").value = answer_correct;
  document.getElementById("back").name = idQuestion;
  if (container.style.display === "none") {
    container_form.style.display = "block";
    container.style.display = "flex";
  } else {
    container.style.display = "none";
    container_form.style.display = "none";
  } 
}

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
        alert("Los datos son incorrectos");
      } else {
        if (result.admin == true){
            document.getElementById("formadmin").submit();
        } else{
            let aja= await document.getElementById("formlogin").submit()
            if(aja=true){ alert("hola");}
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
      document.getElementById("formuserremove").submit();
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
        document.getElementById("formquestionadd").submit();
      } catch (error) {
        console.error("Error:", error);
      };
}

function questionAdd() {
  let question = document.getElementById("questionId").value;  
  let answer_1 = document.getElementById("answer_1Id").value;  
  let answer_2 = document.getElementById("answer_2Id").value;
  let answer_correct = document.getElementById("answer_correctId").value;
  let data = {
      question : question,
      answer_1 : answer_1,
      answer_2 : answer_2,
      answer_correct : answer_correct,
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
      document.getElementById("formquestionremove").submit();
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
      document.getElementById("formquestionmodify").submit();
    } catch (error) {
      console.error("Error:", error);
    };
}

function questionModify() {
  let question = document.getElementById("questionId2").value;  
  let answer_1 = document.getElementById("answer_1Id2").value;  
  let answer_2 = document.getElementById("answer_2Id2").value;
  let answer_correct = document.getElementById("answer_correctId2").value;
  let idQuestion = document.getElementById("back").name;
  let data = {
    idQuestion: idQuestion,
    question: question,
    answer_1: answer_1, 
    answer_2: answer_2,
    answer_correct: answer_correct,
  };
  fetchQuestionModify(data); 
}
async function newQuestionFetch(data){
  try {
    const response = await fetch("/randomQuestion", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("fetch")
    const result = await response.json();
    document.getElementById("formQuestion").submit;
    location.reload()
  } catch (error) {
    console.error("Error:", error);
  };
}
function newQuestionRight(){
  let data={
    answer: 1,
    again:true};
  console.log(data.answer,);
  newQuestionFetch(data);
}

function newQuestionWrong(){
  let data={
    answer: 0,
    again:true
  };
  console.log(data.answer);
  newQuestionFetch(data);
}

function newQuestionGo(){
  let data={
    answer: 0,
    again:false
  };
  console.log(data.answer);
  newQuestionFetch(data);
}


