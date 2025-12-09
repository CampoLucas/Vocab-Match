async function tryFindMissingWords(categoryId, language){
    try {
        // Load both JSONs
        const catResponse = await fetch("./assets/data/categories.json");
        if (!catResponse.ok){
            return `Test Failed: [category ${categoryId}] HTTP error! status ${catResponse.status}`;
        }

        const langResponse = await fetch(`./assets/data/lang/${language}.json`);
        if (!langResponse.ok){
            rreturn `Test Failed: [language ${language}] HTTP error! status ${langResponse.status}`;
        }

        const categoriesJson = await catResponse.json();
        const langJson = await langResponse.json();

        // Find category
        const targetCat = tryFind(categoriesJson.categories, c => c.id === categoryId);
        if (!targetCat) {
            return `Test Failed: Category '${categoryId}' not found.`;
        }

        // Language words dictionary
        const translationsDict = langJson.translations;

        let report = `Checking category '${categoryId}' in language '${language}'...\n`;

        // Loop through Levels
        targetCat.levels.forEach((levelObj, i) => {
            const levelName = `level${i + 1}`;
            const words = levelObj[levelName];
            
            report += `\n ${levelName}:\n`;

            words.forEach(wordId => {
                if (!(wordId in translationsDict)) {
                report += `Missing: ${wordId}\n`;
                } else {
                    report += `Found: ${wordId}\n`;
                }
            });
        });

        return report;
    } catch (err) {
        return `Test Failed: Unexpected error -> ${err}`;
    }
    
}   


function tryFind(array, predicate){
    const result = array.find(predicate);
    return result === undefined ? null : result;
}