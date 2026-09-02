/**
 * Language and reading-level variants for the site's explanatory content.
 *
 * Languages reflect the largest non-English-speaking populations in Forsyth
 * County: Spanish, Telugu, and Hindi. The "simple" variant is plain English
 * at roughly a 6th-grade reading level, for residents with lower literacy,
 * cognitive disabilities, or limited English proficiency.
 *
 * These are human-reviewed strings rather than live machine output. A
 * translation API can populate the same shape later; keeping the reviewed
 * copy here means the feature never shows an unreviewed machine translation
 * of safety-critical information like eligibility or emergency services.
 */

export const LANGUAGES = {
  en: { label: "English", native: "English", dir: "ltr" },
  es: { label: "Spanish", native: "Español", dir: "ltr" },
  te: { label: "Telugu", native: "తెలుగు", dir: "ltr" },
  hi: { label: "Hindi", native: "हिन्दी", dir: "ltr" },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

export interface ContentVariants {
  /** Standard English. */
  en: string;
  es: string;
  te: string;
  hi: string;
  /** Plain English, ~6th grade reading level. */
  simple: string;
  /** Three short takeaways. */
  bullets: string[];
}

export const SITE_INTRO: ContentVariants = {
  en: "Forsyth Connect brings together the parks, libraries, family services, youth programs, and business resources available across Forsyth County, Georgia. Information is organized around what residents need rather than which agency provides it, so you can find what is relevant to you in a few clicks.",
  es: "Forsyth Connect reúne los parques, bibliotecas, servicios familiares, programas juveniles y recursos empresariales disponibles en el condado de Forsyth, Georgia. La información está organizada según lo que necesitan los residentes, y no según la agencia que lo ofrece, para que pueda encontrar lo que le interesa en pocos clics.",
  te: "ఫోర్సిత్ కనెక్ట్ జార్జియాలోని ఫోర్సిత్ కౌంటీలో అందుబాటులో ఉన్న ఉద్యానవనాలు, గ్రంథాలయాలు, కుటుంబ సేవలు, యువజన కార్యక్రమాలు మరియు వ్యాపార వనరులను ఒకచోట చేర్చుతుంది. ఏ సంస్థ అందిస్తుందో దాని ఆధారంగా కాకుండా, నివాసితులకు ఏమి అవసరమో దాని ఆధారంగా సమాచారం అమర్చబడింది.",
  hi: "फोर्सिथ कनेक्ट जॉर्जिया के फोर्सिथ काउंटी में उपलब्ध पार्क, पुस्तकालय, पारिवारिक सेवाएँ, युवा कार्यक्रम और व्यावसायिक संसाधनों को एक साथ लाता है। जानकारी इस आधार पर व्यवस्थित है कि निवासियों को क्या चाहिए, न कि इस आधार पर कि कौन सी एजेंसी इसे प्रदान करती है।",
  simple: "Forsyth Connect is one website for all the help you can get in Forsyth County, Georgia. It lists parks, libraries, food help, programs for kids and seniors, and help for small businesses. We sort it by what you need, so it is easy to find.",
  bullets: [
    "One place to find county parks, libraries, and services.",
    "Sorted by what you need, not by which office runs it.",
    "Free to use. No account needed.",
  ],
};

export const PILLAR_INTRO: ContentVariants = {
  en: "Resources are grouped into four areas: Parks and Recreation, Civic and Youth Engagement, Human and Family Services, and Business and Workforce. Each listing shows its address, current hours, who it serves, and the date the information was last verified.",
  es: "Los recursos se agrupan en cuatro áreas: Parques y Recreación, Participación Cívica y Juvenil, Servicios Humanos y Familiares, y Negocios y Fuerza Laboral. Cada listado muestra su dirección, horario actual, a quién atiende y la fecha en que se verificó la información por última vez.",
  te: "వనరులు నాలుగు విభాగాలుగా విభజించబడ్డాయి: ఉద్యానవనాలు మరియు వినోదం, పౌర మరియు యువజన భాగస్వామ్యం, మానవ మరియు కుటుంబ సేవలు, వ్యాపారం మరియు ఉద్యోగశక్తి. ప్రతి జాబితా చిరునామా, ప్రస్తుత సమయాలు, ఎవరికి సేవలు అందిస్తుందో మరియు సమాచారం చివరిగా ధృవీకరించిన తేదీని చూపిస్తుంది.",
  hi: "संसाधनों को चार क्षेत्रों में बाँटा गया है: पार्क और मनोरंजन, नागरिक और युवा भागीदारी, मानव और पारिवारिक सेवाएँ, तथा व्यवसाय और कार्यबल। हर सूची में पता, वर्तमान समय, वह किसकी सेवा करती है, और जानकारी की अंतिम पुष्टि की तारीख दिखाई जाती है।",
  simple: "We sort help into four groups: parks, youth and community, family help, and business help. Every listing tells you the address, when it is open, who it is for, and when we last checked the facts.",
  bullets: [
    "Four simple groups cover every listing.",
    "Each listing shows address, hours, and who it helps.",
    "We show the date we last checked the information.",
  ],
};
