import type { AgreementSummary } from "./types";

/** Rich demo output when GROQ_API_KEY is not configured */
export function getDemoSummary(language: string, fileName: string): AgreementSummary {
  const isHindi = language === "hi";

  return {
    meta: {
      documentType: isHindi ? "किराया अनुबंध (डेमो)" : "Residential Rental Agreement (Demo)",
      confidence: 0.92,
      outputLanguage: language,
      wordCount: 1840,
    },
    verdict: {
      headline: isHindi
        ? "यह किराया अनुबंध ज़्यादातर मानक है, लेकिन सुरक्षा जमा वापसी और मरम्मत जिम्मेदारी पर ध्यान दें।"
        : "This rental agreement is mostly standard, but watch the security deposit return and repair liability clauses.",
      summary: isHindi
        ? "11 महीने का किराया अनुबंध ₹25,000/माह पर। मकान मालिक को 2 महीने की सुरक्षा जमा मिलेगी। आपको बिजली-पानी अलग से देना होगा। समझौता रजिस्टर करवाना ज़रूरी है।"
        : "11-month rental at ₹25,000/month with a 2-month security deposit. Utilities are separate. Registration is required for enforceability in most states.",
      overallRisk: "medium",
      riskScore: 42,
      recommendation: "negotiate",
      recommendationReason: isHindi
        ? "सुरक्षा जमा वापसी की समय-सीमा और मरम्मत खर्च की जिम्मेदारी स्पष्ट करवाएं।"
        : "Clarify the deposit return timeline and who pays for routine repairs before signing.",
    },
    parties: [
      { name: "Rajesh Kumar", role: isHindi ? "मकान मालिक" : "Landlord" },
      { name: "You (Tenant)", role: isHindi ? "किरायेदार" : "Tenant" },
    ],
    keyDates: [
      { label: isHindi ? "शुरुआत" : "Start date", date: "2025-07-01" },
      { label: isHindi ? "समाप्ति" : "End date", date: "2026-05-31" },
      {
        label: isHindi ? "किराया भुगतान" : "Rent due",
        date: null,
        note: isHindi ? "हर महीने की 5 तारीख तक" : "By the 5th of each month",
      },
    ],
    keyTerms: [
      {
        label: isHindi ? "मासिक किराया" : "Monthly rent",
        value: "₹25,000",
        importance: "low",
      },
      {
        label: isHindi ? "सुरक्षा जमा" : "Security deposit",
        value: isHindi ? "₹50,000 (2 महीने)" : "₹50,000 (2 months)",
        importance: "high",
      },
      {
        label: isHindi ? "नोटिस अवधि" : "Notice period",
        value: isHindi ? "1 महीना" : "1 month",
        importance: "medium",
      },
      {
        label: isHindi ? "किराया वृद्धि" : "Rent escalation",
        value: isHindi ? "हर साल 10%" : "10% annually",
        importance: "medium",
      },
    ],
    clauses: [
      {
        id: "clause-1",
        title: isHindi ? "किराया और भुगतान" : "Rent & payment",
        category: "Payment",
        originalExcerpt: "The Tenant shall pay monthly rent of Rs. 25,000 by the 5th of every month...",
        plainLanguage: isHindi
          ? "आपको हर महीने की 5 तारीख तक ₹25,000 देना होगा। देरी पर 2% प्रति माह ब्याज लग सकता है।"
          : "You must pay ₹25,000 by the 5th each month. Late payment may attract 2% monthly interest.",
        risk: "low",
        realWorldExample: isHindi
          ? "अगर आप 10 तारीख को भुगतान करते हैं, तो ₹500 का अतिरिक्त शुल्क लग सकता है।"
          : "If you pay on the 10th instead of the 5th, you could owe an extra ₹500 in late fees.",
        whatToWatch: isHindi
          ? "देरी शुल्क की दर और छूट अवधि जांचें।"
          : "Check the late fee rate and any grace period.",
        negotiable: true,
      },
      {
        id: "clause-2",
        title: isHindi ? "सुरक्षा जमा" : "Security deposit",
        category: "Payment",
        originalExcerpt:
          "A refundable security deposit equivalent to two months rent shall be paid at execution...",
        plainLanguage: isHindi
          ? "शुरू में ₹50,000 जमा देनी होगी। समझौता खत्म होने पर वापस मिलनी चाहिए, लेकिन समय-सीमा स्पष्ट नहीं है।"
          : "You pay ₹50,000 upfront. It should be returned when the lease ends, but the timeline isn't clearly stated.",
        risk: "high",
        riskReason: isHindi
          ? "वापसी की समय-सीमा और कटौती के कारण अस्पष्ट हैं।"
          : "Return timeline and deduction reasons are vague.",
        realWorldExample: isHindi
          ? "कई किरायेदारों को जमा 3-6 महीने बाद भी नहीं मिलती क्योंकि 'मरम्मत' का बहाना बनाया जाता है।"
          : "Many tenants wait 3–6 months for deposit returns because landlords cite vague 'repair' deductions.",
        whatToWatch: isHindi
          ? "वापसी 15-30 दिनों में और कटौती की सूची लिखित में मांगें।"
          : "Ask for a written 15–30 day return timeline and itemized deduction list.",
        negotiable: true,
      },
      {
        id: "clause-3",
        title: isHindi ? "समाप्ति और नोटिस" : "Termination & notice",
        category: "Termination",
        originalExcerpt:
          "Either party may terminate with one month written notice. Landlord may terminate without notice for breach...",
        plainLanguage: isHindi
          ? "दोनों पक्ष 1 महीने का नोटिस देकर समझौता तोड़ सकते हैं। उल्लंघन पर मकान मालिक बिना नोटिस के भी किराया खाली करवा सकता है।"
          : "Either side can end the lease with 1 month notice. The landlord can terminate immediately for 'breach' — a broad term.",
        risk: "medium",
        realWorldExample: isHindi
          ? "अगर पालतू जानवर पर विवाद हो, तो मकान मालिक 'उल्लंघन' कहकर तुरंत खाली करवा सकता है।"
          : "A dispute over a pet could be called a 'breach', letting the landlord end the lease immediately.",
        whatToWatch: isHindi
          ? "'उल्लंघन' की परिभाषा स्पष्ट करवाएं।"
          : "Define what counts as a 'breach' in writing.",
        negotiable: true,
      },
      {
        id: "clause-4",
        title: isHindi ? "मरम्मत जिम्मेदारी" : "Repairs & maintenance",
        category: "Other",
        originalExcerpt: "Tenant shall maintain the premises in good condition and bear cost of minor repairs...",
        plainLanguage: isHindi
          ? "छोटी मरम्मत आपकी जिम्मेदारी है। 'छोटी' और 'बड़ी' मरम्मत का अंतर स्पष्ट नहीं।"
          : "You're responsible for 'minor' repairs. The line between minor and major isn't defined.",
        risk: "medium",
        realWorldExample: isHindi
          ? "पाइप लीक या AC खराब होने पर खर्च किसका होगा — यह विवाद का कारण बन सकता है।"
          : "A leaking pipe or broken AC could become a dispute over who pays.",
        whatToWatch: isHindi
          ? "₹5,000 से ऊपर की मरम्मत मकान मालिक की जिम्मेदारी लिखवाएं।"
          : "Cap your repair liability — e.g., landlord pays above ₹5,000.",
        negotiable: true,
      },
      {
        id: "clause-5",
        title: isHindi ? "उप-किराया निषेध" : "No subletting",
        category: "Other",
        originalExcerpt: "Tenant shall not sublet or assign the premises without prior written consent...",
        plainLanguage: isHindi
          ? "बिना लिखित अनुमति के कमरा किसी और को नहीं दे सकते।"
          : "You can't sublet or share the flat without written landlord approval.",
        risk: "low",
        realWorldExample: isHindi
          ? "रूममेट जोड़ने पर भी अनुमति लेनी पड़ सकती है।"
          : "Even adding a roommate may require permission.",
        whatToWatch: isHindi ? "रूममेट की अनुमति की शर्तें जांचें।" : "Check rules for roommates.",
        negotiable: false,
      },
    ],
    redFlags: [
      {
        title: isHindi ? "अस्पष्ट जमा वापसी" : "Vague deposit return",
        severity: "high",
        explanation: isHindi
          ? "समझौते में जमा कब और कैसे वापस होगी, यह स्पष्ट नहीं है।"
          : "The agreement doesn't clearly state when and how the deposit will be returned.",
        clauseRef: "clause-2",
        action: isHindi
          ? "15-30 दिन की वापसी अवधि और कटौती की सूची जोड़वाएं।"
          : "Add a 15–30 day return period and itemized deduction clause.",
      },
      {
        title: isHindi ? "एकतरफा उल्लंघन खंड" : "One-sided breach clause",
        severity: "medium",
        explanation: isHindi
          ? "मकान मालिक को उल्लंघन पर तुरंत खाली करवाने का अधिकार है, परिभाषा अस्पष्ट है।"
          : "Landlord can terminate immediately for breach without a clear definition.",
        clauseRef: "clause-3",
        action: isHindi ? "उल्लंघन की सूची सीमित करवाएं।" : "Limit the list of what counts as breach.",
      },
    ],
    obligations: {
      yours: isHindi
        ? [
            "समय पर किराया भुगतान",
            "बिजली-पानी बिल",
            "छोटी मरम्मत",
            "संपत्ति का सामान्य रखरखाव",
          ]
        : [
            "Pay rent on time",
            "Pay utility bills",
            "Handle minor repairs",
            "Keep the property in good condition",
          ],
      theirs: isHindi
        ? [
            "शांतिपूर्ण कब्जा देना",
            "संरचनात्मक मरम्मत (अस्पष्ट)",
            "जमा वापसी (समय अस्पष्ट)",
          ]
        : [
            "Provide peaceful possession",
            "Structural repairs (unclear scope)",
            "Return security deposit (timeline unclear)",
          ],
    },
    beforeYouSign: {
      questions: isHindi
        ? [
            "जमा कितने दिनों में वापस मिलेगी?",
            "कौन सी मरम्मत मेरी और कौन सी आपकी जिम्मेदारी है?",
            "किराया बढ़ाने की सूचना कितने दिन पहले दी जाएगी?",
            "क्या पालतू जानवर की अनुमति है?",
          ]
        : [
            "When exactly will the deposit be returned?",
            "Which repairs am I responsible for vs. you?",
            "How much notice before a rent increase?",
            "Are pets allowed?",
          ],
      checklist: isHindi
        ? [
            "संपत्ति की फोटो लें (मौजूदा क्षति के साथ)",
            "पानी-बिजली मीटर रीडिंग नोट करें",
            "रजिस्ट्रेशन/स्टाम्प ड्यूटी की जांच करें",
            "सभी जोड़वाए गए खंड पर हस्ताक्षर करें",
          ]
        : [
            "Photograph the property (including existing damage)",
            "Note water/electricity meter readings",
            "Verify stamp duty and registration requirements",
            "Sign every page and all addenda",
          ],
    },
    glossary: [
      {
        term: isHindi ? "सुरक्षा जमा" : "Security deposit",
        definition: isHindi
          ? "संपत्ति को नुकसान से बचाने के लिए दी जाने वाली राशि, समझौता खत्म होने पर वापस।"
          : "Money held to cover potential damage, returned when the lease ends.",
      },
      {
        term: isHindi ? "नोटिस अवधि" : "Notice period",
        definition: isHindi
          ? "समझौता खत्म करने से पहले दूसरे पक्ष को दी जाने वाली अवधि।"
          : "Advance warning required before ending the agreement.",
      },
    ],
  };
}
