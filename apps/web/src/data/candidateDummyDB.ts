// spec: specs/002-candidate-extraction.md § Internal Design
// 架空個人情報のみ使用。fetchCandidates() は v1 でAPIに差し替え想定。

import type { CandidateRecord } from "../types/candidates";

export const DUMMY_CANDIDATES: CandidateRecord[] = [
  {
    id: "c001",
    name: "佐藤 健一",
    company: "株式会社テックスタート",
    role: "代表取締役CEO",
    industry: "IT・SaaS",
    relationship: "友人・元同僚",
    lastContact: "2026-05-20",
    strength: "SaaSプロダクト立ち上げ経験豊富。投資家ネットワーク強い。",
  },
  {
    id: "c002",
    name: "田中 美咲",
    company: "グロースキャピタル合同会社",
    role: "パートナー",
    industry: "VC・投資",
    relationship: "既存取引先",
    lastContact: "2026-06-01",
    strength: "スタートアップ向けシードラウンドに強み。",
  },
  {
    id: "c003",
    name: "山本 大輔",
    company: "株式会社DXソリューションズ",
    role: "事業開発部長",
    industry: "製造業DX",
    relationship: "過去面識あり",
    lastContact: "2025-11-15",
    strength: "製造業のDX推進で実績。中部地区に強い。",
  },
  {
    id: "c004",
    name: "鈴木 彩",
    company: "フューチャーセールス株式会社",
    role: "営業本部長",
    industry: "法人営業・SaaS",
    relationship: "友人・元同僚",
    lastContact: "2026-04-10",
    strength: "地方SaaS導入実績100社以上。",
  },
  {
    id: "c005",
    name: "中村 浩二",
    company: "株式会社アライアンスパートナーズ",
    role: "代表取締役",
    industry: "コンサルティング",
    relationship: "要新規開拓",
    lastContact: "なし",
    strength: "中小企業向け経営コンサルに強み。関西圏に人脈。",
  },
  {
    id: "c006",
    name: "林 智子",
    company: "イノベーションベンチャーズ株式会社",
    role: "投資担当マネージャー",
    industry: "VC・投資",
    relationship: "既存取引先",
    lastContact: "2026-05-30",
    strength: "B2Bスタートアップ専門。東京・大阪両方に強い。",
  },
  {
    id: "c007",
    name: "渡辺 誠",
    company: "東海製造テック株式会社",
    role: "DX推進室長",
    industry: "製造業DX",
    relationship: "過去面識あり",
    lastContact: "2025-09-20",
    strength: "愛知県製造業への導入実績。製造現場のDX推進リーダー。",
  },
  {
    id: "c008",
    name: "小林 奈々",
    company: "株式会社ネクストグロース",
    role: "事業開発マネージャー",
    industry: "IT・SaaS",
    relationship: "要新規開拓",
    lastContact: "なし",
    strength: "SaaS営業とパートナー開拓が得意。九州エリアに注力中。",
  },
];

/** 非同期インターフェース（v1でAPI差し替え想定） */
export async function fetchCandidates(): Promise<CandidateRecord[]> {
  return Promise.resolve(DUMMY_CANDIDATES);
}
