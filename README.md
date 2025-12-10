# Twoja Strona - Szablon Strony Kancelarii Prawnej

To jest gotowa strona internetowa dla kancelarii prawnej, którą możesz uruchomić na swoim własnym komputerze lub serwerze.

## Co to jest?

Projekt zawiera prostą, profesjonalnie wyglądającą stronę internetową dla kancelarii prawnej "Kowalski & Wspólnicy". Strona jest już gotowa do użycia - wystarczy ją uruchomić.

## Jakie pliki tutaj znajdziesz?

### Główne pliki strony

- **index.html** - To główny plik strony internetowej. Zawiera całą treść, którą widzisz w przeglądarce (nagłówek, opisy usług, formularz kontaktowy, stopkę). To jedyny plik, który musisz edytować, żeby zmienić tekst lub wygląd strony.

### Pliki Docker (przydadzą się w później, gdy będziemy konfigurować serwer)

- **docker-compose.yml** - Plik konfiguracyjny, który mówi Dockerowi jak uruchomić twoją stronę. Określa, że strona będzie dostępna na porcie 81.

- **Dockerfile** - Przepis na "paczkę" z twoją stroną. Mówi Dockerowi co zainstalować i jakie pliki skopiować, żeby strona działała.

- **nginx.conf** - Plik konfiguracyjny serwera nginx (program, który wyświetla strony internetowe). Ustawia port 81 i mówi gdzie znajdują się zdjęcia i dokumenty.

### Foldery

- **zdjecia/** - Tutaj znajdują się wszystkie zdjęcia używane na stronie (tło, zdjęcia zespołu, itp.). Jeśli chcesz zmienić zdjęcie, wrzuć nowe do tego folderu.

- **dokumenty/** - Tutaj trzymasz pliki PDF (np. polityka prywatności, regulamin), do których prowadzą linki w stopce strony.

## Jak to uruchomić?

1. Upewnij się, że masz zainstalowany Docker
2. Otwórz terminal w tym folderze
3. Wpisz: `docker-compose up`
4. Otwórz przeglądarkę i wejdź na: `http://localhost:81`

## Jak edytować stronę?

Po prostu otwórz plik `index.html` w edytorze tekstu i zmień treść. Możesz też poprosić AI (np. ChatGPT lub Claude) o zmiany - wystarczy pokazać plik i powiedzieć co chcesz zmienić.

## Formularz kontaktowy

Strona używa serwisu <https://mail.selfhosting.pl> do obsługi formularza kontaktowego (wiadomości od klientów). To płatna usługa (15 zł/miesiąc), ale dzięki temu możesz odbierać wiadomości bez własnego serwera pocztowego.
