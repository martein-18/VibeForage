// iTunes 30-second preview URLs â€” real songs, no auth needed, CORS open
// Artwork from iTunes at 600x600 for best quality

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  genre: string;
  file: string;       // iTunes 30s preview (fallback)
  ytId: string;       // YouTube video ID (full song)
}

export const songs: Song[] = [
  {
    id: 1, title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2",
    duration: "4:21", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/de/b9/38deb942-d44a-f2bb-205c-ddf05be84693/mzaf_9747647124859107103.plus.aac.p.m4a",
    ytId: "Umqb9KENgmk",
  },
  {
    id: 2, title: "Kesariya", artist: "Arijit Singh", album: "Brahmastra",
    duration: "4:28", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a",
    ytId: "BddP6PYo2gs",
  },
  {
    id: 3, title: "Raataan Lambiyan", artist: "Jubin Nautiyal", album: "Shershaah",
    duration: "3:50", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/61/65/ae/6165aee9-8bb9-0bd4-02b0-5d0f1e6257a3/886449510238.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/0c/38/990c381b-0530-8c0d-87a9-18b050b97f0a/mzaf_10418866714500530894.plus.aac.p.m4a",
    ytId: "oiQ08bMmy9A",
  },
  {
    id: 4, title: "Chaleya", artist: "Arijit Singh", album: "Jawan",
    duration: "3:20", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/87/61/a9/8761a939-8e1c-678e-b186-09401480b314/mzaf_2211340113577128300.plus.aac.p.m4a",
    ytId: "4wH9K-q56Z0",
  },
  {
    id: 5, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours",
    duration: "3:20", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/6e/bf/a66ebf79-5008-8948-b352-a790fc87446b/19UM1IM04638.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/b4/8f/17b48f9a-0b93-6bb8-fe1d-3a16623c2cfb/mzaf_9560252727299052414.plus.aac.p.m4a",
    ytId: "4NRXx6U8ABQ",
  },
  {
    id: 6, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia",
    duration: "3:23", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a",
    ytId: "TUVcZfQe-Kw",
  },
  {
    id: 7, title: "Cruel Summer", artist: "Taylor Swift", album: "Lover",
    duration: "2:58", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a",
    ytId: "ic8j13piAhQ",
  },
  {
    id: 8, title: "As It Was", artist: "Harry Styles", album: "Harry's House",
    duration: "2:47", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a",
    ytId: "H5v3kku4y6Q",
  },
  {
    id: 9, title: "Glimpse of Us", artist: "Joji", album: "Smithereens",
    duration: "3:53", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/2a/43/d02a433a-3ab8-9a94-b07d-1dc599b64966/93624864387.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0c/53/c2/0c53c240-300a-5ddf-fc86-3a54e1b73a78/mzaf_13555682862214742934.plus.aac.p.m4a",
    ytId: "FkUus3pBgcA",
  },
  {
    id: 10, title: "Night Changes", artist: "One Direction", album: "Four",
    duration: "3:46", genre: "nostalgic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/62/2d/19/622d19da-eb88-022c-2bc5-d843657defe8/886444549851.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/8c/b8/8a/8cb88ab0-1ff4-e1a4-20dd-99cd38769996/mzaf_4064811256027788885.plus.aac.p.m4a",
    ytId: "syFZfO_wfMQ",
  },
  {
    id: 11, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland",
    duration: "3:58", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/da/8b/77/da8b7731-6f4f-eacf-5e74-8b23389eefa1/20UMGIM03371.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/4c/b9/a34cb911-40fc-5f0c-e862-14bd171a77aa/mzaf_384792072030970151.plus.aac.p.m4a",
    ytId: "mRD0-GxqHVo",
  },
  {
    id: 12, title: "Tera Ban Jaunga", artist: "Akhil Sachdeva", album: "Kabir Singh",
    duration: "3:56", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f6/70/84/f6708434-0123-ff36-0ac3-7401e8cf0f94/8902894360807_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/a9/59/61a95964-c914-f0fe-b99b-4348851c13ee/mzaf_750697725323217609.plus.aac.p.m4a",
    ytId: "KIGf1g-HPXM",
  },
  {
    id: 13, title: "Apna Bana Le", artist: "Arijit Singh", album: "Bhediya",
    duration: "4:21", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/2e/0b/c0/2e0bc070-112f-a827-6ad8-6bc64f7caaff/840214460180.png/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/09/51/0d/09510dea-6579-5cd0-b13b-696abc2c520b/mzaf_10718921821360997069.plus.aac.p.m4a",
    ytId: "BFZOL0kMDCQ",
  },
  {
    id: 14, title: "Peaches", artist: "Justin Bieber", album: "Justice",
    duration: "3:18", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e0/92/da/e092da2d-9f6d-11dc-7843-2021e95a2b61/21UMGIM17518.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c9/6d/b1/c96db138-df15-d3d1-ef9d-98ef9d350960/mzaf_9411021956242812289.plus.aac.p.m4a",
    ytId: "tQ0yjYUFBRY",
  },
  {
    id: 15, title: "Stay", artist: "The Kid LAROI", album: "STAY - Single",
    duration: "2:21", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/89/59/6a/89596ab9-fa3c-8d08-4d95-a6450fa2013c/886449400515.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d7/4a/84/d74a84d5-9afa-761e-b632-baab55c2a23b/mzaf_11865500880477235553.plus.aac.p.m4a",
    ytId: "kTJczUoc26U",
  },
  {
    id: 16, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line",
    duration: "2:54", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/16/86/f5/1686f50d-8b77-7e32-85f7-5f0e804d68fe/mzaf_14195633304344507287.plus.aac.p.m4a",
    ytId: "E07s5ZYygMg",
  },
  {
    id: 17, title: "Kho Gaye Hum Kahan", artist: "Jasleen Royal", album: "Baar Baar Dekho",
    duration: "3:33", genre: "nostalgic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/14/b8/58/14b85883-40a4-0a2e-de65-130f55726ee6/840780180390.png/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/22/e9/56/22e95688-b15a-cd1d-8469-9451231ec849/mzaf_11658240031865818317.plus.aac.p.m4a",
    ytId: "VuNIsY6JdUw",
  },
  {
    id: 18, title: "Clouds", artist: "NF", album: "Clouds (The Mixtape)",
    duration: "4:03", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c2/38/87/c23887b2-b0db-6962-61ac-203f801c5fa3/21UMGIM08880.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/48/36/e8/4836e873-d559-6c80-ae73-81e29ecd5419/mzaf_535068330273907360.plus.aac.p.m4a",
    ytId: "fKopy74weus",
  },
  {
    id: 19, title: "Dynamite", artist: "BTS", album: "Dynamite",
    duration: "3:19", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/03/8d/0e/038d0e52-e96d-f386-b8eb-9f77fa013543/195497146918_Cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/3b/f2/5c/3bf25cc9-a395-6858-1ef8-5c29956afaf6/mzaf_6007556042949037280.plus.aac.p.m4a",
    ytId: "gdZLi9oWNZg",
  },
  {
    id: 20, title: "Dil Diyan Gallan", artist: "Atif Aslam", album: "Tiger Zinda Hai",
    duration: "4:20", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/ed/d5/5f/edd55f3a-f161-82f4-6358-4f4a9faee290/Pyaar-Forever.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d0/34/2c/d0342c5b-e147-a636-3896-c92e671dfbeb/mzaf_1675700178565358038.plus.aac.p.m4a",
    ytId: "p8oMFrBE3VU",
  },
  {
    id: 21, title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", album: "Kabir Singh",
    duration: "4:44", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f6/70/84/f6708434-0123-ff36-0ac3-7401e8cf0f94/8902894360807_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/16/6b/75/166b752b-c288-d978-54f2-ae6bb8368346/mzaf_8053064283423859432.plus.aac.p.m4a",
    ytId: "2IGDsD-dLF8",
  },
  {
    id: 22, title: "Hawayein", artist: "Arijit Singh", album: "Jab Harry Met Sejal",
    duration: "4:50", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/41/aa/e3/41aae321-0a81-2762-e0eb-c60844109fe7/886446683584.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/15/d1/a8/15d1a862-edcd-6a92-624a-2bbf0f7eff26/mzaf_7165241817401822857.plus.aac.p.m4a",
    ytId: "cYOB46DRoQM",
  },
  {
    id: 23, title: "Kal Ho Naa Ho", artist: "Sonu Nigam", album: "Kal Ho Naa Ho",
    duration: "5:21", genre: "nostalgic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/fb/82/da/fb82dab1-d0cd-714c-000c-6450774fd5d4/888880945587.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f2/dc/3d/f2dc3d30-c133-b7db-b78f-235c1439f1f2/mzaf_956586774622856416.plus.aac.p.m4a",
    ytId: "4BFp8NIsKgs",
  },
  {
    id: 24, title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", album: "Dil Se",
    duration: "6:47", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8e/f8/85/8ef88544-a6c7-018b-0a75-dc3b6b024fa0/cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/81/6c/e7/816ce721-3a37-0e57-3aa7-c3e180c4b38c/mzaf_10595670915474775723.plus.aac.p.m4a",
    ytId: "5RMHo4FXLBQ",
  },
  {
    id: 25, title: "Gerua", artist: "Arijit Singh", album: "Dilwale",
    duration: "5:45", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/dd/c8/ee/ddc8ee1d-baeb-0c8b-383f-1eb21bd172c2/886445593280.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/6e/24/bf6e24d8-d4d5-1cac-adc6-4a0fc07e98da/mzaf_14186979808495752044.plus.aac.p.m4a",
    ytId: "AEIVhBS6baE",
  },
  {
    id: 26, title: "Bulleya", artist: "Amit Mishra", album: "Ae Dil Hai Mushkil",
    duration: "5:48", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/43/3c/7a/433c7a84-116b-4001-115e-c8e34d57ebd0/886446235608.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f7/fb/eb/f7fbebc2-79ac-cc39-511f-1fdf1bc223db/mzaf_16891051135732880107.plus.aac.p.m4a",
    ytId: "LPMkbRHMMAw",
  },
  {
    id: 27, title: "Channa Mereya", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil",
    duration: "4:49", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bc/6e/4d/bc6e4d0c-adec-b431-7b60-16f5689f9664/886446201597.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a",
    ytId: "256FMqGioGU",
  },
  {
    id: 28, title: "Bekhayali", artist: "Sachet Tandon", album: "Kabir Singh",
    duration: "6:11", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f6/70/84/f6708434-0123-ff36-0ac3-7401e8cf0f94/8902894360807_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/f1/8a/4ef18aa3-53a5-7ced-f887-b537d4adf0eb/mzaf_16713780536711201262.plus.aac.p.m4a",
    ytId: "IGBDZ-hEHDI",
  },
  {
    id: 29, title: "Kalank", artist: "Arijit Singh", album: "Kalank",
    duration: "5:11", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4e/39/49/4e3949f3-d59d-4295-4bb2-036269f9a88f/8718857678083.png/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/54/a5/d154a507-0ea3-a241-5312-82f7564b8498/mzaf_7818007274725956449.plus.aac.p.m4a",
    ytId: "z6rHDnEYKMo",
  },
  {
    id: 30, title: "Jaadu Hai Nasha", artist: "Shreya Ghoshal", album: "Jism",
    duration: "5:28", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/b9/68/f1/b968f1c3-e618-7781-0c4c-2451cf59f716/191773226374.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/27/bd/11/27bd11b5-7330-f916-36b8-de05a53d4d3b/mzaf_5503816380802197483.plus.aac.p.m4a",
    ytId: "v8dqC0ESIHY",
  },
  // â”€â”€ Hollywood â”€â”€
  {
    id: 31, title: "Shape of You", artist: "Ed Sheeran", album: "÷",
    duration: "3:53", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a",
    ytId: "JGwWNGJdvx8",
  },
  {
    id: 32, title: "Someone Like You", artist: "Adele", album: "21",
    duration: "4:45", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/ca/25/ebca2596-cd1e-b295-91a3-771c868d0a79/191404113868.png/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ef/18/7b/ef187b7d-f487-e935-4ca1-af5748313710/mzaf_8455263230305249048.plus.aac.p.m4a",
    ytId: "hLQl3WQQoQ0",
  },
  {
    id: 33, title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour",
    duration: "2:52", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/80/74/b6/8074b6bc-387f-6cc9-5ede-92b76396ad5f/13UAEIM58958.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d8/90/ef/d890ef3d-95b8-2224-5ff2-4ed56a359449/mzaf_8285804271834164275.plus.aac.p.m4a",
    ytId: "pB-5XG-DbAA",
  },
  {
    id: 34, title: "Perfect", artist: "Ed Sheeran", album: "÷",
    duration: "4:23", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a",
    ytId: "2Vv-BfVoq4g",
  },
  {
    id: 35, title: "Cheap Thrills", artist: "Sia", album: "This Is Acting",
    duration: "3:31", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bc/13/27/bc13275c-8b26-802d-771b-d15ae00fb530/mzm.hvpwjsvi.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/89/73/fb/8973fb2c-5417-e56b-30f1-bf5035bb46a2/mzaf_5922398524297774212.plus.aac.p.m4a",
    ytId: "nviOTGECizA",
  },
  {
    id: 36, title: "Sunflower", artist: "Post Malone & Swae Lee", album: "Spider-Man: Into the Spider-Verse",
    duration: "2:38", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a",
    ytId: "ApXoWvfEYVU",
  },
  {
    id: 37, title: "bad guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP",
    duration: "3:14", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c3/87/1f/c3871f7e-3260-d615-1c66-5fdca2c3a48f/mzaf_10721331211699880949.plus.aac.p.m4a",
    ytId: "DyDfgMOUjCI",
  },
  {
    id: 38, title: "drivers license", artist: "Olivia Rodrigo", album: "SOUR",
    duration: "4:02", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/02/ed/8c/02ed8cab-c089-2fdd-7ce6-ab334a9a4e19/21UMGIM26093.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/36/62/61/366261be-0996-d73d-de6f-03417867c800/mzaf_8201528327761821135.plus.aac.p.m4a",
    ytId: "ZmDBbnmKpqQ",
  },
  {
    id: 39, title: "Love Story (Taylor's Version)", artist: "Taylor Swift", album: "Fearless",
    duration: "3:55", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/d0/1c/c3d01c88-73e7-187e-fd62-e1744de979a6/21UMGIM09915.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8b/4c/b3/8b4cb3a5-b1d1-c82c-e6ab-48cc3969d4ff/mzaf_858711921713575608.plus.aac.p.m4a",
    ytId: "8xg3vE8Ie_E",
  },
  {
    id: 40, title: "A Sky Full of Stars", artist: "Coldplay", album: "Ghost Stories",
    duration: "4:28", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/60/90/ad/6090adc3-8863-861d-afcc-23c55c6fe5da/dj.vmtulfyu.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a2/31/4b/a2314b97-10b6-190c-72b3-45cc21bbf56b/mzaf_740612971315603868.plus.aac.p.m4a",
    ytId: "VPRjCeoBqrI",
  },
  {
    id: 41, title: "Tere Naam", artist: "Udit Narayan", album: "Tere Naam",
    duration: "6:33", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cb/8f/47/cb8f4723-8f20-1e1c-dcef-c8eb8ddf0663/8902894116473_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ae/f6/21/aef62116-024c-fcbc-9c1e-a06b3d4722f6/mzaf_12419649710757497754.plus.aac.p.m4a",
    ytId: "RdXuNmTHHsI",
  },
  {
    id: 42, title: "Suraj Hua Maddham", artist: "Sonu Nigam", album: "Kabhi Khushi Kabhie Gham",
    duration: "7:07", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/86/d3/96/86d396fd-9230-aab9-115b-bada9149d8de/888880945778.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6f/2b/a6/6f2ba694-ce02-553f-43f4-38e5d8c89343/mzaf_7581777528418496325.plus.aac.p.m4a",
    ytId: "K8oi4i_pjSU",
  },
  {
    id: 43, title: "Abhi Mujh Mein Kahin", artist: "Sonu Nigam", album: "Agneepath",
    duration: "6:04", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ec/25/8a/ec258a58-4047-3a3e-9da4-9dcad1157c79/886443303317.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/d8/d1/c7d8d1a5-6c24-0175-cfef-e5b5b836b70c/mzaf_12991514154981661781.plus.aac.p.m4a",
    ytId: "AziHOFKOeoE",
  },
  {
    id: 44, title: "Ilahi", artist: "Arijit Singh", album: "Yeh Jawaani Hai Deewani",
    duration: "3:49", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/62/d6/74/62d67432-0670-631f-db6a-d4bac3adae4b/8902894353328_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/75/27/64/75276455-6751-e9d7-1187-b863a2ffefbc/mzaf_4313837125483855343.plus.aac.p.m4a",
    ytId: "gGPCBCXZKyQ",
  },
  {
    id: 45, title: "Phir Le Aya Dil", artist: "Arijit Singh", album: "Barfi!",
    duration: "5:05", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5b/65/4a/5b654a60-886f-8bbf-2f39-5ea0dacb8022/886443625099.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7f/f5/d8/7ff5d850-871d-6621-2b74-3a772a6eec89/mzaf_52696194311988270.plus.aac.p.m4a",
    ytId: "aOqZWlbNi_U",
  },
  {
    id: 46, title: "Kun Faya Kun", artist: "A.R. Rahman", album: "Rockstar",
    duration: "7:50", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/56/ac/41/56ac41f7-99f3-3eae-3b07-443167292c4e/8902894697408_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2e/99/e2/2e99e2ff-1d1b-615c-9d87-1cd3b122ad7f/mzaf_4773314624008046164.plus.aac.p.m4a",
    ytId: "T94PHkuydcw",
  },
  {
    id: 47, title: "Chahun Main Ya Naa", artist: "Arijit Singh", album: "Aashiqui 2",
    duration: "5:04", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/84/e6/9884e681-7b2f-a595-5330-074faac79083/mzaf_10012111022445165401.plus.aac.p.m4a",
    ytId: "I_2D8Ent7oQ",
  },
  {
    id: 48, title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil",
    duration: "4:29", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bc/6e/4d/bc6e4d0c-adec-b431-7b60-16f5689f9664/886446201597.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/4d/5f/114d5f2e-795e-67e0-0d33-b28045ef668a/mzaf_3719171959426225060.plus.aac.p.m4a",
    ytId: "6FURuLYzR8Q",
  },
  {
    id: 49, title: "Pehla Nasha", artist: "Udit Narayan", album: "Jo Jeeta Wohi Sikandar",
    duration: "4:51", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/c9/3a/96c93aa7-1872-8297-493a-2fc72d540af0/191773221072.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/3c/41/d6/3c41d678-54cd-bc22-bb66-928c4e584f54/mzaf_11991940136628253012.plus.aac.p.m4a",
    ytId: "q2OEBjJ6M0g",
  },
  {
    id: 50, title: "Saware", artist: "Arijit Singh", album: "Phantom",
    duration: "5:21", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/37/25/cb/3725cb72-772e-a30b-129e-78248d277295/8902894357265_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/f9/d0/0a/f9d00a40-c6cd-c0b7-36e3-128d356e0ab7/mzaf_6181596526954773930.plus.aac.p.m4a",
    ytId: "9vGYFUF1YuY",
  },
  {
    id: 51, title: "Fix You", artist: "Coldplay", album: "X&Y",
    duration: "4:54", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0c/82/48/0c8248a8-4a5b-d30d-8056-f32d650d2fc9/190295978068.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/42/e3/e542e340-a45c-695e-e0b8-6155e222ebc0/mzaf_14955746616030397665.plus.aac.p.m4a",
    ytId: "k4V3Mo61fJM",
  },
  {
    id: 52, title: "Let Her Go", artist: "Passenger", album: "All the Little Lights",
    duration: "4:12", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9b/7e/28/9b7e2896-e049-1663-6791-e0111690ffc1/067003051361.png/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/1c/93/e5/1c93e5ed-eadc-effc-093a-cbaadc17f897/mzaf_16074705324618158471.plus.aac.p.m4a",
    ytId: "RBumgq5yVrA",
  },
  {
    id: 53, title: "Counting Stars", artist: "OneRepublic", album: "Native",
    duration: "4:17", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/25/46/a7/2546a71a-b2bb-b4c9-4c52-a4daa3ae23ca/13UMGIM15076.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b0/db/7f/b0db7fbe-f8ff-1f67-fe72-ca8185ffbca2/mzaf_15298650366584767800.plus.aac.p.m4a",
    ytId: "hT_nvWreIhg",
  },
  {
    id: 54, title: "Rolling in the Deep", artist: "Adele", album: "21",
    duration: "3:48", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/ca/25/ebca2596-cd1e-b295-91a3-771c868d0a79/191404113868.png/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9f/07/1d/9f071dc7-791c-c869-dfa2-06b25936a287/mzaf_11077490630806345321.plus.aac.p.m4a",
    ytId: "rYEDA3JcQqw",
  },
  {
    id: 55, title: "Thunder", artist: "Imagine Dragons", album: "Evolve",
    duration: "3:07", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/7d/8b/787d8b89-7b57-d3bc-1f9d-6378fad1b4f5/mzaf_5131352572683029126.plus.aac.p.m4a",
    ytId: "fKopy74weus",
  },
  {
    id: 56, title: "Believer", artist: "Imagine Dragons", album: "Evolve",
    duration: "3:24", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c0/3f/36/c03f367a-b66b-fd0a-a54c-30f8250c4410/mzaf_12768434238801682952.plus.aac.p.m4a",
    ytId: "7wtfhZwyrcc",
  },
  {
    id: 57, title: "Demons", artist: "Imagine Dragons", album: "Night Visions",
    duration: "2:57", genre: "sad",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/1f/fa/09/1ffa092f-f52f-4a66-7d10-4cc5982dc747/12UMGIM46901.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fc/d4/e8/fcd4e814-39f4-19e8-f421-c2d269698025/mzaf_1039703479531920971.plus.aac.p.m4a",
    ytId: "mWRsgZuwf_8",
  },
  {
    id: 58, title: "Happier", artist: "Marshmello & Bastille", album: "Happier",
    duration: "3:34", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e5/61/69/e561696f-40c5-19c1-ec6d-5b2dfaa919f2/21.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fb/3f/e6/fb3fe69b-1f83-dae3-ad86-34b73a50e86c/mzaf_12086156071273718688.plus.aac.p.m4a",
    ytId: "m7Qgoj_oIMo",
  },
  {
    id: 59, title: "Memories", artist: "Maroon 5", album: "Memories",
    duration: "3:09", genre: "nostalgic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/22/58/58/225858c4-ef47-2b91-723a-47af3e99699a/19UMGIM64502.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/48/db/6b/48db6b78-cdb7-5b3f-1b4d-dfec435a513d/mzaf_11078616836226327327.plus.aac.p.m4a",
    ytId: "SlPhMPnQ58k",
  },
  {
    id: 60, title: "Sugar", artist: "Maroon 5", album: "V",
    duration: "3:55", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/b7/25/76/b72576f1-072e-3da2-60d5-2724a9bccf4a/14UMGIM31673.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1b/3f/68/1b3f68e0-3c42-f367-cd0f-e46c746e0668/mzaf_15052021441666328650.plus.aac.p.m4a",
    ytId: "09R8_2nJtjg",
  },
  {
    id: 61, title: "Tera Yaar Hoon Main", artist: "Arijit Singh", album: "Sonu Ke Titu Ki Sweety",
    duration: "4:24", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/81/a5/b0/81a5b084-89f7-7ed8-372e-aefd67504922/8902894360074_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/26/50/442650b7-256e-034a-380a-4bbf16e59e53/mzaf_272051127111758324.plus.aac.p.m4a",
    ytId: "LHexdkFHpOs",
  },
  {
    id: 62, title: "Dil Bechara", artist: "A.R. Rahman", album: "Dil Bechara",
    duration: "2:43", genre: "nostalgic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0e/21/78/0e217886-b262-3ed2-ae72-c2c9fbf35e85/886448629870.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/dc/29/73/dc297334-32f9-276c-8ae5-c6693ef9cd6d/mzaf_14872813319128549391.plus.aac.p.m4a",
    ytId: "rbOcXGFMiLg",
  },
  {
    id: 63, title: "Main Tera Boyfriend", artist: "Arijit Singh", album: "Raabta",
    duration: "4:36", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9b/83/b4/9b83b42b-0716-95cf-60f3-701ec9464ada/8902894359023_cover.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/b1/c7/edb1c7ce-fb78-2d44-de5b-8dc8d9c37c78/mzaf_13333900350647505230.plus.aac.p.m4a",
    ytId: "IHmqFGaZE_E",
  },
  {
    id: 64, title: "City of Stars", artist: "Ryan Gosling & Emma Stone", album: "La La Land",
    duration: "2:29", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/bb/47/a3/bb47a36e-57b8-9260-f9a4-d09851145c45/00602557100556.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c7/fa/ce/c7face67-3ff9-9b8e-2932-0a5db69ad051/mzaf_6269194343571084138.plus.aac.p.m4a",
    ytId: "U5ThfDCFBzk",
  },
  {
    id: 65, title: "Until I Found You", artist: "Stephen Sanchez", album: "Until I Found You",
    duration: "2:57", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/64/d2/c5/64d2c511-67f4-ae09-5153-d39c3da413a3/21UMGIM75467.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/53/82/c1/5382c1d4-ddba-aa2b-90df-57268895fac9/mzaf_8926201202931541051.plus.aac.p.m4a",
    ytId: "eBGIQ9ZdKH8",
  },
  {
    id: 66, title: "Golden Hour", artist: "Kacey Musgraves", album: "Golden Hour",
    duration: "3:18", genre: "chill",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/61/45/e8/6145e88a-6a79-fab1-ad8f-5ffdcbf44a28/18UMGIM03879.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/13/b0/60/13b0606a-c0b0-cb0b-1ad6-99b0ee1cfdde/mzaf_16374977868908357245.plus.aac.p.m4a",
    ytId: "atxUuldUcfI",
  },
  {
    id: 67, title: "Dance Monkey", artist: "Tones And I", album: "The Kids Are Coming",
    duration: "3:29", genre: "hype",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/87/ed/42/87ed4279-d8d7-840f-90b5-2bffe34699ef/075679839237.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/43/1a/32/431a3203-7e62-c7b1-0377-824aded16096/mzaf_7471896698419931094.plus.aac.p.m4a",
    ytId: "q0hyYWKXF0Q",
  },
  {
    id: 68, title: "Señorita", artist: "Shawn Mendes & Camila Cabello", album: "Señorita",
    duration: "3:10", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/46/fe/4a/46fe4a39-feb4-7b8b-97b9-0187d49a46bd/19UMGIM53914.rgb.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cf/06/d6/cf06d6fd-f7a0-2898-8363-67688df6c14f/mzaf_8234301186390421644.plus.aac.p.m4a",
    ytId: "Pkh8UtuejGw",
  },
  {
    id: 69, title: "Yellow", artist: "Coldplay", album: "Parachutes",
    duration: "4:29", genre: "romantic",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg",
    file: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/f3/1a/66f31a76-a6ed-cb4c-f353-23310a7ae9a8/mzaf_10593596652344378873.plus.aac.p.m4a",
    ytId: "yKNxeF4KMsY",
  },
];

export const GENRES = ["romantic", "sad", "hype", "chill", "nostalgic"] as const;

export const GENRE_GRADIENTS: Record<string, string> = {
  romantic:  "from-pink-600 to-rose-400",
  sad:       "from-blue-800 to-indigo-500",
  hype:      "from-orange-600 to-yellow-400",
  chill:     "from-teal-700 to-emerald-400",
  nostalgic: "from-amber-700 to-orange-400",
};

export const GENRE_EMOJIS: Record<string, string> = {
  romantic:  "❤️",
  sad:       "🌙",
  hype:      "🔥",
  chill:     "🌊",
  nostalgic: "✨",
};

export function getSongsByGenre(genre: string): Song[] {
  return songs.filter(s => s.genre === genre);
}

export function getSongById(id: number): Song | undefined {
  return songs.find(s => s.id === id);
}

export function parseDuration(duration: string): number {
  const [m, s] = duration.split(":").map(Number);
  return m * 60 + s;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songIds: number[];
  vibeColor: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  response: string;
  playlistName: string;
  songIds: number[];
  vibeColor: string;
  createdAt: string;
}
