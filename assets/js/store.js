// store.js - JSONをfetch。失敗時はdefaultDataにフォールバック。sessionStorageで簡易キャッシュ

const KEY = (p) => `cache:${p}`;

export async function loadJSON(path, fallback){
  try{
    const cached = sessionStorage.getItem(KEY(path));
    if (cached) return JSON.parse(cached);
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    sessionStorage.setItem(KEY(path), JSON.stringify(json));
    return json;
  }catch(err){
    // file:// や CORS で失敗したら fallback を返す
    console.warn('loadJSON fallback for', path, err);
    if (fallback) return fallback;
    return [];
  }
}

// default data (編集ポイント: 必要に応じて更新)
const defaultData = {
  usecases: [
    {
      id: 1,
      title: '検索の代わりにAIへ一次質問',
      category: '情報収集', time: 3, difficulty: 'easy',
      purpose: '初動を早くし、的外れな探索を避ける',
      tags: ['リサーチ','要約','初動'], popularity: 95,
      kpis: ['初動までの時間','参考リンク数'],
      materials: ['簡単な背景情報','聞きたい観点'],
      steps: ['背景・目的・制約をまとめる','一次質問を投げる','必要に応じて深掘りを依頼'],
      prompt: 'あなたは専門家アシスタントです。背景:<<背景>> 目的:<<目的>> 制約:<<制約>>\nまず3つの仮説と確認質問5つ、調査の初手を提示してください。',
      notes: '判断根拠や出典が必要な場合は明示依頼する',
    },
    {
      id: 2,
      title: '箇条書き→ビジネスメール化',
      category: '文章作成', time: 5, difficulty: 'easy',
      purpose: '素早く丁寧な文面に整える',
      tags: ['メール','整形','トーン'], popularity: 88,
      kpis: ['作成時間','返信率'],
      materials: ['箇条書きの用件','宛先の関係性'],
      steps: ['用件を箇条書きで列挙','宛先/目的/締切を明記','AIでビジネスメールへ整形'],
      prompt: '以下の箇条書きを「森合」の署名付きの丁寧なビジネスメールに整えてください。\n前提: 宛先との関係性=<<関係性>> 口調=簡潔丁寧\n箇条書き:\n- <<項目1>>\n- <<項目2>>',
    },
    {
      id: 3,
      title: '画像解析（機器パネル/配線/書類OCR）',
      category: '画像解析', time: 7, difficulty: 'medium',
      purpose: '現場の判断を早める',
      tags: ['OCR','配線','安全'], popularity: 75,
      kpis: ['読み取り精度','対応スピード'],
      materials: ['鮮明な写真','撮影条件'],
      steps: ['写真を撮る','目的（何を知りたいか）を添える','結果の確度と注意点を求める'],
      prompt: '画像に含まれる記号・文字・配線の状態を説明し、誤認の可能性がある箇所を列挙してください。',
    },
    {
      id: 4,
      title: '商談提案骨子＋コスト試算',
      category: '商談準備', time: 15, difficulty: 'medium',
      purpose: '短時間で骨子を作り、概算も添える',
      tags: ['提案','試算','見積'], popularity: 82,
      kpis: ['骨子作成時間','承認率'],
      materials: ['顧客課題','効果試算の前提'],
      steps: ['顧客情報を整理','提案骨子を出力','端数処理のルールを指示して再計算'],
      prompt: '課題:<<課題>> 目標:<<目標>> 制約:<<制約>>\n提案骨子(見出し/要点/効果指標)と概算コストを試算。端数処理は<<切上/切捨/四捨五入>>で。',
    },
    {
      id: 5,
      title: '出品説明文＋相場推定',
      category: '販促', time: 12, difficulty: 'medium',
      purpose: '魅力的で正直な説明と相場感を得る',
      tags: ['EC','ライティング','価格'], popularity: 70,
      kpis: ['出品作成時間','CTR'],
      materials: ['商品の仕様/状態','写真/相場情報'],
      steps: ['仕様を箇条書き','利点と注意点を分ける','相場データの要約を添える'],
      prompt: '以下の仕様で出品説明文と相場レンジを提示。注意点も明記。仕様: <<仕様>>',
    }
  ],
  templates: [
    { id: 't1', title:'メール: 要件整理→丁寧文', type:'メール', popularity:90, body: '【宛先】\n<<宛名>> 様\n\n【用件】\n<<用件要約>>\n\n【詳細】\n<<詳細>>\n\n【お願い・期限】\n<<お願い>>（期限: <<期限>>）\n\n——\n森合\n<<署名フッター>>' },
    { id: 't2', title:'提案骨子: 問題/解決/効果', type:'提案骨子', popularity:80, body: '1. 背景/問題\n- <<背景>>\n\n2. 解決アイデア\n- <<解決案>>\n\n3. 効果/指標\n- <<期待効果>>' },
    { id: 't3', title:'OCR: 表形式抽出', type:'OCR', popularity:70, body: '次の画像から表を抽出。列: <<列名>>。欠損や不確実箇所は? を付ける。' },
    { id: 't4', title:'画像解析: 異常検知メモ', type:'画像解析', popularity:60, body: '対象: <<対象>>\n正常状態: <<正常>>\n観測: <<観測>>\n懸念: <<懸念>>\n確認手順: <<手順>>' },
    { id: 't5', title:'相場調査: 検索クエリと条件', type:'相場調査', popularity:65, body: '商品: <<商品>>\n条件:<<新品/中古/付属>>\n期間: <<期間>>\n価格帯: <<幅>>\n提示: 中央値/最頻値/件数' }
  ],
  faq: [
    { q:'機密情報は入力してよいですか？', a:'社外秘・個人情報は匿名化やダミー化の上で扱い、取り扱い基準に従ってください。' },
    { q:'権利関係は？', a:'第三者の著作物の転載は避け、出典や引用範囲を明確にしましょう。' },
    { q:'精度はどれくらい？', a:'目的に応じて再現性の高い手順を整備し、出力は必ず人が確認します。' },
    { q:'社内ポリシーは？', a:'当サイトの「セキュリティとガバナンス」を参照ください。' },
    { q:'モデル差異の注意点は？', a:'最新のモデル事情を確認し、ファクトが必要な場合は出典を求めます。' },
    { q:'禁止事項は？', a:'個人攻撃・差別・虚偽の広報など不適切用途は禁止です。' }
  ],
  blog: [
    { id:'b1', title:'業務AIレシピの始め方', date:'2025-01-01', read:3, tags:['導入','文化'], html:'<p>小さく試し、勝ちパターンを共有するところから始めましょう。</p>' }
  ]
};

export function getUsecases(){
  return loadJSON('./data/usecases.json', defaultData.usecases);
}
export function getTemplates(){
  return loadJSON('./data/templates.json', defaultData.templates);
}
export function getFAQ(){
  return loadJSON('./data/faq.json', defaultData.faq);
}
export function getBlog(){
  return loadJSON('./data/blog.json', defaultData.blog);
}

