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

async function fetchTimer(){
  questionFetch({right: 0})
}

async function questionFetch(data){
  try {
    await fetch("/randomQuestion", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    location.reload()
  } catch (error) {
    console.error("Error:", error);
  };
}

function question(answer){
  let right;
  if (document.getElementById("question1").value == answer){
    right = 1;
  } else {
    right = 0;
  }
  let data = {
    right: right,
    };
  questionFetch(data);
}


