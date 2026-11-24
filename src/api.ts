// Dag 7, del 2: Skriv egna async-funktioner. Gör testerna gröna på tests.html.
// Alla funktioner ska vara async och använda await. Använd INTE .then().
import { hamtaMenyFranServer, hamtaRattFranServer } from "./fordrojning";
import type { Ratt, Tillstand } from "./typer";

// 1. Hämta hela menyn (använd hamtaMenyFranServer med 10 ms). Returnerar menyn.
export async function hamtaMeny(): Promise<Ratt[]> {
  const meny = await hamtaMenyFranServer(10);
  return meny;
}

// 2. Hämta namnet på en rätt (hamtaRattFranServer(id, 10)). Okänt id: låt felet följa med (fånga det inte).
export async function hamtaRattNamn(id: number): Promise<string> {
  const ratt = await hamtaRattFranServer(id, 10);
  return ratt.namn;
}

// 3. Som 2, men om något går fel returnerar funktionen null istället för att kasta fel (try/catch).
export async function hamtaRattEllerNull(id: number): Promise<Ratt | null> {
  try {
    const ratt = await hamtaRattFranServer(id, 10);
    return ratt;
  } catch {
    return null;
  }
}

// 4. Hämta två rätter EFTER varandra (await, sedan await). Returnerar [ratt1, ratt2]. ms är väntetiden per anrop.
export async function hamtaTvaRatterEfterVarandra(id1: number, id2: number, ms: number = 100): Promise<Ratt[]> {
  const ratt1 = await hamtaRattFranServer(id1, ms);
  const ratt2 = await hamtaRattFranServer(id2, ms);
  return [ratt1, ratt2];
}

// 5. Samma sak, men båda ANROPEN startas samtidigt (Promise.all). Ska gå dubbelt så snabbt.
export async function hamtaTvaRatterParallellt(id1: number, id2: number, ms: number = 100): Promise<Ratt[]> {
  const [ratt1, ratt2] = await Promise.all([hamtaRattFranServer(id1, ms), hamtaRattFranServer(id2, ms)]);
  return [ratt1, ratt2];
}

// 6. Försök upp till maxForsok gånger. anropFn är en funktion som returnerar en promise.
//    Lyckas något försök: returnera resultatet. Misslyckas alla: kasta det SISTA felet.
//    Tips: en for-loop med try/catch inuti, och spara det senaste felet i en variabel.
export async function hamtaMedForsok<T>(anropFn: () => Promise<T>, maxForsok: number): Promise<T> {
  let senasteFel;
  for (let i = 0; i < maxForsok; i++) {
    try {
      return await anropFn();
    } catch (fel) {
      senasteFel = fel;
    }
  }
  throw senasteFel;
}

// 7. Ge en promise en tidsgräns. Är den inte klar inom ms millisekunder: avvisa med
//    new Error("Tidsgränsen överskreds"). Tips: Promise.race med en promise som avvisas efter ms.
export function medTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const tidsgrans = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error("Tidsgränsen överskreds")), ms);
  });
  return Promise.race([promise, tidsgrans]);
}

// 8. Tillståndsmaskinen för att ladda något: laddar -> klar / tomt / fel.
//    hamtaFn returnerar en promise med en lista. vidTillstand anropas med ett objekt:
//      { typ: "laddar" }                       först av allt
//      { typ: "klar", ratter: [...] }          om listan har innehåll
//      { typ: "tomt" }                         om listan är tom
//      { typ: "fel", meddelande: "..." }       om hamtaFn misslyckas (felets message)
export async function laddaMeny(hamtaFn: () => Promise<Ratt[]>, vidTillstand: (tillstand: Tillstand) => void): Promise<void> {
  console.log("Tillståndsmaskin: laddar");
  vidTillstand({typ: "laddar"});

  try {
    const ratter = await hamtaFn();

    if (ratter.length > 0) {
      console.log("Tillståndsmaskin: klar");
      vidTillstand({typ: "klar", ratter: ratter});
    } else {
      console.log("Tillståndsmaskin: tomt");
      vidTillstand({typ: "tomt"});
    }
  } catch (fel) {
    console.log("Tillståndsmaskin: fel");
    vidTillstand({typ: "fel", meddelande: fel instanceof Error ? fel.message : String(fel)});
  }
}
