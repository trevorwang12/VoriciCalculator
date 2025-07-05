class VoriciCalculator {
    constructor() {
        this.maxOnColorChance = 0.9;
        this.craftingMethods = [
            { name: "Chromatic Orb", cost: 1, attempts: 1 },
            { name: "Jeweller's Touch (5L)", cost: 200, attempts: 1 },
            { name: "Chromatic Orb x20", cost: 20, attempts: 20 },
            { name: "Chromatic Orb x100", cost: 100, attempts: 100 }
        ];
    }

    getColorChances(str, dex, int) {
        const total = str + dex + int;
        
        if (total === 0) {
            return { red: 1/3, green: 1/3, blue: 1/3 };
        }

        const nonZeroStats = [str, dex, int].filter(stat => stat > 0).length;
        
        let redChance, greenChance, blueChance;
        
        if (nonZeroStats === 1) {
            if (str > 0) {
                redChance = Math.min(this.maxOnColorChance, str / total);
                greenChance = blueChance = (1 - redChance) / 2;
            } else if (dex > 0) {
                greenChance = Math.min(this.maxOnColorChance, dex / total);
                redChance = blueChance = (1 - greenChance) / 2;
            } else {
                blueChance = Math.min(this.maxOnColorChance, int / total);
                redChance = greenChance = (1 - blueChance) / 2;
            }
        } else if (nonZeroStats === 2) {
            const factor = this.maxOnColorChance / total;
            redChance = str * factor;
            greenChance = dex * factor;
            blueChance = int * factor;
            
            const sum = redChance + greenChance + blueChance;
            if (sum < 1) {
                const remaining = 1 - sum;
                if (str === 0) {
                    greenChance += remaining * (dex / (dex + int));
                    blueChance += remaining * (int / (dex + int));
                } else if (dex === 0) {
                    redChance += remaining * (str / (str + int));
                    blueChance += remaining * (int / (str + int));
                } else {
                    redChance += remaining * (str / (str + dex));
                    greenChance += remaining * (dex / (str + dex));
                }
            }
        } else {
            const factor = this.maxOnColorChance / total;
            redChance = str * factor;
            greenChance = dex * factor;
            blueChance = int * factor;
        }

        return { 
            red: Math.max(0, Math.min(1, redChance)), 
            green: Math.max(0, Math.min(1, greenChance)), 
            blue: Math.max(0, Math.min(1, blueChance)) 
        };
    }

    factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    multinomial(n, k1, k2, k3) {
        if (k1 + k2 + k3 !== n) return 0;
        return this.factorial(n) / (this.factorial(k1) * this.factorial(k2) * this.factorial(k3));
    }

    calculateProbability(totalSockets, redWanted, greenWanted, blueWanted, colorChances) {
        const { red: pRed, green: pGreen, blue: pBlue } = colorChances;
        
        if (redWanted + greenWanted + blueWanted > totalSockets) {
            return 0;
        }

        let totalProbability = 0;
        
        for (let r = redWanted; r <= totalSockets - greenWanted - blueWanted; r++) {
            for (let g = greenWanted; g <= totalSockets - r - blueWanted; g++) {
                const b = totalSockets - r - g;
                if (b >= blueWanted) {
                    const coeff = this.multinomial(totalSockets, r, g, b);
                    const prob = Math.pow(pRed, r) * Math.pow(pGreen, g) * Math.pow(pBlue, b);
                    totalProbability += coeff * prob;
                }
            }
        }

        return totalProbability;
    }

    calculateResults(totalSockets, str, dex, int, redWanted, greenWanted, blueWanted) {
        const colorChances = this.getColorChances(str, dex, int);
        const successProbability = this.calculateProbability(totalSockets, redWanted, greenWanted, blueWanted, colorChances);
        
        if (successProbability === 0) {
            return [{
                craftType: "Impossible",
                averageCost: "∞",
                successChance: "0%",
                averageAttempts: "∞",
                costPerTry: "N/A"
            }];
        }

        const results = [];
        
        results.push({
            craftType: "Chromatic Orb",
            averageCost: Math.round(1 / successProbability),
            successChance: (successProbability * 100).toFixed(2) + "%",
            averageAttempts: Math.round(1 / successProbability),
            costPerTry: 1
        });

        if (totalSockets >= 5) {
            results.push({
                craftType: "Jeweller's Touch (5L)",
                averageCost: 200,
                successChance: "100%",
                averageAttempts: 1,
                costPerTry: 200
            });
        }

        const attempts20 = Math.max(1, Math.round(20 * successProbability));
        const prob20 = 1 - Math.pow(1 - successProbability, 20);
        results.push({
            craftType: "20x Chromatic Orbs",
            averageCost: Math.round(20 / prob20),
            successChance: (prob20 * 100).toFixed(2) + "%",
            averageAttempts: Math.round(1 / prob20),
            costPerTry: 20
        });

        const attempts100 = Math.max(1, Math.round(100 * successProbability));
        const prob100 = 1 - Math.pow(1 - successProbability, 100);
        results.push({
            craftType: "100x Chromatic Orbs",
            averageCost: Math.round(100 / prob100),
            successChance: (prob100 * 100).toFixed(2) + "%",
            averageAttempts: Math.round(1 / prob100),
            costPerTry: 100
        });

        return results.sort((a, b) => {
            const costA = typeof a.averageCost === 'number' ? a.averageCost : Infinity;
            const costB = typeof b.averageCost === 'number' ? b.averageCost : Infinity;
            return costA - costB;
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const calculator = new VoriciCalculator();
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');

    function validateInputs() {
        const totalSockets = parseInt(document.getElementById('totalSockets').value);
        const redSockets = parseInt(document.getElementById('redSockets').value);
        const greenSockets = parseInt(document.getElementById('greenSockets').value);
        const blueSockets = parseInt(document.getElementById('blueSockets').value);

        if (totalSockets < 1 || totalSockets > 6) {
            alert('Total sockets must be between 1 and 6');
            return false;
        }

        if (redSockets + greenSockets + blueSockets > totalSockets) {
            alert('Desired socket colors cannot exceed total sockets');
            return false;
        }

        if (redSockets + greenSockets + blueSockets === 0) {
            alert('Please specify at least one desired socket color');
            return false;
        }

        return true;
    }

    function displayResults(results) {
        resultsBody.innerHTML = '';
        
        results.forEach((result, index) => {
            const row = document.createElement('tr');
            if (index === 0 && typeof result.averageCost === 'number') {
                row.classList.add('best-option');
            }
            
            row.innerHTML = `
                <td>${result.craftType}</td>
                <td class="cost-highlight">${result.averageCost}</td>
                <td>${result.successChance}</td>
                <td>${result.averageAttempts}</td>
                <td>${result.costPerTry}</td>
            `;
            
            resultsBody.appendChild(row);
        });
        
        resultsSection.style.display = 'block';
    }

    calculateBtn.addEventListener('click', function() {
        if (!validateInputs()) return;

        const totalSockets = parseInt(document.getElementById('totalSockets').value);
        const str = parseInt(document.getElementById('strReq').value) || 0;
        const dex = parseInt(document.getElementById('dexReq').value) || 0;
        const int = parseInt(document.getElementById('intReq').value) || 0;
        const redSockets = parseInt(document.getElementById('redSockets').value) || 0;
        const greenSockets = parseInt(document.getElementById('greenSockets').value) || 0;
        const blueSockets = parseInt(document.getElementById('blueSockets').value) || 0;

        const results = calculator.calculateResults(
            totalSockets, str, dex, int, 
            redSockets, greenSockets, blueSockets
        );

        displayResults(results);
    });

    document.getElementById('totalSockets').addEventListener('change', function() {
        const totalSockets = parseInt(this.value);
        const socketInputs = ['redSockets', 'greenSockets', 'blueSockets'];
        
        socketInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            input.max = totalSockets;
            if (parseInt(input.value) > totalSockets) {
                input.value = totalSockets;
            }
        });
    });
});