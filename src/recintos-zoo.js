class RecintosZoo {
    analisaRecintos(animal, quantidade) {
        // Lista de animais e suas características
        const animais = {
            "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
        };

        // Recintos existentes
        const recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: { "MACACO": 3 } },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: {} },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: { "GAZELA": 1 } },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: {} },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: { "LEAO": 1 } }
        ];

        // Verificação inicial: animal válido
        if (!animais.hasOwnProperty(animal)) {
            return { erro: "Animal inválido" };
        }

        // Verificação inicial: quantidade válida
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Dados do animal
        const animalInfo = animais[animal];
        const tamanhoAnimal = animalInfo.tamanho;
        const biomasAceitaveis = animalInfo.biomas;
        const carnivoro = animalInfo.carnivoro;

        const recintosViaveis = [];

        // Percorrer recintos
        recintos.forEach(recinto => {
            let biomaCompativel = biomasAceitaveis.some(bioma => recinto.bioma.includes(bioma)) || 
                (recinto.bioma === "savana e rio" && animal === "HIPOPOTAMO");

            // Verificar compatibilidade de bioma
            if (!biomaCompativel) return;

            const animaisNoRecinto = recinto.animais;
            const especiesNoRecinto = Object.keys(animaisNoRecinto);

            // Regra para carnívoros: não pode dividir recinto com outras espécies
            if (carnivoro && especiesNoRecinto.length > 0 && !especiesNoRecinto.includes(animal)) {
                return;
            }

            // Verificar se já há carnívoros no recinto (não pode misturar macacos com carnívoros)
            const existeCarnivoro = especiesNoRecinto.some(especie => animais[especie].carnivoro);
            if (!carnivoro && existeCarnivoro) {
                return;
            }

            // Regra para hipopótamos: só ficam confortáveis com outras espécies em recintos de savana e rio
            if (animal === "HIPOPOTAMO" && recinto.bioma !== "savana e rio" && especiesNoRecinto.length > 0) {
                return;
            }

            // Regra para macacos: não podem ficar sozinhos
            if (animal === "MACACO" && especiesNoRecinto.length === 0 && quantidade === 1) {
                return;
            }

            // Calcular o espaço ocupado pelos novos animais
            let espacoOcupado = quantidade * tamanhoAnimal;

            // Se já houver mais de uma espécie, adicionar 1 espaço extra
            if (especiesNoRecinto.length > 0 && !especiesNoRecinto.includes(animal)) {
                espacoOcupado += 1;
            }

            // Calcular o espaço já ocupado pelos animais no recinto
            const espacoJaOcupado = especiesNoRecinto.reduce((total, especie) => {
                return total + (animais[especie].tamanho * animaisNoRecinto[especie]);
            }, 0);

            // Verificar se há espaço suficiente
            const espacoDisponivel = recinto.tamanhoTotal - espacoJaOcupado;
            if (espacoDisponivel >= espacoOcupado) {
                const espacoRestante = espacoDisponivel - espacoOcupado;
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`);
            }
        });

        // Retornar o resultado
        if (recintosViaveis.length > 0) {
            return {
                recintosViaveis: recintosViaveis.sort((a, b) => {
                    // Extrair os números dos recintos
                    const numA = parseInt(a.match(/Recinto (\d+)/)[1]);
                    const numB = parseInt(b.match(/Recinto (\d+)/)[1]);
                    return numA - numB;  // Ordenar pelo número do recinto
                })
            };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };