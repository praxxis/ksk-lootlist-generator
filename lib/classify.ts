import reduce from 'lodash.reduce';
import intersection from 'lodash.intersection';

type Tooltip = Record<'label' | 'format', string>[];

enum Classes {
  warrior = 'warrior',
  paladin = 'paladin',
  hunter = 'hunter',
  rogue = 'rogue',
  priest = 'priest',
  deathknight = 'death knight',
  shaman = 'shaman',
  mage = 'mage',
  warlock = 'warlock',
  monk = 'monk',
  druid = 'druid',
  demonhunter = 'demon hunter',
}

export const allClassesBits = '111111111111';
const allClasses = [
  Classes.warrior,
  Classes.paladin,
  Classes.hunter,
  Classes.rogue,
  Classes.priest,
  Classes.shaman,
  Classes.mage,
  Classes.warlock,
  Classes.druid,
  Classes.deathknight,
  Classes.demonhunter,
  Classes.monk,
];

const allowedArmor: Record<string, Classes[]> = {
  Cloth: allClasses,
  Leather: [
    Classes.druid,
    Classes.hunter,
    Classes.paladin,
    Classes.rogue,
    Classes.shaman,
    Classes.warrior,
    Classes.rogue,
  ],
  Mail: [Classes.hunter, Classes.paladin, Classes.shaman, Classes.warrior],
  Plate: [Classes.paladin, Classes.warrior],
};

const allowedOther: Record<string, Classes[]> = {
  Shield: [Classes.shaman, Classes.paladin, Classes.warrior],
  Cloak: allClasses,
  Relic: [Classes.druid, Classes.shaman, Classes.paladin],
  Trinket: allClasses,
};

const allowedWeapon: Record<string, Record<string, Classes[]>> = {
  Ranged: {
    Bow: [Classes.hunter, Classes.rogue, Classes.warrior],
    Crossbow: [Classes.hunter, Classes.rogue, Classes.warrior],
    Gun: [Classes.hunter, Classes.rogue, Classes.warrior],
    Thrown: [Classes.rogue, Classes.warrior],
    Wand: [Classes.mage, Classes.priest, Classes.warlock],
  },
  'Two-Hand': {
    Axe: [Classes.hunter, Classes.paladin, Classes.shaman, Classes.warrior],
    Sword: [Classes.hunter, Classes.paladin, Classes.warrior],
    Mace: [Classes.druid, Classes.paladin, Classes.shaman, Classes.warrior],
    Polearm: [Classes.druid, Classes.hunter, Classes.paladin, Classes.shaman, Classes.warrior],
    Staff: [
      Classes.druid,
      Classes.hunter,
      Classes.mage,
      Classes.priest,
      Classes.shaman,
      Classes.warlock,
      Classes.warrior,
    ],
  },
  'One-Hand': {
    Axe: [Classes.hunter, Classes.paladin, Classes.rogue, Classes.shaman, Classes.warrior],
    Sword: [
      Classes.hunter,
      Classes.mage,
      Classes.paladin,
      Classes.rogue,
      Classes.warlock,
      Classes.warrior,
    ],
    Mace: [
      Classes.druid,
      Classes.paladin,
      Classes.priest,
      Classes.rogue,
      Classes.shaman,
      Classes.warrior,
    ],
    Dagger: [
      Classes.druid,
      Classes.hunter,
      Classes.mage,
      Classes.priest,
      Classes.rogue,
      Classes.shaman,
      Classes.warlock,
      Classes.warrior,
    ],
    'Fist Weapon': [Classes.druid, Classes.hunter, Classes.rogue, Classes.shaman, Classes.warrior],
  },
};

allowedWeapon['Main Hand'] = allowedWeapon['One-Hand'];

const slots = [
  'Back',
  'Bag',
  'Chest',
  'Feet',
  'Finger',
  'Hands',
  'Head',
  'Held In Off-hand',
  'Legs',
  'Main Hand',
  'Neck',
  'Off Hand',
  'One-Hand',
  'Projectile',
  'Ranged',
  'Relic',
  'Shield',
  'Shirt',
  'Shoulder',
  'Tabard',
  'Thrown',
  'Trinket',
  'Two-Hand',
  'Waist',
  'Wrist',
] as const;

