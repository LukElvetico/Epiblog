PROSSIMI PASSI
1) RIVEDI LA LEZIONE DI GIOVEDì 11 SETTEMBRE
2) RIVEDI LA LEZIONE DI GIOVEDì 4 SETTEMBRE
3) QUANDO CLICCI "LOG-OUT" TI DEVE REINDIRIZZARE ALLA HOME COME UTENTE NON LOGGATO E NON RESTARE SU "MY ACCOUNT" O "MY POST" O SIMILI
4) INTEGRA QUINDI QUESTE INDICAZIONI: 
Il motivo per cui il tuo sito continua a funzionare nonostante i campi JWT_SECRET e CLOUDINARY_CLOUD_NAME siano vuoti o non configurati correttamente è che alcune funzionalità dipendono da queste variabili, ma altre no.
5) Google login social lezione del 15/09
6) ripulisci il codice

Ecco una spiegazione più dettagliata di come funziona:

1. JWT_SECRET
Il JWT_SECRET (JSON Web Token Secret) è una stringa di caratteri usata per firmare e verificare i token JWT. Questo segreto garantisce che i token non siano stati alterati.

Come funziona senza?

Creazione del token: Quando un utente accede, il server crea un token JWT. Se il JWT_SECRET non è impostato, la libreria usata per creare i token potrebbe usare un valore di fallback, una stringa vuota o generare un errore. Poiché il tuo sito funziona, significa che in qualche modo il token viene creato e firmato, probabilmente con un valore non sicuro o con una stringa vuota.

Verifica del token: La verifica dei token avviene tramite il middleware di autenticazione, come authentication.js. Anche in questo caso, la libreria userà lo stesso "segreto" (seppur vuoto) per verificare il token. La verifica avrà successo perché il token è stato firmato con lo stesso valore non sicuro.

Perché è un problema?
Avere un JWT_SECRET vuoto o non sicuro rende il tuo sistema di autenticazione estremamente vulnerabile. Chiunque può facilmente decifrare o falsificare i token, permettendo l'accesso non autorizzato a rotte protette come /my-posts, /posts e my-posts e /posts/:id. Devi assolutamente impostare una password forte e complessa.

2. CLOUDINARY_CLOUD_NAME
Cloudinary è un servizio per la gestione e l'ottimizzazione delle immagini. Il tuo CLOUDINARY_CLOUD_NAME è semplicemente il nome del tuo account. I segreti di autenticazione per le chiamate API, invece, sono l'API Key e l'API Secret.

Come funziona senza?
Se la tua app non sta caricando immagini su Cloudinary (ad esempio, se la funzione di caricamento non è ancora implementata o è disabilitata), il programma non farà mai la richiesta al servizio, quindi l'assenza del CLOUDINARY_CLOUD_NAME e degli altri segreti non causerà errori. In altre parole, l'app sta funzionando perché non usa quella parte del codice.

Perché è un problema?
Se proverai a implementare una funzionalità di caricamento immagini, il tuo sito si bloccherà con un errore di autenticazione.

Riassunto
Il tuo sito funziona perché sta ignorando le variabili mancanti per alcune funzionalità. Nonostante ciò, il tuo sistema è insicuro. Per correggere questi problemi:

Imposta un JWT_SECRET forte e unico.

Imposta un CLOUDINARY_CLOUD_NAME e gli altri segreti (API Key e API Secret) quando implementi il caricamento delle immagini.


# Epi Zafferano Frontend

## Avvio

-   installare le dipendenze:

    ```
    npm i
    ```

-   copiare il file .env in .env.local e inserire i valori necessari:

    ```
    cp .env .env.local
    ```

    oppure copiarlo e rinominarlo manualmente

-   avviare il server di sviluppo:
    ```
    npm run dev
    ```
