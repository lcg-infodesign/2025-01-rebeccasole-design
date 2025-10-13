//Given the CSV file "dataset.csv"
 //in the project's "libraries" folder:
 //
 // column, numbers
 // 0,numbers
 // 1,numbers
 // 2,numbers
 // 3,numbers
 // 4,numbers

let table;
let validRows = [];
let filtratedMean1 = 0; //per memorizzare la media
let filtratedMean2 = 0; //per memorizzare la media
let filtratedMedian = 0; //per memorizzare la mediana
let filtratedMode = 0; //per memorizzare la moda
let standardDeviation = 0; //per memorizzare la deviazione standard
let standardDeviation1 = 0; //per memorizzare la deviazione standard

let stars = []; //array delle stelle
let numStars;

//per collegare il dataset
function preload() {
  table = loadTable("dataset.csv", "csv", "header");
}

//SETUP INIZIALE
function setup() {
  createCanvas(windowWidth, 3200);
  textSize(12);
  textFont("monospace");
  fill(255);
   frameRate(10); //10 fps invece di 60, per rendere l'animazione più lenta

  //GRADIENTE BLU E STELLE
  drawBackgroundWithStars();


  //elabora il dataset e trova le righe filtrate
  datasetcor();

  //calcola la media della colonna 0 solo per le righe filtrate
  filtratedMean1 = calculateMean1(); 
  //calcola la media della colonna 4 solo per le righe filtrate
  filtratedMean2 = calculateMean2();
  //calcola tutte le mode della colonna 2 solo per le righe filtrate
  filtratedMode = calculateModes();
  //calcola la mediana della colonna 3 solo per le righe filtrate
  filtratedMedian = calculateMedian();
  //calcola la deviazione standard della colonna 1 solo per le righe filtrate
  standardDeviation = calculateStandardDeviation();
  //calcola la deviazione standard della colonna 4 solo per le righe filtrate
  standardDeviation1 = calculateStandardDeviation1();

  //mostra i dati filtrati e le statistiche calcolate
  displayStats();
  drawModesAsPlanets();
  drawMeteorComparison();
  drawMedianAsFallingStar();
  drawStdAsConstellations();
}

function draw() {
  drawBackgroundWithStars(); //ridisegna lo sfondo con le stelle
  drawModesAsPlanets(); //pianeti
  drawMeteorComparison(); //meteore
  drawMedianAsFallingStar(); //stella cadente
  drawStdAsConstellations(); //costellazioni
  displaySceneTitle(); //titolo in alto
  displayDataAndLegend(); //box dati + legenda affiancati in fondo
}

function drawBackgroundWithStars() {
  //gradiente verticale blu
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(10, 10, 80), color(50, 150, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }

  //creazione stelle
  numStars = int(random(50, 150));
  for (let i = 0; i < numStars; i++) {
    let s = {
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(180, 255)
    };
    stars.push(s);
    fill(255, 255, s.brightness); //tonalità di giallo
    noStroke();
    circle(s.x, s.y, s.size);
  }
}

function displayStats() {
  fill(255); //testo bianco sopra il cielo
  text(validRows.length + " righe filtrate:", 10, 20);

  let yText = 40;
  for (let i = 0; i < validRows.length && yText < height - 40; i++) {
    text(validRows[i].join(", "), 10, yText);
    yText += 15;
  }

  /*statistiche calcolate
  text("Media di column0 (righe filtrate):" + nf(filtratedMean1, 1, 2), 10, yText + 20);
  text("Media di column4 (righe filtrate): " + nf(filtratedMean2, 1, 2), 10, yText + 40);
  text("Moda di column2 (righe filtrate):" + filtratedMode.join(", "), 10, yText + 60);
  text("Mediana di column3 (righe filtrate) " + filtratedMedian.join(", "), 10, yText + 80);
  text("Deviazione standard di column1 (righe filtrate)" + nf(standardDeviation, 1, 2), 10, yText + 100);
  text("Deviazione standard di column4 (righe filtrate): " + nf(standardDeviation1, 1, 2), 10, yText + 120);
  */
}

