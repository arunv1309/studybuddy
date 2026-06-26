let pinned =JSON.parse(localStorage.getItem("pinned"))|| [];
let chats = JSON.parse(localStorage.getItem("chats")) || [];
let deleteIndex = null;


const button = document.getElementById("askButton");
const promptBox = document.getElementById("prompt");
const responseBox = document.getElementById("response");
const historyBox = document.getElementById("history");
const pinnedBox = document.getElementById("pinnedContainer");

// ================= Sidebar Buttons =================

document.getElementById("explainBtn").onclick = () => {

    promptBox.value =
    "Explain in simple terms: " + promptBox.value;

};


document.getElementById("summarizeBtn").onclick = () => {

    promptBox.value =
    "Summarize this: " + promptBox.value;

};


document.getElementById("quizBtn").onclick = () => {

    promptBox.value =
    "Create 5 quiz questions about: " + promptBox.value;

};


document.getElementById("flashcardsBtn").onclick = () => {

    promptBox.value =
    "Create flashcards for: " + promptBox.value;

};


// ================= History =================

function updateHistory(){

historyBox.innerHTML="";
pinnedBox.innerHTML="";


/* PINNED */

if(pinned.length>0){

pinnedBox.innerHTML=`
<h3 class="history-title">
Pinned
</h3>
`;


pinned.forEach((item,index)=>{

const div=document.createElement("div");

div.className="history-item";


div.innerHTML=`

<span class="chat-name">

${item}

</span>

<span class="pin-btn">

📌

</span>

`;



div.querySelector(".pin-btn").onclick=(e)=>{

e.stopPropagation();


pinned.splice(index,1);

chats.push(item);


localStorage.setItem(
"pinned",
JSON.stringify(pinned)
);

localStorage.setItem(
"chats",
JSON.stringify(chats)
);


updateHistory();

};


div.onclick=()=>{

promptBox.value=item;

};


pinnedBox.appendChild(div);

});

}



/* HISTORY */

chats.forEach((item,index)=>{

const div=document.createElement("div");

div.className="history-item";


div.innerHTML=`

<span class="chat-name">

${item}

</span>


<div>

<span class="pin-btn">

📌

</span>


<span class="delete-btn">

🗑️

</span>

</div>

`;



div.onclick=()=>{

promptBox.value=item;

};



div.querySelector(".pin-btn").onclick=(e)=>{

e.stopPropagation();


pinned.push(item);

chats.splice(index,1);


localStorage.setItem(
"pinned",
JSON.stringify(pinned)
);

localStorage.setItem(
"chats",
JSON.stringify(chats)
);


updateHistory();

};




div.querySelector(".delete-btn").onclick=(e)=>{

e.stopPropagation();

deleteIndex = index;

document.getElementById("deleteModal").style.display="flex";

};



historyBox.append(div);

});

}



// ================= Ask AI =================


button.addEventListener("click", async () => {



    const prompt = promptBox.value.trim();


    if (prompt === "") return;



    responseBox.innerHTML =

        `<div class="loading">

            🤔 Thinking...

        </div>`;


    button.disabled = true;

    button.textContent = "Thinking...";



    try {


        const result = await fetch("/ask", {


            method: "POST",


            headers: {

                "Content-Type": "application/json"

            },


            body: JSON.stringify({

                prompt: prompt

            })


        });



        if (!result.ok) {

            throw new Error("Server Error");

        }



        const data = await result.json();



        responseBox.innerHTML = `


            <div class="ai-answer">


                ${marked.parse(data.answer)}


            </div>


        `;




        // Save History


        chats.push(prompt);



        localStorage.setItem(

            "chats",

            JSON.stringify(chats)

        );



        updateHistory();



    }


    catch (err) {



        console.log(err);



        responseBox.innerHTML = `


            <div class="error">


                ❌ Something went wrong


            </div>


        `;



    }



    button.disabled = false;

    button.textContent = "Ask AI";



});




// ================= Copy Button =================



document.getElementById("copyBtn").onclick = () => {


let txt=responseBox.innerText;


navigator.clipboard.writeText(txt);


alert("Copied");


};

