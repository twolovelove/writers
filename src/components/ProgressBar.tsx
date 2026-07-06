interface Props {
  progress: number // 0-100
  isGoalMet: boolean
}

// 목표 글자 수(1,000자) 달성률을 은은한 액센트 컬러로 표시하는 얇은 진행 바
export function ProgressBar({ progress, isGoalMet }: Props) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-line">
      <div
        className={[
          'h-full rounded-full transition-all duration-500 ease-out',
          isGoalMet ? 'bg-accent-green' : 'bg-accent-indigo',
        ].join(' ')}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
