let form=document.querySelector('#quizOptions');
let categoryMenu=document.querySelector('#categoryMenu');
let difficultyOptions=document.querySelector('#difficultyOptions');
let questionsNumber=document.querySelector('#questionsNumber');
let btn =document.querySelector('#startQuiz');
let myRow=document.querySelector('.questions .container .row')

let result;
let myQuiz;
let myQuestion;
btn.addEventListener('click',async function(){
    if(categoryMenu.value=="" || difficultyOptions.value=="" || questionsNumber.value==""){
        Swal.fire({
            title: 'Error!',
            text: 'Please fill all the fields',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
          return
    }

    let category=categoryMenu.value;
    let difficulty=difficultyOptions.value;
    let questions=questionsNumber.value;

    myQuiz=new Quiz(category,difficulty,questions);
    result=await myQuiz.getAllQuestions();
    console.log(result );
    form.classList.replace('d-flex','d-none');
    myQuestion=new Question(0);
    console.log(myQuestion);
    myQuestion.display();


});

class Quiz{
    constructor(category, difficulty , questions){
        this.category=category;
        this.difficulty=difficulty;
        this.questions=questions;
        this.score=0;
    }

    getApi(){
        return `https://opentdb.com/api.php?amount=${this.questions}&category=${this.category}&difficulty=${this.difficulty}`
    }

    showResult() {
        return `
          <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
          >
            <h2 class="mb-0">
            ${this.score == this.questions? `Congratulations 🎉`: `Your score is ${this.score}`
            }      
            </h2>
            <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
          </div>
        `;
      }
    async getAllQuestions(){
        let response= await fetch(this.getApi());
        let finalData= await response.json();
        return finalData.results;
    }

}

class Question{
    constructor(index){
        this.index=index;
        this.category=result[index].category;
        this.question=result[index].question;
        this.difficulty=result[index].difficulty;
        this.correct_answer=result[index].correct_answer;
        this.incorrect_answers=result[index].incorrect_answers;
        this.answers=this.getAllAnswer();
        this.isAnswered=false;
    }

    getAllAnswer(){
        let answers=[this.correct_answer,...this.incorrect_answers];
        answers.sort();
        return answers;
    }

   

    display() {
        const questionMarkUp = `
        <div
            class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
        >
            <div class="w-100 d-flex justify-content-between">
            <span class="btn btn-category">${this.category}</span>
            <span class="fs-6 btn btn-questions">${this.index+1} of ${result.length} Questions</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.answers.map((answer)=> `<li>${answer}</li>` ).join("")}
            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${myQuiz.score}       
        </div>
        `;
    
        myRow.innerHTML = questionMarkUp;
        
        let allChoices=document.querySelectorAll('.choices li');
        allChoices.forEach((li)=>{
            li.addEventListener('click',()=>{
                this.checkAnswer(li);
               this.nextQusestion();

            })
        })


    }

    checkAnswer(choise){
        if(!this.isAnswered){
            this.isAnswered=true;
            if(choise.innerHTML==this.correct_answer){
                choise.classList.add('correct','animate__animated','animate__pulse');
                myQuiz.score++
            }else{
                choise.classList.add('wrong','animate__animated','animate__shakeX');
            }
        }

    }

    nextQusestion(){
        this.index++
        
        setTimeout(()=>{

            if(this.index<result.length){
            let myNewQuestion= new Question(this.index);
            myNewQuestion.display();
           }
           else{
            let result=myQuiz.showResult();
            myRow.innerHTML=result
           }
           document.querySelector('.again').addEventListener('click',function(){
            window.location.reload();
           })
        },1000)}
        





}

