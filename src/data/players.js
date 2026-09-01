const players = [
  // ==================== PORTIERI ====================
  
  // PORTIERI TOP
  { id: 'svilar', name: 'Svilar', team: 'Roma', role: 'Portiere', category: 'Top', price: 55, titol: 5, affid: 5, integr: 5 },
  { id: 'maignan', name: 'Maignan', team: 'Milan', role: 'Portiere', category: 'Top', price: 47, titol: 4, affid: 4, integr: 4 },
  { id: 'martinez-jo', name: 'Martinez Jo.', team: 'Inter', role: 'Portiere', category: 'Top', price: 44, titol: 2, affid: 3, integr: 2 },
  { id: 'butez', name: 'Butez', team: 'Como', role: 'Portiere', category: 'Top', price: 43, titol: 5, affid: 4, integr: 5 },
  { id: 'meret', name: 'Meret', team: 'Napoli', role: 'Portiere', category: 'Top', price: 41, titol: 4, affid: 4, integr: 4 },
  { id: 'di-gregorio', name: 'Di Gregorio', team: 'Juventus', role: 'Portiere', category: 'Top', price: 40, titol: 5, affid: 4, integr: 5 },
  { id: 'carnesecchi', name: 'Carnesecchi', team: 'Atalanta', role: 'Portiere', category: 'Top', price: 36, titol: 5, affid: 5, integr: 5 },
  
  // PORTIERI SEMI-TOP
  { id: 'de-gea', name: 'De Gea', team: 'Fiorentina', role: 'Portiere', category: 'Semi-Top', price: 24, titol: 5, affid: 5, integr: 5 },
  { id: 'mandas', name: 'Mandas', team: 'Lazio', role: 'Portiere', category: 'Semi-Top', price: 22, titol: 3, affid: 4, integr: 3 },
  { id: 'skorupski', name: 'Skorupski', team: 'Bologna', role: 'Portiere', category: 'Semi-Top', price: 11, titol: 4, affid: 4, integr: 4 },
  
  // PORTIERI TERZA FASCIA
  { id: 'falcone', name: 'Falcone', team: 'Lecce', role: 'Portiere', category: 'Terza Fascia', price: 9, titol: 4, affid: 4, integr: 5 },
  { id: 'okoye', name: 'Okoye', team: 'Udinese', role: 'Portiere', category: 'Terza Fascia', price: 9, titol: 4, affid: 4, integr: 5 },
  { id: 'caprile', name: 'Caprile', team: 'Cagliari', role: 'Portiere', category: 'Terza Fascia', price: 9, titol: 4, affid: 4, integr: 5 },
  { id: 'bijlow', name: 'Bijlow', team: 'Genoa', role: 'Portiere', category: 'Terza Fascia', price: 9, titol: 4, affid: 4, integr: 5 },
  
  // PORTIERI QUARTA FASCIA
  { id: 'paleari', name: 'Paleari', team: 'Torino', role: 'Portiere', category: 'Quarta Fascia', price: 5, titol: 4, affid: 4, integr: 3 },
  { id: 'muric', name: 'Muric', team: 'Sassuolo', role: 'Portiere', category: 'Quarta Fascia', price: 0, titol: 4, affid: 3, integr: 3 },
  { id: 'stankovic-f', name: 'Stankovic F.', team: 'Venezia', role: 'Portiere', category: 'Quarta Fascia', price: 0, titol: 5, affid: 4, integr: 5 },
  { id: 'thiam', name: 'Thiam', team: 'Monza', role: 'Portiere', category: 'Quarta Fascia', price: 0, titol: 5, affid: 4, integr: 5 },
  { id: 'palmisani', name: 'Palmisani', team: 'Frosinone', role: 'Portiere', category: 'Quarta Fascia', price: 0, titol: 5, affid: 4, integr: 5 },
  
  // ==================== DIFENSORI CENTRALI ====================
  
  // DIFENSORI CENTRALI TOP
  { id: 'bremer', name: 'Bremer', team: 'Juventus', role: 'Difensore Centrale', category: 'Top', price: 35, titol: 4, affid: 5, integr: 4 },
  { id: 'mancini', name: 'Mancini', team: 'Roma', role: 'Difensore Centrale', category: 'Top', price: 29, titol: 5, affid: 5, integr: 5 },
  { id: 'rrahmani', name: 'Rrahmani', team: 'Atalanta', role: 'Difensore Centrale', category: 'Top', price: 27, titol: 5, affid: 5, integr: 5 },
  { id: 'solet', name: 'Solet', team: 'Udinese', role: 'Difensore Centrale', category: 'Top', price: 26, titol: 4, affid: 4, integr: 4 },
  { id: 'bastoni', name: 'Bastoni', team: 'Inter', role: 'Difensore Centrale', category: 'Top', price: 25, titol: 4, affid: 4, integr: 4 },
  { id: 'pavlovic', name: 'Pavlovic', team: 'Milan', role: 'Difensore Centrale', category: 'Top', price: 23, titol: 5, affid: 4, integr: 5 },
  { id: 'kalulu-dc', name: 'Kalulu', team: 'Juventus', role: 'Difensore Centrale', category: 'Top', price: 20, titol: 5, affid: 4, integr: 5 },
  { id: 'ndicka', name: "N'Dicka", team: 'Roma', role: 'Difensore Centrale', category: 'Top', price: 20, titol: 4, affid: 4, integr: 4 },
  
  // DIFENSORI CENTRALI SEMI-TOP
  { id: 'bisseck', name: 'Bisseck', team: 'Inter', role: 'Difensore Centrale', category: 'Semi-Top', price: 18, titol: 3, affid: 4, integr: 3 },
  { id: 'ramon', name: 'Ramon', team: 'Como', role: 'Difensore Centrale', category: 'Semi-Top', price: 16, titol: 4, affid: 4, integr: 4 },
  { id: 'ostigard', name: 'Ostigard', team: 'Genoa', role: 'Difensore Centrale', category: 'Semi-Top', price: 15, titol: 4, affid: 4, integr: 4 },
  { id: 'scalvini', name: 'Scalvini', team: 'Atalanta', role: 'Difensore Centrale', category: 'Semi-Top', price: 14, titol: 3, affid: 3, integr: 3 },
  { id: 'gila', name: 'Gila', team: 'Milan', role: 'Difensore Centrale', category: 'Semi-Top', price: 13, titol: 4, affid: 4, integr: 4 },
  { id: 'chalobah-dc', name: 'Chalobah T.', team: 'Como', role: 'Difensore Centrale', category: 'Semi-Top', price: 12, titol: 4, affid: 4, integr: 4 },
  { id: 'valdepenas', name: 'Valdepenas', team: 'Fiorentina', role: 'Difensore Centrale', category: 'Semi-Top', price: 11, titol: 1, affid: 2, integr: 1 },
  
  // DIFENSORI CENTRALI TERZA FASCIA
  { id: 'vasquez-dc', name: 'Vasquez', team: 'Genoa', role: 'Difensore Centrale', category: 'Terza Fascia', price: 12, titol: 5, affid: 4, integr: 5 },
  { id: 'dragusin', name: 'Dragusin', team: 'Fiorentina', role: 'Difensore Centrale', category: 'Terza Fascia', price: 9, titol: 2, affid: 3, integr: 2 },
  { id: 'koulierakis', name: 'Koulierakis', team: 'Roma', role: 'Difensore Centrale', category: 'Terza Fascia', price: 9, titol: 4, affid: 4, integr: 4 },
  { id: 'kelly-dc', name: 'Kelly L.', team: 'Juventus', role: 'Difensore Centrale', category: 'Terza Fascia', price: 8, titol: 5, affid: 4, integr: 5 },
  { id: 'gabbia', name: 'Gabbia', team: 'Milan', role: 'Difensore Centrale', category: 'Terza Fascia', price: 7, titol: 4, affid: 4, integr: 4 },
  { id: 'romagnoli', name: 'Romagnoli', team: 'Lazio', role: 'Difensore Centrale', category: 'Terza Fascia', price: 7, titol: 4, affid: 4, integr: 4 },
  { id: 'marcandalli', name: 'Marcandalli', team: 'Genoa', role: 'Difensore Centrale', category: 'Terza Fascia', price: 7, titol: 4, affid: 4, integr: 4 },
  { id: 'marin', name: 'Marin R.', team: 'Napoli', role: 'Difensore Centrale', category: 'Terza Fascia', price: 7, titol: 4, affid: 4, integr: 4 },
  
  // DIFENSORI CENTRALI QUARTA FASCIA
  { id: 'doekhi', name: 'Doekhi', team: 'Lazio', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 5, titol: 5, affid: 4, integr: 5 },
  { id: 'kabesele', name: 'Kabesele', team: 'Udinese', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 5, titol: 4, affid: 4, integr: 4 },
  { id: 'mina', name: 'Mina', team: 'Cagliari', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 4, titol: 3, affid: 4, integr: 3 },
  { id: 'ismajli', name: 'Ismajli', team: 'Torino', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 4, titol: 3, affid: 3, integr: 2 },
  { id: 'kristensen-dc', name: 'Kristensen T.', team: 'Udinese', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 4, titol: 4, affid: 4, integr: 3 },
  { id: 'idzes', name: 'Idzes', team: 'Sassuolo', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 3, titol: 5, affid: 5, integr: 5 },
  { id: 'circati', name: 'Circati', team: 'Parma', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 3, titol: 4, affid: 4, integr: 4 },
  { id: 'coco', name: 'Coco', team: 'Torino', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 2, titol: 5, affid: 4, integr: 5 },
  { id: 'tiago-gabriel', name: 'Tiago Gabriel', team: 'Lecce', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 2, titol: 5, affid: 4, integr: 5 },
  { id: 'viery-dc', name: 'Viery', team: 'Fiorentina', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 1, titol: 1, affid: 2, integr: 1 },
  { id: 'bracaglia-dc', name: 'Bracaglia', team: 'Frosinone', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 1, titol: 4, affid: 3, integr: 3 },
  { id: 'kolasinac-dc', name: 'Kolasinac', team: 'Atalanta', role: 'Difensore Centrale', category: 'Quarta Fascia', price: 1, titol: 3, affid: 4, integr: 3 },
  
  // ==================== DIFENSORI SINISTRI ====================
  
  // DIFENSORI SINISTRI TOP
  { id: 'jimenez-ds', name: 'Jimenez A.', team: 'Fiorentina', role: 'Difensore Sinistro', category: 'Top', price: 19, titol: 3, affid: 5, integr: 4 },
  { id: 'spinazzola', name: 'Spinazzola', team: 'Napoli', role: 'Difensore Sinistro', category: 'Top', price: 19, titol: 4, affid: 3, integr: 4 },
  
  // DIFENSORI SINISTRI SEMI-TOP
  { id: 'bartesaghi', name: 'Bartesaghi', team: 'Milan', role: 'Difensore Sinistro', category: 'Semi-Top', price: 17, titol: 4, affid: 4, integr: 4 },
  { id: 'cambiaso-ds', name: 'Cambiaso', team: 'Juventus', role: 'Difensore Sinistro', category: 'Semi-Top', price: 14, titol: 3, affid: 3, integr: 3 },
  { id: 'miranda-ds', name: 'Miranda J.', team: 'Bologna', role: 'Difensore Sinistro', category: 'Semi-Top', price: 11, titol: 4, affid: 4, integr: 4 },
  { id: 'carlos-augusto', name: 'Carlos Augusto', team: 'Inter', role: 'Difensore Sinistro', category: 'Semi-Top', price: 10, titol: 3, affid: 4, integr: 3 },
  
  // DIFENSORI SINISTRI TERZA FASCIA
  { id: 'vasquez-ds', name: 'Vasquez', team: 'Genoa', role: 'Difensore Sinistro', category: 'Terza Fascia', price: 12, titol: 5, affid: 4, integr: 5 },
  { id: 'valeri', name: 'Valeri', team: 'Parma', role: 'Difensore Sinistro', category: 'Terza Fascia', price: 8, titol: 4, affid: 4, integr: 4 },
  { id: 'bernasconi', name: 'Bernasconi', team: 'Atalanta', role: 'Difensore Sinistro', category: 'Terza Fascia', price: 8, titol: 3, affid: 4, integr: 3 },
  { id: 'kelly-ds', name: 'Kelly L.', team: 'Juventus', role: 'Difensore Sinistro', category: 'Terza Fascia', price: 8, titol: 5, affid: 4, integr: 5 },
  { id: 'haps', name: 'Haps', team: 'Venezia', role: 'Difensore Sinistro', category: 'Terza Fascia', price: 6, titol: 2, affid: 3, integr: 2 },
  
  // DIFENSORI SINISTRI QUARTA FASCIA
  { id: 'birindelli-ds', name: 'Birindelli', team: 'Monza', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 4, titol: 4, affid: 4, integr: 4 },
  { id: 'obert', name: 'Obert', team: 'Cagliari', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 3, titol: 5, affid: 4, integr: 5 },
  { id: 'mangas', name: 'Mangas', team: 'Monza', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 3, titol: 2, affid: 2, integr: 2 },
  { id: 'gallo', name: 'Gallo', team: 'Lecce', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 2, titol: 5, affid: 4, integr: 5 },
  { id: 'marusic-ds', name: 'Marusic', team: 'Lazio', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 2, titol: 5, affid: 4, integr: 5 },
  { id: 'viery-ds', name: 'Viery', team: 'Fiorentina', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 1, titol: 1, affid: 2, integr: 1 },
  { id: 'bracaglia-ds', name: 'Bracaglia', team: 'Frosinone', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 1, titol: 4, affid: 3, integr: 3 },
  { id: 'kolasinac-ds', name: 'Kolasinac', team: 'Atalanta', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 1, titol: 3, affid: 4, integr: 3 },
  { id: 'pedraza', name: 'Pedraza', team: 'Lecce', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 1, titol: 3, affid: 3, integr: 2 },
  { id: 'mitaj', name: 'Mitaj', team: 'Genoa', role: 'Difensore Sinistro', category: 'Quarta Fascia', price: 1, titol: 2, affid: 2, integr: 2 },
  
  // ==================== DIFENSORI DESTRI ====================
  
  // DIFENSORI DESTRI TOP
  { id: 'kalulu-dd', name: 'Kalulu', team: 'Juventus', role: 'Difensore Destro', category: 'Top', price: 20, titol: 5, affid: 4, integr: 5 },
  { id: 'jimenez-dd', name: 'Jimenez A.', team: 'Fiorentina', role: 'Difensore Destro', category: 'Top', price: 19, titol: 3, affid: 5, integr: 4 },
  { id: 'di-lorenzo', name: 'Di Lorenzo', team: 'Napoli', role: 'Difensore Destro', category: 'Top', price: 17, titol: 4, affid: 5, integr: 4 },
  
  // DIFENSORI DESTRI SEMI-TOP
  { id: 'celik', name: 'Celik', team: 'Juventus', role: 'Difensore Destro', category: 'Semi-Top', price: 15, titol: 5, affid: 5, integr: 5 },
  { id: 'cambiaso-dd', name: 'Cambiaso', team: 'Juventus', role: 'Difensore Destro', category: 'Semi-Top', price: 14, titol: 3, affid: 3, integr: 3 },
  { id: 'rensch', name: 'Rensch', team: 'Roma', role: 'Difensore Destro', category: 'Semi-Top', price: 13, titol: 5, affid: 4, integr: 5 },
  { id: 'chalobah-dd', name: 'Chalobah T.', team: 'Como', role: 'Difensore Destro', category: 'Semi-Top', price: 11, titol: 4, affid: 4, integr: 4 },
  { id: 'zappacosta', name: 'Zappacosta', team: 'Atalanta', role: 'Difensore Destro', category: 'Semi-Top', price: 6, titol: 3, affid: 4, integr: 3 },
  
  // DIFENSORI DESTRI TERZA FASCIA
  { id: 'norton-cuffy', name: 'Norton-Cuffy', team: 'Genoa', role: 'Difensore Destro', category: 'Terza Fascia', price: 8, titol: 4, affid: 4, integr: 4 },
  { id: 'vojvoda', name: 'Vojvoda', team: 'Udinese', role: 'Difensore Destro', category: 'Terza Fascia', price: 6, titol: 3, affid: 4, integr: 3 },
  { id: 'hainaut', name: 'Hainaut', team: 'Venezia', role: 'Difensore Destro', category: 'Terza Fascia', price: 6, titol: 5, affid: 5, integr: 5 },
  
  // DIFENSORI DESTRI QUARTA FASCIA
  { id: 'delprato', name: 'Delprato', team: 'Parma', role: 'Difensore Destro', category: 'Quarta Fascia', price: 5, titol: 5, affid: 5, integr: 5 },
  { id: 'kristensen-dd', name: 'Kristensen T.', team: 'Udinese', role: 'Difensore Destro', category: 'Quarta Fascia', price: 4, titol: 4, affid: 4, integr: 4 },
  { id: 'birindelli-dd', name: 'Birindelli', team: 'Monza', role: 'Difensore Destro', category: 'Quarta Fascia', price: 4, titol: 4, affid: 4, integr: 4 },
  { id: 'zortea', name: 'Zortea', team: 'Bologna', role: 'Difensore Destro', category: 'Quarta Fascia', price: 3, titol: 4, affid: 4, integr: 4 },
  { id: 'pedersen', name: 'Pedersen', team: 'Torino', role: 'Difensore Destro', category: 'Quarta Fascia', price: 3, titol: 4, affid: 4, integr: 4 },
  { id: 'marusic-dd', name: 'Marusic', team: 'Lazio', role: 'Difensore Destro', category: 'Quarta Fascia', price: 2, titol: 5, affid: 4, integr: 5 },
  { id: 'oyono', name: 'Oyono A.', team: 'Frosinone', role: 'Difensore Destro', category: 'Quarta Fascia', price: 2, titol: 5, affid: 4, integr: 5 },
  { id: 'smolic', name: 'Smolic I.', team: 'Roma', role: 'Difensore Destro', category: 'Quarta Fascia', price: 1, titol: 2, affid: 2, integr: 2 },
  
  // ==================== MEDIANI ====================
  
  // MEDIANI TOP
  { id: 'calhanoglu', name: 'Calhanoglu', team: 'Inter', role: 'Mediano', category: 'Top', price: 75, titol: 4, affid: 5, integr: 4 },
  { id: 'ederson', name: 'Ederson D.S.', team: 'Atalanta', role: 'Mediano', category: 'Top', price: 28, titol: 4, affid: 5, integr: 4 },
  
  // MEDIANI SEMI-TOP
  { id: 'modric', name: 'Modric', team: 'Milan', role: 'Mediano', category: 'Semi-Top', price: 17, titol: 4, affid: 4, integr: 4 },
  { id: 'calo', name: 'Calò', team: 'Frosinone', role: 'Mediano', category: 'Semi-Top', price: 16, titol: 5, affid: 4, integr: 5 },
  
  // MEDIANI TERZA FASCIA
  { id: 'kone', name: 'Kone M.', team: 'Roma', role: 'Mediano', category: 'Terza Fascia', price: 17, titol: 4, affid: 4, integr: 4 },
  { id: 'perrone', name: 'Perrone', team: 'Como', role: 'Mediano', category: 'Terza Fascia', price: 13, titol: 4, affid: 4, integr: 4 },
  { id: 'pessina', name: 'Pessina', team: 'Monza', role: 'Mediano', category: 'Terza Fascia', price: 6, titol: 4, affid: 4, integr: 4 },
  { id: 'busio', name: 'Busio', team: 'Venezia', role: 'Mediano', category: 'Terza Fascia', price: 0, titol: 3, affid: 3, integr: 3 },
  
  // MEDIANI QUARTA FASCIA
  { id: 'fagioli', name: 'Fagioli', team: 'Fiorentina', role: 'Mediano', category: 'Quarta Fascia', price: 2, titol: 4, affid: 4, integr: 4 },
  { id: 'locatelli', name: 'Locatelli', team: 'Juventus', role: 'Mediano', category: 'Quarta Fascia', price: 1, titol: 5, affid: 4, integr: 5 },
  { id: 'cataldi', name: 'Cataldi', team: 'Lazio', role: 'Mediano', category: 'Quarta Fascia', price: 1, titol: 4, affid: 4, integr: 4 },
  { id: 'de-roon', name: 'De Roon', team: 'Atalanta', role: 'Mediano', category: 'Quarta Fascia', price: 1, titol: 4, affid: 5, integr: 4 },
  { id: 'fitz-jim', name: 'Fitz-Jim', team: 'Torino', role: 'Mediano', category: 'Quarta Fascia', price: 1, titol: 2, affid: 2, integr: 2 },
  
  // MEDIANI SCOMMESSE
  { id: 'oulai', name: 'Oulai', team: 'Fiorentina', role: 'Mediano', category: 'Scommesse', price: 0, titol: 4, affid: 3, integr: 4 },
  { id: 'stankovic-a', name: 'Stankovic A.', team: 'Inter', role: 'Mediano', category: 'Scommesse', price: 0, titol: 5, affid: 4, integr: 5 },
  { id: 'el-aynoui', name: 'El Aynoui', team: 'Roma', role: 'Mediano', category: 'Scommesse', price: 0, titol: 2, affid: 3, integr: 2 },
  
  // ==================== CENTROCAMPISTI ====================
  
  // CENTROCAMPISTI TOP
  { id: 'mctominay', name: 'McTominay', team: 'Napoli', role: 'Centrocampista', category: 'Top', price: 60, titol: 5, affid: 5, integr: 5 },
  { id: 'da-cunha', name: 'Da Cunha', team: 'Como', role: 'Centrocampista', category: 'Top', price: 40, titol: 5, affid: 4, integr: 5 },
  { id: 'zielinski', name: 'Zielinski', team: 'Inter', role: 'Centrocampista', category: 'Top', price: 38, titol: 3, affid: 4, integr: 3 },
  { id: 'atta', name: 'Atta', team: 'Fiorentina', role: 'Centrocampista', category: 'Top', price: 36, titol: 4, affid: 4, integr: 4 },
  { id: 'barella', name: 'Barella', team: 'Inter', role: 'Centrocampista', category: 'Top', price: 30, titol: 5, affid: 5, integr: 5 },
  { id: 'rabiot', name: 'Rabiot', team: 'Milan', role: 'Centrocampista', category: 'Top', price: 26, titol: 4, affid: 4, integr: 4 },
  
  // CENTROCAMPISTI SEMI-TOP
  { id: 'mckennie', name: 'McKennie', team: 'Juventus', role: 'Centrocampista', category: 'Semi-Top', price: 25, titol: 3, affid: 4, integr: 3 },
  { id: 'ekkelenkamp', name: 'Ekkelenkamp', team: 'Udinese', role: 'Centrocampista', category: 'Semi-Top', price: 18, titol: 4, affid: 4, integr: 4 },
  
  // CENTROCAMPISTI TERZA FASCIA
  { id: 'mkhitaryan', name: 'Mkhitaryan', team: 'Inter', role: 'Centrocampista', category: 'Terza Fascia', price: 14, titol: 3, affid: 4, integr: 3 },
  { id: 'samardzic', name: 'Samardzic', team: 'Atalanta', role: 'Centrocampista', category: 'Terza Fascia', price: 8, titol: 2, affid: 3, integr: 2 },
  { id: 'bernabe', name: 'Bernabè', team: 'Parma', role: 'Centrocampista', category: 'Terza Fascia', price: 8, titol: 4, affid: 4, integr: 4 },
  { id: 'thorstvedt', name: 'Thorstvedt', team: 'Sassuolo', role: 'Centrocampista', category: 'Terza Fascia', price: 12, titol: 4, affid: 4, integr: 4 },
  
  // CENTROCAMPISTI QUARTA FASCIA
  { id: 'thuram-k', name: 'Thuram K.', team: 'Juventus', role: 'Centrocampista', category: 'Quarta Fascia', price: 9, titol: 3, affid: 4, integr: 3 },
  { id: 'casadei', name: 'Casadei', team: 'Torino', role: 'Centrocampista', category: 'Quarta Fascia', price: 7, titol: 3, affid: 3, integr: 3 },
  { id: 'basic', name: 'Basic', team: 'Venezia', role: 'Centrocampista', category: 'Quarta Fascia', price: 2, titol: 3, affid: 3, integr: 3 },
  { id: 'cristante', name: 'Cristante', team: 'Roma', role: 'Centrocampista', category: 'Quarta Fascia', price: 1, titol: 4, affid: 4, integr: 4 },
  { id: 'gaetano', name: 'Gaetano', team: 'Atalanta', role: 'Centrocampista', category: 'Quarta Fascia', price: 1, titol: 3, affid: 3, integr: 3 },
  { id: 'dele-bashiru', name: 'Dele-Bashiru', team: 'Lazio', role: 'Centrocampista', category: 'Quarta Fascia', price: 1, titol: 2, affid: 3, integr: 2 },
  
  // ==================== ALI ====================
  
  // ALI TOP
  { id: 'dimarco', name: 'Dimarco', team: 'Inter', role: 'Ala', category: 'Top', price: 75, titol: 5, affid: 5, integr: 5 },
  { id: 'orsolini-ala', name: 'Orsolini', team: 'Bologna', role: 'Ala', category: 'Top', price: 74, titol: 4, affid: 5, integr: 4 },
  { id: 'santos-ala', name: 'Santos A.', team: 'Napoli', role: 'Ala', category: 'Top', price: 44, titol: 2, affid: 3, integr: 2 },
  { id: 'alajbegovic', name: 'Alajbegovic', team: 'Juventus', role: 'Ala', category: 'Top', price: 43, titol: 4, affid: 4, integr: 4 },
  { id: 'diao', name: 'Diao', team: 'Como', role: 'Ala', category: 'Top', price: 42, titol: 2, affid: 3, integr: 2 },
  { id: 'zaccagni-ala', name: 'Zaccagni', team: 'Lazio', role: 'Ala', category: 'Top', price: 31, titol: 2, affid: 2, integr: 2 },
  
  // ALI SEMI-TOP
  { id: 'mastantuono', name: 'Mastantuono', team: 'Fiorentina', role: 'Ala', category: 'Semi-Top', price: 41, titol: 3, affid: 4, integr: 3 },
  { id: 'neres-ala', name: 'Neres', team: 'Napoli', role: 'Ala', category: 'Semi-Top', price: 38, titol: 4, affid: 4, integr: 4 },
  { id: 'rowe', name: 'Rowe', team: 'Bologna', role: 'Ala', category: 'Semi-Top', price: 30, titol: 3, affid: 3, integr: 3 },
  { id: 'rodriguez-ala', name: 'Rodriguez Je.', team: 'Como', role: 'Ala', category: 'Semi-Top', price: 29, titol: 4, affid: 4, integr: 4 },
  { id: 'conceicao-ala', name: 'Conceicao', team: 'Juventus', role: 'Ala', category: 'Semi-Top', price: 25, titol: 3, affid: 4, integr: 3 },
  { id: 'isaksen', name: 'Isaksen', team: 'Lazio', role: 'Ala', category: 'Semi-Top', price: 22, titol: 3, affid: 3, integr: 3 },
  
  // ALI TERZA FASCIA
  { id: 'saelemaekers', name: 'Saelemaekers', team: 'Milan', role: 'Ala', category: 'Terza Fascia', price: 19, titol: 4, affid: 4, integr: 4 },
  { id: 'bernardeschi', name: 'Bernardeschi', team: 'Bologna', role: 'Ala', category: 'Terza Fascia', price: 14, titol: 3, affid: 4, integr: 3 },
  
  // ALI QUARTA FASCIA
  { id: 'ghedjemis-ala', name: 'Ghedjemis', team: 'Frosinone', role: 'Ala', category: 'Quarta Fascia', price: 20, titol: 5, affid: 4, integr: 5 },
  { id: 'felici', name: 'Felici', team: 'Cagliari', role: 'Ala', category: 'Quarta Fascia', price: 7, titol: 1, affid: 2, integr: 1 },
  { id: 'zerbin', name: 'Zerbin', team: 'Frosinone', role: 'Ala', category: 'Quarta Fascia', price: 5, titol: 2, affid: 3, integr: 2 },
  { id: 'cacciamani', name: 'Cacciamani', team: 'Torino', role: 'Ala', category: 'Quarta Fascia', price: 4, titol: 4, affid: 4, integr: 4 },
  { id: 'oristanio', name: 'Oristanio', team: 'Torino', role: 'Ala', category: 'Quarta Fascia', price: 3, titol: 2, affid: 3, integr: 2 },
  { id: 'ondrejka-ala', name: 'Ondrejka', team: 'Parma', role: 'Ala', category: 'Quarta Fascia', price: 3, titol: 2, affid: 3, integr: 2 },
  
  // ALI SCOMMESSE
  { id: 'vergara', name: 'Vergara', team: 'Napoli', role: 'Ala', category: 'Scommesse', price: 14, titol: 2, affid: 3, integr: 2 },
  { id: 'boga-ala', name: 'Boga', team: 'Juventus', role: 'Ala', category: 'Scommesse', price: 12, titol: 2, affid: 3, integr: 2 },
  { id: 'addai-ala', name: 'Addai', team: 'Como', role: 'Ala', category: 'Scommesse', price: 10, titol: 3, affid: 3, integr: 3 },
  { id: 'chukwueze', name: 'Chukwueze', team: 'Milan', role: 'Ala', category: 'Scommesse', price: 8, titol: 1, affid: 2, integr: 1 },
  { id: 'cambiaghi-ala', name: 'Cambiaghi', team: 'Bologna', role: 'Ala', category: 'Scommesse', price: 5, titol: 2, affid: 3, integr: 2 },
  { id: 'cancellieri-ala', name: 'Cancellieri', team: 'Lazio', role: 'Ala', category: 'Scommesse', price: 4, titol: 3, affid: 3, integr: 3 },
  { id: 'politano', name: 'Politano', team: 'Napoli', role: 'Ala', category: 'Scommesse', price: 3, titol: 2, affid: 3, integr: 2 },
  { id: 'kvernadze-ala', name: 'Kvernadze', team: 'Frosinone', role: 'Ala', category: 'Scommesse', price: 2, titol: 3, affid: 3, integr: 3 },
  { id: 'luis-henrique', name: 'Luis Henrique', team: 'Inter', role: 'Ala', category: 'Scommesse', price: 2, titol: 3, affid: 3, integr: 3 },
  { id: 'ndri', name: "N'Dri", team: 'Lecce', role: 'Ala', category: 'Scommesse', price: 2, titol: 2, affid: 2, integr: 2 },
  { id: 'zhegrova', name: 'Zhegrova', team: 'Juventus', role: 'Ala', category: 'Scommesse', price: 1, titol: 1, affid: 2, integr: 1 },
  
  // ==================== ATTACCANTI ====================
  
  // ATTACCANTI TOP
  { id: 'paz-n', name: 'Paz N.', team: 'Como', role: 'Attaccante', category: 'Top', price: 82, titol: 5, affid: 5, integr: 5 },
  { id: 'yildiz', name: 'Yildiz', team: 'Juventus', role: 'Attaccante', category: 'Top', price: 75, titol: 5, affid: 5, integr: 5 },
  { id: 'orsolini-att', name: 'Orsolini', team: 'Bologna', role: 'Attaccante', category: 'Top', price: 74, titol: 4, affid: 5, integr: 4 },
  { id: 'pulisic', name: 'Pulisic', team: 'Milan', role: 'Attaccante', category: 'Top', price: 60, titol: 5, affid: 5, integr: 5 },
  { id: 'dybala', name: 'Dybala', team: 'Roma', role: 'Attaccante', category: 'Top', price: 51, titol: 3, affid: 3, integr: 3 },
  
  // ATTACCANTI SEMI-TOP
  { id: 'leao', name: 'Leao', team: 'Milan', role: 'Attaccante', category: 'Semi-Top', price: 65, titol: 5, affid: 5, integr: 5 },
  { id: 'raspadori', name: 'Raspadori', team: 'Atalanta', role: 'Attaccante', category: 'Semi-Top', price: 47, titol: 2, affid: 3, integr: 2 },
  { id: 'de-ketelaere', name: 'De Ketelaere', team: 'Atalanta', role: 'Attaccante', category: 'Semi-Top', price: 45, titol: 4, affid: 4, integr: 4 },
  { id: 'zaniolo', name: 'Zaniolo', team: 'Udinese', role: 'Attaccante', category: 'Semi-Top', price: 35, titol: 4, affid: 4, integr: 4 },
  
  // ATTACCANTI TERZA FASCIA
  { id: 'santos-att', name: 'Santos A.', team: 'Napoli', role: 'Attaccante', category: 'Terza Fascia', price: 44, titol: 2, affid: 3, integr: 2 },
  { id: 'soule', name: 'Soule', team: 'Roma', role: 'Attaccante', category: 'Terza Fascia', price: 42, titol: 3, affid: 4, integr: 3 },
  { id: 'neres-att', name: 'Neres', team: 'Napoli', role: 'Attaccante', category: 'Terza Fascia', price: 40, titol: 4, affid: 4, integr: 4 },
  { id: 'zaccagni-att', name: 'Zaccagni', team: 'Lazio', role: 'Attaccante', category: 'Terza Fascia', price: 38, titol: 2, affid: 2, integr: 2 },
  { id: 'gudmundsson', name: 'Gudmundsson A.', team: 'Fiorentina', role: 'Attaccante', category: 'Terza Fascia', price: 31, titol: 4, affid: 4, integr: 4 },
  
  // ATTACCANTI QUARTA FASCIA
  { id: 'rodriguez-att', name: 'Rodriguez Je.', team: 'Como', role: 'Attaccante', category: 'Quarta Fascia', price: 29, titol: 4, affid: 4, integr: 4 },
  { id: 'yeboah', name: 'Yeboah J.', team: 'Venezia', role: 'Attaccante', category: 'Quarta Fascia', price: 25, titol: 5, affid: 4, integr: 5 },
  { id: 'vitinha', name: 'Vitinha O.', team: 'Genoa', role: 'Attaccante', category: 'Quarta Fascia', price: 10, titol: 4, affid: 4, integr: 4 },
  { id: 'mota', name: 'Mota', team: 'Monza', role: 'Attaccante', category: 'Quarta Fascia', price: 8, titol: 4, affid: 4, integr: 4 },
  { id: 'ghedjemis-att', name: 'Ghedjemis', team: 'Frosinone', role: 'Attaccante', category: 'Quarta Fascia', price: 5, titol: 5, affid: 4, integr: 5 },
  { id: 'ondrejka-att', name: 'Ondrejka', team: 'Parma', role: 'Attaccante', category: 'Quarta Fascia', price: 3, titol: 2, affid: 3, integr: 2 },
  
  // ATTACCANTI SCOMMESSE
  { id: 'nkunku', name: 'Nkunku', team: 'Milan', role: 'Attaccante', category: 'Scommesse', price: 35, titol: 4, affid: 4, integr: 4 },
  { id: 'conceicao-att', name: 'Conceicao', team: 'Juventus', role: 'Attaccante', category: 'Scommesse', price: 25, titol: 3, affid: 4, integr: 3 },
  { id: 'noslin', name: 'Noslin', team: 'Lazio', role: 'Attaccante', category: 'Scommesse', price: 22, titol: 4, affid: 3, integr: 4 },
  { id: 'maldini', name: 'Maldini', team: 'Cagliari', role: 'Attaccante', category: 'Scommesse', price: 17, titol: 4, affid: 4, integr: 4 },
  { id: 'boga-att', name: 'Boga', team: 'Juventus', role: 'Attaccante', category: 'Scommesse', price: 10, titol: 3, affid: 3, integr: 3 },
  { id: 'addai-att', name: 'Addai', team: 'Como', role: 'Attaccante', category: 'Scommesse', price: 10, titol: 4, affid: 3, integr: 4 },
  { id: 'cambiaghi-att', name: 'Cambiaghi', team: 'Bologna', role: 'Attaccante', category: 'Scommesse', price: 6, titol: 2, affid: 3, integr: 2 },
  { id: 'esposito-se', name: 'Esposito Se.', team: 'Cagliari', role: 'Attaccante', category: 'Scommesse', price: 5, titol: 4, affid: 4, integr: 4 },
  { id: 'cancellieri-att', name: 'Cancellieri', team: 'Lazio', role: 'Attaccante', category: 'Scommesse', price: 4, titol: 3, affid: 3, integr: 3 },
  { id: 'ekhator', name: 'Ekhator', team: 'Juventus', role: 'Attaccante', category: 'Scommesse', price: 3, titol: 2, affid: 3, integr: 2 },
  { id: 'adams', name: 'Adams C.', team: 'Torino', role: 'Attaccante', category: 'Scommesse', price: 2, titol: 3, affid: 3, integr: 3 },
  { id: 'kvernadze-att', name: 'Kvernadze', team: 'Frosinone', role: 'Attaccante', category: 'Scommesse', price: 2, titol: 3, affid: 3, integr: 3 },
];

export default players;