import { newCase, newDoctor, newNote } from './factories.js';
import {
  accent,
  danger,
  dangerPill,
  green,
  note,
  pills,
  twoCol,
  warn,
  warnPill,
} from './seedHelpers.js';

// Starting data, used the first time the app runs in a browser. After that the
// saved copy in the browser is the source of truth, so edits here won't show up.

const TAGS = {
  spine: { label: 'Spine', kind: 'spine' },
  cervical: { label: 'Cervical', kind: 'cervical' },
  other: { label: 'Other', kind: 'other' },
  urgent: { label: 'Urgent', kind: 'other' },
};

const globalNotes = () => [
  newNote({
    label: 'Gown / Gloves',
    content:
      '**Dr. Barkoh:** XXL gown · 8/8 glove\n**Zeena:** Any gown · 7 under / 6.5 over',
  }),
  newNote({
    label: 'Bovie Settings',
    content: '**Lumbar/Thoracic:** 40/40\n**Cervical:** 30/30\nNO spray/mix',
  }),
  newNote({
    label: 'Bipolar / Drill / Aquamantus',
    content:
      'Bipolar: **15**\nDrill: **75,000 forward**\nAquamantus: **120 (6.0 size)** — open lumbar only',
  }),
  newNote({
    label: '⚠ Foot Pedal Rule',
    warn: true,
    content: 'Bipolar → **right foot**\nMedtronic drill → **left foot**',
  }),
  newNote({
    label: 'Prep',
    content:
      'Alcohol + two ChloraPrep\nWet prep only if incision <2 wks old or draining/infected',
  }),
  newNote({
    label: 'Hemostatic Agents (all cases)',
    content:
      'Fibular/SNoW · Surgiflo/Floseal\nGel foam in thrombin · Bone wax (on freer + penfield 4)',
  }),
  newNote({
    label: 'Instruments (always on field)',
    content:
      'Protected bovie all sizes (2", 4", 6")\nTwo 12 suctions, one 10, one 7/8\nTwo suction tubes · Two asepto bulbs',
  }),
  newNote({
    label: 'Dressings',
    content:
      '**Monocryl/Stratafix skin:** Dermabond + steri-strips + Silverlon/AquaCell\n**Nylon skin:** Bacitracin ointment + Silverlon/AquaCell',
  }),
];

