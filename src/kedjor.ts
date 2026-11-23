// Dag 7, del 1: Skriv om från then-kedjor till async/await.
// De här funktionerna fungerar redan, men använder .then(). Skriv om VARJE funktion till
// en async function med await (och try/catch där det behövs). Beteendet ska bli exakt
// detsamma, så testerna ska fortsätta vara gröna. Testerna kontrollerar också att
// funktionerna är async.
import { hamtaRattFranServer } from "./fordrojning";
import { formateraPris } from "./pris";

/* export function hamtaRattPris(id: number): Promise<number> {
  return hamtaRattFranServer(id, 10).then((ratt) => ratt.pris);
} */

export async function hamtaRattPris(id: number): Promise<number> {
  const ratt = await hamtaRattFranServer(id, 10);
  return ratt.pris;
}

/* export function hamtaRattPrisEllerNoll(id: number): Promise<number> {
  return hamtaRattFranServer(id, 10)
    .then((ratt) => ratt.pris)
    .catch(() => 0);
} */

export async function hamtaRattPrisEllerNoll(id: number): Promise<number> {
  try {
    const ratt = await hamtaRattFranServer(id, 10);
    return ratt.pris;
  } catch {
    return 0;
  }
}

/* export function hamtaOchFormatera(id: number): Promise<string> {
  return hamtaRattFranServer(id, 10).then((ratt) => `${ratt.namn}: ${formateraPris(ratt.pris)}`);
} */

  export async function hamtaOchFormatera(id: number): Promise<string> {
    const ratt = await hamtaRattFranServer(id, 10);
    return `${ratt.namn}: ${formateraPris(ratt.pris)}`;
  }

/* export function hamtaTvaPriser(id1: number, id2: number): Promise<number> {
  return hamtaRattFranServer(id1, 10).then((ratt1) =>
    hamtaRattFranServer(id2, 10).then((ratt2) => ratt1.pris + ratt2.pris)
  );
} */

  export async function hamtaTvaPriser(id1: number, id2: number): Promise<number> {
    const ratt1 = await hamtaRattFranServer(id1, 10);
    const ratt2 = await hamtaRattFranServer(id2, 10);
    return ratt1.pris + ratt2.pris;
  }
