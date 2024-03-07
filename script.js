function connectArrays() {
    var id = document.getElementById("Dropdown").value;
    mainList = [];
    names = [];
    if(id == 0) {
        mainList = hh.concat(hb,both);
        names = hhn.concat(hbn,bothn);
    }
    else if(id == 1){
        mainList = hh.concat(both);
        names = hhn.concat(bothn);
    }
    else if(id == 2){
        mainList = hb.concat(both);
        names = hbn.concat(bothn);
    }
    autocomplete(document.getElementById("name"), names);
    reset();
    if(mainList.length != names.length){console.log("You Dumbass You Can't Count");}
}
function reset() {
    randomIndex = Math.floor(Math.random() * mainList.length);
    lastGuess = null;
    usedIndexes = [];
    document.getElementById('autocomplete').style.display = 'inline-block';
    output.textContent = '';
}

function compareArrays(mainList, userIndex, randomIndex) {
    let outputArray = [];

    const selectedArray1 = mainList[userIndex];
    const selectedArray2 = mainList[randomIndex];

    for (let i = 0; i < selectedArray1.length; i++) {
        const array1 = selectedArray1[i];
        const array2 = selectedArray2[i];

        let found = false;

        for (let j = 0; j < array1.length; j++) {
            if (array2.includes(array1[j])) {
            found = true;
            break;
            }
        }

        if (!found) {
            outputArray.push(2);
        } else if (JSON.stringify(array1) === JSON.stringify(array2)) {
            outputArray.push(0);
        } else {
            outputArray.push(1);
        }
    }

    return outputArray;
}

//------------------------------------------------------------------------------\\

function check(mainList,userIndex,randomIndex,output,name){
    document.getElementById('name').value = "";
    if(lastGuess == null) {
        document.getElementById('ColorIndicator').style.visibility = 'visible';
    }
    if (randomIndex === userIndex) {
        document.getElementById('autocomplete').style.display = 'none';
    }
    const result = compareArrays(mainList, userIndex, randomIndex);
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper")
    output.insertBefore(wrapper,lastGuess)
    lastGuess = wrapper;
    let image = document.createElement("div");
    wrapper.appendChild(image);
    image.classList.add("Box");
    let tmp1 = document.createElement("p");
    let tmp2 = document.createTextNode(String(name));
    tmp1.appendChild(tmp2);
    image.appendChild(tmp1);
    for(let i = 0; i < 6; i++){
        const element = document.createElement("div");
        wrapper.appendChild(element);
        element.classList.add("Box" + result[i]);
        if(i == 2 && JSON.stringify(mainList[userIndex][i]) != JSON.stringify(mainList[randomIndex][i])){
            if(mainList[userIndex][i] != "Unknown" &&  mainList[randomIndex][i] != "Unknown"){
                if(mainList[randomIndex][i] == "A Lot" || parseInt(mainList[userIndex][i]) < parseInt(mainList[randomIndex][i])){
                    let arrow = document.createElement("div");
                    arrow.classList.add("ArrowUp");
                    element.appendChild(arrow);
                }
                else if(mainList[userIndex][i] == "A Lot" || parseInt(mainList[userIndex][i]) > parseInt(mainList[randomIndex][i])){
                    let arrow = document.createElement("div");
                    arrow.classList.add("ArrowDown");
                    element.appendChild(arrow);
                }
            }
        }
        const para = document.createElement("p");
        let text = " "
        for (let j = 0; j < mainList[userIndex][i].length; j++) {
            text += String(mainList[userIndex][i][j]);
            if (j < mainList[userIndex][i].length - 1) {
                text += ", "
            }
            
        }
        const node = document.createTextNode(text);
        para.appendChild(node);
        element.appendChild(para);
        resize_to_fit(para,element)
    }

}

//------------------------------------------------------------------------------\\

function findIndex(array, searchString) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == searchString) {
            if (!usedIndexes.includes(i)) {
                usedIndexes.push(i); // Mark the index as used
                return i; // Return the index if the string is found and the index is not used
            } else {
                return -1; // Return -1 if the index is already used
            }
        }
    }
    return -1; // Return -1 if the string is not found in the array
}
//------------------------------------------------------------------------------\\

