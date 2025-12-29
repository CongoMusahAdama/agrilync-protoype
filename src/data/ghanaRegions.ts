export const GHANA_REGIONS: Record<string, string[]> = {
    "Ashanti Region": [
        "Adansi Asokwa", "Adansi North", "Adansi South", "Afigya Kwabre North", "Afigya Kwabre South",
        "Asante Akim Central", "Asante Akim North", "Asante Akim South", "Atwima Kwanwoma", "Atwima Mponua",
        "Atwima Nwabiagya North", "Atwima Nwabiagya South", "Bekwai Municipal", "Bosome Freho", "Bosomtwe",
        "Ejisu Municipal", "Ejura Sekyedumase", "Kumasi Metropolitan", "Kwabre East", "Mampong Municipal",
        "Obuasi East", "Obuasi Municipal", "Offinso Municipal", "Offinso North", "Sekyere Afram Plains",
        "Sekyere Central", "Sekyere East", "Sekyere Kumawu", "Sekyere South", "Suame Municipal"
    ],
    "Eastern Region": [
        "Abuakwa North", "Abuakwa South", "Akuapem North", "Akuapem South", "Akyemansa", "Asene Manso Akroso",
        "Atiwa East", "Atiwa West", "Ayensuano", "Birim Central", "Birim North", "Birim South", "Denkyembour",
        "Fanteakwa North", "Fanteakwa South", "Kwahu Afram Plains North", "Kwahu Afram Plains South",
        "Kwahu East", "Kwahu South", "Kwahu West Municipal", "Lower Manya Krobo", "New Juaben North Municipal",
        "New Juaben South Municipal", "Nsawam Adoagyiri Municipal", "Okere", "Suhum Municipal",
        "Upper Manya Krobo", "Upper West Akim", "West Akim", "Yilo Krobo Municipal"
    ],
    "Volta Region": [
        "Adaklu", "Afadzato South", "Agotime Ziope", "Akatsi North", "Akatsi South", "Anloga", "Central Tongu",
        "Ho Municipal", "Ho West", "Hohoe Municipal", "Keta Municipal", "Ketu North Municipal", "Ketu South Municipal",
        "Krachi East", "Krachi Nchumuru", "Krachi West", "Nkwanta North", "Nkwanta South", "North Dayi",
        "North Tongu", "South Dayi", "South Tongu"
    ],
    "Northern Region": [
        "Gushegu Municipal", "Karaga", "Kpandai", "Kumbungu", "Mion", "Nanton", "Nanumba North Municipal",
        "Nanumba South", "Saboba", "Sagnarigu Municipal", "Savelugu Municipal", "Tamale Metropolitan",
        "Tatale Sanguli", "Tolon", "Yendi Municipal", "Zabzugu"
    ],
    "Central Region": [
        "Abura Asebu Kwamankese", "Agona East", "Agona West Municipal", "Ajumako Enyan Essiam",
        "Asikuma Odoben Brakwa", "Assin Central Municipal", "Assin North", "Awutu Senya East Municipal",
        "Awutu Senya West", "Cape Coast Metropolitan", "Effutu Municipal", "Ekumfi", "Gomoa Central",
        "Gomoa East", "Gomoa West", "Komenda Edina Eguafo Abirem Municipal", "Mfantseman Municipal",
        "Twifo Atti Morkwa", "Twifo Hemang Lower Denkyira", "Upper Denkyira East Municipal", "Upper Denkyira West"
    ],
    "Western Region": [
        "Ahanta West", "Amenfi Central", "Amenfi East Municipal", "Amenfi West", "Effia Kwesimintsim Municipal",
        "Ellembelle", "Jomoro", "Mpohor", "Nzema East Municipal", "Prestea Huni Valley Municipal",
        "Sekondi-Takoradi Metropolitan", "Shama", "Tarkwa Nsuaem Municipal", "Wassa Amenfi North Municipal",
        "Wassa Amenfi South", "Wassa East"
    ],
    "Bono Region": [
        "Banda", "Berekum East Municipal", "Berekum West", "Dormaa Central Municipal", "Dormaa East",
        "Dormaa West", "Jaman North", "Jaman South Municipal", "Sunyani Municipal", "Sunyani West",
        "Tain", "Wenchi Municipal"
    ]
};

