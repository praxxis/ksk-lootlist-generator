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

/*

[
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
];

Weapon categories

    Ranged: Bows, Crossbows, Guns, Thrown
    Melee: Axes (1H/2H), Swords (1H/2H), Maces (1H/2H), Polearms (2H), Staves (2H), Daggers (1H), Fist weapons (1H)
    Other ranged: Wands

Non-weapon categories

    Miscellaneous: Off-hand non-weapons or "frills"
    Former Ammo slot: Relics

Weapon proficiencies by class

    Wrath Death Knight - Axes, Swords, Maces, Pole Arms, Relic
    Druid - Maces, Pole Arms, Staves, Daggers, Fist, Relic
    Hunter - Axes, Swords, Pole Arms, Staves, Daggers, Fist, Bows, Crossbows, Guns
    Mage - Swords, Staves, Daggers, Wands
    Paladin - Axes, Swords, Maces, Pole Arms, Relic
    Priest - One-Handed Maces, Staves, Daggers, Wands
    Rogue - One-Handed Axes, One-Handed Swords, One-Handed Maces, Daggers, Fist, Bows, Crossbows, Guns, Thrown
    Shaman - Axes, Maces, Pole Arms, Staves, Daggers, Fist, Relic
    Warlock - Swords, Staves, Daggers, Wands
    Warrior - Axes, Swords, Maces, Pole Arms, Staves, Daggers, Fist, Bows, Crossbows, Guns, Thrown

Armor categories

    Cloaks - All classes can use cloaks.
    Cloth - All classes can wear cloth. Never has Agility or Strength bonuses, only one with Spell penetration bonuses.
    Leather - Rarely has Strength bonuses.
    Mail - Rarely has Parry rating bonuses.
    Plate - Generally has the most Armor.
    Shield - Only Paladins, Shamans, and Warriors can use.

Armor proficiencies by class

    Wrath Death Knight - Cloth, Leather, Mail, Plate
    Druid - Cloth, Leather
    Hunter - Cloth, Leather, Mail (at level 40)
    Mage - Cloth
    Paladin - Cloth, Leather, Mail, Plate (at level 40), Shield
    Priest - Cloth
    Rogue - Cloth, Leather
    Shaman - Cloth, Leather, Mail (at level 40), Shield
    Warlock - Cloth
    Warrior - Cloth, Leather, Mail, Plate (at level 40), Shield
    */

export function classify(tags: string[], tooltip: Record<'label' | 'format', string>[]) {
  const classes = tooltip
    .filter((t) => /Classes/.test(t.label))
    .flatMap((t) =>
      t.label
        .replace('Classes: ', '')
        .split(',')
        .map((c) => Classes[c.trim().toLowerCase() as keyof typeof Classes])
    );

  return '111111111111';
}
