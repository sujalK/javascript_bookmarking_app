// UI vars
const websiteName = document.querySelector("#header-form"),
      clearBtn    = document.querySelector('#clearAll');

// Data class
class Data {
  constructor(name, url) {
    this.name = name;
    this.url  = url;
  }
}

// UI class
class UI {
  // alert message
  message(msg, status) {
    const parent = document.querySelector("#header"),
          form   = document.querySelector("#header-form"),
          div    = document.createElement("div");

    // add class
    div.className = status;
    // insert text in div
    div.appendChild(document.createTextNode(msg));

    // insert div before h2
    parent.insertBefore(div, form);

    // disappear after 3 seconds
    setTimeout(function() {
      div.remove();
    }, 3000);
  }

  // Add to ui
  addToUI(bookmark) {
    // console.log(bookmark);
    const container = document.getElementById("list-container"),
          contInner = document.createElement("div"),
          dateTime  = new Date();

    let year   = dateTime.getFullYear(),
        month  = dateTime.getMonth(),
        date   = dateTime.getDay();

    contInner.innerHTML = `
        <div class="container-inner">
            <div class="a">
                <h4 id="website_name">${bookmark.name}</h4>
                <p id="date-created">${year}-${month}-${date}</p>
                <a href="http://${bookmark.url}" target="_blank" class="set_web_addr">${bookmark.url}</a>
            </div>
            <div class="buttons-inner">
                <a href="http://${bookmark.url}" target="_blank" class="set_web_addr">Visit</a>
                <span class="remove-icon">Remove</span>
            </div>
        </div>
    `;

    // adding the data into the UI.
    container.appendChild(contInner);
    // console.log(bookmark);
  }

  clearInputs() {
    document.getElementById("website").value = "";
    document.getElementById("website_addr").value = "";
  }

  removeItem(innerContainer) {
    const ui = new UI();
    innerContainer.remove();
    ui.message("Bookmark Deleted", "success");
  }

  lsToUI(datas) {
      let self=this;
      datas.forEach(function(data) {
        self.addToUI(data);
      });
  }

  // Clear UI
  clear() {
    const container = document.getElementById("list-container");
    container.innerHTML= '';
  }

}

// LocalStorage
class LocalStorage {
    getData() {
        let bookmark;
        if(localStorage.getItem('bookmarks') === null){
            bookmark = [];
        } else {
            bookmark= JSON.parse(localStorage.getItem('bookmarks'));
        }
        return bookmark;
    }

    addToLs(website) {
        let ds =  { name: website.name, url: website.url };

        const bookmark= this.getData();

        bookmark.push(ds);

        localStorage.setItem('bookmarks', JSON.stringify(bookmark));
    }

    deleteFromLs(urlName) {
        let compare      = String(urlName.getAttribute('href')),
            outputString = compare.replace('http://', '');

        const bookmarks  = this.getData();

        bookmarks.forEach(function(bookmark, index) {
            if(bookmark.url === outputString) {
                bookmarks.splice(index, 1);
            }
        });

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    clearLS() {
        localStorage.clear();
    }
}

// Event Listener: DOMContentLoad
document.addEventListener('DOMContentLoaded', function() {
    const ls= new LocalStorage();

    const ui= new UI();

    ui.lsToUI(ls.getData());

});

// Event Listener: Add Bookmark 
websiteName.addEventListener("submit", function(e) {
  const webNameInput    = document.getElementById("website").value,
        webAddressInput = document.getElementById("website_addr").value,
        ui              = new UI();

  if (webNameInput === "" || webAddressInput === "") {
    ui.message("Please fill in the fields", "danger");
  } else {
    const data = new Data(webNameInput, webAddressInput);
    const ls= new LocalStorage();

    // Add bookmark to UI
    ui.addToUI(data);

    // Add to LS
    ls.addToLs(data);

    // show message
    ui.message("Added Successfully", "success");

    // Clear the input fields
    ui.clearInputs();
  }

  // focus on the input box
  document.querySelector("#website").focus();

  e.preventDefault();
});

// Event Listener for clearing all bookmarks
clearBtn.addEventListener('click', function() {
    const ls= new LocalStorage();
    const ui= new UI();

    // Clear From UI
    ui.clear();

    // Clear from LS
    ls.clearLS();

    navigator.location="";
});

// Event Listener: Remove bookmark
document.querySelector("#list").addEventListener("click", function(e) {
  const ui = new UI();
  const ls= new LocalStorage();
  if(e.target.className === 'remove-icon') {
    ui.removeItem(e.target.parentElement.parentElement);
    ls.deleteFromLs(e.target.previousElementSibling);
  }
});
