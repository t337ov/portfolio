import { ProfileCard } from "@/app/ProfileCard";
import { ToolVideo } from "@/app/ToolVideo";
import { phoneDimensions } from "@/content/image-dimensions";
import Image from "next/image";
import { LanguageLink } from "@/app/LanguageLink";
import { AwardReveal } from "@/app/AwardReveal";
import { ComicBook } from "@/app/ComicBook";
import { notFound } from "next/navigation";
import { locales, phoneAlt, portfolio, snippetAlt, type Locale } from "@/content/portfolio";

const contactHrefs = [
  "https://docs.google.com/document/d/1qNYfn44uKA3TO4J4bi-vPFtxLErjZoPlLt7dcMQipBE/edit?usp=sharing",
  "https://t.me/teetov",
  "mailto:roman.teetov@gmail.com",
  "https://www.linkedin.com/in/titovr/",
];

function ContactLinks({ locale }: { locale: Locale }) {
  const labels = portfolio[locale].contacts;
  return <nav className="contacts" aria-label={locale === "ru" ? "Контакты" : "Contact links"}>
    {labels.map((label, index) => <span className="contactItem" key={label}>
      {index > 0 && <span className="separator" aria-hidden="true">•</span>}
      <a href={contactHrefs[index]} target={index === 0 || index === 3 ? "_blank" : undefined} rel={index === 0 || index === 3 ? "noreferrer" : undefined}>{label}</a>
    </span>)}
  </nav>;
}

function Gallery({ locale, start, end, label }: { locale: Locale; start: number; end: number; label: string }) {
  const assetLocale = locale === "en" ? "eng" : "ru";
  return <div className="gallery phoneGallery" aria-label={label}>
    {Array.from({ length: end - start }, (_, offset) => {
      const number = start + offset + 1;
      const n = String(number).padStart(2, "0");
      return <Image key={n} src={`/img/compressed/iphone${n}_${assetLocale}.webp${n === "06" ? "?v=20261025" : ""}`} alt={phoneAlt[locale][number - 1]} width={phoneDimensions[assetLocale][number - 1][0]} height={phoneDimensions[assetLocale][number - 1][1]} sizes="(max-width: 600px) 72vw, 310px" />;
    })}
  </div>;
}

function SingleScreen({ locale, number }: { locale: Locale; number: number }) {
  const assetLocale = locale === "en" ? "eng" : "ru";
  const n = String(number).padStart(2, "0");
  return <figure className={"singleScreen " + (number === 9 ? "singleScreenLoyalty" : "singleScreenCalendar")}>
    <Image src={`/img/compressed/iphone${n}_${assetLocale}.webp${n === "06" ? "?v=20261025" : ""}`} alt={phoneAlt[locale][number - 1]} width={phoneDimensions[assetLocale][number - 1][0]} height={phoneDimensions[assetLocale][number - 1][1]} sizes="(max-width: 809px) calc(100vw - 40px), 551px" />
  </figure>;
}

