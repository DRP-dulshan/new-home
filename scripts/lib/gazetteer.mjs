/** Dubai communities and the words that place a listing in them. Shared by the importers. */
export const GAZETTEER = [
  ['Palm Jebel Ali', ['palm jebel ali', 'palm jebelali']],
  ['Palm Jumeirah', ['palm jumeirah', 'the palm', 'shoreline', 'golden mile', 'frond', 'fairmont', 'st. regis', 'st regis', 'seven palm', 'palm tower', 'oceana', 'tiara', 'one palm', 'balqis', 'serenia', 'palm views', 'palm']],
  ['Jumeirah Beach Residence', ['jbr', 'jumeirah beach residence', 'the walk', 'sadaf', 'bahar', 'murjan', 'rimal', 'amwaj', 'shams']],
  ['Dubai Harbour', ['emaar beachfront', 'beachfront', 'marina vista', 'sunrise bay', 'beach vista', 'grand bleu', 'dubai harbour', 'seapoint', 'bayview']],
  ['Bluewaters Island', ['bluewaters']],
  ['Dubai Marina', ['dubai marina', 'marina gate', 'cayan', 'princess tower', 'marina promenade', 'silverene', 'marina', 'elite residence', 'torch']],
  ['Jumeirah Lake Towers', ['jlt', 'jumeirah lake towers', 'jumeirah lakes towers']],
  ['Downtown Dubai', ['downtown', 'burj khalifa', 'boulevard', 'opera', 'burj royale', 'act one', 'grande']],
  ['DIFC', ['difc', 'index tower', 'liberty house']],
  ['Business Bay', ['business bay', 'aykon', 'canal', 'peninsula', 'paramount', 'executive towers', 'bay square']],
  ['City Walk', ['city walk']],
  ['Safa Park', ['safa park']],
  ['Dubai Hills Estate', ['dubai hills', 'park heights', 'collective', 'socio']],
  ['Mohammed Bin Rashid City', ['mbr city', 'mohammed bin rashid', 'sobha hartland', 'hartland', 'district one', 'district 11', 'meydan', 'creek vistas', '350 riverside']],
  ['Dubai Creek Harbour', ['creek harbour', 'creek beach', 'dubai creek', 'creek rise', 'creek gate', 'harbour gate']],
  ['Dubai Maritime City', ['maritime city', 'chelsea residences']],
  ['Dubai Islands', ['dubai islands', 'sunset bay']],
  ['JVC', ['jvc', 'jumeirah village circle']],
  ['Jumeirah Village Triangle', ['jvt', 'jumeirah village triangle']],
  ['Arabian Ranches', ['arabian ranches']],
  ['Damac Hills 2', ['damac hills 2', 'damac hills-2', 'akoya']],
  ['Damac Hills', ['damac hills', 'damac hills-1']],
  ['Damac Lagoons', ['damac lagoons', 'lagoons']],
  ['Arjan', ['arjan']],
  ['Al Barari', ['al barari']],
  ['Dubailand', ['majan', 'dubailand', 'dlrc', 'samana']],
  ['International City', ['international city']],
  ['Dubai Science Park', ['science park']],
  ['Villanova', ['villanova']],
  ['Al Furjan', ['al furjan', 'furjan']],
  ['Town Square', ['town square']],
  ['Dubai South', ['dubai south', 'emaar south', 'expo']],
  ['Dubai Sports City', ['sports city']],
  ['Motor City', ['motor city']],
  ['Al Jaddaf', ['jaddaf']],
  ['Dubai Silicon Oasis', ['silicon oasis']],
  ['Discovery Gardens', ['discovery gardens']],
  ['Al Barsha', ['al barsha', 'barsha']],
  ['The Valley', ['the valley']],
  ['Tilal Al Ghaf', ['tilal al ghaf']],
  ['Jumeirah', ['madinat jumeirah', 'jumeirah 1', 'jumeirah 2', 'jumeirah 3', 'la mer', 'jumeirah bay', 'umm suqeim']],
];

export function inferArea(...texts) {
  for (const raw of texts) {
    const hay = (raw || '').toLowerCase();
    for (const [name, keys] of GAZETTEER) {
      if (keys.some((k) => new RegExp(`(?<![a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`).test(hay))) return name;
    }
  }
  return null;
}
