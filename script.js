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
const both = [
    [["Earth"],["Sinner"],[60],["Red"],["Female"],["TV"]],
    [["Earth"],["Sinner"],[140],["Gray"],["Male"],["TV"]],
    [["Earth"],["Sinner"],[140],["Black"],["Male"],["Vees"]],
]
const bothn = ["Katie Killjoy","Tom Trench","Travis"];
const hbn = [];

const hb = [
];

const hhn = ["Alastor","Angel Dust","Razzle & Dazzle","Sir Pentious","Vox","Rosie","Velvette","Valentino","Cherri Bomb","Husk","Adam","Lute","Niffty","Lucyfer", "Baxter", "Carmilla Carmine", "Egg Boiz", "Emily", "Fat Nuggets", "Katie Killjoy", "KeeKee", "Lilith", "Mimzy", "Molly", "Sera", "St. Peter", "Travis","Vaggie", "Zestial","Charlie"]

const hh = [
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
    [["Hell"],["Pet"],["Unknown"],["Black"],["Female"],["Hotel","Lucyfer"]],
    [["Earth"],["Sinner","Morningstar"],["A Lot"],["Black"],["Female"],["Lucyfer","Exorcist"]],
    [["Earth"],["Sinner"],[130],["Red"],["Female"],["Alastor","Mammon"]],
    [["Earth"],["Saint"],[90],["White","Pink"],["Female"],["Heaven"]],
    [["Heaven"],["Seraph"],["Unknown"],["White","Gray"],["Female"],["Heaven"]],
    [["Earth"],["Angel"],[2050],["White","Blue"],["Male"],["Heaven"]],
    [["Heaven"],["Fallen Angel"],["Unknown"],["Red","Gray"],["Female"],["Hotel","Exorcist"]],
    [["Earth"],["Sinner","Overlord"],[500],["Black","Green"],["Male"],["Zestial"]],
    [["Hell"],["Morningstar"],[200],["Red","Black"],["Female"],["Hotel"]],
];
let names = [];
let mainList = [];
connectArrays()
const usedIndexes = [];
let lastGuess = null;
let output = document.getElementById('Output');
const randomIndex = Math.floor(Math.random() * mainList.length);
autocomplete(document.getElementById("name"), names);
document.getElementById("Button").addEventListener("click", search);
document.getElementById("name").addEventListener("keydown", function(e) {search()});