function resize_to_fit(para,element) {
    let fontSize = window.getComputedStyle(para).fontSize;
    
    if(para.clientHeight >= element.clientHeight){
      para.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
      resize_to_fit(para,element);
    }
    else if(Math.ceil(para.clientWidth) > 70) {
        para.style.fontSize = (parseFloat(fontSize) - 4) + 'px';
    }
  }

//------------------------------------------------------------------------------\\

function search() {
    let userIndex = findIndex(names,document.getElementById('name').value);
    if(userIndex != -1){check(mainList,userIndex, randomIndex, output,document.getElementById('name').value);}
}

//------------------------------------------------------------------------------\\

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });

//------------------------------------------------------------------------------\\

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }

//------------------------------------------------------------------------------\\

    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

//------------------------------------------------------------------------------\\

    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
} 

//------------------------------------------------------------------------------\\
const bothn = ["Katie Killjoy","Tom Trench","Travis"];

const both = [
    [["Sinner"],["Spider"],[60],["Red"],["Female"],["TV"]], //Katie Killjoy
    [["Sinner"],["Doll"],[140],["Gray"],["Male"],["TV"]], //Tom Trench
    [["Sinner"],["Owl"],[140],["Black"],["Male"],["Vees"]], //Travis
]
const hbn = ["Andrealphus", "Asmodeus", "Barbie Wire", "Beelzebub", "Blitzo", "Bombproof", "Burnie Burnz", "Cash Buckzo", "Catfish Monster", "Chazwick Thurman", "Cletus", "Collin", "Jimmy", "Crimson", "Deerie", "Eddie", "Fizzarolli", "Glitz & Glam", "Joe", "Keenie", "Lin", "Loona", "Loopty Goopty", "Lyle Lipton", "Mammon", "Martha", "Millie", "Moxxie", "Moxxie's Mom", "Mrs. Mayberry", "Octavia", "Paimon", "Ralphie", "Robo Fizz", "Sallie May", "Stella", "Stolas", "Striker", "Verosika Mayday", "Vortex", "Wally Wackford", "Verosika's Crew"
];

