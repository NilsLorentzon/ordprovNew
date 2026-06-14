export default function DonationPage() {
  return (
    <div className="h-full lg:p-8 pt-16 w-full">
      <div className=" rounded-md p-4 m-auto shadow-md border border-black/20 bg-white max-w-2xl">
        <h2 className="text-2xl font-medium mb-2">Donation</h2>
        <p className="tracking-wide text-lg mb-2">
          Ordprov är helt gratis att använda och vi använder inte några
          annonser eller säljer användardata. För att kunna fortsätta erbjuda en
          högkvalitativ och gratis tjänst så är vi helt beroende av donationer
          från användare som vill stödja oss.
          <br />
          <br />
          Vill man stödja hemsidan så kan man donera via{" "}
          <a
            href="https://buymeacoffee.com/zevrialolw"
            target="_blank"
            className="text-p-400 underline"
          >
            Buy Me a Coffee
          </a>
          . eller swisha valfritt belopp.
          <div className="flex justify-center w-full">

          <img src="/swish.png" alt="Swisha" className="max-w-[200px] mt-4" />
          </div>
        </p>
      </div>
    </div>
  );
}
