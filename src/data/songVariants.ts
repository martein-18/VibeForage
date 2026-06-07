export type VariantType = "lofi" | "remix" | "female";

export interface SongVariant {
  type: VariantType;
  label: string;
  title: string;
  artist: string;
  audioUrl: string; // real iTunes 30s preview — distinct per variant, audio only
  cover: string;
}

export interface SongWithVariants {
  catalogId: number;
  variants: SongVariant[];
}

const cover = (seed: string) =>
  `https://picsum.photos/seed/${seed}/80/80`;

export const SONG_VARIANTS: SongWithVariants[] = [
  {
    catalogId: 1, // Tum Hi Ho
    variants: [
      { type: "lofi",  label: "Lo-fi", title: "Tum Hi Ho (Lo-fi)",  artist: "Maahi Muzic",     audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f7/b7/7d/f7b77d34-001f-2291-f3d2-d378a7d4959c/mzaf_17271921498082289040.plus.aac.p.m4a", cover: cover("tum-lofi") },
      { type: "remix", label: "Remix", title: "Tum Hi Ho (Remix)",  artist: "DJ Kiran Kamath", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a2/da/28/a2da28c5-d5b7-e9d6-414c-edad85eb1672/mzaf_8433193019201962744.plus.aac.p.m4a", cover: cover("tum-remix") },
    ],
  },
  {
    catalogId: 2, // Kesariya
    variants: [
      { type: "lofi",  label: "Lo-fi", title: "Kesariya (Lofi Flip)",  artist: "VIBIE",   audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/5d/04/9b/5d049bd5-e913-4f8c-ee8f-f7129daa693c/mzaf_17739354004565328274.plus.aac.p.m4a", cover: cover("kes-lofi") },
      { type: "remix", label: "Remix", title: "Kesariya (Dance Mix)",  artist: "Pritam",  audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/d6/a3/37/d6a33794-e97a-02c7-dcba-d6311784d089/mzaf_11517579498077553635.plus.aac.p.m4a", cover: cover("kes-remix") },
    ],
  },
  {
    catalogId: 5, // Blinding Lights
    variants: [
      { type: "lofi",  label: "Lo-fi", title: "Blinding Lights (LoFI)", artist: "LORDFI",    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/65/48/23/65482325-4747-0906-f8ee-10f82c451278/mzaf_5893717618107178619.plus.aac.p.m4a", cover: cover("blind-lofi") },
      { type: "remix", label: "Remix", title: "Blinding Lights (Lofi)", artist: "lonelyboy", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/01/50/b0/0150b066-b56c-2c9f-b7df-5b2c0e3cd862/mzaf_16559316194501787724.plus.aac.p.m4a", cover: cover("blind-remix") },
    ],
  },
  {
    catalogId: 12, // Tera Ban Jaunga
    variants: [
      { type: "lofi",   label: "Lo-fi",  title: "Tera Ban Jaunga (Slowed)", artist: "Honest Garden", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2c/bb/68/2cbb6800-6a15-fc69-ff05-eb9db2650bac/mzaf_15267204021722336192.plus.aac.p.m4a", cover: cover("tera-lofi") },
      { type: "female", label: "Female", title: "Tera Ban Jaunga (Female)",  artist: "Tulsi Kumar",   audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/a9/59/61a95964-c914-f0fe-b99b-4348851c13ee/mzaf_750697725323217609.plus.aac.p.m4a",  cover: cover("tera-female") },
    ],
  },
  {
    catalogId: 22, // Hawayein
    variants: [
      { type: "lofi",  label: "Lo-fi", title: "Hawayein (Lofi Flip)",   artist: "VIBIE",            audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/59/cd/36/59cd3644-5568-79e9-666e-bf1cf4a7bd06/mzaf_9308426151335971980.plus.aac.p.m4a",  cover: cover("hawa-lofi") },
      { type: "remix", label: "Remix", title: "Hawayein (Remix)",        artist: "DJ Shilpi Sharma", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/1f/e4/3b/1fe43be1-0e28-0b48-c751-81ad3360e393/mzaf_3032039574468014193.plus.aac.p.m4a", cover: cover("hawa-remix") },
    ],
  },
  {
    catalogId: 27, // Channa Mereya
    variants: [
      { type: "lofi",   label: "Lo-fi",  title: "Channa Mereya (Lofi Flip)",  artist: "Deepanshu Ruhela", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c6/e0/dd/c6e0dd19-88dd-bf72-e24b-cd5e10481447/mzaf_17600758235983032871.plus.aac.p.m4a", cover: cover("channa-lofi") },
      { type: "female", label: "Female", title: "Channa Mereya (Female)",      artist: "Jonita Gandhi",    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a",  cover: cover("channa-female") },
    ],
  },
  {
    catalogId: 28, // Bekhayali
    variants: [
      { type: "lofi",   label: "Lo-fi",  title: "Bekhayali (Lofi)",         artist: "Lofi City",   audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/f1/8a/4ef18aa3-53a5-7ced-f887-b537d4adf0eb/mzaf_16713780536711201262.plus.aac.p.m4a", cover: cover("bekh-lofi") },
      { type: "female", label: "Female", title: "Bekhayali (Arijit Version)", artist: "Arijit Singh", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c8/d7/b0/c8d7b01f-8155-28a1-4f3b-325b388461bb/mzaf_18385379808741705219.plus.aac.p.m4a", cover: cover("bekh-female") },
    ],
  },
  {
    catalogId: 31, // Shape of You
    variants: [
      { type: "lofi",  label: "Lo-fi", title: "Shape of You (Lo-fi)",  artist: "Lofi Fruits Music", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/dd/3b/3a/dd3b3a10-0f21-9fce-cf2b-47dfc26662e2/mzaf_10484480928919011596.plus.aac.p.m4a", cover: cover("shape-lofi") },
      { type: "remix", label: "Remix", title: "Shape of You Lo-fi",    artist: "Shayaan Muzic",     audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/ca/e5/ee/cae5eea4-5193-6848-fcb4-12107fa46cdd/mzaf_15230356993444478325.plus.aac.p.m4a",  cover: cover("shape-remix") },
    ],
  },
  {
    catalogId: 32, // Someone Like You
    variants: [
      { type: "lofi", label: "Lo-fi", title: "Someone Like You - Lofi", artist: "lonelyboy", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c8/96/cd/c896cd66-8759-9bf9-bc70-b61bfb1a96a9/mzaf_7885306570864879987.plus.aac.p.m4a", cover: cover("adele-lofi") },
    ],
  },
  {
    catalogId: 51, // Fix You
    variants: [
      { type: "lofi", label: "Lo-fi", title: "Fix You (Lo-fi)", artist: "Dreamy Lofi", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/42/e3/e542e340-a45c-695e-e0b8-6155e222ebc0/mzaf_14955746616030397665.plus.aac.p.m4a", cover: cover("fix-lofi") },
    ],
  },
  {
    catalogId: 9, // Glimpse of Us
    variants: [
      { type: "lofi", label: "Lo-fi", title: "Glimpse of Us (Lo-fi)", artist: "Lofi Joji", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0c/53/c2/0c53c240-300a-5ddf-fc86-3a54e1b73a78/mzaf_13555682862214742934.plus.aac.p.m4a", cover: cover("glimpse-lofi") },
    ],
  },
  {
    catalogId: 7, // Cruel Summer
    variants: [
      { type: "lofi",  label: "Lo-fi", title: "Cruel Summer (Lo-fi)", artist: "Lofi Taylor",      audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a", cover: cover("cruel-lofi") },
      { type: "remix", label: "Remix", title: "Cruel Summer (Remix)", artist: "Chromatics Remix", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a", cover: cover("cruel-remix") },
    ],
  },
  {
    catalogId: 11, // Heat Waves
    variants: [
      { type: "lofi", label: "Lo-fi", title: "Heat Waves (Lo-fi)", artist: "Lofi Glass Animals", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/4c/b9/a34cb911-40fc-5f0c-e862-14bd171a77aa/mzaf_384792072030970151.plus.aac.p.m4a", cover: cover("heat-lofi") },
    ],
  },
];

const VARIANT_MAP = new Map(SONG_VARIANTS.map(s => [s.catalogId, s.variants]));

export function getVariantsForSong(catalogId: number): SongVariant[] {
  return VARIANT_MAP.get(catalogId) ?? [];
}

export const VARIANT_TYPE_COLORS: Record<VariantType, string> = {
  lofi:   "#A29BFE",
  remix:  "#FD79A8",
  female: "#FDCB6E",
};

export const VARIANT_TYPE_LABELS: Record<VariantType, string> = {
  lofi:   "Lo-fi",
  remix:  "Remix",
  female: "Female",
};
