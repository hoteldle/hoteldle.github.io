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
    if(lastGuess == null) {
        document.getElementById('ColorIndicator').style.visibility = 'visible';
    }
    if (randomIndex === userIndex) {
        document.getElementByClassName('autocomplete').style.display = 'none';
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
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
} 

//------------------------------------------------------------------------------\\

const names = ["Alastor","Angel Dust","Razzle & Dazzle","Sir Pentious","Vox","Rosie","Velvette","Valentino","Cherri Bomb","Husk","Adam","Lute","Niffty","Lucyfer", "Baxter", "Carmilla Carmine", "Egg Boiz", "Emily", "Fat Nuggets", "Katie Killjoy", "KeeKee", "Lilith", "Mimzy", "Molly", "Sera", "St. Peter", "Tom Trench", "Travis","Vaggie", "Zestial","Charlie"]
/*
const mainList = [
    [["Sinner"],["Overlord"],[110],["Red"],["Male"],["Hotel","Alastor"]],
    [["Sinner"],["Normal"],[90],["White"],["Male"],["Hotel","Vees"]],
    [["Hellborn"],["Pet"],["Unknown"],["Red"],["Male"],["Lucyfer","Hotel"]],
    [["Sinner","Saint"],["Normal"],[150],["Red","Black"],["Male"],["Hotel","Vees","Sir Pentious"]],
    [["Sinner"],["Overlord"],[100],["Blue"],["Male"],["Vees"]],
    [["Hellborn"],["Overlord"],["Unknown"],["Red","White"],["Female"],["Canibal"]],
    [["Sinner"],["Overlord"],[25],["Red","Black"],["Female"],["Vees"]],
    [["Sinner"],["Overlord"],[80],["Red","White"],["Male"],["Vees"]],
    [["Sinner"],["Normal"],[80],["Red","White"],["Female"],["Hotel"]],
    [["Sinner"],["Normal"],[80],["Red","Black"],["Male"],["Hotel","Alastor"]],
    [["Saint"],["Angel"],["A Lot"],["White","Yellow"],["Male"],["Heaven","Adam"]],
    [["Heavenborn"],["Angel","Exorcist"],["Unknown"],["White","Black"],["Female"],["Heaven","Adam"]],
    [["Sinner"],["Normal"],[100],["Red","White"],["Female"],["Hotel","Alastor"]],
    [["Heavenborn"],["Seven Deadly Sins","Fallen Angel", "Morningstar"],["A Lot"],["Red","White"],["Male"],["Seven Deadly Sins","Lucyfer"]],
    [["Sinner"],["Normal"],[130],["Black","Blue"],["Male"],["Unknown"]],
    [["Sinner"],["Overlord"],["Unknown"],["White","Black"],["Female"],["Carmilla Carmine"]],
    [["Artificial"],["Pet"],["Unknown"],["White","Yellow"],["Male"],["Hotel","Sir Pentious"]],
    [["Heavenborn"],["Seraph"],["Unknown"],["White","Blue"],["Female"],["Heaven"]],
    [["Hellborn"],["Pet"],["Unknown"],["Pink"],["Male"],["Hotel"]],
    [["Sinner"],["Normal"],[60],["Red"],["Female"],["TV"]],
    [["Hellborn"],["Pet"],["Unknown"],["Black"],["Female"],["Hotel","Lucyfer"]],
    [["Sinner"],["Morningstar"],["A Lot"],["Black"],["Female"],["Lucyfer","Exorcist"]],
    [["Sinner"],["Normal"],[130],["Red"],["Female"],["Alastor","Mammon"]],
    [["Saint"],["Normal"],[90],["White","Pink"],["Female"],["Heaven"]],
    [["Heavenborn"],["Seraph"],["Unknown"],["White","Gray"],["Female"],["Heaven"]],
    [["Saint"],["Angel"],[2050],["White","Blue"],["Male"],["Heaven"]],
    [["Sinner"],["Normal"],[140],["Gray"],["Male"],["TV"]],
    [["Sinner"],["Normal"],[140],["Black"],["Male"],["Vees"]],
    [["Heavenborn"],["Fallen Angel"],["Unknown"],["Red","Gray"],["Female"],["Hotel","Exorcist"]],
    [["Sinner"],["Overlord"],[500],["Black","Green"],["Male"],["Zestial"]],
    [["Hellborn"],["Morningstar"],[200],["Red","Black"],["Female"],["Hotel"]],
];
*/

