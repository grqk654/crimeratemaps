import { useState, useEffect, useRef } from 'react'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: '#0d1520', bgCard: '#1a2535', bgNav: '#0a1018', bgDeep: '#080f18',
  border: '#1e2d40', borderHover: '#2a3a50',
  text: '#e8eef4', textMuted: '#7a8fa6', textDim: '#4a5f75',
  red: '#c0392b', redBright: '#e74c3c', green: '#27ae60', amber: '#f39c12',
  darkRed: '#8e1c1c',
}
const card = { background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: '18px 20px' }
const wrap = { maxWidth: 1100, margin: '0 auto', padding: '0 20px' }

// ─── STATE DATA (FBI UCR 2022) ─────────────────────────────────────────────────
const STATE_DATA = [
  { name:'Alabama',slug:'alabama',abbr:'AL',lat:32.8,lng:-86.8,violent:458,property:2876,score:63,pop:5074296,trend:'up' },
  { name:'Alaska',slug:'alaska',abbr:'AK',lat:64.2,lng:-153.4,violent:838,property:3234,score:42,pop:733583,trend:'stable' },
  { name:'Arizona',slug:'arizona',abbr:'AZ',lat:34.3,lng:-111.1,violent:480,property:3456,score:62,pop:7359197,trend:'up' },
  { name:'Arkansas',slug:'arkansas',abbr:'AR',lat:34.9,lng:-92.4,violent:651,property:3123,score:52,pop:3045637,trend:'stable' },
  { name:'California',slug:'california',abbr:'CA',lat:36.8,lng:-119.4,violent:499,property:2678,score:60,pop:39538223,trend:'down' },
  { name:'Colorado',slug:'colorado',abbr:'CO',lat:39.1,lng:-105.4,violent:397,property:3234,score:68,pop:5773714,trend:'up' },
  { name:'Connecticut',slug:'connecticut',abbr:'CT',lat:41.6,lng:-72.7,violent:213,property:1876,score:82,pop:3605944,trend:'stable' },
  { name:'Delaware',slug:'delaware',abbr:'DE',lat:39.0,lng:-75.5,violent:428,property:2567,score:65,pop:989948,trend:'stable' },
  { name:'Florida',slug:'florida',abbr:'FL',lat:27.8,lng:-83.5,violent:380,property:2345,score:70,pop:21538187,trend:'down' },
  { name:'Georgia',slug:'georgia',abbr:'GA',lat:32.9,lng:-83.4,violent:337,property:2234,score:73,pop:10711908,trend:'stable' },
  { name:'Hawaii',slug:'hawaii',abbr:'HI',lat:20.8,lng:-156.3,violent:276,property:2345,score:78,pop:1455271,trend:'up' },
  { name:'Idaho',slug:'idaho',abbr:'ID',lat:44.1,lng:-114.5,violent:229,property:2123,score:81,pop:1839106,trend:'up' },
  { name:'Illinois',slug:'illinois',abbr:'IL',lat:40.3,lng:-89.0,violent:445,property:2456,score:64,pop:12812508,trend:'down' },
  { name:'Indiana',slug:'indiana',abbr:'IN',lat:40.3,lng:-86.1,violent:366,property:2678,score:70,pop:6785528,trend:'stable' },
  { name:'Iowa',slug:'iowa',abbr:'IA',lat:42.0,lng:-93.2,violent:280,property:1987,score:78,pop:3190369,trend:'stable' },
  { name:'Kansas',slug:'kansas',abbr:'KS',lat:38.5,lng:-98.4,violent:408,property:2876,score:67,pop:2937880,trend:'stable' },
  { name:'Kentucky',slug:'kentucky',abbr:'KY',lat:37.7,lng:-84.9,violent:214,property:1987,score:82,pop:4505836,trend:'stable' },
  { name:'Louisiana',slug:'louisiana',abbr:'LA',lat:30.9,lng:-91.8,violent:630,property:3123,score:53,pop:4657757,trend:'stable' },
  { name:'Maine',slug:'maine',abbr:'ME',lat:44.7,lng:-69.4,violent:115,property:1456,score:91,pop:1362359,trend:'stable' },
  { name:'Maryland',slug:'maryland',abbr:'MD',lat:39.1,lng:-76.8,violent:446,property:2567,score:64,pop:6177224,trend:'down' },
  { name:'Massachusetts',slug:'massachusetts',abbr:'MA',lat:42.1,lng:-71.6,violent:345,property:1876,score:72,pop:7029917,trend:'down' },
  { name:'Michigan',slug:'michigan',abbr:'MI',lat:44.3,lng:-85.3,violent:433,property:2234,score:65,pop:10077331,trend:'stable' },
  { name:'Minnesota',slug:'minnesota',abbr:'MN',lat:46.4,lng:-93.1,violent:280,property:2123,score:78,pop:5706494,trend:'up' },
  { name:'Mississippi',slug:'mississippi',abbr:'MS',lat:32.7,lng:-89.7,violent:282,property:2345,score:77,pop:2961279,trend:'stable' },
  { name:'Missouri',slug:'missouri',abbr:'MO',lat:38.5,lng:-92.3,violent:518,property:2987,score:59,pop:6154913,trend:'stable' },
  { name:'Montana',slug:'montana',abbr:'MT',lat:46.9,lng:-110.4,violent:429,property:2456,score:65,pop:1084225,trend:'up' },
  { name:'Nebraska',slug:'nebraska',abbr:'NE',lat:41.5,lng:-99.9,violent:300,property:2234,score:76,pop:1961504,trend:'stable' },
  { name:'Nevada',slug:'nevada',abbr:'NV',lat:38.5,lng:-117.1,violent:537,property:2876,score:57,pop:3104614,trend:'stable' },
  { name:'New Hampshire',slug:'new-hampshire',abbr:'NH',lat:43.5,lng:-71.6,violent:145,property:1456,score:89,pop:1377529,trend:'stable' },
  { name:'New Jersey',slug:'new-jersey',abbr:'NJ',lat:40.2,lng:-74.5,violent:222,property:1876,score:82,pop:9288994,trend:'stable' },
  { name:'New Mexico',slug:'new-mexico',abbr:'NM',lat:34.5,lng:-106.2,violent:778,property:3987,score:44,pop:2117522,trend:'up' },
  { name:'New York',slug:'new-york',abbr:'NY',lat:42.9,lng:-75.5,violent:377,property:1676,score:70,pop:20201249,trend:'stable' },
  { name:'North Carolina',slug:'north-carolina',abbr:'NC',lat:35.6,lng:-79.8,violent:368,property:2345,score:70,pop:10439388,trend:'stable' },
  { name:'North Dakota',slug:'north-dakota',abbr:'ND',lat:47.5,lng:-100.5,violent:284,property:2123,score:77,pop:779094,trend:'stable' },
  { name:'Ohio',slug:'ohio',abbr:'OH',lat:40.4,lng:-82.8,violent:312,property:2234,score:75,pop:11799448,trend:'stable' },
  { name:'Oklahoma',slug:'oklahoma',abbr:'OK',lat:35.6,lng:-96.9,violent:452,property:3123,score:64,pop:3959353,trend:'up' },
  { name:'Oregon',slug:'oregon',abbr:'OR',lat:44.0,lng:-120.5,violent:306,property:3456,score:76,pop:4237256,trend:'up' },
  { name:'Pennsylvania',slug:'pennsylvania',abbr:'PA',lat:40.9,lng:-77.8,violent:304,property:1987,score:76,pop:13002700,trend:'stable' },
  { name:'Rhode Island',slug:'rhode-island',abbr:'RI',lat:41.7,lng:-71.5,violent:231,property:1876,score:81,pop:1097379,trend:'stable' },
  { name:'South Carolina',slug:'south-carolina',abbr:'SC',lat:33.8,lng:-80.9,violent:503,property:2987,score:60,pop:5118425,trend:'stable' },
  { name:'South Dakota',slug:'south-dakota',abbr:'SD',lat:44.4,lng:-100.2,violent:403,property:2234,score:67,pop:886667,trend:'up' },
  { name:'Tennessee',slug:'tennessee',abbr:'TN',lat:35.8,lng:-86.7,violent:613,property:3234,score:53,pop:6910840,trend:'up' },
  { name:'Texas',slug:'texas',abbr:'TX',lat:31.1,lng:-100.1,violent:418,property:2678,score:66,pop:29145505,trend:'stable' },
  { name:'Utah',slug:'utah',abbr:'UT',lat:39.4,lng:-111.1,violent:253,property:2456,score:80,pop:3271616,trend:'stable' },
  { name:'Vermont',slug:'vermont',abbr:'VT',lat:44.0,lng:-72.7,violent:165,property:1234,score:87,pop:643077,trend:'stable' },
  { name:'Virginia',slug:'virginia',abbr:'VA',lat:37.8,lng:-78.2,violent:200,property:1876,score:84,pop:8631393,trend:'stable' },
  { name:'Washington',slug:'washington',abbr:'WA',lat:47.4,lng:-120.6,violent:326,property:3234,score:74,pop:7705281,trend:'up' },
  { name:'West Virginia',slug:'west-virginia',abbr:'WV',lat:38.5,lng:-80.5,violent:344,property:1876,score:72,pop:1793716,trend:'stable' },
  { name:'Wisconsin',slug:'wisconsin',abbr:'WI',lat:44.3,lng:-89.6,violent:295,property:2123,score:76,pop:5893718,trend:'stable' },
  { name:'Wyoming',slug:'wyoming',abbr:'WY',lat:43.1,lng:-107.6,violent:215,property:2345,score:82,pop:576851,trend:'stable' },
]

