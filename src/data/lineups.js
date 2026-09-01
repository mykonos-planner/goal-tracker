const lineups = {
  'Atalanta': {
    starters: ['carnesecchi', 'scalvini', 'kristensen', 'ederson', 'gaetano', 'de-ketelaere'],
    possible: ['bellanova', 'zappacosta', 'bernasconi', 'kolasinac', 'samardzic', 'pasalic', 'scamacca', 'krstovic', 'raspadori', 'zalewski'],
  },
  'Bologna': {
    starters: ['skorupski', 'zortea', 'helland', 'heggem', 'miranda-ds', 'ferguson', 'moro-n', 'orsolini-ala', 'rowe'],
    possible: ['bernardeschi', 'odgaard', 'dovbyk', 'piccoli'],
  },
  'Cagliari': {
    starters: ['caprile', 'ze-pedro', 'mina', 'rodriguez-ju', 'obert', 'adopo', 'winks', 'romano', 'maldini', 'fazzini'],
    possible: ['kevin-carlos', 'mendy-p'],
  },
  'Como': {
    starters: ['butez', 'couto', 'ramon', 'chalobah-dc', 'kaiki', 'da-cunha', 'perrone', 'paz-n', 'baturina', 'douvikas'],
    possible: ['diao', 'rodriguez-je'],
  },
  'Fiorentina': {
    starters: ['de-gea', 'dragusin', 'viery-dc', 'valdepenas', 'atta', 'mastantuono', 'kean', 'gudmundsson'],
    possible: ['jimenez-a', 'dodo', 'ndour', 'mandragora', 'oulai', 'fagioli'],
  },
  'Frosinone': {
    starters: ['oyono-a', 'calo', 'zerbin', 'hasa', 'raimondo'],
    possible: ['palmisani', 'desplanches', 'monterisi', 'akpoguma', 'calvani', 'cittadini', 'terzic', 'bracaglia-dc', 'grillitsch', 'schmid', 'kvernadze-ala'],
  },
  'Genoa': {
    starters: ['bijlow', 'marcandalli', 'ostigard', 'vasquez-dc', 'norton-cuffy', 'frendrup', 'baldanzi', 'vitinha', 'colombo-g'],
    possible: ['sow', 'amorim', 'ellertsson', 'mitaj', 'traore-hj'],
  },
  'Inter': {
    starters: ['martinez-jo', 'akanji', 'bastoni', 'spence', 'barella', 'calhanoglu', 'dimarco', 'martinez-l', 'thuram'],
    possible: ['stones', 'bisseck', 'jones-c', 'zielinski', 'sucic', 'esposito-fp'],
  },
  'Juventus': {
    starters: ['vicario', 'bremer', 'cambiaso', 'conceicao-ala', 'alajbegovic', 'yildiz', 'kolo-muani'],
    possible: ['kalulu', 'celik', 'kelly-l', 'lucumi', 'locatelli', 'douglas-luiz', 'mckennie', 'thuram-k'],
  },
  'Lazio': {
    starters: ['mandas', 'marusic-ds', 'doekhi', 'pedraza', 'rovella', 'taylor-k', 'frattesi', 'zaccagni-ala'],
    possible: ['sutalo', 'provstgaard', 'isaksen', 'cancellieri-ala', 'dia', 'ratkov'],
  },
  'Lecce': {
    starters: ['falcone', 'veiga-d', 'gaspar-k', 'tiago-gabriel', 'gallo', 'ngom', 'pierotti', 'gandelman', 'ndri'],
    possible: ['coulibaly-l', 'berisha-m', 'geubbels', 'stulic'],
  },
  'Milan': {
    starters: ['maignan', 'gila', 'gabbia', 'pavlovic', 'rabiot', 'modric', 'pulisic', 'ramos-g'],
    possible: ['de-winter', 'saelemaekers', 'chukwueze', 'moreira', 'bartesaghi', 'loftus-cheek', 'leao'],
  },
  'Monza': {
    starters: ['thiam', 'birindelli-ds', 'lucchesi', 'carboni-a', 'bakoune', 'pessina', 'akinsanmiro', 'mangas', 'colpani', 'robinson-j', 'cutrone'],
    possible: [],
  },
  'Napoli': {
    starters: ['meret', 'di-lorenzo', 'rrahmani', 'lobotka', 'mctominay', 'hojlund', 'santos-ala'],
    possible: ['badiashile', 'beukema', 'spinazzola', 'olivera', 'zambo-anguissa', 'de-bruyne', 'politano', 'neres-ala'],
  },
  'Parma': {
    starters: ['daffara', 'delprato', 'ndiaye', 'troilo', 'valeri', 'bernabe', 'nicolussi-caviglia', 'keita-m', 'toure-e', 'romero-d', 'frigan'],
    possible: [],
  },
  'Roma': {
    starters: ['svilar', 'mancini', 'ndicka', 'molina', 'kone-m', 'wesley', 'dybala', 'malen'],
    possible: ['koulierakis', 'hermoso', 'cristante', 'el-aynaoui', 'mora', 'soule'],
  },
  'Sassuolo': {
    starters: ['muric', 'walukiewicz', 'cande', 'idzes', 'matic', 'adzic', 'berardi', 'lauriente'],
    possible: ['obrador', 'doig', 'thorstvedt', 'lipani', 'pinamonti', 'bowie'],
  },
  'Torino': {
    starters: ['paleari', 'comuzzo', 'comert', 'pedersen', 'gineitis', 'cacciamani', 'vlasic', 'simeone'],
    possible: ['coco', 'ismajli', 'fitz-jim', 'ilkhan', 'oristanio', 'casadei'],
  },
  'Udinese': {
    starters: ['okoye', 'kabasele', 'solet', 'vojvoda', 'ekkelenkamp', 'karlstrom', 'kamara-h', 'zaniolo', 'davis-k'],
    possible: ['bertola', 'palma', 'piotrowski', 'unai-gomez'],
  },
  'Venezia': {
    starters: ['stankovic-f', 'bella-kotchap', 'schingtienne', 'correia-t', 'busio', 'basic', 'haps', 'yeboah'],
    possible: ['moreno-m', 'halhal', 'sohm', 'perez-k', 'adams-a', 'rrahmani-al'],
  },
};

export default lineups;