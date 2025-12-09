async function testLanguages(showMissing = true){
    const categories = [ 
        "animals", "food-drinks", "clothing", "body-parts", "household", 
        "nature", "travel", "technology", "abstract", "verbs" 
    ];
    
    console.log(await testLanguage("en", categories, showMissing));
    console.log(await testLanguage("es", categories, showMissing));
    console.log(await testLanguage("jp", categories, showMissing));
    console.log(await testLanguage("it", categories, showMissing));
    // console.log(await testLanguage("de", categories, showMissing));
}


async function testLanguage(language, categories, showMissing){
    let summary = `---> Testing ${language} <---\n`;

    for (const categoryId of categories){
        const result = await tryFindMissingWords(categoryId, language);

        switch (result.state){
            case OutputState.SUCCESS:
                summary += `${categoryId}: \x1b[32mTEST SUCCESSFULL [${result.found}/${result.total}]\x1b[0m`;
                break;
            case OutputState.MISSING:
                summary += `${categoryId}: \x1b[33mTEST FAILED [${result.found}/${result.total}]\x1b[0m`;
                if (showMissing && result.missing.length > 0) {
                    summary += ` | Missing: ${result.missing.join(", ")}`;
                }
                break;
            case OutputState.SETUP_FAILURE:
                summary += `${categoryId}: \x1b[31mTEST FAILED [Setup Failure]\x1b[0m`;
            break;
            case OutputState.UNEXPECTED_FAILURE:
                summary += `${categoryId}: \x1b[31mTEST FAILED [Unexpected Failure]\x1b[0m`;
                break;
        }

        summary += '\n';
    }

    return summary;
}


async function tryFindMissingWords(categoryId, language){
    try {
        // Load both JSONs
        const [catResponse, langResponse] = await Promise.all([
            fetch("./assets/data/categories.json"),
            fetch(`./assets/data/lang/${language}.json`)
        ]);

        if (!catResponse.ok){
            return output(OutputState.SETUP_FAILURE, 0, 0, [] ,
                `[category ${categoryId}] HTTP error! status ${catResponse.status}`
            );
        }

        if (!langResponse.ok){
            return output(OutputState.SETUP_FAILURE, 0, 0, [] ,
                `[language ${language}] HTTP error! status ${langResponse.status}`
            );
        }

        const categoriesJson = await catResponse.json();
        const langJson = await langResponse.json();

        // Find category
        const targetCat = tryFind(categoriesJson.categories, c => c.id === categoryId);
        if (!targetCat) {
            return output(OutputState.SETUP_FAILURE, 0, 0, [] ,
                `Category '${categoryId}' not found.`
            );
        }

        // Language words dictionary
        const translations = langJson.translations;
        let total = 0;
        let missing = [];

        // Loop through Levels
        targetCat.levels.forEach(levelObj => {
            const levelKey = Object.keys(levelObj)[0];
            const wordIds = levelObj[levelKey];
            
            total += wordIds.length;

            wordIds.forEach(id => {
                if (!(id in translations)) {
                    missing.push(id);
                }
            });
        });

        const found = total - missing.length;

        const missingWords = missing.length > 0;
        return output(missingWords ? OutputState.MISSING : OutputState.SUCCESS,
            total, found, missing, missingWords ? `${missing.length} missing words` : "All words found"
        );
    } catch (err) {
        return output(OutputState.UNEXPECTED_FAILURE, 0, 0, [], `${err.message}`);
    }
    
}   

function output(state, total, found, missing, message){
    return { state, total, found, missing, message }
}

function tryFind(array, predicate){
    const result = array.find(predicate);
    return result === undefined ? null : result;
}

const OutputState = Object.freeze({
    SUCCESS: 0,
    MISSING: 1,
    SETUP_FAILURE: 2,
    UNEXPECTED_FAILURE: 3
})