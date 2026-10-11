
console.log("fetch.js");
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
document.addEventListener("DOMContentLoaded", async function() {
    let records = await loadRecords();

    let event = new CustomEvent("recordsLoaded", {
        detail: {
            records,
        }
    });

    document.dispatchEvent(event);
});