function SnippetGallery({ locale }: { locale: Locale }) {
  const assetLocale = locale === "en" ? "eng" : "ru";
  return <div className="productBand"><div className="gallery productGallery" aria-label={locale === "ru" ? "Карточки товаров" : "Product card examples"}>
    {Array.from({ length: 14 }, (_, index) => {
      const n = String(index + 1).padStart(2, "0");
      return <Image key={n} src={`/img/compressed/${n}_snippet_${assetLocale}.webp${n === "12" ? "?v=20261025" : ""}`} alt={snippetAlt[locale][index]} width={228} height={324} sizes="(max-width: 600px) 55vw, 228px" />;
    })}
  </div></div>;
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const assetLocale = locale === "en" ? "eng" : "ru";
  const content = portfolio[locale];
  const [introBefore, introAfter] = content.x5.intro.split(content.x5.introAccent);
  const origin = process.env.SITE_URL?.replace(/\/$/, "");
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Roman Titov",
    jobTitle: locale === "en" ? "Senior Product Designer" : "Дизайнер в бигтехе",
    url: origin ? (locale === "en" ? origin : `${origin}/${locale}`) : undefined,
    sameAs: ["https://www.linkedin.com/in/titovr/", "https://t.me/teetov"],
  };

  return <main key={locale} className="page" lang={locale}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
    <header className="topbar">
      <div className="languageSwitch" aria-label={locale === "ru" ? "Выбор языка" : "Language selection"}>
        <LanguageLink href="/" aria-current={locale === "en" ? "page" : undefined}>EN</LanguageLink><span aria-hidden="true">•</span><LanguageLink href="/ru" aria-current={locale === "ru" ? "page" : undefined}>RU</LanguageLink>
      </div>
    </header>

    <section className="introSection" aria-labelledby="profile-name">
      <ProfileCard name={content.name} role={content.role} intro={content.intro} locale={locale} />
      <ContactLinks locale={locale} />
    </section>

    <section className="caseSection" aria-labelledby="x5-title">
      <div className="sectionHeading"><h2 id="x5-title"><small className="experienceDate">{content.x5.date}</small><br />Х5 Digital</h2></div>
      <p className="caseIntro">{introBefore}<span className="textAccent">{content.x5.introAccent}</span>{introAfter}</p>
      <div className="achievement"><p><strong>{content.x5.achievements[0][0]}</strong> {content.x5.achievements[0][1]}</p><Gallery locale={locale} start={0} end={8} label={locale === "ru" ? "Экраны товаров и каталога" : "Product and catalogue screens"} /></div>
      <div className="achievement"><p><strong>{content.x5.achievements[1][0]}</strong> {content.x5.achievements[1][1]}</p></div>
      <SnippetGallery locale={locale} />
      <div className="achievement"><p><strong>{content.x5.achievements[2][0]}</strong> {content.x5.achievements[2][1]}</p></div>
      <ToolVideo locale={locale} />
      <SingleScreen locale={locale} number={9} />
      <div className="achievement"><p><strong>{content.x5.achievements[3][0]}</strong> {content.x5.achievements[3][1]}</p></div>
      <SingleScreen locale={locale} number={10} />
      <div className="achievement"><p><strong>{content.x5.achievements[4][0]}</strong> {content.x5.achievements[4][1]}</p></div>
      <div className="conceptGallery">
        {content.x5.concepts.map((caption, index) => <figure key={caption}>
          <Image src={`/img/compressed/iphone${String(index + 11).padStart(2, "0")}_${assetLocale}.webp`} alt={phoneAlt[locale][index + 10]} width={phoneDimensions[assetLocale][index + 10][0]} height={phoneDimensions[assetLocale][index + 10][1]} sizes="(max-width: 600px) 72vw, 310px" />
          <figcaption>{caption}</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="experience" aria-label={locale === "ru" ? "Другой опыт" : "Other experience"}>
      {content.experience.map((job) => <article className="experienceEntry" key={job.company}>
        <header className="sectionHeading">
          <h2><small className="experienceDate">{job.date}</small><br />{job.company}</h2>
        </header>
        <p>{"text" in job ? job.text : <>{job.textBefore}<a href={job.href} target="_blank" rel="noreferrer">{job.linkText}</a>{job.textAfter}</>}</p>
      </article>)}
    </section>

    <section className="comicsSection" aria-labelledby="comics-title">
      <h2 id="comics-title">{content.comicsTitle}</h2>
      {[{ className: "desktopComics", columns: [[0, 3], [1, 4], [2, 5]] }, { className: "mobileComics", columns: [[0, 2, 4], [1, 3, 5]] }].map((layout) => <div className={`comicsGrid ${layout.className}`} key={layout.className}>{layout.columns.map((column, columnIndex) => <div className="comicColumn" key={columnIndex}>{column.map((index) => {
        const comic = content.comics[index];
        return <figure className="comic" key={comic.image}>
        {"award" in comic && comic.award && <AwardReveal>{comic.award}</AwardReveal>}
        <ComicBook
          title={comic.title}
          cover={`/img/compressed/${encodeURIComponent(comic.image).replace(/%2F/g, "/")}`}
          firstPage={`/img/comic-pages/${comic.firstPage}`}
          aspectRatio={"aspectRatio" in comic ? comic.aspectRatio : undefined}
          locale={locale}
        />
        <figcaption>{comic.title}</figcaption>
      </figure>;
      })}</div>)}</div>)}
    </section>

    <footer className="footer"><p>{content.footer}</p><ContactLinks locale={locale} /></footer>
  </main>;
}