const cases = () => [
  newCase({
    name: 'Kyphoplasty',
    tag: TAGS.other,
    keywords:
      'kyphoplasty bed drugs instruments sutures gel rolls 11 blade mallet spinal needle monocryl dermabond stryker medtronic',
    sections: [
      note('Bed', 'Flat rotating Jackson · Gel rolls on chest & ASIS · Arms Superman'),
      pills('Instruments', [
        '11 blade (skin knife)',
        '8" Kocher',
        'Hemostat',
        '2–3 lb mallet',
        '22g 3.5" spinal needle',
      ]),
      pills('Rep', [warnPill('Stryker or Medtronic — check orders')]),
      pills('Closing', [
        green('4-0 monocryl/stratafix'),
        'Dermabond',
        '½" steri-strips',
        'Silver dressing',
      ]),
    ],
  }),

  newCase({
    name: 'Laminectomy / Microdiscectomy',
    tag: TAGS.spine,
    keywords:
      'laminectomy microdiscectomy wilson frame snake bar microscope MIS tubes drill duragen kenalog vancomycin thrombin betadine vicryl monocryl nylon dermabond',
    sections: [
      note(
        'Bed',
        "Flat Jackson + Wilson Frame · 2nd-lowest setting · Arms Superman\n**Snake bar:** opposite side of patient's symptoms (or opposite from Dr. Barkoh)"
      ),
      note(
        'Room Setup',
        "C-arm & microscope on **opposite sides** of each other · Position bed so microscope won't hit overhead lights"
      ),
      pills('Drugs', [
        accent('Vanc 1g — NOT in irrigation'),
        'Local (0.25 or 0.5%) + epi',
        'Thrombin',
        '17cc betadine + 500cc NS',
        warnPill('1×1 Duragen + Kenalog 40 per level — do not open until asked'),
      ]),
      pills('Needles', ['22g spinal needle (marking + local)', '24g hypo for local']),
      pills('Instruments', [
        'MIS tubes (18mm · beveled)',
        'Laminectomy set',
        'Special nerve hook',
        'Karlin curettes',
        'MIS drill',
        'Bipolar',
        'Two suctions',
        'Bovie — all 3 sizes protected',
        'Two dull senrakes',
        '2 arm + navys',
        'Yankauer',
        '15 blade (skin)',
        '11 blade bayonet (disc)',
      ]),
      twoCol('Sutures', [
        [
          'Fascia',
          '0 vicryl CT1 pops — big wound\n0 vicryl UR6 — smaller wound\n*Hold until asked*',
        ],
        ['2nd Layer', '2-0 vicryl CT1 pops **undyed**'],
        [
          'Skin',
          '4-0 monocryl or stratafix PS2\n2-0 nylon if prior surgery, infection, DM, smoker, or obese — *ask PA/Dr*',
        ],
        ['If Drain', '2-0 nylon skin closure'],
      ]),
      pills('Dressing', ['Dermabond', 'Steri-strips', 'Silverlon or AquaCell']),
    ],
  }),

  newCase({
    name: 'TLIF',
    tag: TAGS.spine,
    keywords: 'TLIF open jackson osteotome mallet O-arm navigation vicryl monocryl',
    sections: [
      warn('', 'Everything same as Laminectomy/Microdiscectomy — exceptions below only.'),
      note('Bed', 'Open Jackson frame · Snake bar · Arms Superman'),
      note('Room Setup', 'Same as lami. If at HCA → use O-Arm.'),
      pills('Drugs', [dangerPill('No Duragen or Kenalog'), 'All other meds same']),
      pills('Extra Instruments', [
        'MIS tubes (20mm · beveled)',
        '20cc syringe for blood',
        '2 lb mallet',
        '¼" osteotomes',
        'O-Arm instruments if navigating',
      ]),
      note(
        'Sutures — Changes',
        'Same as lami. If **multilevel TLIF**, also have 0 vicryl CT1 pops in room.'
      ),
    ],
  }),

  newCase({
    name: 'SCS Battery Placement',
    tag: TAGS.other,
    keywords:
      'SCS battery placement spinal cord stimulator open jackson split drapes cobbs weitlander cerebellar aquamantus gelpi rongeur cervical retractor ethibond vicryl stratafix dermabond silverlon',
    sections: [
      note('Bed / Room', 'Open Jackson · C-arm · **Split drapes** for battery placement'),
      pills('Needles', [warnPill('Two 22g spinal needles (thoracic rule)')]),
      pills('Instruments', [
        'Various Cobbs',
        'Weitlanders',
        'Cerebellars',
        'Aquamantus',
        'Gelpis (available)',
        'Rongeur',
        'Cervical retractor set (same as ACDF)',
        'Cervical drill',
        'Karlin curettes',
        'Blunt nerve hook',
      ]),
      pills('Sutures', [
        green('0 ethibond CT1'),
        green('0 vicryl pops'),
        green('2-0 vicryl pops ×2'),
        green('4-0 stratafix PS2 ×2'),
        warnPill('2-0 nylon if prior surgery/infection/DM/smoker/obese — ask PA/Dr'),
      ]),
      pills('Dressing', ['Dermabond ×2', 'Steri-strips', 'Silverlon/AquaCell ×2']),
    ],
  }),

  newCase({
    name: 'ALIF (± PSF)',
    tag: TAGS.spine,
    keywords:
      'ALIF PSF anterior posterior Bhatia Ponce De Leon snake arm vancomycin vicryl monocryl stratafix yankauer',
    sections: [
      warn('', 'Anterior portion: Dr. Bhatia or Dr. Ponce De Leon (access surgeon)'),
      pills('Posterior Instruments', [
        '15 blade (skin)',
        'Bovie — small + long protected tips',
        'Tubes + snake arm',
        'Cameron provides other instruments',
      ]),
      pills('Drugs', [accent('Vanc powder'), 'Snow/Fibular', '17cc betadine + 500cc NS']),
      pills('Sutures', [
        green('0 vicryl UR6'),
        green('2-0 vicryl CT1 pops'),
        green('4-0 monocryl or stratafix'),
      ]),
      pills('Extras', ['Yankauer']),
    ],
  }),

  newCase({
    name: 'LLIF',
    tag: TAGS.spine,
    keywords:
      'LLIF lateral lumbar interbody fusion stryker kevin breakable bed pillows tape C-arm vancomycin betadine vicryl monocryl nylon dermabond silverlon posterior fusion jackson',
    sections: [
      note(
        'Bed / Room',
        'Regular breakable bed · Patient on side · 6–8 pillows + lots of tape · Arm board · C-arm'
      ),
      pills('Rep', [warnPill('Stryker — Kevin · Most instruments from rep')]),
      pills('Drugs', [accent('Vanc powder'), '17cc betadine + 500cc NS', '500cc NS plain']),
      pills('Sutures', [
        green('0 vicryl CT1 pops'),
        green('2-0 vicryl CT1 pops undyed'),
        green('4-0 monocryl/stratafix PS2'),
        'Sometimes 2-0 nylon',
      ]),
      warn('If Posterior Fusion Also', 'Add all posterior instruments + Open Jackson bed'),
      pills('Dressing', ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell']),
    ],
  }),

  newCase({
    name: 'OmegaLLIF',
    tag: TAGS.spine,
    keywords: 'omegallif omega LLIF two C-arms open jackson vicryl monocryl dermabond silverlon',
    sections: [
      note('Bed / Room', '**Two C-arms** · Open Jackson frame'),
      pills('Sutures', [green('2-0 vicryl CT1 pops'), green('4-0 monocryl PS2')]),
      pills('Dressing', ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell']),
    ],
  }),

  newCase({
    name: 'SI Joint Fusion',
    tag: TAGS.other,
    keywords:
      'SI joint fusion sacroiliac bilateral split drapes C-arm kocher vancomycin betadine saline vicryl monocryl dermabond silverlon',
    sections: [
      note(
        'Room Setup',
        'C-arm on **opposite side of fusion**\n**Bilateral:** prep & drape both sides with split sheets — need to flip rooms · Two ¾ drapes, two split drapes, two Ioban, skin stapler'
      ),
      pills('Instruments', [
        warnPill('Most from rep'),
        'Short protected bovie tip',
        'Suction + Yankauer',
        'Kocher',
      ]),
      pills('Drugs', [accent('Vanc powder'), '17cc betadine + 500cc NS', '500cc NS plain']),
      pills('Sutures', [
        green('0 CT1 vicryl pops'),
        green('2-0 CT1 vicryl pops undyed'),
        green('4-0 monocryl/stratafix PS2'),
      ]),
      pills('Dressing', ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell']),
    ],
  }),

  newCase({
    name: 'ACDF / CDR',
    tag: TAGS.cervical,
    keywords:
      'ACDF CDR cervical discectomy fusion anterior Caspar Clowards Gardner wells phantom kerlex pressure bag tape headlights vicryl monocryl stratafix dermabond',
    sections: [
      note(
        'Bed Setup',
        'Flat Jackson · Phantom shadow line · Two Kerlex rolls · Paperclip · Marking pen (Dr. Barkoh marks *before* draping)\n**1000L pressure bag only** (no saline) · Lots of tape\nMove patient **toward foot of bed** (C-arm rests at head)\nHeadlights for Dr. Barkoh'
      ),
      pills('Bovie Setting', [accent('30/30 — NO spray/mix')]),
      pills('Needles', ['18g spinal needle bent lightning bolt (cervical)']),
      pills('Microscope', ['Drape microscope']),
      pills('Sutures', [
        green('3-0 SH vicryl pops undyed (fascia)'),
        green('4-0 monocryl/stratafix PS2 (skin)'),
      ]),
      warn(
        'Gardner Wells Tongs',
        'Only if requested — usually if patient has prior fusion\nHave weights + bacitracin ointment + scrub for temples'
      ),
      pills('Dressing', ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell']),
    ],
  }),

  newCase({
    name: 'Posterior Cervical',
    tag: TAGS.cervical,
    keywords:
      'posterior cervical fusion laminoplasty laminectomy mayfield open jackson weitlander cerebellar gelpi cobbs aquamantus cervical drill retractor drain bipolar ethibond vicryl nylon biopatch tegaderm headlights',
    intro: 'Covers: Fusion · Laminoplasty · Laminectomy',
    sections: [
      note(
        'Bed / Room',
        'Open rotating Jackson · Mayfield head holder · Lubricant for hair · Bacitracin ointment · Scrub for temples\nC-arm · Headlights for Dr. Barkoh · Weights in room'
      ),
      pills('Bovie Setting', [accent('30/30 — NO spray/mix')]),
      pills('Instruments', [
        'Weitlanders',
        'Cerebellars',
        'Three deep Gelpis',
        'Various Cobbs',
        'Aquamantus',
        'Cervical drill',
        'Cervical retractor set',
        '10 Fr drain + trocar',
        'All bovie tips protected',
        'Bipolar',
      ]),
      pills('Sutures', [
        green('0 ethibond CT1'),
        green('2-0 vicryl CT1 pops undyed'),
        green('2-0 nylon (skin + drain)'),
      ]),
      pills('Dressing', ['Silverlon/AquaCell', accent('Biopatch + Tegaderm for drain')]),
    ],
  }),

  newCase({
    name: 'Incision & Drainage',
    tag: TAGS.other,
    keywords: 'incision drainage I&D flat jackson open nylon saline drip catheter tubing',
    sections: [
      note('Bed', 'Flat Jackson · Full open setup'),
      pills('Irrigation', [warnPill('1000L saline drip bag + catheter tubing')]),
      pills('Sutures', [green('Nylon for skin closure')]),
    ],
  }),

  newCase({
    name: 'Dural Repair',
    tag: TAGS.urgent,
    keywords:
      'dural repair duraseal duragen gel foam thrombin pattys surgical dermabond castros proline betadine vancomycin aquamantus foley lovenox trendelenberg post op',
    sections: [
      pills('Must Have Open', [
        accent('Integra Duraseal'),
        accent('Duragen'),
        'Gel foam — some in thrombin, some dry (cut very small)',
        'Pattys',
        'Surgical',
        'Dermabond',
        'Castros',
      ]),
      pills('Have in Room (if suturing dura)', [warnPill('6-0 prolene BV-1 + Castros set')]),
      pills('Have in Room (not needed unless)', [
        'Betadine irrigation',
        'Vanc powder',
        'Local',
        'Aquamantus',
      ]),
      danger(
        'Post-Op Orders',
        '▸ Lie flat for **72 hours**\n▸ Usually keep Foley in\n▸ Lovenox 40 QD × 2 days\n▸ Regular diet — Reverse Trendelenburg 30° when eating\n▸ Raise HOB 30° every hour on day 3'
      ),
    ],
  }),
];

export function createSeedDoctor() {
  return newDoctor({ name: 'Dr. Barkoh', globalNotes: globalNotes(), cases: cases() });
}