function datasetcor() {
  validRows = [];  //array per le righe che rispettano entrambe le regole

  //my table is comma separated value "csv"
 //and has a header specifying the columns labels
  for (let r = 0; r < table.getRowCount(); r++) {
    let col0 = float(table.getString(r, "column0"));
    let col1 = float(table.getString(r, "column1"));
    let col2 = float(table.getString(r, "column2"));
    let col3 = float(table.getString(r, "column3"));
    let col4 = float(table.getString(r, "column4"));

    //my rules: column0 > 0 and column3 multiple of 3
    //find the rows containing column0 > 0 AND column3 multiple of 3
    if (col0 > 0 && col3 % 3 === 0) {
      validRows.push([col0, col1, col2, col3, col4]);
    }
  }

  print(validRows.length + " righe trovate che rispettano entrambe le regole:");
  for (let i = 0; i < validRows.length; i++) {
    print(validRows[i]);
  }
}

//FUNZIONE CHE CALCOLA LA MEDIA DI column0
function calculateMean1() {
  let somma = 0; //variabile per sommare tutti i valori numerici della colonna
  let count = 0; //variabile per contare quanti valori numerici ci sono

  //ciclo su tutte le righe filtrate
  for (let i = 0; i < validRows.length; i++) {
    //prendo il valore della colonna 0 (indice 0) della riga corrente
    let v = validRows[i][0]; 
    //controllo se il valore è un numero valido
    if (!isNaN(v)) {
      //se è valido, lo sommo alla somma totale
      somma += v;
      //incremento il contatore dei valori validi
      count++;
    }
  }

  //se non ci sono valori validi, restituisco NaN per evitare divisione per zero
  if (count === 0) return NaN; 
  //restituisco la media: somma dei valori divisa per il numero di valori validi
  return somma / count;
}

//FUNZIONE CHE CALCOLA LA MEDIA DI column4
function calculateMean2(){
  let somma = 0;
  let count = 0;

  for (let i = 0; i < validRows.length; i++) {
    let v = validRows[i][4]; //colonna 4 delle righe filtrate
    if (!isNaN(v)) {
      somma += v;
      count++;
    }
  }

  if (count === 0) return NaN; //evita divisione per 0
  return somma / count;
}

//FUNZIONE CHE CALCOLA TUTTE LE MODE
function calculateModes() {
  let counts = {}; //per contare le occorrenze
  let modes = [];  //array per le mode finali

  //conta quante volte compare ciascun valore
  for (let r = 0; r < validRows.length; r++) {
    let value = validRows[r][2]; //colonna 2 delle righe filtrate
    let num = float(value);

    //ignora valori non numerici
    if (!isNaN(num)) {
      if (counts[num] === undefined) {
        counts[num] = 1;
      } else {
        counts[num]++;
      }
    }
  }

  //trova il numero massimo di occorrenze
  let maxCount = 0;
  for (let val in counts) {
    if (counts[val] > maxCount) maxCount = counts[val];
  }

  //raccogli tutti i valori che hanno quella frequenza
  for (let val in counts) {
    if (counts[val] === maxCount) modes.push(float(val));
  }

  return modes; //restituisce un array
}

//FUNZIONE CHE CALCOLA LA MEDIANA DI column3
function calculateMedian(){
  let valori = [];

  //estrai colonna 3 dalle righe filtrate
  for (let i = 0; i < validRows.length; i++) {
    let v = validRows[i][3];
    if (!isNaN(v)) valori.push(v);
  }

  if (valori.length === 0) return [];

  //ordina i valori
  valori.sort((a, b) => a - b);

  let metà = valori.length / 2;

  if (valori.length % 2 === 0) {
    //numero pari: restituisci i due centrali
    return [valori[metà - 1], valori[metà]];
  } else {
    //numero dispari: restituisci l’unico centrale
    return [valori[Math.floor(metà)]];
  }
}

