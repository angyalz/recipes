# Alkalmazás indítása, használata

-  az alkalmazás letöltése (`git clone https://github.com/PROGmasters-Ujratervezes/fsapi-remek-exercise-angyalz.git`) után a `cd api` paranccsal lépjünk be az alkalmazás könyvtárába
-  adjuk ki az `npm i` parancsot a függőségek telepítéséhez
-  `npm run docker:build` paranccsal hozzuk létre a Docker képfájlt
-  ezután az `npm run docker:run` paranccsal indíthatuk a konténerizált alkamazást
-  tesztek futtatása az `npm run test` paranccsal lehetséges
-  az alkalmazás a `http://localhost/`, míg a Swagger felület a `http://localhost/api-doc/` címen érhető el

Ez az alkalmazás a működéséhez mongo Atlas adatbázist használ, míg a tesztek lokális, a konténerben található adatbázison futnak

Egy lehetséges bejelentkezési adat: 
felhasználónév: angyalZ 
jelszó: sok sajttal

# Receptgyűjtemény

A Recepgyűjtemény célja, hogy a felhasználó a feltöltött receptek közt megtalálhassa a számára megfelelőt az összetevőkkel és a pontos leírással, folyamatokkal együtt. Regisztrációt követően a felhasználónak lehetősége nyílik saját receptek feltöltésére, saját receptjeinek külön oldalon történő megjelenítésére.
# Entitások
## Felhasználó
Regisztrációt és bejelentkezést követően recepteket tölthet fel, ezek nélkül csak a feltöltött recepteket tekintheti meg. 
A regisztrált felhasználó saját receptgyűjteménnyel rendelkezik; a saját receptjeinek gyűjteményét külön oldalon tekintheti meg. 
Tároljuk a felhasználó nevét (felhasználónév), jelszavát, email címét, jogosultságát (user / admin), receptjeinek azonosítóját (id).

## Recept
Az adott étel apanyagainak listáját és az ekészítési folyamatokat, illetve az elkészített étel fotóját tartalmazza.
A recept tárolja annak címét, alcímét, összetevőit (mennyiség, mértékegység, alapanyag), az elkészítés lépéseit, az elkészített étel fényképének hivatkozását, és a receptet feltöltő felhasználó azonosítóját (id).
(A recept az összetevők közül a mértékegységnek és az alapanyagnak technikailag csak az id-ját tárolja, azok külön entitást képeznek)
## Alapanyagok
A receptek összeségének alapanyagait tartalmazó lista. (A receptek id alapján hivatkoznak rá.)
## Mértékegységek
A receptekben használt alapanyagok mértékegységeinek listája. (A receptek id alapján hivatkoznak rá.)


# User story lista, feladatok

A felhasználó megtekintheti a feltöltött receptek kártyáit, majd a megtekinteni kívánt recepte kattintva új oldalon a recept megjelenik részletesen is az összetevők és elkészítési folyamatok listájával, a háttérben az étel fotójával.

- Az ételeket megjelenítő felület elkészítése 
- API receptek lekéréséhez a végpont implementálása (GET /recipes)
- A kiválasztott étel receptjét, alapanyagait, folyamatait megjelenítő felület elkészítése 

Regisztráció és bejelentkezés után feltölthet saját recepteket...

- Regisztrációs felület elkészítése 
- API regisztrációs végpont implementálása (POST /user)
- Login felület elkészítése 
- API login végpont implementálása (POST /login)
- JWT autentikáció implementálása szerver és kliens oldalon
- Kliens oldali hozzáférés szabályozása guardokkal
- receptet feltöltésére alkalmas felület elkészítése 
- API recept feltölés végpont implementálása (POST /recipes)
- képfájl feltöltésének szerveroldali kezelése, statikus tárolása, kliensoldali elérésének biztosítása

...illetve megtekintheti azokat egy külön oldalon
- felhasználó saját receptjeinek megjelenítésére szolgáló oldal elkészítése 


# Képernyők

## Receptek
Az elérhető receptek kártyák formájában jelennek meg képpel, címmel, alcímmel. A kártyára kattintva a kiválaszott receptet megjelenítő oldalra jutunk.

## Recept
A kiválasztott recept részletesen egy külön oldalon jelenik meg; itt látható az étel minden összetevője azok mennyiségével, az elkészítés lépései, illetve az étel fotója nagyobb méretben.
## Regisztráció
A felhasználó létrehozhatja a felhasználói fiókját, (user/nick)név, email cím, jelszó megadásával. Sikeres regisztráció esetén a rendszer a felhasználót belépteti, a főképernyőre (receptek) lépteti

## Login
A felhasználó bejelentkezhet felhasználónév és jelszó megadásával. Sikeres bejelentkezést követően a felhasználó a receptek oldalra (főképernyő) jut.

## Recept feltöltés
A regisztrált és bejelentkezett felhasználó ezen az oldalon keresztül töltheti fel a saját receptjét. A recept sikeres mentését követően a felhasználó a receptek oldalra jut, ahol első helyen az aktuálisan feltöltött recept jelenik meg.

## Saját receptek
A felhasználó itt tekintheti meg az általa feltöltött recepteket kártyák formájában, majd a kiválasztott kártyára kattintva megtekintheti azt részletesen is (recept oldal). Csak bejelentkezést követően érhető el.

# API végpontok

- GET /recipes - receptek lekérése
- GET /recipes/:id - kiválasztott recept lekérése
- POST /recipes - recept feltöltése (védett)
- POST /users – felhasználói regisztráció
- GET /users - az összes felhasználó adatainak lekésére (védett)
- GET /users/:id - egy felhasználó adatainak lekérése (védett)
- POST /login – felhasználó bejelentkezés
- POST /logout – felhasználó kilépés
- POST /refresh - felhasználó tokenjének megújítását szolgáló végpont
- GET /ingredients - összetevők listájának lekérése
- GET /units - mértékegységek listájának lekérése
- GET /images/:file - a receptek képeinek elérésére szolgáló végpont
- /api-doc - Swagger elérésére szolgáló végpont (openAPI)

