function InformationPage() {
  return (
    <div className="h-full lg:p-8 pt-16 w-full">
      <div className=" rounded-md p-4 m-auto shadow-md border border-black/20 bg-white max-w-2xl">
        <div className="mb-4">
          <h2 className="text-2xl font-medium">Vad är Ordprov.com?</h2>
          <div className="">
            <p className="tracking-wide text-lg mb-2">
              Ordprov.com är en hemsida som är byggd för att hjälpa dig att
              förbättra ditt ordförråd med fokus på ord som kan dyka upp på
              högskoleprovet.
            </p>
            <p className="tracking-wide text-lg mb-2">
              Vi fokuserar på inlärning genom att ge detaljerade definitioner på
              ord samt många exempelmeningar så att man förstår exakt vad orden
              betyder och hur de används i olika sammanhang. Vårt mål är att
              göra det enkelt och roligt att lära sig nya ord.
            </p>
            <p className="tracking-wide text-lg">
              Genom att skapa ett konto kan du spara dina framsteg, skapa mål,
              och se din statistik.
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-medium">Kontakt</h2>
          <div className="">
            <p className="tracking-wide text-lg mb-2">
              Om du har några frågor, feedback eller förslag så är du mer än
              välkommen att kontakta mig på{" "}
              <a
                href="mailto:nils.lorentzon@outlook.com"
                className="text-p-400 underline"
              >
                nils.lorentzon@outlook.com
              </a>
              .
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-medium">Om oss</h2>
          <div className="">
            <img
              src="me.jpg"
              alt="en bild på mig, Nils"
              className="w-32 h-32 rounded-full object-cover mb-4 float-right ml-4"
            />
            <p className="tracking-wide text-lg mb-2">
              Ordprov.com är skapad av mig, Nils. Jag har alltid älskat det
              svenska språket och att lära mig nya ord. Jag ville skapa en
              resurs som kunde hjälpa mig och förhoppningsvis många andra att
              förbättra sitt ordförråd på ett roligt och effektivt sätt.
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-medium">Utveckling</h2>
          <div className="">
            <p className="tracking-wide text-lg mb-2">
              Hemsidan är fortfarande under utveckling och idag finns endast
              2000 ord tillgängliga. Jag jobbar kontinuerligt med att lägga till
              fler ord och förbättra definitionerna. Jag jobbar också på att
              implementera fler funktioner som kan hjälpa dig inlärningen och
              göra upplevelsen ännu bättre.
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-medium">Cookies, GDPR och reklam</h2>
          <div className="">
            <p className="tracking-wide text-lg mb-2">
              Ordprov.com sparar inga cookies. Vi använder inte heller några
              tredjepartstjänster som samlar in data. Hemsidan är helt gratis.
              Vi har inga planer på att införa reklam eller datainsamling i
              framtiden.
            </p>
            <p className="tracking-wide text-lg mb-2">
              Skapar man ett konto så sparas ens e-postadress samt lösenord i
              krypterad form i vår databas. Denna information används endast för
              att möjliggöra inloggning och för att spara användarens framsteg
              på hemsidan. Vi delar inte denna information med någon tredje
              part. När man tar bort sitt konto raderas all information som är
              kopplad till ens konto permanent från vår databas.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-medium">Copyright</h2>
          <div className="">
            <p className="tracking-wide text-lg mb-2">
              Ett stort tack till Språkbanken, Wikipedia och SALDO som har
              bidragit med data som har gjort denna hemsida möjlig.
              Frekvensdata, ordböjningar, ordklasser och enkla definitioner är
              hämtade från dessa källor eller skapade av mig. All kod är skriven
              av mig och får inte kopieras eller användas utan mitt tillstånd.
            </p>
          </div>
        </div>
      </div>
      <div className="p-8"></div>
    </div>
  );
}

export default InformationPage;
