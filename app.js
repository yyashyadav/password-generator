


const inputSlider = document.querySelector("[data-lenghtSlider]");
const lenghtDisplay=document.querySelector("[data-lenghtNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copymessage]");
const uppercaseCheck=document.querySelector(".uppercase");
const lowercaseCheck=document.querySelector(".lowercase");
const numbersCheck=document.querySelector(".numbers");
const symbolsCheck=document.querySelector(".symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// intialise the value 
let password=" ";
let passwordLength=10;
let checkCount=0;

// this tis to not show passwordafter reload 
window.addEventListener('load', () => {
    passwordDisplay.value = '';
    uppercaseCheck.checked = true;
    // Uncheck all other checkboxes
    [lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
        checkbox.checked = false;
    });
});

handleSlider();
setIndicator("#ccc");
// also we initialise the to grey of indicator 

// this function is made for password lenght teller 
function handleSlider(){
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    // shadow part 
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min ;
}
function getRndUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function getRndLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateRndInteger(){
    return getRndInteger(0,9);
}
function getRndSymbols(){
    const rndNum=getRndInteger(0,symbols.length);
    return symbols.charAt(rndNum);
}
function calStrenght(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;


    if(hasUpper && hasLower && (hasSym||hasNum) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else  if((hasUpper||hasLower) && (hasSym||hasNum) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("f00");
    }

}


function passwordSuffle(array){
//  now we suffle it from method yates
for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const temp=array[i];
    array[i]=array[j];
    array[j]=temp;
}
let str= "";
array.forEach((el)=>(str+=el));
return str;
}


/* navigator.clipboard.writeText() is a method provided by the Clipboard API, which allows JavaScript code to interact with the system clipboard (the place where copied or cut items are stored).

Here's what navigator.clipboard.writeText() does:

navigator.clipboard: This is an object that represents the clipboard. It provides methods to read from and write to the clipboard.
writeText(): This is a method of the navigator.clipboard object. It allows you to write text to the clipboard asynchronously. The method takes a string as its argument, representing the text you want to write to the clipboard.
*/
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}

/* copyTextToClipboard is an async function that uses await to wait for the navigator.clipboard.writeText() method to complete before proceeding. This function takes a text parameter and tries to copy it to the clipboard. If successful, it logs a success message. If an error occurs, it logs an error message */
  

// now we add event listener in the slider 

inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
        copyContent();
} )



function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
       if(checkbox.checked){
        checkCount++;
         }
     } );
    //  special condition 
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
     }
    }

    
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckboxChange);
})

generateBtn.addEventListener("click",()=>{
    // when none of the chexkbox selected
    if(checkCount==0) 
        return;

    // when the lenght is smaller than the count vlaue 
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("Starting the Journey");
    //remove old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(getRndUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(getRndLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRndInteger);

    if(symbolsCheck.checked)
        funcArr.push(getRndSymbols);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let rndIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + rndIndex);
        password += funcArr[rndIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = passwordSuffle(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calStrenght();

});


