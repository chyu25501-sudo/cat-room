import {
  GiftId,
  GiftItem,
  GiftRecord,
  GiftInventory,
  GiftRarity,
  GiftAcquisitionFilter,
} from '../types/gift.ts';
import { CatId } from '../types/cat.ts';

/**
 * 猫から貰えるおくりもののマスターデータリスト（全80種）
 *
 * 並び順の設計方針:
 * 1. 通常（common: 45種）
 * 2. レア（rare: 20種）
 * 3. スーパーレア（super-rare: 12種）
 * 4. ウルトラレア（ultra-rare: 3種）
 *
 * 今後贈り物を増やす際はこの配列に追加するだけで拡張可能です。
 */
export const CAT_GIFTS: readonly GiftItem[] = [
  // ==========================================
  // 【通常（common）】自然・植物・木の実
  // ==========================================
  {
    id: 'pebble',
    name: 'きれいな小石',
    description: 'どこかで見つけてきた、つるつると丸くてきれいな小石。',
    icon: '🪨',
    iconType: 'pebble',
    themeClass: 'from-amber-100 to-stone-200 border-stone-300 text-stone-700',
    rarity: 'common',
  },
  {
    id: 'mossy-pebble',
    name: 'こけむした小石',
    description: '湿った日陰で見つけてきた、うっすらと緑の苔が生えた丸い小石。',
    icon: '🪨',
    iconType: 'mossy-pebble',
    themeClass: 'from-emerald-100 to-stone-200 border-emerald-300 text-stone-700',
    rarity: 'common',
  },
  {
    id: 'twig',
    name: 'ほそい小枝',
    description: 'お庭の植え込みから折ってくわえてきた、香りのいい小枝。',
    icon: '🌿',
    iconType: 'twig',
    themeClass: 'from-lime-100 to-emerald-100 border-lime-300 text-emerald-800',
    rarity: 'common',
  },
  {
    id: 'seashell',
    name: 'ちいさな貝殻',
    description: 'どこかで見つけてきた、うっすらピンク色のかわいい貝殻。',
    icon: '🐚',
    iconType: 'seashell',
    themeClass: 'from-rose-100 to-pink-100 border-pink-300 text-rose-700',
    rarity: 'common',
  },
  {
    id: 'fallen-leaf',
    name: 'あかい落ち葉',
    description: 'ひらひらと風に舞っていた、鮮やかな赤色のもみじの葉。',
    icon: '🍁',
    iconType: 'fallen-leaf',
    themeClass: 'from-orange-100 to-red-100 border-red-300 text-red-700',
    rarity: 'common',
  },
  {
    id: 'acorn',
    name: 'まるいどんぐり',
    description: '森の木陰で見つけてきた、つやつやと丸い秋のどんぐり。',
    icon: '🌰',
    iconType: 'acorn',
    themeClass: 'from-amber-100 to-amber-200 border-amber-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'pinecone',
    name: 'おおきな松ぼっくり',
    description: '公園の松の木の下で見つけた、笠の開いた立派な松ぼっくり。',
    icon: '🌲',
    iconType: 'pinecone',
    themeClass: 'from-amber-100 to-stone-200 border-amber-400 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'clover',
    name: 'みどりのクローバー',
    description: '草むらの中から摘んできた、青々とした三つ葉のクローバー。',
    icon: '☘️',
    iconType: 'clover',
    themeClass: 'from-emerald-100 to-green-100 border-emerald-300 text-emerald-700',
    rarity: 'common',
  },
  {
    id: 'wilted-flower',
    name: 'しおれた野花',
    description: '道端から摘んできた、少し首をかしげてしおれた素朴で小さなお花。',
    icon: '🥀',
    iconType: 'wilted-flower',
    themeClass: 'from-amber-100 to-yellow-100 border-yellow-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'soft-dandelion',
    name: 'やわらかい綿毛',
    description: '風に乗ってふわふわ飛んでいたところを前足で上手にキャッチした、まんまるいたんぽぽの綿毛。',
    icon: '🌼',
    iconType: 'soft-dandelion',
    themeClass: 'from-yellow-50 to-stone-100 border-stone-200 text-stone-700',
    rarity: 'common',
  },
  {
    id: 'withered-foxtail',
    name: 'かれたねこじゃらし草',
    description: '道端から根元ごとくわえてきた、秋風に吹かれて穂がカサカサに乾いたエノコログサ。',
    icon: '🌾',
    iconType: 'withered-foxtail',
    themeClass: 'from-yellow-100 to-amber-100 border-amber-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'sunflower-seed',
    name: 'ひまわりの種',
    description: 'どこからか一粒だけくわえてきた、白黒のしま模様があるひまわりの種。',
    icon: '🌻',
    iconType: 'sunflower-seed',
    themeClass: 'from-stone-200 to-amber-100 border-stone-400 text-stone-800',
    rarity: 'common',
  },

  // ==========================================
  // 【通常（common）】昆虫・生き物・痕跡
  // ==========================================
  {
    id: 'cicada-shell',
    name: 'せみのぬけがら',
    description: '庭の木の幹にくっついていた、琥珀色に透き通った夏のセミの抜け殻。',
    icon: '🪵',
    iconType: 'cicada-shell',
    themeClass: 'from-amber-100 to-yellow-200 border-amber-300 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'cicada-wing',
    name: 'かわいた蝉の羽',
    description: 'ベランダのすみに落ちていた、ステンドグラスのように透明な翅脈の美しい蝉のはね。',
    icon: '🪽',
    iconType: 'cicada-wing',
    themeClass: 'from-stone-100 to-amber-50 border-amber-200 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'lizard-tail',
    name: 'ちいさなトカゲのしっぽ',
    description: '庭先で自切したトカゲから譲り受けた（？）のか、まだかすかにピクピクしている青い尾。',
    icon: '🦎',
    iconType: 'lizard-tail',
    themeClass: 'from-sky-100 to-teal-100 border-cyan-300 text-teal-800',
    rarity: 'common',
  },
  {
    id: 'cat-whisker',
    name: 'ぬけたじぶんのヒゲ',
    description: '掃除中に見つかることの多い、ピンと白くて縁起が良いとされる猫自身の抜け落ちたヒゲ。',
    icon: '🪄',
    iconType: 'cat-whisker',
    themeClass: 'from-stone-50 to-slate-100 border-stone-200 text-stone-700',
    rarity: 'common',
  },

  // ==========================================
  // 【通常（common）】おもちゃ・遊び道具・布・毛糸
  // ==========================================
  {
    id: 'super-ball',
    name: 'みどりのスーパーボール',
    description: 'フローリングの上でよく弾む、鮮やかな緑色のゴム製スーパーボール。',
    icon: '🟢',
    iconType: 'super-ball',
    themeClass: 'from-lime-100 to-emerald-200 border-emerald-400 text-emerald-800',
    rarity: 'common',
  },
  {
    id: 'dented-pingpong-ball',
    name: 'へこんだピンポン球',
    description: '夢中で追いかけ回して爪でひと突きされたのか、ペコッとへこんで不規則に転がるピンポン球。',
    icon: '🏓',
    iconType: 'dented-pingpong-ball',
    themeClass: 'from-orange-50 to-amber-100 border-orange-200 text-orange-800',
    rarity: 'common',
  },
  {
    id: 'glass-marble',
    name: 'きらきらしたおはじき',
    description: '光にかざすときらきらと輝く、平たくて丸いガラスのおはじき。',
    icon: '🔮',
    iconType: 'glass-marble',
    themeClass: 'from-sky-100 via-teal-100 to-blue-100 border-cyan-300 text-cyan-800',
    rarity: 'common',
  },
  {
    id: 'white-dice',
    name: 'しろいサイコロ',
    description: '箱のすき間から転がり出てきた、角の取れたつるつると白いサイコロ。',
    icon: '🎲',
    iconType: 'white-dice',
    themeClass: 'from-slate-100 to-stone-100 border-stone-300 text-stone-800',
    rarity: 'common',
  },
  {
    id: 'small-bell',
    name: 'ちいさな鈴',
    description: '転がすとチリンと軽やかな音が鳴る、金色のちいさな丸い鈴。',
    icon: '🔔',
    iconType: 'small-bell',
    themeClass: 'from-amber-100 to-yellow-200 border-yellow-400 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'ribbon',
    name: 'ながいリボン',
    description: '部屋のすみに落ちていた、さらさらと光沢のある細長いリボン。',
    icon: '🎀',
    iconType: 'ribbon',
    themeClass: 'from-pink-100 to-fuchsia-100 border-pink-300 text-pink-700',
    rarity: 'common',
  },
  {
    id: 'yarn-scrap',
    name: 'まるい毛糸くず',
    description: '手芸カゴからこっそり引っ張り出して丸めた、ふかふかと柔らかな短い毛糸の切れ端。',
    icon: '🧶',
    iconType: 'yarn-scrap',
    themeClass: 'from-rose-100 to-purple-100 border-pink-300 text-rose-700',
    rarity: 'common',
  },
  {
    id: 'hairball',
    name: 'まるまった毛玉',
    description: 'ブラッシングのあとや毛づくろいの抜け毛が丸まった、手のひらサイズのふわっと軽い毛玉。',
    icon: '🧶',
    iconType: 'hairball',
    themeClass: 'from-stone-100 to-neutral-200 border-stone-300 text-stone-700',
    rarity: 'common',
  },
  {
    id: 'dirty-plush',
    name: 'よごれたぬいぐるみ',
    description: 'ずっとくわえて遊んでいたのか、少し土がついて愛着のわく小さなぬいぐるみ。',
    icon: '🧸',
    iconType: 'dirty-plush',
    themeClass: 'from-amber-100 to-stone-200 border-amber-300 text-amber-900',
    rarity: 'common',
  },

  // ==========================================
  // 【通常（common）】日用品・身の回りの小物
  // ==========================================
  {
    id: 'feather',
    name: 'ふわふわの羽根',
    description: '日向で見つけてくわえてきた、やわらかく軽やかな羽根。',
    icon: '🪶',
    iconType: 'feather',
    themeClass: 'from-sky-100 to-indigo-100 border-sky-300 text-sky-700',
    rarity: 'common',
  },
  {
    id: 'old-stamp',
    name: 'ふるい切手',
    description: 'どこかの引き出しの奥から見つけてきた、ギザギザの縁取りがあるレトロな切手。',
    icon: '📮',
    iconType: 'old-stamp',
    themeClass: 'from-amber-50 to-orange-100 border-orange-300 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'hairpin',
    name: 'かわいいヘアピン',
    description: 'お部屋のすみに落ちていた、小さなお花の飾りがついたかわいいヘアピン。',
    icon: '🌸',
    iconType: 'hairpin',
    themeClass: 'from-pink-100 to-rose-100 border-pink-300 text-pink-700',
    rarity: 'common',
  },
  {
    id: 'button',
    name: 'ひかるボタン',
    description: '床のすみに転がっていた、光を受けてきらりと輝く小さなボタン。',
    icon: '🔘',
    iconType: 'button',
    themeClass: 'from-cyan-100 to-blue-100 border-blue-300 text-cyan-800',
    rarity: 'common',
  },
  {
    id: 'pink-handkerchief',
    name: 'ももいろのハンカチ',
    description: '洗濯物の近くからくわえてきた、やわらかくて優しいピンク色のハンカチ。',
    icon: '🧣',
    iconType: 'pink-handkerchief',
    themeClass: 'from-pink-100 to-rose-100 border-pink-300 text-pink-700',
    rarity: 'common',
  },
  {
    id: 'single-sock',
    name: 'かたっぽの靴下',
    description: '部屋のどこかから持ってきた、しましま模様の片方だけの小さな靴下。',
    icon: '🧦',
    iconType: 'single-sock',
    themeClass: 'from-indigo-100 to-sky-100 border-indigo-300 text-indigo-700',
    rarity: 'common',
  },
  {
    id: 'broken-rubber-band',
    name: 'ちぎれた輪ゴム',
    description: '引っ張って遊んでいるうちにプチッとちぎれた、少し伸びきった茶色い輪ゴム。',
    icon: '➰',
    iconType: 'broken-rubber-band',
    themeClass: 'from-amber-100 to-yellow-100 border-amber-300 text-amber-800',
    rarity: 'common',
  },

  // ==========================================
  // 【通常（common）】パッケージ・ゴミ・空き容器
  // ==========================================
  {
    id: 'twisted-wire',
    name: 'ねじれた針金',
    description: '食パンの袋を留めていたビニールタイ。ぐにゃぐにゃに曲げて遊んだ跡がある。',
    icon: '📎',
    iconType: 'twisted-wire',
    themeClass: 'from-amber-50 to-yellow-100 border-yellow-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'crumpled-aluminum',
    name: 'まるめたアルミホイル',
    description: '手で転がしてサッカーのように遊んでいた、ぎゅっと小さく丸めた銀色のアルミホイル。',
    icon: '🏐',
    iconType: 'crumpled-aluminum',
    themeClass: 'from-slate-100 to-zinc-200 border-slate-300 text-slate-700',
    rarity: 'common',
  },
  {
    id: 'cardboard-scrap',
    name: 'ちいさなダンボール片',
    description: '爪研ぎや噛みつきで器用にちぎり取られた、角がボロボロのダンボールの切れ端。',
    icon: '📦',
    iconType: 'cardboard-scrap',
    themeClass: 'from-amber-100 to-stone-200 border-amber-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'torn-receipt',
    name: 'やぶれたレシート',
    description: 'くしゃくしゃにして爪で引き裂いた、お買い物合計だけが読める感熱紙のレシート。',
    icon: '🧾',
    iconType: 'torn-receipt',
    themeClass: 'from-stone-100 to-zinc-100 border-zinc-300 text-zinc-700',
    rarity: 'common',
  },
  {
    id: 'candy-wrapper',
    name: 'おかしの包み紙',
    description: '両端がキュッとねじられた、きらきらと光るキャンディの包み紙。',
    icon: '🍬',
    iconType: 'candy-wrapper',
    themeClass: 'from-purple-100 to-pink-100 border-purple-300 text-purple-700',
    rarity: 'common',
  },
  {
    id: 'snack-wrapper',
    name: 'おやつの空き袋',
    description: 'おいしい匂いが残っているのか、くしゃくしゃに丸められたスナックの空き袋。',
    icon: '🍟',
    iconType: 'snack-wrapper',
    themeClass: 'from-amber-100 to-red-100 border-red-300 text-red-700',
    rarity: 'common',
  },
  {
    id: 'bento-baran',
    name: 'おべんとうのバラン',
    description: 'お弁当箱のすみにあった、草の形をした緑色のギザギザした仕切りシート。',
    icon: '🍱',
    iconType: 'bento-baran',
    themeClass: 'from-emerald-100 to-green-100 border-green-300 text-green-800',
    rarity: 'common',
  },
  {
    id: 'skewer',
    name: 'ほそながい串',
    description: 'どこかで拾ってきた、先が少し丸くなった長くて細い竹串。',
    icon: '🍢',
    iconType: 'skewer',
    themeClass: 'from-amber-100 to-stone-200 border-amber-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'ice-stick',
    name: 'はずれのアイス棒',
    description: 'おいしく食べたあとの木製アイスバーの棒。「はずれ」の焼き印がある。',
    icon: '🍦',
    iconType: 'ice-stick',
    themeClass: 'from-amber-100 to-orange-100 border-amber-300 text-amber-800',
    rarity: 'common',
  },
  {
    id: 'plastic-bottle-cap',
    name: 'すべすべのプラスチックフタ',
    description: '床をすべる感触が楽しくてドリブルしていた、ペットボトルのまあるいキャップ。',
    icon: '🧢',
    iconType: 'plastic-bottle-cap',
    themeClass: 'from-sky-100 to-blue-100 border-sky-300 text-sky-800',
    rarity: 'common',
  },
  {
    id: 'jelly-cup',
    name: 'あいたゼリーのカップ',
    description: '甘い果汁の香りに惹かれて転がしてきた、きれいに洗われた小さな透明プラスチックカップ。',
    icon: '🍧',
    iconType: 'jelly-cup',
    themeClass: 'from-cyan-50 to-emerald-50 border-cyan-200 text-cyan-800',
    rarity: 'common',
  },
  {
    id: 'blue-can',
    name: 'あおい空き缶',
    description: '転がして遊んでいたのか、少しへこんだ鮮やかな青色のジュースの空き缶。',
    icon: '🥫',
    iconType: 'blue-can',
    themeClass: 'from-sky-100 to-blue-200 border-blue-400 text-blue-800',
    rarity: 'common',
  },
  {
    id: 'empty-bottle',
    name: 'からっぽのペットボトル',
    description: '爪でカリカリ引っかいた跡がある、軽くて透明な空のペットボトル。',
    icon: '🍾',
    iconType: 'empty-bottle',
    themeClass: 'from-cyan-50 to-sky-100 border-cyan-300 text-cyan-800',
    rarity: 'common',
  },

  // ==========================================
  // 【レア（rare: 6種）】日常の珍品・幸運・古代・伝説
  // ==========================================
  // 【レア（rare: 20種）】自然・珍品・日用品・骨董
  // ==========================================
  // 自然・植物・木・水辺
  {
    id: 'single-rose',
    name: 'いちりんの薔薇',
    description: 'どこかの花壇から一輪だけそっとくわえてきた、真紅の花びらが気品にあふれる薔薇。',
    icon: '🌹',
    iconType: 'single-rose',
    themeClass: 'from-rose-200 via-amber-100 to-red-200 border-rose-400 text-rose-950',
    rarity: 'rare',
  },
  {
    id: 'round-bulb',
    name: 'まるい球根',
    description: '春に大輪の花を咲かせる日を夢見て、花壇の土の中から丁寧に掘り出してきた丸い球根。',
    icon: '🧅',
    iconType: 'round-bulb',
    themeClass: 'from-amber-100 via-stone-100 to-orange-200 border-amber-300 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'large-pumpkin',
    name: 'おおきなカボチャ',
    description: '自分の体よりもはるかに立派でずっしりと重い濃緑色の南瓜。いったいどうやって持ってきたのだろうか…',
    icon: '🎃',
    iconType: 'large-pumpkin',
    themeClass: 'from-amber-200 via-orange-200 to-yellow-300 border-orange-400 text-orange-950',
    rarity: 'rare',
  },
  {
    id: 'splendid-branch',
    name: 'りっぱな枝',
    description: 'どこかの神木から落ちたのか、見事な枝振りと小さな金の芽をつけた立派な木の枝。',
    icon: '🌿',
    iconType: 'splendid-branch',
    themeClass: 'from-emerald-200 via-amber-100 to-green-200 border-emerald-400 text-emerald-900',
    rarity: 'rare',
  },
  {
    id: 'light-driftwood',
    name: 'かるい流木',
    description: '川辺で長い年月をかけて削られ、すべすべの手触りになった不思議と軽い小さな流木。',
    icon: '🪵',
    iconType: 'light-driftwood',
    themeClass: 'from-stone-200 via-amber-100 to-stone-300 border-stone-400 text-stone-800',
    rarity: 'rare',
  },
  {
    id: 'sparkling-seashell',
    name: 'きらきら貝殻',
    description: '真珠層が虹色に光を反射する、波打ち際で見つけてきたとても綺麗な巻貝の殻。',
    icon: '🐚',
    iconType: 'sparkling-seashell',
    themeClass: 'from-cyan-100 via-pink-100 to-amber-100 border-pink-300 text-stone-800',
    rarity: 'rare',
  },
  {
    id: 'glowing-moss-stone',
    name: 'ひかる苔石',
    description: '暗闇で幻想的な淡い青緑の光を放つ、特殊な光る苔がびっしりと覆った不思議な丸石。',
    icon: '🪨',
    iconType: 'glowing-moss-stone',
    themeClass: 'from-teal-200 via-emerald-200 to-cyan-200 border-teal-400 text-teal-950',
    rarity: 'rare',
  },
  // 生き物・食べ物
  {
    id: 'snake-shedding',
    name: 'へびの抜け殻',
    description: '草むらの奥で見つけてきた、破れひとつない一本まるまる綺麗に残った縁起物の抜け殻。',
    icon: '🐍',
    iconType: 'snake-shedding',
    themeClass: 'from-emerald-100 via-yellow-100 to-stone-200 border-emerald-300 text-emerald-950',
    rarity: 'rare',
  },
  {
    id: 'large-bonito-flake',
    name: 'おおきな鰹節',
    description: '台所の戸棚から見事に一本まるごと持ち出してきた、香ばしい出汁の香りが漂う特大の本枯節。',
    icon: '🐟',
    iconType: 'large-bonito-flake',
    themeClass: 'from-amber-200 via-orange-100 to-amber-300 border-amber-400 text-amber-950',
    rarity: 'rare',
  },
  // 日常・雑貨・道具・おもちゃ
  {
    id: 'winning-ice-stick',
    name: 'あたりのアイス棒',
    description: '見事に「あたり」が出た木製アイスバーの棒。もう一本もらえる幸運の証。',
    icon: '🍦',
    iconType: 'winning-ice-stick',
    themeClass: 'from-amber-200 via-orange-100 to-yellow-200 border-amber-400 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'important-paper',
    name: 'だいじそうな紙',
    description: 'よくわからないが請求書と書かれている。机の上から見つけてきたらしく、得意げな顔で足元へ差し出してきた。',
    icon: '📄',
    iconType: 'important-paper',
    themeClass: 'from-amber-100 to-yellow-200 border-amber-400 text-amber-950',
    rarity: 'rare',
  },
  {
    id: 'cat-acrylic-stand',
    name: 'ねこのアクスタ',
    description: '猫の愛らしいポーズが印刷された透明なアクリルスタンド。どこかの机から拝借してきたらしい。',
    icon: '🖼️',
    iconType: 'cat-acrylic-stand',
    themeClass: 'from-sky-100 via-purple-100 to-amber-100 border-sky-300 text-slate-800',
    rarity: 'rare',
  },
  {
    id: 'luxury-paintbrush',
    name: 'こうきゅう絵筆',
    description: '毛先がなめらかに揃った上質な絵筆。アトリエの筆立てから大切そうにくわえて持ってきた。',
    icon: '🖌️',
    iconType: 'luxury-paintbrush',
    themeClass: 'from-amber-200 via-red-100 to-yellow-200 border-amber-400 text-amber-950',
    rarity: 'rare',
  },
  {
    id: 'mini-light-bulb',
    name: 'ちいさな豆電球',
    description: '実験器具から外してきたのか、フィラメントが繊細に残っている丸くて小さな豆電球。',
    icon: '💡',
    iconType: 'mini-light-bulb',
    themeClass: 'from-yellow-100 via-amber-100 to-yellow-200 border-amber-300 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'glossy-cloth',
    name: 'つやつやの布',
    description: '光の加減で優美な光沢を放つシルクの布切れ。とても手触りがよく、寝床から引き抜いてきたらしい。',
    icon: '🧣',
    iconType: 'glossy-cloth',
    themeClass: 'from-rose-100 via-purple-100 to-pink-200 border-purple-300 text-purple-950',
    rarity: 'rare',
  },
  {
    id: 'puzzle-ring',
    name: 'ちえのわ',
    description: '複雑に絡み合った二つの金属の輪。猫の前足でガチャガチャと弄ばれた跡がある。',
    icon: '🥨',
    iconType: 'puzzle-ring',
    themeClass: 'from-slate-200 via-amber-100 to-zinc-300 border-slate-400 text-slate-800',
    rarity: 'rare',
  },
  {
    id: 'beautiful-bell',
    name: 'うつくしい鈴',
    description: '透き通るような涼やかな音色を奏でる、細かな彫刻が施された美しい真鍮の鈴。',
    icon: '🔔',
    iconType: 'beautiful-bell',
    themeClass: 'from-amber-200 via-yellow-100 to-amber-300 border-amber-400 text-amber-900',
    rarity: 'rare',
  },
  // 硬貨・骨董・古代品
  {
    id: 'shiny-coin',
    name: 'ぴかぴかのコイン',
    description: 'まるで新品のようにまばゆく輝く、どこかの自販機の下で見つけたピカピカの硬貨。',
    icon: '🪙',
    iconType: 'shiny-coin',
    themeClass: 'from-amber-200 via-yellow-100 to-yellow-300 border-amber-400 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'old-coin',
    name: 'ふしぎな古銭',
    description: 'どこかの古い蔵や床下で見つけてきたのか、不思議な文字が刻まれた丸い古銭。',
    icon: '🪙',
    iconType: 'old-coin',
    themeClass: 'from-amber-200 to-yellow-300 border-amber-400 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'curious-magatama',
    name: 'きみょうな勾玉',
    description: '翡翠のように淡く緑色に透き通る、古い儀式で使われていたような形の不思議な勾玉。',
    icon: '📿',
    iconType: 'curious-magatama',
    themeClass: 'from-emerald-200 via-teal-100 to-cyan-200 border-emerald-400 text-teal-900',
    rarity: 'rare',
  },

  // ==========================================
  // 【スーパーレア（super-rare: 12種）】奇跡・宝石・結晶・歴史の遺物
  // ==========================================
  // 自然・生き物の奇跡
  {
    id: 'four-leaf-clover',
    name: 'よつばのクローバー',
    description: '草むらの中で奇跡的に見つけた、特別な幸運をもたらす四つ葉のクローバー。',
    icon: '🍀',
    iconType: 'four-leaf-clover',
    themeClass: 'from-purple-200 via-fuchsia-100 to-violet-300 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'jewel-beetle-wing',
    name: 'たまむしの羽根',
    description: '見る角度によってエメラルドや紫に色を変える、玉虫厨子にも使われた奇跡の構造色を持つ翅。',
    icon: '🪲',
    iconType: 'jewel-beetle-wing',
    themeClass: 'from-purple-200 via-emerald-200 to-teal-300 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'dragon-scale',
    name: 'りゅうの鱗',
    description: '伝説のドラゴンから剥がれ落ちたと伝わる、虹色に光る硬質で神聖なウロコ。',
    icon: '🐉',
    iconType: 'dragon-scale',
    themeClass: 'from-purple-200 via-teal-200 to-indigo-300 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  // 鉱物・宝石・結晶・天体
  {
    id: 'red-gem',
    name: 'あかいろの宝石',
    description: '深紅に輝くカットが美しい、どこかの宝飾品から落ちたような小さな赤い宝石。',
    icon: '💎',
    iconType: 'red-gem',
    themeClass: 'from-purple-200 via-rose-200 to-fuchsia-200 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'blue-gem',
    name: 'あおいろの宝石',
    description: '夜空や深い海を閉じ込めたように澄み渡る、吸い込まれそうな青い宝石。',
    icon: '💎',
    iconType: 'blue-gem',
    themeClass: 'from-violet-200 via-sky-200 to-purple-200 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'yellow-gem',
    name: 'きいろの宝石',
    description: '陽だまりの光を閉じ込めたように明るくきらめく、黄金色に澄んだ黄色い宝石。',
    icon: '💎',
    iconType: 'yellow-gem',
    themeClass: 'from-purple-200 via-yellow-100 to-fuchsia-200 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'dark-crystal',
    name: 'やみの結晶',
    description: '周囲の光を吸い込むように深く暗い黒紫に輝く、冥界の魔力を秘めた未知の鉱物の結晶。',
    icon: '🔮',
    iconType: 'dark-crystal',
    themeClass: 'from-purple-300 via-slate-800 to-violet-400 border-purple-500 text-purple-100',
    rarity: 'super-rare',
  },
  {
    id: 'star-fragment',
    name: 'ほしのかけら',
    description: '夜空から落ちてきた流れ星の欠片。手のひらで淡く温かく明滅している。',
    icon: '⭐',
    iconType: 'star-fragment',
    themeClass: 'from-purple-200 via-violet-200 to-indigo-200 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  // 歴史・富・書籍・古代道具
  {
    id: 'golden-koban',
    name: 'おうごんの小判',
    description: '純金製でずっしりと重く、「壱両」の極印が打たれた正真正銘の江戸時代の本物の小判。',
    icon: '🪙',
    iconType: 'golden-koban',
    themeClass: 'from-purple-200 via-yellow-200 to-amber-300 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'miracle-error-coin',
    name: 'きせきのエラーコイン',
    description: '表と裏で図柄が大きくズレて刻印された、貨幣コレクターが目の色を変えて探し求める幻の硬貨。',
    icon: '🪙',
    iconType: 'miracle-error-coin',
    themeClass: 'from-purple-200 via-amber-100 to-indigo-200 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'shady-self-help-book',
    name: 'うさんくさい自己啓発本',
    description: '「猫のように生きれば年収1億円」と金文字で書かれた、どこか怪しげな魅力にあふれる単行本。',
    icon: '📕',
    iconType: 'shady-self-help-book',
    themeClass: 'from-purple-200 via-pink-100 to-violet-300 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },
  {
    id: 'ancient-compass',
    name: 'こだいのコンパス',
    description: '失われた古代の航路を指し示すかのように、磁北ではない特定の場所を常に指し続ける羅針盤。',
    icon: '🧭',
    iconType: 'ancient-compass',
    themeClass: 'from-purple-200 via-cyan-100 to-indigo-200 border-purple-400 text-purple-950',
    rarity: 'super-rare',
  },

  // ==========================================
  // 【ウルトラレア（ultra-rare: 3種）】伝説・古代の遺物・神話
  // ==========================================
  {
    id: 'rainbow-feather',
    name: 'なないろの羽根',
    description: '光に透かすと虹色にきらめく、伝説の鳥が落としていったような奇跡の羽根。',
    icon: '🪶',
    iconType: 'rainbow-feather',
    themeClass: 'from-cyan-200 via-fuchsia-200 to-rose-200 border-fuchsia-400 text-slate-900',
    rarity: 'ultra-rare',
  },
  {
    id: 'ancient-gear',
    name: 'いにしえの歯車',
    description: '古代の高度な文明で作られたと思われる、決して錆びることのない真鍮の精密な歯車。',
    icon: '⚙️',
    iconType: 'ancient-gear',
    themeClass: 'from-cyan-200 via-amber-200 to-rose-200 border-fuchsia-400 text-slate-900',
    rarity: 'ultra-rare',
  },
  {
    id: 'dragon-claw',
    name: 'りゅうの爪',
    description: '鋼よりも鋭く湾曲した、古のドラゴンが残したとされる神秘的な黒金の爪。',
    icon: '🐉',
    iconType: 'dragon-claw',
    themeClass: 'from-cyan-200 via-rose-200 to-violet-300 border-fuchsia-400 text-slate-900',
    rarity: 'ultra-rare',
  },
] as const;

/** デフォルトのフォールバック用ギフト（万が一の未登録時） */
export const DEFAULT_GIFT: GiftItem = CAT_GIFTS[0];

/**
 * ギフトIDからギフト定義情報を取得する純粋関数
 */
export function getGiftById(
  giftId: string,
  catalog: readonly GiftItem[] = CAT_GIFTS
): GiftItem | undefined {
  return catalog.find((g) => g.id === giftId);
}

/** 通常アイテムの抽選重み（デフォルト） */
export const DEFAULT_COMMON_GIFT_WEIGHT = 10;

/** レアアイテムの抽選重み（以前の2から5に引き上げ、少し出やすく設定） */
export const DEFAULT_RARE_GIFT_WEIGHT = 5;

/** スーパーレアアイテムの抽選重み（レアより出づらい） */
export const DEFAULT_SUPER_RARE_GIFT_WEIGHT = 2;

/** ウルトラレアアイテムの抽選重み（スーパーレアよりさらに出づらい、最高峰の希少度） */
export const DEFAULT_ULTRA_RARE_GIFT_WEIGHT = 1;

/**
 * ギフトの抽選確率計算用重みを取得する純粋関数
 */
export function getGiftWeight(gift: GiftItem): number {
  if (typeof gift.weight === 'number' && gift.weight > 0) {
    return gift.weight;
  }
  switch (gift.rarity) {
    case 'ultra-rare':
      return DEFAULT_ULTRA_RARE_GIFT_WEIGHT;
    case 'super-rare':
      return DEFAULT_SUPER_RARE_GIFT_WEIGHT;
    case 'rare':
      return DEFAULT_RARE_GIFT_WEIGHT;
    case 'common':
    default:
      return DEFAULT_COMMON_GIFT_WEIGHT;
  }
}

/**
 * ギフトのレアリティに応じたアイコン背景Tailwindクラスを返す純粋関数
 * ウルトラレア: 虹色・オーロラグラデーション（白でも金でもない）
 * スーパーレア: 紫色グラデーション（白でも金でもない）
 * レア: 金色グラデーション
 * 通常: 白色
 */
export function getGiftIconBgClass(rarity?: GiftRarity): string {
  if (rarity === 'ultra-rare') {
    return 'bg-gradient-to-br from-cyan-300 via-fuchsia-200 to-rose-300 border-fuchsia-400 text-fuchsia-950 shadow-fuchsia-300/60';
  }
  if (rarity === 'super-rare') {
    return 'bg-gradient-to-br from-purple-300 via-fuchsia-100 to-violet-300 border-purple-400 text-purple-900 shadow-purple-300/50';
  }
  if (rarity === 'rare') {
    return 'bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 border-amber-400 text-amber-900 shadow-amber-200/60';
  }
  return 'bg-white border-orange-200 text-stone-700';
}

/**
 * ギフト一覧から確率（レアリティ重み）に応じて1つ選出する純粋関数
 * レアアイテムは通常のアイテムと比べて出現確率が低くなります。
 * テスト容易性のために randomFn を注入可能（デフォルト: Math.random）
 */
export function pickRandomGift(
  catalog: readonly GiftItem[] = CAT_GIFTS,
  randomFn: () => number = Math.random
): GiftItem {
  if (catalog.length === 0) {
    return DEFAULT_GIFT;
  }

  const totalWeight = catalog.reduce((sum, item) => sum + getGiftWeight(item), 0);
  if (totalWeight <= 0) {
    return catalog[0] ?? DEFAULT_GIFT;
  }

  // 0 <= rand < totalWeight
  const randVal = Math.max(0, Math.min(0.9999999, randomFn()));
  const rand = randVal * totalWeight;

  let cumulative = 0;
  for (const item of catalog) {
    cumulative += getGiftWeight(item);
    if (rand < cumulative) {
      return item;
    }
  }

  return catalog[catalog.length - 1] ?? DEFAULT_GIFT;
}

/**
 * インベントリに新しいギフトの受取を記録する純粋関数（イミュータブルに更新）
 *
 * @param inventory 現在のインベントリ
 * @param giftId 受け取ったギフトID
 * @param catId プレゼントしてくれた猫のID
 * @param timestamp 受取時刻（UNIXタイムスタンプ、未指定時はDate.now()）
 * @returns 更新された新しいGiftInventoryオブジェクト
 */
export function addGiftToInventory(
  inventory: GiftInventory,
  giftId: GiftId,
  catId: CatId,
  timestamp: number = Date.now()
): GiftInventory {
  const existingRecord = inventory[giftId];
  const currentCount = existingRecord ? existingRecord.count : 0;
  const firstReceivedAt = existingRecord ? existingRecord.firstReceivedAt : timestamp;
  const existingByCat = existingRecord?.byCat ?? {};
  const currentCatCount = existingByCat[catId] ?? 0;

  const updatedRecord: GiftRecord = {
    giftId,
    count: currentCount + 1,
    byCat: {
      ...existingByCat,
      [catId]: currentCatCount + 1,
    },
    firstReceivedAt,
    lastReceivedAt: timestamp,
  };

  return {
    ...inventory,
    [giftId]: updatedRecord,
  };
}

/**
 * 指定したギフトの累計受取個数を取得する純粋関数
 */
export function getGiftCount(inventory: GiftInventory, giftId: GiftId): number {
  return inventory[giftId]?.count ?? 0;
}

/**
 * 全ギフトの合計受取個数を計算する純粋関数
 */
export function getTotalGiftCount(inventory: GiftInventory): number {
  return Object.values(inventory).reduce((sum, record) => sum + (record.count || 0), 0);
}

/**
 * これまでに受け取ったことがあるおくりものの種類数（収集種類数）を計算する純粋関数
 * 今後おくりものの総数が増加した場合でも、指定したカタログまたは全カタログに基づいて正確に収集済み種類数をカウントします。
 *
 * @param inventory 現在のおくりものインベントリ
 * @param catalog 対象のおくりものカタログ（デフォルト: CAT_GIFTS）
 * @returns 1個以上受け取ったことがあるギフトの種類数
 */
export function getAcquiredGiftTypeCount(
  inventory: GiftInventory,
  catalog: readonly GiftItem[] = CAT_GIFTS
): number {
  if (!inventory || typeof inventory !== 'object') {
    return 0;
  }
  return catalog.filter((item) => (inventory[item.id]?.count ?? 0) > 0).length;
}

/**
 * localStorage から読み込んだ不明なデータを安全な GiftInventory にサニタイズする純粋関数
 * 壊れたデータや古いバージョンからのデータでも安全に復帰します
 */
export function sanitizeGiftInventory(raw: unknown): GiftInventory {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const result: GiftInventory = {};
  const obj = raw as Record<string, unknown>;

  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const rec = val as Record<string, unknown>;
      const count = typeof rec.count === 'number' && Number.isFinite(rec.count) ? Math.max(0, rec.count) : 0;
      const firstReceivedAt =
        typeof rec.firstReceivedAt === 'number' && Number.isFinite(rec.firstReceivedAt)
          ? rec.firstReceivedAt
          : Date.now();
      const lastReceivedAt =
        typeof rec.lastReceivedAt === 'number' && Number.isFinite(rec.lastReceivedAt)
          ? rec.lastReceivedAt
          : firstReceivedAt;

      const byCat: Partial<Record<CatId, number>> = {};
      if (rec.byCat && typeof rec.byCat === 'object' && !Array.isArray(rec.byCat)) {
        for (const [cId, cCount] of Object.entries(rec.byCat as Record<string, unknown>)) {
          if (typeof cCount === 'number' && Number.isFinite(cCount)) {
            byCat[cId as CatId] = Math.max(0, cCount);
          }
        }
      }

      result[key] = {
        giftId: key,
        count,
        byCat,
        firstReceivedAt,
        lastReceivedAt,
      };
    }
  }

  return result;
}

/**
 * レアリティごとの表示定義（ラベル・バッジスタイル）
 * 今後新しいレアリティが増加した場合もここに追加または動的フォールバックで対応可能
 */
export interface GiftRarityMeta {
  id: string;
  label: string;
  shortLabel: string;
  badgeClass: string;
}

export const GIFT_RARITY_METAS: Record<string, GiftRarityMeta> = {
  common: {
    id: 'common',
    label: '通常',
    shortLabel: 'C',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  },
  rare: {
    id: 'rare',
    label: 'レア',
    shortLabel: 'R',
    badgeClass: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300',
  },
  'super-rare': {
    id: 'super-rare',
    label: 'スーパーレア',
    shortLabel: 'SR',
    badgeClass: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-300',
  },
  'ultra-rare': {
    id: 'ultra-rare',
    label: 'ウルトラレア',
    shortLabel: 'UR',
    badgeClass: 'bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 text-rose-900 border-rose-300',
  },
};

/**
 * レアリティの日本語表示名を取得する純粋関数
 * 未登録の新しいレアリティが来た場合でもフォールバックして安全に表示します
 */
export function getGiftRarityLabel(rarity?: string): string {
  if (!rarity) return '通常';
  return GIFT_RARITY_METAS[rarity]?.label ?? rarity;
}

/**
 * レアリティの短縮表示記号（C, R, SR, UR）を取得する純粋関数
 * 絞り込みタブなどの省スペース・すっきりとした表示用
 */
export function getGiftRarityShortLabel(rarity?: string): string {
  if (!rarity) return 'C';
  return GIFT_RARITY_METAS[rarity]?.shortLabel ?? rarity;
}

/**
 * カタログ内に含まれるユニークなレアリティ一覧を標準の表示順で取得する純粋関数
 * 今後新しいレアリティがカタログに追加された場合でも自動的に抽出されます
 */
export function getAvailableRarities(
  catalog: readonly GiftItem[] = CAT_GIFTS
): string[] {
  const seen = new Set<string>();
  const rarities: string[] = [];

  for (const item of catalog) {
    const r = item.rarity ?? 'common';
    if (!seen.has(r)) {
      seen.add(r);
      rarities.push(r);
    }
  }

  // 優先順位（common -> rare -> super-rare -> ultra-rare -> その他登録順）
  const orderMap: Record<string, number> = {
    common: 0,
    rare: 1,
    'super-rare': 2,
    'ultra-rare': 3,
  };
  return rarities.sort((a, b) => {
    const orderA = orderMap[a] ?? 99;
    const orderB = orderMap[b] ?? 99;
    return orderA - orderB;
  });
}

export interface FilterGiftsOptions {
  /** レアリティ絞り込み（'all' または各レアリティ文字列） */
  rarity?: string;
  /** 入手状況絞り込み（'all': すべて, 'acquired': 入手済みのみ） */
  acquisition?: GiftAcquisitionFilter;
}

/**
 * レアリティと入手状況に基づいておくりものカタログを絞り込む純粋関数
 */
export function filterGifts(
  catalog: readonly GiftItem[],
  inventory: GiftInventory,
  options: FilterGiftsOptions = {}
): GiftItem[] {
  const { rarity = 'all', acquisition = 'all' } = options;
  return catalog.filter((item) => {
    // レアリティ判定
    if (rarity !== 'all' && (item.rarity ?? 'common') !== rarity) {
      return false;
    }
    // 入手状況判定
    if (acquisition === 'acquired') {
      const count = inventory[item.id]?.count ?? 0;
      if (count <= 0) return false;
    }
    return true;
  });
}

