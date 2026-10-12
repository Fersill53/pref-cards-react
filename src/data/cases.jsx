// Each case renders as one card.
//
// tag.kind:      'spine' | 'cervical' | 'other'  (sets the tag colour)
// section.type:  'note' | 'warn' | 'danger'      -> content: JSX
//                'pills'                         -> items: string | { text, variant }
//                'twoCol'                        -> items: { label, content }
// pill variant:  'accent' | 'warn' | 'danger' | 'green'
// keywords:      extra search terms that don't appear in the card text

const TAGS = {
  spine: { label: 'Spine', kind: 'spine' },
  cervical: { label: 'Cervical', kind: 'cervical' },
  other: { label: 'Other', kind: 'other' },
  urgent: { label: 'Urgent', kind: 'other' },
};

const pill = (variant) => (text) => ({ text, variant });
const accent = pill('accent');
const warn = pill('warn');
const danger = pill('danger');
const green = pill('green');

export const cases = [
  {
    id: 'kyphoplasty',
    name: 'Kyphoplasty',
    tag: TAGS.other,
    keywords:
      'kyphoplasty bed drugs instruments sutures gel rolls 11 blade mallet spinal needle monocryl dermabond stryker medtronic',
    sections: [
      {
        label: 'Bed',
        type: 'note',
        content: <>Flat rotating Jackson · Gel rolls on chest &amp; ASIS · Arms Superman</>,
      },
      {
        label: 'Instruments',
        type: 'pills',
        items: [
          '11 blade (skin knife)',
          '8" Kocher',
          'Hemostat',
          '2–3 lb mallet',
          '22g 3.5" spinal needle',
        ],
      },
      {
        label: 'Rep',
        type: 'pills',
        items: [warn('Stryker or Medtronic — check orders')],
      },
      {
        label: 'Closing',
        type: 'pills',
        items: [
          green('4-0 monocryl/stratafix'),
          'Dermabond',
          '½" steri-strips',
          'Silver dressing',
        ],
      },
    ],
  },

  {
    id: 'laminectomy-microdiscectomy',
    name: 'Laminectomy / Microdiscectomy',
    tag: TAGS.spine,
    keywords:
      'laminectomy microdiscectomy wilson frame snake bar microscope MIS tubes drill duragen kenalog vancomycin thrombin betadine vicryl monocryl nylon dermabond',
    sections: [
      {
        label: 'Bed',
        type: 'note',
        content: (
          <>
            Flat Jackson + Wilson Frame · 2nd-lowest setting · Arms Superman
            <br />
            <strong>Snake bar:</strong> opposite side of patient's symptoms (or opposite from
            Dr. Barkoh)
          </>
        ),
      },
      {
        label: 'Room Setup',
        type: 'note',
        content: (
          <>
            C-arm &amp; microscope on <strong>opposite sides</strong> of each other · Position
            bed so microscope won't hit overhead lights
          </>
        ),
      },
      {
        label: 'Drugs',
        type: 'pills',
        items: [
          accent('Vanc 1g — NOT in irrigation'),
          'Local (0.25 or 0.5%) + epi',
          'Thrombin',
          '17cc betadine + 500cc NS',
          warn('1×1 Duragen + Kenalog 40 per level — do not open until asked'),
        ],
      },
      {
        label: 'Needles',
        type: 'pills',
        items: ['22g spinal needle (marking + local)', '24g hypo for local'],
      },
      {
        label: 'Instruments',
        type: 'pills',
        items: [
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
        ],
      },
      {
        label: 'Sutures',
        type: 'twoCol',
        items: [
          {
            label: 'Fascia',
            content: (
              <>
                0 vicryl CT1 pops — big wound
                <br />
                0 vicryl UR6 — smaller wound
                <br />
                <em>Hold until asked</em>
              </>
            ),
          },
          {
            label: '2nd Layer',
            content: (
              <>
                2-0 vicryl CT1 pops <strong>undyed</strong>
              </>
            ),
          },
          {
            label: 'Skin',
            content: (
              <>
                4-0 monocryl or stratafix PS2
                <br />
                2-0 nylon if prior surgery, infection, DM, smoker, or obese —{' '}
                <em>ask PA/Dr</em>
              </>
            ),
          },
          {
            label: 'If Drain',
            content: <>2-0 nylon skin closure</>,
          },
        ],
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Dermabond', 'Steri-strips', 'Silverlon or AquaCell'],
      },
    ],
  },

  {
    id: 'tlif',
    name: 'TLIF',
    tag: TAGS.spine,
    keywords: 'TLIF open jackson osteotome mallet O-arm navigation vicryl monocryl',
    sections: [
      {
        type: 'warn',
        content: <>Everything same as Laminectomy/Microdiscectomy — exceptions below only.</>,
      },
      {
        label: 'Bed',
        type: 'note',
        content: <>Open Jackson frame · Snake bar · Arms Superman</>,
      },
      {
        label: 'Room Setup',
        type: 'note',
        content: <>Same as lami. If at HCA → use O-Arm.</>,
      },
      {
        label: 'Drugs',
        type: 'pills',
        items: [danger('No Duragen or Kenalog'), 'All other meds same'],
      },
      {
        label: 'Extra Instruments',
        type: 'pills',
        items: [
          'MIS tubes (20mm · beveled)',
          '20cc syringe for blood',
          '2 lb mallet',
          '¼" osteotomes',
          'O-Arm instruments if navigating',
        ],
      },
      {
        label: 'Sutures — Changes',
        type: 'note',
        content: (
          <>
            Same as lami. If <strong>multilevel TLIF</strong>, also have 0 vicryl CT1 pops in
            room.
          </>
        ),
      },
    ],
  },

  {
    id: 'scs-battery',
    name: 'SCS Battery Placement',
    tag: TAGS.other,
    keywords:
      'SCS battery placement spinal cord stimulator open jackson split drapes cobbs weitlander cerebellar aquamantus gelpi rongeur cervical retractor ethibond vicryl stratafix dermabond silverlon',
    sections: [
      {
        label: 'Bed / Room',
        type: 'note',
        content: (
          <>
            Open Jackson · C-arm · <strong>Split drapes</strong> for battery placement
          </>
        ),
      },
      {
        label: 'Needles',
        type: 'pills',
        items: [warn('Two 22g spinal needles (thoracic rule)')],
      },
      {
        label: 'Instruments',
        type: 'pills',
        items: [
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
        ],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [
          green('0 ethibond CT1'),
          green('0 vicryl pops'),
          green('2-0 vicryl pops ×2'),
          green('4-0 stratafix PS2 ×2'),
          warn('2-0 nylon if prior surgery/infection/DM/smoker/obese — ask PA/Dr'),
        ],
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Dermabond ×2', 'Steri-strips', 'Silverlon/AquaCell ×2'],
      },
    ],
  },

  {
    id: 'alif',
    name: 'ALIF (± PSF)',
    tag: TAGS.spine,
    keywords:
      'ALIF PSF anterior posterior Bhatia Ponce De Leon snake arm vancomycin vicryl monocryl stratafix yankauer',
    sections: [
      {
        type: 'warn',
        content: <>Anterior portion: Dr. Bhatia or Dr. Ponce De Leon (access surgeon)</>,
      },
      {
        label: 'Posterior Instruments',
        type: 'pills',
        items: [
          '15 blade (skin)',
          'Bovie — small + long protected tips',
          'Tubes + snake arm',
          'Cameron provides other instruments',
        ],
      },
      {
        label: 'Drugs',
        type: 'pills',
        items: [accent('Vanc powder'), 'Snow/Fibular', '17cc betadine + 500cc NS'],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [
          green('0 vicryl UR6'),
          green('2-0 vicryl CT1 pops'),
          green('4-0 monocryl or stratafix'),
        ],
      },
      {
        label: 'Extras',
        type: 'pills',
        items: ['Yankauer'],
      },
    ],
  },

  {
    id: 'llif',
    name: 'LLIF',
    tag: TAGS.spine,
    keywords:
      'LLIF lateral lumbar interbody fusion stryker kevin breakable bed pillows tape C-arm vancomycin betadine vicryl monocryl nylon dermabond silverlon posterior fusion jackson',
    sections: [
      {
        label: 'Bed / Room',
        type: 'note',
        content: (
          <>
            Regular breakable bed · Patient on side · 6–8 pillows + lots of tape · Arm board ·
            C-arm
          </>
        ),
      },
      {
        label: 'Rep',
        type: 'pills',
        items: [warn('Stryker — Kevin · Most instruments from rep')],
      },
      {
        label: 'Drugs',
        type: 'pills',
        items: [accent('Vanc powder'), '17cc betadine + 500cc NS', '500cc NS plain'],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [
          green('0 vicryl CT1 pops'),
          green('2-0 vicryl CT1 pops undyed'),
          green('4-0 monocryl/stratafix PS2'),
          'Sometimes 2-0 nylon',
        ],
      },
      {
        label: 'If Posterior Fusion Also',
        type: 'warn',
        content: <>Add all posterior instruments + Open Jackson bed</>,
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell'],
      },
    ],
  },

  {
    id: 'omegallif',
    name: 'OmegaLLIF',
    tag: TAGS.spine,
    keywords: 'omegallif omega LLIF two C-arms open jackson vicryl monocryl dermabond silverlon',
    sections: [
      {
        label: 'Bed / Room',
        type: 'note',
        content: (
          <>
            <strong>Two C-arms</strong> · Open Jackson frame
          </>
        ),
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [green('2-0 vicryl CT1 pops'), green('4-0 monocryl PS2')],
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell'],
      },
    ],
  },

  {
    id: 'si-joint-fusion',
    name: 'SI Joint Fusion',
    tag: TAGS.other,
    keywords:
      'SI joint fusion sacroiliac bilateral split drapes C-arm kocher vancomycin betadine saline vicryl monocryl dermabond silverlon',
    sections: [
      {
        label: 'Room Setup',
        type: 'note',
        content: (
          <>
            C-arm on <strong>opposite side of fusion</strong>
            <br />
            <strong>Bilateral:</strong> prep &amp; drape both sides with split sheets — need to
            flip rooms · Two ¾ drapes, two split drapes, two Ioban, skin stapler
          </>
        ),
      },
      {
        label: 'Instruments',
        type: 'pills',
        items: [
          warn('Most from rep'),
          'Short protected bovie tip',
          'Suction + Yankauer',
          'Kocher',
        ],
      },
      {
        label: 'Drugs',
        type: 'pills',
        items: [accent('Vanc powder'), '17cc betadine + 500cc NS', '500cc NS plain'],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [
          green('0 CT1 vicryl pops'),
          green('2-0 CT1 vicryl pops undyed'),
          green('4-0 monocryl/stratafix PS2'),
        ],
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell'],
      },
    ],
  },

  {
    id: 'acdf-cdr',
    name: 'ACDF / CDR',
    tag: TAGS.cervical,
    keywords:
      'ACDF CDR cervical discectomy fusion anterior Caspar Clowards Gardner wells phantom kerlex pressure bag tape headlights vicryl monocryl stratafix dermabond',
    sections: [
      {
        label: 'Bed Setup',
        type: 'note',
        content: (
          <>
            Flat Jackson · Phantom shadow line · Two Kerlex rolls · Paperclip · Marking pen (Dr.
            Barkoh marks <em>before</em> draping)
            <br />
            <strong>1000L pressure bag only</strong> (no saline) · Lots of tape
            <br />
            Move patient <strong>toward foot of bed</strong> (C-arm rests at head)
            <br />
            Headlights for Dr. Barkoh
          </>
        ),
      },
      {
        label: 'Bovie Setting',
        type: 'pills',
        items: [accent('30/30 — NO spray/mix')],
      },
      {
        label: 'Needles',
        type: 'pills',
        items: ['18g spinal needle bent lightning bolt (cervical)'],
      },
      {
        label: 'Microscope',
        type: 'pills',
        items: ['Drape microscope'],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [
          green('3-0 SH vicryl pops undyed (fascia)'),
          green('4-0 monocryl/stratafix PS2 (skin)'),
        ],
      },
      {
        label: 'Gardner Wells Tongs',
        type: 'warn',
        content: (
          <>
            Only if requested — usually if patient has prior fusion
            <br />
            Have weights + bacitracin ointment + scrub for temples
          </>
        ),
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Steri-strips', 'Dermabond', 'Silverlon/AquaCell'],
      },
    ],
  },

  {
    id: 'posterior-cervical',
    name: 'Posterior Cervical',
    tag: TAGS.cervical,
    keywords:
      'posterior cervical fusion laminoplasty laminectomy mayfield open jackson weitlander cerebellar gelpi cobbs aquamantus cervical drill retractor drain bipolar ethibond vicryl nylon biopatch tegaderm headlights',
    intro: <>Covers: Fusion · Laminoplasty · Laminectomy</>,
    sections: [
      {
        label: 'Bed / Room',
        type: 'note',
        content: (
          <>
            Open rotating Jackson · Mayfield head holder · Lubricant for hair · Bacitracin
            ointment · Scrub for temples
            <br />
            C-arm · Headlights for Dr. Barkoh · Weights in room
          </>
        ),
      },
      {
        label: 'Bovie Setting',
        type: 'pills',
        items: [accent('30/30 — NO spray/mix')],
      },
      {
        label: 'Instruments',
        type: 'pills',
        items: [
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
        ],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [
          green('0 ethibond CT1'),
          green('2-0 vicryl CT1 pops undyed'),
          green('2-0 nylon (skin + drain)'),
        ],
      },
      {
        label: 'Dressing',
        type: 'pills',
        items: ['Silverlon/AquaCell', accent('Biopatch + Tegaderm for drain')],
      },
    ],
  },

  {
    id: 'incision-drainage',
    name: 'Incision & Drainage',
    tag: TAGS.other,
    keywords: 'incision drainage I&D flat jackson open nylon saline drip catheter tubing',
    sections: [
      {
        label: 'Bed',
        type: 'note',
        content: <>Flat Jackson · Full open setup</>,
      },
      {
        label: 'Irrigation',
        type: 'pills',
        items: [warn('1000L saline drip bag + catheter tubing')],
      },
      {
        label: 'Sutures',
        type: 'pills',
        items: [green('Nylon for skin closure')],
      },
    ],
  },

  {
    id: 'dural-repair',
    name: 'Dural Repair',
    tag: TAGS.urgent,
    keywords:
      'dural repair duraseal duragen gel foam thrombin pattys surgical dermabond castros proline betadine vancomycin aquamantus foley lovenox trendelenberg post op',
    sections: [
      {
        label: 'Must Have Open',
        type: 'pills',
        items: [
          accent('Integra Duraseal'),
          accent('Duragen'),
          'Gel foam — some in thrombin, some dry (cut very small)',
          'Pattys',
          'Surgical',
          'Dermabond',
          'Castros',
        ],
      },
      {
        label: 'Have in Room (if suturing dura)',
        type: 'pills',
        items: [warn('6-0 prolene BV-1 + Castros set')],
      },
      {
        label: 'Have in Room (not needed unless)',
        type: 'pills',
        items: ['Betadine irrigation', 'Vanc powder', 'Local', 'Aquamantus'],
      },
      {
        label: 'Post-Op Orders',
        type: 'danger',
        content: (
          <>
            ▸ Lie flat for <strong>72 hours</strong>
            <br />
            ▸ Usually keep Foley in
            <br />
            ▸ Lovenox 40 QD × 2 days
            <br />
            ▸ Regular diet — Reverse Trendelenburg 30° when eating
            <br />▸ Raise HOB 30° every hour on day 3
          </>
        ),
      },
    ],
  },
];
