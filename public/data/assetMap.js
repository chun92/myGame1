function getSprite(str) {
    const spriteDir = 'assets/sprites/';
    const pngExt = '.png';
    const res = spriteDir + str + pngExt;
    return res;
}

export const AssetMap = {
    'energy_black': getSprite('energy_black'),
    'energy_blue': getSprite('energy_blue'),
    'energy_green': getSprite('energy_green'),
    'energy_orange': getSprite('energy_orange'),
    'energy_red': getSprite('energy_red'),
    'energy_white': getSprite('energy_white'),
    'energy_yellow': getSprite('energy_yellow'),
    'hexagon_black': getSprite('hexagon_black'),

    'tile': getSprite('hexagon_black'),
    'enemy': getSprite('enemy'),
    'player': getSprite('player'),

    'ability_move': getSprite('move_icon'),
    'ability_attack': getSprite('attack_icon'),
    'ability_defense': getSprite('defense_icon'),
}