const mainList = [
    [["Earth"],["Sinner","Overlord"],[110],["Red"],["Male"],["Hotel","Alastor"]],
    [["Earth"],["Sinner"],[90],["White"],["Male"],["Hotel","Vees"]],
    [["Hell"],["Pet"],["Unknown"],["Red"],["Male"],["Lucyfer","Hotel"]],
    [["Earth"],["Sinner","Saint"],[150],["Red","Black"],["Male"],["Hotel","Vees","Sir Pentious"]],
    [["Earth"],["Sinner","Overlord"],[100],["Blue"],["Male"],["Vees"]],
    [["Hell"],["Overlord"],["Unknown"],["Red","White"],["Female"],["Canibal"]],
    [["Earth"],["Sinner","Overlord"],[25],["Red","Black"],["Female"],["Vees"]],
    [["Earth"],["Sinner","Overlord"],[80],["Red","White"],["Male"],["Vees"]],
    [["Earth"],["Sinner"],[80],["Red","White"],["Female"],["Hotel"]],
    [["Earth"],["Sinner"],[80],["Red","Black"],["Male"],["Hotel","Alastor"]],
    [["Earth"],["Angel"],["A Lot"],["White","Yellow"],["Male"],["Heaven","Adam"]],
    [["Heaven"],["Angel","Exorcist"],["Unknown"],["White","Black"],["Female"],["Heaven","Adam"]],
    [["Earth"],["Sinner"],[100],["Red","White"],["Female"],["Hotel","Alastor"]],
    [["Heaven"],["Seven Deadly Sins","Fallen Angel", "Morningstar"],["A Lot"],["Red","White"],["Male"],["Seven Deadly Sins","Lucyfer"]],
    [["Earth"],["Sinner"],[130],["Black","Blue"],["Male"],["Unknown"]],
    [["Earth"],["Sinner","Overlord"],["Unknown"],["White","Black"],["Female"],["Carmilla Carmine"]],
    [["Artificial"],["Pet"],["Unknown"],["White","Yellow"],["Male"],["Hotel","Sir Pentious"]],
    [["Heaven"],["Seraph"],["Unknown"],["White","Blue"],["Female"],["Heaven"]],
    [["Hell"],["Pet"],["Unknown"],["Pink"],["Male"],["Hotel"]],
    [["Earth"],["Sinner"],[60],["Red"],["Female"],["TV"]],
    [["Hell"],["Pet"],["Unknown"],["Black"],["Female"],["Hotel","Lucyfer"]],
    [["Earth"],["Sinner","Morningstar"],["A Lot"],["Black"],["Female"],["Lucyfer","Exorcist"]],
    [["Earth"],["Sinner"],[130],["Red"],["Female"],["Alastor","Mammon"]],
    [["Earth"],["Saint"],[90],["White","Pink"],["Female"],["Heaven"]],
    [["Heaven"],["Seraph"],["Unknown"],["White","Gray"],["Female"],["Heaven"]],
    [["Earth"],["Angel"],[2050],["White","Blue"],["Male"],["Heaven"]],
    [["Earth"],["Sinner"],[140],["Gray"],["Male"],["TV"]],
    [["Earth"],["Sinner"],[140],["Black"],["Male"],["Vees"]],
    [["Heaven"],["Fallen Angel"],["Unknown"],["Red","Gray"],["Female"],["Hotel","Exorcist"]],
    [["Earth"],["Sinner","Overlord"],[500],["Black","Green"],["Male"],["Zestial"]],
    [["Hell"],["Morningstar"],[200],["Red","Black"],["Female"],["Hotel"]],
];
autocomplete(document.getElementById("name"), names);
const usedIndexes = [];
let lastGuess = null;
let output = document.getElementById('Output');
const randomIndex = Math.floor(Math.random() * mainList.length);
document.getElementById("Button").addEventListener("click", search);

