import type { Appearance } from "@clerk/clerk-react";
import type { LocalizationResource } from "@clerk/types";

/** LegalHai palette — hex only (Clerk does not parse oklch reliably) */
const colors = {
  ink: "#1a1a17",
  card: "#242420",
  input: "#141412",
  paper: "#f4f2ea",
  muted: "#b5b2a8",
  signal: "#e8ff33",
  inkOnSignal: "#1a1a17",
  border: "rgba(244, 242, 234, 0.12)",
} as const;

const sharedVariables: Appearance["variables"] = {
  colorBackground: colors.card,
  colorInputBackground: colors.input,
  colorInputText: colors.paper,
  colorText: colors.paper,
  colorTextSecondary: colors.muted,
  colorTextOnPrimaryBackground: colors.inkOnSignal,
  colorPrimary: colors.signal,
  colorNeutral: colors.paper,
  colorDanger: "#f87171",
  colorSuccess: "#6ee7b7",
  colorWarning: "#fbbf24",
  colorShimmer: colors.input,
  borderRadius: "0.75rem",
  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontFamilyButtons: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontSize: "0.9375rem",
};

export const clerkAppearance: Appearance = {
  variables: sharedVariables,
  elements: {
    rootBox: "w-full max-w-[420px] mx-auto",
    cardBox: "shadow-[0_0_80px_-30px_rgba(232,255,51,0.18)]",
    card: "bg-[#242420] border border-white/10 shadow-none rounded-2xl overflow-hidden",
    navbar: "hidden",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    logoBox: "hidden",
    main: "gap-4",

    socialButtonsBlockButton:
      "bg-[#141412] border border-white/10 text-[#f4f2ea] hover:bg-white/[0.06] transition h-11",
    socialButtonsBlockButtonText: "text-[#f4f2ea] font-medium text-sm",
    socialButtonsProviderIcon: "opacity-90",

    dividerLine: "bg-white/10",
    dividerText: "text-[#b5b2a8] text-xs uppercase tracking-wider",

    formFieldLabel: "text-[#f4f2ea] font-medium text-sm mb-1.5",
    formFieldInput:
      "bg-[#141412] border border-white/10 text-[#f4f2ea] placeholder:text-[#b5b2a8]/50 h-11 rounded-xl focus:border-[#e8ff33]/40 focus:ring-2 focus:ring-[#e8ff33]/15 shadow-none",
    formFieldInputShowPasswordButton: "text-[#b5b2a8] hover:text-[#f4f2ea]",
    formFieldAction: "text-[#e8ff33] font-medium hover:brightness-110",

    formButtonPrimary:
      "bg-[#e8ff33] text-[#1a1a17] font-semibold h-11 rounded-xl hover:brightness-110 shadow-none normal-case text-sm",
    formButtonReset: "text-[#b5b2a8] hover:text-[#f4f2ea]",

    footerActionText: "text-[#b5b2a8] text-sm",
    footerActionLink: "text-[#e8ff33] font-semibold hover:brightness-110",

    identityPreview: "bg-[#141412] border border-white/10 rounded-xl",
    identityPreviewText: "text-[#f4f2ea]",
    identityPreviewEditButton: "text-[#e8ff33] font-medium",

    otpCodeFieldInput:
      "bg-[#141412] border border-white/10 text-[#f4f2ea] rounded-xl focus:border-[#e8ff33]/40",
    formResendCodeLink: "text-[#e8ff33] font-medium",

    alert: "bg-white/5 border border-white/10 rounded-xl",
    alertText: "text-[#f4f2ea]",
    formFieldErrorText: "text-[#f87171]",

    footer: "bg-transparent pt-2",
    footerPages: "opacity-60",
    footerPagesLink: "text-[#b5b2a8] hover:text-[#f4f2ea]",

    alternativeMethodsBlockButton:
      "text-[#e8ff33] border border-white/10 bg-transparent hover:bg-white/[0.04]",
    backLink: "text-[#b5b2a8] hover:text-[#f4f2ea]",
    backRow: "text-[#b5b2a8]",

    badge: "bg-[#e8ff33]/15 text-[#e8ff33] border border-[#e8ff33]/20",
  },
};

export const clerkLocalization: LocalizationResource = {
  signIn: {
    start: {
      title: "Welcome back",
      subtitle: "Sign in to understand your agreements with confidence.",
    },
  },
  signUp: {
    start: {
      title: "Create your account",
      subtitle: "Join LegalHai — confidence before signing.",
    },
  },
};

const userButtonElements: Appearance["elements"] = {
  userButtonPopoverCard:
    "bg-[#242420] border border-white/10 shadow-xl rounded-xl overflow-hidden",
  userButtonPopoverMain: "bg-[#242420]",
  userButtonPopoverActions: "bg-[#242420]",
  userPreview: "bg-[#242420] border-b border-white/10",
  userPreviewTextContainer: "text-[#f4f2ea]",
  userPreviewMainIdentifier: "text-[#f4f2ea] font-medium text-sm",
  userPreviewSecondaryIdentifier: "text-[#b5b2a8] text-xs",
  userButtonPopoverActionButton:
    "text-[#f4f2ea] hover:bg-white/[0.06] rounded-lg transition",
  userButtonPopoverActionButtonText: "text-[#f4f2ea] text-sm font-medium",
  userButtonPopoverActionButtonIcon: "text-[#b5b2a8]",
  userButtonPopoverFooter: { display: "none" },
  modalContent: "bg-[#242420] border border-white/10",
  modalCloseButton: "text-[#b5b2a8] hover:text-[#f4f2ea]",
};

export const clerkUserButtonAppearance: Appearance = {
  variables: sharedVariables,
  elements: userButtonElements,
};

/** Global Clerk theme — sign-in, user menu, and account modal */
export const clerkProviderAppearance: Appearance = {
  variables: sharedVariables,
  elements: {
    ...userButtonElements,
    userProfile: "bg-[#242420]",
    profilePage: "bg-[#242420]",
    pageScrollBox: "bg-[#242420]",
    navbar: "bg-[#1a1a17] border-r border-white/10",
    navbarButton: "text-[#f4f2ea] hover:bg-white/[0.06]",
    navbarButtonIcon: "text-[#b5b2a8]",
    headerTitle: "text-[#f4f2ea]",
    headerSubtitle: "text-[#b5b2a8]",
    profileSectionTitle: "text-[#f4f2ea]",
    profileSectionContent: "text-[#f4f2ea]",
    profileSectionPrimaryButton: "text-[#e8ff33]",
    accordionTriggerButton: "text-[#f4f2ea] hover:bg-white/[0.04]",
    formFieldLabel: "text-[#f4f2ea]",
    formFieldInput: "bg-[#141412] border border-white/10 text-[#f4f2ea]",
    formButtonPrimary: "bg-[#e8ff33] text-[#1a1a17] font-semibold",
    footer: { display: "none" },
  },
};
