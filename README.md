# Dag 7 · async och await

*Modul 5, UI/UX & Frontendutveckling (TypeScript), Lexicon IT-Proffs*

## Vad du ska göra idag

Du skriver **asynkron kod** som ser ut som vanlig kod med `async` och `await`. Du hanterar fel med `try/catch`, kör anrop parallellt med `Promise.all`, provar igen när något misslyckas och bygger funktionen `laddaMeny` som ger tillstånden *laddar*, *klar*, *tomt* och *fel*.

## Bakgrund

Igår läste du asynkron kod. Idag skriver du den. `async` och `await` är bara ett trevligare sätt att skriva promises: koden läses uppifrån och ned, och fel hanteras med samma `try/catch` som du redan känner till. Du får en låtsasserver (`src/fordrojning.ts`) som svarar efter en liten väntan, så att du kan öva utan riktiga nätanrop. Imorgon byter vi ut den mot riktiga anrop med `fetch`.

## TypeScript idag: Promise<T>, generics och tillstånd som unioner

- **`Promise<number>`**: en async-funktion returnerar alltid en promise. Typen säger vad du får när den är klar: `async function hamtaRattPris(id: number): Promise<number>`.
- **Generics (`<T>`)**: `hamtaMedForsok<T>(anropFn: () => Promise<T>, maxForsok: number): Promise<T>` fungerar för vilken typ som helst. `T` blir det som anropet ger tillbaka. Du behöver inte skriva `T` själv när du anropar den.
- **`catch (fel)`** ger `unknown` i TypeScript, inte `any`. Kontrollera innan du använder det: `fel instanceof Error ? fel.message : String(fel)`.
- **Tillstånd som union** (`Tillstand` i `src/typer.ts`):

```ts
type Tillstand =
  | { typ: "laddar" }
  | { typ: "tomt" }
  | { typ: "klar"; ratter: Ratt[] }
  | { typ: "fel"; meddelande: string };
```

När du har kollat `if (t.typ === "klar")` vet TypeScript att `t.ratter` finns. I `"laddar"` finns inte `ratter`, och försöker du läsa den får du ett fel direkt. I JavaScript får du `undefined` först när sidan körs.

## Så arbetar du (samma som alltid)

1. **Forka** dagens repo på GitHub (*Fork → Create fork*).
2. **Klona din fork:** *Code → HTTPS → kopiera adressen*. I terminalen (Ctrl+ö i VS Code): `git clone <adressen>`. Öppna den nya mappen i VS Code.
3. **Installera verktygen, en gång per repo:** `npm install` i terminalen.
4. **Starta servern:** `npm run dev`. Öppna adressen den skriver ut (oftast `http://localhost:5173/`). Tryck F12 och välj fliken *Console*. Stoppa med Ctrl+C. Testsidan öppnar du på samma server: `http://localhost:5173/tests.html` (lägg till `/tests.html` efter adressen).
5. **Gör uppgiften.** Spara och kontrollera i webbläsaren och Console efter varje steg. Gör en commit efter varje avslutat steg: `git add .` och `git commit -m "Beskriv vad du gjorde"`.
6. **Kontrollera typerna:** `npm run typecheck`. Tyst betyder att alla typer stämmer. Röda understrykningar i VS Code är TypeScript som varnar.
7. **Skicka upp** när du är klar: `git push`.
8. **Lämna in i Microsoft Forms.**

Fastnar du: skriv ner exakt var och vad du försökt (och vilket felmeddelande du fick), och ta det först i nästa handledda pass. Problem med `npm` eller Node? Läs *Elevguide: Node, Vite och TypeScript*.

> Vite tar bara bort typerna och kör koden. Den kontrollerar dem inte. Sidan kan alltså köras trots röda understrykningar.

## Uppgiften steg för steg

### Steg 1. Klona, öppna och kör testerna

Forka repot, kör `git clone`, öppna mappen i VS Code och starta Vite-servern på `tests.html` (modulerna kräver Vite-servern). Alla tester är röda utom några. Testerna är asynkrona, så resultatet kommer efter någon sekund. Öppna `src/fordrojning.ts` och läs den, men ändra den inte.

### Steg 2. Del 1: skriv om kedjorna i kedjor.js

Fyra funktioner använder `.then()`. Skriv om var och en till en `async function` med `await`. Beteendet ska vara exakt detsamma. Gör en funktion i taget och kör testerna efter varje. Commit när alla fyra är gröna.

### Steg 3. Del 2: hamtaMeny, hamtaRattNamn och hamtaRattEllerNull

