function assert(condition, message) {
    if (!condition) {
        throw new Error("Assertion failed (see traceback): " + message);
    }
}

async function loadRecords() {
    let recordsResponse = await fetch("/data/data.tsv");
    let recordsText = await recordsResponse.text();
    let recordsList = recordsText.split("\n");

    let parsedRecords = [];

    for (let i = 1; i < recordsList.length; i ++) {
        let record = recordsList[i].split("\t");

        assert(record.length === 8, "Detected malformed record \"" + recordsList[i] + "\" (you need to fix it in the sheet!)");

        let institution = record[0].trim();
        let artist = record[1].trim();
        let work = record[2].trim();
        let year = record[3].trim();
        let medium = record[4].trim();
        let collection = record[5].trim();
        let source = record[6].trim();
        let status = record[7].trim();

        if (institution === "" || artist === "" || work === "") {
            continue;
        }

        if (year === "n.d." || year === "-") {
            year = "";
        }

        assert(record.institution || !record.collection, "Work should never have a collection but not an institution!");

        parsedRecords.push({
            institution,
            artist,
            work,
            year,
            medium,
            collection,
            source,
            status,
        });
    }

    return parsedRecords;
}

function sortRecords(records, options) {
    let result = records.concat();

    result.sort(function(a, b) {
        switch(options.sort) {
            case "by-museum":
                return a.institution.localeCompare(b.institution);
            case "by-title":
                return a.work.localeCompare(b.work);
            case "by-artist":
                return a.artist.localeCompare(b.artist);
            default:
                throw new Error();
        }
    });

    return result;
}

function displayRecords(containerElement, records) {
    let gridContainer = document.createElement("div");
    gridContainer.className = "gridcontainer_works";

    for (let i in records) {
        let record = records[i];

        let created = document.createElement("div");
        created.className = "displayedrecord";

        let workInfo = document.createElement("div");
        workInfo.className = "workinfo";

        let workTitle = document.createElement("div");
        workTitle.className = "info_title";
        workTitle.innerText = record.work;
        workInfo.appendChild(workTitle);

        if (record.artist) {
            let artistElement = document.createElement("span");
            artistElement.className = "info_artist";
            artistElement.innerText = record.artist;
            workInfo.appendChild(artistElement);
        }

        if (record.artist && record.year) {
            let commaNode = document.createTextNode(", ");
            commaNode.innerText = ", ";
            workInfo.appendChild(commaNode);
        }

        if (record.year) {
            let yearElement = document.createElement("span");
            yearElement.className = "info_year";
            yearElement.innerText = record.year;
            workInfo.appendChild(yearElement);
        }

        workInfo.appendChild(document.createElement("br"));

        if (record.medium) {
            let mediumElement = document.createElement("span");
            mediumElement.className = "info_medium";
            mediumElement.innerText = record.medium;
            workInfo.appendChild(mediumElement);
        }

        workInfo.appendChild(document.createElement("br"));
        workInfo.appendChild(document.createElement("br"));

        if (record.institution) {
            let institutionElement = document.createElement("span");
            institutionElement.className = "info_institution";
            institutionElement.innerText = record.institution;
            workInfo.appendChild(institutionElement);
        }
        if (record.collection) {
            let brElement = document.createElement("br");
            workInfo.appendChild(brElement);

            let collectionElement = document.createElement("span");
            collectionElement.className = "info_collection";
            collectionElement.innerText = record.collection;
            workInfo.appendChild(collectionElement);
        }

        created.appendChild(workInfo);

        gridContainer.appendChild(created);
    }

    containerElement.replaceChildren(gridContainer);
}