document.getElementById("downloadBtn").onclick = ()=>{


const text=responseBox.innerText;


const blob=new Blob([text],{

type:"text/plain"

});


const url=URL.createObjectURL(blob);


const a=document.createElement("a");


a.href=url;


a.download="study_notes.txt";


document.body.appendChild(a);


a.click();


document.body.removeChild(a);


URL.revokeObjectURL(url);


};




// ================= Clear History =================



document.getElementById("clearHistory").onclick = () => {


chats=[];


historyBox.innerHTML="";


localStorage.removeItem("chats");


updateHistory();


};




// ================= Enter Key =================



promptBox.addEventListener("keydown", (e) => {



    if (e.key === "Enter" && !e.shiftKey) {



        e.preventDefault();



        button.click();



    }



});




// ================= Initial Load =================



updateHistory();






document.getElementById("searchHistory").addEventListener("input", function(){

const value = this.value.toLowerCase().trim();


document.querySelectorAll("#history .history-item").forEach(item=>{


const text = item.querySelector(".chat-name")
.textContent.toLowerCase();


item.style.display = text.includes(value)

? "flex"

: "none";


});


});



document.getElementById("speakBtn")

.onclick=()=>{


const speech=

new SpeechSynthesisUtterance(


responseBox.innerText

);


speechSynthesis.speak(

speech

);


}

document.getElementById("micBtn").onclick = ()=>{


const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();


recognition.lang = "en-US";


recognition.start();




recognition.onresult = (event)=>{


const speech = event.results[0][0].transcript;



promptBox.value = speech;

button.click();



};



};


document.getElementById("pdfBtn").onclick = () => {


const { jsPDF } = window.jspdf;


const doc = new jsPDF();

doc.setFont("helvetica");

doc.setFontSize(12);

const text = responseBox.innerText;


const lines = doc.splitTextToSize(text, 180);


let y = 10;


lines.forEach(line => {


    if(y > 280){

        doc.addPage();

        y = 10;

    }


    doc.text(line, 10, y);


    y += 7;


});


doc.save("StudyBuddy.pdf");


};

const themeBtn =
document.getElementById("themeBtn");


if(localStorage.getItem("theme")==="light"){

document.body.classList.add("light");

themeBtn.innerText="☀️ Light Mode";

}


themeBtn.onclick=()=>{


document.body.classList.toggle("light");


if(document.body.classList.contains("light")){


localStorage.setItem(
"theme",
"light"
);

themeBtn.innerText="☀️ Light Mode";


}
else{


localStorage.setItem(
"theme",
"dark"
);

themeBtn.innerText="🌙 Dark Mode";


}


};

// Initial Load

updateHistory();

const uploadBtn =
document.getElementById("uploadBtn");

const fileInput =
document.getElementById("fileInput");


uploadBtn.onclick=()=>{

fileInput.click();

};



fileInput.onchange = async ()=>{


const file = fileInput.files[0];


if(!file) return;



// TXT


if(file.name.endsWith(".txt")){


const text = await file.text();


promptBox.value = text;


}



// PDF


if(file.name.endsWith(".pdf")){


const reader = new FileReader();


reader.readAsArrayBuffer(file);



reader.onload = async ()=>{


const pdf = await pdfjsLib.getDocument({

data:reader.result

}).promise;



let text="";



for(let i=1;i<=pdf.numPages;i++){


const page = await pdf.getPage(i);


const content = await page.getTextContent();



text += content.items
.map(x=>x.str)
.join(" ");


text += "\n";


}



promptBox.value = text;



};



}



};


const sidebar =
document.querySelector(".sidebar");


document.getElementById("toggleSidebar")
.onclick = ()=>{


sidebar.classList.toggle(
"collapsed"
);


};

document.getElementById("cancelDelete").onclick = () => {

document.getElementById("deleteModal").style.display = "none";

};



document.getElementById("confirmDelete").onclick = () => {

if(deleteIndex !== null){

chats.splice(deleteIndex,1);

localStorage.setItem(

"chats",

JSON.stringify(chats)

);


updateHistory();

deleteIndex = null;

}


document.getElementById("deleteModal").style.display = "none";

};

updateHistory();