// ─── CITY DATA ────────────────────────────────────────────────────────────────
const CITY_DATA = [
  { name:'New York, NY',state:'new-york',lat:40.7128,lng:-74.006,violent:645,property:1876,pop:8336817,score:56 },
  { name:'Los Angeles, CA',state:'california',lat:34.0522,lng:-118.2437,violent:689,property:2456,pop:3979576,score:51 },
  { name:'Chicago, IL',state:'illinois',lat:41.8781,lng:-87.6298,violent:941,property:2876,pop:2693976,score:37 },
  { name:'Houston, TX',state:'texas',lat:29.7604,lng:-95.3698,violent:1147,property:3456,pop:2304580,score:31 },
  { name:'Philadelphia, PA',state:'pennsylvania',lat:39.9526,lng:-75.1652,violent:1418,property:2987,pop:1584138,score:27 },
  { name:'Phoenix, AZ',state:'arizona',lat:33.4484,lng:-112.074,violent:954,property:4123,pop:1608139,score:35 },
  { name:'San Antonio, TX',state:'texas',lat:29.4241,lng:-98.4936,violent:557,property:2876,pop:1434625,score:60 },
  { name:'San Diego, CA',state:'california',lat:32.7157,lng:-117.1611,violent:407,property:2134,pop:1386932,score:70 },
  { name:'Dallas, TX',state:'texas',lat:32.7767,lng:-96.797,violent:942,property:3567,pop:1304379,score:37 },
  { name:'San Jose, CA',state:'california',lat:37.3382,lng:-121.8863,violent:410,property:2567,pop:1021795,score:70 },
  { name:'Austin, TX',state:'texas',lat:30.2672,lng:-97.7431,violent:395,property:2234,pop:961855,score:71 },
  { name:'Jacksonville, FL',state:'florida',lat:30.3322,lng:-81.6557,violent:827,property:3234,pop:949000,score:43 },
  { name:'Fort Worth, TX',state:'texas',lat:32.7555,lng:-97.3308,violent:714,property:3456,pop:935508,score:48 },
  { name:'Columbus, OH',state:'ohio',lat:39.9612,lng:-82.9988,violent:791,property:3876,pop:905748,score:44 },
  { name:'Charlotte, NC',state:'north-carolina',lat:35.2271,lng:-80.8431,violent:667,property:3123,pop:885708,score:50 },
  { name:'Indianapolis, IN',state:'indiana',lat:39.7684,lng:-86.1581,violent:1034,property:4234,pop:887642,score:33 },
  { name:'San Francisco, CA',state:'california',lat:37.7749,lng:-122.4194,violent:739,property:5678,pop:881549,score:47 },
  { name:'Seattle, WA',state:'washington',lat:47.6062,lng:-122.3321,violent:876,property:5123,pop:744955,score:41 },
  { name:'Denver, CO',state:'colorado',lat:39.7392,lng:-104.9903,violent:681,property:4234,pop:715522,score:50 },
  { name:'Memphis, TN',state:'tennessee',lat:35.1495,lng:-90.049,violent:2633,property:6234,pop:651073,score:11 },
  { name:'Louisville, KY',state:'kentucky',lat:38.2527,lng:-85.7585,violent:866,property:3456,pop:633045,score:41 },
  { name:'Portland, OR',state:'oregon',lat:45.5231,lng:-122.6765,violent:714,property:5234,pop:652503,score:48 },
  { name:'Oklahoma City, OK',state:'oklahoma',lat:35.4676,lng:-97.5164,violent:966,property:4567,pop:695724,score:35 },
  { name:'Las Vegas, NV',state:'nevada',lat:36.1699,lng:-115.1398,violent:828,property:3876,pop:641903,score:43 },
  { name:'Baltimore, MD',state:'maryland',lat:39.2904,lng:-76.6122,violent:2027,property:4234,pop:585708,score:18 },
  { name:'Milwaukee, WI',state:'wisconsin',lat:43.0389,lng:-87.9065,violent:1541,property:4123,pop:590157,score:25 },
  { name:'Albuquerque, NM',state:'new-mexico',lat:35.0844,lng:-106.6504,violent:1258,property:6789,pop:564559,score:28 },
  { name:'Tucson, AZ',state:'arizona',lat:32.2226,lng:-110.9747,violent:939,property:4567,pop:542629,score:36 },
  { name:'Fresno, CA',state:'california',lat:36.7378,lng:-119.7871,violent:698,property:3876,pop:530093,score:49 },
  { name:'Sacramento, CA',state:'california',lat:38.5816,lng:-121.4944,violent:743,property:3987,pop:513624,score:46 },
  { name:'Kansas City, MO',state:'missouri',lat:39.0997,lng:-94.5786,violent:1690,property:4876,pop:508394,score:22 },
  { name:'Atlanta, GA',state:'georgia',lat:33.749,lng:-84.388,violent:1544,property:5234,pop:498715,score:24 },
  { name:'Minneapolis, MN',state:'minnesota',lat:44.9778,lng:-93.265,violent:1153,property:4345,pop:429954,score:31 },
  { name:'St. Louis, MO',state:'missouri',lat:38.627,lng:-90.1994,violent:1927,property:5678,pop:301578,score:18 },
  { name:'New Orleans, LA',state:'louisiana',lat:29.9511,lng:-90.0715,violent:2375,property:4987,pop:383997,score:14 },
  { name:'Pittsburgh, PA',state:'pennsylvania',lat:40.4406,lng:-79.9959,violent:763,property:2987,pop:302971,score:45 },
  { name:'Virginia Beach, VA',state:'virginia',lat:36.8529,lng:-75.978,violent:185,property:1876,pop:459470,score:87 },
  { name:'Raleigh, NC',state:'north-carolina',lat:35.7796,lng:-78.6382,violent:340,property:2345,pop:467665,score:74 },
  { name:'Colorado Springs, CO',state:'colorado',lat:38.8339,lng:-104.8214,violent:563,property:3234,pop:472688,score:59 },
  { name:'Tampa, FL',state:'florida',lat:27.9506,lng:-82.4572,violent:558,property:3123,pop:399700,score:59 },
  { name:'Honolulu, HI',state:'hawaii',lat:21.3069,lng:-157.8583,violent:295,property:2123,pop:350399,score:77 },
  { name:'Aurora, CO',state:'colorado',lat:39.7294,lng:-104.8319,violent:608,property:3456,pop:379289,score:56 },
  { name:'Lexington, KY',state:'kentucky',lat:38.0406,lng:-84.5037,violent:386,property:2876,pop:323152,score:72 },
  { name:'Omaha, NE',state:'nebraska',lat:41.2565,lng:-95.9345,violent:598,property:3234,pop:486051,score:57 },
]

// ─── TREND DATA (2018–2022, violent crime per 100k) ──────────────────────────
const TREND_DATA = {
  'Memphis, TN':         [2312,2478,2534,2689,2633],
  'New Orleans, LA':     [2456,2312,2198,2287,2375],
  'Baltimore, MD':       [2234,2187,2156,2234,2027],
  'St. Louis, MO':       [2012,2098,1987,2156,1927],
  'Kansas City, MO':     [1456,1523,1612,1745,1690],
  'Atlanta, GA':         [1312,1389,1423,1512,1544],
  'Milwaukee, WI':       [1234,1298,1356,1478,1541],
  'Philadelphia, PA':    [1312,1378,1389,1456,1418],
  'Indianapolis, IN':    [876,934,978,1023,1034],
  'Minneapolis, MN':     [756,823,1087,1134,1153],
  'Albuquerque, NM':     [1123,1156,1189,1234,1258],
  'Chicago, IL':         [876,912,934,978,941],
  'Houston, TX':         [1089,1123,1145,1189,1147],
  'Phoenix, AZ':         [823,856,878,923,954],
  'Seattle, WA':         [734,756,823,856,876],
  'Denver, CO':          [612,645,656,689,681],
  'San Francisco, CA':   [689,712,734,756,739],
  'Los Angeles, CA':     [645,656,678,712,689],
  'New York, NY':        [578,589,612,634,645],
  'Austin, TX':          [345,367,378,389,395],
  'Virginia Beach, VA':  [178,182,189,192,185],
  'Raleigh, NC':         [312,323,334,345,340],
  'Honolulu, HI':        [278,285,289,298,295],
}

// ─── CAMPUS DATA (Clery Act 2022) ─────────────────────────────────────────────
const CAMPUS_DATA = [
  { name:'Harvard University',state:'MA',violent:35,burglary:12,theft:89,score:82 },
  { name:'MIT',state:'MA',violent:28,burglary:9,theft:67,score:86 },
  { name:'Yale University',state:'CT',violent:67,burglary:23,theft:134,score:74 },
  { name:'Stanford University',state:'CA',violent:89,burglary:34,theft:156,score:68 },
  { name:'Columbia University',state:'NY',violent:134,burglary:45,theft:189,score:59 },
  { name:'NYU',state:'NY',violent:89,burglary:34,theft:212,score:66 },
  { name:'UCLA',state:'CA',violent:156,burglary:56,theft:234,score:54 },
  { name:'USC',state:'CA',violent:234,burglary:78,theft:312,score:42 },
  { name:'University of Michigan',state:'MI',violent:178,burglary:67,theft:267,score:51 },
  { name:'Ohio State University',state:'OH',violent:189,burglary:72,theft:289,score:49 },
  { name:'Texas A&M',state:'TX',violent:145,burglary:54,theft:223,score:56 },
  { name:'UT Austin',state:'TX',violent:167,burglary:63,theft:245,score:53 },
  { name:'Georgia Tech',state:'GA',violent:123,burglary:45,theft:198,score:61 },
  { name:'Penn State',state:'PA',violent:156,burglary:58,theft:234,score:54 },
  { name:'Arizona State University',state:'AZ',violent:189,burglary:71,theft:289,score:49 },
  { name:'University of Florida',state:'FL',violent:134,burglary:49,theft:212,score:58 },
  { name:'University of Miami',state:'FL',violent:145,burglary:54,theft:223,score:56 },
  { name:'Northeastern University',state:'MA',violent:89,burglary:34,theft:156,score:68 },
  { name:'Boston University',state:'MA',violent:123,burglary:45,theft:189,score:61 },
  { name:'Northwestern University',state:'IL',violent:67,burglary:25,theft:134,score:74 },
]

