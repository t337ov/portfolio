import PortfolioPage from "@/app/[locale]/page";

export default function Home() {
  return <PortfolioPage params={Promise.resolve({ locale: "en" })} />;
}