const weapons = [
  'Bow',
  'Crossbow',
  'Gun',
  'Thrown',
  'Axe',
  'Sword',
  'Mace',
  'Polearm',
  'Staff',
  'Dagger',
  'Fist Weapon',
  'Wand',
] as const;

const armors = ['Cloth', 'Leather', 'Mail', 'Plate'] as const;
const others = ['Shield', 'Cloak', 'Relic', 'Trinket'] as const;

const physical = [
  Classes.warrior,
  Classes.paladin,
  Classes.hunter,
  Classes.rogue,
  Classes.shaman,
  Classes.druid,
];

const healing = [Classes.paladin, Classes.priest, Classes.shaman, Classes.druid];

const magic = [
  Classes.paladin,
  Classes.priest,
  Classes.shaman,
  Classes.mage,
  Classes.warlock,
  Classes.druid,
];

const physicalAttrs = ['Attack Power', 'Strength', 'Agility', 'Improves your chance to hit by'];
const healingAttrs = ['Increases healing done', 'mana per 5 sec', 'Spirit', 'Intellect'];
const magicAttrs = [
  'Improves your chance to get a critical strike with spells',
  'Increases damage and healing done',
  'Intellect',
  'Improves your chance to hit with spells',
];

function slot(tooltip: Tooltip) {
  return tooltip.find(({label}) => (slots as ReadonlyArray<string>).includes(label))?.label;
}

function weaponType(tooltip: Tooltip) {
  return tooltip.find(({label}) => (weapons as ReadonlyArray<string>).includes(label))?.label;
}

function armorType(tooltip: Tooltip) {
  return tooltip.find(({label}) => (armors as ReadonlyArray<string>).includes(label))?.label;
}

function otherType(tooltip: Tooltip) {
  return tooltip.find(({label}) => (others as ReadonlyArray<string>).includes(label))?.label;
}

function explicit(tooltip: Tooltip) {
  return tooltip
    .filter((t) => /Classes/.test(t.label))
    .flatMap((t) =>
      t.label
        .replace('Classes: ', '')
        .split(',')
        .map((c) => Classes[c.trim().toLowerCase() as keyof typeof Classes])
    );
}

function weapon(tooltip: Tooltip) {
  const s = slot(tooltip);
  const w = weaponType(tooltip);

  if (!s || !allowedWeapon[s]) {
    console.warn('Unknown slot', s, tooltip[0].label);
    return allClasses;
  }

  if (!w || !allowedWeapon[s][w]) {
    console.warn('Unknown weapon', w, tooltip[0].label);
    return allClasses;
  }

  return allowedWeapon[s][w];
}

function armor(tooltip: Tooltip) {
  const a = armorType(tooltip);

  // "other" type
  if (!a) {
    return other(tooltip);
  }

  return allowedArmor[a];
}

function other(tooltip: Tooltip) {
  const o = otherType(tooltip);
  return o ? allowedOther[o] : allClasses;
}

function scoreType(attrs: string[], tooltip: Tooltip) {
  return tooltip.reduce((score, {label}) => {
    return (score += attrs.reduce((p, attr) => {
      return label.includes(attr) ? (p += 1) : p;
    }, 0));
  }, 0);
}

function trinity(c: Classes[], tooltip: Tooltip) {
  const p = scoreType(physicalAttrs, tooltip);
  const h = scoreType(healingAttrs, tooltip);
  const m = scoreType(magicAttrs, tooltip);

  if (p === 0 && h === 0 && m === 0) {
    return c;
  }

  if (h > 0 && m > 0 && h === m) {
    return intersection(c, healing, magic);
  }

  switch (Math.max(p, h, m)) {
    case p:
      return intersection(c, physical);
    case h:
      return intersection(c, healing);
    case m:
      return intersection(c, magic);
  }

  return c;
}

function toBitString(classes: Classes[]) {
  if (classes.length === 0) {
    return '0000000000000';
  }

  return reduce(Classes, (s, c) => (s += classes.includes(c) ? '1' : '0'), '');
}

export function classify(tags: string[], tooltip: Tooltip) {
  const allowed = explicit(tooltip);

  if (allowed.length) {
    return toBitString(allowed);
  }

  if (tags.includes('Weapon')) {
    return toBitString(trinity(weapon(tooltip), tooltip));
  }

  if (tags.includes('Armor')) {
    return toBitString(trinity(armor(tooltip), tooltip));
  }

  return allClassesBits;
}
