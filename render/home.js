function renderHomePage() {

    var mainContent = document.querySelector(".main-content");

    mainContent.innerHTML = `
    <div class="py-2" id="homepage-notice-block">
        <div class="d-flex mb-2">Gyors feljegyzések</div>
            <div class="d-block w-100 flex-wrap" id="homepage-note-block">
                <div class="d-flex input w-100">
                    <div class="form-group w-100">
                        <input type="email" class="form-control" id="new-pin-input" placeholder="új jegyzet">
                    </div>
                    <button type="button" class="btn btn-secondary ms-2" id="fix-pin-button">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                </div>
                <div class="" id="note-list-block"></div>
            </div>
        </div>

        <div class="py-2" id="homepage-last-saved-block">
            <div class="d-flex mb-2">Legutóbb mentett kifejezések</div>
            <div class="d-flex flex-wrap justify-content-start" id="history-words">
        </div>
    </div>
    `

    renderMyNotes();
    renderLastAddedWords();
    fixPin();
}

function renderMyNotes() {

    let noteListContainer = document.getElementById('note-list-block');
    noteListContainer.innerHTML = '';

    let notelistHTML = '';
    state.notes.sort().reverse().map(note => {

        notelistHTML += `
        <div class="pinned notelist bubble note" data-autoID="${note.autoID}" data-dbid="${note.id}">
            <div class="d-flex w-100 text-content align-items-center">
                    <i class="fas fa-thumbtack"></i>
                    <span class="ms-2 w-100" title="${note.dateTime.toLocaleString()}">${note.text}</span>
                </div>
                <div data-autoID="${note.autoID}" class="pin-remove-button d-none">
                    <i class="fas fa-times-circle"></i>
                </div>
        </div>
        `
        noteListContainer.innerHTML = notelistHTML;

    })

    pinnedNoteEffect();
    removeNote();
    state.notes.sort().reverse();
}


function pinnedNoteEffect() {

    let pins = document.querySelectorAll('.pinned');

    for (const pin of pins) {

        pin.addEventListener('mouseover', () => {

            if (pin.dataset.autoID === pin.lastElementChild.dataset.autoID) {
                pin.lastElementChild.classList.remove('d-none');
            }
        })
        pin.addEventListener('mouseleave', () => {

            if (pin.dataset.autoID === pin.lastElementChild.dataset.autoID) {
                pin.lastElementChild.classList.add('d-none');
            }
        })
    }

}

function fixPin() {

    let fixPinButton = document.getElementById('fix-pin-button');
    let newPinInput = document.getElementById('new-pin-input');



    fixPinButton.addEventListener('click', () => {

        if (newPinInput.value) {

            let newID = state.notes.length > 0 ?
                state.notes.reduce(function (prev, current) {
                    return (prev.id > current.id) ? prev : current
                }).id + 1 : 1;

            let now = new Date().toJSON();
            var component = new Notes(newID, newPinInput.value, now);

            state.notes.push(component);

            renderMyNotes();
        }

    })

}


function removeNote() {

    let pins = document.querySelectorAll('.pinned');

    for (const pin of pins) {

        pin.lastElementChild.addEventListener('click', () => {

            console.log('törlés', pin.dataset.dbid, pin.dataset.autoid);
            pin.remove();
            let index = state.notes.findIndex(x => x.autoID === pin.dataset.autoid);
            state.notes.splice(index, 1);

        })
    }
}


function renderLastAddedWords() {

    let historyWordsContainer = document.getElementById('history-words');
    historyWordsContainer.innerHTML = '';

    let contentHTML = '';

    let puffer = array_words.map(element => {
        return element;
    }).sort().reverse();


    for (let i = 0; i < 20; i++) {
        contentHTML += `
            <div class="bubble default history-word-element word-1-version">
                <span class="history-word-1 d-block">${puffer[i].word_1}</span>
                <span class="history-word-2 d-none">${puffer[i].word_2}</span>
            </div>
        `
    }

    historyWordsContainer.innerHTML = contentHTML;
    lastAddedWordHover()
}

function lastAddedWordHover() {

    let words = document.querySelectorAll('.history-word-element');

    for (const word of words) {

        word.addEventListener('click', () => {
            if (word.lastElementChild.classList.contains('d-none')) {
                word.lastElementChild.classList.remove('d-none');
                word.classList.remove('word-1-version');
                word.lastElementChild.classList.add('d-flex');
                word.classList.add('word-2-version');
                word.firstElementChild.classList.add('d-none');
            }
            else {
                word.firstElementChild.classList.remove('d-none');
                word.classList.remove('word-2-version');
                word.firstElementChild.classList.add('d-flex');
                word.classList.add('word-1-version');
                word.lastElementChild.classList.add('d-none');
            }
        })
    }
}