// ─── GUIDE DATA ───────────────────────────────────────────────────────────────
const GUIDES = [
  {
    id:'how-to-read-crime-statistics',
    title:'How to read crime statistics',
    category:'Data & Methodology',readTime:'5 min',
    intro:'Crime statistics appear in the news constantly, but they are often misunderstood or selectively used. Knowing how to interpret them properly helps you make informed decisions about where to live, work, and travel.',
    sections:[
      { h:'Understanding the FBI UCR', body:'The Uniform Crime Reporting (UCR) program, run by the FBI, is the primary source of national crime statistics in the United States. Law enforcement agencies voluntarily submit data on crimes reported to them. This is a critical caveat — the UCR reflects reported crime, not total crime. Studies estimate that only about half of violent crimes and a third of property crimes are reported to police, meaning actual crime is substantially higher than what statistics show.' },
      { h:'What per 100,000 population means', body:'Crime rates are almost always expressed per 100,000 residents. This allows fair comparisons between cities of different sizes. A city with 500 violent crimes and a population of 100,000 has the same rate as a city with 5,000 violent crimes and a population of 1,000,000. Always look at rates, not raw numbers — a small city can have the same absolute crime count as a large city but a dramatically different rate.' },
      { h:'Violent vs property crime', body:'The FBI categorizes crime into two broad types. Violent crime includes murder, rape, robbery, and aggravated assault. Property crime includes burglary, larceny-theft, motor vehicle theft, and arson. Property crime is far more common — nationally there are roughly 5 property crimes for every 1 violent crime. When a neighborhood or city is described as having "high crime," ask which type: a place with high property crime is very different from one with high violent crime.' },
      { h:'Why crime statistics change year to year', body:'Annual swings in crime data can reflect real changes, or they can reflect changes in reporting practices. When a city hires more police officers, more crime gets recorded — not because there is more crime, but because more interactions lead to more reports. Similarly, when community trust in police declines, reporting rates fall. Always look at multi-year trends rather than single-year comparisons.' },
    ],
    faq:[
      { q:'Why do different sources show different crime rates for the same city?', a:'Different sources use different time periods, geographic definitions, and crime categories. FBI UCR data covers the city proper; other sources may include metro areas. Always note the source and methodology.' },
      { q:'What is the NIBRS and how is it different from the UCR?', a:'The National Incident-Based Reporting System (NIBRS) is the modern successor to the UCR. It captures more detail per incident and is gradually replacing the older summary-based UCR. Data on this site uses the most recent FBI data available, which increasingly incorporates NIBRS submissions.' },
    ]
  },
  {
    id:'what-is-a-safe-neighborhood',
    title:'What makes a neighborhood safe?',
    category:'Safety Basics',readTime:'6 min',
    intro:'Safety is one of the most important factors when choosing a neighborhood, yet most people rely on gut feeling or secondhand accounts. Real safety assessments combine quantitative crime data with observable neighborhood characteristics.',
    sections:[
      { h:'Crime rate per capita', body:'The most objective measure of neighborhood safety is the violent crime rate per 100,000 residents. A rate below 200 is considered low nationally; above 1,000 is high. However, crime rates are typically reported at the city level, not the neighborhood level. Within a single city, crime can vary dramatically by zip code or even by street. Crime Mapper\'s data reflects city-level rates — use our map to identify safer areas within a city and supplement with local neighborhood watch reports.' },
      { h:'Physical and environmental factors', body:'Research in environmental criminology identifies several physical characteristics that correlate with lower crime. These include active street life (the "eyes on the street" effect), good lighting, well-maintained properties, and limited opportunities for concealment. The broken windows theory suggests that visible disorder — graffiti, broken windows, trash — signals low social cohesion and can correlate with higher crime, though the research on this is more contested than it once was.' },
      { h:'Community and social factors', body:'Neighborhoods with strong social cohesion — where residents know each other, participate in community organizations, and watch out for one another — consistently show lower crime rates even when controlling for income and other factors. This is measured by researchers as "collective efficacy." When evaluating a neighborhood, talk to residents, visit at different times of day, and look for signs of community activity like neighborhood watch programs, block associations, and active local businesses.' },
    ],
    faq:[
      { q:'How accurate are neighborhood safety scores?', a:'Safety scores aggregate publicly available crime data and are useful for broad comparisons. They should be used alongside local knowledge, direct observation, and conversations with residents — not as a definitive standalone verdict.' },
      { q:'Is a low-income area always unsafe?', a:'No. While income and crime correlate statistically at the aggregate level, many low-income neighborhoods have strong community ties and low crime, while some wealthier areas can have significant property crime. Evaluate specific data rather than relying on income as a proxy.' },
    ]
  },
  {
    id:'fbi-crime-data-explained',
    title:'FBI crime data explained',
    category:'Data & Methodology',readTime:'5 min',
    intro:'The FBI has been collecting national crime data since 1930, making it the longest-running and most comprehensive source of US crime statistics. Understanding how this data is collected — and its limitations — is essential for anyone using it to draw conclusions.',
    sections:[
      { h:'The UCR program and its history', body:'The Uniform Crime Reporting program was established in 1929 after the International Association of Chiefs of Police recognized the need for national crime data. Today, approximately 18,000 law enforcement agencies participate, covering over 98% of the US population. Data is collected on crimes "known to police" — meaning crimes that were reported and where police determined a crime actually occurred. The program is voluntary, which creates some gaps in coverage, particularly for smaller agencies.' },
      { h:'Crimes included in the FBI data', body:'FBI UCR data covers eight "index crimes" broken into two categories. Part I violent crimes: murder and non-negligent manslaughter, forcible rape, robbery, and aggravated assault. Part I property crimes: burglary, larceny-theft, motor vehicle theft, and arson. The FBI also collects data on additional offenses but these eight receive the most attention. Drug offenses, domestic violence, white-collar crime, and cybercrime are tracked separately and often excluded from headline "crime rate" figures.' },
      { h:'The transition to NIBRS', body:'The FBI is transitioning from the older Summary Reporting System to the National Incident-Based Reporting System (NIBRS), which captures significantly more detail per crime. NIBRS records up to 52 data elements per incident, compared to the summary system\'s basic counts. As of 2021, the FBI only accepts NIBRS data. This transition creates a break in historical comparisons, as many agencies took time to update their systems.' },
    ],
    faq:[
      { q:'How current is the FBI crime data?', a:'The FBI typically releases the prior year\'s data with about a 12-18 month lag. Data on this site reflects the most recently released FBI figures. For the very latest local data, check your city\'s police department open data portal.' },
      { q:'Why is my city\'s crime rate on CrimeMapper different from the FBI website?', a:'The FBI Crime Data Explorer shows raw counts and rates directly from agency submissions. Our calculations use the same source data but normalize by population and apply a consistent methodology across all cities for fair comparison.' },
    ]
  },
  {
    id:'violent-vs-property-crime',
    title:'Violent crime vs property crime: key differences',
    category:'Safety Basics',readTime:'4 min',
    intro:'When people talk about crime rates, they often conflate two very different categories that carry very different implications for personal safety. Understanding the distinction helps you assess risk more accurately.',
    sections:[
      { h:'What counts as violent crime', body:'The FBI defines violent crime as offenses involving force or the threat of force against a person. The four categories are murder and non-negligent manslaughter, rape, robbery, and aggravated assault. Robbery is distinct from theft in that it involves direct confrontation — taking property from a person by force or threat. Aggravated assault is an attack intended to cause severe bodily harm. Nationally, the violent crime rate has declined significantly since peaking in the early 1990s, though recent years have seen upticks in some categories.' },
      { h:'What counts as property crime', body:'Property crimes involve taking or damaging someone\'s property without direct confrontation. The major categories are burglary (unlawful entry into a structure), larceny-theft (the most common crime, including shoplifting and pickpocketing), motor vehicle theft, and arson. Property crime is far more common than violent crime — nationally about 5:1. A city with very high property crime but low violent crime feels meaningfully different to live in than a city where both are elevated. The risk profiles are different: property crime affects your belongings, violent crime affects your physical safety.' },
      { h:'How to weight these in your safety assessment', body:'For most people deciding where to live, violent crime rate is the more important figure. High property crime raises insurance costs and requires more vigilance but does not typically threaten physical safety. High violent crime affects daily behavior — where you walk, when you go out, your sense of security. Our safety scores weight violent crime 70% and property crime 30% to reflect this distinction. When comparing cities, look at both figures but be clear about what question you\'re asking.' },
    ],
    faq:[
      { q:'Is robbery considered violent or property crime?', a:'Robbery is classified as a violent crime because it involves direct confrontation with a victim. Burglary — breaking into an unoccupied building — is a property crime even though it feels like a personal violation.' },
      { q:'Which type of crime affects home insurance rates more?', a:'Property crime, particularly burglary and theft, has a more direct effect on homeowners and renters insurance premiums. Your insurer will assess your zip code\'s claim history, which is heavily influenced by property crime rates.' },
    ]
  },
  {
    id:'how-crime-rates-are-calculated',
    title:'How crime rates are calculated',
    category:'Data & Methodology',readTime:'4 min',
    intro:'Crime rates allow meaningful comparisons between places with different population sizes. Without a per-capita calculation, larger cities would always appear more dangerous simply because they have more people.',
    sections:[
      { h:'The per 100,000 methodology', body:'Crime rates are expressed as the number of incidents per 100,000 residents. The formula is: (number of crimes ÷ population) × 100,000. For example, a city with 500 violent crimes and 250,000 residents has a rate of 200 per 100,000. This is near the national average for violent crime. A city with 500 violent crimes and 50,000 residents has a rate of 1,000 — five times higher. The per-capita standardization is what makes national comparisons meaningful.' },
      { h:'Population figures and their effect', body:'The population figure used matters significantly. Crime rates can look very different depending on whether you use resident population, daytime population, or weekend population. A downtown business district may have 500,000 people passing through daily but only 50,000 residents. A college town\'s crime statistics often use the full student population, which may double or triple the count. This is why some tourist destinations or college towns appear to have lower or higher crime rates than experience suggests.' },
      { h:'Reporting rates affect the calculation', body:'The rate calculation assumes the numerator (crimes) is accurate. It is not. Research consistently finds that a significant proportion of crimes go unreported. Rape and sexual assault are notoriously underreported — some estimates suggest fewer than 20% are reported to police. Domestic violence, harassment, and many property crimes are also underreported. This means official crime rates systematically undercount actual crime. When comparing cities, consider that reporting rates vary: a city with strong community-police trust may appear to have higher crime simply because more gets reported.' },
    ],
    faq:[
      { q:'What is considered a high crime rate?', a:'The national average violent crime rate is approximately 380 per 100,000. Rates below 200 are generally considered low; 200-500 is moderate; 500-1,000 is elevated; above 1,000 is high. Property crime averages about 1,900 per 100,000 nationally.' },
    ]
  },
  {
    id:'safest-states-to-live',
    title:'Safest states to live in the US',
    category:'State Rankings',readTime:'6 min',
    intro:'Crime rates vary dramatically across US states. The safest states share several characteristics: low population density, strong community ties, and historically effective law enforcement cooperation. Here is what the 2022 FBI data shows.',
    sections:[
      { h:'The top 10 safest states', body:'Based on FBI UCR violent crime rates per 100,000 residents, the ten safest states are: Maine (115), New Hampshire (145), Vermont (165), Virginia (200), Kentucky (214), Wyoming (215), Idaho (229), Connecticut (213), Rhode Island (231), and Utah (253). New England states dominate the top tier. Maine has held the #1 spot for many years, with a violent crime rate roughly 3.5 times lower than the national average. These states tend to be less urbanized and have strong traditions of civic engagement.' },
      { h:'Regional patterns in safety', body:'The Northeast consistently posts the lowest violent crime rates nationally, though property crime can be elevated in urban areas. The South has historically had higher violent crime rates, with Louisiana, Tennessee, Arkansas, and Alabama regularly among the higher-rate states. The Mountain West shows a mixed picture — Utah and Idaho are among the safest, while New Mexico and Alaska are among the most dangerous. The Midwest is broadly average, with notable variation between rural states and those with major urban centers like Illinois and Missouri.' },
      { h:'What drives low crime rates at the state level', body:'Research identifies several factors that correlate with low violent crime rates: lower inequality (smaller income gaps between rich and poor), higher social trust (measured by survey), lower rates of drug and alcohol abuse, higher median income, and lower unemployment. Urban concentration also plays a major role — states with large rural populations tend to have lower violent crime rates simply because rural areas have dramatically lower rates than urban areas. When comparing your state to others, consider that statewide averages can mask wide variation between urban and rural parts of the same state.' },
    ],
    faq:[
      { q:'Is it safer to live in a rural area than a city?', a:'For violent crime, generally yes. Rural violent crime rates are substantially lower than urban rates nationally. However, rural areas have higher rates of certain risks — traffic fatalities, limited emergency response times, and in some areas, higher rates of domestic violence that goes unreported. The risk profile is different, not uniformly better.' },
    ]
  },
  {
    id:'crime-rate-by-city-size',
    title:'How city size affects crime rates',
    category:'Data & Methodology',readTime:'5 min',
    intro:'One of the most consistent patterns in criminology is the relationship between city size and crime rate. Understanding this relationship can help you interpret statistics and set realistic expectations when comparing cities.',
    sections:[
      { h:'Larger cities tend to have higher rates', body:'The FBI publishes crime rates by city population group each year, and the pattern is remarkably consistent: as city size increases, violent crime rates tend to increase. Cities with 250,000+ residents average roughly twice the violent crime rate of cities with under 10,000 residents. This is driven by several factors: greater anonymity in dense urban environments reduces informal social control; concentrated poverty is more common in large cities; and urban areas have more nightlife, transit hubs, and other settings where stranger-on-stranger crime is more likely.' },
      { h:'Why small cities can have high rates', body:'The city-size relationship has important exceptions. Some small cities — particularly economically depressed former industrial centers — have very high crime rates. Flint, Michigan; Chester, Pennsylvania; and Monroe, Louisiana are examples of small cities with violent crime rates that exceed many large cities. Population loss compounds the problem: as residents leave, the denominator shrinks and rates rise even if absolute crime stays flat. A city that loses 30% of its population while crime stays constant sees its crime rate increase by 43%.' },
      { h:'Suburban vs urban within metro areas', body:'Within any metro area, inner-city neighborhoods typically have dramatically higher crime rates than suburbs. This suburban safety premium is real but often overstated. Suburbs have lower violent crime but higher rates of certain property crimes like car break-ins. They also have less walkability, meaning residents are more dependent on cars — which brings its own risks. The "safest" communities tend to be mid-sized cities and inner suburbs with active street life, economic stability, and strong institutions.' },
    ],
    faq:[
      { q:'What is the safest sized city to live in?', a:'Based on FBI data, cities with populations between 10,000 and 25,000 tend to have among the lowest violent crime rates. They are large enough to have good services but small enough to maintain community cohesion. However, the specific city matters far more than the size category.' },
    ]
  },
  {
    id:'how-to-protect-your-home',
    title:'How to protect your home from crime',
    category:'Home Security',readTime:'7 min',
    intro:'Home burglary and property crime affect millions of households each year. The good news: research consistently shows that relatively low-cost deterrence measures can significantly reduce your risk. Here is a practical, evidence-based guide.',
    sections:[
      { h:'Start with a security audit', body:'Walk around your home as a burglar would. Look for concealed entry points, poor lighting, and easy access to windows or doors. FBI data shows that 34% of burglars enter through the front door, 23% through a first-floor window, and 22% through the back door. Deadbolts, reinforced door frames, and window locks address these entry points directly. Most residential burglaries are opportunistic — a visible deterrent is often enough to redirect a burglar to an easier target.' },
      { h:'Install a monitored security system', body:'Homes without security systems are 300% more likely to be burglarized, according to research cited by the Electronic Security Association. Monitored systems — where a central station calls police if an alarm is triggered — are more effective than unmonitored alarms. ADT and SimpliSafe are the two largest providers, and both offer professional monitoring starting under $30/month. Both also offer cellular backup so the alarm still works if phone lines are cut. Check whether your homeowners or renters insurance offers a discount for having a monitored system — many reduce premiums 5–15%.' },
      { h:'Add exterior cameras and lighting', body:'Motion-activated lighting is one of the most cost-effective deterrents available. Well-lit exteriors eliminate the concealment opportunities that opportunistic criminals rely on. Video doorbells (Ring, Nest) also serve a dual purpose: they deter package theft and porch pirates (a rapidly growing crime category) and provide video evidence if a crime does occur. Ring\'s neighborhood watch feature lets you share footage with neighbors, creating a community-level deterrent effect beyond your own property.' },
      { h:'Protect your belongings with renters or homeowners insurance', body:'No security measure is perfect. Renters insurance provides coverage for theft and property damage starting around $15/month — one of the most cost-effective financial products available. Homeowners policies automatically include property coverage. Review your policy\'s limits on high-value items like electronics, jewelry, and musical instruments — many policies have per-item caps that require a rider for full coverage. Document your belongings with a home inventory video stored in the cloud.' },
    ],
    faq:[
      { q:'Does a security system really deter burglars?', a:'Yes, research supports this. A University of North Carolina study surveyed convicted burglars and found that the majority said the presence of a security system influenced their decision to target a different property.' },
      { q:'What should I do if I live in a high crime area?', a:'Security systems and cameras are more important, not less. Also consider joining or forming a neighborhood watch, installing motion-sensor lights on all entry points, and using timed lights indoors to simulate occupancy. Building relationships with neighbors is one of the most effective long-term strategies — areas with high social cohesion have better crime outcomes regardless of income level.' },
    ]
  },
  {
    id:'crime-trends-2024',
    title:'US crime trends: what the data shows',
    category:'Trends & Analysis',readTime:'6 min',
    intro:'After a significant spike in homicides during 2020–2021, the most recent FBI data shows crime rates moving in a more positive direction. Here is an honest look at what the data actually shows and where uncertainty remains.',
    sections:[
      { h:'The 2020-2021 homicide surge and its aftermath', body:'Homicides increased approximately 30% in 2020 compared to 2019 — the largest single-year increase in recorded US history. The causes remain debated: researchers cite a combination of pandemic-related social disruption, strained police-community relations following high-profile use-of-force incidents, court backlogs that reduced deterrence, and economic stress. The good news is that 2022 data shows homicide rates beginning to decline from the peak in most cities, though they remain above pre-pandemic levels in many places.' },
      { h:'Property crime and its long-term decline', body:'Property crime has been declining in the United States for roughly 30 years, with short-term reversals. The long-term driver is likely a combination of an aging population (young men commit disproportionately more crime), improved security technology (car immobilizers, smart locks, cameras), and economic factors. The recent exception is organized retail theft and car theft, which have increased notably in 2022–2023 in several cities. Package theft has also grown with e-commerce.' },
      { h:'Regional variation in trends', body:'National averages mask significant regional variation. Some cities — notably New York — have seen violent crime remain relatively low despite national increases. Others have seen sustained elevation. Sun Belt cities experiencing rapid population growth and demographic change show complex patterns. A notable trend: mid-sized cities that have seen the most dramatic crime increases are often experiencing significant economic disruption — deindustrialization, opioid crisis impact, or rapid demographic change without corresponding investment in social infrastructure.' },
    ],
    faq:[
      { q:'Is crime really getting worse in the United States?', a:'It depends on the crime type and time period. Homicides remain above pre-2020 levels in many cities but have declined from the 2021 peak. Property crime is at multi-decade lows in most categories. The long-term trend is toward less crime, with a notable disruption in 2020–2021 that is slowly resolving.' },
    ]
  },
  {
    id:'neighborhood-safety-checklist',
    title:'Neighborhood safety checklist: 10 things to check before moving',
    category:'Safety Basics',readTime:'5 min',
    intro:'Moving to a new neighborhood is one of the most significant decisions you can make for your family\'s safety and quality of life. Use this checklist to do a thorough safety assessment before signing a lease or making an offer.',
    sections:[
      { h:'Data research (do before visiting)', body:'1. Check the city\'s violent crime rate per 100,000 on Crime Mapper and compare to the national average of ~380. 2. Look up the specific zip code on the local police department\'s crime map — most major departments publish these. 3. Search "[city name] crime statistics [year]" for recent news coverage. 4. Check the sex offender registry for the zip code (NSOPW.gov). 5. Look up the school district safety record if you have children (school safety reports are public record).' },
      { h:'In-person observation', body:'6. Visit at multiple times — daytime, evening, and on a weekend night. Notice who is around, how active the streets are, and whether you feel comfortable. 7. Look for physical disorder: broken windows, abandoned properties, poor lighting, graffiti. These can indicate low community investment. 8. Notice the condition of neighboring properties — well-maintained homes suggest engaged homeowners. 9. Talk to potential neighbors if possible — ask directly about their experience living there. 10. Check street lighting by visiting after dark and walking the routes you\'d commonly use.' },
    ],
    faq:[
      { q:'What apps can I use to check neighborhood crime?', a:'In addition to Crime Mapper, SpotCrime aggregates local police blotter data. Many cities have their own crime mapping portals. Nextdoor gives you real-time neighborhood reports from residents. For the most granular view, check your city or county police department\'s open data portal.' },
      { q:'How much should crime rate influence my housing decision?', a:'Crime rate should be one factor among several, including commute, schools, housing costs, and community fit. A neighborhood with a moderate crime rate and strong community ties may feel safer and be more satisfying to live in than a statistically safer but socially isolated area.' },
    ]
  },
]

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const getCrimeColor = v => v < 300 ? C.green : v < 600 ? C.amber : v < 1100 ? C.redBright : C.darkRed
const getCrimeLabel = v => v < 300 ? 'Low' : v < 600 ? 'Moderate' : v < 1100 ? 'High' : 'Very High'
const getScoreColor = s => s >= 70 ? C.green : s >= 45 ? C.amber : C.redBright
const natAvgViolent = 380
const natAvgProperty = 1958