//FUNZIONE CHE CALCOLA LA DEVIAZIONE STANDARD DI column1
function calculateStandardDeviation() {
  let valori = validRows.map(row => row[1]); //estrae i valori dalla colonna 1
  let media = valori.reduce((acc, val) => acc + val, 0) / valori.length;
  let sommaQuadrati = valori.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
  let varianza = sommaQuadrati / (valori.length - 1); //usa n-1 per il campione
  return Math.sqrt(varianza);
}

//FUNZIONE CHE CALCOLA LA DEVIAZIONE STANDARD DI column4
function calculateStandardDeviation1() {
  let valori = validRows.map(row => row[4]); 
  let media = valori.reduce((acc, val) => acc + val, 0) / valori.length;
  let sommaQuadrati = valori.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
  let varianza = sommaQuadrati / (valori.length - 1);
  return Math.sqrt(varianza);
}

function drawModesAsPlanets() {
  textAlign(CENTER, CENTER);
  textFont("monospace");
  textSize(24);

  //titolo
  fill(255);
  text("Modes column2:", width / 2, 250);

  //coordinate di partenza per disegnare i pianeti
  let centerY = 450;
  let startX = width / 2 - (filtratedMode.length * 250) / 2;

  for (let i = 0; i < filtratedMode.length; i++) {
    let value = filtratedMode[i];
    let x = startX + i * 250;
    let y = centerY;

    //mappa i valori per avere diametri proporzionali ma visivamente bilanciati
    //(adatta i range min/max in base ai dati reali)
    let size = map(value, 10, 80, 80, 250);

    //pianeti
    if (value === 73) drawSun(x, y, size, value);
    else if (value === 36) drawMars(x, y, size, value);
    else if (value === 11) drawJupiter(x, y, size, value);
    else drawGenericPlanet(x, y, size, value);
  }
}

function drawSun(x, y, size, value) {
  push();
  noStroke();
  let rays = 20;
  let pulse = sin(frameCount * 0.05) * 10;
  let col = color(255, 220, 70);

  //raggi
  for (let i = 0; i < rays; i++) {
    let angle = TWO_PI / rays * i;
    let rayLen = size / 1.5 + pulse;
    let x1 = x + cos(angle) * (size / 2);
    let y1 = y + sin(angle) * (size / 2);
    let x2 = x + cos(angle) * rayLen;
    let y2 = y + sin(angle) * rayLen;
    stroke(255, 220, 100, 120);
    strokeWeight(3);
    line(x1, y1, x2, y2);
  }

  //corpo
  noStroke();
  fill(col);
  ellipse(x, y, size);

  //bagliore
  fill(255, 250, 200, 100);
  ellipse(x, y, size * 0.8);

  //testo sovrapposto
  fill(40, 20, 0); //scuro per contrasto con il giallo
  textStyle(BOLD);
  text(value, x, y);
  pop();
}

function drawMars(x, y, size, value) {
  push();
  noStroke();
  fill(200, 80, 60);
  ellipse(x, y, size);

  //crateri
  fill(130, 50, 40, 130);
  for (let i = 0; i < 8; i++) {
    let cx = x + random(-size / 3, size / 3);
    let cy = y + random(-size / 3, size / 3);
    let cs = random(size / 10, size / 5);
    ellipse(cx, cy, cs, cs * 0.7);
  }

  //testo sovrapposto
  fill(255, 200, 180);
  textStyle(BOLD);
  text(value, x, y);
  pop();
}

