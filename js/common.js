async function loadRecords() {
    let recordsResponse = await fetch("/data/data.tsv");
    let recordsText = await recordsResponse.text();
    let recordsList = recordsText.split("\n");

    let parsedRecords = [];

    for (let i = 1; i < recordsList.length; i ++) {
        let record = recordsList[i].split("\t");
        if (record.length !== 8) {
            throw new Error("Detected malformed record \"" + recordsList[i] + "\" (you need to fix it in data.csv!)");
        }

        let institution = record[0].trim();
        let artist = record[1].trim();
        let work = record[2].trim();
        let year = record[3].trim();
        let medium = record[4].trim();
        let collection = record[5].trim();
        let source = record[6].trim();
        let status = record[7].trim();

        if (institution === "") {
            continue;
        }

        if (year === "n.d." || year === "-") {
            year = "";
        }

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

    if (options.sort !== "default") {
        result.sort(function(a, b) {
            switch(options.sort) {
                case "by-title":
                    return a.work.localeCompare(b.work);
                case "by-artist":
                    return a.artist.localeCompare(b.artist);
                default:
                    throw new Error();
            }
        });
    }

    return result;
}

function displayRecords(containerElement, records) {
    let gridContainer = document.createElement("div");
    gridContainer.className = "gridcontainer";

    for (let i in records) {
        let record = records[i];

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
            text += " — ";
        }
        if (record.collection) {
            text += record.collection;
        }

        workInfo.innerText = text;
        created.appendChild(workInfo);

        gridContainer.appendChild(created);
    }

    containerElement.replaceChildren(gridContainer);
}