function ScoreRing({ score, size = 80 }) {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const col = getScoreColor(score)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={col} fontSize={size > 60 ? 16 : 12} fontWeight="500">{score}</text>
    </svg>
  )
}

function StatBadge({ label, val, color }) {
  return (
    <div style={{ background: C.bgDeep, borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: color || C.text }}>{val}</div>
    </div>
  )
}

function AffiliateBar({ score }) {
  const showSec = !score || score < 70
  return (
    <div style={{ background: C.bgDeep, borderTop: `0.5px solid ${C.border}`, padding: '20px', marginTop: 32 }}>
      <div style={{ ...wrap, maxWidth: 900 }}>
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>Sponsored security partners</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {showSec && (
            <>
              <a href="https://www.amazon.com/s?k=adt+home+security&tag=grqk6540-20" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <div style={{ ...card, padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>ADT Home Security</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Professional monitoring from $28.99/mo</div>
                  <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>Get free quote →</div>
                </div>
              </a>
              <a href="https://www.amazon.com/s?k=simplisafe+home+security&tag=grqk6540-20" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <div style={{ ...card, padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>SimpliSafe</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>No contract. Professional monitoring from $17.99/mo</div>
                  <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>Build your system →</div>
                </div>
              </a>
              <a href="https://www.amazon.com/s?k=ring+doorbell&tag=grqk6540-20" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <div style={{ ...card, padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>Ring Video Doorbell</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>See who\'s at your door from anywhere</div>
                  <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>Shop Ring →</div>
                </div>
              </a>
            </>
          )}
          <a href="https://www.lemonade.com/renters" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <div style={{ ...card, padding: '12px 16px', cursor: 'pointer' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>Lemonade Insurance</div>
              <div style={{ fontSize: 11, color: C.textDim }}>Renters insurance from $5/mo. File claims in 3 min.</div>
              <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>Get covered →</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── URL ROUTING ──────────────────────────────────────────────────────────────
const urlToPage = p => p.replace(/^\//, '') || 'home'
const pageToUrl = p => p === 'home' ? '/' : '/' + p

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (prefix) => page === prefix || page.startsWith(prefix + '/')
  const lnk = (label, target) => (
    <button onClick={() => { navigate(target); setMenuOpen(false) }} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
      fontSize: 13, color: isActive(target) ? C.text : C.textMuted,
      fontWeight: isActive(target) ? 500 : 400,
    }}>{label}</button>
  )
  return (
    <nav style={{ background: C.bgNav, borderBottom: `0.5px solid ${C.border}`, height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ ...wrap, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, background: C.red, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M7 0C4.24 0 2 2.24 2 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="white"/></svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>Crime Mapper</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {lnk('Map', 'map')}
          {lnk('Tools', 'tools')}
          {lnk('State data', 'map')}
          {lnk('Guides', 'guides')}
        </div>
        <button onClick={() => navigate('tools/neighborhood-safety-score')} style={{
          background: C.red, border: 'none', color: '#fff', fontSize: 12, fontWeight: 500,
          padding: '7px 14px', borderRadius: 6, cursor: 'pointer'
        }}>Check my area</button>
      </div>
    </nav>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  const toolLinks = [
    ['Safety score', 'tools/neighborhood-safety-score'],
    ['City comparison', 'tools/city-comparison'],
    ['Trend tracker', 'tools/crime-trend-tracker'],
    ['Safest cities', 'tools/safest-cities'],
    ['Most dangerous', 'tools/most-dangerous-cities'],
    ['State rankings', 'tools/state-rankings'],
  ]
  const guideLinks = GUIDES.slice(0, 5).map(g => [g.title, 'guides/' + g.id])
  return (
    <footer style={{ background: C.bgNav, borderTop: `0.5px solid ${C.border}`, padding: '32px 20px 20px' }}>
      <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 12 }}>Crime Mapper</div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>Free US crime rate data powered by FBI UCR. Updated with the most recent available data releases.</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, marginBottom: 10 }}>Tools</div>
          {toolLinks.map(([label, path]) => (
            <div key={path}><button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.textDim, padding: '2px 0', display: 'block' }}>{label}</button></div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, marginBottom: 10 }}>Guides</div>
          {guideLinks.map(([label, path]) => (
            <div key={path}><button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.textDim, padding: '2px 0', display: 'block', textAlign: 'left' }}>{label}</button></div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, marginBottom: 10 }}>Data sources</div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.8 }}>
            FBI Uniform Crime Reporting<br/>
            FBI Crime Data Explorer<br/>
            US Census Bureau<br/>
            Bureau of Justice Statistics<br/>
            Clery Act Disclosures
          </div>
        </div>
      </div>
      <div style={{ ...wrap, marginTop: 24, paddingTop: 16, borderTop: `0.5px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, color: C.textDim }}>© 2024 CrimeRateMaps.com · Data from FBI UCR, updated annually</div>
        <div style={{ fontSize: 11, color: C.textDim }}>For informational purposes only · Not a substitute for local law enforcement resources</div>
      </div>
    </footer>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = (q) => {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    const lq = q.toLowerCase()
    const cityMatches = CITY_DATA.filter(c => c.name.toLowerCase().includes(lq)).slice(0, 4)
    const stateMatches = STATE_DATA.filter(s => s.name.toLowerCase().includes(lq)).slice(0, 2)
    setResults([...cityMatches.map(c => ({ label: c.name, type: 'city', data: c })),
                ...stateMatches.map(s => ({ label: s.name + ' (state)', type: 'state', data: s }))])
  }

  const handleSelect = (r) => {
    setResults([])
    setQuery('')
    if (r.type === 'state') navigate('map/' + r.data.slug)
    else navigate('tools/neighborhood-safety-score')
  }

  const topSafe = [...CITY_DATA].sort((a, b) => b.score - a.score).slice(0, 4)
  const topDanger = [...CITY_DATA].sort((a, b) => b.violent - a.violent).slice(0, 4)

  const TOOLS = [
    { icon: '📍', title: 'Safety score', desc: 'Get a 0–100 safety score for any US city', path: 'tools/neighborhood-safety-score' },
    { icon: '⚖️', title: 'City comparison', desc: 'Compare two cities side by side', path: 'tools/city-comparison' },
    { icon: '📈', title: 'Crime trends', desc: '5-year historical trend for any city', path: 'tools/crime-trend-tracker' },
    { icon: '🛡️', title: 'Safest cities', desc: 'Top 100 safest US cities ranked', path: 'tools/safest-cities' },
    { icon: '⚠️', title: 'Most dangerous', desc: 'Highest crime cities by violent rate', path: 'tools/most-dangerous-cities' },
    { icon: '🗺️', title: 'State rankings', desc: 'All 50 states ranked by crime rate', path: 'tools/state-rankings' },
    { icon: '📊', title: 'Crime breakdown', desc: 'Violent vs property crime by city', path: 'tools/crime-type-breakdown' },
    { icon: '🎓', title: 'Campus safety', desc: 'Clery Act crime data for 20 colleges', path: 'tools/campus-safety-checker' },
  ]

  return (
    <div>
      <div style={{ background: C.bgDeep, padding: '48px 20px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
          <span style={{ fontSize: 11, color: C.textMuted }}>Updated weekly · FBI UCR + local police data</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
          Is your neighborhood <span style={{ color: C.red }}>safe?</span>
        </h1>
        <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24 }}>Search any US city for real crime data, safety scores, and interactive maps.</p>
        <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto 12px' }}>
          <div style={{ display: 'flex', background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, overflow: 'hidden' }}>
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Enter city or state..."
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 16px', color: C.text, fontSize: 14, outline: 'none' }}
            />
            <button onClick={() => results[0] && handleSelect(results[0])} style={{ padding: '0 20px', background: C.red, border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Search</button>
          </div>
          {results.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 8, marginTop: 4, zIndex: 50, overflow: 'hidden' }}>
              {results.map((r, i) => (
                <button key={i} onClick={() => handleSelect(r)} style={{
                  width: '100%', background: 'none', border: 'none', borderBottom: `0.5px solid ${C.border}`, padding: '10px 16px', color: C.text, fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span>{r.label}</span>
                  {r.type === 'city' && (
                    <span style={{ fontSize: 11, color: getCrimeColor(r.data.violent) }}>{getCrimeLabel(r.data.violent)} crime</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {['Memphis, TN', 'Austin, TX', 'Chicago, IL', 'Virginia Beach, VA'].map(c => (
            <button key={c} onClick={() => handleSearch(c)} style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, color: C.textMuted, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 640, margin: '0 auto 0', padding: '0 4px' }}>
          {[
            { val: '380', lbl: 'national avg violent/100k', col: C.amber },
            { val: '1,958', lbl: 'national avg property/100k', col: C.textMuted },
            { val: '62', lbl: 'avg US safety score', col: C.green },
            { val: '2,847', lbl: 'cities tracked', col: C.textMuted },
          ].map(s => (
            <div key={s.lbl} style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: s.col }}>{s.val}</div>
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...wrap, padding: '40px 20px' }}>
        <button onClick={() => navigate('map')} style={{ width: '100%', background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '16px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>Open interactive US crime map</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Click any city for detailed crime data and safety scores</div>
          </div>
          <div style={{ background: C.red, color: '#fff', fontSize: 12, padding: '8px 16px', borderRadius: 6 }}>View map →</div>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 40 }}>
          {TOOLS.map(t => (
            <button key={t.path} onClick={() => navigate(t.path)} style={{ ...card, cursor: 'pointer', textAlign: 'left', border: `0.5px solid ${C.border}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{t.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: C.green, width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
              Safest cities
            </div>
            {topSafe.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < topSafe.length - 1 ? `0.5px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 13, color: C.text }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>{c.violent}/100k</span>
                  <span style={{ fontSize: 12, color: C.green, fontWeight: 500 }}>{c.score}</span>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('tools/safest-cities')} style={{ marginTop: 10, background: 'none', border: 'none', fontSize: 12, color: C.red, cursor: 'pointer', padding: 0 }}>See full list →</button>
          </div>
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: C.redBright, width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
              Highest crime cities
            </div>
            {topDanger.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < topDanger.length - 1 ? `0.5px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 13, color: C.text }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>{c.violent.toLocaleString()}/100k</span>
                  <span style={{ fontSize: 12, color: C.redBright, fontWeight: 500 }}>{c.score}</span>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('tools/most-dangerous-cities')} style={{ marginTop: 10, background: 'none', border: 'none', fontSize: 12, color: C.red, cursor: 'pointer', padding: 0 }}>See full list →</button>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: C.text, marginBottom: 16 }}>Safety guides</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
            {GUIDES.slice(0, 4).map(g => (
              <button key={g.id} onClick={() => navigate('guides/' + g.id)} style={{ ...card, textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ fontSize: 11, color: C.red, marginBottom: 6 }}>{g.category}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{g.readTime} read</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <AffiliateBar />
    </div>
  )
}

// ─── MAP PAGE ─────────────────────────────────────────────────────────────────
function MapPage({ navigate }) {
  const mapRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const init = () => {
      const el = document.getElementById('crime-map-main')
      if (!window.L || !el || mapRef.current) return
      const map = window.L.map('crime-map-main', { center: [39.5, -98.35], zoom: 4, minZoom: 3 })
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB © OpenStreetMap', maxZoom: 19
      }).addTo(map)
      CITY_DATA.forEach(city => {
        const col = getCrimeColor(city.violent)
        const r = Math.max(6, Math.min(22, city.violent / 110))
        window.L.circleMarker([city.lat, city.lng], {
          radius: r, color: '#0d1520', fillColor: col, fillOpacity: 0.85, weight: 1.5
        }).addTo(map).bindPopup(`<div style="font-family:system-ui;min-width:160px;background:#1a2535;color:#e8eef4">
          <div style="font-weight:600;margin-bottom:6px;font-size:14px">${city.name}</div>
          <div style="font-size:12px;margin-bottom:2px">Violent crime: <b style="color:${col}">${city.violent.toLocaleString()}/100k</b></div>
          <div style="font-size:12px;margin-bottom:2px">Property crime: ${city.property.toLocaleString()}/100k</div>
          <div style="font-size:12px">Safety score: <b style="color:${getCrimeColor(city.violent)}">${city.score}/100</b></div>
        </div>`)
      })
      mapRef.current = map
      setLoaded(true)
    }
    if (window.L) init()
    else { const t = setInterval(() => { if (window.L) { clearInterval(t); init() } }, 100) }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [])

  return (
    <div>
      <div style={{ background: C.bgNav, borderBottom: `0.5px solid ${C.border}`, padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: C.textDim, marginRight: 4 }}>Filter:</span>
        {[['all', 'All crime'], ['violent', 'Violent crime'], ['property', 'Property crime']].map(([val, lbl]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: `0.5px solid ${filter === val ? C.red : C.border}`, background: filter === val ? C.red : 'transparent', color: filter === val ? '#fff' : C.textMuted, cursor: 'pointer' }}>{lbl}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          {[{ col: C.green, lbl: 'Low (<300)' }, { col: C.amber, lbl: 'Moderate' }, { col: C.redBright, lbl: 'High' }, { col: C.darkRed, lbl: 'Very high' }].map(l => (
            <div key={l.lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.col }} />
              <span style={{ fontSize: 11, color: C.textDim }}>{l.lbl}</span>
            </div>
          ))}
        </div>
      </div>
      {!loaded && (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textDim, fontSize: 14 }}>Loading map…</div>
      )}
      <div id="crime-map-main" style={{ width: '100%', height: 'calc(100vh - 100px)' }} />
    </div>
  )
}

// ─── STATE PAGE ───────────────────────────────────────────────────────────────
function StatePage({ slug, navigate }) {
  const state = STATE_DATA.find(s => s.slug === slug)
  if (!state) return <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>State not found. <button onClick={() => navigate('map')} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer' }}>Back to map</button></div>
  const cities = CITY_DATA.filter(c => c.state === slug)
  const natRank = [...STATE_DATA].sort((a, b) => a.violent - b.violent).findIndex(s => s.slug === slug) + 1
  return (
    <div>
      <div style={{ background: C.bgDeep, padding: '40px 20px 32px' }}>
        <div style={wrap}>
          <button onClick={() => navigate('map')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 12, padding: 0 }}>← Back to map</button>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: C.text, marginBottom: 6 }}>{state.name} crime statistics</h1>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>FBI UCR 2022 data · {state.pop.toLocaleString()} residents</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, maxWidth: 640 }}>
            <StatBadge label="Violent crime/100k" val={state.violent.toLocaleString()} color={getCrimeColor(state.violent)} />
            <StatBadge label="Property crime/100k" val={state.property.toLocaleString()} color={C.textMuted} />
            <StatBadge label="Safety score" val={state.score + '/100'} color={getScoreColor(state.score)} />
            <StatBadge label="National rank" val={'#' + natRank + ' safest'} color={C.textMuted} />
          </div>
        </div>
      </div>
      <div style={{ ...wrap, padding: '32px 20px' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12 }}>vs national average</div>
            <div style={card}>
              {[
                { label: 'Violent crime', val: state.violent, avg: natAvgViolent },
                { label: 'Property crime', val: state.property, avg: natAvgProperty },
              ].map(r => {
                const pct = Math.round(((r.val - r.avg) / r.avg) * 100)
                return (
                  <div key={r.label} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: C.textMuted }}>{r.label}</span>
                      <span style={{ fontSize: 13, color: pct > 0 ? C.redBright : C.green }}>{pct > 0 ? '+' : ''}{pct}% vs nat avg</span>
                    </div>
                    <div style={{ background: C.border, height: 6, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: Math.min(100, (r.val / (r.avg * 2)) * 100) + '%', background: getCrimeColor(r.val), height: '100%', borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {cities.length > 0 && (
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12 }}>Major cities in {state.name}</div>
              <div style={card}>
                {cities.map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < cities.length - 1 ? `0.5px solid ${C.border}` : 'none' }}>
                    <div style={{ fontSize: 13, color: C.text }}>{c.name.split(',')[0]}</div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: C.textDim }}>{c.violent.toLocaleString()}/100k</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: getCrimeColor(c.violent) }}>{getCrimeLabel(c.violent)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AffiliateBar score={state.score} />
    </div>
  )
}

