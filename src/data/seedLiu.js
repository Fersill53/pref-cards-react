import { newCase, newDoctor, newNote } from './factories.js';
import {
  HOLD,
  OPEN,
  PLAIN,
  accent,
  danger,
  green,
  info,
  note,
  pills,
  table,
  teal,
  warn,
  warnPill,
} from './seedHelpers.js';

const TAGS = {
  colorectal: { label: 'Colorectal', kind: 'purple' },
  hepatobiliary: { label: 'Hepatobiliary', kind: 'teal' },
  hernia: { label: 'Hernia', kind: 'cervical' },
};

const globalNotes = () => [
  newNote({
    label: 'Platform',
    content:
      '**Preferred:** da Vinci DV5\n**Alternative:** da Vinci Xi\n**Console:** Two when available',
  }),
  newNote({
    label: 'Gloves — Dr. Liu',
    content:
      'Nonlatex · Size **7.5** blue undergloves\nSize **7.5** outer gloves\nOpen **2 double-glove sets** per case\nReplenish spares when used',
  }),
  newNote({
    label: 'Medications (all cases)',
    content:
      '**0.25% Marcaine 30 mL** — for surgeon injection\nOG tube placed after induction\nAntibiotics per institutional protocol',
  }),
  newNote({
    label: 'Prep (all cases)',
    content:
      '**Do NOT clip hair**\nChlorhexidine prep on abdomen\nIoban on abdomen\nPlastic-pocket drapes — leave adhesive backing in place',
  }),
  newNote({
    label: 'Robotic Camera',
    content:
      '**30° camera** for robotic use\nInitial entry: **0° laparoscope**\n30° laparoscope available as alternate',
  }),
  newNote({
    label: 'Camera Cleaning',
    content: 'Moist lap sponge on **lens only**\n**Do NOT** use on metal portion of scope',
  }),
  newNote({
    label: 'Insufflation',
    content:
      'AirSeal system on all cases\nPurple/magenta AirSeal cap on robotic 8 mm trocar (case-specific variants noted per card)',
  }),
  newNote({
    label: '⚠ Vessel Sealer Extend',
    warn: true,
    content: 'Plug into **vessel-sealing energy** connection — NOT bipolar connection',
  }),
  newNote({
    label: '⚠ Stapler Rule',
    warn: true,
    content:
      'Do **not substitute** circular stapler brand or size — resolve any discrepancy with surgeon',
  }),
  newNote({
    label: 'Positioning (all cases)',
    content:
      'Both arms tucked · Anti-slip pads · Sequential compression devices · Foam padding at all pressure points · Confirm stability before docking',
  }),
];

