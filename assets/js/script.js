(function(){
    const $ = q => document.querySelector(q);

    function convertPeriodo(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };

    function renderGaragem () {
        const garagem = getGaragem();
        $("#garagem").innerHTML = "";
        garagem.forEach(c => addCarroToGaragem(c))
    };

    function addCarroToGaragem (carro) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${carro.modelo}</td>
            <td>${carro.placa}</td>
            <td data-time="${carro.horario}">
                ${new Date(carro.horario)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">X</button>
            </td>
        `;

        $("#garagem").appendChild(row);
    };

    function checkOut(info) {
        let periodo = new Date() - new Date(info[2].dataset.time);
        periodo = convertPeriodo(periodo);

        const placa = info[1].textContent;
        const msg = `O veículo ${info[0].textContent} de placa ${placa} permaneceu ${periodo} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garagem = getGaragem().filter(c => c.placa !== placa);
        localStorage.garagem = JSON.stringify(garagem);
        
        renderGaragem();
    };

    const getGaragem = () => localStorage.garagem ? JSON.parse(localStorage.garagem) : [];

    renderGaragem();
    $("#enviar").addEventListener("click", e => {
        const modelo = $("#modelo").value;
        const placa = $("#placa").value;

        if(!modelo || !placa){
            alert("Os campos são obrigatórios.");
            return;
        }   

        const card = { modelo, placa, horario: new Date() };

        const garagem = getGaragem();
        garagem.push(card);

        localStorage.garagem = JSON.stringify(garagem);

        addCarroToGaragem(card);
        $("#modelo").value = "";
        $("#placa").value = "";
    });

    $("#garagem").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})()