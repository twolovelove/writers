import type { Category } from '../types'
import { CATEGORIES } from '../data/prompts'

interface Props {
  selected: Category
  onSelect: (category: Category) => void
}

// 상단의 카테고리 선택 UI: 에세이 / 상상·소설 / 자기계발 / 비평
export function CategorySelector({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const isActive = category === selected
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={[
              'rounded-full px-5 py-2 text-sm tracking-wide transition-all duration-200',
              isActive
                ? 'bg-accent-indigo text-paper shadow-card'
                : 'bg-transparent text-ink-soft hover:bg-paper-cream hover:text-ink',
            ].join(' ')}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
