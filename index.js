const csvToJson = require("csvtojson"); // csv to json converter
const jsonTocsv = require("json2csv").parse; // json to csv conveter
const FileSystem = require("fs"); // access files on sys
const crypto = require('crypto'); // for hashing


// open csv file
csvToJson().fromFile("./source.csv").then(source => {

    // loop throuh each line of data object
    for (i = 0; i < source.length; i++) {
        // construct file filename using Name field
        var fileName = "./output/" + source[i].Name + ".json";
        // save the file as json and save it to output Folder
        FileSystem.writeFileSync(fileName, create007Json(source[i]));

        // json file created
        // hash each file 
        const hash = crypto.createHash("sha256").update(fileName).digest("hex");

        // append hash data
        source[i].HASH = hash;

        // create final csv
        createCsv(source[i]);
        // finalCsv(source[i]);
    }

});

// fuction that helps to create a file csv file.
function createCsv(source) {
    // csv data and fields
    const csv = jsonTocsv(source, { fields: ["TEAM NAMES", "Series Number", "Filename", "Name", "Description", "Gender", "Attributes", "UUID", "HASH"] });

    // add new updated data
    FileSystem.appendFileSync("./final.csv", csv);
    console.log("file updated");

}

// fuction to create 007 campatible json 
function create007Json(source) {

    // compute the attributes and add to json file
    var newAttri = source.Attributes.split(";");
    var att = [];
    for (j = 0; j < newAttri.length; j++) {
        var aaaa = newAttri[j].split(":");
        att.push({ "trait_type": aaaa[0], "value": aaaa[1] });

    }


    // json data formate with corresponding data
    var json007 = {
        "format": "CHIP-0007",
        "name": source.Name,
        "description": source.Description,
        "minting_tool": source["TEAM NAMES"],
        "sensitive_content": false,
        "series_number": source["Series Number"],
        "series_total": 420,
        "attributes": att,
        "UUID": source.UUID,
        "HASH": "",
        "collection": {
            name: "Zuri NFT Tickets for Free Lunch",
            id: "b774f676-c1d5-422e-beed-00ef5510c64d",
            attributes: [
                {
                    type: "description",
                    value: "Rewards for accomplishments during HNGi9."
                }
            ]
        }
    }

    // convert from js object to json object
    const myJSON = JSON.stringify(json007);
    // return json object
    return myJSON;


}
