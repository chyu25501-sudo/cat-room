import { GiftId, GiftItem, GiftRecord, GiftInventory, GiftRarity } from '../types/gift.ts';
import { CatId } from '../types/cat.ts';

/**
 * 猫から貰えるおくりもののマスターデータリスト
 * 今後贈り物を増やす際はこの配列に追加するだけで拡張可能です。
 */
export const CAT_GIFTS: readonly GiftItem[] = [
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
    id: 'feather',
    name: 'ふわふわの羽根',
    description: '日向で見つけてくわえてきた、やわらかく軽やかな羽根。',
    icon: '🪶',
    iconType: 'feather',
    themeClass: 'from-sky-100 to-indigo-100 border-sky-300 text-sky-700',
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
    id: 'ribbon',
    name: 'ながいリボン',
    description: '部屋のすみに落ちていた、さらさらと光沢のある細長いリボン。',
    icon: '🎀',
    iconType: 'ribbon',
    themeClass: 'from-pink-100 to-fuchsia-100 border-pink-300 text-pink-700',
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
    id: 'mossy-pebble',
    name: 'こけむした小石',
    description: '湿った日陰で見つけてきた、うっすらと緑の苔が生えた丸い小石。',
    icon: '🪨',
    iconType: 'mossy-pebble',
    themeClass: 'from-emerald-100 to-stone-200 border-emerald-300 text-stone-700',
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
    id: 'wilted-flower',
    name: 'しおれた野花',
    description: '道端から摘んできた、少し首をかしげてしおれた素朴で小さなお花。',
    icon: '🥀',
    iconType: 'wilted-flower',
    themeClass: 'from-amber-100 to-yellow-100 border-yellow-300 text-amber-800',
    rarity: 'common',
  },
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
    id: 'white-dice',
    name: 'しろいサイコロ',
    description: '箱のすき間から転がり出てきた、角の取れたつるつると白いサイコロ。',
    icon: '🎲',
    iconType: 'white-dice',
    themeClass: 'from-slate-100 to-stone-100 border-stone-300 text-stone-800',
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
    id: 'dirty-plush',
    name: 'よごれたぬいぐるみ',
    description: 'ずっとくわえて遊んでいたのか、少し土がついて愛着のわく小さなぬいぐるみ。',
    icon: '🧸',
    iconType: 'dirty-plush',
    themeClass: 'from-amber-100 to-stone-200 border-amber-300 text-amber-900',
    rarity: 'common',
  },
  {
    id: 'single-sock',
    name: 'かたっぽの靴下',
    description: '洗濯カゴから引っ張り出してきた、しましま模様の片方だけの小さな靴下。',
    icon: '🧦',
    iconType: 'single-sock',
    themeClass: 'from-indigo-100 to-sky-100 border-indigo-300 text-indigo-700',
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
    id: 'important-paper',
    name: 'だいじそうな紙',
    description: 'よくわからないが請求書と書かれている。',
    icon: '📄',
    iconType: 'important-paper',
    themeClass: 'from-amber-100 to-yellow-200 border-amber-400 text-amber-950',
    rarity: 'rare',
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
    id: 'candy-wrapper',
    name: 'おかしの包み紙',
    description: '両端がキュッとねじられた、きらきらと光るキャンディの包み紙。',
    icon: '🍬',
    iconType: 'candy-wrapper',
    themeClass: 'from-purple-100 to-pink-100 border-purple-300 text-purple-700',
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
    id: 'super-ball',
    name: 'みどりのスーパーボール',
    description: 'フローリングの上でよく弾む、鮮やかな緑色のゴム製スーパーボール。',
    icon: '🟢',
    iconType: 'super-ball',
    themeClass: 'from-lime-100 to-emerald-200 border-emerald-400 text-emerald-800',
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
    id: 'broken-rubber-band',
    name: 'ちぎれた輪ゴム',
    description: '引っ張って遊んでいるうちにプチッとちぎれた、少し伸びきった茶色い輪ゴム。',
    icon: '➰',
    iconType: 'broken-rubber-band',
    themeClass: 'from-amber-100 to-yellow-100 border-amber-300 text-amber-800',
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
    id: 'cat-whisker',
    name: 'ぬけたじぶんのヒゲ',
    description: '掃除中に見つかることの多い、ピンと白くて縁起が良いとされる猫自身の抜け落ちたヒゲ。',
    icon: '🪄',
    iconType: 'cat-whisker',
    themeClass: 'from-stone-50 to-slate-100 border-stone-200 text-stone-700',
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
    id: 'hairball',
    name: 'まるまった毛玉',
    description: 'ブラッシングのあとや毛づくろいの抜け毛が丸まった、手のひらサイズのふわっと軽い毛玉。',
    icon: '🧶',
    iconType: 'hairball',
    themeClass: 'from-stone-100 to-neutral-200 border-stone-300 text-stone-700',
    rarity: 'common',
  },
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
    id: 'withered-foxtail',
    name: 'かれたねこじゃらし草',
    description: '道端から根元ごとくわえてきた、秋風に吹かれて穂がカサカサに乾いたエノコログサ。',
    icon: '🌾',
    iconType: 'withered-foxtail',
    themeClass: 'from-yellow-100 to-amber-100 border-amber-300 text-amber-800',
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
    id: 'lizard-tail',
    name: 'ちいさなトカゲのしっぽ',
    description: '庭先で自切したトカゲから譲り受けた（？）のか、まだかすかにピクピクしている青い尾。',
    icon: '🦎',
    iconType: 'lizard-tail',
    themeClass: 'from-sky-100 to-teal-100 border-cyan-300 text-teal-800',
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
    id: 'jelly-cup',
    name: 'あいたゼリーのカップ',
    description: '甘い果汁の香りに惹かれて転がしてきた、きれいに洗われた小さな透明プラスチックカップ。',
    icon: '🍧',
    iconType: 'jelly-cup',
    themeClass: 'from-cyan-50 to-emerald-50 border-cyan-200 text-cyan-800',
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
    id: 'cicada-wing',
    name: 'かわいた蝉の羽',
    description: 'ベランダのすみに落ちていた、ステンドグラスのように透明な翅脈の美しい蝉のはね。',
    icon: '🪽',
    iconType: 'cicada-wing',
    themeClass: 'from-stone-100 to-amber-50 border-amber-200 text-amber-900',
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
    id: 'old-coin',
    name: 'ふしぎな古銭',
    description: 'どこかの古い蔵や床下で見つけてきたのか、不思議な文字が刻まれた丸い古銭。',
    icon: '🪙',
    iconType: 'old-coin',
    themeClass: 'from-amber-200 to-yellow-300 border-amber-400 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'rainbow-feather',
    name: 'なないろの羽根',
    description: '光に透かすと虹色にきらめく、伝説の鳥が落としていったような奇跡の羽根。',
    icon: '🪶',
    iconType: 'rainbow-feather',
    themeClass: 'from-pink-200 via-sky-200 to-amber-200 border-purple-300 text-purple-900',
    rarity: 'rare',
  },
  {
    id: 'four-leaf-clover',
    name: 'よつばのクローバー',
    description: '草むらの中で奇跡的に見つけた、特別な幸運をもたらす四つ葉のクローバー。',
    icon: '🍀',
    iconType: 'four-leaf-clover',
    themeClass: 'from-emerald-200 to-green-300 border-emerald-400 text-emerald-900',
    rarity: 'rare',
  },
  {
    id: 'red-gem',
    name: 'あかいろの宝石',
    description: '深紅に輝くカットが美しい、どこかの宝飾品から落ちたような小さな赤い宝石。',
    icon: '💎',
    iconType: 'red-gem',
    themeClass: 'from-red-200 via-rose-200 to-amber-200 border-red-400 text-red-900',
    rarity: 'rare',
  },
  {
    id: 'blue-gem',
    name: 'あおいろの宝石',
    description: '夜空や深い海を閉じ込めたように澄み渡る、吸い込まれそうな青い宝石。',
    icon: '💎',
    iconType: 'blue-gem',
    themeClass: 'from-blue-200 via-sky-200 to-indigo-200 border-blue-400 text-blue-900',
    rarity: 'rare',
  },
  {
    id: 'yellow-gem',
    name: 'きいろの宝石',
    description: '陽だまりの光を閉じ込めたように明るくきらめく、黄金色に澄んだ黄色い宝石。',
    icon: '💎',
    iconType: 'yellow-gem',
    themeClass: 'from-amber-200 via-yellow-200 to-amber-300 border-yellow-400 text-amber-900',
    rarity: 'rare',
  },
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
    id: 'dragon-scale',
    name: 'りゅうの鱗',
    description: '伝説のドラゴンから剥がれ落ちたと伝わる、虹色に光る硬質で神聖なウロコ。',
    icon: '🐉',
    iconType: 'dragon-scale',
    themeClass: 'from-emerald-200 via-teal-200 to-cyan-300 border-teal-400 text-emerald-950',
    rarity: 'rare',
  },
  {
    id: 'dragon-claw',
    name: 'りゅうの爪',
    description: '鋼よりも鋭く湾曲した、古のドラゴンが残したとされる神秘的な黒金の爪。',
    icon: '🐉',
    iconType: 'dragon-claw',
    themeClass: 'from-stone-300 via-amber-200 to-yellow-300 border-amber-500 text-amber-950',
    rarity: 'rare',
  },
  {
    id: 'star-fragment',
    name: 'ほしのかけら',
    description: '夜空から落ちてきた流れ星の欠片。手のひらで淡く温かく明滅している。',
    icon: '⭐',
    iconType: 'star-fragment',
    themeClass: 'from-yellow-200 via-amber-200 to-indigo-200 border-yellow-400 text-amber-900',
    rarity: 'rare',
  },
  {
    id: 'ancient-gear',
    name: 'いにしえの歯車',
    description: '古代の高度な文明で作られたと思われる、決して錆びることのない真鍮の精密な歯車。',
    icon: '⚙️',
    iconType: 'ancient-gear',
    themeClass: 'from-amber-200 via-stone-200 to-yellow-300 border-amber-500 text-amber-950',
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
    id: 'curious-magatama',
    name: 'きみょうな勾玉',
    description: '翡翠のように淡く緑色に透き通る、古い儀式で使われていたような形の不思議な勾玉。',
    icon: '📿',
    iconType: 'curious-magatama',
    themeClass: 'from-emerald-200 via-teal-100 to-cyan-200 border-emerald-400 text-teal-900',
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

/** レアアイテムの抽選重み（通常の1/5の確率、出にくく希少） */
export const DEFAULT_RARE_GIFT_WEIGHT = 2;

/**
 * ギフトの抽選確率計算用重みを取得する純粋関数
 */
export function getGiftWeight(gift: GiftItem): number {
  if (typeof gift.weight === 'number' && gift.weight > 0) {
    return gift.weight;
  }
  return gift.rarity === 'rare' ? DEFAULT_RARE_GIFT_WEIGHT : DEFAULT_COMMON_GIFT_WEIGHT;
}

/**
 * ギフトのレアリティに応じたアイコン背景Tailwindクラスを返す純粋関数
 * レアリティの高いおくりものは金色、通常のおくりものは白色
 */
export function getGiftIconBgClass(rarity?: GiftRarity): string {
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
