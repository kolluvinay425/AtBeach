// @flow

import React from 'react';
import ApplicationComponent from './ApplicationComponent';
import {ScrollView, Switch, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';

import stylesfactory from './Styles/GDPRScreenStyle';
// import LoginActions from "../Redux/LoginRedux";
import {Metrics} from '../Themes/';
import {Colors} from '../Themes/Colors';
import analytics from '@react-native-firebase/analytics';

class GDPRScreen extends ApplicationComponent {
  static propTypes = {
    data: PropTypes.object,
    navigation: PropTypes.object,
    editNotifications: PropTypes.func,
  };

  static defaultProps = {
    data: {},
    navigation: {},
    editNotifications: () => {},
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();

    this.state = {
      ...this.state,
      isActive: false,
    };
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0,
    },
  });

  componentDidMount() {
    super._componentDidMount();
    analytics().logEvent(`Page_${this.props.navigation.state.routeName}`, {});
  }

  render() {
    return this.state.reRender ? null : (
      <View style={this.styles.mainTabContainer}>
        <View style={this.styles.titleContainer}>
          <Text style={this.styles.title}>{I18n.t('gdprtitle')}</Text>
          <Text style={this.styles.contentText}>
            (ai sensi dell’art. 13 del Regolamento (UE) n. 679/2016 GDPR)
          </Text>
        </View>

        <ScrollView style={this.styles.content}>
          <Text style={this.styles.contentText}>Gentile utente,</Text>
          <Text style={this.styles.contentText}>
            Uno degli principali obiettivi di Oreegano srl è la tutela della
            privacy degli utenti, persone sia fisiche, i cui dati la Società
            raccoglie e tratta nel pieno rispetto delle vigenti disposizioni
            dettate dal nuovo regolamento europeo 679/2016 in materia di libera
            protezione dei dati personali, nonché dall’adesione al codice di
            condotta DPMS 44001: 2016 rev. 00 del 25-05-2016 di proprietà
            dell’Uniquality.
          </Text>
          <Text style={this.styles.contentText}>
            Per questo motivo Oreegano srl intende spiegarLe come verranno
            gestite le sue informazioni personali al fine di consentirLe di
            prestare un consenso al trattamento dei dati personali lecito,
            chiaro e consapevole.
          </Text>
          <Text style={this.styles.contentText}>
            I dati personali che fornirà tramite la compilazione e l’invio del
            modulo di contatto, saranno trattati nel rispetto delle disposizioni
            di cui al "Regolamento (UE) 2016/679 del Parlamento europeo e del
            Consiglio, del 27 aprile 2016, relativo alla protezione delle
            persone fisiche con riguardo al trattamento dei dati personali,
            nonché alla libera circolazione di tali dati e che abroga la
            direttiva 95/46/CE (regolamento generale sulla protezione dei
            dati)".
          </Text>
          <Text style={this.styles.contentText}>
            Il titolare del trattamento dei dati personaliOreegano srl, con sede
            in Acquaviva delle fonti alla via via Canonico Domenico Giorgio n.37
            alla quale, Le ricordiamo, potrà rivolgersi in qualsiasi momento e
            senza formalità per esercitare i propri diritti di seguito riportati
            ai sensi dell’art.7 del GDPR 679/2016 Le richieste vanno rivolte:
          </Text>
          <Text style={this.styles.contentText}>
            via e-mail, all'indirizzo: staff@oreegano.com
          </Text>
          <Text style={this.styles.contentTitle}>
            Responsabile Del Trattamento
          </Text>
          <Text style={this.styles.contentText}>
            Il Titolare ha nominato un Responsabile del trattamento dati interno
            in nome della sig.ra Bufano Francesca in quanto autorizzata
            dell’erogazione dei servizi previsti dal contratto con il
            Committente
          </Text>
          <Text style={this.styles.contentTitle}>
            Luogo di trattamento dei dati
          </Text>
          <Text style={this.styles.contentText}>
            I trattamenti connessi ai servizi hanno luogo presso la predetta
            sede del Titolare del trattamento e sono curati solo da personale
            tecnico dell'Ufficio incaricato del trattamento. In caso di
            necessità, i dati connessi al servizio possono essere trattati dal
            personale della società che cura la manutenzione della parte
            tecnologica del sito.
          </Text>
          <Text style={this.styles.contentTitle}>Tipi di dati trattati</Text>
          <Text style={this.styles.contentText}>
            I dati personali trattati saranno esclusivamente quelli da Lei
            forniti all’atto della compilazione e per cercare e condividere
            informazioni, per comunicare con altre persone o per creare nuovi
            contenuti.
          </Text>
          <Text style={this.styles.contentText}>
            Dati forniti volontariamente dall'utente
          </Text>
          <Text style={this.styles.contentText}>
            La trasmissione, la comunicazione e/o l'invio facoltativo, esplicito
            e volontario di registrazione agli indirizzi indicati comporta la
            successiva acquisizione dell'indirizzo del mittente nonché dei dati
            dell’utente necessari per rispondere alle richieste.
          </Text>
          <Text style={this.styles.contentText}>
            Categorie di Interessati: Persone fisiche, persone giuridiche,
            organizzazioni pubbliche e private.
          </Text>
          <Text style={this.styles.contentText}>
            I dati che Lei conferirà per offrire servizi migliori a tutti i
            nostri utenti, ad esempio per capire elementi fondamentali come la
            lingua parlata dall'utente oppure elementi più complessi come quali
            annunci potrebbero essere più utili per l'utente, le persone che
            potrebbero interessare di più all'utente online o quali contenuti di
            Oreegano potrebbero piacere all'utente.
          </Text>
          <Text style={this.styles.contentText}>
            Non verranno registrati altri dati derivanti dalla sua navigazione
            sul sito.
          </Text>
          <Text style={this.styles.contentTitleUnderline}>
            Raccogliamo i dati in due modi:
          </Text>
          <Text style={this.styles.contentText}>
            Dati forniti dall'utente. Ad esempio, molti dei nostri servizi
            richiedono la creazione di un account Oreegano. Durante la creazione
            chiediamo informazioni personali quali nome, indirizzo email, numero
            di telefono o carta di credito. Qualora l'utente desiderasse
            sfruttare appieno le funzioni di condivisione che offriamo, potremmo
            anche chiedere di creare un profilo Oreegano visibile pubblicamente,
            che potrebbe comprendere il suo nome e una foto.
          </Text>
          <Text style={this.styles.contentText}>
            Dati che raccogliamo dall'utilizzo dei nostri servizi da parte
            dell'utente. Raccogliamo informazioni sui servizi utilizzati
            dall'utente e sulla modalità di utilizzo, ad esempio quando viene
            visualizzata una ricetta su Oreegano, viene visitato un sito web su
            cui vengono utilizzati i nostri servizi pubblicitari, oppure quando
            l'utente visualizza e interagisce con i nostri annunci e contenuti.
          </Text>
          <Text style={this.styles.contentTitleUnderline}>
            Periodo conservazione dati personali:
          </Text>
          <Text style={this.styles.contentText}>
            I Suoi dati personali saranno trattati per finalità di profilazione
            esclusivamente per 12 mesi dalla raccolta.
          </Text>
          <Text style={this.styles.contentTitle}>
            Modalita' del trattamento
          </Text>
          <Text style={this.styles.contentText}>
            I dati personali sono trattati con strumenti automatizzati per il
            tempo strettamente necessario a conseguire gli scopi per cui sono
            stati raccolti.
          </Text>
          <Text style={this.styles.contentText}>
            Specifiche misure di sicurezza sono osservate per prevenire la
            perdita dei dati, usi illeciti o non corretti ed accessi non
            autorizzati.
          </Text>
          <Text style={this.styles.contentText}>
            Informazioni sul dispositivo
          </Text>
          <Text style={this.styles.contentText}>
            Raccogliamo informazioni specifiche del dispositivo (ad esempio il
            modello del computer o del dispositivo mobile, versione del sistema
            operativo, identificatori univoci dei dispositivi e informazioni
            sulla rete mobile, compreso il numero di telefono). Oreegano
            potrebbe associare gli identificatori del dispositivo o il numero di
            telefono dell'utente al suo account Oreegano.
          </Text>
          <Text style={this.styles.contentText}>Informazioni sui log</Text>
          <Text style={this.styles.contentText}>
            Durante l'utilizzo da parte dell'utente dei nostri servizi o la
            visualizzazione di contenuti forniti da Oreegano, raccogliamo e
            memorizziamo automaticamente alcune informazioni nei log del server.
            Queste informazioni comprendono:
          </Text>
          <Text style={this.styles.contentText}>
            Dati sulla modalità di utilizzo del nostro servizio, come le query
            di ricerca.
          </Text>
          <Text style={this.styles.contentText}>
            Informazioni sui log relativi alle telefonate, ad esempio numero di
            telefono, numero del chiamante, numeri di deviazione, ora e data
            delle chiamate, durata delle chiamate, informazioni sull’inoltro di
            SMS e tipi di chiamate.
          </Text>
          <Text style={this.styles.contentText}>
            Indirizzo di protocollo Internet.
          </Text>
          <Text style={this.styles.contentText}>
            Informazioni sulla attività del dispositivo quali arresti anomali,
            attività di sistema, impostazioni hardware, tipo di browser e
            lingua, data e ora delle richieste e degli URL di riferimento.
          </Text>
          <Text style={this.styles.contentText}>
            Cookie che potrebbero identificare in modo univoco il browser o
            l’account Oreegano dell’utente.
          </Text>
          <Text style={this.styles.contentText}>Dati sulla posizione</Text>
          <Text style={this.styles.contentText}>
            Quando un utente utilizza servizi Oreegano, potremmo raccogliere ed
            elaborare informazioni sulla sua posizione. Utilizziamo varie
            tecnologie per stabilire la posizione, inclusi indirizzo IP, GPS e
            altri sensori che potrebbero, ad esempio, fornire a Oreegano
            informazioni sui dispositivi, sui punti di accesso Wi-Fi e sui
            ripetitori di segnale dei cellulari nelle vicinanze.
          </Text>
          <Text style={this.styles.contentText}>
            Numeri di applicazione univoci
          </Text>
          <Text style={this.styles.contentText}>
            Alcuni servizi hanno un numero di applicazione univoco. Il numero e
            le informazioni sull’installazione (ad esempio il tipo di sistema
            operativo e il numero di versione dell’applicazione) possono essere
            inviati a Oreegano al momento dell’installazione o della
            disinstallazione del servizio o quando il servizio contatta
            periodicamente i nostri server, ad esempio per gli aggiornamenti
            automatici.
          </Text>
          <Text style={this.styles.contentText}>Conservazione locale</Text>
          <Text style={this.styles.contentText}>
            Potremmo raccogliere e memorizzare informazioni (incluse
            informazioni personali) localmente sul dispositivo utilizzando
            meccanismi quali l'archiviazione web tramite browser (incluso HTML
            5) e cache di dati delle applicazioni.
          </Text>
          <Text style={this.styles.contentText}>
            Cookie e identificatori anonimi
          </Text>
          <Text style={this.styles.contentText}>
            Utilizziamo diverse tecnologie per raccogliere e memorizzare
            informazioni quando viene visitato un servizio di Oreegano, che
            potrebbero prevedere l'invio di uno o più cookie o identificatori
            anonimi al dispositivo dell'utente. Utilizziamo i cookie e gli
            identificatori anonimi anche quando l'utente interagisce con i
            servizi che offriamo ai nostri partner, ad esempio servizi
            pubblicitari o funzioni di Oreegano che potrebbero venire
            visualizzate su altri siti. Il prodotto Google Analytics consente
            alle attività commerciali e ai proprietari di siti di analizzare più
            facilmente il traffico verso i propri siti web e le proprie app.
          </Text>
          <Text style={this.styles.contentText}>
            Google Analytics è un servizio di analisi web fornito da Google Inc.
            (“Google”). Google utilizza i Dati Personali raccolti allo scopo di
            tracciare ed esaminare l’utilizzo di questo Spazio Web, compilare
            report e condividerli con gli altri servizi sviluppati da Google.
            Google potrebbe utilizzare i Dati Personali per contestualizzare e
            personalizzare gli annunci del proprio network pubblicitario. Dati
            personali raccolti: Cookie e Dati di utilizzo.
          </Text>
          <Text style={this.styles.contentText}>
            Modalità di utilizzo dei dati raccolti
          </Text>
          <Text style={this.styles.contentText}>
            Utilizziamo le informazioni raccolte da tutti i nostri servizi per
            offrirli, gestirli, proteggerli e migliorarli, per svilupparne di
            nuovi e per proteggere Oreegano e i suoi utenti. Utilizziamo queste
            informazioni anche per offrire contenuti personalizzati, ad esempio
            per mostrare risultati di ricerca e annunci più pertinenti.
          </Text>
          <Text style={this.styles.contentText}>
            Potremmo utilizzare il nome specificato dall’utente per il suo
            profilo Oreegano in tutti i servizi offerti che richiedono un
            account Oreegano. Qualora altri utenti conoscessero già l’indirizzo
            email di un utente o altre informazioni che lo identificano,
            potremmo mostrare loro le informazioni del profilo Oreegano
            dell’utente visibili pubblicamente, ad esempio nome e foto.
          </Text>
          <Text style={this.styles.contentText}>
            Se l'utente dispone di un account Oreegano, il nome e la foto del
            profilo nonché le operazioni effettuate su Oreegano o su
            applicazioni di terze parti collegate all'account Oreegano (come
            fare “I like”, scrivere recensioni e pubblicare commenti) potranno
            essere visualizzate da Oreegano nei propri servizi, inclusa la
            visualizzazione in annunci e in altri contesti commerciali.
            Rispetteremo le scelte operate dall'utente al fine di limitare le
            impostazioni di condivisione o di visibilità all'interno del proprio
            account Oreegano.
          </Text>
          <Text style={this.styles.contentText}>
            Quando gli utenti contattano Oreegano, Oreegano tiene traccia di
            tali comunicazioni per risolvere eventuali problemi che potrebbero
            sorgere. Potremmo utilizzare l'indirizzo email dell'utente per
            fornire informazioni sui nostri servizi, ad esempio per comunicare
            prossimi cambiamenti o miglioramenti.
          </Text>
          <Text style={this.styles.contentText}>
            Utilizziamo i dati raccolti tramite i cookie e altre tecnologie,
            come i tag di pixel, per migliorare l'esperienza degli utenti e la
            qualità generale dei nostri servizi. Quando visualizziamo annunci
            personalizzati per l'utente, non associamo un cookie o un
            identificatore anonimo a categorie sensibili come quelle relative a
            razza, religione, orientamento sessuale o salute.
          </Text>

          <Text style={this.styles.contentText}>
            I nostri sistemi automatizzati analizzano i contenuti dell'utente
            (incluse le email) al fine di mettere a sua disposizione funzioni di
            prodotto rilevanti a livello personale, come risultati di ricerca
            personalizzati, pubblicità su misura e rilevamento di spam e
            malware.
          </Text>
          <Text style={this.styles.contentText}>
            Potremmo unire le informazioni personali derivanti da un servizio a
            quelle (comprese le informazioni personali) di altri servizi
            Oreegano, ad esempio per semplificare la condivisione di contenuti
            con altri utenti conoscenti. Non combiniamo informazioni sui cookie
            DoubleClick e informazioni personali se l'utente non ci dà il
            consenso.
          </Text>
          <Text style={this.styles.contentText}>
            Richiediamo il consenso dell’utente per utilizzare le informazioni
            per scopi diversi da quelli stabiliti nelle presenti Norme sulla
            privacy.
          </Text>
          <Text style={this.styles.contentText}>
            Oreegano tratta le informazioni personali sui suoi server in diversi
            Paesi in tutto il mondo. Potremmo trattare informazioni personali su
            un server sito in un Paese diverso da quello in cui si trova
            l’utente.
          </Text>
          <Text style={this.styles.contentText}>
            Trasparenza e libertà di scelta
          </Text>
          <Text style={this.styles.contentText}>
            Le persone hanno diversi approcci alla propria privacy. Il nostro
            obiettivo è essere chiari riguardo ai dati che raccogliamo in modo
            da consentire agli utenti di prendere decisioni informate sulla
            modalità di utilizzo di tali dati. Ad esempio, gli utenti possono:
          </Text>
          <Text style={this.styles.contentText}>
            Controllare con chi vengono condivise le proprie informazioni
            tramite l'account Oreegano.
          </Text>
          <Text style={this.styles.contentText}>
            Recuperare informazioni associate al proprio account Oreegano da
            molti dei nostri servizi.
          </Text>
          <Text style={this.styles.contentText}>
            Scegliere se visualizzare o meno il nome e la foto del loro profilo
            nei consigli condivisi che appaiono negli annunci.
          </Text>
          <Text style={this.styles.contentText}>
            L'utente può anche impostare il browser in modo da bloccare tutti i
            cookie (compresi quelli associati ai nostri servizi) o indicare
            quando un cookie viene impostato da noi. È importante, comunque,
            tenere presente che tanti nostri servizi potrebbero non funzionare
            correttamente qualora venissero disattivati i cookie.
          </Text>
          <Text style={this.styles.contentText}>
            Informazioni condivise dall’utente
          </Text>
          <Text style={this.styles.contentText}>
            Molti dei nostri servizi consentono di condividere informazioni con
            altri utenti. È opportuno tenere presente che se si condividono
            informazioni pubblicamente, tali informazioni potrebbero essere
            indicizzate dai motori di ricerca, compreso Google. I nostri servizi
            offrono diverse opzioni per la condivisione e la rimozione di
            contenuti.
          </Text>
          <Text style={this.styles.contentText}>
            Accesso ai dati personali e aggiornamento
          </Text>
          <Text style={this.styles.contentText}>
            Quando un utente utilizza i nostri servizi, desideriamo che possa
            accedere alle sue informazioni personali. Ove le informazioni non
            fossero corrette, cercheremo di fornire all'utente metodi per
            aggiornarle rapidamente o per eliminarle, salvo doverle conservare
            per legittime finalità commerciali o legali. In caso di
            aggiornamento delle informazioni personali, potremmo chiedere
            all'utente di verificare la sua identità prima di soddisfare la sua
            richiesta.
          </Text>
          <Text style={this.styles.contentText}>
            Potremmo rifiutare richieste irragionevolmente ripetitive, che
            richiedono un impegno tecnico eccessivo (ad esempio lo sviluppo di
            un nuovo sistema o la modifica sostanziale di una prassi esistente),
            mettono a rischio la privacy di altre persone o inattuabili (ad
            esempio richieste relative a informazioni memorizzate su sistemi di
            backup).
          </Text>
          <Text style={this.styles.contentText}>
            Ove ci sia possibile consentire l’accesso alle informazioni e la
            relativa correzione, consentiamo di farlo gratuitamente, eccetto il
            caso in cui lo sforzo richiesto sia eccessivamente gravoso. Tentiamo
            di gestire i nostri servizi in modo da proteggere le informazioni
            dalla distruzione accidentale o dolosa. Per questo motivo, dopo
            l’eliminazione delle informazioni dai nostri servizi da parte
            dell’utente, potremmo non eliminare subito le copie rimanenti dai
            nostri server attivi e potremmo non rimuovere le informazioni dai
            nostri sistemi di backup.
          </Text>
          <Text style={this.styles.contentText}>
            Informazioni condivise da noi
          </Text>
          <Text style={this.styles.contentText}>
            Non forniamo informazioni personali a società, organizzazioni e
            persone che non fanno parte di Oreegano, ad eccezione dei seguenti
            casi:
          </Text>
          <Text style={this.styles.contentText}>
            Con il consenso dell’utente
          </Text>
          <Text style={this.styles.contentText}>
            Forniamo dati personali a società, organizzazioni e persone che non
            fanno parte di Oreegano con il consenso dell’utente. Chiediamo il
            consenso per l’attivazione della condivisione di dati personali
            sensibili.
          </Text>
          <Text style={this.styles.contentText}>Per trattamenti esterni</Text>
          <Text style={this.styles.contentText}>
            Forniamo informazioni personali ai nostri affiliati o ad altre
            aziende o persone fidate affinché le trattino per noi in base alle
            nostre istruzioni e nel rispetto delle nostre Norme sulla privacy e
            di altre eventuali misure appropriate relative a riservatezza e
            sicurezza.
          </Text>
          <Text style={this.styles.contentText}>Per motivi legali</Text>
          <Text style={this.styles.contentText}>
            Forniamo dati personali a società, organizzazioni e persone che non
            fanno parte di Oreegano qualora ritenessimo in buona fede che
            l’accesso, l’utilizzo, la tutela o la divulgazione di tali
            informazioni sia ragionevolmente necessario per:
          </Text>
          <Text style={this.styles.contentText}>
            Soddisfare eventuali leggi o norme vigenti, procedimenti legali o
            richieste governative applicabili.
          </Text>
          <Text style={this.styles.contentText}>
            Applicare i Termini di servizio vigenti, compresi gli accertamenti
            in merito a potenziali violazioni.
          </Text>
          <Text style={this.styles.contentText}>
            Rilevare, impedire o altrimenti gestire attività fraudolente o
            problemi relativi alla sicurezza o di natura tecnica.
          </Text>
          <Text style={this.styles.contentText}>
            Tutelare i diritti, la proprietà o la sicurezza di Oreegano, dei
            nostri utenti o del pubblico, come richiesto o consentito dalla
            legge.
          </Text>
          <Text style={this.styles.contentText}>
            Potremmo condividere informazioni non personali aggregate
            pubblicamente e con i nostri partner, ad esempio publisher,
            inserzionisti o siti collegati. Ad esempio, potremmo condividere
            informazioni pubblicamente per mostrare le tendenze relative
            all'utilizzo generale dei nostri servizi.
          </Text>
          <Text style={this.styles.contentText}>
            Qualora Oreegano dovesse essere coinvolta in una fusione,
            acquisizione o cessione di asset, continuerà a garantire la
            riservatezza delle informazioni personali e comunicherà agli utenti
            interessati il trasferimento delle informazioni personali o
            l’applicazione di norme sulla privacy diverse.
          </Text>
          <Text style={this.styles.contentTitle}>Oreegano - Mia Premium</Text>
          <Text style={this.styles.contentText}>
            Questa sezione si applica solo quando acquisti e / o abbonati a
            Oreegano Mia Premium o ad altri prodotti a pagamento. Pagando la
            quota di iscrizione, si ottiene l'accesso a Oreegano Mia Premium
            durante il periodo di validità dell'abbonamento, in base ai presenti
            Termini. Tutti gli abbonamenti con Oreegano Mia Premium sono pagati
            in anticipo. Puoi in qualsiasi momento rescindere la tua iscrizione,
            nel qual caso la tua iscrizione sarà comunque valida per l'ora di
            abbonamento che hai già pagato. Se ti sei abbonato a Oreegano Mia
            Premium tramite l'uso di App Store, Google Play Store o qualsiasi
            altro fornitore di servizi, utilizzando l'acquisto in-app, puoi
            cancellare il tuo abbonamento solo tramite l'uso dei loro servizi.
            Le tariffe di abbonamento sono disponibili nell'applicazione mobile.
            Oreegano accetta una varietà di diversi metodi di pagamento, come
            PayPal, Apple iTunes, Google Play e pagamento con carta di credito.
            Possono essere applicati termini e condizioni speciali. Oreegano si
            riserva il diritto di modificare periodicamente le tariffe di
            abbonamento. Con la presente acconsenti a utilizzare immediatamente
            i Servizi al momento della sottoscrizione con Oreegano Mia Premium o
            altri prodotti a pagamento. Ciò significa che avrai solo 14 giorni
            di tempo per recedere dal contratto con Oreegano dalla data in cui
            ricevi la conferma dell'abbonamento via e-mail se non inizi a
            utilizzare i Servizi durante tale periodo. Per utilizzare il tuo
            diritto di recesso, devi inviare un'email a Oreegano (troverai i
            nostri dettagli di contatto anche in fondo a questo documento).
            Eventuali spese prepagate saranno rimborsate entro 30 giorni. Tutti
            i pagamenti gestiti da Apple, come gli acquisti in-app, possono
            essere rimborsati solo da Apple e con il consenso di Apple. Se si
            desidera contattare Apple, fare clic qui. Il mancato pagamento non è
            considerato come una cessazione di un abbonamento Oreegano Premium.
          </Text>
          <Text style={this.styles.contentTitle}>
            Diritti degli interessati
          </Text>
          <Text style={this.styles.contentTitle}>
            Quali diritti Lei ha in qualità di interessato:
          </Text>
          <Text style={this.styles.contentText}>
            In relazione ai trattamenti descritti nella presente Informativa, in
            qualità di interessato Lei potrà, alle condizioni previste dal GDPR,
            esercitare i diritti sanciti dagli articoli da 15 a 21 del GDPR e,
            in particolare, i seguenti diritti:
          </Text>
          <Text style={this.styles.contentText}>
            - Diritto di accesso – articolo 15 GDPR: diritto di ottenere
            conferma che sia o meno in corso un trattamento di dati personali
            che La riguardano e, in tal caso, ottenere l'accesso ai Suoi dati
            personali, compresa una copia degli stessi.
          </Text>
          <Text style={this.styles.contentText}>
            - Diritto alla cancellazione (diritto all’oblio) – articolo 17 GDPR:
            diritto di ottenere, senza ingiustificato ritardo, la cancellazione
            dei dati personali che La riguardano.
          </Text>
          <Text style={this.styles.contentText}>
            - Diritto di limitazione di trattamento – articolo 18 GDPR: diritto
            di ottenere la limitazione del trattamento, quando:
          </Text>
          <View style={{marginLeft: 20}}>
            <Text style={this.styles.contentText}>
              - l’interessato contesta l’esattezza dei dati personali, per il
              periodo necessario al titolare per verificare l’esattezza di tali
              dati;
            </Text>
            <Text style={this.styles.contentText}>
              - il trattamento è illecito e l’interessato si oppone alla
              cancellazione dei dati personali e chiede invece che ne sia
              limitato l’utilizzo;
            </Text>
            <Text style={this.styles.contentText}>
              - i dati personali sono necessari all’interessato per
              l’accertamento, l’esercizio o la difesa di un diritto in sede
              giudiziaria;
            </Text>
            <Text style={this.styles.contentText}>
              - l’interessato si è opposto al trattamento ai sensi dell’art. 21
              GDPR, nel periodo di attesa della verifica in merito all’eventuale
              prevalenza di motivi legittimi del titolare del trattamento
              rispetto a quelli dell’interessato.
            </Text>
          </View>

          <Text style={this.styles.contentText}>
            - Diritto alla portabilità dei dati – articolo 20 GDPR: diritto di
            ricevere, in un formato strutturato, di uso comune e leggibile da un
            dispositivo automatico, i dati personali che La riguardano forniti
            al Titolare e il diritto di trasmetterli a un altro titolare senza
            impedimenti, qualora il trattamento si basi sul consenso e sia
            effettuato con mezzi automatizzati. Inoltre, il diritto di ottenere
            che i Suoi dati personali siano trasmessi direttamente dalla Banca
            ad altro titolare qualora ciò sia tecnicamente fattibile;
          </Text>
          <Text style={this.styles.contentText}>
            - Diritto di opposizione – articolo 21 GDPR: diritto di opporsi, in
            qualsiasi momento per motivi connessi alla sua situazione
            particolare, al trattamento dei dati personali che La riguardano
            basati sulla condizione di liceità del legittimo interesse o
            dell’esecuzione di un compito di interesse pubblico o dell’esercizio
            di pubblici poteri, compresa la profilazione, salvo che sussistano
            motivi legittimi per il Titolare di continuare il trattamento che
            prevalgono sugli interessi, sui diritti e sulle libertà
            dell’interessato oppure per l’accertamento, l’esercizio o la difesa
            di un diritto in sede giudiziaria. Inoltre, il diritto di opporsi in
            qualsiasi momento al trattamento qualora i dati personali siano
            trattati per finalità di marketing diretto, compresa la
            profilazione, nella misura in cui sia connessa a tale marketing
            diretto.
          </Text>
          <Text style={this.styles.contentText}>
            I diritti di cui sopra potranno essere esercitati, nei confronti del
            Titolare, contattando i riferimenti sopra descritti.
          </Text>
          <Text style={this.styles.contentText}>
            L’esercizio dei Suoi diritti in qualità di interessato è gratuito ai
            sensi dell’articolo 12 GDPR. Tuttavia, nel caso di richieste
            manifestamente infondate o eccessive, anche per la loro
            ripetitività, il Titolare potrebbe addebitarle un contributo spese
            ragionevole, alla luce dei costi amministrativi sostenuti per
            gestire la Sua richiesta, o negare la soddisfazione della sua
            richiesta.
          </Text>
          <Text style={this.styles.contentText}>DIRITTO DI REVOCA:</Text>
          <Text style={this.styles.contentText}>
            - L'interessato ha il diritto di revocare il proprio consenso in
            qualsiasi momento. La revoca del consenso non pregiudica la liceità
            del trattamento basata sul consenso prima della revoca.
          </Text>
          <Text style={this.styles.contentText}>DIRITTO DI RECLAMO:</Text>
          <Text style={this.styles.contentText}>
            - L'interessato ha il diritto di proporre reclamo all’Autorità
            Garante per la protezione dei dati personali, Piazza di Montecitorio
            n. 121, 00186, Roma (RM)
          </Text>
          <Text style={this.styles.contentTitle}>Lo Staff di Oreegano</Text>
          <Text style={[this.styles.contentTitle, {marginTop: 0}]}>
            staff@oreegano.com
          </Text>
          <Text style={this.styles.contentText}>30 novembre 2018</Text>
          <View style={{height: 50}} />
        </ScrollView>
        <View style={this.styles.bottomContainer}>
          <View style={this.styles.switchContainer}>
            <Switch
              style={{width: 50}}
              onTintColor={Colors.activeButton}
              onValueChange={value => {
                this.setState({isActive: value});
              }}
              value={this.state.isActive}
            />
            <Text
              style={[
                this.styles.contentText,
                {marginLeft: 10, width: Metrics.windowWidth - 100},
                ,
              ]}>
              Ho letto e accetto i termini e le condizioni e la politica sulla
              privacy.
            </Text>
          </View>

          <TouchableOpacity
            disabled={!this.state.isActive}
            onPress={() => {
              this.props.setGDPRRequest({
                user_option_attributes: {gdpr_flag: true},
              });

              this.props.navigation.navigate({
                routeName: 'DietPreferences',
                key: `Always-push-${Math.random() * 10000}`,
                params: {
                  title: I18n.t('dietPreferences'),
                },
              });
            }}
            style={[
              this.styles.button,
              {
                backgroundColor: this.state.isActive
                  ? Colors.activeButton
                  : Colors.grey,
              },
              ,
            ]}>
            <Text style={this.styles.buttonText}>{I18n.t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setGDPRRequest: data => dispatch(LoginActions.editUserAuthDataRequest(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GDPRScreen);