const hb = [
    [["Ars Goetia","Demon"],["Owl"],["Unknown"],["White","Blue"],["Male"],["Ars Goetia"]], //Andrealphus
    [["Seven Deadly Sins"],["XD"],["Old As Hell"],["Red","Blue","Purple"],["Male"],["Seven Deadly Sins","Lust"]], //Asmodeus
    [["Demon"],["Imp"],["Unknown"],["Red","Black"],["Female"],["Camp Ivannakummore"]], //Barbie Wire
    [["Seven Deadly Sins"],["Bee","Hellhound"],["Unknown"],["Yellow","Blue","Pink"],["Female"],["Seven Deadly Sins","Gluttony"]], //Beelzebub
    [["Demon"],["Imp"],["Unknown"],["Red","Black","White"],["Male"],["I.M.P."]], //Blitzo
    [["Wildlife","Demon"],["Horse"],["Unknown"],["Red","Black"],["Male"],["Striker"]], //Bombproof
    [["Demon"],["Imp"],["Unknown"],["Red","Green"],["Male"],["Fizzarolli"]], //Burnie Burnz
    [["Demon"],["Imp"],["Unknown"],["Red","Black"],["Male"],["Fizzarolli"]], //Cash Buckzo
    [["Wildlife"],["Fish"],[10],["Gray","Blue"],["Unknown"],["Verosika Mayday"]], //Catfish Monster
    [["Demon"],["Fish"],["Unknown"],["Blue"],["Male"],["Crimson Family"]], //Chazwick Thurman
    [["Fallen Angel"],["Cherub"],["Unknown"],["White","Pink"],["Male"],["C.H.E.R.U.B."]], //Cletus
    [["Fallen Angel"],["Cherub"],["Unknown"],["White","Blue"],["Male"],["C.H.E.R.U.B."]], //Collin
    [["Human"],["Human"],[19],["Green","Brown"],["Male"],["Camp Ivannakummore"]], //Jimmy
    [["Demon"],["Imp"],["Unknown"],["Red","Blue"],["Male"],["Crimson Family","Greed"]], //Crimson
    [["Angel"],["Cherub"],["Unknown"],["Blue","Brown"],["Female"],["C.H.E.R.U.B."]], //Deerie
    [["Human"],["Human"],[10],["Blue","Orange"],["Male"],["-"]], //Eddie
    [["Demon"],["Imp","Artificial","Clown"],["Unknown"],["Red","White","Blue"],["Male"],["Mammon","Asmodeus","Greed","Lust"]], //Fizzarolli
    [["Demon"],["Fish","Clown"],["Unknown"],["Blue"],["Female"],["Mammon","Greed"]], //Glitz & Glam
    [["Demon"],["Imp"],["Unknown"],["Red"],["Male"],["Wrath"]], //Joe
    [["Fallen Angel"],["Cherub"],["Unknown"],["White","Yellow"],["Female"],["C.H.E.R.U.B."]], //Keenie
    [["Demon"],["Imp"],["Unknown"],["Red"],["Female"],["Wrath"]], //Lin
    [["Demon"],["Hellhound"],[22],["White","Black"],["Female"],["I.M.P."]], //Loona
    [["Sinner"],["Artificial"],[40],["Red","Black","Green"],["Male"],["Wally Wackford"]], //Loopty Goopty
    [["Sinner"],["Artificial"],[40],["Black","Green"],["Male"],["Wally Wackford"]], //Lyle Lipton
    [["Seven Deadly Sins"],["Clown"],["Old As Hell"],["Black","Green"],["Male"],["Mammon", "Greed", "Fizzarolli"]], //Mammon
    [["Human"],["Human"],["Unknown"],["White","Blue","Pink"],["Female"],["Satan","Cannibal"]], //Martha
    [["Demon"],["Imp"],[27],["Red","Black"],["Female"],["I.M.P.","Wrath"]], //Millie
    [["Demon"],["Imp"],["Unknown"],["Red","Black"],["Male"],["I.M.P.","Greed", "Wrath"]], //Moxxie
    [["Demon"],["Imp"],["Unknown"],["Red","Blue"],["Family"],["Crimson Family","Wrath"]], //Moxxie's Mom
    [["Sinner"],["Goat"],["Unknown"],["Black","Purple"],["Female"],["-"]], //Mrs. Mayberry
    [["Demon"],["Owl"],[17],["Black","Pink"],["Female"],["Ars Goetia"]], //Octavia
    [["Ars Goetia","Demon"],["Owl"],["Unknown"],["Red","Black"],["Male"],["Ars Goetia"]], //Paimon
    [["Human"],["Human"],["Unknown"],["Orange"],["Male"],["Satan","Cannibal"]], //Ralphie
    [["Demon"],["Artificial"],["Unknown"],["White","Black","Blue","Pink"],["Other"],["Fizzarolli","Greed","Mammon"]], //Robo Fizz
    [["Demon"],["Imp"],[27],["Red","Black"],["Female"],["Wrath"]], //Sallie May
    [["Demon"],["Owl"],["Unknown"],["White","Gray"],["Female"],["Ars Goetia"]], //Stella
    [["Ars Goetia","Demon"],["Owl"],[30],["Red","White","Black"],["Male"],["Ars Goetia"]], //Stolas
    [["Demon"],["Imp","Hybrid"],["Unknown"],["Red","White","Black"],["Male"],["Crimson Family"]], //Striker
    [["Demon"],["Succubus"],["Unknown"],["White","Black","Pink"],["Female"],["Verosika Mayday","Lust"]], //Verosika Mayday
    [["Demon"],["Hellhound"],["Unknown"],["Black","Gray"],["Male"],["Verosika Mayday","Gluttony"]], //Vortex
    [["Demon"],["Imp"],["Unknown"],["Red","White","Black"],["Male"],["Wally Wackford"]], //Wally Wackford
    [["Demon"],["Succubus"],["Unknown"],["Red","White","Black"],["Female","Male"],["Verosika Mayday","Lust"]], //Verosika's Crew
];

const hhn = ["Alastor","Angel Dust","Razzle & Dazzle","Sir Pentious","Vox","Rosie","Velvette","Valentino","Cherri Bomb","Husk","Adam","Lute","Niffty","Lucyfer", "Baxter", "Carmilla Carmine", "Egg Boiz", "Emily", "Fat Nuggets", "KeeKee", "Lilith", "Mimzy", "Molly", "Sera", "St. Peter","Vaggie", "Zestial","Charlie","Susan", "Melissa", "Kitty"]

