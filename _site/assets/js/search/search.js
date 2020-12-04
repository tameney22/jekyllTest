
const searchInput = document.getElementById("search");
// const matchList = document.getElementById("match-list");
const numResults = document.getElementById('numResults');
const matchLists = document.getElementsByClassName('match-list');

// Don't show result fields until search form is submitted
$('#results').hide();

var documents, idx;
const theMap = new Map();

fetch("../assets/js/search/index.json")
    .then(res => res.json())
    .then(data => documents = data)
    .then(() => {
        idx = lunr(function() {
            this.ref('id')
            this.field('lineText')

            documents.forEach((doc) => {
                theMap.set(doc.id, [doc.lineNum, doc.lineText, doc.manuscriptTitle, doc.page])
                this.add(doc)
            }, this);
        });

        $('form').submit((e) => {
            e.preventDefault();
            $('.match-list').html('');
            $('#results').show();
            const term = searchInput.value;
            var results = idx.search(term);
            const resultsCount = results.length;

            results.forEach((result) => {
                const doc = theMap.get(result.ref);
                const page = doc[3];
                const manuTitle = doc[2];
                const lineText = doc[1];
                const lineNum = doc[0];
                const highlighted = highlightTerm(lineText, term);
                // Index of the space in the ref "1: br"
                const colonIndex = result.ref.indexOf(":") + 1;
                const shortName = result.ref.substring(colonIndex + 1);
                // console.log(shortName)
                const slug = ("0".repeat(4 - page.length)) + page;
                
                $(`#${shortName} .match-list`).append(`
                <div class="card">
                    <div class="card-body">
                        <p class="card-text">${highlighted}</p>
                        <h6 class="card-subtitle mb-2 text-muted">${manuTitle}</h6>
                        <a href="../${shortName}-edition/${shortName}-edition-${slug}.html?lineNum=${lineNum}" class="card-link">Go Here</a>
                    </div>
                </div>
                `);
            });

            // For displaying the number of results
            if (resultsCount > 0) {
                numResults.innerHTML = `${resultsCount} results found!`;
            } else {
                numResults.innerHTML = `${resultsCount} results found :( Please try another search term.`;
            }
        });
    });

function highlightTerm(text, term) {
    const reg = new RegExp(term, "gi");
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    const word = text.substring(index, index + term.length);
    return text.replace(reg, `<span id="highlight">${word}</span>`);
}