const cases = () => [
  newCase({
    name: 'Robotic Low Anterior Resection / Colostomy Reversal',
    tag: TAGS.colorectal,
    keywords:
      'low anterior resection LAR colostomy reversal lithotomy allen stirrups airseal gelport gelmini ICG colonoscope proctoscope sureform circular stapler vicryl vloc monocryl PDS ethibond blake drain ostomy betadine perineum colorectal',
    sections: [
      note(
        'Positioning',
        '**Modified lithotomy** — Allen stirrups · Both arms tucked\nOrient table pad **flush end toward feet** — do NOT place notched end caudally\nMaintain perineal access for proctoscopy, endoscopy, circular stapling, and extraction\nConfirm stability with table tilt before docking; recheck hands, pressure points, tubing'
      ),
      note(
        'Prep & Drape',
        '**Abdomen:** Chlorhexidine (including existing ostomy cases)\n**Perineum:** Betadine\nIoban · Plastic-pocket drapes · Three-quarter drapes ×2 · Under-buttock drape · Deep instrument pockets 4×18'
      ),
      pills('Additional Equipment', [
        teal('Adult colonoscope + CO₂ — connected & checked'),
        'Proctoscope with suction',
        'Long laparoscopic suction tip',
        '3 L NS — hang',
        'Natural orifice extraction table (separate sterile)',
        'Robotic fluorescence imaging for ICG',
      ]),
      pills('Medications', [
        accent('ICG → give to anesthesia; administer on surgeon request'),
        '0.25% Marcaine 30 mL',
        'Cefazolin + metronidazole',
      ]),
      table(
        'Ports',
        ['Item', 'Qty', 'Note'],
        [
          [OPEN, '5 mm entry trocar', '1', 'Separate; 0° scope for entry'],
          [OPEN, 'Robotic 8 mm trocar', '3', ''],
          [OPEN, 'Robotic 12 mm trocar', '1', ''],
          [PLAIN, 'AirSeal — no ostomy', '1', '5 mm white AirSeal trocar'],
          [
            HOLD,
            'AirSeal — existing ostomy',
            '1',
            'Purple/magenta — confirm model/size with surgeon',
          ],
          [
            HOLD,
            'GelPort/Gelmini (colostomy reversal)',
            '—',
            'HOLD · green or purple — confirm with surgeon',
          ],
        ]
      ),
      table(
        'Robotic Instruments',
        ['Arm', 'Instrument', 'Status'],
        [
          [OPEN, 'Arm 2', 'Fenestrated bipolar forceps', 'OPEN'],
          [OPEN, 'Arm 3', '30° camera', 'OPEN'],
          [OPEN, 'Arm 4', 'Monopolar curved scissors', 'OPEN'],
          [OPEN, 'Arm 4 exchange', 'Vessel Sealer Extend', 'OPEN'],
          [OPEN, 'Additional', 'Large SutureCut needle driver', 'OPEN'],
          [HOLD, 'Additional', 'Cadiere forceps', 'HOLD'],
        ]
      ),
      table(
        'Laparoscopic Supplies',
        ['Item', 'Status'],
        [
          [OPEN, 'Prestige bowel graspers', 'OPEN'],
          [OPEN, 'Laparoscopic needle driver', 'OPEN'],
          [OPEN, 'Laparoscopic suction/irrigation (long tip)', 'OPEN'],
          [OPEN, 'Scope warmer · Microfiber cloth · Port plunger · Moist lap sponge', 'OPEN'],
          [HOLD, '12 mm specimen retrieval bag', 'HOLD'],
          [HOLD, 'Small Alexis wound protector (leave string on)', 'HOLD'],
        ]
      ),
      table(
        'Stapling',
        ['Item', 'Status'],
        [
          [OPEN, 'SureForm 60 mm robotic stapler', 'OPEN'],
          [HOLD, 'Blue / Green / White loads', 'HOLD — open on request'],
          [
            HOLD,
            'Powered Ethicon circular stapler 28 mm & 31 mm',
            'HOLD — verify product numbers',
          ],
          [HOLD, 'Matching anvils and sizers', 'Match confirmed circular stapler system'],
        ]
      ),
      warn(
        '',
        'Do NOT substitute circular stapler brand or size — resolve discrepancy with surgeon'
      ),
      warn(
        'Natural Orifice Extraction Table — Keep Separate Sterile',
        'Keep transanal instruments separate from abdominal instruments at all times'
      ),
      table(
        '',
        ['Item', 'Note'],
        [
          [PLAIN, 'Small Alexis wound protector', 'Remove string only after device-use validation'],
          [PLAIN, 'Circular stapler sizers', 'Match selected system'],
          [PLAIN, 'Long ring forceps', 'Available on table'],
          [PLAIN, 'Large Kocher clamp · Hemostat', '1 each'],
          [PLAIN, 'KY jelly', '1 small cup'],
        ]
      ),
      note(
        '',
        'Abdominal backup Alexis: leave string attached · Change gloves & instruments before returning to abdominal work'
      ),
      table(
        'Sutures',
        ['Suture', 'Prep', 'Status'],
        [
          [OPEN, '3-0 dyed Vicryl SH', '2 — cut to 6"', 'OPEN'],
          [OPEN, '3-0 dyed Vicryl SH', '2 — cut to 8"', 'OPEN'],
          [OPEN, '3-0 V-Loc 180, V20', '6" long', 'OPEN'],
          [OPEN, '4-0 Monocryl', '×2', 'OPEN'],
          [OPEN, '0 Vicryl Endoloop · 0 Vicryl CT-1', 'Available', 'OPEN'],
          [HOLD, '#1 PDS CTX', 'Available', 'HOLD'],
        ]
      ),
      pills('Drains & Ostomy Supplies', [
        warnPill('HOLD: 19 Fr Blake drain + 2-0 nylon'),
        warnPill(
          'If ostomy created: 3-0 Vicryl SH pop-offs · Ostomy appliance · Skin barrier · Mastisol · Support rod if requested'
        ),
      ]),
    ],
  }),

  newCase({
    name: 'Robotic Right Colectomy',
    tag: TAGS.colorectal,
    keywords:
      'right colectomy robotic ileocolic anastomosis ICG fluorescence endo catch alexis sureform stapler vicryl vloc PDS monocryl exofin blake drain airseal supine colorectal',
    sections: [
      info('', 'Robot setup: **Upper abdomen — use all four arms**'),
      note(
        'Positioning',
        'Supine · Both arms tucked · Foley catheter\nOrient table pad flush end toward feet — do NOT place notched end caudally\nConfirm stability before docking; maintain access to extraction site'
      ),
      pills('Medications', [
        accent('ICG → give to anesthesia; administer on surgeon request'),
        '0.25% Marcaine 30 mL',
        'Cefazolin + metronidazole',
      ]),
      table(
        'Ports',
        ['Item', 'Qty', 'Status'],
        [
          [OPEN, '5 mm entry trocar', '1', 'OPEN'],
          [OPEN, 'Robotic 8 mm trocar', '3', 'OPEN'],
          [OPEN, 'Robotic 12 mm trocar', '1', 'OPEN'],
          [OPEN, 'Purple/magenta AirSeal cap', '1', 'Place on robotic 8 mm trocar'],
        ]
      ),
      table(
        'Robotic Instruments — All Four Arms',
        ['Arm', 'Instrument', 'Status'],
        [
          [OPEN, 'Arm 1', 'Fenestrated bipolar forceps', 'OPEN'],
          [OPEN, 'Arm 2', '30° robotic camera', 'OPEN'],
          [OPEN, 'Arm 3', 'Monopolar curved scissors', 'OPEN'],
          [OPEN, 'Arm 3 exchange', 'Vessel Sealer Extend', 'OPEN'],
          [OPEN, 'Arm 4', 'Cadiere forceps', 'OPEN'],
          [OPEN, 'Additional', 'Large SutureCut needle driver', 'OPEN'],
          [OPEN, 'Additional', 'Robotic suction/irrigation', 'OPEN'],
        ]
      ),
      warn('', 'Vessel Sealer Extend → vessel-sealing energy connection, NOT bipolar'),
      table(
        'Laparoscopic Supplies',
        ['Item', 'Status'],
        [
          [OPEN, 'Prestige bowel graspers · Laparoscopic needle driver', 'OPEN'],
          [OPEN, '3 L NS — hang, prime irrigation tubing', 'OPEN'],
          [OPEN, 'Scope warmer · Microfiber cloth · Port plunger · Moist lap sponge', 'OPEN'],
          [OPEN, '12 mm Endo Catch bag', 'OPEN'],
          [OPEN, 'Small Alexis retractor (leave string on)', 'OPEN'],
          [HOLD, 'Clip applier + clips (confirm system/sizes)', 'HOLD'],
        ]
      ),
      table(
        'Stapling',
        ['Item', 'Status'],
        [
          [OPEN, 'SureForm 60 mm robotic stapler', 'OPEN'],
          [HOLD, 'Blue / Green / White loads', 'HOLD — open on request'],
        ]
      ),
      note(
        'Specimen Extraction',
        'Both 12 mm Endo Catch and small Alexis used for extraction · Change gloves & instruments after extraction, before closure'
      ),
      table(
        'Sutures',
        ['Suture', 'Prep', 'Status'],
        [
          [OPEN, '3-0 dyed Vicryl SH', '2 — cut to 6" (replenish when used)', 'OPEN'],
          [OPEN, '3-0 dyed Vicryl SH', 'Full length', 'OPEN'],
          [OPEN, '3-0 V-Loc 180, V20', '6" long', 'OPEN'],
          [OPEN, '0 PDS CT-1', 'Single-armed', 'OPEN'],
          [OPEN, '4-0 Monocryl', '×2', 'OPEN'],
        ]
      ),
      pills('Closure & Drains', [
        green('0 PDS CT-1 single-armed'),
        green('4-0 Monocryl ×2'),
        accent('Exofin — OPEN'),
        warnPill('HOLD: 19 Fr Blake drain + 2-0 nylon'),
      ]),
    ],
  }),

  newCase({
    name: 'Robotic Laparoscopic Ileostomy Reversal',
    tag: TAGS.colorectal,
    draft: true,
    keywords:
      'ileostomy reversal robotic laparoscopic ECHELON 60 stapler contaminated alexis wound protector yankauer airseal binder vicryl PDS ethibond monocryl dermabond telfa purse string ostomy colorectal',
    sections: [
      warn('', 'DRAFT — For surgeon review before use'),
      note(
        'Positioning',
        'Supine · Both arms tucked · Foley catheter · Maintain access to ileostomy and port sites'
      ),
      warn(
        'AirSeal',
        'Purple/magenta AirSeal — confirm exact model, size, and cap configuration with surgeon before opening'
      ),
      table(
        'Ports',
        ['Item', 'Qty', 'Status'],
        [
          [OPEN, '5 mm Optiview entry trocar', '1', 'OPEN'],
          [OPEN, 'Robotic 8 mm trocar', '3', 'OPEN'],
          [PLAIN, 'Purple/magenta AirSeal', '1', 'OPEN once confirmed with surgeon'],
        ]
      ),
      table(
        'Robotic Instruments',
        ['Instrument', 'Status'],
        [
          [OPEN, '30° robotic camera', 'OPEN'],
          [OPEN, 'Fenestrated bipolar forceps', 'OPEN'],
          [OPEN, 'Monopolar curved scissors', 'OPEN'],
          [OPEN, 'Vessel Sealer Extend', 'OPEN'],
          [OPEN, 'Large SutureCut needle driver', 'OPEN'],
          [HOLD, 'Cadiere forceps', 'HOLD'],
          [HOLD, 'Robotic suction/irrigation', 'HOLD'],
        ]
      ),
      table(
        'Laparoscopic Supplies',
        ['Item', 'Status'],
        [
          [OPEN, 'Prestige bowel graspers', 'OPEN'],
          [OPEN, 'Small Alexis wound protector', 'OPEN'],
          [OPEN, 'Suction tubing + Yankauer', 'OPEN'],
          [OPEN, 'Irrigation + basin (contaminated area)', 'OPEN'],
          [OPEN, 'Scope warmer · Microfiber cloth · Port plunger · Moist lap sponge', 'OPEN'],
          [HOLD, 'Laparoscopic needle driver', 'HOLD'],
        ]
      ),
      table(
        'Stapling — ECHELON 60',
        ['Item', 'Qty', 'Status'],
        [
          [HOLD, 'ECHELON 60 mm stapler', '1', 'HOLD'],
          [HOLD, 'White 60 mm reload', '2', 'HOLD'],
          [HOLD, 'Blue 60 mm reload', '1', 'HOLD'],
        ]
      ),
      note(
        '',
        'Confirm exact ECHELON model + compatible reload product numbers · **Dr. Liu reloads the stapler**'
      ),
      danger(
        '⚠ Contaminated Stapler Handling Area',
        'Prepare a **clearly designated contaminated area for Dr. Liu** — separate from the clean sterile field\n\n▸ Dedicated basin for contaminated items\n▸ Irrigation for stapler washing per device instructions\n▸ Containment for used cartridges and staple debris\n\n**Dr. Liu handles contaminated stapler, washing, and reloading.**\nScrub tech maintains the clean field.\nDo NOT mix contaminated supplies with the clean field.\nChange gloves + contaminated attire before returning to clean work.'
      ),
      table(
        'Sutures',
        ['Suture', 'Qty', 'Status'],
        [
          [OPEN, '3-0 Vicryl', '2 — full length', 'OPEN'],
          [OPEN, '0 Vicryl UR-6', '2 — for closure', 'OPEN'],
          [OPEN, '#1 PDS CT-1', '2 — fascial repair', 'OPEN'],
          [OPEN, '4-0 Monocryl', 'Skin closure', 'OPEN'],
          [HOLD, '0 Ethibond CT-1', '2', 'HOLD'],
        ]
      ),
      pills('Closure & Dressings', [
        green('4-0 Monocryl'),
        'Dermabond — closed incisions',
        accent('Telfa — purse-string closure at ostomy site'),
        'Three-panel abdominal binder (postop)',
      ]),
    ],
  }),

  newCase({
    name: 'Robotic Laparoscopic Ventral Hernia Repair with Mesh',
    tag: TAGS.hernia,
    draft: true,
    keywords:
      'ventral hernia repair robotic mesh ventralight laparoscopic supine binder foley airseal vloc vicryl monocryl dermabond optiview trocar cadiere vessel sealer hernia',
    sections: [
      warn('', 'DRAFT — For surgeon review · Robot setup based on hernia location'),
      note(
        'Positioning',
        'Supine · Both arms tucked · Anti-slip pads · Sequential compression devices · Foam padding at pressure points\n**Foley:** Confirm with surgeon before placement — depends on estimated procedure duration\nPatient voids in pre-op before OR transfer'
      ),
      table(
        'Ports',
        ['Item', 'Qty', 'Status'],
        [
          [OPEN, '5 mm Optiview entry trocar', '1', 'OPEN'],
          [OPEN, 'Robotic 8 mm trocar', '3', 'OPEN'],
          [OPEN, 'Purple/magenta AirSeal cap', '1', 'Place on robotic 8 mm trocar'],
          [HOLD, 'Robotic 12 mm trocar', '1', 'HOLD'],
        ]
      ),
      table(
        'Robotic Instruments — Three Ports',
        ['Instrument', 'Status'],
        [
          [OPEN, '30° robotic camera', 'OPEN'],
          [OPEN, 'Fenestrated bipolar forceps', 'OPEN'],
          [OPEN, 'Monopolar curved scissors', 'OPEN'],
          [OPEN, 'Large SutureCut needle driver', 'OPEN'],
          [HOLD, 'Cadiere forceps', 'HOLD'],
          [
            HOLD,
            'Vessel Sealer Extend',
            'HOLD — verify vessel-sealing connection if requested',
          ],
          [
            HOLD,
            'Robotic suction/irrigation',
            'HOLD — if requested: hang 3 L NS, prime tubing',
          ],
        ]
      ),
      table(
        'Laparoscopic Supplies',
        ['Item', 'Status'],
        [
          [OPEN, 'Prestige bowel graspers', 'OPEN'],
          [
            OPEN,
            'Scope warmer · Microfiber cloth · Port plunger · Moist lap sponge · Sterile ruler',
            'OPEN',
          ],
          [HOLD, 'Laparoscopic needle driver', 'HOLD'],
          [HOLD, '3 L NS (suction/irrigation if requested)', 'HOLD'],
        ]
      ),
      warn(
        'Mesh',
        'Ventralight mesh — assorted sizes available, all **unopened**\nConfirm exact model, dimensions, and positioning preference with surgeon\n**Open only after surgeon confirms selection**\nHandle per manufacturer instructions'
      ),
      table(
        'Sutures',
        ['Suture', 'Prep', 'Status'],
        [
          [OPEN, '3-0 dyed Vicryl SH', 'Cut to 6" (replenish when used)', 'OPEN'],
          [OPEN, '4-0 Monocryl', 'Skin closure', 'OPEN'],
          [HOLD, '0 nonabsorbable V-Loc', '9–12"; have multiple available', 'HOLD'],
          [HOLD, '3-0 absorbable V-Loc 90', '9"', 'HOLD'],
          [HOLD, '0 absorbable V-Loc', '9–12"; confirm absorption profile', 'HOLD'],
        ]
      ),
      note(
        '',
        'Keep multiple barbed sutures in room · Confirm needle types + exact product numbers · Do NOT substitute automatically'
      ),
      pills('Closure & Dressings', [
        green('4-0 Monocryl'),
        'Dermabond',
        '2×2 gauze available',
        'Three-panel abdominal binder (postop)',
      ]),
    ],
  }),

  newCase({
    name: 'Robotic Laparoscopic Cholecystectomy with IOC',
    tag: TAGS.hepatobiliary,
    keywords:
      'cholecystectomy IOC intraoperative cholangiogram robotic C-arm fluoroscopy Arrow catheter contrast bile duct CBD exploration endo catch gallbladder PMI fascial closure vicryl monocryl dermabond steri-strip tegaderm airseal monopolar hook bipolar cadiere hepatobiliary',
    sections: [
      info('', 'Robot setup: **Upper abdomen** · Maintain C-arm access between arms 2 and 3'),
      note(
        'Preop',
        'Patient voids in pre-op — **No Foley catheter**\nConfirm C-arm, radiology support, IOC supplies, and CBD cart availability before case'
      ),
      note(
        'Positioning & Table',
        "Supine · Both arms tucked\nRaise table to approx. **halfway to max height** — allows C-arm to pass beneath patient\nSlide tabletop toward patient's head for C-arm clearance\nAfter port placement: **12° reverse Trendelenburg · 8° right side up**\nConfirm C-arm clearance before finalizing docked setup\nAny subsequent table movement must follow platform's table-motion requirements"
      ),
      note(
        'C-Arm Setup',
        'Drape C-arm · Sterile C-arm drape\n**Preferred:** Bring C-arm from foot end between arms 2 and 3\n**Alternative:** Bring from cranial end between arms 2 and 3\nLead aprons + thyroid shields available for personnel remaining in room during imaging'
      ),
      table(
        'Ports',
        ['Item', 'Qty', 'Status'],
        [
          [OPEN, '5 mm Optiview entry trocar', '1', 'OPEN'],
          [OPEN, 'Robotic 8 mm trocar', '4', 'OPEN'],
          [OPEN, 'Purple/magenta AirSeal cap', '1', 'Place on robotic 8 mm trocar'],
        ]
      ),
      table(
        'Robotic Instruments — Four Ports · Preserve C-arm access arms 2–3',
        ['Instrument', 'Status'],
        [
          [OPEN, '30° robotic camera', 'OPEN'],
          [OPEN, 'Fenestrated bipolar forceps', 'OPEN'],
          [OPEN, 'Monopolar hook', 'OPEN'],
          [OPEN, 'Monopolar curved scissors', 'OPEN'],
          [OPEN, 'Cadiere forceps', 'OPEN'],
          [
            HOLD,
            'Robotic suction/irrigation',
            'HOLD — if requested: hang 3 L NS, prime tubing',
          ],
          [HOLD, 'Large SutureCut needle driver', 'HOLD'],
        ]
      ),
      table(
        'Clips',
        ['Item', 'Status'],
        [
          [OPEN, 'Compatible medium clip applier', 'OPEN'],
          [OPEN, 'Compatible large clip applier', 'OPEN'],
          [PLAIN, 'Medium + large clips', 'Available'],
        ]
      ),
      note(
        '',
        'Confirm preferred clip system + matching appliers — do NOT substitute automatically'
      ),
      table(
        'Laparoscopic Supplies',
        ['Item', 'Status'],
        [
          [OPEN, 'Prestige bowel graspers', 'OPEN'],
          [OPEN, 'Scope warmer · Microfiber cloth · Port plunger · Moist lap sponge', 'OPEN'],
          [OPEN, '8 mm Endo Catch bag', 'OPEN'],
          [OPEN, 'PMI fascial closure device', 'OPEN'],
          [HOLD, '3 L NS (suction/irrigation if requested)', 'HOLD'],
        ]
      ),
      table(
        'IOC Setup — Arrow Catheter System',
        ['Item', 'Status'],
        [
          [OPEN, 'Arrow IOC catheter system', 'OPEN'],
          [OPEN, 'Catheter introducer/securing device', 'Match selected Arrow system'],
          [OPEN, 'Labeled contrast syringe + labeled saline flush syringe', 'OPEN'],
          [OPEN, 'Extension tubing + stopcock', 'OPEN'],
          [OPEN, 'Balloon inflation syringe + medium (per Arrow instructions)', 'OPEN'],
        ]
      ),
      note(
        '',
        'Prime catheter + tubing · Remove air bubbles · Label contrast and saline syringes · Follow Arrow catheter instructions for balloon inflation'
      ),
      warn(
        'Common Bile Duct Exploration',
        'HOLD — Facility CBD exploration set/cart/bundle · Confirm cart is stocked before case · Open components only on surgeon request'
      ),
      table(
        'Sutures & Closure',
        ['Item', 'Use', 'Status'],
        [
          [OPEN, 'PMI fascial closure device', 'Extraction-site fascial closure', 'OPEN'],
          [OPEN, '0 Vicryl', 'For PMI closure', 'OPEN'],
          [OPEN, '4-0 Monocryl', 'Skin closure', 'OPEN'],
        ]
      ),
      pills('Dressings', [
        'Dermabond — three port sites',
        accent('Steri-Strip — extraction site'),
        accent('Tegaderm over extraction-site dressing'),
        warnPill('HOLD: 19 Fr Blake drain + 2-0 nylon'),
      ]),
    ],
  }),
];

export function createLiuDoctor() {
  return newDoctor({
    name: 'Dr. Liu',
    subtitle: 'Robotic Surgical Preference Cards',
    accent: 'purple',
    globalNotes: globalNotes(),
    cases: cases(),
  });
}