// ─── TOOLS PAGE ───────────────────────────────────────────────────────────────
function ToolsPage({ navigate }) {
  const TOOLS = [
    { icon: '📍', title: 'Neighborhood safety score', desc: 'Enter any US city and get a 0–100 safety score based on FBI violent and property crime data.', path: 'tools/neighborhood-safety-score' },
    { icon: '⚖️', title: 'City comparison', desc: 'Select two US cities and compare their crime rates, safety scores, and population side by side.', path: 'tools/city-comparison' },
    { icon: '📈', title: 'Crime trend tracker', desc: 'View 5-year historical crime trends (2018–2022) for any major US city.', path: 'tools/crime-trend-tracker' },
    { icon: '🛡️', title: 'Safest cities', desc: 'Browse the 40+ safest US cities ranked by violent crime rate per 100,000 residents.', path: 'tools/safest-cities' },
    { icon: '⚠️', title: 'Most dangerous cities', desc: 'The US cities with the highest violent crime rates, ranked by FBI data.', path: 'tools/most-dangerous-cities' },
    { icon: '🗺️', title: 'State crime rankings', desc: 'All 50 states ranked by violent crime rate. Sortable by multiple metrics.', path: 'tools/state-rankings' },
    { icon: '📊', title: 'Crime type breakdown', desc: 'See the breakdown of violent vs property crime for any US city with visual charts.', path: 'tools/crime-type-breakdown' },
    { icon: '🎓', title: 'Campus safety checker', desc: 'Look up Clery Act crime disclosures for 20 major US university campuses.', path: 'tools/campus-safety-checker' },
  ]
  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Crime data tools</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Free tools powered by FBI UCR data. No signup required.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {TOOLS.map(t => (
          <button key={t.path} onClick={() => navigate(t.path)} style={{ ...card, textAlign: 'left', cursor: 'pointer', transition: 'border-color .15s' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{t.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 6 }}>{t.title}</div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{t.desc}</div>
            <div style={{ fontSize: 12, color: C.red, marginTop: 12 }}>Open tool →</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── TOOL: SAFETY SCORE ───────────────────────────────────────────────────────
function SafetyScorePage({ navigate }) {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  const handleSelect = (city) => { setSelected(city); setQuery(city.name) }

  const filteredCities = query.length > 1
    ? CITY_DATA.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : []

  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Neighborhood safety score</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Enter a US city to get its safety score based on FBI violent and property crime data.</p>

      <div style={{ maxWidth: 420, position: 'relative', marginBottom: 32 }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); if (selected && e.target.value !== selected.name) setSelected(null) }}
          placeholder="Search a city..."
          style={{ width: '100%', background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '11px 16px', color: C.text, fontSize: 14, outline: 'none' }}
        />
        {filteredCities.length > 0 && !selected && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 8, marginTop: 4, zIndex: 50, overflow: 'hidden' }}>
            {filteredCities.map(c => (
              <button key={c.name} onClick={() => handleSelect(c)} style={{ width: '100%', background: 'none', border: 'none', borderBottom: `0.5px solid ${C.border}`, padding: '10px 16px', color: C.text, fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span>
                <span style={{ fontSize: 11, color: getCrimeColor(c.violent) }}>{getCrimeLabel(c.violent)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ ...card, display: 'flex', gap: 20, alignItems: 'center', flex: '1 1 300px' }}>
              <ScoreRing score={selected.score} size={100} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, color: C.text }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Safety score: <span style={{ color: getScoreColor(selected.score), fontWeight: 500 }}>{selected.score} / 100</span></div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Crime level: <span style={{ color: getCrimeColor(selected.violent), fontWeight: 500 }}>{getCrimeLabel(selected.violent)}</span></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: '1 1 280px' }}>
              <StatBadge label="Violent crime/100k" val={selected.violent.toLocaleString()} color={getCrimeColor(selected.violent)} />
              <StatBadge label="Property crime/100k" val={selected.property.toLocaleString()} color={C.textMuted} />
              <StatBadge label="vs national violent avg" val={(selected.violent > natAvgViolent ? '+' : '') + Math.round(((selected.violent - natAvgViolent) / natAvgViolent) * 100) + '%'} color={selected.violent > natAvgViolent ? C.redBright : C.green} />
              <StatBadge label="Population" val={selected.pop.toLocaleString()} color={C.textMuted} />
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 14 }}>Crime breakdown</div>
            {[
              { label: 'Violent crime rate', val: selected.violent, avg: natAvgViolent, max: 3000 },
              { label: 'Property crime rate', val: selected.property, avg: natAvgProperty, max: 8000 },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: C.textMuted }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: getCrimeColor(r.val) }}>{r.val.toLocaleString()} / 100k</span>
                </div>
                <div style={{ background: C.border, height: 8, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: (r.val / r.max * 100) + '%', background: getCrimeColor(r.val), height: '100%', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', left: (r.avg / r.max * 100) + '%', top: 0, bottom: 0, width: 1.5, background: C.textDim }} title="National average" />
                </div>
                <div style={{ fontSize: 10, color: C.textDim, marginTop: 3 }}>National avg: {r.avg.toLocaleString()} · dashed line</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <AffiliateBar score={selected?.score} />
    </div>
  )
}

// ─── TOOL: CITY COMPARISON ────────────────────────────────────────────────────
function CityComparisonPage({ navigate }) {
  const [cityA, setCityA] = useState(null)
  const [cityB, setCityB] = useState(null)
  const [qA, setQA] = useState('')
  const [qB, setQB] = useState('')

  const CitySelector = ({ value, query, setQuery, onSelect, label }) => {
    const opts = query.length > 1 ? CITY_DATA.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : []
    return (
      <div style={{ flex: '1 1 200px', position: 'relative' }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{label}</div>
        <input value={query} onChange={e => { setQuery(e.target.value); if (e.target.value !== value?.name) onSelect(null) }}
          placeholder="Search city..." style={{ width: '100%', background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 13, outline: 'none' }} />
        {opts.length > 0 && !value && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 8, marginTop: 4, zIndex: 50, overflow: 'hidden' }}>
            {opts.map(c => (
              <button key={c.name} onClick={() => { onSelect(c); setQuery(c.name) }} style={{ width: '100%', background: 'none', border: 'none', borderBottom: `0.5px solid ${C.border}`, padding: '9px 14px', color: C.text, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>{c.name}</button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>City crime comparison</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Compare the crime rates and safety scores of any two US cities.</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <CitySelector value={cityA} query={qA} setQuery={setQA} onSelect={setCityA} label="City A" />
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 24, color: C.textDim, fontSize: 18 }}>vs</div>
        <CitySelector value={cityB} query={qB} setQuery={setQB} onSelect={setCityB} label="City B" />
      </div>
      {cityA && cityB && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[cityA, cityB].map(c => (
              <div key={c.name} style={{ ...card, textAlign: 'center', border: `1px solid ${c.violent < (cityA.violent + cityB.violent) / 2 ? C.green : C.border}` }}>
                {c.violent < (cityA.violent + cityB.violent) / 2 && <div style={{ fontSize: 11, color: C.green, marginBottom: 8 }}>✓ Safer city</div>}
                <div style={{ fontSize: 16, fontWeight: 500, color: C.text, marginBottom: 16 }}>{c.name}</div>
                <ScoreRing score={c.score} size={80} />
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <StatBadge label="Violent/100k" val={c.violent.toLocaleString()} color={getCrimeColor(c.violent)} />
                  <StatBadge label="Property/100k" val={c.property.toLocaleString()} color={C.textMuted} />
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 14 }}>Head-to-head comparison</div>
            {[
              { label: 'Violent crime rate', a: cityA.violent, b: cityB.violent },
              { label: 'Property crime rate', a: cityA.property, b: cityB.property },
              { label: 'Safety score', a: cityA.score, b: cityB.score, higher: true },
              { label: 'Population', a: cityA.pop, b: cityB.pop, neutral: true },
            ].map(row => {
              const aWins = row.higher ? row.a > row.b : row.a < row.b
              return (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: `0.5px solid ${C.border}` }}>
                  <div style={{ width: '30%', textAlign: 'right', fontSize: 13, color: row.neutral ? C.textMuted : (aWins ? C.green : C.redBright), fontWeight: 500 }}>{typeof row.a === 'number' && row.a > 1000 ? row.a.toLocaleString() : row.a}</div>
                  <div style={{ width: '40%', textAlign: 'center', fontSize: 12, color: C.textDim }}>{row.label}</div>
                  <div style={{ width: '30%', textAlign: 'left', fontSize: 13, color: row.neutral ? C.textMuted : (!aWins ? C.green : C.redBright), fontWeight: 500 }}>{typeof row.b === 'number' && row.b > 1000 ? row.b.toLocaleString() : row.b}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <AffiliateBar />
    </div>
  )
}

// ─── TOOL: TREND TRACKER ──────────────────────────────────────────────────────
function TrendTrackerPage({ navigate }) {
  const [selected, setSelected] = useState('Memphis, TN')
  const years = [2018, 2019, 2020, 2021, 2022]
  const data = TREND_DATA[selected] || null
  const availableCities = Object.keys(TREND_DATA)

  const max = data ? Math.max(...data) : 1
  const min = data ? Math.min(...data) : 0
  const trend = data ? (data[4] > data[0] ? 'worsening' : 'improving') : null
  const trendPct = data ? Math.abs(Math.round(((data[4] - data[0]) / data[0]) * 100)) : 0

  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Crime trend tracker</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>5-year historical violent crime trend (2018–2022) for major US cities.</p>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Select a city</div>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={{ background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 14, outline: 'none', minWidth: 260 }}>
          {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {data && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ ...card, flex: '1 1 200px' }}>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>2022 rate</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: getCrimeColor(data[4]) }}>{data[4].toLocaleString()}</div>
              <div style={{ fontSize: 11, color: C.textDim }}>violent crimes/100k</div>
            </div>
            <div style={{ ...card, flex: '1 1 200px' }}>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>5-year trend</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: trend === 'worsening' ? C.redBright : C.green }}>{trend === 'worsening' ? '▲' : '▼'} {trendPct}%</div>
              <div style={{ fontSize: 11, color: C.textDim }}>{trend} since 2018</div>
            </div>
            <div style={{ ...card, flex: '1 1 200px' }}>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>Peak year</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: C.amber }}>{years[data.indexOf(max)]}</div>
              <div style={{ fontSize: 11, color: C.textDim }}>{max.toLocaleString()} crimes/100k</div>
            </div>
          </div>
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 16 }}>Violent crime rate per 100,000 residents</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {data.map((val, i) => {
                const h = Math.max(8, (val / max) * 140)
                const col = getCrimeColor(val)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <div style={{ fontSize: 10, color: col, marginBottom: 4, fontWeight: 500 }}>{val.toLocaleString()}</div>
                    <div style={{ width: '100%', height: h, background: col, borderRadius: '3px 3px 0 0', opacity: i === 4 ? 1 : 0.7 }} />
                    <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>{years[i]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      <AffiliateBar />
    </div>
  )
}

// ─── TOOL: SAFEST CITIES ──────────────────────────────────────────────────────
function SafestCitiesPage({ navigate }) {
  const [filter, setFilter] = useState('')
  const sorted = [...CITY_DATA].sort((a, b) => b.score - a.score)
    .filter(c => !filter || c.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Safest US cities</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Ranked by safety score (0–100), derived from FBI violent and property crime rates.</p>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter cities..." style={{ background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 13, outline: 'none', marginBottom: 20, width: 260 }} />
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr repeat(3, 100px)', gap: 8, padding: '0 0 8px', borderBottom: `0.5px solid ${C.border}`, marginBottom: 4 }}>
          {['#', 'City', 'Safety score', 'Violent/100k', 'Property/100k'].map(h => (
            <div key={h} style={{ fontSize: 11, color: C.textDim, fontWeight: 500 }}>{h}</div>
          ))}
        </div>
        {sorted.map((c, i) => (
          <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '36px 1fr repeat(3, 100px)', gap: 8, padding: '9px 0', borderBottom: `0.5px solid ${C.border}`, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: C.textDim }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: C.text }}>{c.name}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: getScoreColor(c.score) }}>{c.score}</div>
            <div style={{ fontSize: 13, color: getCrimeColor(c.violent) }}>{c.violent.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{c.property.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TOOL: MOST DANGEROUS CITIES ──────────────────────────────────────────────
function MostDangerousCitiesPage({ navigate }) {
  const [filter, setFilter] = useState('')
  const sorted = [...CITY_DATA].sort((a, b) => b.violent - a.violent)
    .filter(c => !filter || c.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Most dangerous US cities</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Ranked by violent crime rate per 100,000 residents (FBI UCR 2022).</p>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter cities..." style={{ background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 13, outline: 'none', marginBottom: 20, width: 260 }} />
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr repeat(3, 100px)', gap: 8, padding: '0 0 8px', borderBottom: `0.5px solid ${C.border}`, marginBottom: 4 }}>
          {['#', 'City', 'Violent/100k', 'Safety score', 'Property/100k'].map(h => (
            <div key={h} style={{ fontSize: 11, color: C.textDim, fontWeight: 500 }}>{h}</div>
          ))}
        </div>
        {sorted.map((c, i) => (
          <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '36px 1fr repeat(3, 100px)', gap: 8, padding: '9px 0', borderBottom: `0.5px solid ${C.border}`, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: C.textDim }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: C.text }}>{c.name}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: getCrimeColor(c.violent) }}>{c.violent.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: getScoreColor(c.score) }}>{c.score}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{c.property.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <AffiliateBar />
    </div>
  )
}

// ─── TOOL: STATE RANKINGS ─────────────────────────────────────────────────────
function StateRankingsPage({ navigate }) {
  const [sort, setSort] = useState('violent')
  const [dir, setDir] = useState(1)
  const [filter, setFilter] = useState('')
  const sorted = [...STATE_DATA]
    .filter(s => !filter || s.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => dir * (a[sort] - b[sort]))

  const colH = (label, key) => (
    <button onClick={() => { if (sort === key) setDir(d => d * -1); else { setSort(key); setDir(1) } }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: sort === key ? C.red : C.textDim, fontWeight: 500, padding: 0 }}>
      {label} {sort === key ? (dir === 1 ? '↑' : '↓') : ''}
    </button>
  )

  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>State crime rankings</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>All 50 states ranked by FBI UCR 2022 data. Click column headers to sort.</p>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search state..." style={{ background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 13, outline: 'none', marginBottom: 20, width: 260 }} />
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 60px repeat(3, 110px) 80px', gap: 8, padding: '0 0 10px', borderBottom: `0.5px solid ${C.border}`, marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: C.textDim }}>#</div>
          <div style={{ fontSize: 11, color: C.textDim }}>State</div>
          <div style={{ fontSize: 11, color: C.textDim }}>Abbr</div>
          {[['Violent/100k', 'violent'], ['Property/100k', 'property'], ['Safety score', 'score']].map(([l, k]) => <div key={k}>{colH(l, k)}</div>)}
          <div style={{ fontSize: 11, color: C.textDim }}>Trend</div>
        </div>
        {sorted.map((s, i) => (
          <button key={s.slug} onClick={() => navigate('map/' + s.slug)} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 60px repeat(3, 110px) 80px', gap: 8, padding: '9px 0', borderBottom: `0.5px solid ${C.border}`, alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: `0.5px solid ${C.border}` }}>
            <div style={{ fontSize: 12, color: C.textDim }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: C.text }}>{s.name}</div>
            <div style={{ fontSize: 12, color: C.textDim }}>{s.abbr}</div>
            <div style={{ fontSize: 13, color: getCrimeColor(s.violent), fontWeight: 500 }}>{s.violent.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{s.property.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: getScoreColor(s.score), fontWeight: 500 }}>{s.score}</div>
            <div style={{ fontSize: 11, color: s.trend === 'up' ? C.redBright : s.trend === 'down' ? C.green : C.textDim }}>{s.trend === 'up' ? '▲ rising' : s.trend === 'down' ? '▼ falling' : '→ stable'}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── TOOL: CRIME TYPE BREAKDOWN ───────────────────────────────────────────────
function CrimeTypePage({ navigate }) {
  const [selected, setSelected] = useState(CITY_DATA[0])
  const total = selected.violent + selected.property
  const vPct = Math.round((selected.violent / total) * 100)
  const pPct = 100 - vPct
  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Crime type breakdown</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>See the split between violent and property crime for any US city.</p>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Select a city</div>
        <select onChange={e => setSelected(CITY_DATA.find(c => c.name === e.target.value))} style={{ background: C.bgCard, border: `0.5px solid ${C.borderHover}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 14, outline: 'none', minWidth: 280 }}>
          {CITY_DATA.map(c => <option key={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ ...card, flex: '1 1 280px' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 20 }}>{selected.name}</div>
          <div style={{ height: 20, borderRadius: 4, overflow: 'hidden', display: 'flex', marginBottom: 12 }}>
            <div style={{ width: vPct + '%', background: C.redBright }} />
            <div style={{ flex: 1, background: C.amber, opacity: 0.7 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: C.redBright }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Violent {vPct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: C.amber, opacity: 0.7 }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Property {pPct}%</span>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatBadge label="Violent crime/100k" val={selected.violent.toLocaleString()} color={C.redBright} />
            <StatBadge label="Property crime/100k" val={selected.property.toLocaleString()} color={C.amber} />
            <StatBadge label="vs nat avg violent" val={(selected.violent > natAvgViolent ? '+' : '') + Math.round(((selected.violent - natAvgViolent) / natAvgViolent) * 100) + '%'} color={selected.violent > natAvgViolent ? C.redBright : C.green} />
            <StatBadge label="vs nat avg property" val={(selected.property > natAvgProperty ? '+' : '') + Math.round(((selected.property - natAvgProperty) / natAvgProperty) * 100) + '%'} color={selected.property > natAvgProperty ? C.amber : C.green} />
          </div>
        </div>
        <div style={{ ...card, flex: '1 1 220px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 14 }}>National context</div>
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
            Nationally, property crime is about <span style={{ color: C.text }}>5× more common</span> than violent crime. The typical city has roughly 80% property crime and 20% violent crime in its overall crime mix.<br/><br/>
            <span style={{ color: C.text }}>{selected.name.split(',')[0]}</span> has <span style={{ color: getCrimeColor(selected.violent) }}>{vPct > 20 ? 'above-average' : 'below-average'}</span> violent crime as a share of total crime.
          </div>
        </div>
      </div>
      <AffiliateBar score={selected.score} />
    </div>
  )
}

// ─── TOOL: CAMPUS SAFETY ──────────────────────────────────────────────────────
function CampusSafetyPage({ navigate }) {
  const [selected, setSelected] = useState(CAMPUS_DATA[0])
  const sorted = [...CAMPUS_DATA].sort((a, b) => b.score - a.score)
  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <button onClick={() => navigate('tools')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All tools</button>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Campus safety checker</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Clery Act crime disclosures for 20 major US university campuses.</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Select a campus</div>
          <div style={card}>
            {sorted.map(c => (
              <button key={c.name} onClick={() => setSelected(c)} style={{ width: '100%', background: selected.name === c.name ? C.bgDeep : 'none', border: 'none', borderRadius: 6, padding: '9px 10px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 12, color: C.text }}>{c.name}</span>
                <span style={{ fontSize: 12, color: getScoreColor(c.score), fontWeight: 500 }}>{c.score}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: '2 1 300px' }}>
          <div style={{ ...card, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <ScoreRing score={selected.score} size={80} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: C.text }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{selected.state} · Clery Act 2022</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <StatBadge label="Violent crimes" val={selected.violent} color={getCrimeColor(selected.violent * 5)} />
              <StatBadge label="Burglaries" val={selected.burglary} color={C.amber} />
              <StatBadge label="Theft incidents" val={selected.theft} color={C.textMuted} />
            </div>
          </div>
          <div style={{ ...card, fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
            <div style={{ fontWeight: 500, color: C.text, marginBottom: 6 }}>About Clery Act data</div>
            Colleges and universities receiving federal funding must disclose campus crime statistics annually under the Clery Act. These figures cover crimes reported to campus security and local police on or near campus. Campus crime statistics are not directly comparable to city crime rates due to differences in population, geography, and reporting methodology.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── GUIDES PAGE ──────────────────────────────────────────────────────────────
function GuidesPage({ navigate }) {
  return (
    <div style={{ ...wrap, padding: '40px 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: C.text, marginBottom: 6 }}>Safety guides</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Evidence-based guides to understanding crime data and protecting your home.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {GUIDES.map(g => (
          <button key={g.id} onClick={() => navigate('guides/' + g.id)} style={{ ...card, textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ fontSize: 11, color: C.red, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>{g.category}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 6 }}>{g.title}</div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{g.intro.slice(0, 100)}…</div>
            <div style={{ fontSize: 12, color: C.textDim }}>{g.readTime} read</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── ARTICLE PAGE ─────────────────────────────────────────────────────────────
function ArticlePage({ slug, navigate }) {
  const guide = GUIDES.find(g => g.id === slug)
  if (!guide) return <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Article not found. <button onClick={() => navigate('guides')} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer' }}>Back to guides</button></div>
  const related = GUIDES.filter(g => g.id !== slug && g.category === guide.category).slice(0, 2)
  return (
    <div>
      <div style={{ background: C.bgDeep, padding: '48px 20px 40px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ ...wrap, maxWidth: 740 }}>
          <button onClick={() => navigate('guides')} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← All guides</button>
          <div style={{ fontSize: 11, color: C.red, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em' }}>{guide.category}</div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: C.text, lineHeight: 1.3, marginBottom: 10 }}>{guide.title}</h1>
          <div style={{ fontSize: 13, color: C.textDim }}>Crime Mapper · {guide.readTime} read · Data source: FBI UCR 2022</div>
        </div>
      </div>
      <div style={{ ...wrap, maxWidth: 740, padding: '40px 20px' }}>
        <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 32, borderLeft: `3px solid ${C.red}`, paddingLeft: 16 }}>{guide.intro}</p>
        {guide.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: C.text, marginBottom: 10 }}>{s.h}</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
        {guide.faq && (
          <div style={{ ...card, marginTop: 12, marginBottom: 32 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 16 }}>Frequently asked questions</div>
            {guide.faq.map((f, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < guide.faq.length - 1 ? `0.5px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 6 }}>{f.q}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{f.a}</div>
              </div>
            ))}
          </div>
        )}
        {related.length > 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12 }}>Related guides</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {related.map(r => (
                <button key={r.id} onClick={() => navigate('guides/' + r.id)} style={{ ...card, textAlign: 'left', cursor: 'pointer' }}>
                  <div style={{ fontSize: 11, color: C.red, marginBottom: 6 }}>{r.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{r.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <AffiliateBar />
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => urlToPage(window.location.pathname))

  useEffect(() => {
    const handlePop = () => setPage(urlToPage(window.location.pathname))
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const navigate = (newPage) => {
    window.history.pushState({}, '', pageToUrl(newPage))
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  const renderPage = () => {
    if (page === 'home') return <HomePage navigate={navigate} />
    if (page === 'map') return <MapPage navigate={navigate} />
    if (page.startsWith('map/')) return <StatePage slug={page.slice(4)} navigate={navigate} />
    if (page === 'tools') return <ToolsPage navigate={navigate} />
    if (page === 'tools/neighborhood-safety-score') return <SafetyScorePage navigate={navigate} />
    if (page === 'tools/city-comparison') return <CityComparisonPage navigate={navigate} />
    if (page === 'tools/crime-trend-tracker') return <TrendTrackerPage navigate={navigate} />
    if (page === 'tools/safest-cities') return <SafestCitiesPage navigate={navigate} />
    if (page === 'tools/most-dangerous-cities') return <MostDangerousCitiesPage navigate={navigate} />
    if (page === 'tools/state-rankings') return <StateRankingsPage navigate={navigate} />
    if (page === 'tools/crime-type-breakdown') return <CrimeTypePage navigate={navigate} />
    if (page === 'tools/campus-safety-checker') return <CampusSafetyPage navigate={navigate} />
    if (page === 'guides') return <GuidesPage navigate={navigate} />
    if (page.startsWith('guides/')) return <ArticlePage slug={page.slice(7)} navigate={navigate} />
    return <HomePage navigate={navigate} />
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Nav page={page} navigate={navigate} />
      {renderPage()}
      <Footer navigate={navigate} />
    </div>
  )
}
