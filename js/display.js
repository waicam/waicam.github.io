let currentScript = document.currentScript;

document.addEventListener("recordsLoaded", function(e) {
    let records = e.detail.records;

    let institutionFilter = currentScript.dataset.institutionFilter;
    let containerElement = currentScript.parentNode;

    let gridContainer = document.createElement("div");
    gridContainer.className = "gridcontainer";
    containerElement.appendChild(gridContainer);

    console.log(records, containerElement);
    for (let i in records) {
        let record = records[i];
        if (institutionFilter !== undefined) {
            if (record.institution !== institutionFilter) {
                continue;
            }
        }

        let created = document.createElement("div");
        created.className = "displayedrecord";

        let workTitle = document.createElement("div");
        workTitle.className = "worktitle";
        workTitle.innerText = record.work;
        created.appendChild(workTitle);

        let workInfo = document.createElement("p");
        workInfo.className = "workinfo";
        let text = "";

        if (record.artist) {
            text += record.artist;
        }
        if (record.artist && record.year) {
            text += ", ";
        }
        if (record.year) {
            text += record.year;
        }
        text += "\n";
        if (record.medium) {
            text += record.medium;
        }
        text += "\n";
        if (record.institution) {
            text += record.institution;
        }
        if (record.institution && record.collection) {
            text += " -- ";
        }
        if (record.collection) {
            text += record.collection;
        }

        workInfo.innerText = text;
        created.appendChild(workInfo);

        gridContainer.appendChild(created);
    }
});