const hh = [
    [["Sinner","Overlord"],["Deer"],[110],["Red"],["Male"],["Hotel","Alastor"]], //Alastor
    [["Sinner"],["Spider"],[90],["White"],["Male"],["Hotel","Vees"]], //Angel Dust
    [["Wildlife","Demon"],["Goat"],["Unknown"],["Red"],["Male"],["Lucyfer","Hotel"]], //Razzle Dazzle
    [["Sinner","Winner"],["Snake"],[150],["Red","Black"],["Male"],["Hotel","Vees","Sir Pentious"]], //Sir Pentious
    [["Sinner","Overlord"],["TV"],[100],["Blue"],["Male"],["Vees"]], //Vox
    [["Overlord"],["Cannibal","Doll"],["Unknown"],["Red","White"],["Female"],["Cannibal Town"]], //Rosie
    [["Sinner","Overlord"],["Doll"],[25],["Red","Black"],["Female"],["Vees"]], //Velvette
    [["Sinner","Overlord"],["Moth"],[80],["Red","White"],["Male"],["Vees"]], //Valentino
    [["Sinner"],["Cyclops"],[80],["Red","White"],["Female"],["Hotel"]], //Cherri Bomb
    [["Sinner"],["Cat"],[80],["Red","Black"],["Male"],["Hotel","Alastor"]], //Husk
    [["Angel"],["Original Dick"],["A Lot"],["White","Yellow"],["Male"],["Heaven","Adam"]], //Adam
    [["Angel"],["Exorcist"],["Unknown"],["White","Black"],["Female"],["Heaven","Adam"]], //Lute
    [["Sinner"],["Cyclops"],[100],["Red","White"],["Female"],["Hotel","Alastor"]], //Niffty
    [["Seven Deadly Sins"],["Fallen Angel","Morningstar"],["A Lot"],["Red","White"],["Male"],["Seven Deadly Sins","Lucyfer"]], //Lucyfer
    [["Sinner"],["Fish"],[130],["Black","Blue"],["Male"],["Unknown"]], //Baxter
    [["Sinner","Overlord"],["Doll"],["Unknown"],["White","Black"],["Female"],["Carmilla Carmine"]], //Carmilla Carmine
    [["Demon"],["Artificial"],["Unknown"],["White","Yellow"],["Male"],["Sir Pentious","Hotel"]], //Egg Boyz    
    [["Angel"],["Seraphim"],["Unknown"],["White","Blue"],["Female"],["Heaven"]], //Emily
    [["Wildlife","Demon"],["Pig"],["Unknown"],["Pink"],["Male"],["Hotel"]], //Fat Nuggets
    [["Wildlife","Demon"],["Cat"],["Unknown"],["Black"],["Female"],["Hotel","Lucyfer"]], //KeeKee
    [["Sinner"],["Morningstar"],["A Lot"],["Black"],["Female"],["Lucyfer","Exorcist"]], //Lilith
    [["Sinner"],["Doll"],[130],["Red"],["Female"],["Alastor","Mammon"]], //Mimzy
    [["Winner"],["Spider"],[90],["White","Pink"],["Female"],["Heaven"]], //Molly
    [["Angel"],["Seraphim"],["Unknown"],["White","Gray"],["Female"],["Heaven"]], //Sera
    [["Winner"],["Saint"],[2050],["White","Blue"],["Male"],["Heaven"]], //St. Wildlifeer
    [["Fallen Angel"],["Exorcist"],["Unknown"],["Red","Gray"],["Female"],["Hotel"]], //Vaggie
    [["Sinner","Overlord"],["Spider"],[500],["Black","Green"],["Male"],["Zestial"]], //Zestial
    [["Demon"],["Morningstar"],[200],["Red","Black"],["Female"],["Hotel"]], //Charlie
    [["Demon"],["Cannibal"],["Unknown"],["Red","Blue"],["Female"],["Cannibal Town"]], //Susan
    [["Sinner"],["Doll"],["Unknown"],["Red","White","Purple"],["Female"],["Vees"]], //Melissa
    [["Demon"],["Artificial"],["Unknown"],["White","Red","Blue"],["Other"],["Fizzarolli","Vees"]], //Kitty
];
let randomIndex = null;
let names = [];
let mainList = [];
let lastGuess = null;
let usedIndexes = [];
let output = document.getElementById('Output');
connectArrays()
document.getElementById("Button").addEventListener("click", search);
document.getElementById("name").addEventListener("keyup", (event) => {
  if (event.keyCode === 13) { function(e) {search()}}});