export const GHANA_LANGUAGES: Record<string, string[]> = {
    "Ashanti Region": ["Twi", "English", "Hausa"],
    "Eastern Region": ["Twi", "Krobo", "English", "Ewe", "Hausa"],
    "Volta Region": ["Ewe", "English", "Twi"],
    "Northern Region": ["Dagbani", "English", "Hausa", "Twi"],
    "Central Region": ["Fante", "Twi", "English"],
    "Western Region": ["Fante", "Nzema", "Wassa", "English", "Twi"],
    "Bono Region": ["Bono", "Twi", "English"],
    "Greater Accra": ["Ga", "Twi", "English", "Ewe", "Dangme"],
    "Upper East": ["Gurune (Frafra)", "Kusaal", "English", "Hausa"],
    "Upper West": ["Dagaare", "Waala", "English", "Hausa"],
    "Western North": ["Sefwi", "English", "Twi"],
    "Ahafo": ["Bono", "Twi", "English"],
    "Bono East": ["Bono", "Twi", "English"],
    "Oti": ["Ewe", "Adele", "Nchumuru", "English"],
    "Savannah": ["Gonja", "English", "Twi"],
    "North East": ["Mamprusi", "English", "Hausa"]
};

export const GHANA_COMMUNITIES: Record<string, string[]> = {
    // Ashanti Region
    "Adansi Asokwa": ["Adansi Asokwa", "Bodwesango", "Fumso", "Other (Specify)"],
    "Adansi North": ["Fomena", "Dompoase", "Akrokerri", "Other (Specify)"],
    "Adansi South": ["New Edubiase", "Anhwiaso", "Kusa", "Other (Specify)"],
    "Afigya Kwabre North": ["Boamang", "Afrancho", "Barekese", "Other (Specify)"],
    "Afigya Kwabre South": ["Kodie", "Nsuta", "Atimatim", "Other (Specify)"],
    "Asante Akim Central": ["Konongo", "Odumase", "Juaso", "Other (Specify)"],
    "Asante Akim North": ["Agogo", "Hwidiem", "Nyinatokrom", "Other (Specify)"],
    "Asante Akim South": ["Juaben", "Bompata", "Ahyiayem", "Other (Specify)"],
    "Atwima Kwanwoma": ["Foase", "Abira", "Adanwomase", "Other (Specify)"],
    "Atwima Mponua": ["Nyinahin", "Tano Odumase", "Abuakwa", "Other (Specify)"],
    "Atwima Nwabiagya North": ["Barekese", "Abuakwa", "Asuofua", "Other (Specify)"],
    "Atwima Nwabiagya South": ["Nkawie", "Toase", "Mpasatia", "Other (Specify)"],
    "Bekwai Municipal": ["Bekwai", "Anwiankwanta", "Amoafo", "Other (Specify)"],
    "Bosome Freho": ["Asiwa", "Freho", "Nsuta", "Other (Specify)"],
    "Bosomtwe": ["Kuntanase", "Abono", "Jachie", "Other (Specify)"],
    "Ejisu Municipal": ["Ejisu", "Besease", "Fumesua", "Other (Specify)"],
    "Ejura Sekyedumase": ["Ejura", "Sekyedumase", "Hiawoanwu", "Babaso", "Other (Specify)"],
    "Kumasi Metropolitan": ["Asokwa", "Suame", "Bantama", "Tafo", "Other (Specify)"],
    "Kwabre East": ["Mamponteng", "Asonomaso", "Antoa", "Other (Specify)"],
    "Mampong Municipal": ["Mampong", "Kyeremfaso", "Krobo", "Other (Specify)"],
    "Obuasi Municipal": ["Obuasi", "Anyinam", "Sanso", "Other (Specify)"],
    "Offinso Municipal": ["Offinso", "Akomadan", "Afrancho", "Other (Specify)"],
    "Offinso North": ["Akomadan", "Afrancho", "Nkenkaasu", "Other (Specify)"],
    "Sekyere Afram Plains": ["Drobonso", "Kumawu", "Anyinasu", "Other (Specify)"],
    "Sekyere Central": ["Nsuta", "Kona", "Beposo", "Other (Specify)"],
    "Sekyere East": ["Effiduase", "Asokore", "Aboaso", "Other (Specify)"],
    "Sekyere Kumawu": ["Kumawu", "Besoro", "Woraso", "Other (Specify)"],
    "Sekyere South": ["Agona", "Wiamoase", "Jamasi", "Other (Specify)"],
    "Suame Municipal": ["Suame", "Maakro", "Aboabo", "Other (Specify)"],

    // Eastern Region
    "Abuakwa North": ["Kukurantumi", "Kyebi", "Osiem", "Other (Specify)"],
    "Abuakwa South": ["Kyebi", "Apedwa", "Akwadum", "Other (Specify)"],
    "Akuapem North": ["Akropong", "Mampong", "Aburi", "Other (Specify)"],
    "Akuapem South": ["Nsawam", "Dodowa", "Ayikuma", "Other (Specify)"],
    "Suhum Municipal": ["Suhum", "Nankese", "Akyem Asuboa", "Other (Specify)"],
    "New Juaben North": ["Koforidua", "Effiduase", "Jumapo", "Other (Specify)"],
    "New Juaben South": ["Koforidua", "Oyoko", "Adweso", "Other (Specify)"],
    "Kwahu Afram Plains North": ["Donkorkrom", "Tease", "Adawso", "Other (Specify)"],
    "Kwahu Afram Plains South": ["Tease", "Maame Krobo", "Kwahu Tafo", "Other (Specify)"],

    // Volta Region
    "Ho Municipal": ["Ho", "Sokode", "Abutia", "Other (Specify)"],
    "Hohoe Municipal": ["Hohoe", "Alavanyo", "Likpe", "Other (Specify)"],
    "Ketu North Municipal": ["Dzodze", "Penyi", "Aflao-Tornu", "Other (Specify)"],
    "Ketu South Municipal": ["Aflao", "Klikor", "Some", "Other (Specify)"],

    // Northern Region
    "Tamale Metropolitan": ["Tamale", "Jisonayili", "Vittin", "Other (Specify)"],
    "Savelugu Municipal": ["Savelugu", "Pong-Tamale", "Diare", "Other (Specify)"],
    "Yendi Municipal": ["Yendi", "Gbungbaliga", "Malzeri", "Other (Specify)"],

    // Central Region
    "Abura Asebu Kwamankese": ["Abura Dunkwa", "Abakrampa", "Asebu", "Kwamankese", "Other (Specify)"],
    "Agona East": ["Nsaba", "Duakwa", "Abodom", "Other (Specify)"],
    "Agona West Municipal": ["Agona Swedru", "Nyakrom", "Bobikuma", "Other (Specify)"],
    "Ajumako Enyan Essiam": ["Ajumako", "Enyan Denkyira", "Essiam", "Other (Specify)"],
    "Asikuma Odoben Brakwa": ["Breman Asikuma", "Odoben", "Brakwa", "Other (Specify)"],
    "Assin Central Municipal": ["Assin Fosu", "Assin Bereku", "Assin Nyankomasi", "Other (Specify)"],
    "Assin North": ["Assin Praso", "Assin Akropong", "Assin Dansame", "Other (Specify)"],
    "Awutu Senya East Municipal": ["Kasoa", "Ofankor", "Oduponkpehe", "Other (Specify)"],
    "Awutu Senya West": ["Bawjiase", "Bontrase", "Senya Beraku", "Other (Specify)"],
    "Cape Coast Metropolitan": ["Cape Coast", "Abura", "Pedu", "Other (Specify)"],
    "Effutu Municipal": ["Winneba", "Gyangyanadze", "New Winneba", "Other (Specify)"],
    "Ekumfi": ["Ekumfi Essarkyir", "Ekumfi Akwakrom", "Ekumfi Otuam", "Other (Specify)"],
    "Gomoa Central": ["Gomoa Afransi", "Gomoa Tarkwa", "Gomoa Nyanyano", "Other (Specify)"],
    "Gomoa East": ["Gomoa Buduburam", "Gomoa Fetteh", "Ojobi", "Other (Specify)"],
    "Gomoa West": ["Apam", "Mumford", "Gomoa Onyadze", "Other (Specify)"],
    "Komenda Edina Eguafo Abirem Municipal": ["Elmina", "Komenda", "Eguafo", "Other (Specify)"],
    "Mfantseman Municipal": ["Saltpond", "Anomabo", "Mankessim", "Other (Specify)"],
    "Twifo Atti Morkwa": ["Twifo Praso", "Atti Morkwa", "Hemang", "Other (Specify)"],
    "Twifo Hemang Lower Denkyira": ["Hemang", "Jukwa", "Mfuom", "Other (Specify)"],
    "Upper Denkyira East Municipal": ["Dunkwa-on-Offin", "Ayanfuri", "Diaso", "Other (Specify)"],
    "Upper Denkyira West": ["Diaso", "Subinso", "Ntom", "Other (Specify)"],

    // Western Region
    "Ahanta West": ["Agona Nkwanta", "Busua", "Dixcove", "Other (Specify)"],
    "Amenfi Central": ["Wassa Akropong", "Manso Amenfi", "Kwamang", "Other (Specify)"],
    "Amenfi East Municipal": ["Wassa Akropong", "Asankrangwa", "Dominase", "Other (Specify)"],
    "Amenfi West": ["Asankrangwa", "Samreboi", "Wassa Dunkwa", "Other (Specify)"],
    "Effia Kwesimintsim Municipal": ["Kwesimintsim", "Effia", "Anaji", "Other (Specify)"],
    "Ellembelle": ["Nkroful", "Esiama", "Teleku Bokazo", "Other (Specify)"],
    "Jomoro": ["Half Assini", "Elubo", "Tikobo No.1", "Other (Specify)"],
    "Mpohor": ["Mpohor", "Akwidae", "Subri", "Other (Specify)"],
    "Nzema East Municipal": ["Axim", "Asanta", "Agyambra", "Other (Specify)"],
    "Prestea Huni Valley Municipal": ["Prestea", "Huni Valley", "Bogoso", "Other (Specify)"],
    "Sekondi–Takoradi Metropolitan": ["Sekondi", "Takoradi", "New Takoradi", "Other (Specify)"],
    "Shama": ["Shama", "Abuesi", "Inchaban", "Other (Specify)"],
    "Tarkwa Nsuaem Municipal": ["Tarkwa", "Nsuaem", "Tamso", "Other (Specify)"],
    "Wassa Amenfi North Municipal": ["Asankrangwa", "Samreboi", "Kramokrom", "Other (Specify)"],
    "Wassa Amenfi South": ["Agona Amenfi", "Manso Amenfi", "Kwamang", "Other (Specify)"],
    "Wassa East": ["Daboase", "Dompim", "Aboi", "Other (Specify)"],

    // Bono Region
    "Banda": ["Banda Ahenkro", "Banda Nkwanta", "Bui", "Other (Specify)"],
    "Berekum East Municipal": ["Berekum", "Senase", "Jamdede", "Other (Specify)"],
    "Berekum West": ["Jinijini", "Fetentaa", "Kato", "Other (Specify)"],
    "Dormaa Central Municipal": ["Dormaa Ahenkro", "Wamfie", "Kyeremasu", "Other (Specify)"],
    "Dormaa East": ["Wamfie", "Asuotiano", "Amasu", "Other (Specify)"],
    "Dormaa West": ["Nkrankwanta", "Diabaa", "Kwakuanya", "Other (Specify)"],
    "Jaman North": ["Sampa", "Goka", "Duadaso", "Other (Specify)"],
    "Jaman South Municipal": ["Drobo", "Japekrom", "Adamsu", "Other (Specify)"],
    "Sunyani Municipal": ["Sunyani", "Abesim", "New Dormaa", "Other (Specify)"],
    "Sunyani West": ["Odumase", "Chiraa", "Fiapre", "Other (Specify)"],
    "Tain": ["Nsawkaw", "Debibi", "Seikwa", "Other (Specify)"],
    "Wenchi Municipal": ["Wenchi", "Subinso", "Tromeso", "Other (Specify)"]
};
