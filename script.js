function getText(){
    return document.querySelector("textarea.site-code").value
} 

class CallSlip{
    constructor(english, polish){
        this.english = english
        this.polish = polish
    }
}

var code = ""
btn = document.querySelector("button.submit-button")
btn.addEventListener("click", () => {code = getText()})

function reduceCode(str){
}