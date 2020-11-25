const data = require('../dataset/csvjson.json');

var edad = 12;
var sexo = "female";
var clase = 1;


function surive(edad, sexo, clase) {

    //Calculo de probabilidades dada la clase

    var clases = data.map(function (cl) {
        return [cl.Pclass, cl.Survived];
    });

    var countClassSurvivor1 = 0;
    var countClassDeath1 = 0;
    var countClassSurvivor2 = 0;
    var countClassDeath2 = 0;
    var countClassSurvivor3 = 0;
    var countClassDeath3 = 0;

    for (var i = 0; i < clases.length; i++) {
        if (clases[i][0] === 3) {
            if (clases[i][1] === 1) {
                countClassSurvivor3++;
            } else {
                countClassDeath3++;
            }
        } else if (clases[i][0] === 2) {
            if (clases[i][1] === 1) {
                countClassSurvivor2++;
            } else {
                countClassDeath2++;
            }
        } else {
            if (clases[i][1] === 1) {
                countClassSurvivor1++;
            } else {
                countClassDeath1++;
            }
        }

    }

    var probClase1 = countClassSurvivor1 / (countClassDeath1 + countClassSurvivor1);
    var probClase2 = countClassSurvivor2 / (countClassDeath2 + countClassSurvivor2);
    var probClase3 = countClassSurvivor3 / (countClassDeath3 + countClassSurvivor3);

    //console.log("Clase 1: " + probClase1);
    //console.log("Clase 2: " + probClase2);
    //console.log("Clase 3: " + probClase3);

    //Calculo de probabilidades dado el sexo

    var countMaleSurvivor = 0;
    var countMaleDeath = 0;
    var countFemaleSurvivor = 0;
    var countFemaleDeath = 0;

    var sexos = data.map(function (cl) {
        return [cl.Sex, cl.Survived];
    });

    for (var i = 0; i < sexos.length; i++) {
        if (sexos[i][0] === "male") {
            if (sexos[i][1] === 1) {
                countMaleSurvivor++;
            } else {
                countMaleDeath++;
            }
        } else {
            if (sexos[i][1] === 1) {
                countFemaleSurvivor++;
            } else {
                countFemaleDeath++;
            }
        }
    }

    var probMale = countMaleSurvivor / (countMaleSurvivor + countMaleDeath);
    var probFemale = countFemaleSurvivor / (countFemaleSurvivor + countFemaleDeath);

    var sobrevivientesT = (countMaleSurvivor + countFemaleSurvivor) / 891;

    //console.log("Male : " + probMale);
    //console.log("Female: " + probFemale);

    //Calculo probabilidades edad
    var rangos = data.map(function (cl) {
        if (cl.Age.split("-")[0] <= 20) {
            return [20, cl.Survived];
        } else if (20 < cl.Age.split("-")[0] && cl.Age.split("-")[0] <= 40) {
            return [40, cl.Survived];
        } else if (40 < cl.Age.split("-")[0]) {
            return [60, cl.Survived];
        }
    });

    var survivorsRange1 = 0;
    var deathRange1 = 0;
    var survivorsRange2 = 0;
    var deathRange2 = 0;
    var survivorsRange3 = 0;
    var deathRange3 = 0;


    for (var i = 0; i < rangos.length; i++) {
        if (rangos[i][0] === 20) {
            if (rangos[i][1] === 1) {
                survivorsRange1++;
            } else {
                deathRange1++;
            }
        } else if (rangos[i][0] === 40) {
            if (rangos[i][1] === 1) {
                survivorsRange2++;
            } else deathRange2++;
        } else {
            if (rangos[i][1] === 1) {
                survivorsRange3++;
            } else {
                deathRange3++;
            }
        }
    }

    var prob20 = survivorsRange1 / (survivorsRange1 + deathRange1);
    var prob40 = survivorsRange2 / (survivorsRange2 + deathRange2);
    var prob60 = survivorsRange3 / (survivorsRange3 + deathRange3);

    //console.log("20 : " + prob20);
    //console.log("40: " + prob40);
    //console.log("60: " + prob60);

    var sobrevivir = Math.ceil(prob40 * probMale * probClase3 * 100);
    var sobrevivir2 = Math.ceil(prob40 * probFemale * probClase1 * 100);

    var personas = data.map(function (cl) {
        return [cl.Sex, cl.Pclass, cl.Age, cl.Survived];
    });

    var porcentaje = 1;
    var porcentajes = [];

    for (var i = 0; i < personas.length; i++) {
        porcentaje = 1;
        if (personas[i][0] === "female") {
            porcentaje *= probFemale;
            if (personas[i][1] === 1) {
                porcentaje *= probClase1;
                if (personas[i][2].split("-") <= 20) {
                    porcentaje *= prob20;
                } else if (personas[i][2].split("-") <= 40) {
                    porcentaje *= prob40;
                } else if (personas[i][2].split("-") <= 60) {
                    porcentaje *= prob60;
                }
            } else if (personas[i][1] === 2) {
                porcentaje *= probClase2;
                if (personas[i][2].split("-") <= 20) {
                    porcentaje *= prob20;
                } else if (personas[i][2].split("-") <= 40) {
                    porcentaje *= prob40;
                } else if (personas[i][2].split("-") <= 60) {
                    porcentaje *= prob60;
                }
            } else if (personas[i][1] === 3) {
                porcentaje *= probClase3;
                if (personas[i][2].split("-") <= 20) {
                    porcentaje *= prob20;
                } else if (personas[i][2].split("-") <= 40) {
                    porcentaje *= prob40;
                } else if (personas[i][2].split("-") <= 60) {
                    porcentaje *= prob60;
                }
            }
        } else {
            porcentaje *= probMale;
            if (personas[i][1] === 1) {
                porcentaje *= probClase1;
                if (personas[i][2].split("-") <= 20) {
                    porcentaje *= prob20;
                } else if (personas[i][2].split("-") <= 40) {
                    porcentaje *= prob40;
                } else if (personas[i][2].split("-") <= 60) {
                    porcentaje *= prob60;
                }
            } else if (personas[i][1] === 2) {
                porcentaje *= probClase2;
                if (personas[i][2].split("-") <= 20) {
                    porcentaje *= prob20;
                } else if (personas[i][2].split("-") <= 40) {
                    porcentaje *= prob40;
                } else if (personas[i][2].split("-") <= 60) {
                    porcentaje *= prob60;
                }
            } else if (personas[i][1] === 3) {
                porcentaje *= probClase3;
                if (personas[i][2].split("-") <= 20) {
                    porcentaje *= prob20;
                } else if (personas[i][2].split("-") <= 40) {
                    porcentaje *= prob40;
                } else if (personas[i][2].split("-") <= 60) {
                    porcentaje *= prob60;
                }
            }
        }
        porcentajes.push([Math.ceil(porcentaje * 100), personas[i][3]]);
    }

    var vivosPorPorc = new Array(100);
    var muertosPorPorc = new Array(100);
    var probabilidades = new Array(100);

    for (var i = 0; i < vivosPorPorc.length; i++) {
        vivosPorPorc[i] = 0;
        muertosPorPorc[i] = 0;
        probabilidades[i] = 0;
    }

    for (var i = 0; i < porcentajes.length; i++) {
        if (porcentajes[i][1] === 1) {
            vivosPorPorc[porcentajes[i][0] - 1]++;
        } else {
            muertosPorPorc[porcentajes[i][0] - 1]++;
        }
    }

    for (var i = 0; i < vivosPorPorc.length; i++) {
        if ((vivosPorPorc[i] + muertosPorPorc[i]) === 0) {
            probabilidades[i] = 0;
        } else {
            probabilidades[i] = Math.ceil((vivosPorPorc[i] / (vivosPorPorc[i] + muertosPorPorc[i])) * 100)
        }

    }

    var sobreviviria = []
    var asertividad = 0;

    for (var i = 0; i < porcentajes.length; i++) {
        if (Math.floor(Math.random() * (101)) < probabilidades[porcentajes[i][0] - 1]) {
            sobreviviria.push([1, porcentajes[i][1]])
        } else {
            sobreviviria.push([0, porcentajes[i][1]])
        }
        if (sobreviviria[i][0] === sobreviviria[i][1]) {
            asertividad++;
        }
    }

    var porcentajeFinal = 1;

    if (sexo === "female") {
        porcentajeFinal *= probFemale;
        if (clase === 1) {
            porcentajeFinal *= probClase1;
            if (edad <= 20) {
                porcentajeFinal *= prob20;
            } else if (edad <= 40) {
                porcentajeFinal *= prob40;
            } else if (edad <= 60) {
                porcentajeFinal *= prob60;
            }
        } else if (clase === 2) {
            porcentajeFinal *= probClase2;
            if (edad <= 20) {
                porcentajeFinal *= prob20;
            } else if (edad <= 40) {
                porcentajeFinal *= prob40;
            } else if (edad <= 60) {
                porcentajeFinal *= prob60;
            }
        } else if (clase === 3) {
            porcentajeFinal *= probClase3;
            if (edad <= 20) {
                porcentajeFinal *= prob20;
            } else if (edad <= 40) {
                porcentajeFinal *= prob40;
            } else if (edad <= 60) {
                porcentajeFinal *= prob60;
            }
        }
    } else {
        porcentajeFinal *= probMale;
        if (clase === 1) {
            porcentajeFinal *= probClase1;
            if (edad <= 20) {
                porcentajeFinal *= prob20;
            } else if (edad <= 40) {
                porcentajeFinal *= prob40;
            } else if (edad <= 60) {
                porcentajeFinal *= prob60;
            }
        } else if (clase === 2) {
            porcentajeFinal *= probClase2;
            if (edad <= 20) {
                porcentajeFinal *= prob20;
            } else if (edad <= 40) {
                porcentajeFinal *= prob40;
            } else if (edad <= 60) {
                porcentajeFinal *= prob60;
            }
        } else if (clase === 3) {
            porcentajeFinal *= probClase3;
            if (edad <= 20) {
                porcentajeFinal *= prob20;
            } else if (edad <= 40) {
                porcentajeFinal *= prob40;
            } else if (edad <= 60) {
                porcentajeFinal *= prob60;
            }
        }
    }
    porcentajeFinal = Math.ceil(porcentajeFinal * 100);

    var viveono = "";
    var i = porcentajeFinal - 1;
    var j = i;
    var correcto = i;
    while (probabilidades[i] === 0 && probabilidades[j] === 0) {
        if (i < 99) {
            i++;
            if (probabilidades[i] != 0) {
                correcto = i;
            }
        }
        if (j > 0) {
            j--;
            if (probabilidades[j] != 0) {
                correcto = j;
            }
        }
    }
    var ran = Math.floor(Math.random() * (51));
    if (ran <= probabilidades[correcto]) {
        viveono = "Sobrevive";
    } else {
        viveono = "No sobrevive";
    }

    return (viveono);
}

    //console.log(surive(edad, sexo, clase));


