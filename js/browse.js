let allWorksElement = document.getElementById("allWorks");
let sortWorksSelector = document.getElementById("sortworks");

let RECORDS = null;

async function getOrInitRecords() {
    if (RECORDS === null) {
        RECORDS = await loadRecords();
    }
    
    return RECORDS;
}

document.addEventListener("DOMContentLoaded", async function() {
    let records = await getOrInitRecords();

    displayRecords(allWorksElement, records);
});

sortWorksSelector.addEventListener("change", async function() {
    let sort = sortWorksSelector.value;

    let records = await getOrInitRecords();
    let sortedRecords = sortRecords(records, { sort });

    displayRecords(allWorksElement, sortedRecords);
});