function drawJupiter(x, y, size, value) {
  push();
  noFill();

  //anello
  stroke(180, 200, 255, 120);
  strokeWeight(10);
  ellipse(x, y, size * 1.6, size * 0.5);

  //corpo
  noStroke();
  fill(120, 160, 255);
  ellipse(x, y, size);

  //bande orizzontali
  for (let i = -3; i <= 3; i++) {
    fill(100 + i * 10, 140 + i * 10, 255 - i * 10, 100);
    ellipse(x, y + i * size * 0.1, size, size * 0.2);
  }

  //testo sovrapposto
  fill(255, 255, 255);
  stroke(0, 0, 80, 80);
  strokeWeight(4);
  textStyle(BOLD);
  text(value, x, y);
  pop();
}

function drawMeteorComparison() {
  push();
  textAlign(LEFT, CENTER);
  textFont("monospace");

  //titolo
  fill(255);
  textSize(18);
  text("Comparison of means:", 50, 750);

  let startY = 820;
  let spacing = 120;

  //dati delle due medie
  let medias = [
    { label: "Mean column0", value: filtratedMean1, color: color(255, 200, 100) },
    { label: "Mean column4", value: filtratedMean2, color: color(120, 180, 255) }
  ];

  //trova il valore massimo per normalizzare la lunghezza
  let maxValue = max(medias[0].value, medias[1].value);

  for (let i = 0; i < medias.length; i++) {
    let m = medias[i];
    let y = startY + i * spacing;

    //lunghezza proporzionale alla media
    let length = map(m.value, 0, maxValue, 100, width * 0.6);
    let xStart = 100;
    let xEnd = xStart + length;

    //SCIA (sfumata)
    for (let j = 0; j < 40; j++) {
      let inter = j / 40.0;
      let alpha = map(j, 0, 40, 200, 0);
      stroke(red(m.color), green(m.color), blue(m.color), alpha);
      strokeWeight(map(j, 0, 40, 10, 1));
      line(xStart - j * 3, y + random(-0.5, 0.5), xEnd - j * 3, y + random(-0.5, 0.5));
    }

    //TESTA della meteora
    noStroke();
    fill(m.color);
    ellipse(xEnd, y, 25, 25);

    //bagliore attorno
    fill(red(m.color), green(m.color), blue(m.color), 80);
    ellipse(xEnd, y, 50, 50);

    //etichetta e valore
    textSize(14);
    fill(255);
    text(m.label + ": " + nf(m.value, 1, 2), xEnd + 60, y);
  }
  pop();
}

function drawMedianAsFallingStar() {
  push();
  textAlign(CENTER, CENTER);
  textFont("monospace");
  
  //se la mediana è doppia (numero pari), prendo la media dei due
  let med = 0;
  if (filtratedMedian.length === 2) {
    med = (filtratedMedian[0] + filtratedMedian[1]) / 2;
  } else if (filtratedMedian.length === 1) {
    med = filtratedMedian[0];
  } else {
    return; //niente da disegnare
  }

  //posizione iniziale della stella cadente
  let startX = width * 0.1;
  let startY = 1000; //alto nel canvas
  let endX = width * 0.8;
  let endY = startY + 200; //diagonale verso il basso

  //colore della stella
  let col = color(255, 255, 200);

  // SCIA sfumata
  for (let i = 0; i < 30; i++) {
    let inter = i / 30.0;
    let x = lerp(startX, endX, inter);
    let y = lerp(startY, endY, inter) + random(-2,2);
    stroke(red(col), green(col), blue(col), map(i, 0, 30, 200, 0));
    strokeWeight(map(i, 0, 30, 8, 1));
    point(x, y);
  }

  //TESTA luminosa
  noStroke();
  fill(col);
  ellipse(endX, endY, 20, 20);

  //valore della mediana sopra la stella
  textSize(16);
  fill(255);
  textStyle(BOLD);
  text("Median: " + nf(med, 1, 2), endX, endY - 25);

  pop();
}

