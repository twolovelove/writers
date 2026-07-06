import type { Category, WritingPrompt } from '../types'

// 카테고리별 글감 목데이터.
// 실제 서비스에서는 이 배열을 AI 추천 API 응답으로 교체하면 된다.
export const PROMPTS: WritingPrompt[] = [
  // 에세이
  {
    id: 'essay-1',
    category: '에세이',
    title: '오늘 아침, 가장 먼저 떠오른 생각',
    description:
      '눈을 뜨고 나서 가장 먼저 머릿속을 스친 장면이나 감정을 붙잡아 글로 옮겨보세요. 사소할수록 좋습니다.',
  },
  {
    id: 'essay-2',
    category: '에세이',
    title: '최근에 나를 웃게 한 사소한 순간',
    description: '거창하지 않아도 괜찮습니다. 하루 중 입꼬리가 올라갔던 짧은 순간을 떠올려 적어보세요.',
  },
  {
    id: 'essay-3',
    category: '에세이',
    title: '내가 유독 애착을 느끼는 물건',
    description: '오래 곁에 둔 물건 하나를 골라, 그것과 얽힌 기억과 감정을 풀어내 보세요.',
  },
  {
    id: 'essay-4',
    category: '에세이',
    title: '요즘 자주 듣는 말, 그리고 그에 대한 생각',
    description: '주변에서 자주 듣는 말이나 조언이 있다면, 그것에 대한 솔직한 생각을 적어보세요.',
  },
  {
    id: 'essay-5',
    category: '에세이',
    title: '혼자 보내는 시간의 의미',
    description: '혼자 있을 때 무엇을 하는지, 그 시간이 내게 어떤 의미인지 천천히 적어보세요.',
  },
  {
    id: 'essay-6',
    category: '에세이',
    title: '계절이 바뀌는 걸 알아챈 순간',
    description: '공기, 냄새, 빛의 각도 등 계절의 변화를 느낀 구체적인 장면을 묘사해보세요.',
  },
  {
    id: 'essay-7',
    category: '에세이',
    title: '오늘 하루 중 가장 느렸던 순간',
    description: '바쁜 하루 속에서도 유독 시간이 천천히 흐르듯 느껴졌던 순간을 떠올려보세요.',
  },
  {
    id: 'essay-8',
    category: '에세이',
    title: '나에게 위로가 되는 습관',
    description: '지치거나 힘들 때 나도 모르게 하게 되는 작은 습관에 대해 적어보세요.',
  },
  {
    id: 'essay-9',
    category: '에세이',
    title: '오늘 걸었던 길에서 눈에 들어온 것',
    description: '출퇴근길, 산책길 등 익숙한 길 위에서 오늘따라 눈에 밟힌 장면 하나를 묘사해보세요.',
  },
  {
    id: 'essay-10',
    category: '에세이',
    title: '누군가에게 하지 못한 말',
    description: '전하고 싶었지만 끝내 삼킨 말이 있다면, 이 글에서만큼은 솔직하게 적어보세요.',
  },
  {
    id: 'essay-11',
    category: '에세이',
    title: '내 방(혹은 책상)이 말해주는 것',
    description: '지금 머무는 공간을 천천히 둘러보며, 그 공간이 담고 있는 나의 모습을 적어보세요.',
  },
  {
    id: 'essay-12',
    category: '에세이',
    title: '오늘 나를 조금 지치게 한 것',
    description: '거창한 사건이 아니어도 괜찮습니다. 오늘 마음을 살짝 무겁게 한 순간을 들여다보세요.',
  },

  // 상상/소설
  {
    id: 'fiction-1',
    category: '상상/소설',
    title: '문을 열자 어제의 내가 서 있었다',
    description: '이 한 문장으로 시작하는 짧은 이야기를 자유롭게 이어가 보세요.',
  },
  {
    id: 'fiction-2',
    category: '상상/소설',
    title: '도시 전체가 하루 동안 소리를 잃는다면',
    description: '소리가 사라진 세계에서 벌어지는 하루를 상상하며 이야기를 만들어보세요.',
  },
  {
    id: 'fiction-3',
    category: '상상/소설',
    title: '마지막 편지를 쓰는 사람',
    description: '누군가에게 마지막이 될 편지를 쓰는 인물의 심정과 상황을 소설처럼 그려보세요.',
  },
  {
    id: 'fiction-4',
    category: '상상/소설',
    title: '거울 속 세상에는 나 대신 다른 사람이 산다',
    description: '거울 너머의 또 다른 삶을 상상하며 그 인물의 하루를 묘사해보세요.',
  },
  {
    id: 'fiction-5',
    category: '상상/소설',
    title: '10년 후, 낯선 도시에서 받은 소포',
    description: '예상치 못한 소포 하나로 시작되는 이야기를 자유롭게 풀어보세요.',
  },
  {
    id: 'fiction-6',
    category: '상상/소설',
    title: '비 오는 날에만 열리는 가게',
    description: '비가 오는 날에만 문을 여는 신비한 가게와 그곳을 찾은 손님의 이야기를 상상해보세요.',
  },
  {
    id: 'fiction-7',
    category: '상상/소설',
    title: '기억을 하나씩 팔아야 살아갈 수 있는 세계',
    description: '기억이 화폐가 되는 세계관 속 한 인물의 선택을 이야기로 그려보세요.',
  },
  {
    id: 'fiction-8',
    category: '상상/소설',
    title: '나이를 거꾸로 먹는 이웃',
    description: '점점 어려지는 이웃을 지켜보는 화자의 시선으로 짧은 이야기를 써보세요.',
  },
  {
    id: 'fiction-9',
    category: '상상/소설',
    title: '하루에 한 가지 거짓말만 할 수 있는 마을',
    description: '거짓말의 총량이 정해진 마을에서 벌어지는 사건을 상상하며 이야기를 만들어보세요.',
  },
  {
    id: 'fiction-10',
    category: '상상/소설',
    title: '엘리베이터가 멈춘 층에만 있는 세계',
    description: '평소엔 가본 적 없는 층에서 문이 열렸을 때 펼쳐지는 낯선 이야기를 그려보세요.',
  },
  {
    id: 'fiction-11',
    category: '상상/소설',
    title: '나를 꼭 닮은 로봇이 배달되었다',
    description: '어느 날 집 앞에 도착한, 나를 그대로 복제한 로봇을 둘러싼 하루를 상상해보세요.',
  },
  {
    id: 'fiction-12',
    category: '상상/소설',
    title: '사라진 계절을 찾아 떠나는 여행자',
    description: '지구에서 겨울이 사라진 세계, 마지막 겨울을 찾아 떠나는 인물의 이야기를 써보세요.',
  },

  // 자기계발
  {
    id: 'growth-1',
    category: '자기계발',
    title: '최근에 미뤄온 일, 그 이유는 무엇일까',
    description: '자꾸 미루게 되는 일 하나를 떠올리고, 그 이면의 진짜 이유를 파고들어 보세요.',
  },
  {
    id: 'growth-2',
    category: '자기계발',
    title: '올해 나에게 가장 중요한 질문 하나',
    description: '지금 나의 삶에서 가장 답을 찾고 싶은 질문을 적고, 스스로 답을 시도해보세요.',
  },
  {
    id: 'growth-3',
    category: '자기계발',
    title: '실패했지만 배운 것이 있었던 경험',
    description: '뜻대로 되지 않았던 일 중 돌아보니 의미가 있었던 경험을 정리해보세요.',
  },
  {
    id: 'growth-4',
    category: '자기계발',
    title: '내가 시간을 쓰는 방식, 그리고 원하는 방식',
    description: '실제 하루의 시간 사용과 이상적으로 바라는 시간 사용을 비교해 적어보세요.',
  },
  {
    id: 'growth-5',
    category: '자기계발',
    title: '나를 성장시킨 뜻밖의 조언',
    description: '예상치 못한 순간에 들었던 조언이 어떻게 나를 바꾸었는지 적어보세요.',
  },
  {
    id: 'growth-6',
    category: '자기계발',
    title: '완벽하지 않아도 시작해야 하는 이유',
    description: '완벽주의 때문에 시작을 미룬 경험과, 그럼에도 시작해야 하는 이유를 정리해보세요.',
  },
  {
    id: 'growth-7',
    category: '자기계발',
    title: '지금의 나에게 해주고 싶은 조언',
    description: '1년 전의 나, 혹은 1년 후의 나가 되어 지금의 나에게 해주고 싶은 말을 적어보세요.',
  },
  {
    id: 'growth-8',
    category: '자기계발',
    title: '작은 목표를 꾸준히 지켜낸 경험',
    description: '거창하지 않아도 꾸준히 해낸 습관이나 목표에 대해 그 과정을 돌아보세요.',
  },
  {
    id: 'growth-9',
    category: '자기계발',
    title: '최근 거절해본 경험, 혹은 거절하지 못한 경험',
    description: '거절의 순간을 되짚어보며 그때의 감정과 배운 점을 정리해보세요.',
  },
  {
    id: 'growth-10',
    category: '자기계발',
    title: '나를 지치게 하는 관계, 채워주는 관계',
    description: '주변 관계들을 떠올리며 에너지를 빼앗는 관계와 채워주는 관계를 구분해보세요.',
  },
  {
    id: 'growth-11',
    category: '자기계발',
    title: '돈을 대하는 나만의 기준',
    description: '소비와 저축에 대한 나의 습관과 태도를 돌아보고 바꾸고 싶은 부분을 적어보세요.',
  },
  {
    id: 'growth-12',
    category: '자기계발',
    title: '오늘 하루, 나에게 준 작은 보상',
    description: '스스로를 다독이기 위해 오늘 실천했거나 실천하고 싶은 작은 보상을 적어보세요.',
  },

  // 비평
  {
    id: 'critic-1',
    category: '비평',
    title: '최근 인상 깊게 본 작품에 대한 나의 평가',
    description: '영화, 책, 전시 등 최근 접한 작품 하나를 골라 나만의 시각으로 비평해보세요.',
  },
  {
    id: 'critic-2',
    category: '비평',
    title: '요즘 사람들이 당연하게 여기는 것에 대한 반론',
    description: '사회적으로 널리 받아들여지는 통념 하나를 골라 반대 논리를 세워보세요.',
  },
  {
    id: 'critic-3',
    category: '비평',
    title: '편리함과 맞바꾼 것들',
    description: '기술이나 서비스가 가져온 편리함 이면에 우리가 잃은 것은 무엇인지 분석해보세요.',
  },
  {
    id: 'critic-4',
    category: '비평',
    title: '유행하는 콘텐츠가 인기 있는 진짜 이유',
    description: '최근 화제가 된 콘텐츠 하나를 골라, 그 인기의 구조를 비판적으로 분석해보세요.',
  },
  {
    id: 'critic-5',
    category: '비평',
    title: '좋은 의도가 만든 나쁜 결과',
    description: '선의로 시작된 정책이나 캠페인이 의도와 다른 결과를 낳은 사례를 비평해보세요.',
  },
  {
    id: 'critic-6',
    category: '비평',
    title: '내가 동의할 수 없는 유명한 명언',
    description: '흔히 옳다고 여겨지는 명언이나 격언 하나를 골라 그 한계를 짚어보세요.',
  },
  {
    id: 'critic-7',
    category: '비평',
    title: '숫자로는 설명되지 않는 것들',
    description: '데이터나 지표만으로 평가하기 어려운 가치에 대해 비판적으로 서술해보세요.',
  },
  {
    id: 'critic-8',
    category: '비평',
    title: '온라인에서의 나와 오프라인에서의 나',
    description: '온라인 자아와 실제 자아의 간극을 관찰하고 그 의미를 비평적으로 풀어보세요.',
  },
  {
    id: 'critic-9',
    category: '비평',
    title: '효율이라는 말이 가려버린 것들',
    description: '효율성을 최우선 가치로 내세우는 흐름이 놓치고 있는 지점을 비평해보세요.',
  },
  {
    id: 'critic-10',
    category: '비평',
    title: '모두가 옳다고 박수치는 순간을 의심해보기',
    description: '많은 사람이 동의하는 주장이나 트렌드 하나를 골라 비판적 거리를 두고 살펴보세요.',
  },
  {
    id: 'critic-11',
    category: '비평',
    title: '알고리즘이 나 대신 고른 것들',
    description: '추천 시스템이 만들어준 선택들을 돌아보며 그 이면의 구조를 분석해보세요.',
  },
  {
    id: 'critic-12',
    category: '비평',
    title: '오래된 것이 낡았다고 말할 수 있을까',
    description: '새로움을 무조건 우위에 두는 시선에 반론을 제기하며 비평해보세요.',
  },

  // 자유주제
  {
    id: 'free-1',
    category: '자유주제',
    title: '오늘은 정해진 주제 없이',
    description: '형식도, 소재도 자유입니다. 지금 머릿속에 떠오르는 것부터 편하게 적어보세요.',
  },
  {
    id: 'free-2',
    category: '자유주제',
    title: '손 가는 대로 써보는 하루',
    description: '문장이 어디로 향하든 괜찮습니다. 생각을 검열하지 말고 흘러가는 대로 적어보세요.',
  },
  {
    id: 'free-3',
    category: '자유주제',
    title: '오늘의 낙서장',
    description: '메모, 단상, 반쯤 완성된 생각도 좋습니다. 완결된 글이 아니어도 괜찮아요.',
  },
  {
    id: 'free-4',
    category: '자유주제',
    title: '평소 써보고 싶었던 이야기',
    description: '다른 카테고리에 갇히지 않고, 예전부터 쓰고 싶었던 그 이야기를 오늘 시작해보세요.',
  },
  {
    id: 'free-5',
    category: '자유주제',
    title: '지금 이 순간의 기록',
    description: '지금 있는 장소, 소리, 온도, 기분을 그대로 옮겨 적어보는 것만으로도 충분합니다.',
  },
  {
    id: 'free-6',
    category: '자유주제',
    title: '주제 없이, 리듬만 따라가기',
    description: '한 단어에서 시작해 연상되는 대로 문장을 이어가 보세요. 어디로 가든 오늘의 글입니다.',
  },
]

// 하루의 날짜를 연중 일수(day-of-year)로 변환해, 날짜별로 다른 글감이 노출되도록 함
function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// 날짜(date) + 카테고리 조합에 맞는 '오늘의 글감'을 결정론적으로 반환
// 같은 날, 같은 카테고리라면 항상 같은 글감이 노출된다 (새로고침해도 유지)
export function getPromptForDate(date: Date, category: Category): WritingPrompt {
  const pool = PROMPTS.filter((p) => p.category === category)
  const index = dayOfYear(date) % pool.length
  return pool[index]
}

export const CATEGORIES: Category[] = ['에세이', '상상/소설', '자기계발', '비평', '자유주제']