Öppna `src/api.ts`. Skriv de tre första funktionerna. Den första väntar på menyn. Den andra låter felet följa med. Den tredje fångar felet med `try/catch` och returnerar `null`. Skillnaden mellan två och tre är dagens viktigaste poäng: vem ska hantera felet?

### Steg 4. Efter varandra eller samtidigt

Skriv `hamtaTvaRatterEfterVarandra` med två `await` i rad, och `hamtaTvaRatterParallellt` med `Promise.all`. Två tester mäter tiden. Skriv i `docs/async-anteckningar.md` (eller i en kommentar) varför den parallella är snabbare.

**Kommentar:** Två await i rad leder till att det andra anropet startar först när det första är klart. Om varje anrop tar 100 ms så blir det totalt 200 ms. Om vi i stället startar anropen samtidigt så får vi den längsta tiden av dem, vilket endast är 100 ms!

### Steg 5. Försök igen och tidsgräns

Skriv `hamtaMedForsok` (en loop med `try/catch` som försöker upp till `maxForsok` gånger) och `medTimeout` (`Promise.race` mellan din promise och en timer som avvisar). Börja med att skriva på papper vad som ska hända vid försök 1, 2 och 3.

### Steg 6. Tillståndsmaskinen laddaMeny

Skriv `laddaMeny(hamtaFn, vidTillstand)`. Först `laddar`, sedan antingen `klar`, `tomt` eller `fel`. Alla fyra tillstånd har varsitt test. Det här mönstret använder du imorgon med riktig data.

### Steg 7. Se det på sidan

Öppna `index.html` med Vite-servern. Tryck på *Ladda menyn*. Prova rutorna *Simulera fel* och *Simulera tom lista*. Öppna Console och DevTools. Ser du de fyra tillstånden? Du behöver inte ändra `src/demo.ts`.

**Kommentar:** Alla tillstånd syns tydligt på sidan men fick inte upp något i console. Jag loggar nu även tillståndet i console och de syns tydligt vid simuleringen.

### Steg 8. Fördjupning (frivillig): allSettled

Skriv `hamtaAllaForsiktigt(idLista)` som hämtar många rätter parallellt med `Promise.allSettled` och returnerar `{ lyckade, misslyckade }`. Skriv egna tester i en ny fil `src/extra-tests.ts`.

## Kontrollista: så vet du att du är klar

- [ ] Alla tester på `tests.html` är gröna.
- [ ] Alla fyra funktioner i `src/kedjor.ts` är `async` och saknar `.then()`.
- [ ] Du kan förklara skillnaden på att fånga ett fel i funktionen och att låta det följa med.
- [ ] Du kan förklara varför `Promise.all` är snabbare än två `await` i rad.
- [ ] `index.html` visar alla fyra tillstånden.
- [ ] Du har gjort minst fem commits med beskrivande meddelanden.

## Tips om du fastnar

- Glömmer du `await` får du en *promise* istället för värdet. Det syns som `Promise { <pending> }` i Console.
- `await` fungerar bara inuti en `async function` (och i moduler på toppnivå). Får du ett syntaxfel, titta på funktionens första rad.
- Vill du köra två anrop samtidigt: starta båda först, vänta sedan. `await Promise.all([a(), b()])`.
- `return await` inuti `try` behövs om du vill att `catch` ska fånga felet. Utan `await` slipper felet förbi.
- Testerna körs i modul-läge och kräver Vite-servern. Öppnar du filen direkt (`file://`) blockeras modulerna.
- Fastnar du: skriv `console.log` före och efter varje `await` och se i vilken ordning det kommer.

## Inlämning

**Deadline: imorgon klockan 09.00.** Allt lämnas in i Microsoft Forms. Du behöver inte redovisa något muntligt.

I formuläret fyller du i:

1. Länk till din fork av det här repot.
2. Reflektion: Vad är skillnaden mellan att fånga ett fel i funktionen (`hamtaRattEllerNull`) och att låta det följa med (`hamtaRattNamn`)? När är respektive sätt rätt? Vad betyder `Promise<T>`, och varför är `fel` i `catch` av typen `unknown`?

## Vill du mer? (frivilligt)

- Skriv `medTimeoutOchForsok` som kombinerar `hamtaMedForsok` och `medTimeout`.
- Lägg till en fördröjning mellan försöken i `hamtaMedForsok` (vänta 200 ms, sedan 400 ms: *exponentiell backoff*).
- Skriv en `AbortController`-version av `medTimeout` som faktiskt avbryter anropet (vi ser det på dag 10).