function drawStdAsConstellations() {
  push();
  textAlign(CENTER, CENTER);
  textFont("monospace");

  let startX = width * 0.3;
  let startY = 1400;
  let spacing = 500;
  let stds = [standardDeviation, standardDeviation1];
  
  for (let i = 0; i < stds.length; i++) {
    let x = startX + i * spacing;
    let y = startY;
    let nStars = int(map(stds[i], 0, 50, 3, 7)); //numero di punti della costellazione

    let points = [];
    for (let j = 0; j < nStars; j++) {
      let px = x + random(-50, 50);
      let py = y + random(-50, 50);
      points.push({px, py});
      fill(255);
      noStroke();
      ellipse(px, py, 5);
    }

    //collegamento tra punti
    stroke(200, 200, 255, 150);
    strokeWeight(2);
    for (let j = 0; j < points.length-1; j++) {
      line(points[j].px, points[j].py, points[j+1].px, points[j+1].py);
    }

    //valore scritto sopra
    noStroke();
    fill(255);
    textStyle(BOLD);
    text("stand dev: " + nf(stds[i],1,2), x, y - 70);
  }
  pop();
}

function displaySceneTitle() {
  push();
  textFont("monospace");
  textAlign(CENTER, TOP);
  textSize(28);
  fill(255);
  text("First Assignment: Spatial Calculations", width / 2, 30);
  pop();
}

function displayDataAndLegend() {
  push();
  textFont("monospace");
  textSize(12);
  fill(255);

  let boxPadding = 15;
  let lineHeight = 15;

  //BOX SINISTRO: DATI FILTRATI
  let numLinesLeft = validRows.length + 1;
  let boxHeightLeft = numLinesLeft * lineHeight + boxPadding * 2;
  let boxY = max(100, height - boxHeightLeft - 150);
  let boxWidthLeft = width / 2 - 30;

  push();
  fill(0, 0, 0, 150);
  stroke(255);
  strokeWeight(1);
  rect(15, boxY, boxWidthLeft, boxHeightLeft, 10);

  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  text(validRows.length + " filtered rows:", 25, boxY + boxPadding);

  let yText = boxY + boxPadding + lineHeight;
  for (let i = 0; i < validRows.length; i++) {
    text(validRows[i].join(", "), 25, yText);
    yText += lineHeight;
  }
  pop();

  //BOX DESTRO: LEGENDA
  let boxWidthRight = width / 3;
  let maxLegendLines = 10; //massime righe visibili
  let boxHeightRight = maxLegendLines * lineHeight + boxPadding * 2;

  push();
  fill(0, 0, 0, 150);
  stroke(255);
  strokeWeight(1);
  rect(width - boxWidthRight - 15, boxY, boxWidthRight, boxHeightRight, 10);

  noStroke();
  fill(255);
  textAlign(LEFT, TOP);

  let yLegend = boxY + boxPadding;
  let legendLines = [
    "Legend:",
    "☀️  Sun: highest mode value",
    "🔴  Mars: mid-range mode value",
    "🟠  Jupiter: lowest mode value",
    "☄️  Meteorites: comparison between means",
    "🌠  Shooting star: median value",
    "🌌  Constellations: standard deviations"
  ];

  let maxWidth = boxWidthRight - boxPadding * 2;
  let displayedLines = 0;

  for (let line of legendLines) {
    if (displayedLines >= maxLegendLines) break;

    let words = line.split(" ");
    let currentLine = "";
    for (let w of words) {
      let testLine = currentLine + (currentLine === "" ? "" : " ") + w;
      if (textWidth(testLine) > maxWidth) {
        text(currentLine, width - boxWidthRight - 15 + boxPadding, yLegend);
        yLegend += lineHeight;
        displayedLines++;
        if (displayedLines >= maxLegendLines) break;
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    }
    if (displayedLines < maxLegendLines) {
      text(currentLine, width - boxWidthRight - 15 + boxPadding, yLegend);
      yLegend += lineHeight;
      displayedLines++;
    }
  }

  pop();
}



