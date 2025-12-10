fetch('./assets/data/en.json')
    .then(res => {
        if (!res.ok) {
            throw new Error(`Listen! HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
        
        const output = document.getElementById("json-output");
        output.innerHTML = `
            <h3>Loaded JSON Words:</h3>
            <ul>
                ${data.words.map(w => `<li>${w}</li>`).join("")}
            </ul>
        `;
    })
    .catch(error => {
        console.error('Listen! Error fetching or parsing JSON:', error);
        document.getElementById("json-output").textContent = "Failed to load JSON";
    });

//const str = JSON.parse(url(`/assets/data/en.json`));